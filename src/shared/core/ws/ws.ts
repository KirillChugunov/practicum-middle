import chatStore from '@/store/chatStore/chatStore.ts'
import userStore from '@/store/userStore/userStore.ts'
import Store from '@/shared/core/store/store.ts'

export type MessageType = 'message' | 'file' | 'sticker' | 'user connected' | 'pong';

export type TMessageFile = {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
};

export type ChatMessage = {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: Exclude<MessageType, 'pong'>;
  file?: TMessageFile;
};


type IncomingMessage =
  | { type: 'pong' }
  | { type: 'user connected'; content: string }
  | ChatMessage
  | ChatMessage[];

type OutgoingMessage =
  | { type: 'ping' }
  | { type: 'message'; content: string }
  | { type: 'file'; content: string }
  | { type: 'sticker'; content: string }
  | { type: 'get old'; content: string };

type ChatStoreState = {
  messages: Array<ChatMessage>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
};

function createChatStore(): Store<ChatStoreState> {
  return new Store<ChatStoreState>({
    messages: [],
    isConnected: false,
    isLoading: true,
    error: null,
  })
}

export class ChatWebSocket {
  public readonly store: Store<ChatStoreState>
  private socket!: WebSocket
  private pingIntervalId?: number

  constructor(private readonly chatId: string) {
    this.store = createChatStore()
    this.start()
  }

  private async start(): Promise<void> {
    const user = userStore.getState()

    if (!user?.id) {
      this.store.setState({ error: 'No user ID', isLoading: false })
      return
    }

    try {
      const token: string | null = await chatStore.getChatToken(this.chatId)
      if (!token) {
        this.store.setState({ error: 'Token is null', isLoading: false })
        return
      }

      const url = `wss://ya-praktikum.tech/ws/chats/${user.id}/${this.chatId}/${token}`
      this.socket = new WebSocket(url)

      this.socket.addEventListener('open', () => this.onOpen())
      this.socket.addEventListener('message', (event: MessageEvent<string>) =>
        this.onMessage(event),
      )
      this.socket.addEventListener('close', () => this.onClose())
      this.socket.addEventListener('error', (e: Event) => this.onError(e))
    } catch (err) {
      this.store.setState({ error: 'Token fetch failed', isLoading: false })
    }
  }

  private onOpen(): void {
    this.store.setState({ isConnected: true, isLoading: false, error: null })
    this.requestOldMessages()
    this.startPing()
  }

  private onMessage(event: MessageEvent<string>): void {
    try {
      const raw: IncomingMessage = JSON.parse(event.data)

      if (!Array.isArray(raw) && raw.type === 'pong') return

      const newMessages: ChatMessage[] = Array.isArray(raw)
        ? raw
        : [raw as ChatMessage]

      const prevMessages = this.store.getState().messages
      this.store.setState({ messages: [...prevMessages, ...newMessages] })
    } catch (err) {
      console.error('[WS PARSE ERROR]', err)
    }
  }

  private onClose(): void {
    this.stopPing()
    this.store.setState({ isConnected: false })
  }

  private onError(e: Event): void {
    console.error('[WS ERROR]', e)
    this.store.setState({ error: 'WebSocket error' })
  }

  private startPing(): void {
    this.pingIntervalId = window.setInterval(() => {
      this.send({ type: 'ping' })
    }, 10000)
  }

  private stopPing(): void {
    if (this.pingIntervalId !== undefined) {
      clearInterval(this.pingIntervalId)
      this.pingIntervalId = undefined
    }
  }

  public send(message: OutgoingMessage): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.warn('[WS] Cannot send, socket not open')
    }
  }

  public sendText(content: string): void {
    this.send({ type: 'message', content })
  }

  public sendFile(resourceId: string): void {
    this.send({ type: 'file', content: resourceId })
  }

  public async requestOldMessages(): Promise<void> {
    const chatId = Number(this.chatId)
    if (!chatId) return

    const totalUnread = await chatStore.fetchNewMessagesCount(chatId)
    const batchSize = 20
    if (totalUnread)
      for (let offset = 0; offset < totalUnread; offset += batchSize) {
        this.send({
          type: 'get old',
          content: String(offset),
        })
      }
  }

  public close(): void {
    this.socket?.close()
    this.stopPing()
    this.store.setState({ isConnected: false })
  }
}
