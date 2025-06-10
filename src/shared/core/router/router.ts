import { Route } from './route'
import { Block } from '@shared'
import userStore from '@/store/userStore/userStore.ts'

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

  use(
    pathname: string,
    block: BlockConstructor,
    options: RouteOptions = {},
  ): this {
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
    const isAuth = userStore.getState().isAuth
    const publicPaths = ['/login', '/sign-up']

    if (pathname === '/') {
      this.go(isAuth ? '/messenger' : '/login')
      return
    }

    let route = this.getRoute(pathname)

    if (!route) {
      route = this.getRoute('/404')
      if (!route) return
    }

    const guard = route.getGuard?.()
    const isProtected = !!guard
    const isAllowed = guard ? guard() : true

    if (isProtected && !isAllowed) {
      if (pathname !== '/login') {
        this.go('/login')
      }
      return
    }

    if (!isProtected && isAllowed && publicPaths.includes(pathname) && pathname !== '/messenger') {
      this.go('/messenger')
      return
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    route.render(this, pathname)
  }

  go(pathname: string): void {
    if (window.location.pathname === pathname) return
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
