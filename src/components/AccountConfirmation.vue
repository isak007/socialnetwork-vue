<template>
  <div class="container" style="padding:50px;width:fit-content">
    
    <div 
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
        >
        {{ message }}
    </div>

    <div v-if="loading">
    <p>
        <strong>Wait while we activate your account...</strong>
    </p>
    <button class="btn btn-primary btn-block" :disabled="loading">
        <span
        v-show="loading"
        class="spinner-border spinner-border-sm"
        ></span>
        <span> Activating your account</span>
    </button>
    </div>

    <div v-if="successful">
        <button @click="navigateLogin" class="btn btn-primary btn-block">
            <span>Go to login page</span>
        </button>
    </div>

  </div>
</template>

<script>
    export default {
        name: 'AccountConfirmation',
        data(){
            return {
                loading: true,
                jwt: this.$route.params.jwt,
                successful: false,
                message: "",

            }
        },
        methods: {
            navigateLogin(){
                this.$router.push("/login");
            },
            activateAccount(){
                this.$store.dispatch("auth/accountActivation", this.jwt).then(
                    () => {
                        this.loading = false;
                        this.successful = true;
                        this.message = "You have successfully activated your account."
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
        },
        created(){
            this.activateAccount()
        }
    }
</script>