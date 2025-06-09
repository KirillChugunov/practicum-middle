import { Block, InputField } from '@shared';
import { UserProfileEditGoBack, UserProfileTitles } from '@/features';
import userStore, { TUser } from '@/store/userStore/userStore.ts';

export default class UserProfilePreview extends Block {

  constructor() {
    super('div', {
      className: 'user-profile__container',

      GoBackButton: new UserProfileEditGoBack(),

      ProfileTitles: new UserProfileTitles({
        name: 'userName',
      }),

      Email: new InputField({
        label: 'Почта',
        name: 'email',
        type: 'email',
        value: '',
        disabled: true,
        profile: true,
      }),

      Login: new InputField({
        label: 'Логин',
        name: 'login',
        type: 'text',
        value: '',
        disabled: true,
        profile: true,
      }),

      FirstName: new InputField({
        label: 'Имя',
        name: 'first_name',
        type: 'text',
        value: '',
        disabled: true,
        profile: true,
      }),

      SecondName: new InputField({
        label: 'Фамилия',
        name: 'second_name',
        type: 'text',
        value: '',
        disabled: true,
        profile: true,
      }),

      ChatName: new InputField({
        label: 'Имя в чате',
        name: 'display_name',
        type: 'text',
        value: '',
        disabled: true,
        profile: true,
      }),

      Phone: new InputField({
        label: 'Телефон',
        name: 'phone',
        type: 'tel',
        value: '',
        disabled: true,
        profile: true,
      }),
    });

    userStore.subscribe((user) => {
      this.updateFields(user);
    });
  }

  private updateFields(user: TUser): void {
    type InputFieldKeys = 'Email' | 'Login' | 'FirstName' | 'SecondName' | 'ChatName' | 'Phone';

    const update = (fieldKey: InputFieldKeys, value: string) => {
      const field = this.children[fieldKey];
      if (field instanceof InputField) {
        field.setProps({ value });
      }
    };

    update('Email', user.email);
    update('Login', user.login);
    update('FirstName', user.first_name);
    update('SecondName', user.second_name);
    update('ChatName', user.display_name ?? '');
    update('Phone', user.phone);
  }


  render(): string {
    return `
      {{{ GoBackButton }}}
      <section class="user-profile__info">
        {{{ ProfileTitles }}}
        <form class="user-profile-password-edit__grid">
          {{{ Email }}}
          {{{ Login }}}
          {{{ FirstName }}}
          {{{ SecondName }}}
          {{{ ChatName }}}
          {{{ Phone }}}
        </form>
        <section class="user-profile__grid user_profile__actions">
          <div class="user-profile__item"><a href="/userprofileedit">Изменить данные</a></div>
          <div class="user-profile__item"><a href="/userprofilepasswordedit">Изменить пароль</a></div>
          <div class="user-profile__item">
            <a class="user-profile__item_color-red" href="/logout">Выйти</a>
          </div>
        </section>
      </section>
    `;
  }
}
