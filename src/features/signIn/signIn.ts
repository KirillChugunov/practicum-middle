import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'

export default class SignIn extends Block {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('form', {
      className: 'signIn-form',
      Login: new InputField({
        label: 'Логин',
        name: 'login',
        type: 'text',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField) {
            formManager.validateField(e, this.children.Login)
          }
        },
      }),
      Email: new InputField({
        label: 'Почта',
        type: 'email',
        name: 'email',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Email instanceof InputField) {
            formManager.validateField(e, this.children.Email)
          }
        },
      }),
      FirstName: new InputField({
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.FirstName instanceof InputField) {
            formManager.validateField(e, this.children.FirstName)
          }
        },
      }),
      SecondName: new InputField({
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.SecondName instanceof InputField) {
            formManager.validateField(e, this.children.SecondName)
          }
        },
      }),
      Phone: new InputField({
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Phone instanceof InputField) {
            formManager.validateField(e, this.children.Phone)
          }
        },
      }),
      Password: new InputField({
        label: 'Пароль',
        type: 'password',
        name: 'password',
        eventBus,
        onBlur: (e: Event) => {
          if (this.children.Password instanceof InputField) {
            formManager.validateField(e, this.children.Password)
          }
        },
      }),
      ButtonSubmitLogin: new Button({
        label: 'Зарегистрироваться',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => {
          e.preventDefault()
          this.eventBusInstance.emit('submit')
          formManager.formSubmit(e)
        },
      }),
      ButtonRegisterLink: new Button({
        label: 'Уже есть аккаунт? Войти',
        type: 'link',
        variant: 'link',
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
      <h1 class="signIn-title">Регистрация</h1>
      <div class="signIn-input-group">
        {{{ Login }}}
        {{{ Email }}}
        {{{ FirstName }}}
        {{{ SecondName }}}
        {{{ Phone }}}
        {{{ Password }}}
      </div>
      {{{ ButtonSubmitLogin }}}
      {{{ ButtonRegisterLink }}}
    `
  }
}
