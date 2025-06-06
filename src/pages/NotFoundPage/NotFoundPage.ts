import { ErrorCircle } from '@features'
import { Block } from '@shared'

export default class NotFoundPage extends Block {
  constructor() {
    super('div', {
      className: 'error-page',
      NotFoundError: new ErrorCircle({
        title: '404',
        error: 'Не найдено',
      }),
    })
  }

  public render(): string {
    return `
      {{{ NotFoundError }}}
    `
  }
}
