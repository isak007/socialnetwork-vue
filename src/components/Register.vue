<template>
    <div class="container" style="float:left;padding:70px">

        <div style="float:left;margin-bottom:10px"  v-if="!successful">
            <div style="margin-left: 20px;margin-right:102px;margin-top:10px;margin-bottom:10px;align-content:center;text-align:center">

                <img v-if="this.newPictureObject" id="profile-img" style="width:300px;height:300px;border-radius:50%;margin-bottom:10px" :src="this.newPictureObject">

                <img v-else style="border-radius:50%;float:left;margin-bottom:10px"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"
                    />

                <my-upload field="img"
                        @crop-success="this.cropSuccess"
                        @srcFileSet="this.onPictureChange"
                        v-model="show"
                        :width="300"
                        :height="300"
                        langType='en'
                        img-format="png">
                </my-upload>

                <div style="float:center;width:100%">
                    <div v-if="this.newPictureObject"><Button style="color:black" @click="this.clearImageSelection" class="btn btn-link btn-sm">Remove</Button></div>
                    <span><button style="border: 1px solid gray; border-radius:2px" @click="toggleShow">Upload picture</button></span>
                </div>
            </div>
        </div>

        <div class="col-md-12" style="float:left;width:fit-content">
                <Form @submit="handleRegister" :validation-schema="schema">
                    <div v-if="!successful">
                        <h3>Your information</h3>
                        <div style="float:left;margin-right:30px">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <Field name="username" type="text" class="form-control" />
                                <ErrorMessage name="username" class="error-feedback" />
                            </div>
                            <div class="form-group">
                                <label for="firstName">First name</label>
                                <Field name="firstName" type="text" class="form-control" />
                                <ErrorMessage name="firstName" class="error-feedback" />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last name</label>
                                <Field name="lastName" type="text" class="form-control" />
                                <ErrorMessage name="lastName" class="error-feedback" />
                            </div>
                            <div class="form-group">
                                <label for="dateOfBirth">Date of birth</label>
                                <Field name="dateOfBirth" type="date" :max="this.maxDate" :min="this.minDate" class="form-control" />
                                <ErrorMessage name="dateOfBirth" class="error-feedback" />
                            </div>
                        </div>
                        <div style="float:left">
                            <div class="form-group">
                                <label for="city">City</label>
                                <Field name="city" type="text" v-slot="{ field }">
                                    <vue3-simple-typeahead 
                                        v-bind='field'
                                        class="form-control"
                                        style="display: block;
                                            width: 100%;
                                            height: calc(1.5em + .75rem + 2px);
                                            padding: .375rem .75rem;
                                            font-size: 1rem;
                                            font-weight: 400;
                                            line-height: 1.5;
                                            color: #495057;
                                            background-color: #fff;
                                            background-clip: padding-box;
                                            border: 1px solid #ced4da;
                                            border-radius: .25rem;
                                            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out"
                                        id="typeahead_id"
                                        :items="this.cityList"
                                        :minInputLength="2"
                                        :itemProjection="itemProjectionFunction"
                                        @selectItem="(event) => {field.value = event; updateCity(event)}"
                                        @onInput="(event) => updateCityList(event)"
                                        @onFocus="onFocusEventHandler"
                                        @onBlur="(event) => onBlurCityHandler(event)"
                                    >
                                        <template #list-item-text="slot">
                                            <span><img src="../assets/location_tag.png"></span>&nbsp;
                                            <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
                                        </template>
                                    </vue3-simple-typeahead>
                                    <div class="error-feedback" > {{this.cityError}} </div>
                                </Field>
                                <ErrorMessage name="city" class="error-feedback" />
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <Field name="email" type="email" class="form-control" />
                                <ErrorMessage name="email" class="error-feedback" />
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="field has-addons">
                                    <div class="control is-expanded">
                                        <Field name="password" type="text" class="form-control" v-if="this.showPassword"/>
                                        <Field name="password" type="password" class="form-control" v-else/>
                                        <ErrorMessage name="password" class="error-feedback" />

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
                                <label for="confirmPassword">Confirm password</label>
                                <div class="field has-addons">
                                    <div class="control is-expanded">
                                        <Field name="confirmPassword" type="text" class="form-control" v-if="this.showConfirmPassword"/>
                                        <Field name="confirmPassword" type="password" class="form-control" v-else/>
                                        <ErrorMessage name="confirmPassword" class="error-feedback" />
                                    </div>
                                    <div class="control">
                                        <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="toggleShowConfirmPw">
                                            <span class="icon is-small is-right">
                                                <i class="fas" :class="{ 'fa-eye-slash': showConfirmPassword, 'fa-eye': !showConfirmPassword }"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style="width:100%;float:left" >
                                <div style="width:fit-content" v-if="message&&!successful"
                                    class="alert"
                                    :class="successful ? 'alert-success' : 'alert-danger'"
                                    >
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <div style="float:left;width:100%" class="form-group">
                            <button style="width:150px" class="btn btn-primary btn-block" :disabled="loading">
                                <span
                                v-show="loading"
                                class="spinner-border spinner-border-sm"
                                ></span>
                                Sign Up
                            </button>
                        </div>
                        
                        
                    </div>
                </Form>
                
            </div>
            <div v-if="message&&successful" class="container" style="width:fit-content;text-align:center">
                <div style="width:fit-content"
                    class="alert"
                    :class="successful ? 'alert-success' : 'alert-danger'"
                    >
                    {{ message }}
                </div>
            </div>
            

        </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import 'babel-polyfill';
