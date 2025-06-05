import { Block, Button, InputField } from '@shared';
import EventBus from '@/shared/core/eventBus/eventBus.ts';
import chatStore from '@/store/chatStore/chatStore.ts';

export default class EmptyChat extends Block {
  constructor() {
    const eventBus = new EventBus<'submit'>()

    super('form', {
      className: 'chat-section__chat-window-empty-form',
      TitleInput: new InputField({
        label: 'Название чата',
        name: 'title',
        type: 'text',
        eventBus,
        onBlur: () => {
        },
      }),
      SubmitButton: new Button({
        label: 'Создать чат',
        type: 'submit',
        variant: 'primary',
        onClick: async (e: Event) => {
          e.preventDefault()

          const inputElement = this.getContent()?.querySelector(
            'input[name="title"]',
          ) as HTMLInputElement | null

          const title = inputElement?.value.trim()
          if (title) {
            await chatStore.createChat(title)
          }
        },
      }),
    })

  }

  render(): string {
    return `
      <div class="chat-section__chat-window-empty-inner">
        {{{ TitleInput }}}
        {{{ SubmitButton }}}
      </div>
    `;
  }
}
