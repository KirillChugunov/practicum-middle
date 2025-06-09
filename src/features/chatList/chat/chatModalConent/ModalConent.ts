import { Block, FormManager, InputField, Button } from '@shared'
import chatStore from '@/store/chatStore/chatStore.ts'

type TAddUserModalProps = {
  isAdd: boolean
  chatId: string
  onDone?: () => void
}

type TAddUserModalChildren = {
  Login: InputField
  ButtonSubmit: Button
}

export default class AddUserModalContent extends Block<
  TAddUserModalProps,
  TAddUserModalChildren
> {
  private formManager = new FormManager()

  constructor(props: TAddUserModalProps) {
    const Login = new InputField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      onBlur: (e: Event) => {
        this.formManager.validateField(e, Login)
      },
    })

    const ButtonSubmit = new Button({
      label: props.isAdd ? 'Добавить' : 'Удалить',
      variant: 'primary',
      type: 'submit',
      onClick: (e: Event) => this.handleSubmit(e),
    })

    super('form', {
      ...props,
      className: 'chat-modal__form',
      Login,
      ButtonSubmit,
    })
  }

  override componentDidUpdate(
    oldProps: TAddUserModalProps,
    newProps: TAddUserModalProps,
  ): boolean {
    if (oldProps.isAdd !== newProps.isAdd) {
      this.children.ButtonSubmit.setProps({
        label: newProps.isAdd ? 'Добавить' : 'Удалить',
      })
    }
    return true
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault()

    const isValid = await this.formManager.formSubmit(e, async () => {})
    if (!isValid) return

    const login = this.formManager.getState().formState.login?.trim()
    if (!login) return

    const { isAdd, onDone } = this.props

    try {
      const users = await chatStore.searchUserByLogin(login)
      const userId = users?.find((u) => u.login === login)?.id

      if (!userId) {
        console.warn('Пользователь не найден')
        return
      }

      if (isAdd) {
        await chatStore.addUsersToChat([userId])
      } else {
        await chatStore.removeUsersFromChat([userId])
      }

      onDone?.()
    } catch (error) {
      console.error('Ошибка при обновлении участников чата:', error)
    }
  }

  override render(): string {
    return `
      {{{ Login }}}
      {{{ ButtonSubmit }}}
    `
  }
}
