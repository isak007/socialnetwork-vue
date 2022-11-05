<template>
    <div id="userChatOpen">
        <div :style="this.expanded && this.chatLines.length > 0 ? this.styleChatExpanded : ''">
            <span id="clickable">
                <img v-if="!this.displayPictureObject" @click="this.expanded = !this.expanded"
                    style="width:35px;height:35px;border-radius:50%"
                    id="profile-img"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    class="profile-img-card"/>
                <img v-else @click="this.expanded = !this.expanded"
                    style="width:35px;height:35px;border-radius:50%"
                    :src="this.displayPictureObject"/>
                <span style="word-break:break-word;color:grey;margin-left:15px" @click="this.expanded = !this.expanded">
                    <div style="display:inline-block;vertical-align:middle">
                        <div style="color:#17a2b8;text-decoration:none;font-size:13px">{{this.user.firstName}}&nbsp;{{this.user.lastName}}</div>
                        <div style="font-size:12px;color:grey;margin-bottom:3px">@{{this.user.username}}</div>
                    </div>
                </span>
            </span>
            <span style="float:right;margin-right:5px;margin-top:3px" @click="this.closeChat">
                <img src="../assets/x-16.png" id="closeChatImg"/>
            </span>
        </div>
        <div v-show="this.expanded" style="margin-top:1px;text-align:left">
            <perfect-scrollbar :key="refreshKey" @mouseenter="this.disableScrollable" @mouseleave="this.enableScrollable" style="max-height:300px;overflow-y:scroll" ref="scrollChat"
                @ps-y-reach-start="this.scrollStartHandle" @ps-scroll-down="this.scrollDownHandle" @ps-scroll-up="this.scrollUpHandle">
                <!-- <div style="height:300px;overflow:hidden;overflow-y:scroll"> -->
                    <div v-for="(chatLine) in this.chatLines" :key="chatLine">
                        <div v-if="this.chatLines.indexOf(chatLine) == 0" style="text-align:center;font-size:12px">
                            <span
                                v-show="this.loadingChatLines && this.scrolledTop"
                                class="spinner-border spinner-border-sm"
                            ></span>
                        </div>
                        <!-- <VTooltip theme="tooltip"> -->
                            <div v-if="chatLine.userId == this.sessionUserId" style="width:95%;display:flex;justify-content:right">
                                <VTooltip theme="tooltip" :style="this.styleChatLinesTooltip">
                                    <div 
                                    :style="this.chatLines.indexOf(chatLine) == this.chatLines.length - 1 ? this.styleChatLinesLast : this.styleChatLines">
                                        <div v-if="this.chatLines.indexOf(chatLine) == this.chatLines.length - 1" id="lastElement">
                                            {{chatLine.text}}
                                        </div>
                                        <div v-else-if="this.chatLines.indexOf(chatLine) == this.pastFirstElement" id="pastFirstElement">
                                            {{chatLine.text}}
                                        </div>
                                        <div v-else>
                                            {{chatLine.text}}
                                        </div>
                                    </div>
                                    <template #popper>
                                        {{this.calculateTime(chatLine.dateCreated)}}
                                    </template>
                                </VTooltip>
                            </div>
                            <div v-else style="width:95%;display:flex;justify-content:left">
                                <VTooltip theme="tooltip" :style="this.styleChatLinesTooltip">
                                    <div
                                    :style="this.chatLines.indexOf(chatLine) == this.chatLines.length - 1 ? this.styleChatLinesLast : this.styleChatLines">
                                        <div v-if="this.chatLines.indexOf(chatLine) == this.chatLines.length - 1" id="lastElement">
                                            {{chatLine.text}}
                                        </div>
                                        <div v-else-if="this.chatLines.indexOf(chatLine) == this.pastFirstElement" id="pastFirstElement">
                                            {{chatLine.text}}
                                        </div>
                                        <div v-else>
                                            {{chatLine.text}}
                                        </div>
                                    </div>
                                    <template #popper>
                                        {{this.calculateTime(chatLine.dateCreated)}}
                                    </template>
                                </VTooltip>
                            </div>
                            
                        <!-- </VTooltip> -->
                        
                    </div>
                <!-- </div> -->
            </perfect-scrollbar>
                 
            <Form @submit="createChatLine" @keyup.enter="createChatLine" style="margin-top:3px">
                <!-- <textarea style="padding:10px;width:90%;border:1px solid grey;border-radius:5px;outline:none;margin-right:5px">
                </textarea> -->
                <div :key="refreshKey" @keydown.enter.prevent
                  id="chatLineText" role="textbox" aria-placeholder="Type something..." contenteditable="true" @input="(event) => this.newChatLineTextHandler(event)">
                 </div>
                <div style="display:inline-block;vertical-align:bottom">
                    <Button @click.prevent="this.createChatLine" class="btn btn-none" style="padding:3px">
                        <img style="margin-bottom:5px" src="../assets/send-16.png" id="closeChatImg"/>
                    </Button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { ref } from 'vue';
    export default {
      components: {
        // PerfectScrollbar,
      },
      name: "UserChatOpen",
      props: {
        user: Object,
        editLastChatLine: Function,
        PerfectScrollbar
      },
      data() {
        return {
          content: "",
          showFriends: false,
          displayPictureObject: "",
          expanded: true,
          sessionUserId: this.$store.state.auth.user.userId,
          chat:'',
          chatLines:[],
          page:0,
          newChatLineText:'',
          loadingChatLines:false,
          totalChatLines:0,
          refreshKey: ref(0),
          scrolledTop: false,
          styleChatExpanded: {
            boxShadow:'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px',
            padding:'5px',
            paddingTop:'0px',
          },
          styleChatLines: {
            // fontSize:'15px',
            borderRadius:'5px',
            backgroundColor:'white',
            padding:'10px',
            paddingTop:'2px',
            paddingBottom:'2px',
            width:'fit-content',
            color:'grey',
            marginTop:'7px',
            cursor:'default',
            maxWidth:'200px',
          },
          styleChatLinesTooltip: {
            borderRadius:'5px',
            // padding:'5px',
            // paddingTop:'2px',
            // paddingBottom:'2px',
            width:'fit-content',
          },
          styleChatLinesLast: {
            // fontSize:'15px',
            borderRadius:'5px',
            backgroundColor:'white',
            padding:'10px',
            paddingTop:'2px',
            paddingBottom:'2px',
            width:'fit-content',
            maxWidth:'200px',
            color:'grey',
            marginTop:'7px',
            marginBottom:'7px',
            cursor:'default'
          },
          pastFirstElement:0,
          pastListLength:0,
          lastChatLine:'',
          lastChatLineNotification:'',
          timer:'',
        };
      },
    //   watch: {
    //     count: function() {
    //         this.$nextTick(function() {
    //             var container = this.$refs.scroll;
    //             container.scrollTop = container.scrollHeight;
    //         });
    //     }
    //   },
      mounted(){
        if (this.user.profilePicture != null && this.user.profilePicture != ""){
            this.fetchProfilePicture();
        }
        this.fetchChat();
        this.setRefreshable();
      },
      unmounted(){
        clearTimeout(this.timer);
      },
      methods: {
        setRefreshable(){
            this.timer = window.setInterval( () => {
                this.fetchChatLines("update");
            }, 5000);
        },
        setPastFirstElement(){
            var pastFirstElement = this.chatLines.length
        },
        removeFocus(event){
            // document.activeElement.blur();
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
        scrollDownHandle(e){
            this.scrolledTop = false;
        },
        // scrollUpHandle(e){
        //     if (!this.scrolledTop || this.totalChatLines == this.chatLines.length) return;
        //     this.fetchChatLines("more");
        // },
        scrollStartHandle(e){
            // this.scrollUpHandle();
            //console.log(this.$refs.scrollChat.$el.scrollTop);
            if (this.scrolledTop || this.totalChatLines == this.chatLines.length) return;
            this.scrolledTop = true;
            this.fetchChatLines("more"); 
            // this.$refs.scrollChat.$el.scrollTop = 300
        },
        disableScrollable(){
            // dont disable if there is not enough chat lines for scrolling
            // if (this.commentsList.length < 4){
            //     return;
            // }
            // Get the current page scroll position
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
            // if any scroll is attempted, set this to the previous value
            window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            };
        },
        enableScrollable(){
            window.onscroll = function() {};
        },
        newChatLineTextHandler(e){
            this.newChatLineText = e.target.outerText
        },
        closeChat(){
            this.$emit("close-chat",this.user);
        },
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

        fetchChat(){
            const data = {
                user1Id: this.sessionUserId,
                user2Id: this.user.id
            }
             this.$store.dispatch("chat/fetchChat",data).then(
                (data) => {
                    this.chat = data;
                    this.fetchChatLines("init");
                },
                (error) => {
                    if (error.response.status=='404'){
                        this.createChat();
                    }
                    console.log(error);
                }
              );

          },

        createChat(){
            const chat = {
                user1Id: this.sessionUserId,
                user2Id: this.user.id
            }
            this.$store.dispatch("chat/createChat",chat).then(
                (data) => {
                    this.chat = data;
                },
                (error) => {
                    console.log(error);
                }
              );
        },

        createChatLine(){
            if (this.newChatLineText == '') return;
            const chat = {
                chatId: this.chat.id,
                userId: this.sessionUserId,
                text: this.newChatLineText
            }
            this.$store.dispatch("chatLine/createChatLine",chat).then(
                (data) => {
                    this.chatLines.push(data);
                    this.totalChatLines += 1;
                    this.scrollBottomChat();
                    this.newChatLineText = '';
                    this.refreshKey += 1;
                    this.editLastChatLine(data);
                },
                (error) => {
                    console.log(error);
                }
              );
        },

        scrollBottomChat(){
            // tick is necessary so the scrolling happens after all the elements
            // are mounted
            this.$nextTick(function() {
                var lastElement = document.getElementById("lastElement");
                lastElement.scrollIntoView();
                this.scrolledTop = false;
            });
        },

        scrollPastFirstElementChat(){
            // tick is necessary so the scrolling happens after all the elements
            // are mounted
            this.$nextTick(function() {
                // var pastFirstEl = "pastFirstElement"+(this.pastFirstElCount-2);
                // console.log(pastFirstEl);
                var pastFirstElement = document.getElementById("pastFirstElement");
                pastFirstElement.scrollIntoView({block: "start", inline: "start"});
                this.scrolledTop = false;
            });
        },

        fetchNotificationAndUpdate(){
            const data = {
                senderId: this.user.id,
                receiverId: this.sessionUserId,
                objectId: this.chatLines[this.chatLines.length-1].id,
            }
             this.$store.dispatch("notification/fetchNotification",data).then(
                (data) => {
                    this.lastChatLineNotification = data;
                    this.$root.updateNotification(data);
                },
                (error) => {
                    // if (error.response.status=='404'){
                    //     this.createChat();
                    // }
                    console.log(error);
                }
              );

          },
        
        fetchChatLines(type) {
            this.loadingChatLines = true;
            var page =  type != "update" ? Math.floor(this.chatLines.length / 10) : 0;
            const data = {
                chatId: this.chat.id,
                page: page
            }
            this.$store.dispatch("chatLine/fetchChatLines",data).then(
                (data) => {

                    this.setPastFirstElement();

                    var hasNewChatLines = false;

                    for(let chatLineIndex in data.chatLinesDTO){
                        var chatLine = data.chatLinesDTO[chatLineIndex];
                        var contains = false;
                        for (let index in this.chatLines){
                            var cl = this.chatLines[index];
                            if (chatLine.id == cl.id){
                                contains = true;
                                break;
                            }
                        }
                        if (!contains && (type=="init" || type=="more")){
                            this.chatLines.unshift(chatLine);
                        } else if (!contains && type=="update"){
                            hasNewChatLines = true;
                            this.chatLines.push(chatLine);
                        }
                    }
                    if (this.expanded && hasNewChatLines && type=="update") {
                        this.fetchNotificationAndUpdate();
                        this.editLastChatLine(this.chatLines[this.chatLines.length-1]);
                    }

                    // this.chatLines.push(data.chatLinesDTO);

                    this.totalChatLines = data.totalChatLines;
                    this.loadingChatLines = false;
                    if (type=="init"){
                        this.pastListLength = this.chatLines.length;
                        if (this.chatLines.length > 0) this.scrollBottomChat();
                    } else if (type=="more"){
                        this.pastFirstElement = this.chatLines.length - this.pastListLength - 1;
                        this.pastListLength = this.chatLines.length;
                        this.scrollPastFirstElementChat();
                    } else if (type=="update"){
                        this.pastFirstElement = this.chatLines.length - this.pastListLength - 1;
                        this.pastListLength = this.chatLines.length;
                        if (hasNewChatLines)this.scrollBottomChat();
                    }


                },
                (error) => {
                    this.loadingChatLines = false;
                    console.log(error);
                }
              );

          },
      }
    }
    </script>

    <style>
        #userChatOpen{
            /* float:left; */
            height:fit-content;
            text-align:left;
            margin:5px;
            padding:10px;
            background-color:#F5F5F5;
            border-radius:10px;
            width:270px;
            /* height:60px; */
            overflow:hidden;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }
        #userChatOpenExpanded{
            /* float:left; */
            text-align:left;
            margin:5px;
            padding:10px;
            background-color:#F5F5F5;
            border-radius:10px;
            width:250px;
            /* height:60px; */
            overflow:hidden;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }
        #clickable:hover{
            cursor:pointer
        }
        #closeChatImg{
            opacity:0.5;
            cursor:pointer;
        }
        #closeChatImg:hover{
            /* background-color: #17a2b8;
            border-radius: 50%; */
            opacity:1
        }


        [contenteditable=true]:empty:before{
            content: attr(aria-placeholder);
            display: block; /* For Firefox */
            color: gray;
        }

        div[contenteditable=true] {
            display:inline-block;
            font-family: system-ui;
            font-size: 15px;
            padding: 5px;
            -webkit-appearance: textfield;
            padding-right:10px;
            padding-left:10px;
            width:88%;
            border:1px solid grey;
            border-radius:5px;
            outline:none;
            margin-right:5px;
            background-color:white;
        }

        div[contenteditable=true]:hover{
            cursor:text
        }

    </style>