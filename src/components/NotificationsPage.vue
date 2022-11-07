<template>
    <div style="display:flex;justify-content:center">
        <div :style="(this.notifications.length % 2 == 0 && this.notifications.length != 0) || this.notifications.length >= 9
            ? notificationsStyle : notificationsStyleFitContent">
            <div v-if="this.notifications.length > 0">
                    <div v-for="(notification) in this.notifications" :key="notification">
                        <Notification @notification-click="onNotificationClick" :notification='notification'/>
                    </div>
                    <div style="text-align:center;">
                        <div v-if="!lastPageNotifications" style="text-align:center;margin-bottom:10px;margin-top:5px;">
                            <button style="color:#17a2b8;text-decoration:none" @click.prevent="this.fetchNotifications" class="btn btn-link btn-sm"
                             :disabled="this.loadingNotifications">
                                <span
                                    v-show="this.loadingNotifications"
                                    class="spinner-border spinner-border-sm"
                                ></span>
                                <span v-if="!this.loadingNotifications">Load more...</span>
                            </button>
                        </div>
                    </div>
            </div>
            <div v-else style="padding:30px">
                <h4> No notifications </h4>
            </div>       
        </div>

    </div>
</template>

<script>
import 'babel-polyfill';
import Notification from './Notification.vue'
export default {
    name: 'NotificationsPage',
    components: {
        Notification
    },
    data(){
        return {
            loadingNotifications: false,
            loadingMoreNotifications: false,
            page: 0,
            lastPage: false,
            message: "",
            notifications: [],
            totalNotifications: 0,
            scrolledBottomNotifications:false,
            lastPageNotifications:false,
            notificationsStyle: {
                marginTop:'10px',
                float:'left',
                width:'820px',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            notificationsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'820px',
                width:'fit-content',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            timer:'',
        }
    },
    created(){
        this.fetchNotifications("init");
        this.setRefreshable();
    },
    unmounted(){
        clearTimeout(this.timer);
    },
    methods: {
        onNotificationClick(notification){
            this.$root.updateNotification(notification);
        },
        setRefreshable(){
            this.timer = window.setInterval( () => {
                this.fetchNotifications("update");
            }, 5000);
        },
        scrollUpHandleNotifications(e){
            this.scrolledBottomNotifications = false;
        },
        scrollEndHandleNotifications(e){
            this.scrolledBottomNotifications = true;
        },
        disableScrollable(){
            // Get the current page scroll position
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
            // if any scroll is attempted, set this to the previous value
            window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            };
        },
        enableScrollable(){
            window.onscroll = function() {};
        },
        onUpdateRequest(friendRequestChanged) {
            for (let requestInd in this.$root.$data.friendRequestsWithData){
                var friendRequestWithData = this.$root.$data.friendRequestsWithData[requestInd];
                if (friendRequestWithData.friendRequestDTO.id == friendRequestChanged.id){
                    this.$root.$data.friendRequestsWithData[requestInd].friendRequestDTO = friendRequestChanged;
                    break;
                }
            }
            this.totalFetchedPendingRequests -= 1;
            this.totalPendingFriendRequests -= 1;
            
            this.$root.$data.totalPendingFriendRequests -= 1;
        },
        fetchNotifications(type) {
            if (type!="update") var page =  Math.floor(this.notifications.length / 10)
            else page = 0;
            this.$store.dispatch("notification/fetchNotifications", page).then(
                (data) => {
                    this.totalNotifications = data.totalNotifications;
                    for (let ind in data.notifications){
                        let returnedNotification = data.notifications[ind];
                        let exists = false;
                        for (let ind1 in this.notifications){
                            if (returnedNotification.id == this.notifications[ind1].id){
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            type=="update" ? this.notifications.unshift(returnedNotification) : this.notifications.push(returnedNotification);
                        }
                    }
                    if (this.totalNotifications == this.notifications.length){
                        this.lastPageNotifications = true;
                    }
                },
                (error) => {
                    console.log(error);
                    return null;
                }
            );
        },
        
    },
}
</script>

<style scoped>

  .alert{
    width:fit-content
  }

  .error-feedback{
    margin-left:5px;
    color:red;
  }

  .btn{
    transition: none!important;
  }

  .btn:focus{
    box-shadow: none;
  }

  .container{
    padding:10px;
    padding-top:0px;
  }

</style>