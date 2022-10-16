<template>
        <Button style="color:#17a2b8;text-decoration:none;margin-bottom:20px" 
            v-if="this.showComments && !this.loading && !this.creating" class="btn btn-link btn-sm" @click="this.toggleCreating">
            Create new comment
        </Button>
        <div v-if="this.creating" style="color:grey;padding-left:10px;padding-right:10px">
            <textarea v-model="this.newComment" @input="(event) => this.handleNewComment(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
        </div>
        <div v-if="this.creating" style="margin-left:10px;margin-bottom:20px;">
            <Button v-if="!this.loading" @click="this.createComment" class="btn btn-info btn-sm" :disabled="!this.canCreateComment">Create</Button>
            <span v-else-if="this.loading">
                <button class="btn btn-outline-info btn-sm" :disabled="loading">
                    <span
                        v-show="loading"
                        class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Creating</span>
                </button>
            </span>
            <Button @click="this.toggleCreating" class="btn btn-link btn-sm" style="color:grey" :disabled="this.loading">Cancel</Button>
        </div>

        <div style="text-align:center;color:grey" :key="refreshKey" v-if="this.commentsList.length == 0 && this.showComments && !this.loadingComments"><h3> No comments </h3></div>

        <perfect-scrollbar v-show="showComments && this.commentsList.length != 0" :key="refreshKey"  id="comments" @mouseenter="this.disableScrollable" @mouseleave="this.enableScrollable"
            @ps-y-reach-end="this.scrollEndHandle" @ps-scroll-up="this.scrollUpHandle">
            <div>
                <div v-for="(commentWithData) in this.commentsList" :key="commentWithData">
                    <Comment :commentWithData='commentWithData' @comment-delete="onCommentDelete"/>
                </div>
            </div>
        </perfect-scrollbar>

        <div v-if="this.commentsList.length > 3 && !this.scrolledBottom && this.showComments" style="text-align:center">
            <div style="font-size:12px">Scroll down</div>
            <img  src="../assets/icon-arrow-down.png">
        </div>
        <div v-if="this.commentsList.length > 3 && this.scrolledBottom && this.showComments">
            <div style="font-size:12px">&nbsp;</div>
            &nbsp;
        </div>

        <div v-if="!lastPage" style="text-align:center">
            <Button style="color:#17a2b8;text-decoration:none" @click="this.loadComments" class="btn btn-link btn-sm" :disabled="this.loadingComments">
                <span
                    v-show="this.loadingComments && this.showComments"
                    class="spinner-border spinner-border-sm"
                ></span>
                <!-- <span v-if="!this.loadingComments && this.showComments && this.commentsList.length == 3">Load more comments...</span> -->
                <span v-if="!this.loadingComments && !this.showComments && this.commentsList.length == 0">Load comments...</span>
            </Button>
        </div>
        <div style="text-align:center">
            <Button v-if="!this.showComments && this.commentsList.length > 0"
                style="color:grey" @click="this.toggleComments" class="btn btn-link btn-sm">
                <span >Show comments</span>
            </Button>
        </div>
        <div v-if="showComments && this.commentsList.length > 0" style="text-align:center">
            <Button style="color:grey" @click="this.toggleComments" class="btn btn-link btn-sm">
                <span>Hide comments</span>
            </Button>
        </div>
</template>

<script>
import Comment from './Comment.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { ref } from 'vue';
export default {
  name: "CommentsList",
  components: {
    Comment,
    PerfectScrollbar
  },
  props:{
    postId: Number
  },
  data() {
    return {
      content: "",
      commentsList: [],
      error: "",
      loading:false,
      loadingComments:false,
      showComments:false,
      page:0,
      lastPage:false,
      creating:false,
      canCreateComment:false,
      newComment:"",
      scrolledBottom:false,
      refreshCommentsTimer:'',
      refreshKey:ref(0)
    };
  },
  created(){
  },
  methods: {
    onCommentDelete(commentId) {
        for (let commentInd in this.commentsList){
            var commentWD = this.commentsList[commentInd];
            if (commentWD.commentDTO.id == commentId){
                this.commentsList.splice(commentInd,1);
                break;
            }
        }
    },
    toggleComments(){
        this.showComments = !this.showComments;
        // the state is remembered so scrolledBottom can remain the same
        // if (this.scrolledBottom){
        //     this.scrolledBottom = false;
        // }
    },
    scrollUpHandle(e){
        this.scrolledBottom = false;
    },
    scrollEndHandle(e){
        this.scrolledBottom = true;
        // if there was actually scrolling (enough elements for scrolling)
        if (this.commentsList.length > 3){
            // if comments are already fetching
            if (!this.loadingComments && !this.lastPage){
                this.loadComments();
            }
        }
    },
    forceRerender(){
        this.refreshKey += 1;
    },
    createComment(){
        this.loading = true;
        const comment = {
            text: this.newComment,
            userId: this.$store.state.auth.user.userId,
            postId: this.postId
        }
        this.$store.dispatch("comment/createComment", comment).then(
            (data) => {
                this.commentsList.unshift(data);
                if (this.commentsList.length/(this.page+1) % 4 == 1){
                    this.page += 1;
                }
                this.canCreateComment = false;
                this.creating = false;
                this.loading = false;
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
    handleNewComment(e){
        if (this.newComment == ""){
            this.canCreateComment = false;
            return;
        }
        this.canCreateComment = true;
    },
    toggleCreating(){
        this.newComment = "";
        this.creating = !this.creating
    },
    disableScrollable(){
        // dont disable if there is not enough comments for scrolling
        if (this.commentsList.length < 4){
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
    loadComments(){
        this.showComments = true;
        this.loadingComments = true;
        const commentsData = {
            postId: this.postId,
            page: this.page
        }
        this.$store.dispatch("comment/fetchCommentsList", commentsData).then(
            (data) => {
                // set comments to refresh if its first time fetching
                // and there are comments
                // if (this.commentsList.length == 0 && data.length > 0){
                //     this.setRefreshable();
                // }
                for(let commentIndex in data){
                    var commentWithData = data[commentIndex];
                    var contains = false;
                    for (let commentInd in this.commentsList){
                        var commentWD = this.commentsList[commentInd];
                        if (commentWD.commentDTO.id == commentWithData.commentDTO.id){
                            contains = true;
                            break;
                        }
                    }
                    if (!contains){
                        this.commentsList.push(commentWithData);
                    }
                }
                // if backend return less than 4 elements for the page then
                // its last page
                if (data.length < 4){
                    this.lastPage = true;
                } else{
                    this.page += 1;
                }
                this.loadingComments = false;
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

<style scoped>
    #comments{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        max-height:500px;
        overflow-y:auto;
        padding:10px;
        float:left;
        width:100%;
        /* box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px; */
    }
</style>