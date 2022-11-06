<template>
    <div style="display:flex;justify-content:center">
        <div id="userProfileSearch">
            <div style="float:left;width:25%">
                <img v-if="!imageContainer"
                    style="height:120px;cursor:pointer" @click="this.goToProfile"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"/>
                <img v-else :src="imageContainer" style="height:120px;cursor:pointer" @click="this.goToProfile">
            </div>

            <div style="padding:7px;float:left;width:55%">
                <div style="cursor:pointer" @click="this.goToProfile">
                    <div style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</div>
                    <div style="color:grey">@{{this.user.username}}</div>
                    <div style="color:grey;font-size:13px;">{{this.user.profileDescription}}</div>
                </div>
            </div>

            <VMenu v-if="this.sessionUserId != this.user.id && this.friendRequest.requestStatus != 'PENDING'" :triggers="['click']" :hideTriggers="['click']"
             :style="this.friendRequest.requestStatus=='ACCEPTED' ? friendsStyle : addFriendStyle">
                <div>
                    <div v-if="this.friendRequest.requestStatus == 'ACCEPTED'" id="friendRequestImg" style="padding:3px;background-color:#17a2b8;
                        border-radius:10px;
                        border-top-left-radius:0;
                        border-bottom-right-radius:0">
                        <img src="../assets/friends-32.png" style="min-height:25px;min-width:25px;">
                        <span style="color:white">Friends</span>
                    </div>
                    <div v-else id="friendRequestImg" style="padding:3px;background-color:#218838;
                        border-radius:10px;
                        border-top-left-radius:0;
                        border-bottom-right-radius:0">
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

            <div v-else-if="this.sessionUserId == this.user.id" style="float:right;width:14%;padding:3px;background-color:grey;cursor:default;
                border-radius:10px;
                border-top-left-radius:0;
                border-bottom-right-radius:0">
                <img src="../assets/user-32.png" style="min-height:25px;min-width:25px;">
                <span style="color:white">&nbsp;Me</span>
            </div>

            <div v-else-if="this.friendRequest.requestStatus=='PENDING' && this.friendRequest.receiverId == this.sessionUserId" 
            style="float:right;width:17%;padding:3px;background-color:grey;cursor:default;
                border-radius:10px;
                border-top-left-radius:0;
                border-bottom-right-radius:0">
                <img src="../assets/add-user-32.png" style="min-height:25px;min-width:25px;">
                <span style="color:white">&nbsp;Pending...</span>
            </div>

            <div v-else-if="this.friendRequest.requestStatus=='PENDING' && this.friendRequest.senderId == this.sessionUserId" 
            style="float:right;width:13%;padding:3px;background-color:grey;cursor:default;
                border-radius:10px;
                border-top-left-radius:0;
                border-bottom-right-radius:0">
                <img src="../assets/add-user-32.png" style="min-height:25px;min-width:25px;">
                <span style="color:white">&nbsp;Sent</span>
            </div>
                
        </div>
    </div>
</template>

<script>    
export default {
    name: "UserProfileSearch",
    props: {
        user: Object
    },
    data() {
        return {
            content: "",
            showFriends: false,
            imageContainer: '',
            sessionUserId: this.$store.state.auth.user.userId,
            areFriends: false,
            friendRequest: '',
            friendRequestSent: false,
            loading: false,
            friendsStyle: {
                float:'right',
                width:'14%',
            },
            addFriendStyle: {
                float:'right',
                width:'18%',
            }
        };
    },
    mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture(this.user.id);
        }
        this.checkFriendRequest();
    },
    methods: {
        sendFriendRequest(){
            this.loading = true;
            const friendRequest = {
                senderId: this.sessionUserId,
                receiverId: this.user.id
            }
            this.$store.dispatch("friendRequest/sendFriendRequest", friendRequest).then(
                (data) => {
                    if (data != ''){
                        this.friendRequest = data;
                    }
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    console.log(error);
                }
            );
        },
        removeFriend(){
            this.loading = true;
            this.$store.dispatch("friendRequest/removeFriend", this.friendRequest.id).then(
                (data) => {
                    this.friendRequest = '';
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    console.log(error);
                }
            );
        },
        goToProfile(){
            if (this.sessionUserId == this.user.id){
                this.$router.push("/my-profile");

            } else{
                this.$router.push("/profile/"+this.user.username);
            }
        },
        toggleShow(){
            this.showFriends = !this.showFriends;
        },
        fetchProfilePicture(userId) {
            this.$store.dispatch("user/fetchProfilePicture", userId).then(
                (data) => {
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    this.imageContainer = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
            );
        },
        checkFriendRequest() {
            const data = {
                user1Id: this.user.id,
                user2Id: this.sessionUserId
            }
            this.$store.dispatch("friendRequest/checkIfFriendRequestExists", data).then(
                (data) => {
                    if (data != ''){
                        this.friendRequest = data;
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
}
</script>

<style scoped>
    #userProfileSearch{
        width:700px;
        height:120px;
        margin-bottom:5px;
        margin-top:15px;
        background-color:#ffffff;
        border-radius:10px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        word-break: break-word;
        overflow:hidden;
    }
    #friendRequestImg{
        opacity:1
    }
    #friendRequestImg:hover{
        cursor:pointer;
        opacity:0.7
    }
</style>