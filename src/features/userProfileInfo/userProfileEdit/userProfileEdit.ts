
import profilePicture from '../../../assets/icons/picture.svg'
import {Block} from "@shared";
import {UserProfileEditForm, UserProfileEditGoBack, UserProfileTitles} from "@/features";


export default class UserProfileEdit extends Block {
    constructor() {
        super("div", {
            className: `user-profile__container`,
            GoBackButton: new UserProfileEditGoBack(),
            ProfileTitles: new UserProfileTitles({
                name: "userName",
                profilePicture: profilePicture,
            }),
            UserProfileEditForm: new UserProfileEditForm()
        });
    }

    render() {
        return `
               {{{ GoBackButton  }}}
    <section class="user-profile__edit">
        {{{ ProfileTitles }}}
 {{{ UserProfileEditForm }}}
    </section>
    `
    }
}
