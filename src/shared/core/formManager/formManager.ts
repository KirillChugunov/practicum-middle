import { Block } from '@/shared'

type ValidationRules = {
  [key: string]: RegExp
}

type ErrorMessages = {
  [key: string]: string
}

type FormData = {
  formState: Record<string, string>
  errors: Record<string, string>
}

class FormManager {
  private state: FormData

  constructor() {
    this.state = {
      formState: {},
      errors: {},
    }
  }

  setField(name: string, value: string, error: string) {
    this.state.formState[name] = value
    this.state.errors[name] = error
  }

  validateField(event: Event, inputBlock: Block) {
    const input = event.target as HTMLInputElement
    if (!input) {
      inputBlock.setProps({ error: 'Поле не должно быть пустым.' })
      return
    }
    const value = input.value
    const name = input.name
    let error = ''

    const validationRules: ValidationRules = {
      first_name: /^[A-ZА-ЯЁ][a-zа-яё-]*$/u,
      second_name: /^[A-ZА-ЯЁ][a-zа-яё-]*$/u,
      login: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
      email: /^[A-Za-z0-9._-]+@[A-Za-z0-9_-]+\.[A-Za-z]+$/,
      password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
      oldPassword: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
      newPassword: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
      phone: /^\+?\d{10,15}$/,
    }

    const errorMessages: ErrorMessages = {
      first_name: 'Первая буква должна быть заглавной, без пробелов и цифр.',
      second_name: 'Первая буква должна быть заглавной, без пробелов и цифр.',
      login:
        'От 3 до 20 символов, латиница, без пробелов, допускается дефис и нижнее подчёркивание.',
      email: 'Некорректный email.',
      password: 'От 8 до 40 символов, минимум одна заглавная буква и цифра.',
      phone: 'От 10 до 15 цифр, может начинаться с +.',
    }

    if (!value.length) {
      error = 'Поле не должно быть пустым.'
    } else if (validationRules[name] && !validationRules[name].test(value)) {
      error = errorMessages[name] || 'Некорректное значение.'
    }

    inputBlock.setProps({ error })
    this.setField(name, value, error)
  }

  getState() {
    return this.state
  }

  async formSubmit(e: Event, callBack: () => void) {
    e.preventDefault()
    const hasEmptyFields = Object.values(this.state.formState).some(
      (value) => !value.trim(),
    )
    const hasErrors = Object.values(this.state.errors).some(
      (error) => error.length > 0,
    )
    if (!hasErrors && !hasEmptyFields) {
    callBack(this.state.formState)
    } else {
      console.log('form invalid:', this.state.errors)
    }
  }
}

export default FormManager
