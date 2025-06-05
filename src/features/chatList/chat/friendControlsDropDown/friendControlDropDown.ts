import { Block, IconButton } from '@shared';
import deleteIcon from '../../../../assets/icons/deletIcon.svg';
import plusIcon from '../../../../assets/icons/plusIcon.svg';
import modalService from '@/shared/core/modalService/modalService.ts';
import AddUserModalContent from '@/features/chatList/chat/chatModalConent/ModalConent.ts';

type TFriendControlDropDown = {
  isOpen: boolean;
  chatId: string | null;
  onAddClick?: () => void;
  onDeleteClick?: () => void;
};

export default class FriendControlDropDown extends Block {
  constructor(props: TFriendControlDropDown) {
    super('div', {
      ...props,
      className: 'friend-controls',
    });

    const addUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault();
        console.log(this.props.chatId, 'ddchatId');
        modalService.open(AddUserModalContent, {
          chatId: this.props.chatId,
          isAdd: true,
          onDone: () => modalService.close(),
        });
      },
      buttonIcon: plusIcon,
      alt: 'Иконка добавления',
    });

    const deleteUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault();
        this.props.onDeleteClick?.();
      },
      buttonIcon: deleteIcon,
      alt: 'Иконка удаления',
    });

    this.children.AddUserButton = addUserButton;
    this.children.DeleteUserButton = deleteUserButton;
  }

  public componentDidMount(): void {
    this.updateVisibility(false);
  }

  public componentDidUpdate(
    _oldProps: TFriendControlDropDown,
    newProps: TFriendControlDropDown
  ): boolean {
    this.updateVisibility(newProps.isOpen);
    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  public render(): string {
    return `
      <div class="friend-controls__option">
        {{{ AddUserButton }}}
        <p>Добавить пользователя</p>
      </div>
      <div class="friend-controls__option">
        {{{ DeleteUserButton }}}
        <p>Удалить пользователя</p>
      </div>
    `;
  }
}
