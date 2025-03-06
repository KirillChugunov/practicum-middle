import {Block} from "@shared";
import {Login} from "@features";

export default class LoginPage extends Block {
    constructor() {
        super("div", {
            className: `login_container`,
            Login: new Login()
        });
    }

    render() {
        return `
           {{{ Login }}}
    `
    }
}
