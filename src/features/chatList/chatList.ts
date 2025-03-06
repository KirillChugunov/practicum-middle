import {Block} from "@shared";
import {Chat, ContactList} from "@/features";

export default class ChatList extends Block {
    constructor() {
        super("div", {
            className: "chat-list",
            ContactList: new ContactList(),
            Chat: new Chat({
                chat: true
            })
        });
    }

    public render(): string {
        return `
          {{{ ContactList  }}}
          {{{ Chat }}}
    `;
    }
}
