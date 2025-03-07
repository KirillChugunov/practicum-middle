import Handlebars from 'handlebars'
import * as Features from './features'
import * as Shared from './shared'
import * as Pages from './pages'
import renderDOM from './shared/core/renderDom/renderDom.ts'

interface PagesMap {
  login: [typeof Pages.LoginPage]
  singIn: [typeof Pages.SingInPage]
  chatList: [typeof Pages.ChatListPage]
  userProfile: [typeof Pages.UserProfileInfoPage]
  userProfileEdit: [typeof Pages.UserProfileEditPage]
  userProfilePasswordEdit: [typeof Pages.UserProfilePasswordEditPage]
  navigate: [typeof Pages.NavigatePage]
  Error5xxPage: [typeof Pages.Error5xxPage]
  NotFoundPage: [typeof Pages.NotFoundPage]
}

const pages: PagesMap = {
  login: [Pages.LoginPage],
  singIn: [Pages.SingInPage],
  chatList: [Pages.ChatListPage],
  userProfile: [Pages.UserProfileInfoPage],
  userProfileEdit: [Pages.UserProfileEditPage],
  userProfilePasswordEdit: [Pages.UserProfilePasswordEditPage],
  navigate: [Pages.NavigatePage],
  Error5xxPage: [Pages.Error5xxPage],
  NotFoundPage: [Pages.NotFoundPage],
}

Object.entries(Shared).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return
  }
  Handlebars.registerPartial(name, template)
})
Object.entries(Features).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return
  }
  Handlebars.registerPartial(name, template)
})

function navigate(page: keyof PagesMap) {
  const [source] = pages[page]
  if (typeof source === 'function') {
    renderDOM(new source())
    return
  }

  const container = document.getElementById('app')

  const temlpatingFunction = Handlebars.compile(source)
  if (container) container.innerHTML = temlpatingFunction({})
}

document.addEventListener('DOMContentLoaded', () => navigate('navigate'))

document.addEventListener('click', (e) => {
  //@ts-expect-error заглушка до реализация роутов.
  const page = e.target.getAttribute('page')
  if (page) {
    navigate(page)

    e.preventDefault()
    e.stopImmediatePropagation()
  }
})
