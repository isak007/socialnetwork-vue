<template>
  <div v-if="authorized" class="container" style="padding:50px;width:fit-content">

    <Form v-if="!successful" style="text-align:left" @submit="passwordReset" :validation-schema="schema">
      <div class="form-group">
        <div class="field has-addons">
            <div class="control is-expanded">
                <Field name="newPassword" type="text" class="form-control" v-if="this.showNewPassword" placeholder="New password"/>
                <Field name="newPassword" type="password" class="form-control" v-else placeholder="New password"/>
                <ErrorMessage style="margin-left:5px" name="newPassword" class="error-feedback" />
            </div>
            <div class="control">
                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="this.showNewPassword = !this.showNewPassword">
                    <span class="icon is-small is-right">
                        <i class="fas" :class="{ 'fa-eye-slash': showNewPassword, 'fa-eye': !showNewPassword }"></i>
                    </span>
                </button>
            </div>
            
        </div>
      </div>
      <div class="form-group">
        <div class="field has-addons">
            <div class="control is-expanded">
                <Field name="newPasswordConfirmation" type="text" class="form-control" v-if="this.showConfirmedPassword" placeholder="Confirm new password"/>
                <Field name="newPasswordConfirmation" type="password" class="form-control" v-else placeholder="Confirm new password"/>
                <ErrorMessage style="margin-left:5px" name="newPasswordConfirmation" class="error-feedback" />
            </div>
            <div class="control">
                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="this.showConfirmedPassword = !this.showConfirmedPassword">
                    <span class="icon is-small is-right">
                        <i class="fas" :class="{ 'fa-eye-slash': showConfirmedPassword, 'fa-eye': !showConfirmedPassword }"></i>
                    </span>
                </button>
            </div>
            
        </div>
      </div>

      <div v-if="!successful" class="form-group">
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span v-if="!loading">Change password</span>
          <span v-else>Changing password</span>
        </button>
      </div>
    </Form>
   
    <div class="form-group">
        <div style="font-size:15px"
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
            >
            {{ message }}
        </div>
      </div>

    <div v-if="successful">
        <button @click="navigateLogin" class="btn btn-primary btn-block">
            <span>Go to login page</span>
        </button>
    </div>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
    export default {
        name: 'PasswordReset',
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        data(){
            const schema = yup.object().shape({
                newPassword: yup
                    .string()
                    .min(6, "Must be at least 6 characters.")
                    .max(40, "Must be maximum 40 characters.")
                    .required("New password is required."),
                newPasswordConfirmation: yup
                    .string()
                    .oneOf([yup.ref('newPassword')], 'Passwords do not match.')
                    .required("Password confirmation is required."),
            });
            return {
                loading: false,
                passwordResetJwt: this.$route.params.jwt,
                successful: false,
                message: "",
                schema,
                showNewPassword: false,
                showConfirmedPassword: false,
                authorized: false,
            }
        },
        methods: {
            navigateLogin(){
                this.$router.push("/login");
            },
            
            passwordReset(data){
                this.loading = true;
                const passwordResetData = {
                    passwordResetJwt : this.passwordResetJwt,
                    newPassword : data.newPassword
                }
                this.$store.dispatch("auth/passwordReset", passwordResetData).then(
                    () => {
                        this.loading = false;
                        this.successful = true;
                        this.message = "You have successfully changed your password."
                    },
                    (error) => {
                        if (error.response.status == 401){
                            this.loading = false;
                            this.message = error.response.data.message
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

            prePasswordResetAuth(){
                this.$store.dispatch("auth/prePasswordResetAuth", this.passwordResetJwt).then(
                    () => {
                        this.authorized = true;
                    },
                    (error) => {
                        this.$router.push("/login");
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
        created(){
            this.prePasswordResetAuth()
        }
    }
</script>

<style scoped>
  .button{
    height: 38px;
  }

  .form-group{
    width:300px
  }

  .error-feedback{
    color:red;
  }
</style>