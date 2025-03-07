import Block from "../../core/block/block.ts";


type TModal = {
    modalContent: Block;
    modalTitle: string;

}

export default class Modal extends Block {
    constructor(props:TModal) {
        super("div", {
            className: "modal-overlay",
           ModalContent: props.modalContent,
        });
    }

    render(): string {
        return `
            <div class="modal">
              <h2 class="modal__title">{{{props.modalTitle}}}</h2>
              {{{ ModalContent  }}}
          </div>
    `;
    }
}
