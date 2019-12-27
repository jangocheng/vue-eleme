<template>
    <div class="pay">
        <Header :isLeft="true" title="在线支付" />
        <div class="main">
            <div class="tip">
                <p class="countdown-title">支付剩余时间</p>
                <h3 class="countdown-text">{{"00:" + minute + ":" + second}}</h3>
            </div>
            <section class="home">
                <ul class="list info-list">
                    <li>
                        <span class="order-name">{{orderInfo.shopInfo.name}}</span>
                        <span class="text-highlight">￥{{(orderInfo.totalPrice / 100).toFixed(2)}}</span>
                    </li>
                </ul>
                <div class="title">在线支付</div>
                <ul class="list payment-list">
                    <li class="payment-list-item">
                        <div class="icon">
                            <img src="../../assets/wechart.jpg" />
                            <span>微信</span>
                        </div>
                        <i class="fa fa-check-circle selected"></i>
                    </li>
                </ul>
            </section>
            <div @click="pay" :disabled="timeOut" class="btn-submit">确认支付</div>
        </div>
        <!-- 二维码 -->
        <div class="qrcode-body" v-show="codeUrl">
            <div class="content">
                <i class="fa fa-weixin" aria-hidden="true"></i>
                <span>微信扫码付款</span>
                <div class="tip">
                    <p class="countdown-title">支付剩余时间</p>
                    <h3 class="countdown-text">{{"00:" + minute + ":" + second}}</h3>
                </div>
                <img class="qrcode" :src="codeUrl" />
                <div class="cancel" @click="cancelPay">取消支付</div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
// import QRCode from 'qrcodejs2'

