import Block from "../../core/block/block.ts";

type TButton = {
    type: string;
    variant: string;
    onClick: (e:Event) => void;
    label: string;
}
export default class Button extends Block {
    constructor(props: TButton) {
        super("button", {
            ...props,
            className: `button button__${props.variant}`,
            events: {
                click: props.onClick,
            },
            label: props.label,
            attrs:{
                type: props.type,
            }
        });
    }

    public render(): string {
        return `
      {{label}}
    `;
    }
}
