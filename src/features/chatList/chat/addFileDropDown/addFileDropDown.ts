import photoVideoIcon from '../../../../assets/icons/photoVideo.svg';
import locationIcon from '../../../../assets/icons/location.svg';
import fileIcon from '../../../../assets/icons/file.svg';
import { Block, IconButton } from '@shared';

type TAddFileDropDown = {
  isOpen: boolean;
};

export default class AddFileDropDown extends Block {
  constructor(props: TAddFileDropDown) {
    super('div', {
      ...props,
      className: 'add-file',
      PhotoButton: new IconButton({
        buttonIcon: photoVideoIcon,
        alt: 'Photo icon',
        onClick: () => console.log('photo clicked'),
      }),
      FileButton: new IconButton({
        buttonIcon: locationIcon,
        alt: 'File icon',
        onClick: () => console.log('file clicked'),
      }),
      LocationButton: new IconButton({
        buttonIcon: fileIcon,
        alt: 'Location icon',
        onClick: () => console.log('location clicked'),
      }),
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
    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
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
