import Block from '@/shared/core/block/block'
import { Modal } from '@shared'

class ModalService {
  private modal: Modal | null = null

  public register(): void {
    if (!this.modal) {
      this.modal = new Modal({
        onClose: () => this.close(),
      })

      this.modal.renderToRoot('modal-root')
      this.modal.hide()
    }
  }

  public open(Component: typeof Block, props: Record<string, unknown> = {}): void {
    if (!this.modal) this.register()
    const instance = new Component(props)
    if (this.modal) {
      this.modal.setProps({ child: instance })
      this.modal.show()
    }
  }

  public updateProps(newProps: Record<string, unknown>): void {
    const child = this.modal?.children.child
    if (child instanceof Block) {
      child.setProps(newProps)
    }
  }

  public close(): void {
    this.modal?.hide()
  }
}
const modalService = new ModalService()
export default modalService
