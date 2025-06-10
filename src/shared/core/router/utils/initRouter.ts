import * as Pages from '@/pages'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'

const publicRoutes = ['/login', '/sign-up']

const isAuthenticated = () => userStore.getState().isAuth

export const initRouter = () => {
  const pages = {
    '/login': Pages.LoginPage,
    '/sign-up': Pages.SingInPage,
    '/messenger': Pages.ChatListPage,
    '/settings': Pages.UserProfileInfoPage,
    '/settings/edit': Pages.UserProfileEditPage,
    '/settings/password': Pages.UserProfilePasswordEditPage,
    '/error': Pages.Error5xxPage,
    '/404': Pages.NotFoundPage,
  }

  for (const [path, Component] of Object.entries(pages)) {
    const isPublic = publicRoutes.includes(path)
    router.use(path, Component, {
      guard: isPublic ? undefined : isAuthenticated,
    })
  }

  const originalGetRoute = router.getRoute.bind(router)

  router.getRoute = (pathname: string) => {
    if (pathname === '/') {
      return undefined
    }

    return originalGetRoute(pathname) || originalGetRoute('/404')
  }

  const initialPath = window.location.pathname
  const isAuth = isAuthenticated()

  if (isAuth && publicRoutes.includes(initialPath)) {
    router.go('/messenger')
  } else if (!isAuth && !publicRoutes.includes(initialPath)) {
    router.go('/login')
  } else {
    router.start()
  }
}
