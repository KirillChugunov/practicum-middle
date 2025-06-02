import Block from '@/shared/core/block/block';
import { Props } from '@/shared/core/block/block';

interface ModalProps extends Props {
  child: Block;
  onClose?: () => void;
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    const { child, className = '', onClose } = props;
    super('div', {
      className: `modal ${className}`,
      child,
      events: {
        click: (e: Event) => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            onClose?.();
            this.hide();
          }
        },
      },
    });

    this.children.child = child;
  }

  public setProps(nextProps: Partial<ModalProps>): void {
    super.setProps(nextProps);

    if (nextProps.child && nextProps.child !== this.children.child) {
      this.children.child = nextProps.child;
      this.forceUpdate();
    }
  }

  render(): string {
    return `
      <div class="modal__overlay">
        <div class="modal__content">
          {{{ child }}}
        </div>
      </div>
    `;
  }

  public open(): void {
    this.renderToRoot('modal-root');
    this.show();
  }

  public close(): void {
    this.hide();
    const root = document.getElementById('modal-root');
    if (root?.contains(this.getContent()!)) {
      root.removeChild(this.getContent()!);
    }
  }
}
