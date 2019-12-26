<template>
    <div class="shopcart">
        <!-- 列表 -->
        <transition name="fade">
            <div
                class="cartview-cartmask"
                @click.self="showCartView = false"
                v-if="showCartView && !isEmpty"
            >
                <div class="cartview-cartbody">
                    <div class="cartview-cartheader">
                        <span>已选商品</span>
                        <button @click="clearFoods">
                            <i class="fa fa-trash-o"></i>
                            <span>清空</span>
                        </button>
                    </div>
                    <div class="entityList-cartbodyScroller">
                        <ul class="entityList-cartlist">
                            <li
                                class="entityList-entityrow"
                                v-for="(food, index) in selectFoods"
                                :key="index"
                            >
                                <h4>
                                    <span>{{ food.name }}</span>
                                </h4>
                                <span class="entityList-entitytotal">
                                    {{ food.lowest_price || food.activity.fixed_price }}
                                </span>
                                <CartControll :food="food" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 底部 -->
        <div class="bottomNav-cartfooter">
            <span
                class="bottomNav-carticon"
                @click="showCartView = !showCartView"
                :class="{ 'bottomNav-carticon-empty': isEmpty }"
            >
                <i class="fa fa-cart-plus"></i>
                <span v-if="totalCount">{{ totalCount }}</span>
            </span>
            <div
                class="bottomNav-cartInfo"
                @click="showCartView = !showCartView"
                :class="{ 'bottomNav-carticon-empty': isEmpty }"
            >
                <p class="bottomNav-carttotal">
                    <span v-if="isEmpty">未选购商品</span>
                    <span v-else>¥{{ totalPrice.toFixed(2) }}</span>
                </p>
                <p class="bottomNav-cartdelivery">另需配送费{{ shopInfo.rst.float_delivery_fee }}元</p>
            </div>
            <button
                class="submit-btn"
                :class="{
                    'bottomNav-carticon-empty':
                        isEmpty ||
                        totalPrice < shopInfo.rst.float_minimum_order_amount
                }"
            >
                <span
                    v-if="
                        isEmpty ||
                            totalPrice < shopInfo.rst.float_minimum_order_amount
                    "
                >¥{{ shopInfo.rst.float_minimum_order_amount }}元起送</span>
                <span @click="settlement" v-else>去结算</span>
            </button>
        </div>
    </div>
</template>

<script>
import CartControll from '../../components/Shops/CartControll';
export default {
    name: 'ShopCart',
    data() {
        return {
            totalCount: 0,
            totalPrice: 0,
            selectFoods: [],
            showCartView: false
        };
    },
    props: {
        shopInfo: Object
    },
    computed: {
        isEmpty() {
            return this.calculate();
        }
    },
    methods: {
        clearFoods() {
            this.shopInfo.recommend.forEach(recommend => {
                recommend.items.forEach(item => {
                    item.count = 0;
                });
            });

            this.shopInfo.menu.forEach(menu => {
                menu.foods.forEach(item => {
                    item.count = 0;
                });
            });
        },
        settlement() {
            const table = {
                totalPrice: this.totalPrice + this.shopInfo.rst.float_delivery_fee,
                selectFoods: this.selectFoods,
                shopInfo: this.shopInfo.rst
            };
            this.$store.dispatch('setOrderInfo', table);
            this.$store.dispatch('setCBShop', this.shopInfo);
            this.$router.push('/settlement');
        },
        calculate() {
            let empty = true;
            this.totalCount = 0;
            this.totalPrice = 0;
            this.selectFoods = [];
            this.shopInfo.recommend.forEach(recommend => {
                recommend.items.forEach(item => {
                    if (item.count) {
                        empty = false;
                        this.totalCount += item.count;
                        if (item.lowest_price) {
                            this.totalPrice +=
                                item.lowest_price * item.count;
                        } else {
                            this.totalPrice +=
                                item.activity.fixed_price * item.count;
                        }
                        this.selectFoods.push(item);
                    }
                });
            });

            this.shopInfo.menu.forEach(menu => {
                menu.foods.forEach(food => {
                    if (food.count) {
                        empty = false;
                        this.totalCount += food.count;
                        if (food.lowest_price) {
                            this.totalPrice +=
                                food.lowest_price * food.count;
                        } else {
                            this.totalPrice +=
                                food.activity.fixed_price * food.count;
                        }
                        this.selectFoods.push(food);
                    }
                });
            });
            return empty;
        }
    },
    components: {
        CartControll
    }
};
</script>

