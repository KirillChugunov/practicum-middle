import {Block} from "@shared";
import {ChatList} from "@features";

export default class ChatListPage extends Block {
    constructor() {
        super("div", {
            ChatList: new ChatList(),
        });
    }

    render(): string {
        return `
          {{{ ChatList  }}}
    `;
    }
}
