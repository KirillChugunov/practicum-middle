import * as Pages from '@/pages'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'

const publicRoutes = ['/', '/sign-up']
const isAuthenticated = () => userStore.getState().isAuth

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
    router.use(path, Component, {
      guard: isPublic ? undefined : isAuthenticated,
    })
  }

  router.start()
}
