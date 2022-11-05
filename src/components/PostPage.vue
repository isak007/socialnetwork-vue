<template>
  <div v-if="this.loading" style="text-align:center;padding-top:50px">
    <span
        v-show="this.loading"
        class="spinner-border spinner-border-sm"
    ></span>
    <h3>Loading post...</h3>
  </div>
  <div v-if="!loading && postWithData!=''" style="padding-top:5px">
    <Post :postWithData="this.postWithData"/>
  </div>
  <div v-else-if="!loading" style="padding-top:50px">
    <h3 style="text-align:center;color:grey">This post no longer exists.</h3>
  </div>
</template>

<script>
import Post from './Post.vue';
import { ref } from 'vue';
export default {
  name: "PostPage",
  components: {
    Post
  },
  data() {
    return {
      postId: this.$route.params.postId,
      postWithData:'',
      content: "",
      error: "",
      loading: true,
    };
  },
  created(){
    this.loadPost(this.postId);
    this.$watch(
        () => this.$route.params,
        (toParams, previousParams) => {
            if (previousParams.postId != toParams.postId) 
            this.postWithData = '';
            this.loadPost(toParams.postId);
        }
    )
  },
  methods: {
    loadPost(postId){
        this.loading=true;
        this.$store.dispatch("post/fetchPost", postId).then(
            (data) => {
                this.postWithData = data;
                this.loading= false;

            },
            (error) => {
                this.loading= false;
                this.error = error;
                console.log(error);
            }
        );
    },
  }
};
</script>

<style scoped>
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