import LikeService from '../services/comment.like.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const commentLike = {
  namespaced: true,
  state: initialState,
  actions: {
    createLike({ commit }, likeData) {
        return LikeService.createLike(likeData).then(
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
    deleteLike({ commit }, likeData) {
        return LikeService.deleteLike(likeData).then(
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