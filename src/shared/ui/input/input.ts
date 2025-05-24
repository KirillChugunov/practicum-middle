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
    super('div', props)
  }

  render(): string {
    return `
      <p>{{placeHolder}}</p>
      <input
        class="{{className}}"
        name="{{name}}"
        placeholder="{{placeHolder}}"
        type="{{type}}"
        value="{{value}}"
        {{#if disabled}}disabled{{/if}}
      />
    `
  }
}
