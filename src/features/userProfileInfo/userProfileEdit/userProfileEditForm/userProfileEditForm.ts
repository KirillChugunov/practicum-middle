import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'

export default class UserProfileEditForm extends Block {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('form', {
      className: 'user-profile-edit__grid',
      Email: new InputField({
        label: 'Почта',
        type: 'email',
        name: 'email',
        placeHolder: 'Почта',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          if (this.children.Email instanceof InputField) {
            formManager.validateField(e, this.children.Email)
          }
        },
      }),
      Login: new InputField({
        label: 'Логин',
        type: 'text',
        name: 'login',
        placeHolder: 'Логин',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField) {
            formManager.validateField(e, this.children.Login)
          }
        },
        profile: true,
      }),
      FirstName: new InputField({
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        placeHolder: 'Имя',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.FirstName instanceof InputField) {
            formManager.validateField(e, this.children.FirstName)
          }
        },
        profile: true,
      }),
      SecondName: new InputField({
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        placeHolder: 'Фамилия',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.SecondName instanceof InputField) {
            formManager.validateField(e, this.children.SecondName)
          }
        },
        profile: true,
      }),
      ChatName: new InputField({
        label: 'Имя в чате',
        type: 'text',
        name: 'display_name',
        placeHolder: 'Имя в чате',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.ChatName instanceof InputField) {
            formManager.validateField(e, this.children.ChatName)
          }
        },
        profile: true,
      }),
      Phone: new InputField({
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        placeHolder: 'Телефон',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Phone instanceof InputField) {
            formManager.validateField(e, this.children.Phone)
          }
        },
        profile: true,
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
      profile: true,
    })

    this.eventBusInstance = eventBus
  }

  render() {
    return `
      {{{ Email }}}
      {{{ Login }}}
      {{{ FirstName }}}
      {{{ SecondName }}}
      {{{ ChatName }}}
      {{{ Phone }}}
      <div class="user-profile-edit__container">
        {{{ ButtonSubmitEdit }}}
      </div>
    `
  }
}
