import Block from '../../core/block/block.ts'

type InputProps = {
  name: string
  events?: Partial<{
    [K in keyof GlobalEventHandlersEventMap]?: (
      e: GlobalEventHandlersEventMap[K],
    ) => void
  }>
  placeholder?: string
  disabled?: boolean
  className?: string
  type?: string
  value?: string
}

export default class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      attrs: {
        type: props.type ?? 'text',
        class: props.className,
        placeholder: props.placeholder ?? '',
        name: props.name,
        ...(props.disabled ? { disabled: true } : {}),
      },
    })
  }

  override componentDidMount(): void {
    this.updateDOMValue((this.props as InputProps).value)
  }

  override componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
  ): boolean {
    const oldVal = (oldProps as InputProps).value
    const newVal = (newProps as InputProps).value

    if (oldVal !== newVal) {
      this.updateDOMValue(newVal)
    }
    return true
  }

  private updateDOMValue(value?: string) {
    const input = this.element as HTMLInputElement
    if (input && typeof value === 'string') {
      input.value = value
    }
  }
}
