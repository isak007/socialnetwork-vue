import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/chat-lines';

class ChatLineService{
    fetchChatLines(data){
        return axios.get(USERS_API_BASE_URL+"/get",{
            headers: authHeader(),
            params:{
                chatId: data.chatId,
                page:data.page
            }
        })
    }
    fetchLastChatLine(chatId){
        return axios.get(USERS_API_BASE_URL+"/get-last",{
            headers: authHeader(),
            params:{
                chatId: chatId,
            }
        })
    }
    createChatLine(chatLine){
        return axios.post(USERS_API_BASE_URL, chatLine,
            { headers: authHeader()});
    }
}

export default new ChatLineService()