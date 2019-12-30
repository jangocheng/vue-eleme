import { Toast } from 'mint-ui';
export default {
    install(Vue, options) {
        Vue.prototype.$showMsg = (msg, position = 'bottom', duration = 2000, iconClass = '') => {
            Toast({
                message: msg,
                position: position,
                duration: duration,
                iconClass: iconClass
            });
        }
    }
}