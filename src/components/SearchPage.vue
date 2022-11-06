<template>
  <div>
      <div v-if="!loadingUsers" style="margin-bottom:10px;align-content:center">
            <div style="text-align:center;margin-top:20px">
                <h3 v-if="this.userList.length == 0">No results for: {{this.searchTerm}}</h3>
            </div>
            <div v-for="(user) in this.userList" :key="user">
                <UserProfileSearch :user='user'/>
            </div>
            <div v-if="this.loadingMoreUsers" style="text-align:center;margin-bottom:20px">
                <span
                    v-show="this.loadingMoreUsers"
                    class="spinner-border spinner-border-sm"
                ></span>
                <h3>Loading users...</h3>
            </div>
      </div>
  </div>
</template>

<script>
import 'babel-polyfill'; // es6 shim
import UserProfileSearch from './UserProfileSearch.vue'
export default {
    name: 'SearchPage',
    components: {
        UserProfileSearch
    },
    data(){
        return {
            searchTerm: this.$route.params.searchTerm,
            successful: false,
            loadingUsers: true,
            loadingMoreUsers: false,
            page: 0,
            lastPage: false,
            message: "",
            friendRequest: this.$route.params.friendRequest
        }
    },
    methods: {
        scrollEndHandle(searchTerm){
            window.onscroll = () => {
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                    if(!this.loadingUsers && !this.lastPage){
                        this.updateUserList(searchTerm,"fetchMore");
                    }
                }
            };
        },
        updateUserList(searchTerm,type){
            if (type=="initFetch"){
                this.loadingUsers = true;
            } else if (type=="fetchMore") {
                this.loadingMoreUsers = true;
            }
            const data = {
                queryString : searchTerm,
                page: this.page,
                itemsPerPage: 10
            }
            this.$store.dispatch("user/searchUsers", data).then(
                (data) => {
                    this.userList = [];
                    for (let userInd in data){
                        let user = data[userInd];
                        this.userList.push(user);
                    }
                    if (data.length <= 10){
                        this.lastPage = true;
                    }
                    if (type=="initFetch"){
                        this.loadingUsers = false;
                    } else if (type=="fetchMore") {
                        this.loadingMoreUsers = false;
                    }
                    this.page+=1;
                },
                (error) => {
                    this.userList = [];
                    if (type=="initFetch"){
                        this.loadingUsers = false;
                    } else if (type=="fetchMore") {
                        this.loadingMoreUsers = false;
                    }
                    console.log(
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
                    )
                }
            );
        },
    },
    created(){
        this.scrollEndHandle(this.searchTerm);
        this.updateUserList(this.searchTerm, "initFetch");
        this.$watch(
            () => this.$route.params,
            (toParams, previousParams) => {
                // refresh everything on change of search param
                this.page = 0;
                this.searchTerm = toParams.searchTerm;
                this.scrollEndHandle(toParams.searchTerm);
                this.updateUserList(toParams.searchTerm, "initFetch");
            }
        )
    },
}
</script>

<style scoped>

  .alert{
    width:fit-content
  }

  .error-feedback{
    margin-left:5px;
    color:red;
  }

  .container{
    padding:10px;
    padding-top:0px;
  }

</style>