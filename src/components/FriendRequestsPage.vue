<template>
    <div style="margin-top:10px;display:flex;justify-content:center">
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

        <div v-if="!this.showPending" :style="(this.friendRequestsWithData.length % 2 == 0 && this.friendRequestsWithData.length != 0) || this.friendRequestsWithData.length >= 10
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

  <!-- <div >
    <div v-if="!loadingFriendRequests" :style="this.showPending ? pendingRequestsStyle : otherRequestsStyle"
        >
            <div v-for="(frWithData) in this.friendRequestsWithData" :key="frWithData">
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                
            </div>
            <div v-if="this.loadingMoreFriendRequests" style="text-align:center;margin-bottom:20px">
                <span
                    v-show="this.loadingMoreFriendRequests"
                    class="spinner-border spinner-border-sm"
                ></span>
                <h3>Loading requests...</h3>
            </div>
    </div>
  </div> -->
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
                // borderTopRightRadius:'0',
                // borderBottomRightRadius:'0'
            },
            pendingRequestsStyle: {
                marginTop:'10px',
                float:'left',
                width:'840px',
                // width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'0'
            },
            pendingRequestsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'840px',
                width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'0'
            },
            otherRequestsStyle: {
                marginTop:'10px',
                float:'left',
                width:'840px',
                // width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'10px'
            },
            otherRequestsStyleFitContent: {
                marginTop:'10px',
                float:'left',
                maxWidth:'840px',
                width:'fit-content',
                marginBottom:'10px',
                // display:'flex',
                backgroundColor:'white',
                borderRadius:'10px',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                // borderTopLeftRadius:'10px'
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
            // window.onscroll = () => {
            //     if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            //         if(!this.loadingFriendRequests && !this.lastPage){
            //             this.fetchPendingRequests();
            //         }
            //     }
            // };
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
                    // this.friendRequestsWithData.splice(requestInd,1);
                    break;
                }
            }
            this.totalFetchedPendingRequests -= 1;
            this.totalPendingFriendRequests -= 1;
            
            this.$root.$data.totalPendingFriendRequests -= 1;
            // this.$root.$data.friendRequestsWithData = this.friendRequestsWithData;
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