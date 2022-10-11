<template>
  <div> 
      <div v-if="this.loading" style="text-align:center;">
        <span
            v-show="this.loading"
            class="spinner-border spinner-border-sm"
        ></span>
        <h3>Loading posts...</h3>
        
      </div>

     <div v-for="(postWithData) in this.postsList" :key="postWithData.id">
        <Post :postWithData='postWithData'/>
     </div>
    <div style="text-align:center" v-if="this.postsList.length == 0 && !this.loading"><h3> No posts </h3></div>
  </div>
</template>

<script>
import Post from './Post.vue';
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
      loading: false
    };
  },
  created(){
    this.loading=true;
    this.$store.dispatch("post/fetchPostsList", this.userId).then(
        (data) => {
            this.postsList = data;
            this.loading = false;
            console.log(this.postsList);
        },
        (error) => {
            this.error = error;
            console.log(error);
        }
    );
  },
  methods: {

  }
};
</script>

<style scoped>

</style>