import { Block, Button } from '@shared'

type TErrorCircleProps = {
  error: string
  title: string
}

type TErrorCircleChildren = {
  RedirectButton: Button
}

export default class ErrorCircle extends Block<
  TErrorCircleProps,
  TErrorCircleChildren
> {
  constructor(props: TErrorCircleProps) {
    const redirectButton = new Button({
      variant: 'link',
      label: 'Назад к чатам',
      type: 'link',
      onClick: () => {
        console.log('test') // Заменить на реальный переход, если нужно
      },
    })

    super('div', {
      ...props,
      className: 'error-circle',
      RedirectButton: redirectButton,
    })
  }

  override render(): string {
    return `
      <h1>{{error}}</h1>
      <h2>{{title}}</h2>
      {{{ RedirectButton }}}
    `
  }
}
