<template>
    <div id="userChat" @click="onClickChat">
        <div style="display:inline-block;width:26%;margin-top:5px">
            <img v-if="!this.displayPictureObject"
                style="width:50px;height:50px;border-radius:50%;"
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"/>
            <img v-else
                style="width:50px;height:50px;border-radius:50%"
                :src="this.displayPictureObject"/>
        </div>

        <span style="word-break:break-word;color:grey;display:inline-block;width:74%">
            <div style="display:inline-block;vertical-align:middle;width:fit-content">
                <div style="color:#1e9caf;text-decoration:none;font-size:13px">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</div>
                <div style="font-size:12px;color:grey">@{{this.user.username}}</div>
                <div style="font-size:11px;color:grey">
                    <span v-if="this.lastChatLine.userId == this.sessionUserId">You: {{this.displayLastChatLine}}</span>
                    <span v-else-if="this.lastChatLineNotification != '' && !this.lastChatLineNotification.seen"><b>{{this.displayLastChatLine}}</b></span>
                    <span v-else>{{this.displayLastChatLine}}</span>
                </div>
            </div>
        </span>

        
    </div>
</template>

<script>    
    export default {
      name: "UserChat",
      props: {
        user: Object,
        clickChat: Function
      },
      data() {
        return {
          content: "",
          showFriends: false,
          displayPictureObject: "",
          chat: "",
          lastChatLine: "",
          sessionUserId: this.$store.state.auth.user.userId,
          displayLastChatLine: "",
          lastChatLineNotification: "",
          timer: "",
        };
      },
      mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture();
        }
        this.fetchChat("init");
      },
      unmounted(){
        clearTimeout(this.timer);
      },
      methods: {
        setRefreshable(){
            this.timer = window.setInterval( () => {
                this.fetchLastChatLine("update");
            }, 5000);
        },
        editLastChatLine(chatLine){
            this.lastChatLine = chatLine;
            chatLine.text.length <= 25 ? 
                this.displayLastChatLine = chatLine.text : 
                this.displayLastChatLine = chatLine.text.substring(0,25).concat("...");
        },
        onClickChat(){
            this.clickChat(this.user,this.lastChatLineNotification, this.editLastChatLine);
        },
        toggleShow(){
            this.showFriends = !this.showFriends;
        },
        fetchChat(type){
            const data = {
                user1Id: this.sessionUserId,
                user2Id: this.user.id
            }
             this.$store.dispatch("chat/fetchChat",data).then(
                (data) => {
                    this.chat = data;
                    this.fetchLastChatLine(type);
                },
                (error) => {
                    console.log(error);
                }
              );

          },

        fetchNotification(type){
            const data = {
                senderId: this.user.id,
                receiverId: this.sessionUserId,
                objectId: this.lastChatLine.id,
                activityType: "Sent message"
            }
             this.$store.dispatch("notification/fetchNotification",data).then(
                (data) => {
                    this.lastChatLineNotification = data;
                    if (type=="init") this.setRefreshable();
                },
                (error) => {
                    console.log(error);
                }
              );

          },

        fetchLastChatLine(type) {
            this.$store.dispatch("chatLine/fetchLastChatLine",this.chat.id).then(
                (data) => {
                    if(this.lastChatLine != data) {
                        this.lastChatLine = data;
                        this.lastChatLine.text.length <= 25 ? 
                            this.displayLastChatLine = this.lastChatLine.text : 
                            this.displayLastChatLine = this.lastChatLine.text.substring(0,25).concat("...");
                        // check if message has been seen by user by finding notification
                        if (this.lastChatLine.userId != this.sessionUserId){
                            this.fetchNotification(type);
                        }
                    }
                },
                (error) => {
                    this.loadingChatLines = false;
                    console.log(error);
                }
              );

          },
        fetchProfilePicture() {
            this.$store.dispatch("user/fetchProfilePicture",this.user.id).then(
                (data) => {
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
        #userChat{
            float:left;
            text-align:left;
            margin:5px;
            padding:10px;
            padding-top:5px;
            background-color:#F5F5F5;
            border-radius:10px;
            width:250px;
            overflow:hidden;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
            height:70px;
            direction:ltr;
        }
        #userChat:hover{
            opacity:0.7;
            cursor:pointer
        }
    </style>