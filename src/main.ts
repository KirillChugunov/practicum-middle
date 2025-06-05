import * as Pages from './pages'
import router from '@/shared/core/router/router.ts'
import userStore from '@/store/userStore/userStore.ts'
import { Block, Modal } from '@shared'
import modalService from '@/shared/core/modalService/modalService.ts'

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
    console.log(route);
    router.use(`/${route.toLowerCase()}`, block);
  }
  router.start()
}
initRouter();
userStore.loadUser()
document.addEventListener('click', (event) => {
  let target = event.target;
  while (target && target !== document) {
    if (target.tagName === 'A' && target.getAttribute('href')) {
      const href = target.getAttribute('href');
      if (href.startsWith('/')) {
        event.preventDefault();
        router.go(href);
        return;
      }
    }
    target = target.parentNode;
  }
});

const globalModal = new Modal({
  onClose: () => modalService.close(),
});

modalService.register(globalModal);
document.body.appendChild(globalModal.getContent()!);