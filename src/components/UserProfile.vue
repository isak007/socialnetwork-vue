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
                <img id="profile-img" :style="this.imgClicked ? imgClickedStyle : imgUnclickedStyle"
                 class="profile-img-card" @click="this.imgClicked = !this.imgClicked" :src="this.displayPictureObject">
                <!-- <img id="profile-img" style="width:300px;height:300px;border-radius:50%;margin-bottom:15px;box-shadow: 0 0 10px;" class="profile-img-card" :src="this.displayPictureObject"> -->
            </div>

            <div style="word-break: break-word;max-width:350px">
                <div style="margin-top:15px"> 
                    <h3>
                        <i><strong>{{this.user.firstName}}&nbsp;{{this.user.lastName}}</strong></i>'s Profile
                    </h3>
                </div>

                <div style="color:grey"> 
                    <h5>@{{this.user.username}}</h5>
                </div>
                <!-- <div v-if="this.user.profileDescription">
                    <div style="word-break: break-word">{{this.user.profileDescription}}</div>
                </div> -->

                <div v-if="this.user.profileDescription" style="padding:10px;border-radius:5px; margin-top:10px; border:none;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                    <div style="word-break: break-word">{{this.user.profileDescription}}</div>
                </div>

                <div style="display:flex;justify-content:center;margin-top:10px">
                    <VMenu v-if="this.friendRequest.requestStatus != 'PENDING'" :triggers="['click']" :hideTriggers="['click']"
                    :style="this.friendRequest.requestStatus=='ACCEPTED' ? friendsStyle : addFriendStyle">
                        <div style="text-align:center">
                            <div v-if="this.friendRequest.requestStatus == 'ACCEPTED'" id="friendRequestImg" style="padding:3px;background-color:#17a2b8;border-radius:5px;">
                                <img src="../assets/friends-32.png" style="min-height:25px;min-width:25px;">
                                <span style="color:white">Friends</span>
                            </div>
                            <div v-else id="friendRequestImg" style="padding:3px;background-color:#218838;border-radius:5px;">
                                <img src="../assets/add-user-32.png" style="min-height:25px;min-width:25px;">
                                <span style="color:white">Add friend</span>
                            </div>
                        </div>

                        <template #popper>
                            <div v-if="this.friendRequest==''" style="padding:10px;cursor:pointer">
                                <Button @click="this.sendFriendRequest" class="btn btn-outline-success btn-sm" :disabled="this.loading"> Send friend request </Button>
                            </div>
                            <div v-else style="padding:10px;cursor:pointer">
                                <Button @click="this.removeFriend" class="btn btn-outline-danger btn-sm" :disabled="this.loading"> Remove friend </Button>
                            </div>
                        </template>

                    </VMenu>

                    <div v-else-if="this.friendRequest.requestStatus=='PENDING' && this.friendRequest.receiverId == this.sessionUserId" 
                    style="float:right;width:122px;padding:3px;background-color:grey;cursor:default;border-radius:5px;">
                        <img src="../assets/add-user-32.png" style="min-height:25px;min-width:25px;">
                        <span style="color:white">&nbsp;Pending...</span>
                    </div>

                    <div v-else-if="this.friendRequest.requestStatus=='PENDING' && this.friendRequest.senderId == this.sessionUserId" 
                    style="float:right;width:90px;padding:3px;background-color:grey;cursor:default;border-radius:5px;">
                        <img src="../assets/add-user-32.png" style="min-height:25px;min-width:25px;">
                        <span style="color:white">&nbsp;Sent</span>
                    </div>
                </div>

            </div>
            
        </div>
      </div>

      <div style="float:left; width:fit-content; margin-right:20px">
        <Form @submit="handleRegister">
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
        </Form>
      </div>
    </div>

    <FriendsList :key="refreshKey" v-if="!loading" style="width:100%;float:left;margin-top:20px" :userId="this.user.id"></FriendsList>
    <PostsList :key="refreshKey" v-if="!loading" :userId="this.user.id" :friendRequest="this.friendRequest"></PostsList>

  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import 'babel-polyfill';
