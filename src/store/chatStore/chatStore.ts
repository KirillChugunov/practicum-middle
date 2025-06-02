import Store from '@/shared/core/store/store.ts'
import httpTransport from '@/shared/core/api/HTTPTransport'
import { apiConfig } from '@/shared/constants/api'

export type TChat = {
  id: number
  title: string
  avatar: string | null
  unread_count: number
  created_by: number
  last_message: {
    user: {
      first_name: string
      second_name: string
      avatar: string | null
      email: string
      login: string
      phone: string
    }
    time: string
    content: string
  } | null
}
export type TChatStore = {
  chats: TChat[]
  chatUsers: any[]
  selectedChatId: number | null
  isLoading: boolean
  error: string | null
}

const initialState: TChatStore = {
  chats: [],
  chatUsers: [],
  selectedChatId: null,
  isLoading: false,
  error: null,
}

class ChatStore extends Store<TChatStore> {
  constructor() {
    super(initialState)
  }

  private setLoading(value: boolean) {
    this.setState({ ...this.getState(), isLoading: value })
  }

  private setError(error: string | null) {
    this.setState({ ...this.getState(), error })
  }

  async fetchChats(offset?: number, limit?: number, title?: string): Promise<void> {
    this.setLoading(true)
    this.setError(null)
    try {
      const params = new URLSearchParams()
      if (offset !== undefined) params.append('offset', String(offset))
      if (limit !== undefined) params.append('limit', String(limit))
      if (title) params.append('title', title)

      const res = await httpTransport.get(`${apiConfig.getChats}?${params.toString()}`)
      const chats = JSON.parse(res.responseText) as TChat[]
      console.log(chats);
      this.setState({ ...this.getState(), chats })
    } catch (e: any) {
      this.setError(e?.message ?? 'Ошибка загрузки чатов')
    } finally {
      this.setLoading(false)
    }
  }

  async createChat(title: string) {
    try {
      await httpTransport.post(apiConfig.createChat, {
        data: { title },
      })
      await this.fetchChats()
    } catch (e) {
      console.error('Ошибка при создании чата:', e)
    }
  }

  async deleteChat(chatId: string) {
    try {
      await httpTransport.delete(apiConfig.deleteChat, {
        data: { chatId },
      })
      await this.fetchChats()
    } catch (e) {
      console.error('Ошибка при удалении чата:', e)
    }
  }

  async addUsersToChat(chatId: string, users: string) {
    try {
      await httpTransport.put(apiConfig.addUsersToChat, {
        data: { users, chatId },
      })
      await this.fetchChatUsers(chatId)
    } catch (e) {
      console.error('Ошибка при добавлении пользователей:', e)
    }
  }

  async removeUsersFromChat(chatId: string, users: string) {
    try {
      await httpTransport.delete(apiConfig.removeUsersFromChat, {
        data: { users, chatId },
      })
      await this.fetchChatUsers(chatId)
    } catch (e) {
      console.error('Ошибка при удалении пользователей:', e)
    }
  }

  async fetchChatUsers(chatId: string) {
    try {
      const res = await httpTransport.get(apiConfig.getChatUsers(chatId))
      const users = JSON.parse(res.responseText)
      this.setState({ ...this.getState(), chatUsers: users })
    } catch (e) {
      console.error('Ошибка при загрузке пользователей чата:', e)
    }
  }

  async updateChatAvatar(formData: FormData) {
    try {
      await httpTransport.put(apiConfig.updateChatAvatar, {
        data: formData,
        headers: {}, // FormData сам выставит multipart/form-data
      })
      await this.fetchChats()
    } catch (e) {
      console.error('Ошибка при обновлении аватара:', e)
    }
  }

  async getChatToken(chatId: string): Promise<string | null> {
    try {
      const res = await httpTransport.post(apiConfig.getChatToken(chatId))
      const { token } = JSON.parse(res.responseText)
      return token
    } catch (e) {
      console.error('Ошибка при получении токена:', e)
      return null
    }
  }

  selectChat(chatId: number) {
    this.setState({ ...this.getState(), selectedChatId: chatId })
  }

  resetStore() {
    this.setState(initialState)
  }
}

const chatStore = new ChatStore()
export default chatStore
