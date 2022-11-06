import ChatService from '../services/chat.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const chat = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchChat({ commit }, data) {
        return ChatService.fetchChat(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createChat({ commit }, chat) {
        return ChatService.createChat(chat).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },

    deleteChat({ commit }, chatId) {
        return ChatService.deleteChat(chatId).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
      }
  },
};