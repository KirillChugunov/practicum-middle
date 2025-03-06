import {Block, Button, FormManager, Input, InputField} from "@shared";


export default class Login extends Block {
    constructor() {
        const formManager = new FormManager();

        super("div", {
            className: "container",
            Login: new InputField({
                label: "Логин",
                placeHolder: "Логин",
                name: "login",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.Login instanceof Input) {
                        formManager.validateField(e, this.children.Login);
                    }
                }
            }),
            Password: new InputField({
                label: "Пароль",
                placeHolder: "Пароль",
                type: "password",
                name: "password",
                onBlur: (e: Event) => {
                    if (this.children.Password instanceof Input) {
                        formManager.validateField(e, this.children.Password);
                    }
                },
            }),
            ButtonSubmitLogin: new Button({
                label: "Авторизоваться",
                variant: "primary",
                type: "submit",
                onClick: (e) => formManager.formSubmit(e)
                },
            ),
            ButtonRegisterLink: new Button({
                label: "Нет аккаунта?",
                variant: "link",
                type: "link",
                onClick: (e) => console.log(e.target),
            }),
        });
    }

    render() {
        return `
            <form class="login-form">
                <h1 class="login-title">Вход</h1>
                <div class="login-input-group">
                    {{{ Login }}}
                    {{{ Password }}}
                </div>
                {{{ ButtonSubmitLogin }}}
                {{{ ButtonRegisterLink }}}
            </form>
        `;
    }
}
