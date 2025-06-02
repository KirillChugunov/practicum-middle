import { Block } from '@shared';
import { ChatTitle, EmptyChat, Message, ChatForm } from '@/features';
import { ChatWebSocket } from '@/shared/core/ws/ws.ts';
import userStore from '@/store/userStore/userStore.ts';
import chatStore from '@/store/chatStore/chatStore.ts';

type TChat = {
  chatId: string | null;
};

export default class Chat extends Block {
  private chatWS?: ChatWebSocket;
  private unsubscribe?: () => void;

  constructor(props: TChat) {
    super('section', {
      ...props,
      className: 'chat-section',
      chat: !!props.chatId,
      EmptyChat: new EmptyChat(),
      ChatTitle: new ChatTitle({ users: [] }), // <- заглушка
      ChatForm: new ChatForm(),
    });

    if (props.chatId) {
      this.connect(props.chatId);
    }
  }

  public componentDidUpdate(oldProps: TChat, newProps: TChat): boolean {
    if (newProps.chatId && newProps.chatId !== oldProps.chatId) {
      this.connect(newProps.chatId);
      this.setProps({ chat: true });
    }
    return true;
  }

  private async connect(chatId: string) {
    this.chatWS?.close();
    this.unsubscribe?.();

    this.chatWS = new ChatWebSocket(chatId);

    this.unsubscribe = this.chatWS.store.subscribe((state) => {
      const currentUserId = userStore.getState().id;

      const messages = state.messages
        .map((msg) => {
          try {
            return new Message({
              type: msg.type,
              owner: msg.user_id === currentUserId ? 'me' : 'partner',
              text: msg.content,
              photo: msg.file?.path,
              timeStamp: msg.time,
            });
          } catch (err) {
            console.error('[Message render error]', err);
            return null;
          }
        })
        .filter((msg): msg is Block => msg !== null);

      this.children.Messages = messages;
      this.forceUpdate();
    });

    await chatStore.fetchChatUsers(chatId);
    const users = chatStore.getState().chatUsers;

    if (this.children.ChatTitle instanceof Block) {
      this.children.ChatTitle.setProps({ users });
    }
  }
  public render(): string {
    return `
      {{#if chat}}
        {{{ ChatTitle }}}
        <div class="chat-section__chat-container">
          <div class="chat-section__message-list">
            {{{ Messages }}}
          </div>
          {{{ ChatForm }}}
        </div>
      {{else}}
        {{{ EmptyChat }}}
      {{/if}}
    `;
  }
}
