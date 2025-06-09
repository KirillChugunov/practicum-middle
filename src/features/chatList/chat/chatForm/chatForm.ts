import { Block, FormManager, IconButton, Input } from '@shared'
import { ChatWebSocket } from '@/shared/core/ws/ws.ts'

type ChatFormProps = {
  chatWS?: ChatWebSocket
}

type ChatFormChildren = {
  ChatInput: Input
  SentButton: IconButton
}

export default class ChatForm extends Block<ChatFormProps, ChatFormChildren> {
  private chatWS?: ChatWebSocket

  constructor(props: ChatFormProps) {
    const formManager = new FormManager()

    const ChatInput = new Input({
      className: 'chat-section__input',
      placeholder: 'Сообщение',
      name: 'message',
      events: {
        blur: (e: Event) => {
          formManager.validateField(e, ChatInput)
        },
        input: (e: Event) => {
          formManager.validateField(e, ChatInput)
        },
      },
    })

    const SentButton = new IconButton({
      buttonIcon: './src/assets/icons/arrow.svg',
      alt: 'Send icon',
      direction: 'right',
      attrs: {
        type: 'submit',
      },
      onClick: (e: Event): void => {
        e.preventDefault()
        this.eventBus().emit('submit')
      },
    })

    super('form', {
      className: 'chat-section__form',
      ChatInput,
      SentButton,
      chatWS: props.chatWS,
      events: {
        submit: (e: SubmitEvent): void => {
          e.preventDefault()
          this.eventBus().emit('submit')
        },
      },
    })

    this.chatWS = props.chatWS

    this.eventBus().on('submit', () => {
      const message = formManager.getState().formState.message?.trim()
      if (message && this.chatWS) {
        this.chatWS.sendText(message)

        const inputEl =
          this.children.ChatInput.getContent() as HTMLInputElement | null
        if (inputEl) {
          inputEl.value = ''
        }
      }
    })
  }
  componentDidUpdate(
    oldProps: ChatFormProps,
    newProps: ChatFormProps,
  ): boolean {
    if (oldProps.chatWS !== newProps.chatWS) {
      this.chatWS = newProps.chatWS
    }
    return true
  }

  override render(): string {
    return `
      {{{ ChatInput }}}
      {{{ SentButton }}}
    `
  }
}
