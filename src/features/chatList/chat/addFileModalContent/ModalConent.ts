import { Block, Button } from '@shared'
import chatStore from '@/store/chatStore/chatStore.ts'
import FileInput from '@/shared/ui/fileInput/fileInput.ts'
import { ChatWebSocket } from '@/shared/core/ws/ws.ts'

type TAddFileModalContentProps = {
  isFileInput?: boolean
  onDone?: () => void
  chatWS: ChatWebSocket
  isOpen: boolean
}

type TAddFileModalContentChildren = {
  ButtonSubmit: Button
  FileInput?: FileInput
}

export default class AddFileModalContent extends Block<
  TAddFileModalContentProps,
  TAddFileModalContentChildren
> {
  constructor(props: TAddFileModalContentProps) {
    const ButtonSubmit = new Button({
      label: 'Загрузить файл',
      variant: 'primary',
      type: 'submit',
      onClick: (e: Event) => this.handleSubmit(e),
    })

    const children: TAddFileModalContentChildren = {
      ButtonSubmit,
    }

    if (props.isFileInput) {
      children.FileInput = new FileInput({
        name: 'file',
        className: 'chat-modal__file-input',
        onChange: (file) => console.log('Выбран файл:', file),
      })
    }

    super('form', {
      ...props,
      className: 'chat-modal__form',
      ...children,
    })
  }

  override componentDidUpdate(
    oldProps: TAddFileModalContentProps,
    newProps: TAddFileModalContentProps,
  ): boolean {
    if (oldProps.chatWS !== newProps.chatWS) {
      this.setProps({ chatWS: newProps.chatWS })
    }
    if (oldProps.isOpen !== newProps.isOpen) {
      this.setProps({ isOpen: newProps.isOpen })
    }
    return true
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault()

    const fileInputBlock = this.children.FileInput
    if (!fileInputBlock) {
      console.warn('Файл не выбран — элемент не найден')
      return
    }

    const inputEl = fileInputBlock.getContent() as HTMLInputElement | null
    const file = inputEl?.files?.[0]

    if (!file) {
      console.warn('Файл не выбран')
      return
    }

    try {
      const result = await chatStore.uploadFile(file)
      if (result) {
        this.props.chatWS.sendFile(String(result.id))
        this.props.onDone?.()
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
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
