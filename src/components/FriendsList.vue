<template>
  <div style="margin-bottom:10px"> 
    <div style="float:left;width:100%">
        <div style="float:left;margin-right:10px;margin-left:10px">
            <h3 v-if="this.loading">Friends</h3>
            <h3 v-else>Friends ({{this.totalFriends}})</h3>
        </div>
        <div v-if="!this.loading" style="float:left;margin-bottom:10px">
            <Button v-if="showFriends" @click="this.toggleShow" class="btn btn-info">Hide friends</Button>
            <Button v-else-if="!showFriends && friendsList.length > 0" @click="this.toggleShow" class="btn btn-outline-info">Show friends</Button>
        </div>
    </div>

    <div v-show="showFriends" id="friendsListBg">
        <div style="width:fit-content"
            v-if="error"
            class="alert"
            :class="'alert-danger'"
            >
            {{ error }}
        </div>
        <perfect-scrollbar id="friendsList" @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
            @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
            <div style="float:left" v-for="(friend) in this.friendsList" :key="friend.id">
                <UserProfileSticker :user='friend'/>
            </div>
        </perfect-scrollbar>

        <div v-if="!lastPage" style="text-align:center">
            <Button style="color:#17a2b8;text-decoration:none" class="btn btn-link btn-sm" :disabled="this.loading">
                <span
                    v-show="this.loading && this.showFriends"
                    class="spinner-border spinner-border-sm"
                ></span>
                &nbsp;
            </Button>
        </div>

        <div v-if="this.friendsList.length > 14 && !this.scrolledBottom" style="text-align:center">
            <div style="font-size:12px">Scroll down</div>
            <img  src="../assets/icon-arrow-down.png">
        </div>
        <div v-if="this.friendsList.length > 14 && this.scrolledBottom" style="text-align:center">
            <div style="font-size:12px">&nbsp;</div>
            &nbsp;
        </div>
    </div>
  </div>
</template>

<script>
import UserProfileSticker from './UserProfileSticker.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
export default {
  name: "FriendsList",
  components: {
    UserProfileSticker,
    PerfectScrollbar
  },
  props:{
    userId: Number
  },
  data() {
    return {
      content: "",
      showFriends: false,
      friendsList: [],
      error: "",
      loading: true,
      scrolledBottom: false,
      page:0,
      lastPage:false,
      totalFriends:0,
    };
  },
  created(){
    this.loadFriends();
  },
  methods: {
    scrollUpHandle(e){
        this.scrolledBottom = false;
    },
    scrollEndHandle(e){
        this.scrolledBottom = true;
        // if there was actually scrolling (enough elements for scrolling)
        if (this.friendsList.length > 14){
            // if friends list is already fetching
            if (!this.loading && !this.lastPage){
                this.loadFriends();
            }
        }
    },
    disableScrollable(){
        // dont disable if there is not enough friends in list for scrolling
        if (this.friendsList.length <= 14){
            return;
        }
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
        const data = {
            userId: this.userId,
            page: page
        }
        this.$store.dispatch("friendRequest/fetchFriendsList", data).then(
        (data) => {
            this.totalFriends = data.totalFriends;
            for(let userReturnedInd in data.users){
                // var contains = false;
                // for (let user in this.friendsList){
                //     if (commentWD.commentDTO.id == commentWithData.commentDTO.id){
                //         contains = true;
                //         break;
                //     }
                // }
                let userReturned = data.users[userReturnedInd];
                if (!this.friendsList.includes(userReturned)){
                    this.friendsList.push(userReturned);
                }
            }
            // if backend return less than 4 elements for the page then
            // its last page
            if (data.length < 21 || this.totalFriends == this.friendsList.length){
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