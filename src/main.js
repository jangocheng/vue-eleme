import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './axios';
import md5 from 'js-md5';
import { Base64 } from 'js-base64';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';

// import './utils/vconsoleUtil.js'


Vue.config.productionTip = false;
Vue.prototype.$md5 = md5;
Vue.prototype.$Base64 = Base64;
Vue.use(MintUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
