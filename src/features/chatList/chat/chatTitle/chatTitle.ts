import { Block, IconButton } from '@shared'
import { ChatAvatar } from '@/features'
import FriendControlDropDown from '@/features/chatList/chat/friendControlsDropDown/friendControlDropDown.ts'

type TChatTitle = {
  partnerName: string
  PartnerAvatar: string
}

export default class ChatTitle extends Block {
  constructor(props: TChatTitle) {
    super('div', {
      ...props,
      className: 'chat-section__title-wrapper',
      partnerName: props.partnerName,
      PartnerAvatar: new ChatAvatar({
        avatar: props.PartnerAvatar,
      }),
      DropDown: new FriendControlDropDown(),
      MoreButton: new IconButton({
        buttonIcon: './src/assets/icons/moreIcon.svg',
        alt: 'More icon',
        onClick: () => console.log('test'),
      }),
    })
  }

  public render(): string {
    return `
      <div class="chat-section__titles">
        {{{ PartnerAvatar }}}
        <h2>{{ partnerName }}</h2>
        <div class="chat-section__options">
          {{{ MoreButton }}}
          {{{ DropDown }}}
        </div>
      </div>
    `
  }
}
