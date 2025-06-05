import httpTransport from '@/shared/core/api/HTTPTransport'
import { apiConfig } from '@/shared/constants/api'
import Store from '@/shared/core/store/store.ts'
import router from '@/shared/core/router/router.ts'

// Тип пользователя
export type User = {
  avatar: string
  display_name: string
  email: string
  first_name: string
  id: string
  login: string
  phone: string
  second_name: string
}

// Начальное значение
const defaultUser: User = {
  avatar: '',
  display_name: '',
  email: '',
  first_name: '',
  id: "",
  login: '',
  phone: '',
  second_name: '',
}

class UserStore extends Store<User> {
  constructor() {
    super(defaultUser)
  }
  async login(formState: Record<string, string>): Promise<void> {
    try {
      const res = await httpTransport.post(
        apiConfig.signIn,
        {
          data: formState,
        },
      )
      if (res.status === 200 || res.status === 201) {
        await this.loadUser()
        router.go('/chatlist')
      } else {
        console.error('Авторизация не удалась:', res.status, res.responseText)
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error)
    }
  }
  async logOut(formState: Record<string, string>): Promise<void> {
    try {
      const res = await httpTransport.post(
        apiConfig.signIn,
        {
          data: formState,
        },
      )
      if (res.status === 200 || res.status === 201) {
        router.go('/chatlist')
      } else {
        console.error('Авторизация не удалась:', res.status, res.responseText)
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error)
    }
  }
  async loadUser(): Promise<void> {
    try {
      const res = await httpTransport.get(apiConfig.getUserInfo)

      if (res.status === 200 || res.status === 201) {
        const user: User = JSON.parse(res.responseText)
        this.setState(user)
      } else {
        console.error('Ошибка загрузки пользователя:', res.status)
      }
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error)
    }
  }

  resetUser(): void {
    this.setState(defaultUser)
  }
}

const userStore = new UserStore()
export default userStore
