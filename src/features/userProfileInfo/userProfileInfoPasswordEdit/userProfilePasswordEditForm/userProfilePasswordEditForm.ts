import profilePicture from '../../../../assets/icons/picture.svg'
import { Block, Button, FormManager, InputField } from '@shared'
import { UserProfileEditGoBack, UserProfileTitles } from '@/features'
import EventBus from '@/shared/core/eventBus/eventBus.ts'

export default class UserProfilePasswordEdit extends Block {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('form', {
      className: 'user-profile-password-edit__grid',
      GoBackButton: new UserProfileEditGoBack(),
      ProfileTitles: new UserProfileTitles({
        name: 'userName',
        profilePicture: profilePicture,
      }),
      OldPassword: new InputField({
        label: 'Старый пароль',
        type: 'password',
        onBlur: (e: Event) => {
          if (this.children.OldPassword instanceof InputField) {
            formManager.validateField(e, this.children.OldPassword)
          }
        },
        name: 'oldPassword',
        eventBus,
        profile: true,
        placeHolder: 'Старый пароль',
      }),
      NewPassword: new InputField({
        label: 'Пароль',
        type: 'newPassword',
        onBlur: (e: Event) => {
          if (this.children.NewPassword instanceof InputField) {
            formManager.validateField(e, this.children.NewPassword)
          }
        },
        name: 'newPassword',
        eventBus,
        profile: true,
        placeHolder: 'Новый пароль',
      }),
      ButtonSubmitEdit: new Button({
        label: 'Сохранить',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => {
          e.preventDefault()
          this.eventBusInstance.emit('submit')
          formManager.formSubmit(e)
        },
      }),
    })

    this.eventBusInstance = eventBus
  }

  render() {
    return `
      {{{ OldPassword }}}
      {{{ NewPassword }}}
      <div class="user-profile-password-edit__container">
        {{{ ButtonSubmitEdit }}}
      </div>
    `
  }
}
