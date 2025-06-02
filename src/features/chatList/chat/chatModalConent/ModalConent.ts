import { Block, FormManager, InputField, Button } from '@shared';
import chatStore from '@/store/chatStore/chatStore.ts';

type TChatModalContent = {
  isAdd: boolean;
  chatId: string;
  isOpen: boolean;
  onDone?: () => void;
};

export default class ChatModalContent extends Block {
  private formManager = new FormManager();

  constructor(props: TChatModalContent) {
    super('form', {
      ...props,
      className: 'chat-modal__form',
      Login: new InputField({
        label: 'Логин',
        name: 'login',
        type: 'text',
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField) {
            this.formManager.validateField(e, this.children.Login);
          }
        },
      }),
      ButtonSubmit: new Button({
        label: props.isAdd ? 'Добавить' : 'Удалить',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => this.handleSubmit(e),
      }),
    });
  }

  public componentDidUpdate(oldProps: TChatModalContent, newProps: TChatModalContent): boolean {
    if (oldProps.isAdd !== newProps.isAdd && this.children.ButtonSubmit instanceof Button) {
      this.children.ButtonSubmit.setProps({
        label: newProps.isAdd ? 'Добавить' : 'Удалить',
      });
    }

    if (oldProps.isOpen !== newProps.isOpen) {
      this.updateVisibility(newProps.isOpen);
    }

    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide();
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const isValid = this.formManager.formSubmit(e);
    if (!isValid) return;

    const login = this.formManager.getState().formState.login?.trim();
    if (!login) return;

    const { chatId, isAdd } = this.props;

    if (!chatId) {
      console.warn('chatId отсутствует при сабмите формы');
      return;
    }

    try {
     const users = await chatStore.searchUserByLogin(login)
      const user = users?.find(u => u.login === login).id;
      if (isAdd) {
        await chatStore.addUsersToChat(chatId, [user]);
      } else {
        await chatStore.removeUsersFromChat(chatId, [user]);
      }

      this.props.onDone?.();
    } catch (error) {
      console.error('Ошибка при обновлении участников чата:', error);
    }
  }

  render(): string {
    return `
      {{{ Login }}}
      {{{ ButtonSubmit }}}
    `;
  }
}
