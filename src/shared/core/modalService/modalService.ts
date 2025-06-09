import Block from '@/shared/core/block/block';
import { Modal } from '@shared';

type BlockProps = Record<string, unknown>;

class ModalService {
  private modal: Modal | null = null;

  public register(): void {
    if (!this.modal) {
      this.modal = new Modal({
        onClose: () => this.close(),
      });

      this.modal.renderToRoot('modal-root');
      this.modal.hide();
    }
  }

  public open<TProps extends BlockProps>(
    Component: new (props: TProps) => Block,
    props: TProps
  ): void {
    if (!this.modal) {
      this.register();
    }

    const instance = new Component(props);
    this.modal!.setProps({ child: instance });
    this.modal!.show();
  }

  public updateProps(newProps: BlockProps): void {
    const child = this.modal?.getChild();
    if (child instanceof Block) {
      child.setProps(newProps);
    }
  }

  public close(): void {
    this.modal?.hide();
  }
}

const modalService = new ModalService();
export default modalService;
