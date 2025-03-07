import Block from '../../core/block/block.ts'

type TModal = {
  modalContent: Block
  modalTitle: string
}

export default class Modal extends Block {
  constructor(props: TModal) {
    super('div', {
      className: 'modal-overlay',
      modalTitle: props.modalTitle,
      modalContent: props.modalContent,
    })
  }

  render(): string {
    return `
      <div class="modal">
        <h2 class="modal__title">{{modalTitle}}</h2>
        {{{modalContent}}}
      </div>
    `
  }
}
