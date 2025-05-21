import { contactListMock } from './mock.ts'
import { Block } from '@shared'
import { ChatCard } from '@/features'

export default class ContactList extends Block {
  constructor() {
    super('section', {
      className: 'contact-list',
      ChatCards: contactListMock.map(
        (card) =>
          new ChatCard({
            userName: card.userName,
            lastMessagePreview: card.lastMessagePreview,
            newMessageCount: card.newMessageCount,
            avatar: card.avatar,
          })
      ),
    })
  }

  public render(): string {
    return `
      <a class="contact-list__profile-link">
        <small>Профиль ></small>
      </a>
      <form>
        <input 
          class="contact-list__search-input" 
          placeholder="Поиск" 
          type="search"
        >
      </form>
      <div class="contact-list__contacts">
        {{#each ChatCards}}
          {{{ this }}}
        {{/each}}
      </div>
    `
  }
}
