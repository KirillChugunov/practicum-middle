import EventBus from '@/shared/core/eventBus/eventBus.ts';
import { throttle } from '@/shared/utils/throttle.ts';
import { Block, Input } from '@shared'

type TSearchInputProps = {
  label: string;
  placeHolder?: string;
  name: string;
  type?: string;
  disabled?: boolean;
  onSearch: (value: string) => void;
  eventBus?: EventBus<'submit'>;
  profile?: boolean;
  className?: string;
};

export default class SearchInputField extends Block {
  constructor(props: TSearchInputProps) {
    const throttledSearch = throttle((e: Event) => {
      const value = (e.target as HTMLInputElement).value.trim();
      props.onSearch(value);
    }, 1000);

    super('div', {
      ...props,
      className: props.profile ? 'profile_item_container' : 'input',
      error: '',
      Input: new Input({
        events: {
          input: throttledSearch,
        },
        name: props.name,
        disabled: props.disabled ?? false,
        className: props.profile ? 'profile_input' : 'input__element',
        placeholder: props.placeHolder,
      }),
      type: props.type ?? 'search',
    });

    props.eventBus?.on('submit', () => {
      const inputElement = this.getContent()?.querySelector('input');
      if (inputElement) {
        props.onSearch(inputElement.value.trim());
      }
    });
  }

  override componentDidUpdate(_oldProps: any, newProps: any): boolean {
    this.children.Input.setProps({
      attrs: {
        ...this.children.Input.props.attrs,
        placeholder: newProps.placeHolder,
      },
    });
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
    `;
  }
}
