import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/friend-requests';

class FriendRequestService{
    fetchFriendsList(userId){
        return axios.get(USERS_API_BASE_URL+"/friends/"+userId,{
            headers: authHeader(),
        })
    }
}

export default new FriendRequestService()