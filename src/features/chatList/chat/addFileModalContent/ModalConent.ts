import { Block, Button } from '@shared';
import chatStore from '@/store/chatStore/chatStore.ts';
import FileInput from '@/shared/ui/fileInput/fileInput.ts'

type TChatModalContent = {
  chatId: string;
  isOpen: boolean;
  isFileInput?: boolean;
  isDragDropInput?: boolean;
  onDone?: () => void;
};

export default class AddFileModalContent extends Block {
  constructor(props: TChatModalContent) {
    const children: Record<string, Block> = {
      ButtonSubmit: new Button({
        label: 'Загрузить файл',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => this.handleSubmit(e),
      }),
    };

    if (props.isFileInput) {
      children.FileInput = new FileInput({
        name: 'file',
        className: 'chat-modal__file-input',
        onChange: (file) => console.log('Выбран файл:', file),
      });
    }

    if (props.isDragDropInput) {
      children.DragDropInput = new DragDropInput({
        className: 'chat-modal__dragdrop',
        onFileDrop: (file) => {
          const inputEl = this.children.FileInput?.getContent() as HTMLInputElement;
          if (inputEl) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inputEl.files = dt.files;
          }
          console.log('Файл перетащен:', file);
        },
      });
    }

    super('form', {
      ...props,
      className: 'chat-modal__form',
      ...children,
    });
  }

  public componentDidUpdate(oldProps: TChatModalContent, newProps: TChatModalContent): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      this.updateVisibility(newProps.isOpen);
    }
    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide();
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const fileInput = this.children.FileInput?.getContent() as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      console.warn('Файл не выбран');
      return;
    }

    try {
      const result = await chatStore.uploadFile(file);
      if (result) {
        console.log('Файл загружен:', result);
        this.props.onDone?.();
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  }

  render(): string {
    return `
      <label class="chat-modal__file-label">Выберите файл для загрузки</label>
      {{#if FileInput}} {{{ FileInput }}} {{/if}}
      {{#if DragDropInput}} {{{ DragDropInput }}} {{/if}}
      {{{ ButtonSubmit }}}
    `;
  }
}
