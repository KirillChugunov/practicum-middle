import { Block, Button, FormManager, InputField } from '@shared'
import EventBus from '@/shared/core/eventBus/eventBus.ts'
import userStore from '@/store/userStore/userStore.ts'

interface User {
  email: string
  login: string
  first_name: string
  second_name: string
  display_name?: string
  phone: string
}

interface UserProfileEditFormChildren {
  Email: InputField
  Login: InputField
  FirstName: InputField
  SecondName: InputField
  ChatName: InputField
  Phone: InputField
  ButtonSubmitEdit: Button
}

export default class UserProfileEditForm extends Block {
  private readonly formManager: FormManager

  constructor() {
    const eventBus = new EventBus<'submit'>()
    const formManager = new FormManager()

    super('form', {
      className: 'user-profile-edit__grid',

      Email: new InputField({
        label: 'Почта',
        type: 'email',
        name: 'email',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.Email
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      Login: new InputField({
        label: 'Логин',
        type: 'text',
        name: 'login',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.Login
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      FirstName: new InputField({
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.FirstName
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      SecondName: new InputField({
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.SecondName
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      ChatName: new InputField({
        label: 'Имя в чате',
        type: 'text',
        name: 'display_name',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.ChatName
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      Phone: new InputField({
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        eventBus,
        profile: true,
        onBlur: (e: Event) => {
          const field = this.children.Phone
          if (field instanceof InputField) {
            formManager.validateField(e, field)
          }
        },
      }),

      ButtonSubmitEdit: new Button({
        label: 'Сохранить',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event): void => {
          e.preventDefault()
          eventBus.emit('submit')
          formManager.formSubmit(e, async () => {
            const formData = formManager.getState().formState

            const userData: User = {
              email: formData.email,
              login: formData.login,
              first_name: formData.first_name,
              second_name: formData.second_name,
              display_name: formData.display_name,
              phone: formData.phone,
            }

            await userStore.updateProfile(userData)
          })
        },
      }),
    })

    this.formManager = formManager

    userStore.subscribe((user: User) => {
      this.populateFormFields(user)
    })

    userStore.loadUser()
  }

  private populateFormFields(user: User): void {
    const register = (
      field: keyof UserProfileEditFormChildren,
      value: string,
      name: string,
    ): void => {
      const input = this.children[field]
      if (input instanceof InputField) {
        input.setProps({ value })
        this.formManager.registerField(name, value)
      }
    }

    register('Email', user.email, 'email')
    register('Login', user.login, 'login')
    register('FirstName', user.first_name, 'first_name')
    register('SecondName', user.second_name, 'second_name')
    register('ChatName', user.display_name ?? '', 'display_name')
    register('Phone', user.phone, 'phone')
  }

  public render(): string {
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
