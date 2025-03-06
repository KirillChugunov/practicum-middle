import Block from "../../core/block/block.ts";
import { Input } from "../input";

type TInputFieldProps = {
  label: string;
  placeHolder?: string;
  name: string;
  type: string;
  disabled?: boolean;
  onBlur:(e: Event) => void;
};

export default class InputField extends Block {
  constructor(props: TInputFieldProps) {
    super("div", {
      ...props,
      className: "input",
      label: props.label,
      error: "",
      Input: new Input({
        events: {
          blur: props.onBlur,
        },
        placeholder: props.placeHolder,
        name: props.name,
        disabled: props.disabled ?? false,
      }),
      type: props.type,
    });
  }

  public render(): string {
    return `
        <label class="input__container">
          {{{Input}}}
          <div class="input__label">{{label}}</div>
        </label>
        <div class="input__error">{{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}</div>
    `;
  }
}
