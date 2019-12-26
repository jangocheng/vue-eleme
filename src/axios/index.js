import Vue from 'vue';
import axios from 'axios';
import { Indicator } from 'mint-ui';

// 请求拦截
axios.interceptors.request.use(config => {
    // 不拦截查询订单状态的请求
    if (/api\/order\/pay_status\/[0-9]+/.exec(config.url)) {
        return config;
    }
    Indicator.open();
    return config;
}, err => {
    return Promise.reject(err);
});
// 响应拦截
axios.interceptors.response.use(response => {
    Indicator.close();
    return response;
}, err => {
    Indicator.close();
    return Promise.reject(err);
});

Vue.prototype.$axios = axios;
window.$axios = axios;
