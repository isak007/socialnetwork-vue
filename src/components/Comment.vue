<template>
    <div v-if="!deleted" style="width:100%;float:left;margin-bottom:30px;">
        <div style="width:100%;float:left;margin-bottom:10px;margin-left:5px">
            <span style="float:left;margin-right:15px">
                <img v-if="!this.displayPictureObject"
                    style="width:45px;height:45px;border-radius:50%"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"/>
                <img v-else
                    style="width:40px;height:40px;border-radius:50%"
                    :src="this.displayPictureObject"/>
            </span>
            <span  style="float:left;margin-right:20px">
                <div v-if="this.$store.state.auth.user.userId != this.user.id"><router-link :to="'/profile/'+this.user.username" style="color:#17a2b8;text-decoration:none">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</router-link></div>
                <div v-else><router-link :to="'/my-profile'" style="color:#17a2b8;text-decoration:none">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</router-link></div>
                <div style="font-size:13px;color:grey">@{{this.user.username}}</div>
            </span>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && !editable" style="float:left">
                <button @click="this.toggleEditable" class="btn btn-none">
                    <img src="../assets/edit-icon-sm.png">
                </button>
            </div>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && editable" style="float:left">
                <button style="margin-right:5px;" v-if="!this.editing" @click="this.editComment" class="btn btn-info btn-sm" :disabled="this.editing || this.deleting || !this.canUpdate">
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
                <button v-if="!this.deleting" @click="this.deleteComment" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting">Delete</button>
                <span v-else>
                    <button class="btn btn-outline-danger btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Deleting</span>
                    </button>
                </span>
                <button @click="this.toggleEditable" class="btn btn-link btn-sm" style="color:grey" :disabled="this.editing || this.deleting">Cancel</button>
            </div>
        </div>

        <VTooltip theme="tooltip" style="float:left;color:grey;margin-left:5px">
            <div v-if="this.comment.edited" style="width:100%;float:left;color:grey;font-size:11px">
                <a>Edited &middot; Posted {{this.displayDate != "fullDate" ? this.displayDate : this.comment.datePosted}}</a>
            </div>
            <div v-else style="width:100%;float:left;color:grey;font-size:11px">
                <a>Posted {{this.displayDate != "fullDate" ? this.displayDate : this.comment.datePosted}}</a>
            </div>
            <template #popper>
                {{this.dateFormatted}}
            </template>
        </VTooltip>
        
        <div style="float:left;width:100%">   
            <div v-if="!this.editable" style="word-break: break-word" id="comment">{{this.comment.text}}</div>
            <div v-else style="color:grey;margin-top:10px">
                <textarea v-model="this.newComment" @input="(event) => this.handleNewComment(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
            </div>
        </div>

        <div style="width:100%;float:left">
            <span style="color:grey;float:left" v-if="this.likes.length > 0" :key="refreshKey">
                    <VMenu :triggers="['click']" :hideTriggers="['click']">
                        <button @click="this.likesClicked" v-if="this.totalLikes == 1" style="color:grey;text-decoration:none" class="btn btn-link btn-sm">
                            {{this.totalLikes}} like
                        </button>
                        <button @click="this.likesClicked" v-else-if="this.totalLikes > 1" style="color:grey;text-decoration:none" class="btn btn-link btn-sm">
                            {{this.totalLikes}} likes
                        </button>


                        <template #popper>
                            <perfect-scrollbar id="friendsList" @mouseenter="this.disableScrollable"  @mouseleave="this.enableScrollable"
                            @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
                                <div style="padding:10px;padding-right:20px;padding-top:5px;padding-bottom:5px;max-height:247px">
                                    <div v-for="(user) in this.likes" :key="user">
                                        <router-link v-if='this.$store.state.auth.user.userId != user.id' :to="'/profile/'+user.username" style="color:#17a2b8;text-decoration:none">
                                            {{user.firstName}} {{user.lastName}}
                                        </router-link>
                                        <router-link v-else :to="'/my-profile'" style="color:#17a2b8;text-decoration:none">
                                            <span style="color:grey">[me]</span> {{user.firstName}} {{user.lastName}}
                                        </router-link>
                                    </div>                              
                                </div>
                            </perfect-scrollbar>

                            <div v-if="this.likes.length > 10 && !this.scrolledBottom && !this.loadingLikes" style="text-align:center">
                                <img style="width:10px;height:10px" src="../assets/icon-arrow-down.png">
                            </div>
                            <div v-if="this.likes.length > 10 && this.scrolledBottom && !this.loadingLikes" style="text-align:center">
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
            </span>
            <span style="margin-top:3px;float:left">
                <a style="color:#17a2b8;text-decoration:none" v-if="this.liked" @click="this.deleteLike" :disabled="this.editing || this.deleting || this.likingDisliking">Dislike</a>
                <a style="color:#17a2b8;text-decoration:none;margin-left:5px" v-else @click="this.createLike" :disabled="this.editing || this.deleting || this.likingDisliking">Like</a>
            </span>
        </div>

        
        
    </div>
