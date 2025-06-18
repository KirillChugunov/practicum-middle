import EventBus from '@/shared/core/eventBus/eventBus.ts'
import { throttle } from '@/shared/utils/throttle.ts'
import { Block, Input } from '@shared'

type TSearchInputFieldProps = {
  label: string
  placeHolder?: string
  name: string
  type?: string
  disabled?: boolean
  onSearch: (value: string) => void
  eventBus?: EventBus<'submit'>
  profile?: boolean
  className?: string
  error?: string
}

type TSearchInputFieldChildren = {
  Input: Input
}

export default class SearchInputField extends Block<
  TSearchInputFieldProps,
  TSearchInputFieldChildren
> {
  constructor(props: TSearchInputFieldProps) {
    const throttledSearch = throttle((e: Event) => {
      const value = (e.target as HTMLInputElement).value.trim()
      props.onSearch(value)
    }, 1000)

    const InputField = new Input({
      name: props.name,
      placeholder: props.placeHolder,
      disabled: props.disabled ?? false,
      className: props.profile ? 'profile_input' : 'input__element',
      events: {
        input: throttledSearch,
      },
    })

    super('div', {
      ...props,
      Input: InputField,
      error: '',
      type: props.type ?? 'search',
      className: props.profile ? 'profile_item_container' : 'input',
    })

    props.eventBus?.on('submit', () => {
      const inputEl = InputField.getContent() as HTMLInputElement | null
      if (inputEl) {
        props.onSearch(inputEl.value.trim())
      }
    })
  }

  override componentDidUpdate(
    _oldProps: TSearchInputFieldProps,
    newProps: TSearchInputFieldProps,
  ): boolean {
    this.children.Input.setProps({
      placeholder: newProps.placeHolder,
    })
    return true
  }

  override render(): string {
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
          {{{ Input }}}
          <div class="input__label">{{label}}</div>
        </label>
        <div class="input__error">
          {{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}
        </div>
      {{/if }}
    `
  }
}
