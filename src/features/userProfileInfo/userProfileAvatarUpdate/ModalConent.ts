import { Block, Button } from '@shared';
import FileInput from '@/shared/ui/fileInput/fileInput.ts';
import userStore from '@/store/userStore/userStore.ts';

type TUserProfileAvatarUpdateContentProps = {
  isOpen: boolean;
  isFileInput?: boolean;
  onDone?: () => void;
};

type TUserProfileAvatarUpdateContentChildren = {
  FileInput?: FileInput;
  ButtonSubmit: Button;
};

export default class UserProfileAvatarUpdateContent extends Block<
  TUserProfileAvatarUpdateContentProps,
  TUserProfileAvatarUpdateContentChildren
> {
  constructor(props: TUserProfileAvatarUpdateContentProps) {
    const children: TUserProfileAvatarUpdateContentChildren = {
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
        onChange: (file) => {
          console.log('Выбран файл:', file);
        },
      });
    }

    super('form', {
      ...props,
      className: 'chat-modal__form',
      ...children,
    });
  }

  override componentDidUpdate(
    oldProps: TUserProfileAvatarUpdateContentProps,
    newProps: TUserProfileAvatarUpdateContentProps
  ): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      this.updateVisibility(newProps.isOpen);
    }
    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide();
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const fileInputBlock = this.children.FileInput;
    if (!(fileInputBlock instanceof FileInput)) {
      console.warn('FileInput не найден или невалидный');
      return;
    }

    const inputEl = fileInputBlock.getContent() as HTMLInputElement | null;
    const file = inputEl?.files?.[0];

    if (!file) {
      console.warn('Файл не выбран');
      return;
    }

    try {
      await userStore.updateAvatar(file);
      this.props.onDone?.();
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  }

  override render(): string {
    return `
      <label class="chat-modal__file-label">Выберите файл для загрузки</label>
      {{#if FileInput}} {{{ FileInput }}} {{/if}}
      {{{ ButtonSubmit }}}
    `;
  }
}
