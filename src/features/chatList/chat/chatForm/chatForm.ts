import { Block, FormManager, IconButton, Input } from '@shared';
import { AddFileDropDown } from '@/features';
import { ChatWebSocket } from '@/shared/core/ws/ws.ts';

type TChatForm = {
  chatWS: ChatWebSocket;
};

export default class ChatForm extends Block {
  public isFileDropDownOpen: boolean = false;

  constructor(props: TChatForm) {
    const formManager = new FormManager();

    const addFileDropDown = new AddFileDropDown({
      isOpen: false,
      chatWS: props.chatWS,
    });

    const addButton = new IconButton({
      buttonIcon: './src/assets/icons/clip.svg',
      alt: 'Attachment icon',
      onClick: (e: Event) => this.toggleDropDown(e),
    });

    const sentButton = new IconButton({
      buttonIcon: './src/assets/icons/arrow.svg',
      alt: 'Send icon',
      direction: 'right',
      onClick: (e: Event) => {
        e.preventDefault();
        formManager.formSubmit(e);
        this.eventBus().emit('submit');
      },
    });

    const chatInput = new Input({
      className: 'chat-section__input',
      placeholder: 'Сообщение',
      name: 'message',
      events: {
        blur: (e: Event) => {
          formManager.validateField(e, chatInput);
        },
      },
    });

    super('form', {
      className: 'chat-section__form',
      AddFileDropDown: addFileDropDown,
      AddButton: addButton,
      SentButton: sentButton,
      ChatInput: chatInput,
    });

    this.eventBus().on('submit', () => {
      const message = formManager.getState().formState.message;
      if (message) {
        props.chatWS.sendText(message);
        chatInput.setValue?.('');
      }
    });
  }

  private toggleDropDown(e: Event) {
    e.preventDefault();
    this.isFileDropDownOpen = !this.isFileDropDownOpen;
    if (this.children.AddFileDropDown instanceof Block) {
      this.children.AddFileDropDown.setProps({ isOpen: this.isFileDropDownOpen });
    }
  }

  public render(): string {
    return `
      {{{ AddFileDropDown }}}
      {{{ AddButton }}}
      {{{ ChatInput }}}
      {{{ SentButton }}}
    `;
  }
}
