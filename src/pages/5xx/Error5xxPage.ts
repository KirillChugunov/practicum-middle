import { Block } from '@shared'
import { ErrorCircle } from '@features'

export default class Error5xxPage extends Block {
  constructor() {
    super('div', {
      className: 'error-page',
      Error5xx: new ErrorCircle({
        title: 'Мы уже фиксим',
        error: '500',
      }),
    })
  }

  public render(): string {
    return `
      {{{Error5xx}}}
    `
  }
}
