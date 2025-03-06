import {Block, Button} from "@shared";

type TErrorCircle = {
    error: string,
    title: string
}
class ErrorCircle extends Block {
    constructor(props: TErrorCircle) {
        super("div", {
            ...props,
            className: "error-circle",
            RedirectButton: new Button({
                variant: "link",
                label: "Назад к чатам",
                type: "link",
                onClick: () => console.log("test")
            })
        });
    }

    public render(): string {
        return `
              <h1>{{error }}</h1>
              <h2>{{title }}</h2>
              {{{RedirectButton }}}
    `;
    }
}

export default ErrorCircle;