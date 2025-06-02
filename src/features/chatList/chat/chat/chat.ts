import { Block, Modal } from '@shared';
import {
  ChatTitle,
  EmptyChat,
  Message,
  ChatForm,
} from '@/features';
import { ChatWebSocket } from '@/shared/core/ws/ws.ts';
import userStore from '@/store/userStore/userStore.ts';
import chatStore from '@/store/chatStore/chatStore.ts';
import { ChatModalContent } from '@/features/chatList/chat';

type TChat = {
  chatId: string | null;
};

export default class Chat extends Block {
  private chatWS?: ChatWebSocket;
  private unsubscribe?: () => void;
  private chatModal: Modal;

  constructor(props: TChat) {
    const isActive = !!props.chatId;

    const chatTitle = new ChatTitle({
      users: [],
      onAddClick: () => this.showModal(true),
      onDeleteClick: () => this.showModal(false),
    });

    const chatForm = new ChatForm();
    const emptyChat = new EmptyChat();

    const chatModal = new Modal({
      child: new ChatModalContent({
        chatId: '',
        isAdd: true,
        isOpen: false,
        onDone: () => chatModal.close(),
      }),
      onClose: () => chatModal.close(),
    });

    super('section', {
      ...props,
      className: 'chat-section',
      chat: isActive,
      ChatTitle: chatTitle,
      ChatForm: chatForm,
      EmptyChat: emptyChat,
    });

    this.chatModal = chatModal;

    if (props.chatId) {
      this.connect(props.chatId);
    }
  }

  public componentDidUpdate(oldProps: TChat, newProps: TChat): boolean {
    if (newProps.chatId && newProps.chatId !== oldProps.chatId) {
      this.setProps({ chat: true });

      if (this.children.ChatTitle instanceof Block) {
        this.children.ChatTitle.setProps({ chatId: newProps.chatId });
      }

      this.connect(newProps.chatId);
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
      console.log("users", users)
      this.children.ChatTitle.setProps({ users, chatId });
    }
  }

  private showModal(isAdd: boolean) {
    if (!this.props.chatId) return;

    const modalContent = new ChatModalContent({
      chatId: this.props.chatId,
      isAdd,
      isOpen: true,
      onDone: () => this.chatModal.close(),
    });

    this.chatModal.setProps({ child: modalContent });
    this.chatModal.open();
  }

  public componentWillUnmount(): void {
    this.chatWS?.close();
    this.unsubscribe?.();
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
