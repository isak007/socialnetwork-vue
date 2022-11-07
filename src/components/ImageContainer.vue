<template>
    <img v-if="!imageContainer"
        style="width:35px;height:35px;border-radius:50%"
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"/>
    <img v-else :src="imageContainer" style="width:35px;height:35px;border-radius:50%">
</template>

<script>    
    export default {
      name: "UserProfileSticker",
      props: {
        usersRaw:Object,
        userSearchFormat:String,
      },
      data() {
        return {
          content: "",
          showFriends: false,
          imageContainer: ''
        };
      },
      mounted(){
        this.fetchImage(this.userSearchFormat);
      },
      methods: {
        fetchImage(user){
            for (let index in this.usersRaw){
                let userRaw = this.usersRaw[index];
                let username = user.split(" | ")[1];
                if (username == userRaw.username){
                    this.fetchProfilePicture(userRaw.id);
                }
            }
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

      }
    };
    </script>