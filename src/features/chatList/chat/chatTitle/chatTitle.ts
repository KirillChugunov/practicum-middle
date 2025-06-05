import { Block, IconButton } from '@shared';
import { ChatAvatar } from '@/features';
import FriendControlDropDown from '@/features/chatList/chat/friendControlsDropDown/friendControlDropDown.ts';

type TChatUser = {
  first_name: string;
  avatar: string | null;
};

type TChatTitleProps = {
  users: TChatUser[];
  chatId: string | null;
};

export default class ChatTitle extends Block {
  private isFriendControlDropDownOpen = false;

  constructor(props: TChatTitleProps) {
    const avatars = props.users.map(
      (user) =>
        new ChatAvatar({
          avatar: user.avatar,
          className: 'chat-section__avatar',
        }),
    );

    const dropDown = new FriendControlDropDown({
      isOpen: false,
      chatId: props.chatId,
    });

    const moreButton = new IconButton({
      buttonIcon: './src/assets/icons/moreIcon.svg',
      alt: 'More icon',
      onClick: (e: Event) => {
        e.preventDefault();
        this.isFriendControlDropDownOpen = !this.isFriendControlDropDownOpen;
        if (this.children.DropDown instanceof Block) {
          this.children.DropDown.setProps({
            isOpen: this.isFriendControlDropDownOpen,
            chatId: this.props.chatId
          });
        }
      },
    });


    super('div', {
      ...props,
      className: 'chat-section__title-wrapper',
      UserAvatars: avatars,
      UserNames: props.users.map((u) => u.first_name).join(', '),
      DropDown: dropDown,
      MoreButton: moreButton,
    });
  }

  public componentDidUpdate(oldProps: TChatTitleProps, newProps: TChatTitleProps): boolean {
    if (oldProps.users !== newProps.users) {
      const avatars = newProps.users.map(
        (user) =>
          new ChatAvatar({
            avatar: user.avatar,
            className: 'chat-section__avatar',
          }),
      );

      this.setProps({
        UserAvatars: avatars,
        UserNames: newProps.users.map((u) => u.first_name).join(', '),
      });
    }
    if (oldProps.chatId !== newProps.chatId && this.children.DropDown instanceof Block) {
      this.children.DropDown.setProps({ chatId: newProps.chatId });
    }
    return true;
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
