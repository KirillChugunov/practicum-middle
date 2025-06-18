import { Block, Button } from '@shared'
import chatStore from '@/store/chatStore/chatStore.ts'
import FileInput from '@/shared/ui/fileInput/fileInput.ts'

type TAddChatAvatarModalProps = {
  chatId: string
  isOpen: boolean
  isFileInput?: boolean
  isDragDropInput?: boolean
  onDone?: () => void
}

type TAddChatAvatarModalChildren = {
  ButtonSubmit: Button
  FileInput?: FileInput
}

export default class AddChatAvatarModalContent extends Block<
  TAddChatAvatarModalProps,
  TAddChatAvatarModalChildren
> {
  constructor(props: TAddChatAvatarModalProps) {
    const ButtonSubmit = new Button({
      label: 'Загрузить файл',
      variant: 'primary',
      type: 'submit',
      onClick: (e: Event) => this.handleSubmit(e),
    })

    const children: TAddChatAvatarModalChildren = { ButtonSubmit }

    if (props.isFileInput) {
      children.FileInput = new FileInput({
        name: 'file',
        className: 'chat-modal__file-input',
        onChange: (file) => {
          console.log('Выбран файл:', file)
        },
      })
    }

    super('form', {
      ...props,
      className: 'chat-modal__form',
      ...children,
    })
  }

  override componentDidUpdate(
    oldProps: TAddChatAvatarModalProps,
    newProps: TAddChatAvatarModalProps,
  ): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      this.updateVisibility(newProps.isOpen)
    }
    return true
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide()
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault()

    const fileInput = this.children.FileInput
    if (!fileInput) {
      console.warn('Поле загрузки файла не найдено.')
      return
    }

    const inputEl = fileInput.getContent() as HTMLInputElement | null
    const file = inputEl?.files?.[0]

    if (!file) {
      console.warn('Файл не выбран')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('chatId', this.props.chatId)

    try {
      await chatStore.updateChatAvatar(formData)
      this.props.onDone?.()
    } catch (error) {
      console.error('Ошибка при обновлении аватара чата:', error)
    }
  }

  override render(): string {
    return `
      <label class="chat-modal__file-label">Выберите файл для загрузки</label>
      {{#if FileInput}} {{{ FileInput }}} {{/if}}
      {{{ ButtonSubmit }}}
    `
  }
}
