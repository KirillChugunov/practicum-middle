import { Block } from '@shared'
import { Chat, ContactList } from '@/features'

type TChatListProps = Record<string, never>

type TChatListChildren = {
  ContactList: ContactList
  Chat: Chat
}

export default class ChatList extends Block<TChatListProps, TChatListChildren> {
  constructor() {
    const chat = new Chat({ chatId: null })

    const contactList = new ContactList({
      onChatSelect: (id: number) => {
        chat.setProps({ chatId: String(id) })
      },
    })

    super('div', {
      className: 'chat-list',
      ContactList: contactList,
      Chat: chat,
    })
  }

  override render(): string {
    return `
      {{{ ContactList }}}
      {{{ Chat }}}
    `
  }
}
