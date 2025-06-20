import Store from '@/shared/core/store/store.ts'
import httpTransport from '@/shared/core/api/HTTPTransport'
import { apiConfig } from '@/shared/constants/api'
import defaultChatAvatar from '@/assets/icons/chatListAvatar.svg'
import { errorToast } from '@/shared/ui/errorToast/errorToast.ts'

export type TChatUser = {
  id: number
  first_name: string
  second_name: string
  avatar: string | null
  email: string
  login: string
  phone: string
}

export type TChat = {
  id: number
  title: string
  avatar: string
  unread_count: number
  created_by: number
  last_message: {
    user: TChatUser
    time: string
    content: string
  } | null
}

export type TChatStore = {
  chats: TChat[]
  chatUsers: TChatUser[]
  chatUserMap: Record<string, TChatUser[]>
  selectedChatId: number | null
  isLoading: boolean
  error: string | null
}

const initialState: TChatStore = {
  chats: [],
  chatUsers: [],
  chatUserMap: {},
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

      const normalizedChats = chats.map(chat => ({
        ...chat,
        avatar: chat.avatar
          ? `https://ya-praktikum.tech/api/v2/resources${chat.avatar}`
          : defaultChatAvatar,
      }))

      this.setState({ ...this.getState(), chats: normalizedChats })
    } catch (e: any) {
      const msg = e?.message ?? 'Ошибка загрузки чатов'
      this.setError(msg)
      errorToast.showToast(msg)
    } finally {
      this.setLoading(false)
    }
  }

  async fetchChatUsers(chatId: string): Promise<TChatUser[]> {
    try {
      const res = await httpTransport.get(apiConfig.getChatUsers(chatId))
      const users = JSON.parse(res.responseText) as TChatUser[]

      const normalizedUsers = users.map(user => ({
        ...user,
        avatar: user.avatar
          ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
          : defaultChatAvatar,
      }))

      this.setState({
        ...this.getState(),
        chatUserMap: {
          ...this.getState().chatUserMap,
          [chatId]: normalizedUsers,
        },
        chatUsers: normalizedUsers,
      })

      return normalizedUsers
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при загрузке пользователей чата: ${message}`)
      return []
    }
  }

  async updateChatAvatar(formData: FormData): Promise<void> {
    try {
      await httpTransport.put(apiConfig.updateChatAvatar, { data: formData })
      await this.fetchChats()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при обновлении аватара чата: ${message}`)
    }
  }

  async getChatToken(chatId: string): Promise<string | null> {
    try {
      const res = await httpTransport.post(apiConfig.getChatToken(chatId))
      const { token } = JSON.parse(res.responseText)
      return token
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при получении токена: ${message}`)
      return null
    }
  }

  async createChat(title: string): Promise<number | null> {
    this.setLoading(true)
    this.setError(null)

    try {
      const res = await httpTransport.post(apiConfig.createChat, {
        data: { title },
      })

      const { id } = JSON.parse(res.responseText)
      await this.fetchChats()
      return id
    } catch (e: any) {
      const msg = e?.message ?? 'Ошибка создания чата'
      this.setError(msg)
      errorToast.showToast(msg)
      return null
    } finally {
      this.setLoading(false)
    }
  }

  async searchUserByLogin(login: string): Promise<TChatUser[] | null> {
    this.setLoading(true)
    this.setError(null)

    try {
      const res = await httpTransport.post(apiConfig.searchUser, {
        data: { login },
      })

      return JSON.parse(res.responseText)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка поиска пользователя'
      this.setError(msg)
      errorToast.showToast(msg)
      return null
    } finally {
      this.setLoading(false)
    }
  }

  selectChat(chatId: number) {
    this.setState({ ...this.getState(), selectedChatId: chatId })
  }

  resetStore() {
    this.setState(initialState)
  }

  async uploadFile(file: File): Promise<{ id: number; path: string } | null> {
    const formData = new FormData()
    formData.append('resource', file)

    try {
      const res = await httpTransport.post(apiConfig.uploadFile, {
        data: formData,
      })

      return JSON.parse(res.responseText)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при загрузке файла: ${message}`)
      return null
    }
  }

  updateUnreadCount(chatId: number) {
    const updatedChats = this.getState().chats.map(chat =>
      chat.id === chatId ? { ...chat, unread_count: 0 } : chat,
    )
    this.setState({ ...this.getState(), chats: updatedChats })
  }

  async fetchNewMessagesCount(chatId: number): Promise<number | null> {
    try {
      const res = await httpTransport.get(
        `${apiConfig.getNewMessagesCount}/${chatId}`,
      )
      const { unread_count } = JSON.parse(res.responseText)
      this.updateUnreadCount(chatId)
      return unread_count
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при получении количества новых сообщений: ${message}`)
      return null
    }
  }

  async addUsersToChat(users: number[]): Promise<void> {
    const chatId = this.getState().selectedChatId
    if (!chatId) {
      errorToast.showToast('Чат не выбран')
      return
    }

    try {
      await httpTransport.put(apiConfig.addUsersToChat, {
        data: { users, chatId },
      })
      await this.fetchChatUsers(String(chatId))
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при добавлении пользователей: ${message}`)
    }
  }

  async removeUsersFromChat(users: number[]) {
    const chatId = this.getState().selectedChatId
    if (!chatId) {
      errorToast.showToast('Чат не выбран')
      return
    }

    try {
      await httpTransport.delete(apiConfig.removeUsersFromChat, {
        data: { users, chatId },
      })
      await this.fetchChatUsers(String(chatId))
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errorToast.showToast(`Ошибка при удалении пользователей: ${message}`)
    }
  }
}

const chatStore = new ChatStore()
export default chatStore
