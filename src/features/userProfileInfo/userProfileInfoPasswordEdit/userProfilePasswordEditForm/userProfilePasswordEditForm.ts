import profilePicture from "../../../../assets/icons/picture.svg";
import {Block, Button, FormManager, InputField} from "@shared";
import {UserProfileEditGoBack, UserProfileTitles} from "@/features";


export default class UserProfilePasswordEdit extends Block {
    constructor() {
        const formManager = new FormManager();
        super("form", {
            className: `user-profile-password-edit__grid`,
            GoBackButton: new UserProfileEditGoBack(),
            ProfileTitles: new UserProfileTitles({
                name: "userName",
                profilePicture: profilePicture,
            }),
            OldPassword: new InputField({
                label: "Old password",
                type: "password",
                onBlur: (e: Event) => {
                    if (this.children.Password instanceof InputField)
                       formManager.validateField(e, this.children.Password);
                },
                name: "oldPassword"
            }),
            Password: new InputField({
                label: "Пароль",
                type: "password",
                onBlur: (e: Event) => {
                    if (this.children.Password instanceof InputField)
                       formManager.validateField(e, this.children.Password);
                },
                name: "newPassword"
            }),
            ButtonSubmitEdit: new Button({
                label: "Сохранить",
                variant: "primary",
                type: "submot",
                onClick: (e) => formManager.formSubmit(e)
            }),

        });
    }

    render() {
        return `
        <form class="user-profile-password-edit__grid">
            {{{ OldPassword }}}
                 {{{ Password }}}
                      {{{ Password }}}
                              <div class="user-profile-password-edit__container">
           {{{ ButtonSubmitEdit }}}
        </div>
        </form>
    `
    }
}
