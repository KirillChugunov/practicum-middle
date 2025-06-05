import chatStore from '@/store/chatStore/chatStore.ts'
import userStore from '@/store/userStore/userStore.ts'
import Store from '@/shared/core/store/store.ts'

export type MessageType = 'message' | 'file' | 'sticker' | 'user connected' | 'pong';

export type ChatMessage = {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: Exclude<MessageType, 'pong'>;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
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
  messages: ChatMessage[];
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
  });
}

export class ChatWebSocket {
  public readonly store: Store<ChatStoreState>;
  private socket!: WebSocket;
  private pingIntervalId?: number;

  constructor(private chatId: string) {
    this.store = createChatStore();
    this.start();
  }

  private async start(): Promise<void> {
    const user = await userStore.getState();

    if (!user?.id) {
      this.store.setState({ error: 'No user ID', isLoading: false });
      return;
    }

    try {
      const token = await chatStore.getChatToken(this.chatId);
      const url = `wss://ya-praktikum.tech/ws/chats/${user.id}/${this.chatId}/${token}`;

      this.socket = new WebSocket(url);
      this.socket.addEventListener('open', () => this.onOpen());
      this.socket.addEventListener('message', (event) => this.onMessage(event));
      this.socket.addEventListener('close', () => this.onClose());
      this.socket.addEventListener('error', (e) => this.onError(e));
    } catch (err) {
      this.store.setState({ error: 'Token fetch failed', isLoading: false });
    }
  }

  private onOpen() {
    this.store.setState({ isConnected: true, isLoading: false, error: null });
    this.requestOldMessages(0);
    this.startPing();
  }

  private onMessage(event: MessageEvent) {
    try {
      const raw: IncomingMessage = JSON.parse(event.data);
      if (raw.type === 'pong') return;
      const newMessages: ChatMessage[] = Array.isArray(raw) ? raw : [raw as ChatMessage];

      const prev = this.store.getState().messages;
      this.store.setState({ messages: [...prev, ...newMessages] });
    } catch (err) {
      console.error('[WS PARSE ERROR]', err);
    }
  }

  private onClose() {
    this.stopPing();
    this.store.setState({ isConnected: false });
  }

  private onError(e: Event) {
    console.error('[WS ERROR]', e);
    this.store.setState({ error: 'WebSocket error' });
  }

  private startPing() {
    this.pingIntervalId = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 10000);
  }

  private stopPing() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = undefined;
    }
  }

  public send(message: OutgoingMessage) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[WS] Cannot send, socket not open');
    }
  }

  public sendText(content: string) {
    this.send({ type: 'message', content });
  }

  public sendFile(resourceId: string) {
    this.send({ type: 'file', content: resourceId });
  }

  public sendSticker(stickerId: string) {
    this.send({ type: 'sticker', content: stickerId });
  }

  public requestOldMessages(offset: number) {
    this.send({ type: 'get old', content: String(offset) });
  }

  public close() {
    this.socket?.close();
    this.stopPing();
    this.store.setState({ isConnected: false });
  }
}
