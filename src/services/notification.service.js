import axios from 'axios';
import authHeader from './auth-header';

const USERS_API_BASE_URL = 'http://localhost:5000/social-network/notifications';

class NotificationService{
    fetchNotifications(page){
        return axios.get(USERS_API_BASE_URL,{
            headers: authHeader(),
            params:{
                page:page
            }
        })
    }
    fetchNotification(data){
        return axios.get(USERS_API_BASE_URL+"/last-chat-line",{
            headers: authHeader(),
            params:{
                senderId: data.senderId,
                receiverId: data.receiverId,
                objectId: data.objectId,
                activityType: data.activityType
            }
        })
    }
    createNotification(notification){
        return axios.post(USERS_API_BASE_URL, notification,
            { headers: authHeader()});
    }
    updateNotification(notification){
        return axios.put(USERS_API_BASE_URL,notification,{
            headers: authHeader(),
        })
    }
}

export default new NotificationService()