
import profilePicture from "../../../assets/icons/picture.svg";
import {Block, Button} from "@shared";
import {UserProfileEditGoBack, UserProfilePasswordEditForm, UserProfileTitles} from "@/features";

export default class UserProfilePasswordEdit extends Block {
    constructor() {
        super("div", {
            className: `user-profile__container`,
            GoBackButton: new UserProfileEditGoBack(),
            ProfileTitles: new UserProfileTitles({
                name: "userName",
                profilePicture: profilePicture,
            }),
            ButtonSubmitEdit: new Button({
                label: "Сохранить",
                variant: "primary",
                type: "submit",
                onClick: (e) => {console.log(e.target)}
            }),
            UserProfilePasswordEdit: new UserProfilePasswordEditForm()
        });
    }

    render() {
        return `
          {{{ GoBackButton  }}}
    <section class="user-profile__password-edit">
        {{{ UserProfileTitles name="Иван" }}}
       {{{ UserProfilePasswordEdit }}}
    </section>


    `
    }
}
