import Store from '@/shared/core/store/store.ts'

type ChatMessage = {
  id: string
  time: string
  user_id: string
  content: string
  type: 'message' | 'file' | 'sticker' | 'user connected'
  file?: {
    id: number
    user_id: number
    path: string
    filename: string
    content_type: string
    content_size: number
    upload_date: string
  }
}

type ChatStoreState = {
  messages: ChatMessage[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export function createChatStore() {
  return new Store<ChatStoreState>({
    messages: [],
    isConnected: false,
    isLoading: true,
    error: null,
  })
}
