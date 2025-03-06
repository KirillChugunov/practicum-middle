import Handlebars, { HelperOptions } from "handlebars";
import Block from "../block/block.ts";

interface BlockConstructable<P = PropsBlock> {
  new (props: P): Block;
}

export interface PropsBlock {
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, EventListener>;
  children?: Record<string, Block | Block[]>;
  [key: string]: unknown;
}

export default function registerComponent<Props extends PropsBlock>(
  Component: BlockConstructable<Props>,
) {
  Handlebars.registerHelper(
    Component.name,
    function (
      this: Props,
      { hash: { ref, ...hash }, data, fn }: HelperOptions,
    ) {
      if (!data.root.children) {
        data.root.children = {};
      }

      if (!data.root.refs) {
        data.root.refs = {};
      }

      const { children, refs } = data.root;

      /**
       * Костыль для того, чтобы передавать переменные
       * внутрь блоков вручную подменяя значение
       */
      (Object.keys(hash) as Array<keyof Props>).forEach((key) => {
        if (this[key] && typeof this[key] === "string") {
          hash[key] = hash[key].replace(
              new RegExp(`{{${String(key)}}}`, "i"),
              this[key] as string
          );
        }
      });
      const component = new Component(hash);

      children[component._id] = component;

      if (ref) {
        refs[ref] = component.getContent();
      }

      const contents = fn ? fn(this) : "";

      return `<div data-id="${component._id}">${contents}</div>`;
    },
  );
}
