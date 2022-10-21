import FriendRequestService from '../services/friend.request.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const friendRequest = {
  namespaced: true,
  state: initialState,
  actions: {
    updateFriendRequest({ commit }, friendRequest) {
        return FriendRequestService.updateFriendRequest(friendRequest).then(
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
    sendFriendRequest({ commit }, friendRequest) {
        return FriendRequestService.sendFriendRequest(friendRequest).then(
          response => {
            commit('postSuccessful');
            return Promise.resolve(response.data);
          },
          error => {
            commit('postFailure');
            return Promise.reject(error);
          }
        );
    },
    fetchFriendsList({ commit }, data) {
        return FriendRequestService.fetchFriendsList(data).then(
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
    checkIfFriendRequestExists({ commit }, data) {
        return FriendRequestService.checkIfFriendRequestExists(data).then(
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
    fetchFriendRequests({ commit }, page) {
        return FriendRequestService.fetchFriendRequests(page).then(
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
    fetchNonPendingFriendRequests({ commit }, page) {
        return FriendRequestService.fetchNonPendingFriendRequests(page).then(
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
    removeFriend({ commit }, friendRequestId) {
        return FriendRequestService.removeFriend(friendRequestId).then(
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