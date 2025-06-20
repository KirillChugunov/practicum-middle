import { Block, IconButton } from '@shared'
import { ChatAvatar } from '@/features'
import FriendControlDropDown from '@/features/chatList/chat/friendControlsDropDown/friendControlDropDown.ts'
import chatStore from '@/store/chatStore/chatStore.ts'
import defaultChatAvatar from '@/assets/icons/chatListAvatar.svg'
import moreIcon from '@/assets/icons/moreIcon.svg'

type TChatTitleProps = {
  chatId: string | null
  className?: string
  UserNames?: string
}

type TChatTitleChildren = {
  UserAvatars: ChatAvatar[]
  MoreButton: IconButton
  DropDown: FriendControlDropDown
}

export default class ChatTitle extends Block<
  TChatTitleProps,
  TChatTitleChildren
> {
  private unsubscribe: (() => void) | null = null
  private isFriendControlDropDownOpen = false

  constructor(props: TChatTitleProps) {
    const dropDown = new FriendControlDropDown({
      isOpen: false,
      chatId: props.chatId,
    })

    const moreButton = new IconButton({
      buttonIcon: moreIcon,
      alt: 'More icon',
      onClick: (e: Event): void => {
        e.preventDefault()
        this.toggleDropDown()
      },
    })

    super('div', {
      ...props,
      className: 'chat-section__title-wrapper',
      UserNames: '',
      DropDown: dropDown,
      MoreButton: moreButton,
      UserAvatars: [],
    })

    this.unsubscribe = chatStore.subscribe((state) => {
      const { chatId } = this.props
      if (!chatId) return

      const users = state.chatUserMap?.[chatId] ?? []

      this.children.UserAvatars = users.map((user) => {
        return new ChatAvatar({
          isTitle: true,
          avatar: user.avatar ?? defaultChatAvatar,
          className: 'chat-section__avatar',
        })
      })

      this.setProps({
        UserNames: users.map((u) => u.first_name).join(', '),
      })
    })

    if (props.chatId) {
      chatStore.fetchChatUsers(props.chatId)
    }
  }

  private toggleDropDown(): void {
    this.isFriendControlDropDownOpen = !this.isFriendControlDropDownOpen

    this.children.DropDown.setProps({
      isOpen: this.isFriendControlDropDownOpen,
      chatId: this.props.chatId,
    })
  }

  override componentDidUpdate(
    oldProps: TChatTitleProps,
    newProps: TChatTitleProps,
  ): boolean {
    if (oldProps.chatId !== newProps.chatId && newProps.chatId) {
      chatStore.fetchChatUsers(newProps.chatId)
      this.children.DropDown.setProps({ chatId: newProps.chatId })
    }

    return true
  }

  override destroy(): void {
    this.unsubscribe?.()
    super.destroy()
  }

  override render(): string {
    return `
      <div class="chat-section__titles">
        <div class="chat-section__avatars">
          {{{ UserAvatars }}}
        </div>
        <h2>{{ UserNames }}</h2>
        <div class="chat-section__options">
          {{{ MoreButton }}}
          {{{ DropDown }}}
        </div>
      </div>
    `
  }
}
