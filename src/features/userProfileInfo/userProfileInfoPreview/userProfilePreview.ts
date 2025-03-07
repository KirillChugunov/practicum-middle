import profilePicture from '../../../assets/icons/picture.svg'
import {Block, Button, FormManager, InputField,} from "@shared";
import {UserProfileEditGoBack, UserProfileTitles} from "@/features";


export default class UserProfilePreview extends Block {
    constructor() {
        const formManager = new FormManager();
        super("div", {
            className: `user-profile__container`,
            GoBackButton: new UserProfileEditGoBack(),
            ProfileTitles: new UserProfileTitles({
                name: "userName",
                profilePicture: profilePicture,
            }),
            Email: new InputField({
                label: "Почта",
                type: "email",
                onBlur: (e: Event) => {
                    if (this.children.Email instanceof InputField)
                       formManager.validateField(e, this.children.Email);
                },
                name: "email",
                placeHolder: "Почта",
                disabled: true
            }),
            Login: new InputField({
                label: "Логин",
                name: "login",
                onBlur: (e: Event) => {
                    if (this.children.Login instanceof InputField)
                       formManager.validateField(e, this.children.Login);
                },
                type: "text",
                disabled: true,
                placeHolder: "Логин",

            }),
            FirstName: new InputField({
                label: "Имя",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.FirstName instanceof InputField)
                       formManager.validateField(e, this.children.FirstName);
                },
                name: "first_name",
                disabled: true,
                placeHolder: "Имя",
            }),
            SecondName: new InputField({
                label: "Фамилия",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.SecondName instanceof InputField)
                       formManager.validateField(e, this.children.SecondName);
                },
                name: "second_name",
                disabled: true,
                placeHolder: "Фамилия",
            }),
            ChatName: new InputField({
                label: "Имя в чате",
                type: "text",
                onBlur: (e: Event) => {
                    if (this.children.ChatName instanceof InputField)
                       formManager.validateField(e, this.children.ChatName);
                },
                name: "display_name",
                disabled: true,
                placeHolder: "Имя в чате",
            }),
            Phone: new InputField({
                label: "Телефон",
                type: "phone",
                onBlur: (e: Event) => {
                    if (this.children.Phone instanceof InputField)
                       formManager.validateField(e, this.children.Phone);
                },
                name: "phone",
                disabled: true,
                placeHolder: "Телефон",
            }),
            ButtonSubmitEdit: new Button({
                label: "Сохранить",
                variant: "primary",
                type: "submit",
                onClick: (e: Event) => {console.log(e.target)}
            }),
        });
    }

    render() {
        return `
               {{{ GoBackButton  }}}
    <section class="user-profile__info">
            {{{ ProfileTitles  }}}
        <form class="user-profile-password-edit__grid">
            {{{ Email }}}
            {{{ Login  }}}
            {{{ FirstName }}}
            {{{ SecondName }}}
            {{{ ChatName }}}
            {{{ Phone  }}}
        </form>
        <section class="user-profile__grid user_profile__actions">
            <div class="user-profile__item"><a>Изменить данные</a> </div>
            <div class="user-profile__item"><a>Изменить пароль</a></div>
            <div class="user-profile__item"><a class="user-profile__item_color-red">Выйти</a></div>
        </section>
</div>


    `
    }
}
