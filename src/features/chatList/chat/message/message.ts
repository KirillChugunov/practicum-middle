import {Block} from "@shared";

type TMessage = {
    type: string;
    owner: string;
    text?: string;
    timeStamp: string;
    photo?: string;
}
export default class Message extends Block {
    constructor(props: TMessage) {
        super("div", {
            ...props,
            type:props.type,
            className: `message message__${props.owner} message__${props.type}`,
            owner: props.owner,
            text: props.text,
            timeStamp: props.timeStamp,
            photo: props.photo,
        });
    }

    public render(): string {
        return `
{{#if text}}
    <p>{{text}}</p>
    <small class="message__timestamp">{{timeStamp}}</small>
{{else if photo}}
    <img src="{{photo}}" alt="message photo">
    <small class="message__timestamp-img">{{timeStamp}}</small>
{{/if}}
    `;
    }
}
