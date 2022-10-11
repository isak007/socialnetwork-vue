import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/users';
// auth token expires every 24h
const AUTH_TOKEN = process.env.VUE_APP_AUTH_TOKEN_FOR_MAPS_SERVICES;
const API_KEY = process.env.VUE_APP_API_KEY_FOR_MAPS_SERVICES;

class UserService{
    getUserData(userId){
        return axios.get(USERS_API_BASE_URL+'/fetch/'+userId, 
            { headers: authHeader()});
    }
    fetchProfilePicture(userId){
        return axios.get(USERS_API_BASE_URL+'/profile-picture', 
            {
                 responseType: "blob", 
                 headers: authHeader(),
                 params: {
                    userId: userId,
                 }
            });
    }
    fetchPostPicture(postId){
        return axios.get(USERS_API_BASE_URL+'/post-picture', 
            {
                 responseType: "blob", 
                 headers: authHeader(),
                 params: {
                    postId: postId,
                 }
            });
    }
    editPersonalData(userData){
        return axios.put(USERS_API_BASE_URL, userData,
            { headers: authHeader()});
    }
    fetchCityList(queryString){
        return axios.get("https://autocomplete.search.hereapi.com/v1/autocomplete",{
            headers: { Authorization : 'Bearer ' + AUTH_TOKEN },
            params: {
                q: queryString,
                types: "city",
                apiKey: API_KEY
            }
        })
    }
}

export default new UserService()