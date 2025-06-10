import { render } from '../renderDom/renderDom.ts'
import { isEqual } from '../../utils/isEqual.ts'
import { Block } from '@shared'

type BlockConstructor = new () => Block

interface RouteProps {
  rootQuery: string
  isProtected: boolean
}

export class Route {
  private _pathname: string
  private _blockClass: BlockConstructor
  private _block: Block | null
  private _props: RouteProps

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this._pathname = pathname
    this._blockClass = view
    this._block = null
    this._props = props
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname
      this.render()
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide()
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname)
  }

  render(): void {
    console.log('[Route] rendering', this._pathname)

    if (!this._block) {
      console.log('[Route] creating block')
      this._block = new this._blockClass()
      render(this._props.rootQuery, this._block)
      return
    }

    console.log('[Route] showing block')
    this._block.show()
  }
}
