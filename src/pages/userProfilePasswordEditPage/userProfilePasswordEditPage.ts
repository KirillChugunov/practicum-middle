import {Block} from "@shared";
import { UserProfilePasswordEdit} from '@features'

export default class UserProfilePasswordEditPage extends Block {
    constructor() {
        super("div", {
            className: `user-profile`,
            UserProfilePasswordEdit: new UserProfilePasswordEdit()
        });
    }

    render() {
        return `
           {{{ UserProfilePasswordEdit }}}
    `
    }
}
