<template>
  <div>
      
     <div v-if="!this.loading" style="margin-bottom:15px">
        <div style="margin-bottom:5px;">
            <Button v-if="!this.creatable" id="newPost" @click="this.toggleCreatable" class="btn btn-none">
                <span style="vertical-align:middle"><img src="../assets/create-post-blk.png"></span>
                <span style="vertical-align:middle;margin-left:7px">Add new post</span>
            </Button>
            <Button v-else id="newPost" @click="this.toggleCreatable" class="btn btn-none">
                <span style="vertical-align:middle"><img src="../assets/cancel-blk.png"></span>
                <span style="vertical-align:middle;margin-left:7px">Cancel</span>
            </Button>
        </div>
        <Transition>
            <div v-if="this.creatable" id="createPost">
                <div v-if="this.newPictureObject" id="postPicture">
                    <img
                        style="max-height:500px;width:fit-content"
                        :src="this.newPictureObject"
                        alt=""/>
                </div>
                <div>
                    <label style="color:grey">Upload picture</label>
                    <br/>
                    <input type="file" name="picture" :onInputCapture="this.onPictureChange" accept=".jpg,.png,.img" />
                </div>
                <div style="color:grey;margin-top:10px">
                    <label>Description</label>
                    <textarea v-model="this.newDescription" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
                </div>
                <div style="margin-bottom:15px">
                    <div style="color:grey;margin-bottom:5px">Who can see the post</div>
                    <select name="visibility" id="" v-on:change="onChangeVisibility($event)">
                        <option value="PUBLIC">Everyone</option>
                        <option value="FRIENDS">Friends</option>
                        <option value="ME">Only me</option>
                    </select>
                </div>

                <div style="text-align:center">
                    <Button v-if="!this.creatingPost" @click="this.createPost" class="btn btn-info btn-sm" style="width:100px" :disabled="!this.canCreate">
                        Create
                    </Button>
                    <span v-else>
                        <button class="btn btn-outline-info btn-sm" :disabled="creatingPost">
                            <span
                                v-show="creatingPost"
                                class="spinner-border spinner-border-sm"
                            ></span>
                            <span>Creating</span>
                        </button>
                    </span>
                </div>

            </div>
        </Transition>
      </div>
     <div>
        <div v-for="(postWithData) in this.postsList" :key="postWithData">
            <Post :postWithData='postWithData' @post-delete="onPostDelete"/>
        </div>
     </div>
     <div v-if="this.loading" style="text-align:center;margin-bottom:20px">
        <span
            v-show="this.loading"
            class="spinner-border spinner-border-sm"
        ></span>
        <h3>Loading posts...</h3>
      </div>
     <div style="text-align:center" v-if="this.postsList.length == 0 && !this.loading"><h3 style="color:grey"> No posts </h3></div>
  </div>
</template>

<script>
import Post from './Post.vue';
import { ref } from 'vue';
export default {
  name: "PostsList",
  components: {
    Post
  },
  props:{
    userId: Number
  },
  data() {
    return {
      content: "",
      postsList: [],
      error: "",
      loading: false,
      creatable: false,
      creatingPost: false,
      canCreate: false,
      newDescription: "",
      newPictureName: "",
      newPictureObject:"",
      newVisibility:"PUBLIC",
      page:0,
      lastPage:false
    };
  },
  mounted(){
    this.scrollEndHandle();
    this.loadPosts();
  },
  methods: {
    onPostDelete(postId) {
        for (let postInd in this.postsList){
            var postWD = this.postsList[postInd];
            if (postWD.postDTO.id == postId){
                this.postsList.splice(postInd,1);
                break;
            }
        }
    },
    // forceRerender(){
    //     this.refreshKey += 1;
    // },
    scrollEndHandle(){
        window.onscroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                if(!this.loading && !this.lastPage){
                    this.loadPosts();
                }
            }
        };
    },
    loadPosts(){
        this.loading=true;
        const postsData = {
            userId: this.userId,
            page: this.page
        }
        this.$store.dispatch("post/fetchPostsList", postsData).then(
            (data) => {
                for(let postIndexReturned in data){
                    var postWithDataReturned = data[postIndexReturned];
                    var contains = false;
                    for (let postIndex in this.postsList){
                        var postWithData = this.postsList[postIndex];
                        if (postWithData.postDTO.id == postWithDataReturned.postDTO.id){
                            contains = true;
                            break;
                        }
                    }
                    if (!contains){
                        this.postsList.push(postWithDataReturned);
                    }
                }
                if (data.length < 3){
                    this.lastPage = true;
                } else{
                    this.page += 1;
                }
                this.loading = false;
            },
            (error) => {
                this.error = error;
                console.log(error);
            }
        );
    },
    onChangeVisibility: function(e){
        this.newVisibility = e.target.value;
    },
    onPictureChange(e){
        if (e.target.files && e.target.files[0]) {
            const files = e.target.files
            if (!files.length) return
            this.newPictureName= e.target.files[0].name;
            console.log(this.newPictureName)
            const reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.onload = () => (this.newPictureObject = reader.result)
            this.canCreate = true;

        }
    },
    toggleCreatable(){
        this.newDescription = "";
        this.newPictureName = "";
        this.newPictureObject = "";
        this.canCreate = false;
        this.creatable = !this.creatable;
    },
    createPost(){
        this.creatingPost = true;
        const post = {
            picture: this.newPictureName,
            pictureBase64: this.newPictureObject,
            text: this.newDescription,
            visibility: this.newVisibility,
            userId: this.$store.state.auth.user.userId
        }
        this.$store.dispatch("post/createPost", post).then(
            (data) => {
                this.postsList.unshift(data);
                this.toggleCreatable();
                this.creatingPost = false;
                //this.forceRerender();
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
    .v-enter-active,
    .v-leave-active {
    transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
    opacity: 0;
    }

    #postPicture{
        text-align:center;
        width:100%;
        float:left;
        margin-bottom:10px;
        border:1px solid #e9ecef;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    }

    #createPost{
        margin-bottom:30px;
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

    /* #post{
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
    } */
</style>