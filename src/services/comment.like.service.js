import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/comment-likes';

class LikeService{
    fetchCommentLikes(data){
        return axios.get(USERS_API_BASE_URL+"/comment/"+data.commentId,{
            headers: authHeader(),
            params: {
                page:data.page
            }
        })
    }
    createLike(likeData){
        return axios.post(USERS_API_BASE_URL, likeData,
            { headers: authHeader()});
    }
    deleteLike(likeData){
        return axios.delete(USERS_API_BASE_URL,
            { 
                headers: authHeader(),
                data: {
                    commentId: likeData.commentId,
                    userId: likeData.userId
                }
            });
    }
}

export default new LikeService()