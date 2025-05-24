import profilePicture from '../../../assets/icons/picture.svg'
import { Block, Button, FormManager, InputField } from '@shared'
import { UserProfileEditGoBack, UserProfileTitles } from '@/features'
import httpTransport from '@/shared/core/api/HTTPTransport.ts'
import { apiConfig } from '@/shared/constants/api.ts'

export default class UserProfilePreview extends Block {
  constructor() {
    const formManager = new FormManager()
    super('div', {
      className: 'user-profile__container',
      GoBackButton: new UserProfileEditGoBack(),
      ProfileTitles: new UserProfileTitles({
        name: 'userName',
        profilePicture,
      }),
      Email: new InputField({
        label: 'email',
        type: 'email',
        onBlur: (e: Event) => {
          if (this.children.Email instanceof InputField)
            formManager.validateField(e, this.children.Email)
        },
        name: 'email',
        placeHolder: 'Почта',
        disabled: true,
        profile: true,
      }),
      Login: new InputField({
        label: 'Логин',
        name: 'login',
        onBlur: (e: Event) => {
          if (this.children.Login instanceof InputField)
            formManager.validateField(e, this.children.Login)
        },
        type: 'text',
        disabled: true,
        placeHolder: 'Логин',
        profile: true,
      }),
      FirstName: new InputField({
        label: 'Имя',
        type: 'text',
        onBlur: (e: Event) => {
          if (this.children.FirstName instanceof InputField)
            formManager.validateField(e, this.children.FirstName)
        },
        name: 'first_name',
        disabled: true,
        placeHolder: 'Имя',
        profile: true,
      }),
      SecondName: new InputField({
        label: 'Фамилия',
        type: 'text',
        onBlur: (e: Event) => {
          if (this.children.SecondName instanceof InputField)
            formManager.validateField(e, this.children.SecondName)
        },
        name: 'second_name',
        disabled: true,
        placeHolder: 'Фамилия',
        profile: true,
      }),
      ChatName: new InputField({
        label: 'Имя в чате',
        type: 'text',
        onBlur: (e: Event) => {
          if (this.children.ChatName instanceof InputField)
            formManager.validateField(e, this.children.ChatName)
        },
        name: 'display_name',
        disabled: true,
        placeHolder: 'Имя в чате',
        profile: true,
      }),
      Phone: new InputField({
        label: 'Телефон',
        type: 'phone',
        onBlur: (e: Event) => {
          if (this.children.Phone instanceof InputField)
            formManager.validateField(e, this.children.Phone)
        },
        name: 'phone',
        disabled: true,
        placeHolder: 'Телефон',
        profile: true,
      }),
      ButtonSubmitEdit: new Button({
        label: 'Сохранить',
        variant: 'primary',
        type: 'submit',
        onClick: (e: Event) => {
          console.log(e.target)
        },
      }),
    })
    this.handleGetUserInfo()
  }

  user = {}

  async handleGetUserInfo() {
    const setInputProps = (input, props) => {
      if (input instanceof InputField) {
        input.setProps({ placeHolder: props })
      }
    }
    try {
      const res = await httpTransport.get(
        apiConfig.getUserInfo,
      )
      if (res.status === 200 || res.status === 201) {
        this.user = JSON.parse(res.responseText)
        console.log('this.user', this.user)
        console.log('childrem', this.children)
        setInputProps(this.children.Email, this.user.email),
          setInputProps(this.children.Login, this.user.Login),
          setInputProps(this.children.FirstName, this.user.FirstName),
          setInputProps(this.children.SecondName, this.user.SecondName),
          setInputProps(this.children.ChatName, this.user.ChatName),
          setInputProps(this.children.Phone, this.user.Phone)
      } else {
        console.error('Авторизация не удалась:', res.status, res.responseText)
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error)
    }
  }

  render() {
    return `
      {{{ GoBackButton }}}
      <section class="user-profile__info">
        {{{ ProfileTitles }}}
        <form class="user-profile-password-edit__grid">
          {{{ Email }}}
          {{{ Login }}}
          {{{ FirstName }}}
          {{{ SecondName }}}
          {{{ ChatName }}}
          {{{ Phone }}}
        </form>
        <section class="user-profile__grid user_profile__actions">
          <div class="user-profile__item"><a href="/userprofileedit">Изменить данные</a></div>
          <div class="user-profile__item"><a href="/userprofilepasswordedit">Изменить пароль</a></div>
          <div class="user-profile__item">
            <a class="user-profile__item_color-red">Выйти</a>
          </div>
        </section>
      </section>
    `
  }
}
