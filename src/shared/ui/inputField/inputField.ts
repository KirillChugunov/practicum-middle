import Block from "../../core/block/block.ts";
import {Input} from "../input";
import EventBus from "@/shared/core/eventBus/eventBus.ts";

type TInputFieldProps = {
    label: string;
    placeHolder?: string;
    name: string;
    type: string;
    disabled?: boolean;
    onBlur: (e: Event) => void;
    eventBus?: EventBus<"submit">;
    profile?: boolean;
    className?: string;
};

export default class InputField extends Block {
    constructor(props: TInputFieldProps) {
        super("div", {
            ...props,
            className: props.className ?? "input",
            label: props.label,
            error: "",
            Input: new Input({
                events: {
                    blur: props.onBlur,
                },
                placeholder: props.placeHolder,
                name: props.name,
                disabled: props.disabled ?? false,
                ...(props.profile ? {className: "profile_input"} : {})
            }),
            type: props.type,
        });
        props.eventBus?.on("submit", () => {
            const inputElement = this.getContent()?.querySelector("input");
            if (inputElement) {
                props.onBlur({target: inputElement} as unknown as Event);
            }
        });

    }

    public render(): string {
        return `
  {{#if profile }}
    <label><p>{{label}}</p></label>
   {{{ Input }}}
      <div class="input__error">{{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}</div>
     {{else }}
        <label class="input__container">
          <label class="input__container">
          {{{Input}}}
          <div class="input__label">{{label}}</div>
        </label>
        <div class="input__error">{{#if error}}<p class="input__text-error">{{error}}</p>{{/if}}</div>
            {{/if }}
    `;
    }
}
