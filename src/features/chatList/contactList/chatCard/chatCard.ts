import { Block } from '@shared';
import { ChatAvatar } from '@/features';

type TLastMessagePreview = {
  owner?: string;
  message?: string;
  timeStamp?: string;
};

type TChatCardProps = {
  userName?: string;
  avatar: string | null;
  lastMessagePreview?: TLastMessagePreview;
  newMessageCount?: string;
  chatId: string;
  onClick: () => void;
};

type TChatCardChildren = {
  ChatAvatar?: ChatAvatar;
};

export default class ChatCard extends Block<TChatCardProps, TChatCardChildren> {
  constructor(props: TChatCardProps) {
    const children: TChatCardChildren = {};

    if (props.avatar) {
      children.ChatAvatar = new ChatAvatar({
        isTitle: false,
        avatar: props.avatar,
        chatId: props.chatId,
      });
    }

    super('div', {
      ...props,
      ...children,
      className: 'chatCard',
      events: {
        click: props.onClick,
      },
    });
  }

  render(): string {
    return `
      {{{ ChatAvatar }}}
      <div class="chatCard__info">
        <h2>{{userName}}</h2>
        <div class="chatCard__titles">
          <p>{{lastMessagePreview.owner}}</p>
          <small>{{lastMessagePreview.message}}</small>
        </div>
      </div>
      <div class="chatCard__notifications">
        <small>{{lastMessagePreview.timeStamp}}</small>
        <div class="chatCard__notification-container">
          <small class="chatCard__notification-text">
            {{newMessageCount}}
          </small>
        </div>
      </div>
    `;
  }
}
