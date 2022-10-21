<template>
  <div class="container">
    <div id="header">
      <div style="float:left;margin-bottom:10px">
        <div style="margin-left: 20px;margin-right:102px;margin-top:10px;margin-bottom:10px;align-content:center;text-align:center">
            <div v-if="!this.displayPictureObject">
                <img 
                    style="width:172px;height:172px;border-radius:50%;margin-bottom:15px"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"/>
            </div>
            <div v-else>
                <img id="profile-img" style="width:300px;height:300px;border-radius:50%;margin-bottom:15px;box-shadow: 0 0 10px;" class="profile-img-card" :src="this.displayPictureObject">
            </div>
            
            <my-upload
                    v-if="editable"
                    @crop-success="cropSuccess"
                    @srcFileSet="this.onPictureChange"
                    v-model="show"
                    noSquare=true
                    :width="300"
                    :height="300"
                    langType='en'
                    img-format="png,jpg,jpeg,img">
            </my-upload>
            <div v-if="editable&&this.displayPictureObject"><Button style="color:black" @click="this.removeImage" class="btn btn-link btn-sm">Remove</Button></div>
            <button style="border: 1px solid gray; border-radius:2px" @click="toggleShow" v-if="editable">Change profile picture</button>

            <div style="word-break: break-word;max-width:350px">
                <div style="margin-top:15px"> 
                    <h3>
                        <i><strong>{{this.user.firstName}}&nbsp;{{this.user.lastName}}</strong></i>'s Profile
                    </h3>
                </div>

                <div style="color:grey"> 
                    <h5>@{{this.user.username}}</h5>
                </div>

                <div v-if="this.editable">
                    <label style="color:grey" for="description">Description</label>
                    <Field name="description" type="description" v-slot="{ field }" :value="this.user.profileDescription">
                        <textarea style="resize:none;scroll:none;height:90px" maxlength="100" @keyup="this.descriptionHandler(field.value)" v-bind="field" class="form-control" autocomplete="off"/>
                    </Field>
                </div>
                <!-- <div v-if="!this.editable && this.user.profileDescription">
                    <div style="word-break: break-word">{{this.user.profileDescription}}</div>
                </div> -->
                <div v-if="!this.editable && this.user.profileDescription" style="padding:10px;border-radius:5px; margin-top:10px; border:none;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                    <div style="word-break: break-word">{{this.user.profileDescription}}</div>
                </div>

            </div>
        </div>
      </div>

      <div v-if="!this.editable" style="float:left; width:fit-content; margin-right:20px">
        <Form @submit="handleRegister" :validation-schema="schema">
            <div style="color:grey">
                <div style="float:left;margin-right:50px">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <Field readonly name="username" type="text" class="form-control" v-model='this.user.username'/>
                    </div>
                    <div class="form-group">
                        <label for="firstName">First name</label>
                        <Field readonly name="firstName" type="text" class="form-control" v-model='this.user.firstName'/>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last name</label>
                        <Field readonly name="lastName" type="text" class="form-control" v-model='this.user.lastName'/>
                    </div>
                </div>
                <div style="float:left">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <Field readonly name="email" type="email" class="form-control" v-model='this.user.email'/>
                    </div>
                    <div class="form-group">
                        <label for="dateOfBirth">Date of birth</label>
                        <Field readonly name="dateOfBirth" type="date" class="form-control" v-model='this.user.dateOfBirth'/>
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <Field readonly name="city" type="text" class="form-control" v-model='this.user.city'/>
                    </div>
                </div>
            </div>
            <div style="float:left;width:100%">
                <div 
                    v-if="message"
                    class="alert"
                    :class="successful ? 'alert-success' : 'alert-danger'"
                    >
                    {{ message }}
                </div>
            </div>
            <div class="form-group" style="float:left;width:100%">
                <Button class="btn btn-info" @click.prevent="this.changeEditable">Edit personal information</Button>
            </div>
            
        </Form>
      </div>

      <div v-if="this.editable" style="float:left; margin-right:20px">
        <Form @submit="editPersonalData" :validation-schema="schema">
            <div>
                <div style="float:left;margin-right:50px">
                    <Field class="form-control" id="id" name="id" type="hidden" :value='this.user.id'/>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <Field name="username" type="text" class="form-control" :value='this.user.username'/>
                        <ErrorMessage name="username" class="error-feedback" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>

                        <Field validateOnInput=true name="email" type="email" v-slot="{ field, errorMessage }" :value="this.user.email">
                            <input :disabled="this.codeSent || this.sendingCode" v-bind="field" class="form-control" autocomplete="off"
                            @keyup="this.emailHandler(field.value, errorMessage)" />
                            <span class="error-feedback" v-if="errorMessage"> {{ errorMessage }} </span>
                        </Field>

                        <div v-if="this.newEmailValid && !this.codeSent">

                            <div class="form-group">
                                <Button @click.prevent="this.sendCode" class="btn btn-link btn-sm" :disabled="this.sendingCode">
                                    <span
                                        v-show="this.sendingCode"
                                        class="spinner-border spinner-border-sm"
                                    ></span>
                                    <span v-if="!this.sendingCode">Send code to verify</span>
                                    <span v-else>Sending code...</span>
                                </Button>
                                <div name="emailVerificationCode" class="error-feedback">{{ this.emailCodeErr }}</div>
                            </div>
                        </div>

                        <div v-if="this.newEmailValid && this.codeSent">
                            <label for="emailVerificationCode" style="font-size:12px">Paste your code here</label>
                            <input name="emailVerificationCode" placeholder="$2a..." autocomplete="off"
                                @blur="(event) => this.emailCodeHandler(event)" type="text" class="form-control" />
                            <div name="emailVerificationCode" class="error-feedback">{{ this.emailCodeErr }}</div>
                        </div>

                    </div>
                    <div class="form-group">
                        <label for="firstName">First name</label>
                        <Field name="firstName" type="text" class="form-control" :value='this.user.firstName'/>
                        <ErrorMessage name="firstName" class="error-feedback" />
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last name</label>
                        <Field name="lastName" type="text" class="form-control" :value='this.user.lastName'/>
                        <ErrorMessage name="lastName" class="error-feedback" />
                    </div>
                </div>

                <div style="float:left">

                    <div class="form-group">
                        <label for="dateOfBirth">Date of birth</label>
                        <Field name="dateOfBirth" type="date" :max="this.maxDate" :min="this.minDate" class="form-control" :value='this.user.dateOfBirth'/>
                        <ErrorMessage name="dateOfBirth" class="error-feedback" />
                    </div>

                    <div class="form-group">
                        <label for="city">City</label>
                        <Field name="city" type="text" v-slot="{ field }" :value="this.user.city">
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
                                :defaultItem="this.user.city"
                                :items="this.cityList"
                                :minInputLength="2"
                                :itemProjection="itemProjectionFunction"
                                @selectItem="(event) => {field.value = event; updateCity(event)}"
                                @onInput="(event) => updateCityList(event)"
                                @onFocus="onFocusEventHandler"
                                @onBlur="(event) => onBlurCityHandler(event)">
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
                        <label for="password">Confirm password</label>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <Field name="password" type="text" class="form-control" v-if="this.showOldPassword"/>
                                <Field name="password" type="password" class="form-control" v-else/>
                                <ErrorMessage name="password" class="error-feedback" />
                            </div>
                            <div class="control">
                                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="toggleShowOldPw">
                                    <span class="icon is-small is-right">
                                        <i class="fas" :class="{ 'fa-eye-slash': showOldPassword, 'fa-eye': !showOldPassword }"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="newPassword">New password (optional)</label>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <Field name="newPassword" type="text" class="form-control" v-if="this.showNewPassword"/>
                                <Field name="newPassword" type="password" class="form-control" v-else/>
                                <ErrorMessage name="newPassword" class="error-feedback" />
                            </div>
                            <div class="control">
                                <button class="button" @mousedown="event => event.preventDefault()" @click.prevent="toggleShowNewPw">
                                    <span class="icon is-small is-right">
                                        <i class="fas" :class="{ 'fa-eye-slash': showNewPassword, 'fa-eye': !showNewPassword }"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
            <div style="float:left;width:100%">
                <div style="width:fit-content"
                    v-if="message"
                    class="alert"
                    :class="successful ? 'alert-success' : 'alert-danger'"
                    >
                    {{ message }}
                </div>
            </div>
            <div class="form-group" style="float:left;width:100%">
                <button class="btn btn-info btn-block" :disabled="loading" style="float:left;width:30%;margin-right:10px">
                    <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                    ></span>
                    Confirm
                </button>
                <Button class="btn btn-outline-secondary" @click.prevent="this.changeEditable">Cancel</Button>
            </div>
        </Form>
      </div>
    </div>

    <FriendsList style="width:100%;float:left;margin-top:20px" :userId='this.$store.state.auth.user.userId'></FriendsList>
    <PostsList :userId='this.$store.state.auth.user.userId'></PostsList>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import 'babel-polyfill'; // es6 shim
