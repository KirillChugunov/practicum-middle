import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import userStore from '@/store/userStore/userStore.ts'

export default class UserProfilePasswordEdit extends Block {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('form', {
      className: 'user-profile-password-edit__grid',
      OldPassword: new InputField({
        label: 'Старый пароль',
        type: 'password',
        onBlur: (e: Event) => {
          if (this.children.OldPassword instanceof Block)
            formManager.validateField(e, this.children.OldPassword)
        },
        name: 'oldPassword',
        eventBus,
        profile: true,
        placeHolder: 'Старый пароль',
      }),
      NewPassword: new InputField({
        label: 'Новый пароль',
        type: 'password', // ✅ исправлено
        onBlur: (e: Event) => {
          if (this.children.NewPassword instanceof Block)
            formManager.validateField(e, this.children.NewPassword)
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

          formManager.formSubmit(e, async () => {
            const formData = formManager.getState().formState
            if (formData.oldPassword && formData.newPassword) {
              userStore.updatePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
              })
            } else {
              console.warn('Не заполнены оба поля пароля')
            }
          })
        },
      }),
    })

    this.eventBusInstance = eventBus
  }

  override render(): string {
    return `
      {{{ OldPassword }}}
      {{{ NewPassword }}}
      <div class="user-profile-password-edit__container">
        {{{ ButtonSubmitEdit }}}
      </div>
    `
  }
}
