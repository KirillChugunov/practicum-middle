import { Block } from '@shared'
import { ChatAvatar } from '@/features'

type TChatCard = {
  userName: string | undefined
  avatar: string | null
  lastMessagePreview: {
    owner: string | undefined
    message: string | undefined
    timeStamp: string | undefined
  } | undefined
  newMessageCount: string | undefined
}

export default class ChatCard extends Block {
  constructor(props: TChatCard & { onClick: () => void }) {
    super('div', {
      ...props,
      className: 'chatCard',
      events: {
        click: props.onClick, // 👈 ВАЖНО!
      },
      ChatAvatar: props.avatar && new ChatAvatar({
        avatar: props.avatar,
      }),
    })
  }

  public render(): string {
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
          <small class="chatCard__notification-text">{{newMessageCount}}</small>
        </div>
      </div>
    `
  }
}
