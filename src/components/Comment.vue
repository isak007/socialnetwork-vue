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
                <div><router-link :to="'/profile/'+this.user.username" style="color:#17a2b8;text-decoration:none">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</router-link></div>
                <div style="font-size:13px;color:grey">@{{this.user.username}}</div>
            </span>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && !editable" style="float:left">
                <Button @click="this.toggleEditable" class="btn btn-none">
                    <img src="../assets/edit-icon-sm.png">
                </Button>
            </div>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && editable" style="float:left">
                <Button style="margin-right:5px;" v-if="!this.editing" @click="this.editComment" class="btn btn-info btn-sm" :disabled="this.editing || this.deleting || !this.canUpdate">
                    Update
                </Button>
                <span style="margin-right:5px;" v-if="this.editing && this.canUpdate">
                    <button class="btn btn-info btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Updating</span>
                    </button>
                </span>
                <Button v-if="!this.deleting" @click="this.deleteComment" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting">Delete</Button>
                <span v-else>
                    <button class="btn btn-outline-danger btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Deleting</span>
                    </button>
                </span>
                <Button @click="this.toggleEditable" class="btn btn-link btn-sm" style="color:grey" :disabled="this.editing || this.deleting">Cancel</Button>
            </div>
        </div>

        <div v-if="this.comment.edited" style="width:100%;float:left;color:grey;margin-left:5px;font-size:11px">
            Edited &middot; Posted: {{this.comment.datePosted}}
        </div>
        <div v-else style="width:100%;float:left;color:grey;margin-left:5px;font-size:11px">
            Posted: {{this.comment.datePosted}}
        </div>

        <div v-if="!this.editable" style="word-break: break-word" id="comment">{{this.comment.text}}</div>
        <div v-else style="color:grey;margin-top:10px">
            <textarea v-model="this.newComment" @input="(event) => this.handleNewComment(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
        </div>

        <div style="width:100%;float:left;margin-left:5px">
            <span style="color:grey" v-if="this.likes.length > 0">
                <a v-if="this.likes.length == 1">{{this.likes.length}} like</a>
                <span v-if="this.likes.length > 1">{{this.likes.length}} likes</span>
                &middot;
            </span>
            <a style="color:#17a2b8;text-decoration:none" v-if="this.liked" @click="this.deleteLike" :disabled="this.editing || this.deleting || this.likingDisliking">Dislike</a>
            <a style="color:#17a2b8;text-decoration:none" v-else @click="this.createLike" :disabled="this.editing || this.deleting || this.likingDisliking">Like</a>
        </div>

        
        
    </div>
</template>

<script>    
    export default {
      name: "Comment",
      props: {
        commentWithData: Object
      },
      data() {
        return {
          content: "",
          showFriends: false,
          displayPictureObject: "",
          user: Object,
          comment: this.commentWithData.commentDTO,
          likes: this.commentWithData.commentLikesDTO,
          liked: this.commentWithData.liked,
          likingDisliking: false,
          deleted:false,
          editable:false,
          editing:false,
          deleting:false,
          loading:false,
          canUpdate:false,
          newComment:this.commentWithData.commentDTO.text
        };
      },
      mounted(){
        this.getUserData();
      },
      methods: {
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
            // revert newDescription back to default
            if (this.editable){
                this.newComment = this.comment.text;
            }
            this.editable = !this.editable;
        },
        createLike(){
            this.likingDisliking = true;
            const likeData = {
                commentId: this.comment.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("commentLike/createLike", likeData).then(
                (data) => {
                    this.liked = true;
                    this.likes.push(data);
                    this.likingDisliking = false;
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
                        var like = this.likes[likeIndex];
                        if (like.userId == likeData.userId){
                            this.likes.splice(likeIndex,1);
                            break;
                        }
                    }
                    this.liked = false; 
                    this.likingDisliking = false;
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
        toggleShow(){
            this.showFriends = !this.showFriends;
        },
        fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture",this.user.id).then(
                (data) => {
                    console.log(data.data);
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