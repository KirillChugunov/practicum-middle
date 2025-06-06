import Block from '../../core/block/block.ts'

type InputProps = {
  name: string
  events: Record<string, (e: Event) => void>
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      attrs: {
        class: props.className,
        ...(props.placeholder
          ? { placeholder: props.placeholder }
          : { placeholder: '' }),
        name: props.name,
        ...(props.disabled ? { disabled: true } : {}),
      },
    })
  }
}
