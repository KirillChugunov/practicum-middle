import { messageListMock } from './mock.ts'
import ChatAvatar from '../../../../assets/icons/chatListAvatar.svg'
import { Block, IconButton } from '@shared'
import { AddFileDropDown, ChatTitle, EmptyChat, Message } from '@/features'
import { ChatForm } from '@/features'
type TChat = {
  chat: boolean
}
export default class Chat extends Block {
  constructor(props: TChat) {
    super('section', {
      ...props,
      className: 'chat-section',
      chat: props.chat,
      EmptyChat: new EmptyChat(),
      ChatTitle: new ChatTitle({
        partnerName: 'MiddleFront',
        PartnerAvatar: ChatAvatar,
      }),
      Messages: messageListMock.map((message) => {
        if (message.type === 'text') {
          return new Message({
            type: message.type,
            owner: message.owner,
            text: message.text,
            timeStamp: message.timeStamp,
          })
        } else if (message.type === 'photo') {
          return new Message({
            type: message.type,
            owner: message.owner,
            photo: message.photo,
            timeStamp: message.timeStamp,
          })
        }
        return null
      }),
      AddFileDropDown: new AddFileDropDown(),
      AddButton: new IconButton({
        buttonIcon: './src/assets/icons/clip.svg',
        alt: 'Location icon',
        onClick: () => console.log('test'),
      }),
      SentButton: new IconButton({
        buttonIcon: './src/assets/icons/arrow.svg',
        alt: 'Location icon',
        direction: 'right',
        onClick: () => console.log('test'),
      }),
      ChatForm: new ChatForm(),
    })
  }

  public render(): string {
    return `
    {{#if chat }}
    {{{ ChatTitle }}}
    <div class="chat-section__chat-container">
        <div class="chat-section__message-list">
            {{#each Messages}}
  {{{ this }}}
{{/each}}
        </div>
   {{{ ChatForm }}}
    </div>
    {{else }}
      {{{ EmptyChat }}}
    {{/if }}
    `
  }
}
