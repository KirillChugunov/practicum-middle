import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'

type TLoginProps = Record<string, never>
type TLoginChildren = {
  Login: InputField
  Password: InputField
  ButtonSubmitLogin: Button
  ButtonRegisterLink: Button
}

export default class Login extends Block<TLoginProps, TLoginChildren> {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    const LoginInput = new InputField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      eventBus,
      onBlur: (e: Event) => {
        formManager.validateField(e, LoginInput)
      },
    })

    const PasswordInput = new InputField({
      label: 'Пароль',
      name: 'password',
      type: 'password',
      eventBus,
      onBlur: (e: Event) => {
        formManager.validateField(e, PasswordInput)
      },
    })

    const SubmitButton = new Button({
      label: 'Авторизоваться',
      variant: 'primary',
      type: 'submit',
      onClick: async (e: Event) => {
        e.preventDefault()
        this.eventBusInstance.emit('submit')

        await formManager.formSubmit(e, async () => {
          const { formState } = formManager.getState()
          await userStore.login(formState)
          router.go('/chatlist')
        })
      },
    })

    const RegisterButton = new Button({
      label: 'Нет аккаунта?',
      variant: 'link',
      type: 'link',
      onClick: (e: Event) => {
        e.preventDefault()
        router.go('/signin')
      },
    })

    super('div', {
      className: 'container',
      Login: LoginInput,
      Password: PasswordInput,
      ButtonSubmitLogin: SubmitButton,
      ButtonRegisterLink: RegisterButton,
    })

    this.eventBusInstance = eventBus
  }

  override render(): string {
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
