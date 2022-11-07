<template>
    <div v-if="!deleted && this.$store.state.auth.user" id="post">
        <div style="float:left;width:100%;margin-bottom:15px">
            <div style="float:left">
                <router-link :to="'/profile/'+this.user.username">
                    <img v-if="!this.displayProfilePictureObject"
                        style="width:50px;height:50px;border-radius:50%;margin-right:10px"
                        id="profile-img"
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        class="profile-img-card"/>
                    <img v-else
                        style="width:50px;height:50px;border-radius:50%;margin-right:10px;box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
                        :src="this.displayProfilePictureObject"/>
                </router-link>
                <router-link v-if='this.$store.state.auth.user.userId != this.user.id' :to="'/profile/'+this.user.username" style="color:#17a2b8;text-decoration:none">
                    {{this.user.username}}
                </router-link>
                <router-link v-else :to="'/my-profile'" style="color:grey;text-decoration:none">{{this.user.username}}</router-link>

            </div>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && !editable" style="float:right">
                <button @click="this.toggleEditable" class="btn btn-none">
                    <img src="../assets/edit-icon.png">
                </button>
            </div>
            <div v-if="editable" style="float:right;margin-top:7px">
                <button style="margin-right:5px;"
                    v-if="!this.editing" @click="this.editPost"
                    class="btn btn-info btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking || !this.canUpdate">
                    Update
                </button>
                <span style="margin-right:5px;" v-if="this.editing && this.canUpdate">
                    <button class="btn btn-info btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Updating</span>
                    </button>
                </span>
                <button v-if="!this.deleting" @click="this.deletePost" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Delete</button>
                <span v-else>
                    <button class="btn btn-outline-danger btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Deleting</span>
                    </button>
                </span>
                <button @click="this.toggleEditable" class="btn btn-link btn-sm" style="color:grey" :disabled="this.editing || this.deleting || this.likingDisliking">Cancel</button>
            </div>

        </div>

        <div id="postPicture">
            <img v-if="!this.displayPostPictureObject"
                style="width:fit-content;max-height:500px"
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"/>
            <img v-else
                style="width:fit-content"
                :src="this.displayPostPictureObject"/>
        </div>

        <div style="margin-bottom:15px;margin-left:5px;float:left;width:100%">
            <VTooltip theme="tooltip" style="margin-right:5px;float:right;color:grey">
                <div style="margin-top:3px;margin-right:5px;float:right;color:grey">
                    <a>
                        <span v-if="this.post.edited">Edited &bull;</span>
                        Posted {{this.displayDate != "fullDate" ? this.displayDate : this.post.datePosted}}
                    </a>
                </div>
                <template #popper>
                    {{this.dateFormatted}}
                </template>
            </VTooltip>
            <div v-if="this.postLikes.length>0">
                <div style="float:left">
                    <button v-if="this.liked" @click="this.deleteLike" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Dislike</button>
                    <button v-else @click="this.createLike" class="btn btn-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Like</button>
                </div>
                <div style="float:left" :key="refreshKey">
                    <VMenu :triggers="['click']" :hideTriggers="['click']">
                        <button @click="this.likesClicked" v-if="this.totalLikes == 1" style="color:grey;text-decoration:none" class="btn btn-link btn-sm">
                            {{this.totalLikes}} like
                        </button>
                        <button @click="this.likesClicked" v-else-if="this.totalLikes > 1" style="color:grey;text-decoration:none" class="btn btn-link btn-sm">
                            {{this.totalLikes}} likes
                        </button>

                        <template #popper>
                            <perfect-scrollbar @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
                            @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
                                <div style="padding:10px;padding-right:20px;padding-top:5px;padding-bottom:5px;max-height:247px">
                                    <div v-for="(user) in this.postLikes" :key="user">
                                        <router-link v-if='this.$store.state.auth.user.userId != user.id' :to="'/profile/'+user.username" style="color:#17a2b8;text-decoration:none">
                                            {{user.firstName}} {{user.lastName}}
                                        </router-link>
                                        <router-link v-else :to="'/my-profile'" style="color:#17a2b8;text-decoration:none">
                                            <span style="color:grey">[me]</span> {{user.firstName}} {{user.lastName}}
                                        </router-link>
                                    </div>                              
                                </div>
                            </perfect-scrollbar>

                            <div v-if="this.postLikes.length > 10 && !this.scrolledBottom && !this.loadingLikes" style="text-align:center">
                                <img style="width:10px;height:10px" src="../assets/icon-arrow-down.png">
                            </div>
                            <div v-if="this.postLikes.length > 10 && this.scrolledBottom && !this.loadingLikes" style="text-align:center">
                                &nbsp;
                            </div>

                            <div v-if="this.loadingLikes" style="text-align:center">
                                <button style="color:#17a2b8;text-decoration:none" class="btn btn-link btn-sm" :disabled="this.loadingLikes">
                                    <span
                                        v-show="this.loadingLikes"
                                        class="spinner-border spinner-border-sm"
                                    ></span>
                                </button>
                            </div>
                        </template>
                    </VMenu>
                </div>
                
            </div>
            <div v-else>
                <button v-if="this.liked" @click="this.deleteLike" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Dislike</button>
                <button v-else @click="this.createLike" class="btn btn-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Like</button>
            </div>
        </div>

        <div v-if="this.editable" style="color:grey;margin-top:10px">
            <label>Description</label>
            <textarea v-model="this.newDescription" @input="(event) => this.handleNewDescription(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
        </div>
        <div v-if="this.editable" style="margin-bottom:15px">
            <div style="color:grey;margin-bottom:5px">Who can see the post</div>
            <select name="visibility" id="" v-on:change="onChangeVisibility($event)" v-model="newVisibility">
                <option value="PUBLIC">Everyone</option>
                <option value="FRIENDS">Friends</option>
                <option value="ME">Only me</option>
            </select>
        </div>
        <div v-if="!this.editable && this.post.text" style="margin-top:10px">
            <div style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none;border:none;resize:none;cursor:default">
                {{this.post.text}}
            </div>
        </div>

        <hr style="float:left;width:100%"/>

        
        <CommentsList :postId="this.post.id"></CommentsList>


        
    </div>
