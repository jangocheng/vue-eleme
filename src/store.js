import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


// state
const state = {
    // 高德定位详细信息数据
    location: null,
    // 定位显示的地址
    address: '',
    // 当前浏览的商店
    CBShop: null,
    // 用户信息 id pwd mobile address
    userInfo: null,
    // 当前选择的收货地址
    nowAddrInfo: null,
    // 订单信息 商品-数量
    orderInfo: null,
    // 订单备注信息
    remarkInfo: {
        tableware: '',
        remark: {
            remarkToStr: '',
            radioItem: {},
            switchItem: {}
        }
    }
};

// getter获取state 类似computed计算属性
const getters = {
    location: state => state.location,
    address: state => state.address,
    CBShop: state => state.CBShop,
    userInfo: state => state.userInfo,
    nowAddrInfo: state => state.nowAddrInfo,
    orderInfo: state => state.orderInfo,
    remarkInfo: state => state.remarkInfo
};

// mutations修改state的值 <= this.$store.commit();
const mutations = {
    SET_LOCATION(state, location) {
        if (location) {
            state.location = location;
        } else {
            state.location = null;
        }
    },
    SET_ADDRESS(state, address) {
        if (address) {
            state.address = address;
        } else {
            state.address = '';
        }
    },
    SET_CBSHOP(state, CBShop) {
        if (CBShop) {
            state.CBShop = CBShop;
        } else {
            state.CBShop = null;
        }
    },
    SET_USERINFO(state, userInfo) {
        if (userInfo) {
            state.userInfo = userInfo;
        } else {
            state.userInfo = null;
        }
    },
    SET_NOWADDRINFO(state, nowAddrInfo) {
        if (nowAddrInfo) {
            state.nowAddrInfo = nowAddrInfo;
        } else {
            state.nowAddrInfo = null;
        }
    },
    SET_ORDERINFO(state, orderInfo) {
        if (orderInfo) {
            state.orderInfo = orderInfo;
        } else {
            state.orderInfo = null;
        }
    },
    SET_REMARKINFO(state, remarkInfo) {
        if (remarkInfo) {
            state.remarkInfo = remarkInfo;
        } else {
            state.remarkInfo = {
                tableware: '',
                remark: {
                    remarkToStr: '',
                    radioItem: {},
                    switchItem: {}
                }
            };
        }
    },
    CLEAR_ALL(state, level) {
        switch (level) {
            case 1:
                state.CBShop = null;
                state.nowAddrInfo = null;
                state.orderInfo = null;
                state.remarkInfo = {
                    tableware: '',
                    remark: {
                        remarkToStr: '',
                        radioItem: {},
                        switchItem: {}
                    }
                };
                break;
            case 2:
                state.userInfo = null;
                state.CBShop = null;
                state.nowAddrInfo = null;
                state.orderInfo = null;
                state.remarkInfo = {
                    tableware: '',
                    remark: {
                        remarkToStr: '',
                        radioItem: {},
                        switchItem: {}
                    }
                };
                break;
            default:
                state.location = null;
                state.address = '';
                state.userInfo = null;
                state.CBShop = null;
                state.nowAddrInfo = null;
                state.orderInfo = null;
                state.remarkInfo = {
                    tableware: '',
                    remark: {
                        remarkToStr: '',
                        radioItem: {},
                        switchItem: {}
                    }
                };
                break;
        }
    }
};

// actions异步的 官方不建议mutations直接修改state而是通过actions  <=  this.$store.dispatch()
const actions = {
    setLocation: ({ commit }, location) => {
        commit('SET_LOCATION', location);
    },
    setAddress: ({ commit }, address) => {
        commit('SET_ADDRESS', address);
    },
    setCBShop: ({ commit }, CBShop) => {
        commit('SET_CBSHOP', CBShop);
    },
    setUserInfo: ({ commit }, userInfo) => {
        commit('SET_USERINFO', userInfo);
    },
    setNowAddrInfo: ({ commit }, nowAddrInfo) => {
        commit('SET_NOWADDRINFO', nowAddrInfo);
    },
    setOrderInfo: ({ commit }, orderInfo) => {
        commit('SET_ORDERINFO', orderInfo);
    },
    setRemarkInfo: ({ commit }, remarkInfo) => {
        commit('SET_REMARKINFO', remarkInfo);
    },
    clearAll: ({ commit }, level) => {
        commit('CLEAR_ALL', level);
    }
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
