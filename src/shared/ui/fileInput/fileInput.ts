import Block from '@/shared/core/block/block'

type FileInputProps = {
  name: string
  accept?: string
  onChange: (file: File | null) => void
  className?: string
}

export default class FileInput extends Block {
  constructor({ name, accept = '*', onChange, className }: FileInputProps) {
    super('input', {
      attrs: {
        type: 'file',
        name,
        class: className ?? 'file-input',
        accept,
      },
      events: {
        change: (e: Event) => {
          const target = e.target as HTMLInputElement
          const file = target.files?.[0] || null
          onChange(file)
        },
      },
    })
  }
}
