import { Block, IconButton } from '@shared'
import deleteIcon from '@/assets/icons/deletIcon.svg'
import plusIcon from '@/assets/icons/plusIcon.svg'
import modalService from '@/shared/core/modalService/modalService.ts'
import AddUserModalContent from '@/features/chatList/chat/chatModalConent/ModalConent.ts'

type TFriendControlDropDownProps = {
  isOpen: boolean
  chatId: string | null
  onAddClick?: () => void
  onDeleteClick?: () => void
}

type TFriendControlDropDownChildren = {
  AddUserButton: IconButton
  DeleteUserButton: IconButton
}

export default class FriendControlDropDown extends Block<
  TFriendControlDropDownProps,
  TFriendControlDropDownChildren
> {
  constructor(props: TFriendControlDropDownProps) {
    const AddUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault()
        props.onAddClick?.()
        modalService.open(AddUserModalContent, {
          chatId: props.chatId ?? '',
          isAdd: true,
          onDone: () => modalService.close(),
        })
      },
      buttonIcon: plusIcon,
      alt: 'Иконка добавления',
    })

    const DeleteUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault()
        props.onDeleteClick?.()
        modalService.open(AddUserModalContent, {
          chatId: props.chatId ?? '',
          isAdd: false,
          onDone: () => modalService.close(),
        })
      },
      buttonIcon: deleteIcon,
      alt: 'Иконка удаления',
    })

    super('div', {
      ...props,
      className: 'friend-controls',
      AddUserButton,
      DeleteUserButton,
    })
  }

  override componentDidMount(): void {
    this.updateVisibility(this.props.isOpen)
  }

  override componentDidUpdate(
    _oldProps: TFriendControlDropDownProps,
    newProps: TFriendControlDropDownProps,
  ): boolean {
    this.updateVisibility(newProps.isOpen)
    return true
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide()
  }

  override render(): string {
    return `
      <div class="friend-controls__option">
        {{{ AddUserButton }}}
        <p>Добавить пользователя</p>
      </div>
      <div class="friend-controls__option">
        {{{ DeleteUserButton }}}
        <p>Удалить пользователя</p>
      </div>
    `
  }
}