</template>

<script>
import { ref } from 'vue';
    export default {
      name: "Comment",
      props: {
        commentWithData: Object
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
        var date = new Date(this.commentWithData.commentDTO.datePosted);
        var dateFormatted = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " - " + 
            (date.getHours().toString().length > 1 ? date.getHours().toString() : "0" + date.getHours().toString()) + ":" +
            (date.getMinutes().toString().length > 1 ? date.getMinutes().toString() : "0" + date.getMinutes().toString()) + "h";
        return {
          content: "",
          showFriends: false,
          displayPictureObject: "",
          user: "",
          comment: this.commentWithData.commentDTO,
          likes: this.commentWithData.commentLikesDTO,
          totalLikes: this.commentWithData.totalLikes,
          liked: this.commentWithData.liked,
          likingDisliking: false,
          deleted:false,
          editable:false,
          editing:false,
          deleting:false,
          loading:false,
          canUpdate:false,
          newComment:this.commentWithData.commentDTO.text,
          displayDate:"",
          dateFormatted:dateFormatted,
          likesPage: 1, // because first page is loaded with comment
          scrolledBottom: false,
          lastPageLikes: this.commentWithData.totalLikes <= 15 ? true : false, // bcs there are 15 likes per page
          refreshKey: ref(0),
          loadingLikes: false,
        };
      },
      mounted(){
        this.displayDate = this.calculateTime();
        this.setRefreshable();   
        this.getUserData();
      },
      methods: {
        scrollEndHandle(e){
            this.scrolledBottom = true;
        },
        scrollUpHandle(e){
            this.scrolledBottom = false;
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
        setRefreshable(){
            window.setInterval( () => {
                this.refreshCommentTimeAndLikes()
            }, 60000);
        },
        refreshCommentTimeAndLikes(){
            this.displayDate = this.calculateTime();
            this.fetchLikes("refresh"); // this will only update the total number of likes
        },
        calculateTime(){
            var startTime = new Date(this.comment.datePosted); 
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
        handleNewComment(e){
            if (this.comment.text == this.newComment || this.newComment == ""){
                this.canUpdate = false;
                return;
            }
            this.canUpdate = true;
        },
        deleteComment(){
            this.deleting = true;
            this.loading = true;
            this.$store.dispatch("comment/deleteComment", this.comment.id).then(
                (data) => {
                    this.deleted= true;
                    this.$emit('comment-delete', this.comment.id);
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
        editComment(){
            this.editing = true;
            this.loading = true;
            const editedComment = this.comment;
            editedComment.text = this.newComment
            this.$store.dispatch("comment/editComment", editedComment).then(
                (data) => {
                    this.comment.text = this.newComment;
                    this.comment.edited = true;
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
        toggleEditable(){
            // revert newComment back to default
            if (this.editable){
                this.newComment = this.comment.text;
            }
            this.editable = !this.editable;
            this.canUpdate = false;
        },
        createLike(){
            this.likingDisliking = true;
            const likeData = {
                commentId: this.comment.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("commentLike/createLike", likeData).then(
                (data) => {
                    this.totalLikes += 1;
                    this.liked = true;
                    this.likes.push(data);
                    this.likingDisliking = false;
                    this.refreshKey+=1;
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
                commentId: this.comment.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("commentLike/deleteLike", likeData).then(
                (data) => {
                    for (let likeIndex in this.likes){
                        var user = this.likes[likeIndex];
                        if (user.id == likeData.userId){
                            this.likes.splice(likeIndex,1);
                            break;
                        }
                    }
                    this.totalLikes -= 1;
                    this.liked = false; 
                    this.likingDisliking = false;
                    this.refreshKey+=1;
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
        fetchLikes(type){
            if(type!="refresh") this.loadingLikes = true;
            const data = {
                commentId: this.comment.id,
                page: type=="refresh" ? 0 : this.likesPage
            }
            this.$store.dispatch("commentLike/fetchCommentLikes", data).then(
            (data) => {
                if (type!="refresh"){
                    this.likes.push.apply(this.likes,data.users);
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
        toggleShow(){
            this.showFriends = !this.showFriends;
        },
        fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture",this.user.id).then(
                (data) => {
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.displayPictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );
        },
        getUserData(){
            this.$store.dispatch("user/getUserData", this.comment.userId).then(
            (data) => {
                this.user = data.data;
                if (this.user.profilePicture != null && this.user.profilePicture != ""){
                    this.fetchProfilePicture();
                }
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

      }
    };
    </script>

    <style>
        #comment{
            padding:10px;
            background-color:#F5F5F5;
            border-radius:10px;
            width:fit-content;
            float:left;
            overflow:hidden;
            box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }
    </style>