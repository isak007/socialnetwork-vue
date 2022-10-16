import FriendRequestService from '../services/friend.request.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const friendRequest = {
  namespaced: true,
  state: initialState,
  actions: {
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
    }
  },
};