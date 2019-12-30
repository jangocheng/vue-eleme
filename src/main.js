import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './axios';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import showMsg from './plugin/showMsg'
import api from './api/index'
// import './utils/vconsoleUtil.js'


Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.use(MintUI);
Vue.use(showMsg);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
