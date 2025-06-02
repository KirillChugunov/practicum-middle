import { Block, IconButton } from '@shared';
import deleteIcon from '../../../../assets/icons/deletIcon.svg';
import plusIcon from '../../../../assets/icons/plusIcon.svg';

type TFriendControlDropDown = {
  isOpen: boolean;
  chatId: string;
  onAddClick: () => void;
  onDeleteClick: () => void;
};

export default class FriendControlDropDown extends Block {
  constructor(props: TFriendControlDropDown) {
    const addUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault();
        props.onAddClick();
      },
      buttonIcon: plusIcon,
      alt: 'Иконка добавления',
    });

    const deleteUserButton = new IconButton({
      onClick: (e: Event) => {
        e.preventDefault();
        props.onDeleteClick();
      },
      buttonIcon: deleteIcon,
      alt: 'Иконка удаления',
    });

    super('div', {
      ...props,
      className: 'friend-controls',
      AddUserButton: addUserButton,
      DeleteUserButton: deleteUserButton,
    });
  }

  public componentDidMount(): void {
    this.updateVisibility(false);
  }

  public componentDidUpdate(_oldProps: TFriendControlDropDown, newProps: TFriendControlDropDown): boolean {
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
