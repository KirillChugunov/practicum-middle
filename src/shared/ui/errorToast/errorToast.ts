import { Block } from '@shared'

export type TErrorToastProps = {
  message: string
  visible: boolean
}

class ErrorToast extends Block<TErrorToastProps> {
  private hideTimeout: number | null = null

  constructor() {
    super('div', {
      message: '',
      visible: false,
    })
  }

  override render(): string {
    return `
      <div class="error-toast {{#unless visible}}hidden{{/unless}}">
        {{message}}
      </div>
    `
  }

  showToast(message: string, duration = 4000): void {
    this.setProps({ message, visible: true })

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }

    this.hideTimeout = window.setTimeout(() => {
      this.setProps({ visible: false })
    }, duration)
  }
}
export default ErrorToast
export const errorToast = new ErrorToast()


