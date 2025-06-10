export function mountToPortal(element: HTMLElement): void {
  let portalRoot = document.getElementById('modal-root')
  if (!portalRoot) {
    portalRoot = document.createElement('div')
    portalRoot.id = 'modal-root'
    document.body.appendChild(portalRoot)
  }

  portalRoot.appendChild(element)
}

export function unmountFromPortal(element: HTMLElement): void {
  element.remove()
}
