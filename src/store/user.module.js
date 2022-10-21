import UserService from '../services/user.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const user = {
  namespaced: true,
  state: initialState,
  actions: {
    getUserData({ commit }, userId) {
      return UserService.getUserData(userId).then(
        user => {
          commit('fetchSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('fetchError');
          return Promise.reject(error);
        }
      );
    },
    getUserDataByUsername({ commit }, username) {
        return UserService.getUserDataByUsername(username).then(
          user => {
            commit('fetchSuccess', user);
            return Promise.resolve(user);
          },
          error => {
            commit('fetchError');
            return Promise.reject(error);
          }
        );
      },
    fetchProfilePicture({ commit }, userId) {
        return UserService.fetchProfilePicture(userId).then(
          picture => {
            commit('fetchSuccess', picture);
            return Promise.resolve(picture);
          },
          error => {
            commit('fetchError');
            return Promise.reject(error);
          }
        );
      },
    fetchPostPicture({ commit }, postId) {
        return UserService.fetchPostPicture(postId).then(
          picture => {
            commit('fetchSuccess', picture);
            return Promise.resolve(picture);
          },
          error => {
            commit('fetchError');
            return Promise.reject(error);
          }
      );
    },
    editPersonalData({ commit }, userData) {
      return UserService.editPersonalData(userData).then(
        response => {
          commit('editSuccessfull');
          return Promise.resolve(response.data);
        },
        error => {
          commit('editFailure');
          return Promise.reject(error);
        }
      );
    },
    fetchCityList({ commit }, queryString) {
        return UserService.fetchCityList(queryString).then(
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
    searchUsers({ commit }, data) {
        return UserService.searchUsers(data).then(
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
    fetchFriendsList({ commit }, userId) {
        return UserService.fetchFriendsList(userId).then(
          response => {
            commit('fetchSuccessfull');
            return Promise.resolve(response.data);
          },
          error => {
            commit('fetchFailure');
            return Promise.reject(error);
          }
        );
    }
  },
};