</template>

<script>
import CommentsList from './CommentsList.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { ref } from 'vue';
    export default {
      name: "Post",
      components: {
        CommentsList,
        PerfectScrollbar
      },
      props: {
        postWithData: Object
      },
      data() {
        const months = {
            1: "Jan",
            2: "Feb",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }
        var date = new Date(this.postWithData.postDTO.datePosted);
        var dateFormatted = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " - " + 
            (date.getHours().toString().length > 1 ? date.getHours().toString() : "0" + date.getHours().toString()) + ":" +
            (date.getMinutes().toString().length > 1 ? date.getMinutes().toString() : "0" + date.getMinutes().toString()) + "h"
        return {
          content: "",
          displayProfilePictureObject: "",
          displayPostPictureObject: "",
          user: "",
          post: this.postWithData.postDTO,
          postLikes: this.postWithData.postLikesDTO,
          newDescription: this.postWithData.postDTO.text,
          newVisibility: this.postWithData.postDTO.visibility,
          editing: false,
          deleting: false,
          likingDisliking: false,
          loading: false,
          loadingLikes: false,
          liked: this.postWithData.liked,
          totalLikes: this.postWithData.totalLikes,
          message: "",
          editable: false,
          canUpdate: false,
          comments: this.postWithData.commentsDTO,
          deleted:false,
          displayDate: '',
          dateFormatted: dateFormatted,
          postLikesPage: 1, // because first page is loaded with post
          scrolledBottom: false,
          lastPageLikes: this.postWithData.totalLikes <= 15 ? true : false, // bcs there are 15 likes per page
          refreshKey: ref(0),
          displayVideo:'',
          timer:'',
        };
      },
      created(){
        this.displayDate = this.calculateTime();
        this.setRefreshable();
        this.fetchPostOwner();
        if (this.post.picture != null && this.post.picture != ""){
            this.fetchPostPicture();
        }
      },
      unmounted(){
        clearTimeout(this.timer);
      },
      methods: {
        likesClicked(){
            this.scrolledBottom = false;
        },
        scrollUpHandle(e){
            this.scrolledBottom = false;
        },
        scrollEndHandle(e){
            this.scrolledBottom = true;
            // if there was actually scrolling (enough elements for scrolling)
            if (this.postLikes.length > 10){
                // if friends list is already fetching
                if (!this.loadingLikes && !this.lastPageLikes){
                    this.fetchPostLikes("page");
                }
            }
        },
        disableScrollable(){
            // dont disable if there is not enough friends in list for scrolling
            if (this.postLikes.length <= 10){
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
        setRefreshable(){
            this.timer=window.setInterval( () => {
                this.refreshPostTimeAndLikes()
            }, 60000);
        },
        refreshPostTimeAndLikes(){
            this.displayDate = this.calculateTime();
            this.fetchPostLikes("refresh"); // this will only update the total number of likes
        },
        calculateTime(){
            var startTime = new Date(this.post.datePosted); 
            var endTime = new Date();
            var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
            var displayDate = "";
            var diffInMinutes = Math.floor(difference / 60000);
            var diffInHours = Math.floor(diffInMinutes / 60);
            var diffInDays = Math.floor(diffInHours / 24);
            var diffInWeeks = Math.floor(diffInDays / 7);
            var diffInMonths = Math.floor(diffInDays / 30);
            var diffInYears = Math.floor(diffInMonths / 12);
            if (diffInYears > 0){
                if (diffInYears > 1){
                    displayDate = diffInYears+" years ago";
                }else{
                    displayDate = "about a year ago";
                }
            } else{
                if (diffInMonths > 0){
                    if (diffInMonths > 1){
                    displayDate = "about " + diffInMonths+" months ago";
                    }else{
                        displayDate = "about a month ago";
                    }
                } else{
                    if (diffInWeeks > 0){
                        if (diffInWeeks > 1){
                            displayDate = diffInWeeks+" weeks ago";
                        }else{
                            displayDate = diffInWeeks+" week ago";
                        }
                    }
                    else{
                        if (diffInDays > 0){
                            if (diffInDays > 1){
                                displayDate = diffInDays+" days ago";
                            }else{
                                displayDate = diffInDays+" day ago";
                            }
                        } else{
                            if (diffInHours > 0){
                                if(diffInHours > 1){
                                    displayDate = diffInHours+" hours ago";
                                } else{
                                    displayDate = diffInHours+" hour ago";
                                }
                            } else{
                                if(diffInMinutes > 1){
                                    displayDate = diffInMinutes+" minutes ago";
                                } else if(diffInMinutes == 1){
                                    displayDate = diffInMinutes+" minute ago";
                                } else{
                                    displayDate = "just now";
                                }
                            }
                        }
                    }
                }
            }
            return displayDate;
        },
        onChangeVisibility: function(e){
            this.newVisibility = e.target.value;
            if (this.newVisibility == this.postWithData.postDTO.visibility && this.newDescription == this.postWithData.postDTO.text){
                this.canUpdate = false;
            } else{ this.canUpdate = true; }
        },
        handleNewDescription(e){
            if (this.post.text != this.newDescription){
                this.canUpdate = true;
            }else{
                this.canUpdate = false;
            }
        },
        editPost(){
            this.editing = true;
            this.loading = true;
            const editedPost = this.post;
            editedPost.text = this.newDescription;
            editedPost.visibility = this.newVisibility;
            this.$store.dispatch("post/editPost", editedPost).then(
                (data) => {
                    this.post.text = this.newDescription;
                    this.post.visibility = this.newVisibility;
                    this.post.edited = true;
                    this.canUpdate = false;
                    this.editable = false;
                    this.editing = false;
                    this.loading = false;
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
              );
        },
        deletePost(){
            this.deleting = true;
            this.loading = true;
            this.$store.dispatch("post/deletePost", this.post.id).then(
                (data) => {
                    this.deleted= true;
                    this.$emit('post-delete', this.post.id);
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
              );
        },
        loadComments(){
            this.loadingComments = true;
            this.showComments = true;
        },
        createLike(){
            this.likingDisliking = true;
            const likeData = {
                postId: this.post.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("postLike/createLike", likeData).then(
                (data) => {
                    this.totalLikes += 1;
                    this.liked = true;
                    this.postLikes.push(data);
                    this.likingDisliking = false;
                    this.refreshKey +=1;
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
              );
        },
        deleteLike(){
            this.likingDisliking = true;
            const likeData = {
                postId: this.post.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("postLike/deleteLike", likeData).then(
                (data) => {
                    for (let likeIndex in this.postLikes){
                        var user = this.postLikes[likeIndex];
                        if (user.id == likeData.userId){
                            this.postLikes.splice(likeIndex,1);
                            break;
                        }
                    }
                    this.totalLikes -= 1;
                    this.liked = false; 
                    this.likingDisliking = false;
                    this.refreshKey +=1;
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
              );
        },
        toggleEditable(){
            // revert newDescription back to default
            if (this.editable){
                this.newDescription = this.post.text;
            }
            this.editable = !this.editable;
            this.canUpdate = false;
        },
        fetchPostOwner(){
            this.$store.dispatch("user/getUserData", this.post.userId).then(
            (data) => {
                this.user = data.data;
                if (this.user.profilePicture != null && this.user.profilePicture != ""){
                    this.fetchProfilePicture();
                }
                this.message = data.message;
            },
            (error) => {
                this.message =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
            }
            );
          },
        fetchPostLikes(type){
            if(type!="refresh") this.loadingLikes = true;
            const data = {
                postId: this.post.id,
                page: type=="refresh" ? 0 : this.postLikesPage
            }
            this.$store.dispatch("postLike/fetchPostLikes", data).then(
            (data) => {
                if (type!="refresh"){
                    this.postLikes.push.apply(this.postLikes,data.users);
                    this.loadingLikes = false;
                }
                this.totalLikes = data.totalLikes;
            },
            (error) => {
                this.loadingLikes = false;
                this.message =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
            }
            );
        },
        fetchProfilePicture(){
            this.$store.dispatch("user/fetchProfilePicture",this.post.userId).then(
                (data) => {
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.displayProfilePictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );
        },
        fetchPostPicture() {
            this.$store.dispatch("user/fetchPostPicture",this.post.id).then(
                (data) => {
                    const imageBlob = new Blob([data.data]);
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.displayPostPictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );

          },

      }
    };
</script>

<style>
    #postPicture{
        text-align:center;
        width:100%;
        float:left;
        margin-bottom:10px;
        border:1px solid #e9ecef;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    }

    #post{
        margin-bottom:40px;
        padding-top:30px;
        padding-left:50px;
        padding-right:50px;
        padding-bottom:30px;
        border-radius:20px;
        float:left;
        width:100%;
        background-color:white;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }

</style>