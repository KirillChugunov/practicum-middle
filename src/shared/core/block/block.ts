import { nanoid } from 'nanoid'
import Handlebars from 'handlebars'
import EventBus from '../eventBus/eventBus.ts'

export interface Props {
  className?: string
  attrs?: Record<string, string>
  events?: Record<string, EventListener>
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

  constructor(tagName: string = 'div', propsWithChildren: Record<string, unknown> = {}) {
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
      const classes = props.className.split(' ')
      this._element.classList.add(...classes)
    }

    if (typeof props.attrs === 'object') {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        this._element!.setAttribute(attrName, attrValue)
      })
    }
  }

  init(): void {
    this._createResources()
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  private _getChildrenAndProps(propsAndChildren: Record<string, unknown> = {}): { children: Children; props: Props } {
    const children: Children = {}
    const props: Props = {}

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.every((v) => v instanceof Block)) {
          children[key] = value as Block[]
        } else {
          props[key] = value
        }
      } else if (value instanceof Block) {
        children[key] = value
      } else {
        props[key] = value
      }
    })

    return { children, props }
  }

  private _componentDidMount(): void {
    this.componentDidMount()

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => component.dispatchComponentDidMount())
      } else {
        child.dispatchComponentDidMount()
      }
    })
  }

  componentDidMount(): void {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps)
    if (shouldUpdate) {
      this._render()
    }
  }

  componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    return true
  }

  // 🔥 Рекурсивный setProps
  setProps(nextProps: Partial<Props>): void {
    if (!nextProps) return

    const oldProps = { ...this.props }
    Object.assign(this.props, nextProps)

    // Обновление DOM-атрибутов, если передан props.attrs
    if (nextProps.attrs && this._element) {
      Object.entries(nextProps.attrs).forEach(([key, value]) => {
        this._element!.setAttribute(key, value)
      })
    }

    // 🔁 Рекурсивная передача пропсов в детей
    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => component.setProps(nextProps))
      } else {
        child.setProps(nextProps)
      }
    })
  }

  get element(): HTMLElement | null {
    return this._element
  }

  private _addEvents(): void {
    const { events = {} } = this.props

    Object.entries(events).forEach(([eventName, listener]) => {
      this._element!.addEventListener(eventName, listener)
    })
  }

  private _removeEvents(): void {
    const { events = {} } = this.props

    Object.entries(events).forEach(([eventName, listener]) => {
      this._element!.removeEventListener(eventName, listener)
    })
  }

  private _compile(): DocumentFragment {
    const propsAndStubs = { ...this.props }

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map((component) => `<div data-id="${component._id}"></div>`)
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`
      }
    })

    const fragment = this._createDocumentElement('template')

    if (fragment instanceof HTMLTemplateElement) {
      const template = Handlebars.compile(this.render())
      fragment.innerHTML = template(propsAndStubs)

      Object.values(this.children).forEach((child) => {
        if (Array.isArray(child)) {
          child.forEach((component) => {
            const stub = fragment.content.querySelector(`[data-id="${component._id}"]`)
            const content = component.getContent()
            if (stub && content) stub.replaceWith(content)
          })
        } else {
          const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
          const content = child.getContent()
          if (stub && content) stub.replaceWith(content)
        }
      })

      return fragment.content
    }

    throw new Error('Expected HTMLTemplateElement')
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
      get(target, prop: string) {
        const value = target[prop as keyof Props]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set(target, prop: string, value) {
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
    return tagName === 'template'
      ? document.createElement('template')
      : document.createElement(tagName)
  }

  show(): void {
    this.getContent()!.style.display = 'block'
  }

  hide(): void {
    this.getContent()!.style.display = 'none'
  }
}
