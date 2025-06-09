import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import httpTransport from '@/shared/core/api/HTTPTransport.ts'
import router from '@/shared/core/router/router.ts'
import { apiConfig } from '@/shared/constants/api.ts'

type TSignInProps = Record<string, never>
type TSignInChildren = {
  Login: InputField
  Email: InputField
  FirstName: InputField
  SecondName: InputField
  Phone: InputField
  Password: InputField
  ButtonSubmitLogin: Button
  ButtonRegisterLink: Button
}

export default class SignIn extends Block<TSignInProps, TSignInChildren> {
  private eventBusInstance: EventBus<'submit'>

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    const Login = new InputField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, Login),
    })

    const Email = new InputField({
      label: 'Почта',
      type: 'email',
      name: 'email',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, Email),
    })

    const FirstName = new InputField({
      label: 'Имя',
      type: 'text',
      name: 'first_name',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, FirstName),
    })

    const SecondName = new InputField({
      label: 'Фамилия',
      type: 'text',
      name: 'second_name',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, SecondName),
    })

    const Phone = new InputField({
      label: 'Телефон',
      type: 'tel',
      name: 'phone',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, Phone),
    })

    const Password = new InputField({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      eventBus,
      onBlur: (e: Event) => formManager.validateField(e, Password),
    })

    const ButtonSubmitLogin = new Button({
      label: 'Зарегистрироваться',
      variant: 'primary',
      type: 'submit',
      onClick: async (e: Event) => {
        e.preventDefault()
        this.eventBusInstance.emit('submit')

        await formManager.formSubmit(e, async () => {
          const { formState } = formManager.getState()
          await this.handleRegistration(formState)
        })
      },
    })

    const ButtonRegisterLink = new Button({
      label: 'Уже есть аккаунт? Войти',
      type: 'link',
      variant: 'link',
      onClick: (e: Event) => {
        e.preventDefault()
        router.go('/')
      },
    })

    super('form', {
      className: 'signIn-form',
      Login,
      Email,
      FirstName,
      SecondName,
      Phone,
      Password,
      ButtonSubmitLogin,
      ButtonRegisterLink,
    })

    this.eventBusInstance = eventBus
  }

  private async handleRegistration(
    formState: Record<string, string>,
  ): Promise<void> {
    try {
      const res = await httpTransport.post(apiConfig.auth, { data: formState })

      if (res.status === 200 || res.status === 201) {
        router.go('/chatlist')
      } else {
        console.error('Регистрация не удалась:', res.status, res.responseText)
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error)
    }
  }

  override render(): string {
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
