import {Block, Button, FormManager, InputField} from "@shared";
import EventBus from "@/shared/core/eventBus/eventBus.ts";

export default class UserProfileEditForm extends Block {
    private eventBusInstance: EventBus<"submit">;
    constructor() {
        const eventBus = new EventBus<"submit">();
        const formManager = new FormManager();
        super("form", {
            className: `user-profile-edit__grid`,
            Email: new InputField({
                label: "Почта",
                type: "email",
                onBlur: (e: Event) => {
                    if (this.children.Email instanceof InputField)
                       formManager.validateField(e, this.children.Email);
                },
                name: "email",
                eventBus: eventBus,
                profile: true,
                className:"profile__item"
            }),
            Login: new InputField({
                label: "Логин",
                name: "login",
                onBlur: (e: Event) => {
                    if (this.children.Login instanceof InputField)
                       formManager.validateField(e, this.children.Login);
                },
                type: "text",
                eventBus: eventBus,
            }),
            FirstName: new InputField({
                label: "Имя",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.FirstName instanceof InputField)
                       formManager.validateField(e, this.children.FirstName);
                },
                name: "first_name",
                eventBus: eventBus,
            }),
            SecondName: new InputField({
                label: "Фамилия",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.SecondName instanceof InputField)
                       formManager.validateField(e, this.children.SecondName);
                },
                name: "second_name",
                eventBus: eventBus,
            }),
            ChatName: new InputField({
                label: "Имя в чате",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.ChatName instanceof InputField)
                       formManager.validateField(e, this.children.ChatName);
                },
                name: "display_name",
                eventBus: eventBus,
            }),
            Phone: new InputField({
                label: "Телефон",
                type: "phone",
                onBlur: (e: Event) => {
                    if (this.children.Phone instanceof InputField)
                       formManager.validateField(e, this.children.Phone);
                },
                name: "phone",
                eventBus: eventBus,
            }),
            ButtonSubmitEdit: new Button({
                label: "Сохранить",
                variant: "primary",
                type: "submit",
                onClick: (e: Event) => {
                    e.preventDefault();
                    this.eventBusInstance.emit("submit");
                    formManager.formSubmit(e);
                }
            })
        });
        this.eventBusInstance = eventBus;
    }

    render() {
        return `
            {{{ Email }}}
            {{{ Login  }}}
            {{{ FirstName }}}
            {{{ SecondName }}}
            {{{ ChatName }}}
            {{{ Phone  }}}
            <div class="user-profile-edit__container">
                 {{{ ButtonSubmitEdit }}}
            </div>
    `
    }
}
