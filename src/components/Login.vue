<template>
  <div class="container" style="width:fit-content">
  <div class="col-md-12" style="text-align:center">
    <img style="border-radius:50%;margin-top:20px;margin-bottom:20px"
      id="profile-img"
      src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
      class="profile-img-card"
    />
    <Form style="text-align:center" @submit="handleLogin" :validation-schema="schema">
      <div class="form-group">
        <label for="username">Username</label>
        <Field name="username" type="text" class="form-control" />
        <ErrorMessage name="username" class="error-feedback" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="field has-addons">
            <div class="control is-expanded">
                <Field name="password" type="text" class="form-control" v-if="this.showPassword"/>
                <Field name="password" type="password" class="form-control" v-else/>
            </div>
            <div class="control">
                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="toggleShowPw">
                    <span class="icon is-small is-right">
                        <i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
                    </span>
                </button>
            </div>
        </div>
        <ErrorMessage name="password" class="error-feedback" />
      </div>

      <div class="form-group">
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span>Login</span>
        </button>
      </div>

      <div class="form-group">
        <div v-if="message" class="alert alert-danger" role="alert">
          {{ message }}
        </div>
      </div>
    </Form>
  </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required."),
      password: yup.string().required("Password is required."),
    });

    return {
      loading: false,
      message: "",
      schema,
      showPassword: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    toggleShowPw() {
      this.showPassword = !this.showPassword;
    },
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          if (error.response.status == 401){
            this.loading = false;
            this.message = "Bad credentials."
            return;
          }
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>

<style scoped>
  .button{
    height: 38px;
  }

  .error-feedback{
    color:red;
  }
</style>