import * as Pages from './pages'
import router from '@/shared/core/router/router.ts'

interface PagesMap {
  login: typeof Pages.LoginPage
  singIn: typeof Pages.SingInPage
  chatList: typeof Pages.ChatListPage
  userProfile: typeof Pages.UserProfileInfoPage
  userProfileEdit: typeof Pages.UserProfileEditPage
  userProfilePasswordEdit: typeof Pages.UserProfilePasswordEditPage
  Error5xxPage: typeof Pages.Error5xxPage
  NotFoundPage: typeof Pages.NotFoundPage
}
const pages: PagesMap = {
  login: Pages.LoginPage,
  singIn: Pages.SingInPage,
  chatList: Pages.ChatListPage,
  userProfile: Pages.UserProfileInfoPage,
  userProfileEdit: Pages.UserProfileEditPage,
  userProfilePasswordEdit: Pages.UserProfilePasswordEditPage,
  Error5xxPage: Pages.Error5xxPage,
  NotFoundPage: Pages.NotFoundPage,
}
const initRouter = () => {
  for (const [route, block] of Object.entries(pages)) {
    if (route === "login") {
      router.use("/", block)
    }
    router.use(route, block)
  }
  router.start()
}
initRouter();

