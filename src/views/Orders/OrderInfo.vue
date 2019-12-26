<template>
    <div class="orderInfo">
        <Header title="订单详情" :isLeft="true" :isBlue="true" />
        <div class="view-body" v-if="orderDetail">
            <div class="status-text" :class="{fixTop:fixTop}">
                订单已送达
                <i class="fa fa-chevron-right"></i>
            </div>
            <div class="status-head">
                <div class="status-title">感谢下单打赏，WeChat：13131451002</div>
                <div class="toAuth">打赏作者</div>
            </div>
            <div class="restaurant-card">
                <!-- 点餐信息 -->
                <BuyList
                    v-if="orderDetail.orderInfo"
                    :orderInfo="orderDetail.orderInfo"
                    :price="orderDetail.totalPrice"
                />
            </div>

            <!-- 配送信息 -->
            <div class="detail-card">
                <div class="title">配送信息</div>
                <ul class="card-list">
                    <li class="list-item">
                        <span>送达时间:</span>
                        <div>{{orderDetail.date}}</div>
                    </li>
                    <li class="list-item">
                        <span>收货地址:</span>
                        <div class="content">
                            <span>{{orderDetail.nowAddrInfo.name}}({{orderDetail.nowAddrInfo.sex}})&nbsp;&nbsp;{{orderDetail.nowAddrInfo.phone}}</span>
                            <span>{{orderDetail.nowAddrInfo.address}}</span>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- 订单信息 -->
            <div class="detail-card">
                <div class="title">订单信息</div>
                <ul class="card-list">
                    <li class="list-item">
                        <span>订单号:</span>
                        {{orderDetail._id}}
                    </li>
                    <li class="list-item">
                        <span>支付方式:</span>
                        在线支付
                    </li>
                    <li class="list-item">
                        <span>下单时间:</span>
                        {{orderDetail.date}}
                    </li>
                    <li class="list-item" v-if="orderDetail.remarkInfo">
                        <span>订单备注:</span>
                        <span class="remark">
                            {{orderDetail.remarkInfo.remark.remarkToStr}} \
                            {{orderDetail.remarkInfo.tableware}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
import BuyList from '../../components/Orders/BuyList';
export default {
    data() {
        return {
            orderDetail: null,
            fixTop: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.orderDetail = to.params;
            // console.log(_.orderDetail);
        });
    },
    components: {
        Header,
        BuyList
    }
};
</script>

<style scoped>
.orderInfo {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 45px;
    background-color: #f8f8f8;
}

.view-body {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background-image: linear-gradient(
        to bottom,
        #009eef 0%,
        #f5f5f5 30%,
        #f8f8f8 100%
    );
}
.status-head {
    margin: 2.666667vw;
    box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
    padding: 2vw 3.2vw 5.333333vw;
}
.status-text {
    color: #fff;
    font-size: 0.3rem;
    font-weight: 800;
    text-align: left;
    padding: 4.266667vw 3.6vw;
}
.status-text i {
    font-size: 0.2rem;
}
.status-head .status-title {
    font-size: 0.18rem;
    font-weight: 600;
    color: #333;
    padding: 1.8vw 0;
}
.status-head .toAuth {
    color: #6e6e6e;
    font-size: 0.155rem;
    padding: 1.3333vw;
    margin-top: 2vw;
    display: inline-block;
    border: 1px solid #6e6e6e;
    border-radius: 3px;
}
.restaurant-card {
    margin: 2.666667vw;
    box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
    padding: 0 3.2vw 5.333333vw;
}

/* 配送和订单 */
.detail-card {
    margin: 2.666667vw;
    box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
    padding: 0 3.2vw 5.333333vw;
}

.status-head .status-text {
    margin: 0 auto 4.266667vw;
    color: #333;
    font-size: 0.24rem;
    text-align: left;
    padding: 4.266667vw 0;
    border-bottom: 0.133333vw solid #ddd;
}
.status-head .status-title {
    font-size: 0.16rem;
    color: #333;
    margin-bottom: 1.866667vw;
}
.title {
    font-size: 0.17rem;
    color: #333;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    line-height: 10.4vw;
}
.list-item {
    color: #6e6e6e;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    text-align: right;
    line-height: 4.8vw;
    font-size: 0.1408rem;
    padding: 3.2vw 8vw 2.666667vw 0;
}
.list-item .content {
    line-height: 1.5em;
    padding-bottom: 2.666667vw;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.list-item span:first-child {
    flex: none;
}
.remark {
    text-overflow: ellipsis;
    overflow: hidden;
    flex-grow: 1;
    white-space: nowrap;
}
</style>

