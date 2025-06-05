import photoVideoIcon from '../../../../assets/icons/photoVideo.svg';
import locationIcon from '../../../../assets/icons/location.svg';
import fileIcon from '../../../../assets/icons/file.svg';

import { Block, IconButton } from '@shared';
import { ChatWebSocket } from '@/shared/core/ws/ws.ts';

type TAddFileDropDown = {
  isOpen: boolean;
  chatWS: ChatWebSocket;
  openPhotoModal?: () => void;
  openFileModal?: () => void;
  openLocationModal?: () => void;
};

export default class AddFileDropDown extends Block {
  constructor(props: TAddFileDropDown) {
    const iconButtons = AddFileDropDown.initButtons(props);

    super('div', {
      ...props,
      className: 'add-file',
      ...iconButtons,
    });
  }

  public componentDidMount(): void {
    this.updateVisibility(false);
  }

  public componentDidUpdate(_oldProps: TAddFileDropDown, newProps: TAddFileDropDown): boolean {
    this.updateVisibility(newProps.isOpen);
    return true;
  }

  private updateVisibility(isOpen: boolean): void {
    isOpen ? this.show() : this.hide();
  }

  private static initButtons(props: TAddFileDropDown) {
    return {
      PhotoButton: new IconButton({
        buttonIcon: photoVideoIcon,
        alt: 'Photo icon',
        onClick: (e) => {
          e.preventDefault()
          console.log("test")
          console.log(props)
          props.openPhotoModal?.();
        },
      }),

      FileButton: new IconButton({
        buttonIcon: locationIcon,
        alt: 'File icon',
        onClick: () => {
          props.openFileModal?.();
        },
      }),

      LocationButton: new IconButton({
        buttonIcon: fileIcon,
        alt: 'Location icon',
        onClick: () => {
          props.openLocationModal?.();
        },
      }),
    };
  }

  public render(): string {
    return `
      <div class="add-file__option">
        {{{ PhotoButton }}}<p>Фото или Видео</p>
      </div>
      <div class="add-file__option">
        {{{ FileButton }}}<p>Файл</p>
      </div>
      <div class="add-file__option">
        {{{ LocationButton }}}<p>Локация</p>
      </div>
    `;
  }
}
