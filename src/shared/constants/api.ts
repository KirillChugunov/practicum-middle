const baseApi = 'https://ya-praktikum.tech/api/v2';

export const apiConfig = {
  auth: `${baseApi}/auth/signup`,
  signIn: `${baseApi}/auth/signin`,
  logout: `${baseApi}/auth/logout`,
  getUserInfo: `${baseApi}/auth/user`,
  getChats: `${baseApi}/chats`,
  createChat: `${baseApi}/chats`,
  deleteChat: `${baseApi}/chats`,
  addUsersToChat: `${baseApi}/chats/users`,
  removeUsersFromChat: `${baseApi}/chats/users`,
  searchUser: `${baseApi}/user/search`,
  getChatUsers: (chatId: string) => `${baseApi}/chats/${chatId}/users`,
  updateChatAvatar: `${baseApi}/chats/avatar`,
  getChatToken: (chatId: string) => `${baseApi}/chats/token/${chatId}`,
  uploadFile: `${baseApi}/resources`,
  updateAvatar: `${baseApi}/user/profile/avatar`,
  updatePassword: `${baseApi}/user/password`,
  updateProfile: `${baseApi}/user/profile`,
  getNewMessagesCount: `${baseApi}/chats/new`,
};
