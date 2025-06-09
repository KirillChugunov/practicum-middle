import { Block } from '@shared'
import modalService from '@/shared/core/modalService/modalService.ts'
import AddChatAvatarModalContent from '@/features/chatList/chat/chatAvatarModal/ModalConent.ts'
import defaultChatAvatar from '@/assets/icons/chatListAvatar.svg'

interface ChatAvatarProps {
  avatar?: string
  chatId?: string
  className?: string
  isTitle?: boolean
}

export default class ChatAvatar extends Block {
  private unsubscribe: (() => void) | null = null

  constructor(props: ChatAvatarProps) {
    const isTitle = props.isTitle ?? false

    super('section', {
      ...props,
      avatar: props.avatar ?? defaultChatAvatar,
      attrs: {
        type: 'button',
      },
      ...(isTitle
        ? {}
        : {
            events: {
              click: (): void => {
                const chatId = props.chatId
                if (chatId) {
                  modalService.open(AddChatAvatarModalContent, {
                    chatId,
                    isFileInput: true,
                    isOpen: true,
                    onDone: () => modalService.close(),
                  })
                }
              },
            },
          }),
    })
  }

  public componentWillUnmount(): void {
    this.unsubscribe?.()
  }

  public render(): string {
    return `
      <img
        class="chatCard__avatar-image {{className}}"
        src="{{avatar}}"
        alt="аватар чата"
      />
    `
  }
}
