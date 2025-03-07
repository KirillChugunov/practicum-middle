import photoVideoIcon from '../../../../assets/icons/photoVideo.svg'
import locationIcon from '../../../../assets/icons/location.svg'
import fileIcon from '../../../../assets/icons/file.svg'
import { Block, IconButton } from '@shared'

export default class AddFileDropDown extends Block {
  constructor() {
    super('div', {
      className: 'add-file',
      PhotoButton: new IconButton({
        buttonIcon: photoVideoIcon,
        alt: 'Photo icon',
        onClick: () => console.log('test'),
      }),
      FileButton: new IconButton({
        buttonIcon: locationIcon,
        alt: 'File icon',
        onClick: () => console.log('test'),
      }),
      LocationButton: new IconButton({
        buttonIcon: fileIcon,
        alt: 'Location icon',
        onClick: () => console.log('test'),
      }),
    })
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
    `
  }
}
