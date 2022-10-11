<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">

      <div class="navbar-header" style="padding-top:6px;margin-right:5px">
          <router-link to="/welcome" class="nav-brand"  style="color:white; height:100%;text-decoration:none">
             <h5>Virtual Connect</h5>
          </router-link>
      </div>

      <div v-if="currentUser" class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/my-profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.sub }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push({path:'/login'});
    }
  }
};
</script>

<style>
  .navbar-brand{
    cursor:default;
  }
  .nav-item {
    cursor: pointer;
  }

  #app {
    background-color: #e9ecef;
  }

  html,body {
    background-color: #e9ecef;
  }

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
