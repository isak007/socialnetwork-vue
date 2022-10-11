<template>
        <Button style="color:#17a2b8" v-if="this.showComments && !this.loading && !this.creating" class="btn btn-link btn-sm" @click="this.toggleCreating">Create new comment</Button>
        <div v-if="this.creating" style="margin-left:10px">
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
        <div v-if="this.creating" style="color:grey;margin-bottom:10px;padding:10px">
            <textarea v-model="this.newComment" @input="(event) => this.handleNewComment(event)" style="padding:10px;width:100%;border:1px solid grey;border-radius:5px;outline:none"></textarea>
        </div>

        <perfect-scrollbar :key="componentKey" id="comments" @mouseover="this.disableScrollable" @mouseleave="this.enableScrollable">
            <div v-if="this.showComments">
                <div v-for="(commentWithData) in this.commentsList" :key="commentWithData.id">
                    <Comment :commentWithData='commentWithData'/>
                </div>
            </div>
        </perfect-scrollbar>

        <div v-if="!lastPage" style="text-align:center">
            <Button style="color:#17a2b8;text-decoration:none" @click="this.loadComments" class="btn btn-link btn-sm" :disabled="this.loading">
                <span
                    v-show="this.loading"
                    class="spinner-border spinner-border-sm"
                ></span>
                &nbsp;
                <span v-if="!this.loading && this.showComments">Load more comments...</span>
                <span v-else-if="!this.loading && !this.showComments">Load comments...</span>
                <span v-else-if="this.loading">Loading...</span>
            </Button>
        </div>

        <div style="text-align:center" v-if="this.commentsList.length == 0 && this.showComments && !this.loading"><h3> No comments </h3></div>
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
      showComments:false,
      page:0,
      lastPage:false,
      creating:false,
      canCreateComment:false,
      newComment:"",
    };
  },
  mounted(){
  },
  methods: {
    forceRerender(){
        const componentKey = ref(0);
        componentKey.value += 1;
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
                this.commentsList.push(data);
                this.canCreateComment = false;
                this.creating = false;
                this.loading = false;
                console.log("new comment list: ");
                console.log(this.commentsList);
                this.forceRerender();
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
        this.loading = true;
        const commentsData = {
            postId: this.postId,
            page: this.page
        }
        this.$store.dispatch("comment/fetchCommentsList", commentsData).then(
            (data) => {
                this.commentsList.push.apply(this.commentsList,data);
                this.loading = false;
                // if backend return less than 3 elements for the page then
                // its last page
                if (data.length < 3){
                    this.lastPage = true;
                } else{
                    this.page += 1;
                }
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
        border-radius:10px;
        max-height:500px;
        overflow-y:auto;
        padding:10px;
        float:left;
        width:100%
    }
</style>