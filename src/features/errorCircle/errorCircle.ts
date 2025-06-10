import { Block, Button } from '@shared'
import router from '@/shared/core/router/router.ts'

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
      onClick: () => router.go("/messenger"),
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
