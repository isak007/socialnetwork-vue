import PostService from '../services/post.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const post = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchPostsList({ commit }, postsData) {
        return PostService.fetchPostsList(postsData).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchPost({ commit }, postId) {
        return PostService.fetchPost(postId).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchMainPagePostsList({ commit }, page) {
        return PostService.fetchMainPagePostsList(page).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createPost({ commit }, post) {
        return PostService.createPost(post).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    editPost({ commit }, post) {
        return PostService.editPost(post).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    deletePost({ commit }, postId) {
        return PostService.deletePost(postId).then(
          response => {
            return Promise.resolve(response);
          },
          error => {
            return Promise.reject(error);
          }
        );
    }
  },
};