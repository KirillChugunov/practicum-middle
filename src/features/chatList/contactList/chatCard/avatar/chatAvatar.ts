import { Block } from '@shared'

type TChatAvatar = {
  avatar: string
}

export default class ChatAvatar extends Block {
  constructor(props: TChatAvatar) {
    super('img', {
      ...props,
      className: 'chatCard__avatar',
      attrs: {
        src: props.avatar,
        alt: 'аватар пользователя',
      },
    })
  }
}
