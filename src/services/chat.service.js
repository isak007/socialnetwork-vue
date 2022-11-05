import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/chats';

class ChatService{
    fetchChat(data){
        return axios.get(USERS_API_BASE_URL+"/get",{
            headers: authHeader(),
            params:{
                user1Id: data.user1Id,
                user2Id: data.user2Id
            }
        })
    }
    createChat(chat){
        return axios.post(USERS_API_BASE_URL, chat,
            { headers: authHeader()});
    }
    deleteChat(chatId){
        return axios.delete(USERS_API_BASE_URL+"/"+chatId,
            { 
                headers: authHeader(),
            });
    }
}

export default new ChatService()