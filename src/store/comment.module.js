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
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchComment({ commit }, commentId) {
        return CommentService.fetchComment(commentId).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createComment({ commit }, comment) {
        return CommentService.createComment(comment).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    editComment({ commit }, comment) {
        return CommentService.editComment(comment).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    deleteComment({ commit }, commentId) {
        return CommentService.deleteComment(commentId).then(
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