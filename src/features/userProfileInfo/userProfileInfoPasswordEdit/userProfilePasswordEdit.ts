import { Block, Button } from '@shared';
import {
  UserProfileEditGoBack,
  UserProfilePasswordEditForm,
  UserProfileTitles,
} from '@/features';

type TUserProfilePasswordEditProps = Record<string, never>;

type TUserProfilePasswordEditChildren = {
  GoBackButton: UserProfileEditGoBack;
  ProfileTitles: UserProfileTitles;
  ButtonSubmitEdit: Button;
  UserProfilePasswordEdit: UserProfilePasswordEditForm;
};

export default class UserProfilePasswordEdit extends Block<
  TUserProfilePasswordEditProps,
  TUserProfilePasswordEditChildren
> {
  constructor() {
    super('div', {
      className: 'user-profile__container',
      GoBackButton: new UserProfileEditGoBack(),
      ProfileTitles: new UserProfileTitles({
        name: 'userName',
      }),
      ButtonSubmitEdit: new Button({
        label: 'Сохранить',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => {
          e.preventDefault();
          console.log(e.target);
        },
      }),
      UserProfilePasswordEdit: new UserProfilePasswordEditForm(),
    });
  }

  override render(): string {
    return `
      {{{ GoBackButton }}}
      <section class="user-profile__password-edit">
        {{{ ProfileTitles }}}
        {{{ UserProfilePasswordEdit }}}
      </section>
    `;
  }
}
