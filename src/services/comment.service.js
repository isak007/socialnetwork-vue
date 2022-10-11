import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/comments';

class LikeService{
    fetchCommentsList(commentsData){
        return axios.get(USERS_API_BASE_URL+"/post/"+commentsData.postId,{
            headers: authHeader(),
            params:{
                page:commentsData.page
            }
        })
    }
    createComment(comment){
        return axios.post(USERS_API_BASE_URL, comment,
            { headers: authHeader()});
    }
    editComment(comment){
        return axios.put(USERS_API_BASE_URL, comment,
        {
            headers: authHeader(),
        })
    }
    deleteComment(commentId){
        return axios.delete(USERS_API_BASE_URL+"/"+commentId,
            { 
                headers: authHeader(),
            });
    }
}

export default new LikeService()