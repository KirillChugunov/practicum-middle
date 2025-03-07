import { Block } from '@shared'
import { ChatAvatar } from '@/features'

type TChatCard = {
  userName: string
  avatar: string
  lastMessagePreview: {
    owner: string
    message: string
    timeStamp: string
  }
  newMessageCount: string
}

export default class ChatCard extends Block {
  constructor(props: TChatCard) {
    super('div', {
      ...props,
      className: 'chatCard',
      ChatAvatar: new ChatAvatar({
        avatar: props.avatar,
      }),
      userName: props.userName,
      lastMessagePreview: props.lastMessagePreview,
      newMessageCount: props.newMessageCount,
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
