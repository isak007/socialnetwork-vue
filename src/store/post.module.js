import PostService from '../services/post.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const post = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchPostsList({ commit }, userId) {
        return PostService.fetchPostsList(userId).then(
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
    editPost({ commit }, post) {
        return PostService.editPost(post).then(
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
    deletePost({ commit }, postId) {
        return PostService.deletePost(postId).then(
          response => {
            commit('deleteSuccessful');
            return Promise.resolve(response);
          },
          error => {
            commit('deleteFailure');
            return Promise.reject(error);
          }
        );
    }
  },
};