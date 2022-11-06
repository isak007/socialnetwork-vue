import NotificationService from '../services/notification.service';

const sessionUser = JSON.parse(localStorage.getItem('user'));
const initialState = sessionUser
  ? { status: { loggedIn: true }, sessionUser }
  : { status: { loggedIn: false }, sessionUser: null };

export const notification = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchNotifications({ commit }, page) {
        return NotificationService.fetchNotifications(page).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    fetchNotification({ commit }, data) {
        return NotificationService.fetchNotification(data).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
    createNotification({ commit }, notification) {
        return NotificationService.createNotification(notification).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },

    updateNotification({ commit }, notification) {
        return NotificationService.updateNotification(notification).then(
          response => {
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
    },
  },
};