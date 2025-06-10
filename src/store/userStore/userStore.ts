import httpTransport from '@/shared/core/api/HTTPTransport'
import { apiConfig } from '@/shared/constants/api'
import Store from '@/shared/core/store/store.ts'
import router from '@/shared/core/router/router.ts'
import defaultAvatar from '@/assets/icons/picture.svg'
import { errorToast } from '@/shared/ui/errorToast/errorToast.ts'

export type TUser = {
  avatar: string
  display_name: string
  email: string
  first_name: string
  id: string
  login: string
  phone: string
  second_name: string
  isAuth: boolean
}

const defaultUser: TUser = {
  avatar: defaultAvatar,
  display_name: '',
  email: '',
  first_name: '',
  id: '',
  login: '',
  phone: '',
  second_name: '',
  isAuth: false,
}

type LoginPayload = Record<string, string>

type ProfileUpdatePayload = {
  first_name: string
  second_name: string
  display_name?: string
  login: string
  email: string
  phone: string
}

type PasswordUpdatePayload = {
  oldPassword: string
  newPassword: string
}

class UserStore extends Store<TUser> {
  constructor() {
    super(defaultUser)
  }

  public async login(formState: LoginPayload): Promise<void> {
    try {
      const res = await httpTransport.post(apiConfig.signIn, {
        data: formState,
      })

      if (res.status === 200 || res.status === 201) {
        await this.loadUser()
        this.setState({ ...this.getState(), isAuth: true })
        router.go('/messenger')
      } else {
        errorToast.showToast(`Авторизация не удалась: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при авторизации: ${error}`)
    }
  }

  public async logOut(): Promise<void> {
    try {
      const res = await httpTransport.post(apiConfig.logout)
      if (res.status === 200 || res.status === 201) {
        this.resetUser()
        router.go('/login')
      } else {
        errorToast.showToast(`Выход не удался: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при выходе: ${error}`)
    }
  }

  public async loadUser(): Promise<void> {
    try {
      const res = await httpTransport.get(apiConfig.getUserInfo)
      if (res.status === 200 || res.status === 201) {
        const user: Omit<TUser, 'isAuth'> = JSON.parse(res.responseText)
        this.setState({
          ...user,
          avatar: user.avatar
            ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
            : defaultAvatar,
          isAuth: true,
        })
      } else {
        errorToast.showToast(`Ошибка загрузки пользователя: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при получении пользователя: ${error}`)
    }
  }

  public resetUser(): void {
    this.setState(defaultUser)
  }

  public async updateProfile(profileData: ProfileUpdatePayload): Promise<void> {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([, v]) => v !== undefined),
      )

      const res = await httpTransport.put(apiConfig.updateProfile, {
        data: cleanData,
      })

      if (res.status === 200) {
        const user: Omit<TUser, 'isAuth'> = JSON.parse(res.responseText)
        this.setState({
          ...user,
          avatar: user.avatar
            ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
            : defaultAvatar,
          isAuth: true,
        })
        errorToast.showToast('Профиль успешно обновлён')
      } else {
        errorToast.showToast(`Ошибка при обновлении профиля: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при изменении профиля: ${error}`)
    }
  }

  public async updatePassword(
    profileData: PasswordUpdatePayload,
  ): Promise<void> {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([, v]) => v !== undefined),
      )

      const res = await httpTransport.put(apiConfig.updatePassword, {
        data: cleanData,
      })

      if (res.status === 200) {
        errorToast.showToast('Пароль успешно обновлён')
      } else {
        errorToast.showToast(`Ошибка при обновлении пароля: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при изменении пароля: ${error}`)
    }
  }

  public async updateAvatar(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await httpTransport.put(apiConfig.updateAvatar, {
        data: formData,
      })

      if (res.status === 200) {
        const user: Omit<TUser, 'isAuth'> = JSON.parse(res.responseText)
        this.setState({
          ...user,
          avatar: user.avatar
            ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
            : defaultAvatar,
          isAuth: true,
        })
        errorToast.showToast('Аватар успешно обновлён')
      } else {
        errorToast.showToast(`Ошибка при обновлении аватара: ${res.status}`)
      }
    } catch (error) {
      errorToast.showToast(`Ошибка при загрузке аватара: ${error}`)
    }
  }
}

const userStore = new UserStore()
export default userStore
