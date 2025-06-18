import { Route } from '@/shared/core/router/route.ts'
import { Block } from '@shared'
import userStore from '@/store/userStore/userStore.ts'

type BlockConstructor = new () => Block

class Router {
  private static __instance: Router
  private routes: Route[] = []
  private history: History = window.history
  private _currentRoute: Route | null = null
  private _rootQuery!: string

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance
    }

    this.routes = []
    this.history = window.history
    this._currentRoute = null
    this._rootQuery = rootQuery

    Router.__instance = this
  }

  use(pathname: string, block: BlockConstructor, isProtected: boolean): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery, isProtected: isProtected})
    this.routes.push(route)
    return this
  }

  start(): void {
    window.onpopstate = ((event: PopStateEvent) => {
      const target = event.currentTarget as Window
      this._onRoute(target.location.pathname)
    }).bind(this)

    this._onRoute(window.location.pathname)
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname)
    if (!route) return

    const isAuth = userStore.getState().isAuth
    const isProtected = (route as any)._props?.isProtected


    if (isProtected && !isAuth) {
      if (pathname !== '/') {
        this.go('/')
      }
      return
    }

    if (!isProtected && isAuth) {
      if (pathname !== '/messenger') {
        this.go('/messenger')
      }
      return
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    route.render()
  }

  go(pathname: string): void {
    if (this._currentRoute?.match(pathname)) {
      return
    }
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
    const found = this.routes.find(route => route.match(pathname))
    return found
  }
}

const router = new Router('#app')
export default router
