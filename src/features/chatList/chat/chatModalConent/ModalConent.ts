import { Block, FormManager, InputField, Button } from '@shared'

export default class ChatModalContent extends Block {
  constructor() {
    const formManager = new FormManager()

    super('form', {
      Login: new InputField({
        label: 'Логин',
        name: 'login',
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField) {
            formManager.validateField(e, this.children.Login)
          }
        },
        type: 'text',
      }),
      ButtonSubmit: new Button({
        label: 'Добавить',
        variant: 'primary',
        type: 'submit',
        onClick: (e) => formManager.formSubmit(e),
      }),
    })
  }

  render(): string {
    return `
      <form>
        {{{ ChatModalContent }}}
        {{{ ButtonSubmit }}}
      </form>
    `
  }
}
