import { Block } from '@shared'

export default class EmptyChat extends Block {
  constructor() {
    super('div', {
      className: 'chat-section__chat-window-empty',
    })
  }

  public render(): string {
    return `
      <small>Выберите чат, чтобы отправить сообщение</small>
    `
  }
}
