import GoBackIcon from '../../../assets/icons/arrow.svg'
import { Block, IconButton } from '@shared'
import router from '@/shared/core/router/router.ts'

export default class UserProfileEditGoBack extends Block {
  constructor() {
    super('div', {
      className: `user-profile__go-back`,
      GoBackButton: new IconButton({
        direction: 'left',
        alt: 'назад',
        buttonIcon: GoBackIcon,
        onClick: () => router.back(),
      }),
    })
  }

  render() {
    return `
            {{{ GoBackButton }}}
        `
  }
}
