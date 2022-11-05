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
            // commit('fetchSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            // commit('fetchFailure');
            return Promise.reject(error);
          }
        );
    },
    fetchLastChatLine({ commit }, chatId) {
        return ChatLineService.fetchLastChatLine(chatId).then(
          response => {
            // commit('fetchSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            // commit('fetchFailure');
            return Promise.reject(error);
          }
        );
    },
    createChatLine({ commit }, chatLine) {
        return ChatLineService.createChatLine(chatLine).then(
          response => {
            commit('postSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            commit('postFailure');
            return Promise.reject(error);
          }
        );
    },
    // editComment({ commit }, comment) {
    //     return CommentService.editComment(comment).then(
    //       response => {
    //         commit('editSuccessful');
    //         return Promise.resolve(response.data);
    //       },
    //       error => {
    //         commit('editFailure');
    //         return Promise.reject(error);
    //       }
    //     );
    // },
    // deleteComment({ commit }, commentId) {
    //     return CommentService.deleteComment(commentId).then(
    //       response => {
    //         commit('deleteSuccessfull');
    //         return Promise.resolve(response.data);
    //       },
    //       error => {
    //         commit('deleteFailure');
    //         return Promise.reject(error);
    //       }
    //     );
    //   }
  },
};