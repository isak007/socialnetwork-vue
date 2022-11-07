<template>
    <div id="notification">
        <div style="width:100%;float:left;font-size:12px;margin-right:10px">
            <div v-if="!this.notification.seen" style="float:left;display:inline-block;color:grey"><b>NEW!</b></div>
            <div style="margin-top:3px;color:grey;float:right;font-size:10px;display:inline-block">{{this.notificationTime}}</div>
        </div>

        <div style="vertical-align:middle; cursor:pointer" @click="this.notification.objectType=='FRIEND_REQUEST' ? this.goToProfile() : this.goToPost()">
            <div v-if="notification.objectType=='POST' || (notification.objectType == 'COMMENT' && notification.activityType=='Commented on a post')" 
            style="margin-right:10px;display:inline-block">
                <img :src="postImageContainer" style="height:75px;border:radius:5px;cursor:pointer">
            </div>

            <div v-else-if="notification.objectType=='FRIEND_REQUEST' || (notification.objectType == 'COMMENT' && notification.activityType=='Liked comment')" 
            style="margin-right:10px;display:inline-block">
                <img v-if="!profileImageContainer"
                    style="height:75px;border-radius:50%;cursor:pointer"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"/>
                <img v-else :src="profileImageContainer" style="height:75px;border-radius:50%;cursor:pointer">
            </div>

            <div style="margin-top:3px">
                <div v-if="notification.objectType == 'POST'" style="cursor:pointer">
                    <span style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>
                    has liked your post.
                </div>
                <div v-if="notification.objectType == 'COMMENT' && notification.activityType=='Commented on a post'" style="cursor:pointer">
                    <span style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>
                    has commented on your post.
                </div>
                <div v-if="notification.objectType == 'COMMENT' && notification.activityType=='Liked comment'" style="cursor:pointer">
                    <span style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>
                    has liked your comment.
                </div>
                <div v-if="notification.objectType=='FRIEND_REQUEST' && notification.activityType=='Sent friend request'" style="cursor:pointer">
                    <span style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>
                    has sent you a friend request.
                </div>
                <div v-if="notification.objectType=='FRIEND_REQUEST' && notification.activityType=='Accepted friend request'" style="cursor:pointer">
                    <span style="color:#17a2b8;">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</span>
                    has accepted your friend request.
                </div>
            </div>
        </div>
    </div>
</template>

<script>    
export default {
    name: "Notification",
    props: {
        notification: Object
    },
    data() {
        return {
            senderId: this.notification.senderId,
            user: '',
            profileImageContainer: '',
            postImageContainer: '',
            sessionUserId: this.$store.state.auth.user.userId,
            notificationTime: '',
            comment:'',
            timer:'',
        };
    },
    mounted(){
      this.notificationTime = this.calculateTime(this.notification.dateCreated);
      this.getUserData();
      this.setRefreshable();
      if (this.notification.objectType=='POST'){
        this.fetchPostPicture(this.notification.objectId);
      }
      if (this.notification.objectType == 'COMMENT' && this.notification.activityType=='Commented on a post'){
        this.fetchComment();
      }
    },
    unmounted(){
        clearTimeout(this.timer);
    },
    methods: {
        goToPost(){
            this.$emit('notification-click', this.notification);
            this.comment != '' ?
            this.$router.push("/post/"+this.comment.postId) :
            this.$router.push("/post/"+this.notification.objectId); 
        },
        setRefreshable(){
            this.timer = window.setInterval( () => {
                this.refreshNotificationTime()
            }, 60000);
        },
        refreshNotificationTime(){
            this.notificationTime = this.calculateTime(this.notification.dateCreated);
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
        getUserData(){
            this.$store.dispatch("user/getUserData", this.senderId).then(
            (data) => {
                this.user = data.data;
                if (this.user.profilePicture != null && this.user.profilePicture != ""){
                    this.fetchProfilePicture();
                }
            },
            (error) => {
                this.message =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
            }
            );
        },
        fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture", this.user.id).then(
                (data) => {
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    this.profileImageContainer = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
            );
        },
        fetchPostPicture(postId) {
            this.$store.dispatch("user/fetchPostPicture",postId).then(
                (data) => {
                    const imageBlob = new Blob([data.data]);
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.postImageContainer = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );

          },
        fetchComment() {
            this.$store.dispatch("comment/fetchComment", this.notification.objectId).then(
                (data) => {
                    this.comment = data;
                    this.fetchPostPicture(this.comment.postId);
                },
                (error) => {
                    console.log(error);
                }
            );
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
            this.$emit('notification-click', this.notification);
            if (this.sessionUserId == this.user.id){
                this.$router.push("/my-profile");

            } else{
                this.$router.push("/profile/"+this.user.username);
            }
        },
        
    }
}
</script>

    <style>
        #notification{
            width:400px;
            height:133px;
            margin:5px;
            padding:10px;
            padding-top:5px;
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