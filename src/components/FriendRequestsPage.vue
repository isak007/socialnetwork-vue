<template>
    <div style="margin-top:10px;display:flex;justify-content:center;padding-top:5px">
        <div :style="showPending ? pressedButtonStyle : null">
            <Button @click="this.showPending = true;this.friendRequestsWithData = [];this.fetchPendingRequests()"  class="btn btn-none" >
                Pending ({{this.totalPendingFriendRequests}})
            </Button>
        </div>
        <div :style="!showPending ? pressedButtonStyle : null">
            <Button @click="this.showPending = false;this.friendRequestsWithData = [];this.fetchOtherRequests()"  class="btn btn-none" style="width:100%">
                Other
            </Button>
        </div>  
    </div>
    <div style="display:flex;justify-content:center">
        
        <div v-if="this.showPending" :style="(this.friendRequestsWithData.length % 2 == 0 && this.friendRequestsWithData.length != 0) || this.friendRequestsWithData.length >= 10
            ? pendingRequestsStyle : pendingRequestsStyleFitContent">
            <div v-if="this.friendRequestsWithData.length > 0">
                    <perfect-scrollbar @mouseenter="this.disableScrollable" @mouseleave="this.enableScrollable"
                        @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
                        <div v-for="(frWithData) in this.friendRequestsWithData" :key="frWithData">
                            <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                        </div>
                    </perfect-scrollbar>
                    <div style="text-align:center">
                        <div v-if="!lastPageFriendRequests" style="text-align:center;margin-bottom:10px;margin-top:5px">
                            <Button style="color:#17a2b8;text-decoration:none" @click.prevent="this.fetchPendingRequests" class="btn btn-link btn-sm" :disabled="this.loadingFriendRequests">
                                <span
                                    v-show="this.loadingFriendRequests"
                                    class="spinner-border spinner-border-sm"
                                ></span>
                                <span v-if="!this.loadingFriendRequests">Load more requests...</span>
                            </Button>
                        </div>
                    </div>
            </div>
            <div v-else style="padding:30px">
                <h4> No recent requests </h4>
            </div>       
        </div>

        <div v-if="!this.showPending" :style="(this.friendRequestsWithData.length % 2 == 0 && this.friendRequestsWithData.length != 0) || this.friendRequestsWithData.length > 7
            ? otherRequestsStyle : otherRequestsStyleFitContent">
            <div v-if="this.friendRequestsWithData.length > 0">
                    <perfect-scrollbar @mouseenter="this.disableScrollable" @mouseleave="this.enableScrollable"
                        @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
                        <div v-for="(frWithData) in this.friendRequestsWithData" :key="frWithData">
                            <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                        </div>
                    </perfect-scrollbar>
                    <div style="text-align:center">
                        <div v-if="!lastPageFriendRequests" style="text-align:center;margin-bottom:10px;margin-top:5px">
                            <Button style="color:#17a2b8;text-decoration:none" @click.prevent="this.fetchPendingRequests" class="btn btn-link btn-sm" :disabled="this.loadingFriendRequests">
                                <span
                                    v-show="this.loadingFriendRequests"
                                    class="spinner-border spinner-border-sm"
                                ></span>
                                <span v-if="!this.loadingFriendRequests">Load more requests...</span>
                            </Button>
                        </div>
                    </div>
            </div>
            <div v-else style="padding:30px">
                <h4> No other requests </h4>
            </div>           
        </div>
    </div>
</template>

<script>
import 'babel-polyfill'; // es6 shim
import UserFriendRequest from './UserFriendRequest.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
export default {
    name: 'FriendRequestsPage',
    components: {
        UserFriendRequest,
        PerfectScrollbar
    },
    data(){
        return {
            loadingFriendRequests: false,
            loadingMoreFriendRequests: false,
            page: 0,
            lastPage: false,
            message: "",
            friendRequestsWithData: [],
            totalFetchedPendingRequests: 0,
            totalPendingFriendRequests: 0,
            scrolledBottom:false,
            friendRequest: this.$route.params.friendRequest,
            pressedButtonStyle: {
                backgroundColor:'white',
                borderRadius:'5px',
                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
            },
            pendingRequestsStyle: {
                marginTop:'10px',
                float:'left',
                width:'840px',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            pendingRequestsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'840px',
                width:'fit-content',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            otherRequestsStyle: {
                marginTop:'10px',
                float:'left',
                width:'840px',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            otherRequestsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'840px',
                width:'fit-content',
                marginBottom:'10px',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            },
            showPending:true,
        }
    },
    mounted(){
        console.log(this.$root);
    },
    methods: {
         scrollUpHandle(e){
            this.scrolledBottom = false;
        },
        scrollEndHandle(){
            this.scrolledBottom = true;
        },
        disableScrollable(){
            // dont disable if there is not enough comments for scrolling
            if (this.friendRequestsWithData.length <= 10) return;
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
        
        fetchPendingRequests(){
            this.loadingFriendRequests = true;
            var page = Math.floor(this.friendRequestsWithData.length/10);
            this.$store.dispatch("friendRequest/fetchFriendRequests", page).then(
                (data) => {
                    for (let ind in data.friendRequestsWithDataDTO){
                        let frWithData = data.friendRequestsWithDataDTO[ind];
                        this.friendRequestsWithData.push(frWithData);
                    }
                    this.totalFetchedPendingRequests += data.friendRequestsWithDataDTO.length;
                    this.totalPendingFriendRequests = data.totalFriendRequests;
                    if (data.friendRequestsWithDataDTO.length <= 10){
                        this.lastPageFriendRequests = true;
                    }
                    this.loadingFriendRequests = false;
                },
                (error) => {
                    this.loadingFriendRequests = false;
                    console.log(
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
                    )}
            );
        },
        fetchOtherRequests(){
            this.loadingFriendRequests = true;
            var page = Math.floor(this.friendRequestsWithData.length/10);
            this.$store.dispatch("friendRequest/fetchNonPendingFriendRequests", page).then(
                (data) => {
                    for (let ind in data.friendRequestsWithDataDTO){
                        let frWithData = data.friendRequestsWithDataDTO[ind];
                        this.friendRequestsWithData.push(frWithData);
                    }
                    this.totalFriendRequests = data.totalFriendRequests;
                    if (data.friendRequestsWithDataDTO.length <= 10){
                        this.lastPageFriendRequests = true;
                    }
                    this.loadingFriendRequests = false;
                },
                (error) => {
                    this.loadingFriendRequests = false;
                    console.log(
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
                    )}
            );
        },
    },
    created(){
        this.fetchPendingRequests();
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