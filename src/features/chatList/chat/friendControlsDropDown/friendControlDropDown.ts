import { Block, IconButton } from '@shared'
import deleteIcon from '../../../../assets/icons/deletIcon.svg'
import plusIcon from '../../../../assets/icons/plusIcon.svg'

type TFriendControlDropDown = {
  isOpen:boolean
}
export default class FriendControlDropDown extends Block {
  constructor(props: TFriendControlDropDown) {
    super('div', {
      ...props,
      className: 'chat-section__title-wrapper',
      AddUserButton: new IconButton({
        onClick: () => console.log('test'),
        buttonIcon: plusIcon,
        alt: 'Иконка добавления',
      }),
      DeleteUserButton: new IconButton({
        onClick: () => console.log('test'),
        buttonIcon: deleteIcon,
        alt: 'Иконка удаления',
      }),
    })
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
      <div class="friend-controls">
        <div class="friend-controls__option">
          {{{ AddUserButton }}} 
          <p>Добавить пользователя</p>
        </div>
        <div class="friend-controls__option">
          {{{ DeleteUserButton }}} 
          <p>Удалить пользователя</p>
        </div>
      </div>
    `
  }
}
