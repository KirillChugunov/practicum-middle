import Block from '../../core/block/block.ts'
import { Input } from '../input'
import EventBus from '@/shared/core/eventBus/eventBus.ts'

type TInputFieldProps = {
  label: string
  value?: string
  name: string
  type: string
  disabled?: boolean
  onBlur?: (e: Event) => void
  eventBus?: EventBus<'submit'>
  profile?: boolean
  className?: string
  placeHolder?: string
}

export default class InputField extends Block {
  constructor(props: TInputFieldProps) {
    super('div', {
      ...props,
      className: props.profile ? 'profile_item_container' : 'input',
      error: '',
      Input: new Input({
        events: {
          blur: props.onBlur,
        },
        name: props.name,
        disabled: props.disabled ?? false,
        className: props.profile ? 'profile_input' : 'input__element',
        value: props.value,
        placeholder: props.placeHolder,
      }),
      type: props.type,
    })

    props.eventBus?.on('submit', () => {
      const inputElement = this.getContent()?.querySelector('input')
      if (inputElement && props.onBlur) {
        props.onBlur({ target: inputElement } as unknown as Event)
      }
    })
  }

  override componentDidUpdate(
    oldProps: TInputFieldProps,
    newProps: TInputFieldProps,
  ): boolean {
    if (
      this.children.Input instanceof Block &&
      newProps.value !== undefined &&
      newProps.value !== oldProps.value
    ) {
      this.children.Input.setProps({
        value: newProps.value,
        attrs: {
          ...this.children.Input.props.attrs,
          value: newProps.value,
        },
      });
    }

    return true;
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
