<template>
    <div id="userProfileSticker">
        <div>
            <img v-if="!this.displayPictureObject"
                style="width:70px;height:70px;border-radius:50%"
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"/>
            <img v-else
                style="width:70px;height:70px;border-radius:50%"
                :src="this.displayPictureObject"/>
        </div>
        <div style="word-break:break-word;color:grey">
            <div v-if="this.sessionUserId != this.user.is"><router-link :to="'/profile/'+this.user.username" style="color:#17a2b8;text-decoration:none;font-size:13px">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</router-link></div>
            <div v-else><router-link :to="'/my-profile'" style="color:#17a2b8;text-decoration:none;font-size:13px">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</router-link></div>
            <div style="font-size:13px;color:grey;margin-bottom:3px">@{{this.user.username}}</div>
            <div v-if="this.user.profileDescription == null || this.user.profileDescription.length == 0" style="font-size:11px">
                <i>No profile description</i>
            </div>
            <div v-else-if="this.user.profileDescription.length < 50 && this.user.profileDescription.length > 0" style="font-size:11px">
                <i>{{this.user.profileDescription}}</i>
            </div>
            <div v-else style="font-size:11px"><i>{{this.user.profileDescription.substring(0,50)}}...</i></div>
        </div>
    </div>
</template>

<script>    
    export default {
      name: "UserProfileSticker",
      props: {
        user: Object
      },
      data() {
        return {
          content: "",
          showFriends: false,
          sessionUserId: this.$store.state.auth.user.userId,
          displayPictureObject: "",
        };
      },
      mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture();
        }
      },
      methods: {
        toggleShow(){
            this.showFriends = !this.showFriends;
        },
        fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture",this.user.id).then(
                (data) => {
                    console.log(data.data);
                    const imageBlob = new Blob([data.data])
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    URL.revokeObjectURL(this.imageBlob)
                    this.displayPictureObject = imageObjectURL;
                },
                (error) => {
                    console.log(error);
                }
              );

          },

      }
    };
    </script>

    <style>
        #userProfileSticker{
            float:left;
            margin:17px;
            padding:10px;
            background-color:#F5F5F5;
            border-radius:10px;
            width:150px;
            height:180px;
            overflow:hidden;
            text-align: center;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }
    </style>