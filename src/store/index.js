import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { friendRequest } from "./friend.request.module";
import { post } from "./post.module";
import { comment } from "./comment.module";
import { postLike } from "./post.like.module";
import { commentLike } from "./comment.like.module";


const store = createStore({
  modules: {
    auth,
    user,
    friendRequest,
    post,
    postLike,
    comment,
    commentLike
  },
});

export default store;