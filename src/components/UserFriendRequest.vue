<template>
    <div id="userFriendRequest">
        <div style="margin-right:10px;float:left;width:25%">
            <img v-if="!imageContainer"
                style="height:80px;border-radius:50%;cursor:pointer" @click="this.goToProfile"
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"/>
            <img v-else :src="imageContainer" style="height:80px;border-radius:50%;cursor:pointer" @click="this.goToProfile">
        </div>
        <div style="float:left;width:70%">
            <div style="cursor:pointer">
                <div style="color:#17a2b8;" @click="this.goToProfile">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</div>
                <div style="color:grey" @click="this.goToProfile">@{{this.user.username}}</div>
            </div>

            <div v-if="this.userChoice == '' && this.friendRequest.requestStatus == 'PENDING'">
                <button @click="this.updateFriendRequest('ACCEPTED')" style="text-decoration:none;margin-right:10px" class="btn btn-success btn-sm" :disabled="this.updatingFriendRequest">
                    Accept
                </button>
                <button @click="this.updateFriendRequest('DECLINED')" style="text-decoration:none" class="btn btn-secondary btn-sm" :disabled="this.updatingFriendRequest">
                    Decline
                </button>
            </div>

            <div v-else-if="this.userChoice != ''">
                <button v-if="this.userChoice == 'ACCEPTED'" class="btn btn-outline-success btn-sm"  disabled>
                    {{this.userChoice}}
                </button>
                <button v-if="this.userChoice == 'DECLINED'" class="btn btn-outline-secondary btn-sm"  disabled>
                    {{this.userChoice}}
                </button>
            </div>

            <div v-else>
                <button v-if="this.friendRequest.requestStatus == 'ACCEPTED'" class="btn btn-outline-success btn-sm"  disabled>
                    {{this.friendRequest.requestStatus}}
                </button>
                <button v-if="this.friendRequest.requestStatus == 'DECLINED'" class="btn btn-outline-secondary btn-sm"  disabled>
                    {{this.friendRequest.requestStatus}}
                </button>
            </div>

        </div>
    </div>
</template>

<script>    
export default {
    name: "UserFriendRequest",
    props: {
        frWithData: Object
    },
    data() {
        return {
            user: this.frWithData.userDTO,
            friendRequest: this.frWithData.friendRequestDTO,
            content: "",
            showFriends: false,
            imageContainer: '',
            sessionUserId: this.$store.state.auth.user.userId,
            userChoice: '',
            updatingFriendRequest: false,
        };
    },
    mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture(this.user.id);
        }
    },
    methods: {
        updateFriendRequest(userChoice){
            this.updatingFriendRequest = true;
            const friendRequest = {
                senderId: this.user.id,
                receiverId: this.sessionUserId,
                requestStatus: userChoice
            }
            this.$store.dispatch("friendRequest/updateFriendRequest", friendRequest).then(
                (data) => {
                    this.$emit('update-request',data);
                    this.updatingFriendRequest = false;
                    this.userChoice = userChoice;
                },
                (error) => {
                    this.updatingFriendRequest = false;
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
                    console.log(imageObjectURL);
                    this.imageContainer = imageObjectURL;
                    // URL.revokeObjectURL(this.imageBlob)
                    // this.currentPictureObject = imageObjectURL;
                    // this.displayPictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
}
</script>

    <style>
        #userFriendRequest{
            /* float:center; */
            width:400px;
            height:100px;
            margin:10px;
            padding:10px;
            background-color:#ffffff;
            border-radius:10px;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
            word-break: break-word;
            overflow:hidden;
            float:left;
        }
    </style>