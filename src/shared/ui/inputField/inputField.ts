import Block from '../../core/block/block.ts'
import { Input } from '../input'
import EventBus from '@/shared/core/eventBus/eventBus.ts'

type TInputFieldProps = {
  label: string
  placeHolder?: string
  name: string
  type: string
  disabled?: boolean
  onBlur: (e: Event) => void
  eventBus?: EventBus<'submit'>
  profile?: boolean
  className?: string
}

export default class InputField extends Block {
  constructor(props: TInputFieldProps) {
    console.log("props.placeHolder", props.placeHolder)
    super('div', {
      ...props,
      className: props.profile ? 'profile_item_container' : 'input',
      label: props.label,
      error: '',
      Input: new Input({
        events: {
          blur: props.onBlur,
        },
        name: props.name,
        disabled: props.disabled ?? false,
        className: props.profile ? 'profile_input' : 'input__element',
      }),
      type: props.type,
    })

    props.eventBus?.on('submit', () => {
      const inputElement = this.getContent()?.querySelector('input')
      if (inputElement) {
        props.onBlur({ target: inputElement } as unknown as Event)
      }
    })
  }

  public render(): string {
    return `
      {{#if profile }}
        <div class="profile__item">
          <label><p>{{label}}</p></label>
          {{{ Input }}}
        </div>
        <div class="input__error">
          {{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}
        </div>
      {{else }}
        <label class="input__container">
          {{{Input}}}
          <div class="input__label">{{label}}</div>
        </label>
        <div class="input__error">
          {{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}
        </div>
      {{/if }}
    `
  }
}
