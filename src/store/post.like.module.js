import LikeService from '../services/post.like.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const postLike = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchPostLikes({ commit }, data) {
        return LikeService.fetchPostLikes(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createLike({ commit }, likeData) {
        return LikeService.createLike(likeData).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    deleteLike({ commit }, likeData) {
        return LikeService.deleteLike(likeData).then(
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