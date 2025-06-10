type Listener<T> = (state: T) => void

export default class Store<T extends Record<string, unknown>> {
  private state: T
  private listeners: Set<Listener<T>> = new Set()

  constructor(initialState: T) {
    this.state = { ...initialState }
  }

  getState(): T {
    return { ...this.state }
  }

  setState(nextState: Partial<T>): void {
    this.state = { ...this.state, ...nextState }
    this.emit()
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.getState())
    }
  }
}
