import {Block} from "@shared";
import {UserProfilePreview} from "@features";


export default class UserProfileInfoPage extends Block {
    constructor() {
        super("div", {
            className: `user-profile`,
            UserProfilePreview: new UserProfilePreview()
        });
    }

    render() {
        return `
           {{{ UserProfilePreview }}}
    `
    }
}
