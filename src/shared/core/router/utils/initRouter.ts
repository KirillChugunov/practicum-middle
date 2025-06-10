import * as Pages from '@/pages'
import router from '@/shared/core/router/router.ts'
const publicRoutes = ['/', '/sign-up']


export const initRouter = () => {
  const pages = {
    '/': Pages.LoginPage,
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
    router.use(path, Component, !isPublic)
  }

  const originalGetRoute = router.getRoute.bind(router)
  router.getRoute = (pathname: string) => {
    return originalGetRoute(pathname) || router.getRoute('/404')
  }
   router.start()
}
