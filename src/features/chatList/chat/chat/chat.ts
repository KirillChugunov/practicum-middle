import { Block, Modal } from '@shared'
import {
  ChatTitle,
  EmptyChat,
  Message,
  ChatForm,
} from '@/features'
import { ChatWebSocket } from '@/shared/core/ws/ws.ts'
import userStore from '@/store/userStore/userStore.ts'
import chatStore from '@/store/chatStore/chatStore.ts'

type TChat = {
  chatId: string | null;
};

export default class Chat extends Block {
  private chatWS?: ChatWebSocket
  private unsubscribe?: () => void

  constructor(props: TChat) {
    const isActive = !!props.chatId

    const chatTitle = new ChatTitle({
      users: [],
      chatId: props.chatId
    })

    const chatForm = new ChatForm({
      chatWS: undefined
    });
    const emptyChat = new EmptyChat()

   super('section', {
      ...props,
      className: 'chat-section',
      chat: isActive,
      ChatTitle: chatTitle,
      ChatForm: chatForm,
      EmptyChat: emptyChat,
    })

    if (props.chatId) {
      this.connectToChat(props.chatId)
    }
  }

  public componentDidUpdate(oldProps: TChat, newProps: TChat): boolean {
    if (newProps.chatId && newProps.chatId !== oldProps.chatId) {
      this.setProps({ chat: true })

      if (this.children.ChatTitle instanceof Block) {
        this.children.ChatTitle.setProps({ chatId: newProps.chatId })
      }

      this.connectToChat(newProps.chatId)
    }

    return true
  }

  private async connectToChat(chatId: string) {
    this.chatWS?.close()
    this.unsubscribe?.()

    this.chatWS = new ChatWebSocket(chatId)

    if (this.children.ChatForm instanceof Block) {
      this.children.ChatForm.setProps({
        chatWS: this.chatWS
      });
    }

    this.unsubscribe = this.chatWS.store.subscribe((state) => {
      const currentUserId = userStore.getState().id

      const messages = state.messages
        .map((msg) => {
          try {
            return new Message({
              type: msg.type,
              owner: msg.user_id === currentUserId ? 'me' : 'partner',
              text: msg.content,
              photo: msg.file?.path,
              timeStamp: msg.time,
            })
          } catch (err) {
            console.error('[Message render error]', err)
            return null
          }
        })
        .filter((msg): msg is Block => msg !== null)

      this.children.Messages = messages
      this.forceUpdate()
    })

    await chatStore.fetchChatUsers(chatId)
    const users = chatStore.getState().chatUsers

    if (this.children.ChatTitle instanceof Block) {
      this.children.ChatTitle.setProps({ users, chatId })
    }
  }
  public componentWillUnmount(): void {
    this.chatWS?.close()
    this.unsubscribe?.()
  }

  public render(): string {
    return `
      {{#if chat}}
        {{{ ChatTitle }}}
        <div class="chat-section__chat-container">
          <div class="chat-section__message-list">
            {{{ Messages }}}
          </div>
          {{{ ChatForm }}}
        </div>
      {{else}}
        {{{ EmptyChat }}}
      {{/if}}
    `
  }
}
