import { Block } from '@shared'
import { formatTime } from '@/shared/utils/timeTrimmer.ts'

type TMessage = {
  type: string
  owner: string
  text?: string
  timeStamp: string
  photo?: string
}

export default class Message extends Block {
  constructor(props: TMessage) {
    super('div', {
      ...props,
      type: props.type,
      className: `message message__${props.owner} message__${props.type}`,
      owner: props.owner,
      text: props.text,
      timeStamp: formatTime(props.timeStamp),
      photo: props.photo,
    })
    console.log(this.props)
  }

  public render(): string {
    return `
    <div class="message__content">
      {{#if text}}
        <p>{{text}}</p>
        <small class="message__timestamp">{{timeStamp}}</small>
      {{else}}
        {{#if photo}}
          <img src="{{photo}}" alt="message photo">
          <small class="message__timestamp-img">{{timeStamp}}</small>
        {{/if}}
      {{/if}}
    </div>
  `;
  }


}
