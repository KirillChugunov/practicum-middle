import { Block } from '@shared';
import { Chat, ContactList } from '@/features';

export default class ChatList extends Block {
  public currentChatId: number | null = null;
  public currentChatSpeakerUserName: string | null = null;
  public currentChatSpeakerAvatar: string | null = null;

  constructor() {
    const chat = new Chat({ chatId: null});

    const contactList = new ContactList({
      onChatSelect: (id: number, userName: string, avatar: string) => this.setChatInfo(id, userName,avatar ),
    });

    super('div', {
      className: 'chat-list',
      ContactList: contactList,
      Chat: chat,
    });
  }

  private setChatInfo(id: number, userName: string, avatar: string): void {
    this.currentChatId = id;
    this.currentChatSpeakerAvatar = userName;
    this.currentChatSpeakerUserName = avatar;

    if ( this.children.Chat instanceof Block )
    this.children.Chat.setProps({ chatId: id });
  }

  public render(): string {
    return `
      {{{ ContactList }}}
      {{{ Chat }}}
    `;
  }
}
