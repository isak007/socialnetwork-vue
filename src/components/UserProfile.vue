<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <i><strong>{{currentUser.username}}</strong></i>'s Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{currentUser.jwt.substring(0, 20)}} ... {{currentUser.jwt.substr(currentUser.jwt.length - 20)}}
    </p>
    <p>
      <strong>Id:</strong>
      {{currentUser.userId}}
    </p>
  </div>
</template>

<script>
import UserService from '../services/user.service'
    export default {
        name: 'UserProfile',
        data(){
            return {
                user : JSON
            }
        },
        methods: {
            getUserData(){
                UserService.getUserData(this.$route.params.userId).then((response) => {
                    this.user = JSON.stringify(response.data);
                });
            }

        },
        created(){
            this.getUserData()
        }
    }
</script>