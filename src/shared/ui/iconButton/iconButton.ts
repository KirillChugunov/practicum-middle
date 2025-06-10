import Block from '../../core/block/block.ts'

type TIconButton = {
  onClick: (e: Event) => void
  buttonIcon: string
  alt: string
  direction?: string
  attrs?: {
    type: string
  }
}

export default class IconButton extends Block {
  constructor(props: TIconButton) {
    super('button', {
      ...props,
      className: 'icon-button',
      events: {
        click: props.onClick,
      },
      attrs: {
        ...props.attrs,
      },
    })
  }

  render() {
    return `
      <img class="icon-direction__{{direction}}" src="{{buttonIcon}}" alt="{{alt}}">
    `
  }
}