import FriendsList from './FriendsList.vue';
import PostsList from './PostsList.vue';
import { ref } from 'vue';
    export default {
        name: 'MyProfile',
        components: {
            Form,
            Field,
            FriendsList,
            PostsList
        },
        data(){
            console.log(this.$store.state.auth.user.username);
            console.log(this.username);
            if (this.$store.state.auth.user.username == this.username) this.$router.push("/my-profile");
            return {
                username: this.$route.params.username,
                sessionUserId: this.$store.state.auth.user.userId,
                user : Object,
                valid: false,
                successful: false,
                loading: false,
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
                friendRequest: '',
                updatingFriendRequest:false,
                friendsStyle: {
                    float:'left',
                    width:'100px',
                    cursor:'pointer'
                },
                addFriendStyle: {
                    width:'130px',
                    cursor:'pointer'
                },
                refreshKey: ref(0),
                imgClicked: false,
                imgUnclickedStyle:{
                    borderRadius:'50%',
                    width:'300px',
                    height:'300px',
                    minWidth:'300px',
                    minHeight:'300px',
                    marginBottom:'15px',
                    boxShadow: '0 0 10px',
                    cursor:'pointer'
                },
                imgClickedStyle:{
                    borderRadius:'5px',
                    width:'300px',
                    height:'300px',
                    minWidth:'300px',
                    minHeight:'300px',
                    marginBottom:'15px',
                    boxShadow: '0 0 10px',
                    cursor:'pointer'
                }
            }
        },
        created(){
            this.getUserData(this.username);
            this.$watch(
                () => this.$route.params,
                (toParams, previousParams) => {
                    if (this.$store.state.auth.user.username == toParams.username) this.$router.push("/my-profile");
                    this.getUserData(toParams.username);
                }
            )
        },
        methods: {
            checkFriendRequest() {
                const data = {
                    user1Id: this.user.id,
                    user2Id: this.sessionUserId
                }
                this.$store.dispatch("friendRequest/checkIfFriendRequestExists", data).then(
                    (data) => {
                        if (data != ''){
                            this.friendRequest = data;
                        } else{
                            this.friendRequest = '';
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            },
            sendFriendRequest(){
                this.updatingFriendRequest = true;
                const friendRequest = {
                    senderId: this.sessionUserId,
                    receiverId: this.user.id
                }
                this.$store.dispatch("friendRequest/sendFriendRequest", friendRequest).then(
                    (data) => {
                        if (data != ''){
                            this.friendRequest = data;
                        }
                        this.updatingFriendRequest = false;
                    },
                    (error) => {
                        this.updatingFriendRequest = false;
                        console.log(error);
                    }
                );
            },
            removeFriend(){
                this.updatingFriendRequest = true;
                this.$store.dispatch("friendRequest/removeFriend", this.friendRequest.id).then(
                    (data) => {
                        this.$root.onRemoveFriend();
                        this.friendRequest = '';
                        this.updatingFriendRequest = false;
                        this.refreshKey+=1;
                    },
                    (error) => {
                        this.updatingFriendRequest = false;
                        console.log(error);
                    }
                );
            },
            toggleShow() {
                this.show = !this.show;
            },
          fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture", this.user.id).then(
                (data) => {
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
          getUserData(username){
              this.loading=true;
              this.$store.dispatch("user/getUserDataByUsername", username).then(
                (data) => {
                    this.user = data.data;
                    this.selectedCity = this.user.city;
                    if (this.user.profilePicture != null && this.user.profilePicture != ""){
                        this.fetchProfilePicture();
                    }
                    this.loading=false;
                    this.message = data.message;
                    this.checkFriendRequest();
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
    }
</script>

<style scoped>
    #profile-img:hover{
        opacity:0.9
    }

    #friendRequestImg{
        opacity:1
    }
    #friendRequestImg:hover{
        cursor:pointer;
        opacity:0.7
    }

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
  
  .vicp-img{
    max-width:unset!important;
  }

</style>