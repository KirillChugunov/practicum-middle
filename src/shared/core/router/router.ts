import { Route } from './route'
import { Block } from '@shared'

type BlockConstructor = new () => Block

interface RouteOptions {
  guard?: () => boolean
}

export class Router {
  private static __instance: Router
  private history: History = window.history
  private routes: Route[] = []
  private _currentRoute: Route | null = null
  private _rootQuery!: string

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance
    }

    this._rootQuery = rootQuery
    this.routes = []
    this.history = window.history
    this._currentRoute = null

    Router.__instance = this
  }

  use(pathname: string, block: BlockConstructor, options: RouteOptions = {}): this {
    const route = new Route(pathname, block, {
      rootQuery: this._rootQuery,
      guard: options.guard,
    })

    this.routes.push(route)
    return this
  }

  start(): void {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname)
    }

    this._onRoute(window.location.pathname)
  }

  private _onRoute(pathname: string): void {
    let route = this.getRoute(pathname)

    if (!route) {
      const fallback = this.getRoute('/404')
      if (fallback && pathname !== '/404') {
        this.go('/404')
      }
      return
    }

    const guard = route.getGuard?.()
    const isAllowed = guard ? guard() : true

    if (guard && !isAllowed) {
      if (pathname !== '/' && window.location.pathname !== '/') {
        this.go('/')
      }
      return
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    route.render(this, pathname)
  }

  go(pathname: string): void {
    if (this._currentRoute?.match(pathname)) return
    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back(): void {
    this.history.back()
  }

  forward(): void {
    this.history.forward()
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname))
  }
}

const router = new Router('#app')
export default router
