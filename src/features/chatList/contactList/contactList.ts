import { Block } from '@shared'
import chatStore from '@/store/chatStore/chatStore.ts'
import { ChatCard } from '@/features'
import { formatTime } from '@/shared/utils/timeTrimmer.ts'
import SearchInputField from '@/features/chatList/contactList/searchImput/searchInput.ts'

type TContactListProps = {
  onChatSelect: (
    chatId: number,
    userName: string,
    avatar: string | null,
  ) => void
  className?: string
}

type TContactListChildren = {
  SearchInput: SearchInputField
  ChatCards?: ChatCard[]
}

export default class ContactList extends Block<
  TContactListProps,
  TContactListChildren
> {
  private unsubscribe?: () => void

  constructor(props: TContactListProps) {
    const searchInput = new SearchInputField({
      label: '',
      name: 'search',
      placeHolder: 'Поиск',
      onSearch: (value: string): void => {
        chatStore.fetchChats(undefined, undefined, value || undefined)
      },
    })

    super('section', {
      ...props,
      SearchInput: searchInput,
      className: 'contact-list',
    })
  }

  override async componentDidMount(): Promise<void> {
    this.unsubscribe = chatStore.subscribe(() => this.updateChatCards())

    await chatStore.fetchChats()
    this.updateChatCards()
  }

  override destroy(): void {
    this.unsubscribe?.()
    super.destroy()
  }

  private updateChatCards(): void {
    const state = chatStore.getState()
    this.children.ChatCards = state.chats.map((chat) => {
      return new ChatCard({
        userName: chat.title,
        avatar: chat.avatar,
        lastMessagePreview: {
          owner: chat.last_message?.user?.first_name,
          message: chat.last_message?.content,
          timeStamp: chat.last_message?.time
            ? formatTime(chat.last_message.time)
            : 'сообщений нет',
        },
        newMessageCount: String(chat.unread_count ?? 0),
        chatId: String(chat.id),
        onClick: () => {
          chatStore.selectChat(chat.id)
          this.props.onChatSelect(chat.id, chat.title, chat.avatar)
        },
      })
    })

    this.forceUpdate()
  }

  override render(): string {
    return `
      <a class="contact-list__profile-link" href="/userprofile">
        <small>Профиль ></small>
      </a>
      <div class="contact-list__search">
        {{{ SearchInput }}}
      </div>
      <div class="contact-list__contacts">
        {{{ ChatCards }}}
      </div>
    `
  }
}
