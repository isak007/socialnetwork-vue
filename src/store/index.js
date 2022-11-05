import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { friendRequest } from "./friend.request.module";
import { post } from "./post.module";
import { comment } from "./comment.module";
import { postLike } from "./post.like.module";
import { commentLike } from "./comment.like.module";
import { chat } from "./chat.module";
import { chatLine } from "./chat.line.module";
import { notification } from "./notification.module";

const store = createStore({
  modules: {
    auth,
    user,
    friendRequest,
    post,
    postLike,
    comment,
    commentLike,
    chatLine,
    chat,
    notification
  },
});

export default store;