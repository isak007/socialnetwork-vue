import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from './plugins/font-awesome'
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css';

createApp(App)
    .use(router)
    .use(store)
    .use(SimpleTypeahead)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
