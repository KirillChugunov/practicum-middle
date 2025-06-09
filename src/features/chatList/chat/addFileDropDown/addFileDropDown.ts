import photoVideoIcon from '@/assets/icons/photoVideo.svg';
import { Block, IconButton } from '@shared';
import { ChatWebSocket } from '@/shared/core/ws/ws.ts';
import modalService from '@/shared/core/modalService/modalService.ts';
import AddFileModalContent from '@/features/chatList/chat/addFileModalContent/ModalConent.ts';

type TAddFileDropDownProps = {
  isOpen: boolean;
  chatWS?: ChatWebSocket;
};

type TAddFileDropDownChildren = {
  PhotoButton: IconButton;
};

export default class AddFileDropDown extends Block<
  TAddFileDropDownProps,
  TAddFileDropDownChildren
> {
  private chatWS?: ChatWebSocket;

  constructor(props: TAddFileDropDownProps) {
    const PhotoButton = new IconButton({
      buttonIcon: photoVideoIcon,
      alt: 'Photo icon',
      onClick: (e) => {
        e.preventDefault();
        modalService.open(AddFileModalContent, {
          isFileInput: true,
          isOpen: true,
          onDone: () => modalService.close(),
          chatWS: this.chatWS!,
        });
      },
    });

    super('div', {
      ...props,
      className: 'add-file',
      PhotoButton,
    });

    this.chatWS = props.chatWS;
  }

  override componentDidMount(): void {
    this.updateVisibility(this.props.isOpen);
  }

  override componentDidUpdate(
    oldProps: TAddFileDropDownProps,
    newProps: TAddFileDropDownProps
  ): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      this.updateVisibility(newProps.isOpen);
    }

    if (oldProps.chatWS !== newProps.chatWS) {
      this.chatWS = newProps.chatWS;
    }

    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide();
  }

  override render(): string {
    return `
      <div class="add-file__option">
        {{{ PhotoButton }}}
        <p>Фото или Видео</p>
      </div>
    `;
  }
}