export default {
    name: 'Pay',
    data() {
        return {
            minute: '14',
            second: '59',
            timer: null,
            time_order: null,
            timeOut: false,
            codeUrl: '',
            userInfo: null,
            isSuccess: false,
            nodeOrderId: '',
            openid: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.countTimeDown();
        });
    },
    created() {
        const user_id = localStorage.ele_login;
        this.$axios(`/api/user/user_info/${user_id}`).then(res => {
            this.$store.dispatch('setUserInfo', res.data);
            this.userInfo = res.data;
        });
    },
    destroyed() {
        clearInterval(this.timer_order);
        clearInterval(this.timer);
    },
    methods: {
        countTimeDown() {
            this.timer = setInterval(() => {
                this.second--;

                if (this.second == '00' && this.minute == '00') {
                    // 支付超时 添加失败的订单 返回order界面
                    this.timeOut = true;
                    this.addOrder();
                    this.codeUrl = '';
                    return;
                }

                if (this.second == '00') {
                    this.second = 59;
                    this.minute--;
                    if (this.minute < 10) {
                        this.minute = '0' + this.minute;
                    }
                }

                if (this.second < 10) {
                    this.second = '0' + this.second;
                }
            }, 1000);
        },
        pay() {
            const price = parseInt(this.orderInfo.totalPrice);
            const time = new Date().getTime();
            const mobile = this.$store.getters.userInfo.mobile;
            // total_fee 支付金额(分)
            // out_trade_no 前端端订单编号
            if (this.isWeiXin()) {
                this.openid = localStorage.getItem('openid');
                this.$axios
                    .post('/api/order/wx_api_pay', {
                        out_trade_no: mobile + time,
                        total_fee: price,
                        openid: this.openid
                    })
                    .then(res => {
                        // console.log(res.data);
                        this.nodeOrderId = res.data.payjs_order_id;
                        this.minute = 1;
                        this.second = 59;
                        this.timer_order = setInterval(() => {
                            this.checkPayStatus(res.data.payjs_order_id);
                        }, 2000);
                        this.onBridgeReady(res.data.jsapi);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                this.$axios
                    .post('/api/order/wx_qecode_pay', {
                        out_trade_no: mobile + time,
                        total_fee: price
                    })
                    .then(res => {
                        // console.log(res);
                        this.nodeOrderId = res.data.payjs_order_id;
                        this.minute = 1;
                        this.second = 59;
                        this.codeUrl = res.data.qrcode;
                        this.timer_order = setInterval(() => {
                            this.checkPayStatus(res.data.payjs_order_id);
                        }, 2000);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        cancelPay() {
            this.$axios(`/api/order/close_order/${this.nodeOrderId}`).then(
                res => {
                    // console.log(res.data);
                    if (res.data.return_code == 1) {
                        this.addOrder();
                    }
                }
            );
        },
        checkPayStatus(orderID) {
            this.$axios
                .post(`/api/order/pay_status/${orderID}`)
                .then(res => {
                    // console.log(res.data);
                    if (res.data.code == 1) {
                        // 成功
                        this.codeUrl = '';
                        this.isSuccess = true;
                        this.addOrder();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            // console.log(2);
        },
        addOrder() {
            const orderlist = {
                orderInfo: this.orderInfo,
                userInfo: this.$store.getters.userInfo,
                remarkInfo: this.remarkInfo,
                nowAddrInfo: this.nowAddrInfo,
                isSuccess: this.isSuccess
            };
            this.$axios
                .post(
                    `/api/order/add_order/${localStorage.ele_login}`,
                    orderlist
                )
                .then(res => {
                    // console.log(res.data);
                    // 清理vuex
                    sessionStorage.removeItem('store');
                    this.$store.dispatch('clearAll', 1);
                    this.$router.push('/order');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        },
        onBridgeReady(data) {
            WeixinJSBridge.invoke('getBrandWCPayRequest', data, res => {
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    this.addOrder();
                }
            });
        }
    },
    computed: {
        orderInfo() {
            return this.$store.getters.orderInfo;
        },
        nowAddrInfo() {
            return this.$store.getters.nowAddrInfo;
        },
        remarkInfo() {
            return this.$store.getters.remarkInfo;
        }
    },
    components: {
        Header
    }
};
</script>

<style scoped>
.pay {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 45px;
}

.main {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
}
.tip {
    display: block;
    text-align: center;
    background-color: #fff;
    color: #333;
    padding: 0.32rem;
    line-height: 0.32rem;
}
countdown-title {
    font-size: 0.141rem;
    color: #999;
}
.countdown-text {
    height: 0.32rem;
    color: #333;
    font-size: 0.288rem;
}
down-text {
    height: 0.32rem;
    color: #333;
    font-size: 0.288rem;
}
.list {
    border-bottom: 0.5px solid #eee;
    background: #fff;
}
.info-list {
    padding: 0 0.24rem;
}
.info-list li {
    border-top: 0.5px solid #eee;
    display: flex;
    padding: 0.24rem 0;
    font-size: 0.16rem;
    line-height: 0.16rem;
    justify-content: space-between;
}
.info-list li .order-name {
    color: #333;
    display: inline-block;
    vertical-align: bottom;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 16px;
    max-width: 60%;
}
.text-highlight {
    color: #ff6000;
}
.title {
    background-color: #f5f5f5;
    font-size: 0.141rem;
    padding: 0.192rem 0.192rem 0.16rem;
    color: #999;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.payment-list-item {
    border-bottom: 0.5px solid #eee;
    padding: 0.144rem 0.16rem;
    font-size: 0.176rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.icon {
    display: flex;
    align-items: center;
}
.payment-list-item img {
    width: 0.32rem;
    height: 0.32rem;
    margin-right: 20px;
}
.payment-list-item > i {
    font-size: 0.24rem;
    color: #eee;
}
.selected {
    color: #4cd964 !important;
}
.btn-submit-wrap {
    margin: 0.16rem auto;
    width: 90%;
}
.btn-submit {
    font-size: 0.176rem;
    line-height: 0.24rem;
    background-color: #4cd964;
    width: 100%;
    outline: none;
    border: none;
    color: #fff;
    border-radius: 5px;
    padding: 0.08rem;
    box-sizing: border-box;
    text-align: center;
    margin-top: 20px;
}

/* 不可点击btn */
.btn-submit[disabled] {
    background-color: #bbb !important;
}
/* 二维码 */
.qrcode-body {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #009eef;
    z-index: 100;
}
.qrcode-body .content {
    width: 90vw;
    background-color: #fff;
    margin: 10vw auto auto 5vw;
    padding-bottom: 1vw;
    /* border: 1px solid red; */
    position: relative;
    font-size: 0.18rem;
    color: #009eef;
}
.qrcode-body .content i {
    padding: 4vw;
}
.qrcode {
    width: 40vw;
    height: 40vw;
    margin-left: 25vw;
    display: block;
}
.qrcode-body .content .cancel {
    width: 30vw;
    height: 12vw;
    background-color: #009eef;
    border-radius: 8px;
    margin: 10vw auto;
    color: #fff;
    line-height: 12vw;
    text-align: center;
    font-weight: 600;
}
</style>
