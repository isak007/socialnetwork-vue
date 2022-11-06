import ChatLineService from '../services/chat.line.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const chatLine = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchChatLines({ commit }, data) {
        return ChatLineService.fetchChatLines(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchLastChatLine({ commit }, chatId) {
        return ChatLineService.fetchLastChatLine(chatId).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createChatLine({ commit }, chatLine) {
        return ChatLineService.createChatLine(chatLine).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
  },
};