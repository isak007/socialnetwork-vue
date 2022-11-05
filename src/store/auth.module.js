import AuthService from '../services/auth.service';
import jwt_decode from "jwt-decode";

var user = JSON.parse(localStorage.getItem('user'));
const token = user && user["jwt"];
if (token == null || jwt_decode(token).exp < Date.now() / 1000) {
    // if token has expired set user to null and remove him from storage
    user = null
    localStorage.removeItem('user');
}

// confirm that user AND token are not null, otherwise not authorized
const initialState = user && token
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    accountActivation({ commit }, jwt) {
        return AuthService.activateAccount(jwt).then(
          user => {
            commit('activationSuccess', user);
            return Promise.resolve(user);
          },
          error => {
            commit('activationFailure');
            return Promise.reject(error);
          }
        );
      },
    passwordReset({ commit }, passwordReset) {
        return AuthService.passwordReset(passwordReset).then(
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
    prePasswordResetAuth({ commit }, jwt) {
        return AuthService.prePasswordResetAuth(jwt).then(
          response => {
            commit('getSuccessful');
            return Promise.resolve(response.data);
          },
          error => {
            commit('getFailure');
            return Promise.reject(error);
          }
        );
    },
    sendPasswordResetCode({ commit }, email) {
        return AuthService.sendPasswordResetCode(email).then(
          response => {
            commit('resetSuccess', response);
            return Promise.resolve(response);
          },
          error => {
            commit('resetFailure');
            return Promise.reject(error);
          }
        );
      },
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    sendEmailVerificationCode({ commit }, email) {
        return AuthService.sendEmailVerificationCode(email).then(
          response => {
            commit('sendSuccess');
            return Promise.resolve(response);
          },
          error => {
            commit('sendFailure');
            return Promise.reject(error);
          }
        );
      }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};