<style scoped>
.bottomNav-cartfooter {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 21.067vw;
    background-color: rgba(61, 61, 63, 0.9);
    height: 12.8vw;
    z-index: 1000;
}

.bottomNav-carticon {
    position: absolute;
    left: 3.2vw;
    bottom: 2vw;
    width: 13.33vw;
    height: 13.33vw;
    box-sizing: border-box;
    border-radius: 100%;
    background-color: #3190e8;
    border: 1.33vw solid #444;
    box-shadow: 0 -0.8vw 0.53vw 0 rgba(0, 0, 0, 0.1);
}
.bottomNav-carticon > i {
    position: absolute;
    top: 0.07rem;
    right: 0;
    bottom: 0;
    left: 0.07rem;
    color: #fff;
    font-size: 0.256rem;
}
.bottomNav-cartInfo {
    flex: 1;
}
.bottomNav-carttotal {
    font-size: 0.128rem;
    line-height: normal;
    color: #fff;
}
.bottomNav-cartdelivery {
    color: #999;
    font-size: 0.096rem;
}
.submit-btn {
    height: 100%;
    width: 28vw;
    background-color: #38ca73;
    color: #fff;
    text-align: center;
    text-decoration: none;
    font-size: 0.144rem;
    font-weight: 600;
    line-height: 12.8vw;
    border: none;
    outline: none;
}

span.bottomNav-carticon-empty {
    background-image: radial-gradient(circle, #363636 6.267vw, #444 0);
}
.bottomNav-carticon-empty > i {
    color: #606065 !important;
}
.bottomNav-carticon-empty .bottomNav-carttotal > span {
    color: #999;
}
.bottomNav-carticon-empty.submit-btn {
    background-color: #535356 !important;
}

.bottomNav-carticon > span {
    position: absolute;
    right: -1.2vw;
    top: -1.33vw;
    line-height: 1;
    background-image: linear-gradient(-90deg, #ff7416, #ff3c15 98%);
    color: #fff;
    border-radius: 3.2vw;
    padding: 0.83vw 1.33vw;
    font-size: 0.096rem;
}

.cartview-cartmask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 200;
}
.cartview-cartbody {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: #fff;
    bottom: 12.8vw;
    z-index: 201;
    opacity: 1;
    font-size: 0.16rem;
}
.cartview-cartheader {
    display: flex;
    align-items: center;
    padding: 0 4vw;
    border-bottom: 0.13vw solid #ddd;
    background-color: #eceff1;
    color: #666;
    height: 10.67vw;
}
.cartview-cartheader > span {
    flex: 1;
    display: flex;
    align-items: center;
}
.cartview-cartheader > button {
    border: none;
    outline: none;
    flex: none;
    display: flex;
    align-items: center;
    padding-left: 4vw;
    color: #666;
    text-decoration: none;
    font-size: 0.128rem;
    line-height: 4vw;
    background: none;
}
.cartview-cartheader > button > span {
    margin-left: 0.128vw;
}
.entityList-cartbodyScroller {
    overflow: auto;
    max-height: 80vw;
}
.entityList-entityrow {
    border-bottom: 0.13vw solid #eee;
    display: flex;
    align-items: center;
    padding: 2vw 3.33vw 2vw 0;
    min-height: 12.667vw;
    margin-left: 3.33vw;
}
.entityList-entityrow > h4 {
    flex: 5.5;
    line-height: normal;
}
.entityList-entityrow > h4 > span {
    display: inline-block;
    font-style: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    max-width: 46.667vw;
}
.entityList-entitytotal {
    color: rgb(255, 83, 57);
    flex: 2.5;
    text-align: left;
    white-space: nowrap;
    font-weight: 700;
}
.entityList-entitytotal::before {
    content: "\A5";
    font-size: 0.096rem;
    color: currentColor;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
