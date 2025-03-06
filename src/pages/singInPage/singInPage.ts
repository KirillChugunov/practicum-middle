import {Block} from "@shared";
import {SignIn} from "@features";


export default class SingInPage extends Block {
    constructor() {
        super("div", {
            className: `singIn__container`,
            SingIn: new SignIn(),
        });
    }

    render() {
        return `
           {{{ SingIn }}}
    `
    }
}
