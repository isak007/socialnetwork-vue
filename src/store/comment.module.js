import CommentService from '../services/comment.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const comment = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchCommentsList({ commit }, commentsData) {
        return CommentService.fetchCommentsList(commentsData).then(
          response => {
            commit('fetchSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            commit('fetchFailure');
            return Promise.reject(error);
          }
        );
    },
    createComment({ commit }, comment) {
        return CommentService.createComment(comment).then(
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
    editComment({ commit }, comment) {
        return CommentService.editComment(comment).then(
          response => {
            commit('editSuccessful');
            return Promise.resolve(response.data);
          },
          error => {
            commit('editFailure');
            return Promise.reject(error);
          }
        );
    },
    deleteComment({ commit }, commentId) {
        return CommentService.deleteComment(commentId).then(
          response => {
            commit('deleteSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            commit('deleteFailure');
            return Promise.reject(error);
          }
        );
      }
  },
};