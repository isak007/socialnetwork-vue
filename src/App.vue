<template>
  <div id="app">
    <nav class="navbar fixed-top navbar-expand navbar-dark bg-dark">
      <div class="navbar-header" style="padding-top:5px;margin-right:5px">
          <router-link to="/welcome" class="nav-brand"  style="color:white; height:100%;text-decoration:none">
             <h5>Virtual Connect</h5>
          </router-link>
      </div>

      <div v-if="currentUser" class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>
        <div>
            <VMenu v-if="this.showFriendRequests" :triggers="['click']" :hideTriggers="['click']" :autoHide="true">
                <li class="nav-item friendRequestsLink">
                    <div class="nav-link friendRequestsLink1" id="">
                        <img id="friendRequestsImg" src="./assets/add-user-23.png" style="min-height:25px;min-width:25px">
                    </div>
                </li>


                <template #popper>
                    <div style="display:inline-block">
                        <h5 style="margin-top:10px;margin-left:15px;float:left">Incoming requests ({{this.totalPendingFriendRequests}})</h5>
                        <button v-if="!this.loadingFriendRequests" style="float:left;color:#17a2b8;text-decoration:none;margin-top:8px;margin-left:120px;margin-right:10px" @click="this.goToFriendRequestsPage" class="btn btn-link btn-sm" :disabled="this.loadingFriendRequests">
                            <span>View all...</span>
                        </button>
                    </div>
                    <perfect-scrollbar @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
                    @ps-y-reach-end="this.scrollEndHandleFr" @ps-scroll-up="this.scrollUpHandleFr" style="max-height:600px">
                        <div v-if="this.friendRequestsWithData.length > 0" style="padding-right:5px;max-width:425px"> 
                            <div v-for="(frWithData) in this.friendRequestsWithData" :key="frWithData">
                                <UserFriendRequest :frWithData='frWithData' @update-request="onUpdateRequest"/>
                            </div>
                        </div>
                        <div v-else style="text-align:center;padding:15px;color:grey">
                            <div>No new requests</div>
                        </div>
                    </perfect-scrollbar>
                    <div>&nbsp;</div>

                </template>
            </VMenu>
            <div v-else>
                <li class="nav-item" id="friendRequestsLink" >
                    <div class="nav-link" id="friendRequestsLink1">
                        <img id="friendRequestsImg" src="./assets/add-user-23.png" style="min-height:25px;min-width:25px">
                    </div>
                </li>
            </div>
        </div>

        <div>
            <VMenu :triggers="['click']" :hideTriggers="['click']" :autoHide="true">
                <li class="nav-item friendRequestsLink" id="" >
                    <div class="nav-link friendRequestsLink1" id="">
                        <img v-if="this.hasNewNotifications" id="friendRequestsImg" src="./assets/notification-25-new.png" style="min-height:25px;min-width:25px">
                        <img v-else id="friendRequestsImg" src="./assets/notification-25.png" style="min-height:25px;min-width:25px">
                    </div>
                </li>
                <template #popper>
                    <div style="display:inline-block;width:100%;box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px">
                        <h5 style="margin-top:10px;margin-left:15px;float:left">Earlier</h5>
                        <button v-if="!this.loadingFriendRequests" style="float:right;color:#17a2b8;text-decoration:none;margin-top:8px;margin-right:10px" 
                        @click="this.goToNotificationsPage" class="btn btn-link btn-sm">
                            <span>View all...</span>
                        </button>
                    </div>
                    <perfect-scrollbar @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
                    @ps-y-reach-end="this.scrollEndHandleNotifications" @ps-scroll-up="this.scrollUpHandleNotifications" style="max-height:520px">
                        <div v-if="this.notifications.length > 0" style="padding-right:5px;max-width:425px"> 
                            <div v-for="(notification) in this.notifications" :key="notification">
                                <Notification @notification-click="onNotificationClick" :notification="notification"/>
                                <div v-if="this.notifications.indexOf(notification) == this.notifications.length - 1" style="max-height:5px">&nbsp;</div>
                            </div>
                        </div>
                        <div v-else style="text-align:center;padding:15px;color:grey">
                            <div>No notifications</div>
                        </div>
                    </perfect-scrollbar>
                </template>
            </VMenu>
        </div>

      </div>
      
      <div v-if="currentUser" class="navbar-nav mc-auto" style="width:400px">
        <vue3-simple-typeahead
            ref="searchInput"
            style="display: block;
                width:100%;
                height: calc(1.5em + .75rem + 2px);
                padding: .375rem .75rem;
                font-size: 1rem;
                font-weight: 400;
                line-height: 1.5;
                color: #495057;
                background-color: transparent!important;
                background-clip: padding-box;
                border: 1px solid #ced4da;
                border-radius: .25rem;
                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out"
            id="typeahead_id_search"
            placeholder="Search users..."
            :value="this.searchInput"
            :items="this.userList"
            :minInputLength="3"
            :selectOnTab=false
            @keyup.enter="onSearch"
            @selectItem="(event) => selectUser(event)"
            @onInput="(event) => updateUserList(event)">
            <template #list-item-text="slot">
                <div v-if="!this.loadingUsers" style="overflow:hidden">
                    <span style="margin-right:20px;float:left">
                        <ImageContainer :userSearchFormat="slot.item" :usersRaw="this.usersRaw"></ImageContainer>
                    </span>&nbsp;
                    <span style="float:left">
                        <div>{{slot.item.split(" | ")[0]}}</div>
                        <div style="color:grey">@{{slot.item.split(" | ")[1]}}</div>
                    </span>
                </div>
                <div v-else style="text-align:center">
                    <button style="color:#17a2b8;text-decoration:none" class="btn btn-link btn-sm" :disabled="this.loadingUsers">
                        <span
                            v-show="this.loadingUsers"
                            class="spinner-border spinner-border-sm"
                        ></span>
                    </button>
                </div>
            </template>
        </vue3-simple-typeahead>
        <button class="btn btn-outlin-info btn-sm" @click="this.onSearch" style="margin-left:5px;color:white;vertical-align:middle">
            <img src="./assets/search-icon-white-28.png">
        </button>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/my-profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> Logout
          </a>
        </li>
      </div>
    </nav>

    <div class="container" style="margin-top:59px">
      <router-view/>

      <div v-if="this.currentUser && !this.loadingFriends">
        <sidebar-menu :menu="menu" :rtl="true" width="260px" style="margin-top:59px" :collapsed="false"/>
      </div>
      <div v-if="currentUser" style="position:fixed;bottom:0;width:70%;display:table-cell;text-align:right">
            <span v-for="(openChatUser) in this.openChatUsersList" :key="openChatUser" style="display:inline-block;vertical-align:bottom" >
                <UserChatOpen v-if="this.openChatUsersList.indexOf(openChatUser) == this.openChatUsersList.length - 1" 
                :user="openChatUser" :editLastChatLine="this.editLastChatLine" @close-chat="onCloseChat"/>
                <UserChatOpen v-else :user="openChatUser" @close-chat="onCloseChat"/>
            </span>
      </div>
    </div>


  </div>
