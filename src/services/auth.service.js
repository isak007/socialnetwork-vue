import axios from 'axios';
import jwt_decode from "jwt-decode";
import authHeader from './auth-header';


const API_URL = 'http://localhost:5000/social-network/users/';

class AuthService {
    activateAccount(jwt) {
        return axios
          .get(API_URL + 'account-activation',
          { params: 
            {
                jwt:jwt
            } 
          })
          .then(response => {
            if (response.data.jwt) {
              var decoded_token = jwt_decode(response.data.jwt);
              var user = {
                username: decoded_token.sub,
                userId: decoded_token.userId,
                jwt: response.data.jwt,
              }
              localStorage.setItem('user', JSON.stringify(user));
            }
    
            return user;
          });
      }

  login(user) {
    return axios
      .post(API_URL + 'login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.jwt) {
          var decoded_token = jwt_decode(response.data.jwt);
          var user = {
            username: decoded_token.sub,
            userId: decoded_token.userId,
            jwt: response.data.jwt,
          }
          localStorage.setItem('user', JSON.stringify(user));
        }

        return user;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'registration', {
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      city: user.city,
      profilePicture: user.profilePicture,
      pictureBase64: user.pictureBase64
    });
  }
  sendEmailVerificationCode(email){
    return axios.get(API_URL + 'send-email-verification-code', {
        headers: authHeader(),
        params: {
            email: email
        }
    })
}
}

export default new AuthService();