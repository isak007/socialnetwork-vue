import { createWebHistory, createRouter } from "vue-router";
import Welcome from "./components/Welcome.vue";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const UserProfile = () => import("./components/UserProfile.vue")
const MyProfile = () => import("./components/MyProfile.vue")
const AccountConfirmation = () => import("./components/AccountConfirmation.vue")
const SearchPage = () => import("./components/SearchPage.vue")
const FriendRequestsPage = () => import("./components/FriendRequestsPage.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/account-confirmation/:jwt",
    name: "account-confirmation",
    component: AccountConfirmation,
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/my-profile",
    name: "my-profile",
    // lazy-loaded
    component: MyProfile,
  },
  {
    path: "/friend-requests",
    name: "friend-requests",
    props: true,
    // lazy-loaded
    component: FriendRequestsPage,
  },
  {
    path: "/profile/:username",
    name: "profile",
    // lazy-loaded
    component: UserProfile,
  },
  {
    path: "/search/:searchTerm",
    name: "search",
    props: true,
    // lazy-loaded
    component: SearchPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/welcome'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
  
    // trying to access a restricted page + not logged in
    // redirect to login page
    console.log(to.path);
    if (to.path.startsWith("/account-confirmation/") && !loggedIn){
        next();
    }
    else if (to.path.startsWith("/account-confirmation/") && loggedIn){
        next("/");
    }
    else if (to.path == "/" && !loggedIn){
      next('/welcome')
    }
    else if (authRequired && !loggedIn) {
      next('/login');
    } 
    else {
      next();
    }
});

export default router;