import * as Pages from '@/pages'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'

const publicRoutes = ['/', '/login', '/signin']

const isAuthenticated = () => userStore.getState().isAuth

export const initRouter = () => {
  const pages = {
    '/': Pages.LoginPage,
    '/login': Pages.LoginPage,
    '/signin': Pages.SingInPage,
    '/chatlist': Pages.ChatListPage,
    '/userprofile': Pages.UserProfileInfoPage,
    '/userprofileedit': Pages.UserProfileEditPage,
    '/userprofilepasswordedit': Pages.UserProfilePasswordEditPage,
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
    return originalGetRoute(pathname) || router.getRoute('/404')
  }

  const initialPath = window.location.pathname
  const isAuth = isAuthenticated()

  if (isAuth && publicRoutes.includes(initialPath)) {
    router.go('/chatlist')
  } else if (!isAuth && !publicRoutes.includes(initialPath)) {
    router.go('/')
  } else {
    router.start()
  }
}
