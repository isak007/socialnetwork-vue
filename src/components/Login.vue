<template>
  <div class="container" style="width:fit-content">
  <div class="col-md-12" style="text-align:center">
    <img style="border-radius:50%;margin-top:20px;margin-bottom:20px"
      id="profile-img"
      src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
      class="profile-img-card"
    />
    <Form v-if="!resettingPassword" style="text-align:center" @submit="handleLogin" :validation-schema="schemaLogin">
      <div class="form-group">
        <Field name="username" type="text" class="form-control" placeholder="Username" />
        <ErrorMessage name="username" class="error-feedback" />
      </div>

      <div class="form-group">
        <div class="field has-addons">
            <div class="control is-expanded">
                <Field name="password" type="text" class="form-control" v-if="this.showPassword" placeholder="Password"/>
                <Field name="password" type="password" class="form-control" v-else placeholder="Password"/>
                <ErrorMessage style="margin-left:39px" name="password" class="error-feedback" />
                <div style="text-align:left">
                    <button @click.prevent="this.toggleResetPassword" class="btn btn-link btn-sm">Forgot password</button>
                </div>
            </div>
            <div class="control">
                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="toggleShowPw">
                    <span class="icon is-small is-right">
                        <i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
                    </span>
                </button>
            </div>
            
        </div>
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

    <Form v-else style="text-align:left" @submit="sendLink" :validation-schema="schemaPasswordReset">
      <div class="form-group">
        <label for="email" style="font-size:13px;padding:5px">Enter an email where you'll receive a link for password reset.</label>
        <Field name="email" type="text" class="form-control" placeholder="Email"/>
        <div style="text-align:center"><ErrorMessage name="email" class="error-feedback"/></div>
      </div>

      <div class="form-group">
        <div style="font-size:13px"
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
            >
            {{ message }}
        </div>
      </div>

      <div v-if="!successful" class="form-group">
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span v-if="!loading">Send</span>
          <span v-else>Sending</span>
        </button>
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
    const schemaLogin = yup.object().shape({
      username: yup.string().required("Username is required."),
      password: yup.string().required("Password is required."),
    });
    const schemaPasswordReset = yup.object().shape({
      email: yup.string().email("Invalid email.").required("Email is required.")
    });

    return {
      loading: false,
      message: "",
      schemaLogin,
      schemaPasswordReset,
      showPassword: false,
      resettingPassword: false,
      successful: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    toggleResetPassword(){
        this.resettingPassword = true;
    },
    toggleShowPw() {
      this.showPassword = !this.showPassword;
    },
    sendLink(data) {
      this.loading = true;

      this.$store.dispatch("auth/sendPasswordResetCode", data.email).then(
        () => {
          this.loading = false;
          this.successful = true;
          this.message = "Reset link will be sent to this email if there is corresponding account. \nThe link will expire in 5 minutes."
        },
        (error) => {
          this.loading = false;
          this.successful = true;
          this.message = "Reset link will be sent to this email if there is corresponding account. \nThe link will expire in 5 minutes."
          console.log(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString());
        }
      );
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

  .form-group{
    width:250px
  }

  .error-feedback{
    color:red;
  }
</style>