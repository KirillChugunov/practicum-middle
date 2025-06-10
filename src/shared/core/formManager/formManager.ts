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
  isValid: boolean
}

class FormManager {
  private state: FormData
  private submitError: string | null = null

  constructor() {
    this.state = {
      formState: {},
      errors: {},
      isValid: false,
    }
  }

  registerField(name: string, value: string = '') {
    if (!(name in this.state.formState)) {
      this.state.formState[name] = value
      this.state.errors[name] = ''
    }
  }

  setField(name: string, value: string, error: string) {
    if (this.submitError) {
      this.submitError = null
    }
    this.state.formState[name] = value
    this.state.errors[name] = error
  }

  validateField(event: Event, inputBlock: Block) {
    const input = event.target as HTMLInputElement
    if (!input) return
    const value = input.value.trim()
    const name = input.name
    const { error, isValid } = this.getValidationResult(name, value)

    inputBlock.setProps({ error })
    this.setField(name, value, error)
    return isValid
  }

  private getValidationResult(name: string, value: string) {
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
      oldPassword: 'От 8 до 40 символов, минимум одна заглавная буква и цифра.',
      newPassword: 'От 8 до 40 символов, минимум одна заглавная буква и цифра.',
      phone: 'От 10 до 15 цифр, может начинаться с +.',
    }

    let error = ''
    if (!value) {
      error = 'Поле не должно быть пустым.'
    } else if (validationRules[name] && !validationRules[name].test(value)) {
      error = errorMessages[name] || 'Некорректное значение.'
    }

    return { error, isValid: error === '' }
  }

  getState() {
    return this.state
  }

  getSubmitError(): string | null {
    return this.submitError
  }

  async formSubmit<T extends unknown[]>(
    e: Event,
    callback: (...args: T) => Promise<void>,
    ...args: T
  ): Promise<boolean> {
    e.preventDefault()
    this.submitError = null

    let hasErrors = false

    for (const [name, value] of Object.entries(this.state.formState)) {
      const { error } = this.getValidationResult(name, value)
      this.state.errors[name] = error
      if (error) hasErrors = true
    }

    const hasEmptyFields = Object.values(this.state.formState).some(
      (v) => !v.trim(),
    )

    const isValid = !hasErrors && !hasEmptyFields
    this.state.isValid = isValid

    if (!isValid) {
      console.warn('Форма невалидна:', this.state.errors)
      return false
    }

    try {
      await callback(...args)
      this.submitError = null
    } catch (err) {
      console.error('Ошибка в сабмите формы:', err)
      this.submitError = err instanceof Error ? err.message : String(err)
      return false
    }

    return true
  }
}

export default FormManager
