import { Block, IconButton } from '@shared';
import { ChatAvatar } from '@/features';
import FriendControlDropDown from '@/features/chatList/chat/friendControlsDropDown/friendControlDropDown.ts';

type TChatUser = {
  first_name: string;
  avatar: string | null;
};

type TChatTitleProps = {
  users: TChatUser[];
};

export default class ChatTitle extends Block {
  public isFriendControlDropDownOpen: boolean = false;

  constructor(props: TChatTitleProps) {
    const avatars = props.users.map(
      (user, i) =>
        new ChatAvatar({
          avatar: user.avatar,
          className: 'chat-section__avatar',
        }),
    );

    super('div', {
      ...props,
      className: 'chat-section__title-wrapper',
      UserAvatars: avatars,
      UserNames: props.users.map((u) => u.first_name).join(', '),
      DropDown: new FriendControlDropDown({ isOpen: false }),
      MoreButton: new IconButton({
        buttonIcon: './src/assets/icons/moreIcon.svg',
        alt: 'More icon',
        onClick: (e: Event) => this.toggleDropDown(e),
      }),
    });
  }

  private toggleDropDown(e: Event): void {
    e.preventDefault();
    this.isFriendControlDropDownOpen = !this.isFriendControlDropDownOpen;
    if (this.children.DropDown instanceof Block) {
      this.children.DropDown.setProps({
        isOpen: this.isFriendControlDropDownOpen,
      });
    }
  }

  public render(): string {
    return `
      <div class="chat-section__titles">
        <div class="chat-section__avatars">
          {{#each UserAvatars}} {{{ this }}} {{/each}}
        </div>
        <h2>{{ UserNames }}</h2>
        <div class="chat-section__options">
          {{{ MoreButton }}}
          {{{ DropDown }}}
        </div>
      </div>
    `;
  }
}
