<template>
    <perfect-scrollbar @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
                    @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle" style="max-height:805px; width:260px">
        <div v-for="(userChat) in this.friendsList" :key="userChat">
            <UserChat :user="userChat" :clickChat="this.onClickChat"/>
            <div v-if="this.friendsList.indexOf(userChat) == this.friendsList.length - 1" style="text-align:center;color:white">
                <span
                    v-show="this.loading && this.scrolledBottom"
                    class="spinner-border spinner-border-sm"
                ></span>
            </div>
        </div>
    </perfect-scrollbar>
</template>

<script>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import UserChat from './UserChat.vue'
export default {
  name: "FriendsListChat",
  components: {
    PerfectScrollbar,
    UserChat
  },
  props:{
    userChats: Object,
    clickChat: Function,
    friendsNumber: Number,
  },
  data() {
    return {
      content: "",
      showFriends: false,
      friendsList: this.userChats,
      error: "",
      loading: false,
      scrolledBottom: false,
      page:0,
      lastPage:false,
      totalFriends:this.friendsNumber,
      sessionUserId: this.$store.state.auth.user.userId,
    };
  },
  created(){
    if (this.friendsList.length < 21 || this.totalFriends == this.friendsList.length){
        this.lastPage = true;
    }
  },
  methods: {
    onClickChat(user, lastChatLineNotification, editLastChatLine) {
        this.clickChat(user, lastChatLineNotification, editLastChatLine);
    },
    scrollUpHandle(e){
        this.scrolledBottom = false;
    },
    scrollEndHandle(e){
        if (this.scrolledBottom) return;
        this.scrolledBottom = true;
        // if friends list is already fetching
        if (!this.loading && !this.lastPage){
            this.loadFriends();
        }
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
    toggleShow(){
        this.showFriends = !this.showFriends;
    },
    loadFriends(){
        this.loading = true;
        var page =  Math.floor(this.friendsList.length / 21);
        console.log(this.friendsList.length);
        const data = {
            userId: this.sessionUserId,
            page: page
        }
        this.$store.dispatch("friendRequest/fetchFriendsList", data).then(
        (data) => {
            this.totalFriends = data.totalFriends;
            for(let userReturnedInd in data.users){
                let userReturned = data.users[userReturnedInd];
                console.log(userReturned);
                var contains = false;
                for (let userInd in this.friendsList){
                    let user = this.friendsList[userInd];
                    if (user.id == userReturned.id){
                        contains = true;
                        break;
                    }
                }
                if (!contains){
                    this.friendsList.push(userReturned);
                }
            }
            // if backend return less than 4 elements for the page then
            // its last page
            if (data.users.length < 21 || this.totalFriends == this.friendsList.length){
                this.lastPage = true;
            }
            this.loading = false;
        },
        (error) => {
            this.error = error;
            console.log(error);
        }
      );
    }
  }
};
</script>

<style>
    #friendsListBg{
        float:left;
        width:fit-content;
        background-color: white;
        border-radius:10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }
    #friendsList{
        max-height:410px;
        overflow-y:auto;
        width:fit-content;
    }
</style>