import myUpload from 'vue-image-crop-upload';

export default {
  name: "Register",
  components: {
    'my-upload': myUpload,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    var maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("Username is required.")
        .min(3, "Must be at least 3 characters.")
        .max(20, "Must be maximum 20 characters."),
      email: yup
        .string()
        .email("Email is invalid.")
        .min(7, "Must be at least 7 characters.")
        .max(50, "Must be maximum 50 characters.")
        .required("Email is required."),
      password: yup
        .string()
        .required("Password is required.")
        .min(6, "Must be at least 6 characters.")
        .max(40, "Must be maximum 40 characters."),
      confirmPassword: yup
        .string()
        .required("Password confirmation is required.")
        .oneOf([yup.ref('password')], 'Passwords do not match.'),
      firstName: yup
        .string()
        .required("First name is required.")
        .min(3, "Must be at least 3 characters.")
        .max(20, "Must be maximum 20 characters."),
      lastName: yup
        .string()
        .required("Last name is required.")
        .min(3, "Must be at least 3 characters.")
        .max(20, "Must be maximum 20 characters."),
      dateOfBirth: yup
        .date()
        .max(maxDate,"Entered date is invalid.")
        .required("Date of birth is required."),
      city: yup
        .string()
        .required("City is required.")
    });

    var minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    var dd = maxDate.getDate();
    if (dd < 10){
        dd = "0"+dd;
    }
    var mm = maxDate.getMonth() + 1; //January is 0!
    if (mm < 10){
        mm = "0"+mm;
    }
    var yyyyMax = maxDate.getFullYear();
    var yyyyMin = minDate.getFullYear();
    maxDate = yyyyMax+"-"+mm+"-"+dd;
    minDate = yyyyMin+"-"+mm+"-"+dd;

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      showPassword: false,
      showConfirmPassword: false,
      newPictureName: "",
      newPictureObject: "",
      show: false,
      cityList: [],
      selectedCity: "",
      cityError: "",
      maxDate,
      minDate
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  watch: {
    alertMessage: function (val) {
      this.data.message = val
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/my-profile");
    }
  },
  methods: {
    updateCity(event){
        this.selectedCity = event;
    },

    clearImageSelection(){
        this.newPictureObject = "";
    },

    onBlurCityHandler(e){
        console.log(e.input);
        if (e.input == ""){
            this.cityError = "";
            this.selectedCity = "";
            return;
        }
        else if (!this.cityList.includes(e.input)){
            this.selectedCity = "";
            this.cityError = "City is invalid."
            return;
        }
        this.cityError="";
    },
    selectItemEventHandler(item){
        this.selectedCity = item;
    },

    updateCityList(e){
        if (e.input.length < 2) {
            if (e.input == "") this.cityError = "";
            return;
        }

        const queryString = e.input;
        this.$store.dispatch("user/fetchCityList", queryString).then(
        (data) => {
          this.cityList = [];
          for (let resultNum in data.items){
            let result = data.items[resultNum]
            if (!result.address.city || !result.address.countryName ||
                !result.address.countryCode){
                continue
            }
            console.log(result)
            this.cityList.push((result.address.postalCode!=null ? result.address.postalCode +" " : "") +
                result.address.city+", "+
                result.address.countryName+" "+
                result.address.countryCode)
          }
        },
        (error) => {
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

    toggleShow() {
        this.show = !this.show;
    },
    cropSuccess(imgDataUrl, field){
        this.newPictureObject = imgDataUrl;
    },
    onPictureChange(fileName, fileType, fileSize){
        this.newPictureName = fileName;
    },

    toggleShowPw() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPw() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },


    handleRegister(user) {
      // if the city is invalid
      if (this.cityError){
        return;
      }

      user.city = this.selectedCity;

      this.message = "";
      this.successful = false;
      this.loading = true;

      if (this.newPictureObject != "" && this.newPictureName != ""){
        user.profilePicture = this.newPictureName;
        user.pictureBase64 = this.newPictureObject;
      }

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = "Email has been sent to '"+user.email+"'.";
          this.message += "\nClick the link in your email to activate your account."
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style scoped>
  
  div#typeahead_id_wrapper.simple-typeahead :focus{
    color: #495057!important;
    background-color: #fff!important;
    border-color: #80bdff!important;
    outline: 0;
    box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
  }

  .button{
    height: 38px;
  }

  .form-group{
    width:300px
  }

  .error-feedback{
    margin-left:5px;
    color:red;
  }
</style>