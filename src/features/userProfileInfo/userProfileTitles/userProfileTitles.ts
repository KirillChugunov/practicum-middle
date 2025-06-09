import { Block } from '@shared';
import modalService from '@/shared/core/modalService/modalService.ts';
import UserProfileAvatarUpdateContent from '@/features/userProfileInfo/userProfileAvatarUpdate/ModalConent.ts';
import userStore from '@/store/userStore/userStore.ts';

export type TUserProfileTitles = {
  name: string;
};

export default class UserProfileTitles extends Block {
  private unsubscribe: (() => void) | null = null;

  constructor(props: TUserProfileTitles) {
    super('section', {
      ...props,
      className: 'user_profile__title',
      profilePicture: userStore.getState().avatar,
      events: {
        click: (event: Event) => {
          const target = event.target as HTMLElement;
          const button = target.closest('.user-profile_button');
          if (button) {
            modalService.open(UserProfileAvatarUpdateContent, {
              isFileInput: true,
              isOpen: true,
              onDone: () => modalService.close(),
            });
          }
        },
      },
    });

    this.unsubscribe = userStore.subscribe((user) => {
      const name =
        user.display_name?.trim() ||
        `${user.first_name} ${user.second_name}`.trim();

      this.setProps({
        name,
        profilePicture: user.avatar,
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return `
      <button class="user-profile_button" type="button">
        <div class="overlay"></div>
        <img
          class="user-profile__picture"
          alt="изображение профиля"
          src="{{profilePicture}}"
        >
        <p class="text-overlay">Поменять аватар</p>
      </button>
      <h1>{{name}}</h1>
    `;
  }
}