import myUpload from 'vue-image-crop-upload';
import FriendsList from './FriendsList.vue';
import PostsList from './PostsList.vue';
    export default {
        name: 'MyProfile',
        components: {
            'my-upload': myUpload,
            Form,
            Field,
            ErrorMessage,
            FriendsList,
            PostsList
        },
        data(){
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
                .required("Email is required.")
                .email("Email is invalid.")
                .max(50, "Must be maximum 50 characters."),
              password: yup
                .string()
                .required("Curret password is required.")
                .min(6, "Must be at least 6 characters.")
                .max(40, "Must be maximum 40 characters."),
              newPassword: yup
                .string()
                .min(6, "Must be at least 6 characters.")
                .max(40, "Must be maximum 40 characters."),
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
                .required("City is required."),
              description: yup
                .string()
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
                user : Object,
                valid: false,
                editable: false,
                successful: false,
                loading: false,
                schema,
                message: "",
                showOldPassword: false,
                showNewPassword: false,
                currentPictureObject: "",
                displayPictureObject: "",
                newPictureName: "",
                newPictureObject: "",
                newDescription: "",
                show: false,
                cityList: [],
                selectedCity: "",
                cityError: "",
                newEmail: "",
                newEmailValid: false,
                codeSent: false,
                sendingCode: false,
                emailCode:"",
                emailCodeErr: "",
                maxDate,
                minDate,
                params: {
                    token: '123456798',
                    name: 'avatar'
                },
                headers: {
                    smail: '*_~'
                },            }
        },

        methods: {
            descriptionHandler(input){
                this.newDescription = input;
            },

            updateCity(event){
                this.selectedCity = event;
            },

            sendCode(){
                this.sendingCode = true;
                this.$store.dispatch("auth/sendEmailVerificationCode", this.newEmail).then(
                    (data) => {
                        this.sendingCode = false;
                        this.codeSent = true;
                    },
                    (error) => {
                        this.sendingCode = false;
                        this.message =
                            (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                            error.message ||
                            error.toString();
                    }
                );

            },
            emailCodeHandler(e){
                this.emailCode = e.target.value;
                if (this.emailCode == ""){
                    this.emailCodeErr = "Verification code is required."
                }
                else{
                    this.emailCodeErr = ""
                }
            },

            emailHandler(input, errMessage){
                this.newEmail = input;
                if(errMessage || this.newEmail == this.user.email) this.newEmailValid = false;
                else this.newEmailValid = true;
            },

            removeImage(){
                this.newPictureObject = "";
                this.displayPictureObject = "";
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
                        )}
                );
            },

            toggleShow() {
                this.show = !this.show;
            },
            cropSuccess(imgDataUrl, field){
				console.log('-------- picture cropped and saved --------');

                const convertBase64ToBlob = (base64Image) => {
                    // Split into two parts
                    const parts = base64Image.split(';base64,');

                    // Hold the content type
                    const imageType = parts[0].split(':')[1];

                    // Decode Base64 string
                    const decodedData = window.atob(parts[1]);

                    // Create UNIT8ARRAY of size same as row data length
                    const uInt8Array = new Uint8Array(decodedData.length);

                    // Insert all character code into uInt8Array
                    for (let i = 0; i < decodedData.length; ++i) {
                        uInt8Array[i] = decodedData.charCodeAt(i);
                    }

                    // Return BLOB image after conversion
                    return new Blob([uInt8Array], { type: imageType });
                }

                var imgObject = URL.createObjectURL(new Blob([convertBase64ToBlob(imgDataUrl)]));
                this.displayPictureObject = imgObject;
                this.newPictureObject = imgDataUrl;
			},
            onPictureChange(fileName, fileType, fileSize){
                console.log('-------- picture changed --------');
                this.newPictureName = fileName;
            },

          fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture", this.user.id).then(
                (data) => {
                    console.log(data.data);
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.currentPictureObject = imageObjectURL;
                    this.displayPictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );

          },

          toggleShowOldPw() {
            this.showOldPassword = !this.showOldPassword;
          },
          toggleShowNewPw() {
            this.showNewPassword = !this.showNewPassword;
          },

          changeEditable(){
            this.newDescription = this.user.profileDescription;
            this.emailCode = "";
            this.emailCodeErr = "";
            this.newEmail = "";
            this.newEmailValid = false;
            this.codeSent = false;
            this.displayPictureObject = this.currentPictureObject;
            this.newPictureName = "";
            this.newPictureObject = null;
            this.message = "";
            this.cityError = "";
            this.selectedCity = this.user.city;
            this.successful = false;
            if (!this.editable){
              this.editable = true;
            } else {
              this.editable = false
            }
          },

          editPersonalData(userData){
            if (this.user.username == userData.username 
            && this.user.firstName == userData.firstName
            && this.user.lastName == userData.lastName
            && this.user.email == userData.email
            && this.user.dateOfBirth == userData.dateOfBirth
            && this.user.city == userData.city
            && this.user.profileDescription == this.newDescription
            && this.newPictureName == "" && this.newPictureObject == null 
            && (userData.newPassword == null || (userData.newPassword != null && userData.password == userData.newPassword))
            ){
                this.message = "No changes were made.";
                this.successful = false;
                return
            }

            // if the city is invalid
            if (this.cityError){
                return;
            }
            // if user changed email address but hasn't entered email verification code
            if (userData.email != this.user.email && this.emailCode == ""){
                this.emailCodeErr = "Verification code is required.";
                return;
            }
            else if (userData.email != this.user.email && this.emailCode != ""){
                userData.emailVerificationCode = this.emailCode;
            }
            userData.city = this.selectedCity;
            userData.profileDescription = this.newDescription;
            console.log(this.newDescription);

            this.message = "";
            this.successful = false;
            this.loading = true;


            console.log(this.newPictureObject);
            // send photo if user has updated the photo
            if (this.newPictureObject != null && this.newPictureObject != ""){
                this.currentPictureObject = this.displayPictureObject;
                userData.profilePicture = this.newPictureName;
                userData.pictureBase64 = this.newPictureObject;
            }
            // or removed the photo
            else if (this.displayPictureObject == "" && this.currentPictureObject != ""){
                this.currentPictureObject = this.displayPictureObject;
                userData.profilePicture = "remove";
                userData.pictureBase64 = this.newPictureObject;
            }

            this.$store.dispatch("user/editPersonalData", userData).then(
                (data) => {
                    this.user = data;
                    // keep the new picture after change
                    this.currentPictureObject = this.displayPictureObject
                    this.changeEditable();
                    this.message = "Changes have been saved.";
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

          getUserData(){
              this.$store.dispatch("user/getUserData", this.$store.state.auth.user.userId).then(
                (data) => {
                    this.user = data.data;
                    this.selectedCity = this.user.city;
                    if (this.user.profilePicture != null && this.user.profilePicture != ""){
                        this.fetchProfilePicture();
                    }
                    this.message = data.message;
                },
                (error) => {
                    this.message =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.successful = false;
                }
              );
          },

        },
        created(){
            this.getUserData()
        },
    }
</script>

<style scoped>

  div#typeahead_id_wrapper.simple-typeahead :focus{
    color: #495057!important;
    background-color: #fff!important;
    border-color: #80bdff!important;
    outline: 0;
    box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
  }

  .form-group{
    width:300px;
  }

  .alert{
    width:fit-content
  }

  .error-feedback{
    margin-left:5px;
    color:red;
  }

  #header{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    padding-top:30px;
    padding-left:50px;
    padding-right:50px;
    padding-bottom:30px;
    float:left;
    width:100%;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  .container{
    align-content: center;
    padding:10px;
    padding-top:0px;
    background-color:#e9ecef;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    float:left;
  }

  .button{
    height: 38px;
  }

  /* ovamo nista ne mijenja al kao podsjetnik */
  /* da sam dodao ovo u node_modules/vue-image-crop-upload/upload.css fajl */
  /* da se slika ne bi rastezala kad se zoomira */
  .vicp-img{
    max-width:unset!important;
  }

</style>