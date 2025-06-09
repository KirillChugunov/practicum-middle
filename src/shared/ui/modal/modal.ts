import Block from '@/shared/core/block/block';

interface ModalProps {
  child?: Block;
  onClose?: () => void;
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    const { onClose } = props;

    super('div', {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          const content = this.getContent()?.querySelector('.modal__content');
          if (content && !content.contains(target)) {
            onClose?.();
            this.hide();
          }
        },
      },
    });

    if (props.child) {
      this.children.child = props.child;
    }
  }
  public getChild(): Block | undefined {
    return this.children?.child as Block | undefined;
  }
  public setProps(nextProps: Partial<ModalProps>): void {
    super.setProps(nextProps);

    if (nextProps.child && nextProps.child !== this.children.child) {
      this.children.child = nextProps.child;
      this.forceUpdate();
    }
  }

  public open(): void {
    this.renderToRoot('modal-root');
    this.show();
  }

  public close(): void {
    this.hide();
    const root = document.getElementById('modal-root');
    const content = this.getContent();
    if (root && content && root.contains(content)) {
      root.removeChild(content);
    }
  }

  public show(): void {
    if (this.element) {
      this.element.classList.add('modal--visible');
    }
  }

  public hide(): void {
    if (this.element) {
      this.element.classList.remove('modal--visible');
    }
  }

  render(): string {
    return `
      <div class="modal__overlay">
        <div class="modal__content">
          ${this.children.child ? '{{{ child }}}' : ''}
        </div>
      </div>
    `;
  }
}
