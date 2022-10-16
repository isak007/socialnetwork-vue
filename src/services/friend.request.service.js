import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/friend-requests';

class FriendRequestService{
    fetchFriendsList(data){
        return axios.get(USERS_API_BASE_URL+"/friends/"+data.userId,{
            headers: authHeader(),
            params: {
                page: data.page
            }
        })
    }
}

export default new FriendRequestService()