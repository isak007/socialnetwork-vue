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
                <div>
                    <span style="color:#17a2b8;" @click="this.goToProfile">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>      
                    <span style="float:right;color:grey;font-size:10px">{{this.displayDate}}</span>
                </div>
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
            timer: '',
            displayDate:'',
        };
    },
    mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture(this.user.id);
        }
        this.displayDate = this.calculateTime(this.friendRequest.dateCreated);
        this.setRefreshable();
    },
    unmounted(){
        clearTimeout(this.timer);
    },
    methods: {
        setRefreshable(){
            this.timer = window.setInterval( () => {
                this.refreshDisplayDate()
            }, 60000);
        },
        refreshDisplayDate(){
            this.displayDate = this.calculateTime(this.friendRequest.dateCreated);
            // console.log(this.notificationTime);
        },
        calculateTime(dateCreated){
            var startTime = new Date(dateCreated); 
            var endTime = new Date();
            var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
            var displayDate = "";
            var diffInMinutes = Math.floor(difference / 60000);
            var diffInHours = Math.floor(diffInMinutes / 60);
            var diffInDays = Math.floor(diffInHours / 24);
            var diffInWeeks = Math.floor(diffInDays / 7);
            var diffInMonths = Math.floor(diffInDays / 30);
            var diffInYears = Math.floor(diffInMonths / 12);
            if (diffInYears > 0){
                if (diffInYears > 1){
                    displayDate = diffInYears+" years ago";
                }else{
                    displayDate = "about a year ago";
                }
            } else{
                if (diffInMonths > 0){
                    if (diffInMonths > 1){
                    displayDate = "about " + diffInMonths+" months ago";
                    }else{
                        displayDate = "about a month ago";
                    }
                } else{
                    if (diffInWeeks > 0){
                        if (diffInWeeks > 1){
                            displayDate = diffInWeeks+" weeks ago";
                        }else{
                            displayDate = diffInWeeks+" week ago";
                        }
                    }
                    else{
                        if (diffInDays > 0){
                            if (diffInDays > 1){
                                displayDate = diffInDays+" days ago";
                            }else{
                                displayDate = diffInDays+" day ago";
                            }
                        } else{
                            if (diffInHours > 0){
                                if(diffInHours > 1){
                                    displayDate = diffInHours+" hours ago";
                                } else{
                                    displayDate = diffInHours+" hour ago";
                                }
                            } else{
                                if(diffInMinutes > 1){
                                    displayDate = diffInMinutes+" minutes ago";
                                } else if(diffInMinutes == 1){
                                    displayDate = diffInMinutes+" minute ago";
                                } else{
                                    displayDate = "just now";
                                }
                            }
                        }
                    }
                }
            }
            return displayDate;
        },
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