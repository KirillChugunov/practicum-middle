import userStore from '@/store/userStore/userStore.ts'
import { Modal } from '@shared'
import modalService from '@/shared/core/modalService/modalService.ts'
import router from '@/shared/core/router/router.ts'
import { initRouter } from '@/shared/core/router/utils/initRouter.ts'
import { errorToast } from '@/shared/ui/errorToast/errorToast.ts'

userStore.loadUser().finally(() => {
  console.log("init")
  initRouter()
})

document.addEventListener('DOMContentLoaded', () => {
  errorToast.renderToRoot('app')
})

document.addEventListener('click', (event) => {
  let target = event.target as HTMLElement | null
  while (target && target !== document.body) {
    if (target.tagName === 'A' && target.getAttribute('href')) {
      const href = target.getAttribute('href')
      if (href?.startsWith('/')) {
        event.preventDefault()
        router.go(href)
        return
      }
    }
    target = target.parentElement
  }
})

const globalModal = new Modal({
  onClose: () => modalService.close(),
})

modalService.register()
document.body.appendChild(globalModal.getContent()!)
