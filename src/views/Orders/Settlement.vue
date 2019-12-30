<template>
    <div class="settlement">
        <Header :isLeft="true" title="确认订单" back="goods" :isBlue="true" />
        <div class="view-body" v-if="orderInfo">
            <!-- 收货地址 -->
            <section class="cart-address">
                <p class="title">
                    订单配送至
                    <span
                        class="address-tag"
                        v-if="nowAddrInfo && nowAddrInfo.tag"
                    >{{nowAddrInfo.tag}}</span>
                </p>
                <p class="address-detail">
                    <span
                        @click="$router.push('/myAddress')"
                        v-if="nowAddrInfo"
                    >{{nowAddrInfo.address}}{{nowAddrInfo.bottom}}</span>
                    <span v-else>
                        <span v-if="haveAddress" @click="$router.push('/myAddress')">选择收货地址</span>
                        <span v-else @click="addAddress">新增收货地址</span>
                    </span>
                    <i class="fa fa-angle-right"></i>
                </p>
                <h2 v-if="nowAddrInfo" class="address-name">
                    <span>{{nowAddrInfo.name}}</span>
                    <span v-if="nowAddrInfo.sex">({{nowAddrInfo.sex}})</span>
                    <span class="phone">{{nowAddrInfo.phone}}</span>
                </h2>
            </section>

            <!-- 送达时间 -->
            <Delivery :shopInfo="orderInfo.shopInfo"></Delivery>

            <!-- 点餐清单 -->
            <BuyList :orderInfo="orderInfo" />

            <!-- 备注信息 -->
            <section class="checkout-section">
                <RemarkItem
                    title="餐具份数"
                    :subHead=" remarkInfo.tableware || '未选择'"
                    @click="showTableware = true"
                />
                <RemarkItem
                    title="订单备注"
                    :subHead="remarkInfo.remark.remarkToStr || '口味 偏好'"
                    @click="$router.push('/remark')"
                />
                <RemarkItem title="发票信息" subHead="不需要开发票" />
            </section>
            <!-- 餐具选择Tableware -->
            <Tableware :isShow="showTableware" @close="showTableware = false" />
        </div>
        <!-- 去支付 -->
        <footer class="action-bar">
            <span>￥{{orderInfo.totalPrice}}</span>
            <span>￥{{(orderInfo.totalPrice / 100).toFixed(2)}}</span>
            <button @click="handlePay">去支付</button>
        </footer>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
import Delivery from '../../components/Orders/Delivery';
import BuyList from '../../components/Orders/BuyList';
import RemarkItem from '../../components/Orders/RemarkItem';
import Tableware from '../../components/Orders/Tableware';

export default {
    name: 'Settlement',
    data() {
        return {
            haveAddress: false,
            showTableware: false
        };
    },
    computed: {
        nowAddrInfo() {
            return this.$store.getters.nowAddrInfo;
        },
        orderInfo() {
            return this.$store.getters.orderInfo;
        },
        remarkInfo() {
            return this.$store.getters.remarkInfo;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            if (!_.nowAddrInfo) {
                _.getData();
            }
        });
    },
    methods: {
        addAddress() {
            this.$router.push({
                name: 'addAddress',
                params: {
                    title: '添加地址',
                    addressInfo: {
                        name: '',
                        sex: '',
                        phone: '',
                        address: '',
                        bottom: '',
                        tag: ''
                    }
                }
            });
        },
        getData() {
            this.$api.getUserInfo(localStorage.ele_login)
                .then(res => {
                        // console.log(res.data);
                        if (res.data.myAddress.length > 0) {
                            this.haveAddress = true;
                        } else {
                            this.haveAddress = false;
                        }
                    }
                );
        },
        handlePay() {
            if (!this.nowAddrInfo) {
                this.$showMsg('请选择收货地址', 'bottom', 1000);
                return;
            }
            this.$router.push('/pay');
        }
    },
    components: {
        Header,
        Delivery,
        BuyList,
        RemarkItem,
        Tableware
    }
};
</script>

<style scoped>
.settlement {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 44px;
}

.view-body {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    font-size: 0.144rem;
    color: #333;
    padding-bottom: 14.133333vw;
    padding-left: 1.6vw;
    padding-right: 1.6vw;
    background-image: linear-gradient(
            0deg,
            #f5f5f5,
            #f5f5f5 65%,
            hsla(0, 0%, 96%, 0.3) 75%,
            hsla(0, 0%, 96%, 0)
        ),
        linear-gradient(270deg, #009eef, #009eef);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.cart-address {
    background-color: transparent;
    padding: 4.266667vw 2.133333vw 2.933333vw 2.133333vw;
    min-height: 22.133333vw;
    color: #fff;
    overflow: hidden;
}
.cart-address .title {
    font-size: 0.144rem;
    line-height: 1.21;
    color: hsla(0, 0%, 100%, 0.8);
}
.cart-address .address-detail {
    font-size: 0.208rem;
    font-weight: 600;
    line-height: 1.88;
    overflow: hidden;
    display: flex;
    align-items: center;
}
.address-detail > span {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 4vw);
}
.address-detail > i {
    margin-left: 2.133333vw;
}

/* 显示送货地址 */
.address-name {
    font-size: 0.138rem;
    line-height: 1.21;
    margin-bottom: 1.333333vw;
}
.address-name .phone {
    margin-left: 2.133333vw;
}
.address-tag {
    border: 0.133334vw solid hsla(0, 0%, 100%, 0.8);
    margin-left: 1.6vw;
    display: inline-block;
    padding: 0.533333vw;
    white-space: nowrap;
    border-radius: 0.133333vw;
    font-size: 0.096rem !important;
    line-height: 2.666667vw;
}

.checkout-section {
    margin-bottom: 2.133333vw;
    padding: 0 5.333333vw;
    background: #fff;
    box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
}

/* 底部支付样式 */
.action-bar {
    height: 11.733333vw;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #3c3c3c;
    z-index: 2;
}
.action-bar > span:first-child {
    color: #fff;
    font-size: 0.192rem;
    line-height: 11.733333vw;
    padding-left: 2.666667vw;
    vertical-align: middle;
    text-decoration: line-through;
}
.action-bar > span:last-of-type {
    color: #f00;
    font-size: 0.13rem;
    line-height: 11.733333vw;
    padding-left: 3vw;
    vertical-align: middle;
}
.action-bar > button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: #00e067;
    min-width: 28vw;
    padding: 0 1.333333vw;
    border: none;
    color: #fff;
    font-size: 0.192rem;
}
</style>