</template>

<script>
import 'babel-polyfill';
import ImageContainer from './components/ImageContainer.vue'
import UserFriendRequest from './components/UserFriendRequest.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import UserChatOpen from './components/UserChatOpen.vue'
import { shallowRef,  ref } from 'vue'
import FriendsListChat from './components/FriendsListChat.vue'
import Notification from './components/Notification.vue'
export default {
  components: {
    ImageContainer,
    UserFriendRequest,
    PerfectScrollbar,
    SidebarMenu,
    UserChatOpen,
    Notification,
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data(){
    return {
        searchInput:"",
        selectedUser:"",
        usersRaw:[],
        userList:[],
        loadingUsers:false,
        imageContainer:'',
        friendRequestsWithData:[],
        loadingFriendRequests:true,
        lastPageFriendRequests:false,
        totalFriendRequests:0,
        totalPendingFriendRequests:0,
        showFriendRequests: true,
        unwatchFriendRequests:'',
        unwatchSearchInput:'',
        unwatchSearchInputParams:'',
        unwatchLogin:'',
        totalFriends: 0,
        friendsList:[],
        openChatUsersList:[],
        loadingFriends: true,
        menu: [],
        notifications: [],
        totalNotifications: 0,
        scrolledBottomNotifications: false,
        scrolledBottomFr: false,
        lastPageNotifications: false,
        timer:'',
        hasNewNotifications: false,
        editLastChatLine: Function,
    }
  },
  mounted(){
    // on refresh page
    if (this.currentUser){
        this.setInitial();
    }
    // needed watcher bcs on create user is not necesserily logged in
    // but might log in later which won't be covered by created method
    else{
        this.unwatchLogin = this.$watch(
            () => this.$route,
                (to, from) => {
                    // if user is logged in successfully set initial watchers
                    if (from.path == "/login" && to.path == "/" && this.currentUser){
                        this.setInitial();
                    } 
                }
            )
    }
  },
  methods: {
    goToNotificationsPage(){
        this.$router.push("/notifications");
    },
    setInitial(){
        this.menu= [
          {
            header: 'Chat',
            hidden: true,
            hiddenOnCollapse: false
          },
        ]
        this.fetchNotifications();
        this.loadFriends();
        this.fetchFriendRequests();
        this.setRefreshable();
        this.unwatchFriendRequests = this.$watch(
            () => this.$route,
                (to, from) => {
                    if (to.name == "friend-requests"){
                        this.showFriendRequests= false;
                    } else if (from.name == "friend-requests"){
                        this.showFriendRequests= true;
                    }
                }
            )
        this.unwatchSearchInput = this.$watch(
            () => this.$route,
                (to, from) => {
                    if (from.name == "search" && to.name != "search"){
                    this.$refs.searchInput.clearInput();
                        this.searchInput = "";
                        this.selectedUser = "";
                    } 
                }
            )
        this.unwatchSearchInputParams = this.$watch(
                () => this.$route.params,
                (toParams, previousParams) => {
                    this.searchInput = toParams.searchTerm;
                }
            )
        
    },
    onRemoveFriend(){
        this.loadFriends();
    },
    onUpdateRequest(friendRequestChanged) {
        for (let requestInd in this.friendRequestsWithData){
            var friendRequestWithData = this.friendRequestsWithData[requestInd];
            if (friendRequestWithData.friendRequestDTO.id == friendRequestChanged.id){
                this.friendRequestsWithData[requestInd].friendRequestDTO = friendRequestChanged;
                break;
            }
        }
        this.totalPendingFriendRequests -= 1;
        // add friend to chat after accepted request
        this.loadFriends();

        if (this.$route.name=="search"){
            this.$router.push({
                name:"search",
                query: { 
                    searchTerm: this.searchInput, 
                }
            })
        }
        if (this.$route.name=="profile"){
            this.$router.push({
                name:"profile",
                query: { 
                    friend_request: friendRequestChanged.requestStatus,
                }
            })
        }
        if (this.$route.path=="/"){
            this.$router.push({
                name:"home",
                query: { 
                    refresh: 'home',
                }
            })
        }
    },
    setRefreshable(){
        this.timer = window.setInterval( () => {
            this.fetchFriendRequests();
            this.fetchNotifications("update");
        }, 5000);
    },
    goToFriendRequestsPage(){
        this.$router.push("/friend-requests")
    },
    scrollUpHandleFr(e){
        this.scrolledBottomFr = false;
    },
    scrollEndHandleFr(e){
        this.scrolledBottomFr = true;
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
    hasImage(user){
        for (let index in this.usersRaw){
            let userRaw = this.usersRaw[index];
            let username = user.split(" | ")[1];
            if (username == userRaw.username){
                this.fetchProfilePicture(userRaw.id);
                return true;
            }
        }
        return false;
    },
    onSearch(){
        if (this.searchInput.length < 3) return;
        this.$router.push("/search/"+this.searchInput);
    },
    fetchProfilePicture(userId) {
        this.$store.dispatch("user/fetchProfilePicture", userId).then(
            (data) => {
                const imageBlob = new Blob([data.data])
                const imageObjectURL = URL.createObjectURL(imageBlob);
                this.imageContainer = imageObjectURL;
            },
            (error) => {
                console.log(error);
                return null;
            }
        );
    },

    onNotificationClick(notification){
        this.updateNotification(notification);
    },

    updateNotification(notification){
        this.$store.dispatch("notification/updateNotification", notification).then(
            (data) => {
                notification.seen = true;
                // if notification object is not from this list
                // update notification in this list
                for (let ind in this.notifications){
                    if (this.notifications[ind].id == notification.id){
                        this.notifications[ind].seen = true;
                        break;
                    }
                }
                this.checkNewNotifications();
            },
            (error) => {
                console.log(error);
            }
        );
    },

    checkNewNotifications(){
        var newNotifications = false;
        for (let ind in this.notifications){
            if (!this.notifications[ind].seen){
                newNotifications = true;
                break;
            }
        }
        this.hasNewNotifications = newNotifications;
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
                this.checkNewNotifications();
            },
            (error) => {
                console.log(error);
                return null;
            }
        );
    },
    selectUser(event){
        this.$refs.searchInput.clearInput();
        this.searchInput = "";
        this.selectedUser = "";
        var username = event.split(" | ")[1];
        if (this.$store.state.auth.user.username == username){
            this.$router.push("/my-profile");
        } else{
            this.$router.push("/profile/"+username);
        }
    },
    updateUserList(e){
        this.searchInput = e.input;
        if (e.input.length < 3) {
            return;
        }
        this.usersRaw = [];
        this.userList = [];
        // doing this so that while loading the user will be shown loading icon
        // which takes one field
        this.userList.push(this.searchInput);
        this.loadingUsers = true;
        const data = {
            queryString : e.input,
            page: 0,
            itemsPerPage: 10
        }
        this.$store.dispatch("user/searchUsers", data).then(
            (data) => {
                this.usersRaw = [];
                this.userList = [];
                for (let userInd in data){
                    let user = data[userInd];
                    this.usersRaw.push(user);
                    this.userList.push(user.firstName + " " + user.lastName + " | " + user.username);
                }
                this.loadingUsers = false;
            },
            (error) => {
                this.usersRaw = [];
                this.userList = [];
                this.loadingUsers = false;
                console.log(
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString()
                )}
        );
    },
    fetchFriendRequests(){
        this.loadingFriendRequests = true;
        var page = 0;
        this.$store.dispatch("friendRequest/fetchFriendRequests", page).then(
            (data) => {
                this.friendRequestsWithData = [];
                for (let ind in data.friendRequestsWithDataDTO){
                    let frWithData = data.friendRequestsWithDataDTO[ind];
                    this.friendRequestsWithData.push(frWithData);
                }
                this.totalPendingFriendRequests = data.friendRequestsWithDataDTO.length;
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
    onCloseChat(user) {
        for (let userInd in this.openChatUsersList){
            if (this.openChatUsersList[userInd].id == user.id){
                this.openChatUsersList.splice(userInd,1);
                break;
            }
        }
    },
    onClickChat(user, lastChatLineNotification, editLastChatLine) {
        if (!this.openChatUsersList.includes(user)){
            this.editLastChatLine = editLastChatLine;
            this.openChatUsersList.push(user);
            if (lastChatLineNotification!= "" && !lastChatLineNotification.seen) this.updateNotification(lastChatLineNotification);
        }
    },
    loadFriends(){
        this.loadingFriends = true;
        var page =  Math.floor(this.friendsList.length / 21);
        const user = this.currentUser;
        const data = {
            userId: user.userId,
            page: page
        }
        this.$store.dispatch("friendRequest/fetchFriendsList", data).then(
        (data) => {
            this.totalFriends = data.totalFriends;
            this.menu = [];
            this.menu.push(
                {
                    header: 'Chat',
                    hidden: true,
                    hiddenOnCollapse: false
                },
            )
            this.menu.push(
                {
                    header: 'Chat - Friends ('+this.totalFriends+')',
                    hiddenOnCollapse: true
                },
            )
            this.menu.push({
                component: shallowRef(FriendsListChat),
                    props: {
                        userChats:data.users,
                        friendsNumber:data.totalFriends,
                        clickChat:this.onClickChat,
                    },
                    hiddenOnCollapse: true
                }
            )
            this.loadingFriends = false;
        },
        (error) => {
            this.loadingFriends = false;
            this.error = error;
            console.log(error);
        }
    );
    },
    logOut() {
      // if watchLogin wasn't set bcs page was refreshed and user was logged in (see in created method)
      if (this.unwatchLogin == ''){
        this.unwatchLogin = this.$watch(
            () => this.$route,
                (to, from) => {
                    // if user is logged in successfully set initial watchers
                    if (from.path == "/login" && to.path == "/" && this.currentUser){
                        this.setInitial();
                    } 
                }
            )
      }

      this.unwatchFriendRequests();
      this.unwatchSearchInput();
      this.unwatchSearchInputParams();
      clearTimeout(this.timer);
      this.searchInput = '';
      this.searchTerm = '';
      this.selectedUser = '';
      this.usersRaw=[];
      this.userList=[];
      this.openChatUsersList=[];
      this.imageContainer='';
      this.friendRequestsWithData=[];
      this.loadingFriendRequests=false;
      this.lastPageFriendRequests=false;
      this.friendsList=[];
      this.menu= [];
      this.totalFriends = 0;
      this.totalFriendRequests=0;
      this.totalPendingFriendRequests=0;
      this.showFriendRequests= true;
      this.notifications= [];
      this.totalNotifications= 0;
      this.scrolledBottomNotifications= false;
      this.lastPageNotifications = false;
      this.scrolledBottomFr= false;
      this.$store.dispatch('auth/logout');
      this.$router.push({path:'/login'});
    },
  }
};
</script>

<style>
  .friendRequestsLink{
    opacity:0.5;
  }
  .friendRequestsLink1{
    opacity:1;
  }
  .friendRequestsLink:hover{
    opacity:0.9;
  }

  div#typeahead_id_search_wrapper.simple-typeahead :focus{
    color: white!important;
    background-color: none!important;
    outline: 0;
  }

  div#typeahead_id_search_wrapper.simple-typeahead {
    background-color: transparent!important;
    border:none!important;
  }

  input#typeahead_id_search.simple-typeahead-input{
    color: #ffffff7c!important;
    background: 
      linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255)) center bottom 5px /calc(100% - 10px) 0.5px no-repeat;
    border:none!important;
  }

  .navbar-brand{
    cursor:default;
  }
  .nav-item {
    cursor: pointer;
  }

  .v-sidebar-menu.vsm_rtl {opacity:0.95}

  .navbar{
    height:59px
  }

  #app {
    background-color: #e9ecef;
  }

  html,body {
    background-color: #e9ecef;
  }
</style>
