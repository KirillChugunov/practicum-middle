import { Block, FormManager, IconButton, Input } from '@shared';
import { AddFileDropDown } from '@/features';

export default class ChatForm extends Block {
  public isFileDropDownOpen: boolean = false;

  constructor() {
    const formManager = new FormManager();

    const addFileDropDown: InstanceType<typeof AddFileDropDown> = new AddFileDropDown({
      isOpen: false,
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
      onClick: (e: Event) => formManager.formSubmit(e),
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
  }

  private toggleDropDown(e: Event) {
    e.preventDefault();
    this.isFileDropDownOpen = !this.isFileDropDownOpen;
    if (this.children.AddFileDropDown instanceof Block)
    this.children.AddFileDropDown.setProps({ isOpen: this.isFileDropDownOpen });
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
