import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/posts';

class PostService{
    fetchPostsList(postsData){
        return axios.get(USERS_API_BASE_URL+"/user/"+postsData.userId,{
            headers: authHeader(),
            params: {
                page:postsData.page
            }
        })
    }
    createPost(post){
        return axios.post(USERS_API_BASE_URL, post,
        {
            headers: authHeader(),
        })
    }
    editPost(post){
        return axios.put(USERS_API_BASE_URL, post,
        {
            headers: authHeader(),
        })
    }
    deletePost(postId){
        return axios.delete(USERS_API_BASE_URL+"/"+postId,
        {
            headers: authHeader(),
        })
    }
}

export default new PostService()