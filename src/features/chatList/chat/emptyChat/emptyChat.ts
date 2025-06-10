import { Block, Button, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import chatStore from '@/store/chatStore/chatStore.ts'

type TEmptyChatProps = {
  className?: string
}

type TEmptyChatChildren = {
  TitleInput: InputField
  SubmitButton: Button
}

export default class EmptyChat extends Block<
  TEmptyChatProps,
  TEmptyChatChildren
> {
  constructor() {
    const eventBus = new EventBus<'submit'>()

    const TitleInput = new InputField({
      label: 'Название чата',
      name: 'title',
      type: 'text',
      eventBus,
      onBlur: () => {},
    })

    const SubmitButton = new Button({
      label: 'Создать чат',
      type: 'submit',
      variant: 'primary',
      onClick: async (e: Event) => {
        e.preventDefault()

        const wrapper = TitleInput.getContent()
        const inputEl = wrapper?.querySelector(
          'input',
        ) as HTMLInputElement | null
        const title = inputEl?.value.trim()

        if (title) {
          await chatStore.createChat(title)
        }
      },
    })

    super('form', {
      className: 'chat-section__chat-window-empty-form',
      TitleInput,
      SubmitButton,
    })
  }

  render(): string {
    return `
      <div class="chat-section__chat-window-empty-inner">
        {{{ TitleInput }}}
        {{{ SubmitButton }}}
      </div>
    `
  }
}
