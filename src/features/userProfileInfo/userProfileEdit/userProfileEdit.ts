import { Block } from '@shared';
import {
  UserProfileEditForm,
  UserProfileEditGoBack,
  UserProfileTitles,
} from '@/features';

type TUserProfileEditProps = Record<string, never>;

type TUserProfileEditChildren = {
  GoBackButton: UserProfileEditGoBack;
  ProfileTitles: UserProfileTitles;
  UserProfileEditForm: UserProfileEditForm;
};

export default class UserProfileEdit extends Block<
  TUserProfileEditProps,
  TUserProfileEditChildren
> {
  constructor() {
    super('div', {
      className: 'user-profile__container',
      GoBackButton: new UserProfileEditGoBack(),
      ProfileTitles: new UserProfileTitles({
        name: 'userName',
      }),
      UserProfileEditForm: new UserProfileEditForm(),
    });
  }

  override render(): string {
    return `
      {{{ GoBackButton }}}
      <section class="user-profile__edit">
        {{{ ProfileTitles }}}
        {{{ UserProfileEditForm }}}
      </section>
    `;
  }
}
