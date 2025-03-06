import {Block, Button, FormManager, InputField} from "@shared";

export default class UserProfileEditForm extends Block {
    constructor() {
        const formManager = new FormManager();
        super("user-profile-edit__grid", {
            Email: new InputField({
                label: "Почта",
                type: "email",
                onBlur: (e: Event) => {
                    if (this.children.Email instanceof InputField)
                       formManager.validateField(e, this.children.Email);
                },
                name: "email"
            }),
            Login: new InputField({
                label: "Логин",
                name: "login",
                onBlur: (e: Event) => {
                    if (this.children.Login instanceof InputField)
                       formManager.validateField(e, this.children.Login);
                },
                type: "text"
            }),
            FirstName: new InputField({
                label: "Имя",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.FirstName instanceof InputField)
                       formManager.validateField(e, this.children.FirstName);
                },
                name: "first_name"
            }),
            SecondName: new InputField({
                label: "Фамилия",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.SecondName instanceof InputField)
                       formManager.validateField(e, this.children.SecondName);
                },
                name: "second_name"
            }),
            ChatName: new InputField({
                label: "Имя в чате",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.ChatName instanceof InputField)
                       formManager.validateField(e, this.children.ChatName);
                },
                name: "display_name"
            }),
            Phone: new InputField({
                label: "Телефон",
                type: "phone",
                onBlur: (e: Event) => {
                    if (this.children.Phone instanceof InputField)
                       formManager.validateField(e, this.children.Phone);
                },
                name: "phone"
            }),
            ButtonSubmitEdit: new Button({
                label: "Сохранить",
                variant: "primary",
                type: "submit",
                onClick: (e) => formManager.formSubmit(e)
            }),
        });
    }

    render() {
        return `
        <form class="user-profile-edit__grid">
            {{{ Email }}}
            {{{ Login  }}}
            {{{ FirstName }}}
            {{{ SecondName }}}
            {{{ ChatName }}}
            {{{ Phone  }}}
                    <div class="user-profile-edit__container">
        {{{ ButtonSubmitEdit }}}
        </div>
        </form>
    `
    }
}
