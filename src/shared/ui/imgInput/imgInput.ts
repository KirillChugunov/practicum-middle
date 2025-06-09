import Block from '@/shared/core/block/block.ts'

type DragDropInputProps = {
  onFileDrop: (file: File) => void
  className?: string
}

export default class ImgInput extends Block {
  constructor(props: DragDropInputProps) {
    super('div', {
      attrs: {
        class: props.className || 'drag-drop-input',
      },
      events: {
        dragover: (e: DragEvent) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).classList.add('drag-over')
        },
        dragleave: (e: DragEvent) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).classList.remove('drag-over')
        },
        drop: (e: DragEvent) => {
          e.preventDefault()
          const files = e.dataTransfer?.files
          if (files && files.length > 0) {
            props.onFileDrop(files[0])
          }
          ;(e.currentTarget as HTMLElement).classList.remove('drag-over')
        },
      },
    })
  }
}
