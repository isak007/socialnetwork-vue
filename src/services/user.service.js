import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/users';

class UserService{
    getUserData(userId){
        return axios.get(USERS_API_BASE_URL+'/fetch/'+userId, 
            { headers: authHeader()}
        );
    }
    fetchNewPlacesToken(){
        return axios.get(USERS_API_BASE_URL+'/places-token', 
            { headers: authHeader()}
        );
    }
    getUserDataByUsername(username){
        return axios.get(USERS_API_BASE_URL+'/fetch/username/'+username, 
            { headers: authHeader()}
        );
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
        return axios.get(USERS_API_BASE_URL+'/city-list', 
            {
                 headers: authHeader(),
                 params: {
                    queryString: queryString,
                 }
            });
    }
    searchUsers(data){
        return axios.get(USERS_API_BASE_URL+'/search/'+data.queryString,
            { 
                headers: authHeader(),
                params:{
                    page: data.page,
                    itemsPerPage: data.itemsPerPage
                }
            }
        );
    }
}

export default new UserService()