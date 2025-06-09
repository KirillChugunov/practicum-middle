import GoBackIcon from '../../../assets/icons/arrow.svg'
import { Block, IconButton } from '@shared'
import router from '@/shared/core/router/router.ts'

type TUserProfileEditGoBackProps = Record<string, never>

type TUserProfileEditGoBackChildren = {
  GoBackButton: IconButton
}

export default class UserProfileEditGoBack extends Block<
  TUserProfileEditGoBackProps,
  TUserProfileEditGoBackChildren
> {
  constructor() {
    super('div', {
      className: 'user-profile__go-back',
      GoBackButton: new IconButton({
        direction: 'left',
        alt: 'назад',
        buttonIcon: GoBackIcon,
        onClick: () => router.back(),
      }),
    })
  }

  override render(): string {
    return `
      {{{ GoBackButton }}}
    `
  }
}
