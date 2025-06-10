import { Block, IconButton } from '@shared'
import {
  ChatTitle,
  EmptyChat,
  Message,
  ChatForm,
  AddFileDropDown,
} from '@/features'
import { ChatMessage, ChatWebSocket } from '@/shared/core/ws/ws.ts'
import userStore from '@/store/userStore/userStore.ts'
import chatStore from '@/store/chatStore/chatStore.ts'
import { errorToast } from '@/shared/ui/errorToast/errorToast.ts'

type ChatProps = {
  chatId: string | null
  chat: boolean
}

type ChatChildren = {
  ChatTitle: ChatTitle
  EmptyChat: EmptyChat
  ChatForm: ChatForm
  AddFileDropDown: AddFileDropDown
  AddButton: IconButton
  Messages?: Block[]
}

export default class Chat extends Block<ChatProps, ChatChildren> {
  private chatWS?: ChatWebSocket
  private unsubscribe?: () => void
  private isFileDropDownOpen = false

  constructor(props: { chatId: string | null }) {
    const chatId = props.chatId
    const isActive = Boolean(chatId)

    const addFileDropDown = new AddFileDropDown({
      isOpen: false,
      chatWS: undefined,
    })

    const addButton = new IconButton({
      buttonIcon: './src/assets/icons/clip.svg',
      alt: 'Attachment icon',
      onClick: (e: Event) => {
        errorToast.showToast('Что-то пошло не так 😢')
        e.preventDefault()
        this.toggleDropDown()
      },
    })

    super('section', {
      chatId,
      chat: isActive,
      className: 'chat-section',
      ChatTitle: new ChatTitle({ chatId }),
      ChatForm: new ChatForm({ chatWS: undefined }),
      EmptyChat: new EmptyChat(),
      AddFileDropDown: addFileDropDown,
      AddButton: addButton,
    })

    if (isActive && chatId) {
      this.connectToChat(chatId)
    }
  }

  override componentDidUpdate(
    oldProps: ChatProps,
    newProps: ChatProps,
  ): boolean {
    const chatChanged = newProps.chatId && newProps.chatId !== oldProps.chatId

    if (chatChanged) {
      this.setProps({ chat: true })

      this.children.ChatTitle.setProps({ chatId: newProps.chatId })

      if (newProps.chatId) {
        this.connectToChat(newProps.chatId)
      }
    }

    return true
  }

  private toggleDropDown(): void {
    this.isFileDropDownOpen = !this.isFileDropDownOpen
    this.children.AddFileDropDown.setProps({
      isOpen: this.isFileDropDownOpen,
    })
  }

  private async connectToChat(chatId: string): Promise<void> {
    this.chatWS?.close()
    this.unsubscribe?.()

    this.chatWS = new ChatWebSocket(chatId)

    this.children.ChatForm.setProps({ chatWS: this.chatWS })
    this.children.AddFileDropDown.setProps({ chatWS: this.chatWS })

    this.unsubscribe = this.chatWS.store.subscribe((state) => {
      const currentUserId = userStore.getState().id
      const messages = state.messages
        .map((msg: ChatMessage) => {
          try {
            return new Message({
              type: msg.type,
              owner: msg.user_id === currentUserId ? 'me' : 'partner',
              text: msg.content,
              file: msg.file,
              timeStamp: msg.time,
            })
          } catch (err) {
            console.error('[Message render error]', err)
            return null
          }
        })
        .filter((msg): msg is Message => msg !== null) as Block[]

      this.children.Messages = messages
      this.forceUpdate()
    })

    await chatStore.fetchChatUsers(chatId)

    this.children.ChatTitle.setProps({ chatId })
  }

  override render(): string {
    return `
      {{#if chat}}
        {{{ ChatTitle }}}
        <div class="chat-section__chat-container">
          <div class="chat-section__message-list">
            {{{ Messages }}}
          </div>
          {{{ AddFileDropDown }}}
          <div class="chat-section__form-container">
            {{{ AddButton }}}
            {{{ ChatForm }}}
          </div>
        </div>
      {{else}}
        {{{ EmptyChat }}}
      {{/if}}
    `
  }
}
