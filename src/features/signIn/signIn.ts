import {Block, Button, FormManager, Input, InputField} from "@shared";


export default class SignIn extends Block {
    constructor() {
        const formManager = new FormManager();
        super("form", {
            className: `signIn-form`,
            Login: new InputField({
                label: "Логин",
                name: "login",
                type: "text",
                onBlur: (e: Event) => {
                        if (this.children.Login instanceof Input) {
                            formManager.validateField(e, this.children.Login);
                        }
                }
            }),
            Email: new InputField({
                label: "Почта",
                type: "email",
                name: "email",
                onBlur: (e: Event) => {
                    if (this.children.Email instanceof Input) {
                        formManager.validateField(e, this.children.Email);
                    }
                }
            }),
            FirstName: new InputField({
                label: "Имя",
                type: "text",
                name: "first_name",
                onBlur: (e: Event) => {
                    if (this.children.FirstName instanceof Input) {
                        formManager.validateField(e, this.children.FirstName);
                    }
                }
            }),
            SecondName: new InputField({
                label: "Фамилия",
                type: "text",
                name: "second_name",
                onBlur: (e: Event) => {
                    if (this.children.SecondName instanceof Input) {
                        formManager.validateField(e, this.children.SecondName);
                    }
                }
            }),
            Phone: new InputField({
                label: "Телефон",
                type: "phone",
                name: "phone",
                onBlur: (e: Event) => {
                    if (this.children.Phone instanceof Input) {
                        formManager.validateField(e, this.children.Phone);
                    }
                }
            }),
            Password: new InputField({
                label: "Пароль",
                type: "password",
                name: "password",
                onBlur: (e: Event) => {
                    if (this.children.Phone instanceof Input) {
                        formManager.validateField(e, this.children.Phone);
                    }
                }
            }),
            ButtonSubmitLogin: new Button({
                label: "Зарегистрироваться",
                variant: "primary",
                type: "submit",
                onClick: (e) => formManager.formSubmit(e)
            }),
            ButtonRegisterLink: new Button({
                label: "Войти",
                type: "link",
                variant: 'link',
                onClick: (e) => console.log(e.target)
            })
        });
    }

    render() {
        return `
        <form class="signIn-form">
            <h1 class="signIn-title">Вход</h1>
            <div class="signIn-input-group">
                {{{ Login }}}
                {{{ Email }}}
                {{{ FirstName }}}
                {{{ SecondName }}}
                {{{ Phone }}}
                {{{ Password }}}
                {{{ Password }}}
            </div>
            {{{ ButtonSubmitLogin }}}
            {{{ ButtonRegisterLink }}}
        </form>
    `;
    }

}
