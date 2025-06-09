import { render } from '../renderDom/renderDom.ts';
import { isEqual } from '../../utils/isEqual.ts';
import { Block } from '@shared'


type BlockConstructor = new () => Block;

interface RouteProps {
  rootQuery: string;
  guard?: () => boolean;
}

interface RouterInstance {
  go: (pathname: string) => void;
}

export class Route {
  private _pathname: string;
  private _blockClass: BlockConstructor;
  private _block: Block | null;
  private _props: RouteProps;
  private _guard?: () => boolean;

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
    this._guard = props.guard;
  }

  navigate(pathname: string, routerInstance: RouterInstance): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render(routerInstance, pathname);
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render(routerInstance: RouterInstance, _pathname: string): void {
    if (this._guard && !this._guard()) {
      routerInstance.go('/');
      return;
    }

    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
