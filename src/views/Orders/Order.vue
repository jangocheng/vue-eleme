<template>
    <div class="order">
        <h3 class="other_order">其他订单</h3>
        <h2 class="title">我的订单</h2>
        <div class="order-card-body" v-for="(order,index) in orderlist" :key="index">
            <div
                @click="$router.push({name:'orderInfo',params:order})"
                class="order-card-wrap"
                v-if="order.orderInfo"
            >
                <img :src="order.orderInfo.shopInfo.image_path" alt />
                <div class="order-card-content">
                    <div class="order-card-head">
                        <div class="title">
                            <a>
                                <span>{{order.orderInfo.shopInfo.name}}</span>
                                <i class="fa fa-angle-right"></i>
                            </a>
                            <p v-if="order.isSuccess">订单已完成</p>
                            <p v-else>交易失败</p>
                        </div>
                        <p class="date-time">{{order.date}}</p>
                    </div>
                    <div class="order-card-detail">
                        <p class="detail">{{order.orderInfo.selectFoods[0].name}}</p>
                        <p class="price">¥{{(order.orderInfo.totalPrice / 100).toFixed(2)}}</p>
                    </div>
                </div>
            </div>
            <div class="order-card-bottom">
                <button class="cardbutton" @click="deleteOrder(order)">
                    <span>删除订单</span>
                </button>
                <button
                    class="cardbutton"
                    @click="$router.push({name: 'shop', query: {authentic_id: order.orderInfo.shopInfo.authentic_id}})"
                >
                    <span v-if="order.isSuccess">再来一单</span>
                    <span v-else>重新下单</span>
                </button>
            </div>
        </div>
        <div v-if="!orderlist.length" class="no_order">
            <img src="../../assets/order.png" alt />
            <p>没有查到您的订单</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Order',
    data() {
        return {
            orderlist: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.getData();
        });
    },
    methods: {
        getData() {
            this.$axios(
                `/api/order/search_order/${localStorage.ele_login}`
            ).then(res => {
                // console.log(res.data);
                if (res.data) this.orderlist = res.data.orderlist;
            });
        },
        deleteOrder(order) {
            this.$axios
                .delete(
                    `/api/order/delete_order/${localStorage.ele_login}/${order._id}`
                )
                .then(res => {
                    // console.log(res.data);
                    this.getData();
                });
        }
    }
};
</script>

<style scoped>
.order {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    margin-bottom: 2.67vw;
    background-color: #f8f8f8;
}
.order > .other_order {
    text-align: right;
    margin: 4vw;
}
.order > .title {
    font-size: 0.25rem;
    font-weight: 600;
    margin: 4vw;
}
.order-card-body {
    box-sizing: border-box;
    width: 95vw;
    border-radius: 5px;
    margin-top: 2.67vw;
    margin-left: 2.5vw;
    background-color: #fff;
    padding: 3.73vw 0 0 4vw;
}
.order-card-wrap {
    display: flex;
}
.order-card-wrap > img {
    height: 8.53vw;
    border-radius: 0.53vw;
    border: 1px solid #eee;
    width: 8.53vw;
    margin-right: 2.67vw;
}
.order-card-content {
    flex: 1;
}
.order-card-head {
    border-bottom: 1px solid #eee;
    padding-right: 3.47vw;
    padding-bottom: 2.67vw;
}
.order-card-head .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.order-card-head .title > a {
    font-size: 0.16rem;
    line-height: 1.5em;
    color: #333;
    text-decoration: none;
}
.order-card-head .title > a > span {
    display: inline-block;
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.order-card-head .title > a > i {
    margin-left: 1.33vw;
    color: #ccc;
    vertical-align: super;
}
.order-card-head .title > p {
    font-size: 0.128rem;
    text-align: right;
    color: #333;
    max-width: 14em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.date-time {
    font-size: 0.096rem;
    color: #999;
}
.order-card-detail {
    display: flex;
    justify-content: space-between;
    padding: 4vw 3.47vw 4vw 0;
    font-size: 0.128rem;
}
.order-card-detail .detail {
    color: #666;
    display: flex;
    align-items: center;
}
.order-card-detail .price {
    flex-basis: 16vw;
    text-align: right;
    color: #333;
    font-weight: 700;
}
.order-card-bottom {
    display: flex;
    padding: 2.67vw 4.27vw;
    justify-content: flex-end;
}
.cardbutton {
    padding: 1.33vw 2.67vw;
    border: 1px solid #2395ff;
    border-radius: 0.53vw;
    background-color: transparent;
    outline: none;
    font-size: 0.128rem;
    color: #2395ff;
    margin-left: 2vw;
}
.order .no_order p {
    text-align: center;
    padding-top: 3.666vw;
}
.order .no_order img {
    width: 70vw;
    display: block;
    margin: 5.33vw auto 0 auto;
}
</style>
