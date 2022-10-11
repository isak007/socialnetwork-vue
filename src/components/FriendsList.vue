<template>
  <div> 
    <div style="float:left;width:100%">
        <div style="float:left;margin-right:10px;margin-left:10px">
            <h3>Friends ({{!this.loading ? friendsList.length : "?"}})</h3>
        </div>
        <div v-if="!this.loading" style="float:left;margin-bottom:10px">
            <Button v-if="showFriends" @click="this.toggleShow" class="btn btn-info">Hide friends</Button>
            <Button v-else-if="!showFriends && friendsList.length > 0" @click="this.toggleShow" class="btn btn-outline-info">Show friends</Button>
        </div>
    </div>

    <div v-if="showFriends">
        <div style="width:fit-content"
            v-if="error"
            class="alert"
            :class="'alert-danger'"
            >
            {{ error }}
        </div>
        <perfect-scrollbar id="friendsList" @mouseover="this.disableScrollable" @mouseleave="this.enableScrollable">
            <div style="float:left" v-for="(friend) in this.friendsList" :key="friend.id">
                <UserProfileSticker :user='friend'/>
            </div>
        </perfect-scrollbar>
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
      loading: true
    };
  },
  created(){
    this.$store.dispatch("friendRequest/fetchFriendsList", this.userId).then(
        (data) => {
            this.friendsList = data;
            this.loading = false;
        },
        (error) => {
            this.error = error;
            console.log(error);
        }
    );
  },
  methods: {
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
    }
  }
};
</script>

<style>
    #friendsList{
        border-radius:10px;
        max-height:410px;
        overflow-y:auto;
        background-color: white;
        width:fit-content;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }
</style>