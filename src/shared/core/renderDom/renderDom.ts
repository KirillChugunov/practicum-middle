import Block from '../block/block.ts'

export default function renderDOM(block: Block): void {
  const root: HTMLElement | null = document.querySelector('#app')

  if (root) root.innerHTML = ''
  const content = block.getContent()

  if (content && root) {
    root.appendChild(content)
  }
}

export function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector(query)

  if (!(root instanceof HTMLElement)) {
    return null
  }

  const content = block.getContent()

  if (content) {
    root.appendChild(content)
  }
  block.dispatchComponentDidMount()

  return root
}
