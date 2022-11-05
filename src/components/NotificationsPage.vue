<template>
    <div style="display:flex;justify-content:center">
        <div :style="(this.notifications.length % 2 == 0 && this.notifications.length != 0) || this.notifications.length >= 9
            ? notificationsStyle : notificationsStyleFitContent">
            <div v-if="this.notifications.length > 0">
                    <!-- <perfect-scrollbar @mouseenter="this.disableScrollable" @mouseleave="this.enableScrollable"
                        @ps-y-reach-end="this.scrollEndHandleNotifications" @ps-scroll-up="this.scrollUpHandleNotifications"> -->
                        <div v-for="(notification) in this.notifications" :key="notification">
                            <Notification @notification-click="onNotificationClick" :notification='notification'/>
                        </div>
                    <!-- </perfect-scrollbar> -->
                    <div style="text-align:center;">
                        <div v-if="!lastPageNotifications" style="text-align:center;margin-bottom:10px;margin-top:5px;">
                            <Button style="color:#17a2b8;text-decoration:none" @click.prevent="this.fetchNotifications" class="btn btn-link btn-sm"
                             :disabled="this.loadingNotifications">
                                <span
                                    v-show="this.loadingNotifications"
                                    class="spinner-border spinner-border-sm"
                                ></span>
                                <span v-if="!this.loadingNotifications">Load more...</span>
                            </Button>
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
import 'babel-polyfill'; // es6 shim
// import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import Notification from './Notification.vue'
export default {
    name: 'NotificationsPage',
    components: {
        // PerfectScrollbar,
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
            // friendRequest: this.$route.params.friendRequest,

            notificationsStyle: {
                marginTop:'10px',
                float:'left',
                width:'820px',
                // width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'0'
            },
            notificationsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'820px',
                width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'0'
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
            // dont disable if there is not enough friends in list for scrolling
            // if (this.friendRequestsWithData.length <= 5){
            //     return;
            // }
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
                    // this.friendRequestsWithData.splice(requestInd,1);
                    break;
                }
            }
            this.totalFetchedPendingRequests -= 1;
            this.totalPendingFriendRequests -= 1;
            
            this.$root.$data.totalPendingFriendRequests -= 1;
            // this.$root.$data.friendRequestsWithData = this.friendRequestsWithData;
        },
        fetchNotifications(type) {
            if (type!="update") var page =  Math.floor(this.notifications.length / 10)
            else page = 0;
            this.$store.dispatch("notification/fetchNotifications", page).then(
                (data) => {
                    this.totalNotifications = data.totalNotifications;
                    // this.notifications = data.notifications;
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

  /* #header{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    padding-top:30px;
    padding-left:50px;
    padding-right:50px;
    padding-bottom:30px;
    float:left;
    width:100%;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  } */

  .container{
    padding:10px;
    padding-top:0px;
  }

</style>