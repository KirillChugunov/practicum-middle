import chatStore from '@/store/chatStore/chatStore.ts';
import { Block } from '@shared';
import { ChatCard } from '@/features';
import { formatTime } from '@/shared/utils/timeTrimmer.ts';
import SearchInputField from '@/features/chatList/contactList/searchImput/searchInput.ts'

type TContactListProps = {
  onChatSelect: (chatId: number, userName: string, avatar: string) => void;
};

export default class ContactList extends Block {
  private unsubscribe?: () => void;

  constructor(props: TContactListProps) {
    super('section', {
      ...props,
      className: 'contact-list',
      SearchInput: new SearchInputField({
        label: '',
        name: 'search',
        placeHolder: 'Поиск',
        onSearch: (value: string) => {
          chatStore.fetchChats(undefined, undefined, value || undefined);
        },
      }),
    });
  }

  async componentDidMount(): Promise<void> {
    this.unsubscribe = chatStore.subscribe(() => {
      this.updateChatCards();
    });

    await chatStore.fetchChats();
    this.updateChatCards();
  }

  private updateChatCards(): void {
    const state = chatStore.getState();

    this.children.ChatCards = state.chats.map((chat) =>
      new ChatCard({
        userName: chat.title,
        lastMessagePreview: {
          owner: chat.last_message?.user?.first_name,
          message: chat.last_message?.content,
          timeStamp: chat.last_message?.time
            ? formatTime(chat.last_message.time)
            : 'сообщений нет',
        },
        newMessageCount: String(chat.unread_count ?? 0),
        avatar: chat.avatar,
        onClick: () => {
          this.props.onChatSelect(chat.id, chat.title, chat.avatar);
        },
      })
    );

    this.forceUpdate();
  }

  public componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  public render(): string {
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
    `;
  }
}
