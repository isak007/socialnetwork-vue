<template>
  <div :key="refreshKey" class="container">
    <PostsList :userId="this.sessionUserId"></PostsList>
  </div>
</template>

<script>
import PostsList from './PostsList.vue';
import { ref } from 'vue';
export default {
  name: "Home",
  components: {
    PostsList
  },
  data() {
    return {
      content: "",
      sessionUserId: this.$store.state.auth.user.userId,
      refresh: this.$route.params.refresh,
      refreshKey: ref(0)
    };
  },
  mounted() {
    this.unwatchRefresh = this.$watch(
        () => this.$route,
            (to, from) => {
                if (from.name == "home" && to.name == "home"){
                    this.refreshKey+=1;
                }
            }
        )
    // UserService.getPublicContent().then(
    //   (response) => {
    //     this.content = response.data;
    //   },
    //   (error) => {
    //     this.content =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //   }
    // );
  },
};
</script>

<style scoped>
    .container{
        margin-top:20px;
        align-content: center;
        padding:10px;
        padding-top:0px;
        background-color:#e9ecef;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        float:left;
  }
</style>