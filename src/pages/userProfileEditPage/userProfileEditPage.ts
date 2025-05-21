import { Block } from '@shared'
import { UserProfileEdit } from '@features'

export default class UserProfileEditPage extends Block {
  constructor() {
    super('div', {
      className: `user-profile`,
      UserProfileEdit: new UserProfileEdit(),
    })
  }

  render() {
    return `
      {{{ UserProfileEdit }}}
    `
  }
}
