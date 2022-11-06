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
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    sendFriendRequest({ commit }, friendRequest) {
        return FriendRequestService.sendFriendRequest(friendRequest).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchFriendsList({ commit }, data) {
        return FriendRequestService.fetchFriendsList(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    checkIfFriendRequestExists({ commit }, data) {
        return FriendRequestService.checkIfFriendRequestExists(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchFriendRequests({ commit }, page) {
        return FriendRequestService.fetchFriendRequests(page).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchNonPendingFriendRequests({ commit }, page) {
        return FriendRequestService.fetchNonPendingFriendRequests(page).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    removeFriend({ commit }, friendRequestId) {
        return FriendRequestService.removeFriend(friendRequestId).then(
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