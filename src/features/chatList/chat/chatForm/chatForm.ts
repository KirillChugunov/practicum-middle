import {Block, FormManager, IconButton, Input} from "@shared";
import {AddFileDropDown} from "@/features";



export default class ChatForm extends Block {
    constructor() {
        const formManager = new FormManager();
        super("form", {
            className: "chat-section__form",
            AddFileDropDown: new AddFileDropDown(),
            AddButton: new IconButton({
                buttonIcon: "./src/assets/icons/clip.svg",
                alt: "Attachment icon",
                onClick: () => console.log()
            }),
            SentButton: new IconButton({
                buttonIcon: "./src/assets/icons/arrow.svg",
                alt: "Send icon",
                direction: "right",
                onClick: (e) => formManager.formSubmit(e)
            }),
            ChatInput: new Input({
                className: "chat-section__input",
                placeholder: "Сообщение",
                name: "message",
                events: {
                    blur: (e: Event) => {
                        if (this.children.ChatInput instanceof Input) {
                            formManager.validateField(e, this.children.ChatInput);
                        }
                    }
                }
            })
        });
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
