import { nanoid } from 'nanoid'
import Handlebars from 'handlebars'
import EventBus from '../eventBus/eventBus.ts'

export interface BaseProps {
  className?: string
  attrs?: Record<string, string | boolean>
  events?: Record<string, EventListener>
  value?: string
  [key: string]:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | EventListener
    | undefined
    | unknown
}

export type BlockInstance = Block<any, any>

interface Meta<TProps> {
  tagName: string
  props: TProps
}

export default class Block<
  TProps extends BaseProps = Record<string, unknown>,
  TChildren extends Record<string, BlockInstance | BlockInstance[]> = Record<
    string,
    BlockInstance | BlockInstance[]
  >,
> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  }

  private _element: HTMLElement | null = null
  private _meta: Meta<TProps> | null = null
  _id: string = nanoid(6)

  children: TChildren
  props: TProps
  protected eventBus: () => EventBus<string>

  constructor(
    tagName = 'div',
    propsWithChildren: Record<string, unknown> = {},
  ) {
    const eventBus = new EventBus()
    this.eventBus = () => eventBus

    const { props, children } = this._getChildrenAndProps(propsWithChildren)
    this.children = children as TChildren

    this._meta = { tagName, props: props as TProps }
    this.props = this._makePropsProxy(props as TProps)

    this._registerEvents(eventBus)
    eventBus.emit(Block.EVENTS.INIT)
  }

  private _registerEvents(eventBus: EventBus<string>): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  private _createResources(): void {
    const { tagName, props } = this._meta!
    this._element = this._createDocumentElement(tagName)

    if (typeof props.className === 'string') {
      this._element.className = props.className
    }

    if (typeof props.attrs === 'object') {
      Object.entries(props.attrs).forEach(([attr, val]) => {
        if (typeof val === 'boolean') {
          if (val) this._element!.setAttribute(attr, '')
        } else {
          this._element!.setAttribute(attr, String(val))
        }
      })
    }
  }

  init(): void {
    this._createResources()
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
    this.dispatchComponentDidMount()
  }

  forceUpdate(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  private _getChildrenAndProps(propsAndChildren: Record<string, unknown>): {
    props: Record<string, unknown>
    children: Record<string, BlockInstance | BlockInstance[]>
  } {
    const children: Record<string, BlockInstance | BlockInstance[]> = {}
    const props: Record<string, unknown> = {}

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.every((v) => v instanceof Block)) {
          children[key] = value
        } else {
          props[key] = value
        }
      } else if (value instanceof Block) {
        children[key] = value
      } else {
        props[key] = value
      }
    })

    return { props, children }
  }

  private _componentDidMount(): void {
    this.componentDidMount()
  }

  componentDidMount(_oldProps?: TProps): void {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate(oldProps: TProps, newProps: TProps): void {
    const shouldRender = this.componentDidUpdate(oldProps, newProps)
    if (!shouldRender) return
    this._render()
  }

  componentDidUpdate(_oldProps: TProps, _newProps: TProps): boolean {
    return true
  }
  destroy(): void {
    this._removeEvents()

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((c) => c.destroy?.())
      } else {
        child.destroy?.()
      }
    })

    this._element?.remove()
  }
  renderToRoot(rootId: string): void {
    const root = document.getElementById(rootId)
    if (!root) {
      console.warn(`[Block]: Root element #${rootId} not found.`)
      return
    }

    this._removeEvents()
    const fragment = this._compile()

    this._element!.replaceChildren(fragment)
    this._addEvents()

    root.appendChild(this._element!)
  }

  setProps(nextProps: Partial<TProps>): void {
    if (!nextProps) return
    Object.assign(this.props, nextProps)
  }

  get element(): HTMLElement | null {
    return this._element
  }

  private _addEvents(): void {
    const { events = {} } = this.props
    Object.entries(events).forEach(([event, listener]) => {
      this._element?.addEventListener(event, listener)
    })
  }

  private _removeEvents(): void {
    const { events = {} } = this.props
    Object.entries(events).forEach(([event, listener]) => {
      this._element?.removeEventListener(event, listener)
    })
  }

  private _compile(): DocumentFragment {
    const propsAndStubs = { ...this.props }

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        // @ts-ignore
        propsAndStubs[key] = child
          .map((c) => `<div data-id="${c._id}"></div>`)
          .join('')
      } else {
        // @ts-ignore
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`
      }
    })

    const fragment = this._createDocumentElement(
      'template',
    ) as HTMLTemplateElement
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs)

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`,
          )
          const content = component.getContent()
          if (stub && content) {
            stub.replaceWith(content)
          }
        })
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
        const content = child.getContent()
        if (stub && content) {
          stub.replaceWith(content)
        }
      }
    })

    return fragment.content
  }

  private _render(): void {
    this._removeEvents()
    const fragment = this._compile()

    if (this._element!.children.length === 0) {
      this._element!.appendChild(fragment)
    } else {
      this._element!.replaceChildren(fragment)
    }

    this._addEvents()
  }

  render(): string {
    return ''
  }

  getContent(): HTMLElement | null {
    return this.element
  }

  private _makePropsProxy(props: TProps): TProps {
    const eventBus = this.eventBus()

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof TProps]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set(target, prop, value) {
        const oldProps = { ...target }
        const result = Reflect.set(target, prop, value)
        eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target)
        return result
      },
      deleteProperty() {
        throw new Error('Access denied')
      },
    })
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName)
  }

  show(): void {
    if (this._element) this._element.style.display = 'block'
  }

  hide(): void {
    if (this._element) this._element.style.display = 'none'
  }
}
