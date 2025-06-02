import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import httpTransport from '@/shared/core/api/HTTPTransport.ts'
import { apiConfig } from '@/shared/constants/api.ts'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'

export default class Login extends Block {
  private eventBusInstance: EventBus<'submit'>
  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('div', {
      className: 'container',
      Login: new InputField({
        label: 'Логин',
        name: 'login',
        type: 'text',
        eventBus: eventBus,
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField) {
            formManager.validateField(e, this.children.Login)
          }
        },
      }),
      Password: new InputField({
        label: 'Пароль',
        type: 'password',
        name: 'password',
        eventBus: eventBus,
        onBlur: (e: Event) => {
          if (this.children.Password instanceof InputField) {
            formManager.validateField(e, this.children.Password)
          }
        },
      }),
      ButtonSubmitLogin: new Button({
        label: 'Авторизоваться',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => {
          e.preventDefault()
          this.eventBusInstance.emit('submit')
          formManager.formSubmit(e, (formState) => userStore.login(formState))
        },
      }),
      ButtonRegisterLink: new Button({
        label: 'Нет аккаунта?',
        variant: 'link',
        type: 'link',
        onClick: (e: Event) => {
          e.preventDefault()
          router.go('/singin')
        },
      }),
    })

    this.eventBusInstance = eventBus
  }

  render() {
    return `
      <form class="login-form">
        <h1 class="login-title">Вход</h1>
        <div class="login-input-group">
          {{{ Login }}}
          {{{ Password }}}
        </div>
        {{{ ButtonSubmitLogin }}}
        {{{ ButtonRegisterLink }}}
      </form>
    `
  }
}
