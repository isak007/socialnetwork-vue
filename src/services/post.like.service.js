import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/post-likes';

class LikeService{
    createLike(likeData){
        return axios.post(USERS_API_BASE_URL, likeData,
            { headers: authHeader()});
    }
    deleteLike(likeData){
        return axios.delete(USERS_API_BASE_URL,
            { 
                headers: authHeader(),
                data: {
                    postId: likeData.postId,
                    userId: likeData.userId
                }
            });
    }
}

export default new LikeService()