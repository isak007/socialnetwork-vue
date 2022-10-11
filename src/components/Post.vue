<template>
    <div v-if="!deleted" id="post">
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
                <router-link v-if='this.$store.state.auth.user.userId != this.user.id' :to="'/profile/'+this.user.username"><a style="color:#17a2b8;text-decoration:none">{{this.user.username}}</a></router-link>
                <router-link v-else :to="'/my-profile'" style="color:grey;text-decoration:none">{{this.user.username}}</router-link>

            </div>
            <div v-if="this.user.id ==  this.$store.state.auth.user.userId && !editable" style="float:right">
                <Button @click="this.toggleEditable" class="btn btn-none">
                    <img src="../assets/edit-icon.png">
                </Button>
            </div>
            <div v-if="editable" style="float:right;margin-top:7px">
                <Button style="margin-right:5px;"
                    v-if="!this.editing" @click="this.editPost"
                    class="btn btn-info btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking || !this.canUpdate">
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
                <Button v-if="!this.deleting" @click="this.deletePost" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Delete</Button>
                <span v-else>
                    <button class="btn btn-outline-danger btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Deleting</span>
                    </button>
                </span>
                <Button @click="this.toggleEditable" class="btn btn-link btn-sm" style="color:grey" :disabled="this.editing || this.deleting || this.likingDisliking">Cancel</Button>
            </div>

        </div>

        
        <div id="postPicture">
            <img v-if="!this.displayPostPictureObject"
                style="width:fit-content;max-height:500px"
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"/>
            <img v-else
                style="width:50px;height:50px;border-radius:50%"
                :src="this.displayPostPictureObject"/>
        </div>


        <div style="margin-bottom:5px;margin-left:5px">
            <a v-if="this.likes.length == 1" style="color:grey;text-decoration:none">
                {{this.likes.length}} like
            </a>
            <a v-else-if="this.likes.length > 1" style="color:grey;text-decoration:none">
                {{this.likes.length}} likes
            </a>
            <div style="margin-top:3px;margin-right:5px;float:right;color:grey">
                <span v-if="this.post.edited">Edited &bull;</span>
                Posted: {{this.post.datePosted}}
            </div>
        </div>

        <div>
            <Button v-if="this.liked" @click="this.deleteLike" class="btn btn-outline-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Dislike</Button>
            <Button v-else @click="this.createLike" class="btn btn-danger btn-sm" :disabled="this.editing || this.deleting || this.likingDisliking">Like</Button>
        </div>
        

        <div v-if="this.editable" style="color:grey;margin-top:10px">
            <label>Description</label>
            <textarea v-model="this.newDescription" @input="(event) => this.handleNewDescription(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
        </div>
        <div v-if="!this.editable && this.post.text" style="margin-top:10px">
            <div style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none;border:none;resize:none;cursor:default">
                {{this.post.text}}
            </div>
        </div>

        <!-- <div v-if="!this.editable && this.post.text" style="margin:5px;margin-top:10px;margin-bottom:10px;word-break: break-word;overflow:hidden;cursor:default">
            <div>{{this.post.text}}</div>
        </div> -->

        <hr style="float:left;width:100%"/>

        
        <CommentsList :postId="this.post.id"></CommentsList>

        
    </div>
</template>

<script>   
import CommentsList from './CommentsList.vue';
    export default {
      name: "Post",
      components: {
        CommentsList
      },
      props: {
        postWithData: Object
      },
      data() {
        return {
          content: "",
          displayProfilePictureObject: "",
          displayPostPictureObject: "",
          user: Object,
          post: this.postWithData.postDTO,
          newDescription: this.postWithData.postDTO.text,
          editing: false,
          deleting: false,
          likingDisliking: false,
          loading: false,
          liked: this.postWithData.liked,
          likes: this.postWithData.postLikesDTO,
          message: "",
          editable: false,
          canUpdate: false,
          comments: this.postWithData.commentsDTO,
          deleted:false
        };
      },
      mounted(){
        this.fetchPostOwner();
        if (this.post.picture != null && this.post.picture != ""){
            this.fetchPostPicture();
        }
      },
      methods: {
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
            editedPost.text = this.newDescription
            this.$store.dispatch("post/editPost", editedPost).then(
                (data) => {
                    this.post.text = this.newDescription;
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
                postId: this.post.id,
                userId: this.$store.state.auth.user.userId
            }
            this.$store.dispatch("postLike/deleteLike", likeData).then(
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
        fetchProfilePicture(){
            this.$store.dispatch("user/fetchProfilePicture",this.post.userId).then(
                (data) => {
                    console.log(data.data);
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
                    console.log(data.data);
                    const imageBlob = new Blob([data.data])
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
        margin-top:20px;
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