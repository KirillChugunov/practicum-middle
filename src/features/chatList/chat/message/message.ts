import { Block } from '@shared'
import { formatTime } from '@/shared/utils/timeTrimmer.ts'
import { MessageType, TMessageFile } from '@/shared/core/ws/ws.ts'

type TMessageProps = {
  type: MessageType
  owner: 'me' | 'partner'
  text?: string
  timeStamp: string
  file?: TMessageFile
  fileHtml?: string
  className?: string
}

export default class Message extends Block<TMessageProps> {
  constructor(props: TMessageProps) {
    const isImage = props.file?.content_type?.startsWith('image/')
    const fileUrl = props.file
      ? `https://ya-praktikum.tech/api/v2/resources${props.file.path}`
      : null

    const fileHtml = fileUrl
      ? isImage
        ? `<img src="${fileUrl}" alt="attachment" class="message__file-preview" />`
        : `<a href="${fileUrl}" download="${props.file?.filename}" target="_blank">${props.file?.filename}</a>`
      : undefined

    super('div', {
      ...props,
      fileHtml,
      className: `message message__${props.owner} message__${props.type}`,
      timeStamp: formatTime(props.timeStamp),
    })
  }

  render(): string {
    return `
      <div class="message__content">
        {{#if text}}
          <p>{{text}}</p>
          <small class="message__timestamp">{{timeStamp}}</small>
        {{/if}}

        {{#if fileHtml}}
          {{{fileHtml}}}
          <small class="message__timestamp-img">{{timeStamp}}</small>
        {{/if}}
      </div>
    `
  }
}
