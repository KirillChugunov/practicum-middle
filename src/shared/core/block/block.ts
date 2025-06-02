import { nanoid } from 'nanoid'
import Handlebars from 'handlebars'
import EventBus from '../eventBus/eventBus.ts'

export interface Props {
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

interface Children {
  [key: string]: Block | Block[]
}

interface Meta {
  tagName: string
  props: Props
}

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  }

  private _element: HTMLElement | null = null
  private _meta: Meta | null = null
  _id: string = nanoid(6)
  protected children: Children = {}
  props: Props
  protected eventBus: () => EventBus<string>

  constructor(tagName = 'div', propsWithChildren: Record<string, unknown> = {}) {
    const eventBus = new EventBus()
    this.eventBus = () => eventBus

    const { props, children } = this._getChildrenAndProps(propsWithChildren)
    this.children = children

    this._meta = { tagName, props }
    this.props = this._makePropsProxy(props)

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

  private _getChildrenAndProps(
    propsAndChildren: Record<string, unknown> = {},
  ): { children: Children; props: Props } {
    const children: Children = {}
    const props: Props = {}

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.every((v) => v instanceof Block)) {
          children[key] = value
        } else {
          props[key] = value
        }
        return
      }

      if (value instanceof Block) {
        children[key] = value
      } else {
        props[key] = value
      }
    })

    return { children, props }
  }

  private _componentDidMount(): void {
    this.componentDidMount()
  }

  componentDidMount(_oldProps?: Props): void {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const shouldRender = this.componentDidUpdate(oldProps, newProps)
    if (!shouldRender) return
    this._render()
  }

  componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    // ⬇️ универсальное обновление DOM-атрибутов
    if (this._element && this._meta?.tagName !== 'template') {
      const oldAttrs = oldProps.attrs ?? {}
      const newAttrs = newProps.attrs ?? {}

      // Удаляем старые
      Object.keys(oldAttrs).forEach((key) => {
        if (!(key in newAttrs)) {
          this._element!.removeAttribute(key)
        }
      })

      // Обновляем или добавляем новые
      Object.entries(newAttrs).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) {
            this._element!.setAttribute(key, '')
          } else {
            this._element!.removeAttribute(key)
          }
        } else {
          this._element!.setAttribute(key, String(value))
        }
      })

      // Обновляем значение input, если указано
      if (
        this._element instanceof HTMLInputElement &&
        typeof newProps.value === 'string'
      ) {
        this._element.value = newProps.value
      }
    }

    return true
  }

  setProps(nextProps: Partial<Props>): void {
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
        propsAndStubs[key] = child
          .map((c) => `<div data-id="${c._id}"></div>`)
          .join('')
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`
      }
    })

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs)

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(`[data-id="${component._id}"]`)
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

  private _makePropsProxy(props: Props): Props {
    const eventBus = this.eventBus()

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof Props]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set(target, prop, value) {
        const oldProps = { ...target }
        target[prop as keyof Props] = value
        eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target)
        return true
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
