import { Block, Button, FormManager, InputField } from '@shared';
import { UserProfileEditGoBack, UserProfileTitles } from '@/features';
import EventBus from '@/shared/core/eventBus/eventBus.ts';
import userStore from '@/store/userStore/userStore.ts';

type TUserProfilePasswordEditProps = Record<string, never>;

type TUserProfilePasswordEditChildren = {
  GoBackButton: UserProfileEditGoBack;
  ProfileTitles: UserProfileTitles;
  OldPassword: InputField;
  NewPassword: InputField;
  ButtonSubmitEdit: Button;
};

export default class UserProfilePasswordEdit extends Block<
  TUserProfilePasswordEditProps,
  TUserProfilePasswordEditChildren
> {
  private eventBusInstance: EventBus<'submit'>;

  constructor() {
    const eventBus = new EventBus<'submit'>();
    const formManager = new FormManager();

    const oldPassword = new InputField({
      label: 'Старый пароль',
      type: 'password',
      name: 'oldPassword',
      eventBus,
      profile: true,
      placeHolder: 'Старый пароль',
      onBlur: (e: Event) => {
        formManager.validateField(e, oldPassword);
      },
    });

    const newPassword = new InputField({
      label: 'Новый пароль',
      type: 'password',
      name: 'newPassword',
      eventBus,
      profile: true,
      placeHolder: 'Новый пароль',
      onBlur: (e: Event) => {
        formManager.validateField(e, newPassword);
      },
    });

    const submitButton = new Button({
      label: 'Сохранить',
      variant: 'primary',
      type: 'submit',
      onClick: (e: Event) => {
        e.preventDefault();
        this.eventBusInstance.emit('submit');

        formManager.formSubmit(e, async () => {
          const { formState } = formManager.getState();

          const payload = {
            oldPassword: formState.oldPassword,
            newPassword: formState.newPassword,
          };

          await userStore.updatePassword(payload);
        });
      },
    });

    super('form', {
      className: 'user-profile-password-edit__grid',
      GoBackButton: new UserProfileEditGoBack(),
      ProfileTitles: new UserProfileTitles({
        name: 'userName',
      }),
      OldPassword: oldPassword,
      NewPassword: newPassword,
      ButtonSubmitEdit: submitButton,
    });

    this.eventBusInstance = eventBus;
  }

  override render(): string {
    return `
      {{{ GoBackButton }}}
      {{{ ProfileTitles }}}
      {{{ OldPassword }}}
      {{{ NewPassword }}}
      <div class="user-profile-password-edit__container">
        {{{ ButtonSubmitEdit }}}
      </div>
    `;
  }
}
