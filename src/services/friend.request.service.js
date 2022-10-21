import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/friend-requests';

class FriendRequestService{
    updateFriendRequest(friendRequest){
        return axios.put(USERS_API_BASE_URL, friendRequest,
        {
            headers: authHeader(),
        })
    }
    sendFriendRequest(friendRequest){
        return axios.post(USERS_API_BASE_URL, friendRequest,
        {
            headers: authHeader(),
        })
    }
    removeFriend(friendRequestId){
        return axios.delete(USERS_API_BASE_URL+"/"+friendRequestId,
        {
            headers: authHeader(),
        })
    }
    fetchFriendsList(data){
        return axios.get(USERS_API_BASE_URL+"/friends/"+data.userId,{
            headers: authHeader(),
            params: {
                page: data.page
            }
        })
    }
    checkIfFriendRequestExists(data){
        return axios.get(USERS_API_BASE_URL+"/check-request",{
            headers: authHeader(),
            params: {
                user1Id: data.user1Id,
                user2Id: data.user2Id
            }
        })
    }
    fetchFriendRequests(page){
        return axios.get(USERS_API_BASE_URL,{
            headers: authHeader(),
            params: {
                page: page
            }
        })
    }
    fetchNonPendingFriendRequests(page){
        return axios.get(USERS_API_BASE_URL+"/non-pending",{
            headers: authHeader(),
            params: {
                page: page
            }
        })
    }
}

export default new FriendRequestService()