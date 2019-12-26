<template>
    <section class="index-container">
        <div
            class="index-shopInfo"
            @click="$router.push({name: 'shop', query: {authentic_id: authentic_id}})"
        >
            <!-- 左侧图片 -->
            <div class="logo_container">
                <img :src="restaurant.image_path" alt />
            </div>
            <!-- 右侧详细信息 -->
            <div class="index_main">
                <!-- 品牌 -->
                <div class="index_shopname">
                    <i v-if="restaurant.is_premium">品牌</i>
                    <span>{{ restaurant.name }}</span>
                </div>
                <!-- 星级 -->
                <div class="index-rateWrap">
                    <div>
                        <Rating :rating="restaurant.rating"></Rating>
                        <span class="rate">{{ restaurant.rating }}</span>
                        <span>月售{{ restaurant.recent_order_num }}</span>
                    </div>
                    <div v-if="restaurant.delivery_mode" class="delivery">
                        <span class="icon-hollow">{{ restaurant.delivery_mode.text }}</span>
                    </div>
                </div>
                <!-- 配送 -->
                <div class="index-moneylimit">
                    <div>
                        <span>
                            ￥{{ restaurant.float_minimum_order_amount }}起送
                            |
                        </span>
                        <span>配送费￥{{ restaurant.float_delivery_fee }}</span>
                    </div>
                    <div class="index-distanceWrap">
                        <span>{{ (restaurant.distance / 1000).toFixed(2) }}km</span>
                        <span>{{ restaurant.order_lead_time }}分钟</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Rating from './Rating';

export default {
    name: 'IndexShop',
    props: {
        restaurant: Object,
        authentic_id: Number
    },
    components: {
        Rating
    }
};
</script>

<style scoped>
.index-container {
    background: #fff;
    color: #666;
    padding: 4vw 0;
    border-bottom: 0.13vw solid #eee;
}
.index-shopInfo {
    display: flex;
    justify-content: flex-start;
    padding: 0 2.77vw;
    align-items: stretch;
}
.logo_container {
    width: 17.3vw;
    height: 17.3vw;
}
.logo_container img {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 0.13vw solid rgba(0, 0, 0, 0.08);
    border-radius: 0.5vw;
}
.index_main {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    flex-direction: column;
    padding-left: 2.7vw;
    font-size: 0.105rem;
    flex-grow: 1;
}
.index_shopname {
    align-items: center;
    color: #333;
    font-weight: 700;
}
.index_shopname i {
    background: #ffe800;
    padding: 1px 1px 0 1px;
    text-align: center;
    white-space: nowrap;
    line-height: 16px;
    font-size: 0.13rem;
}
.index_shopname span {
    line-height: 16px;
    font-size: 0.13rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.index-rateWrap {
    display: flex;
    align-items: center;
    overflow: hidden;
    justify-content: space-between;
}

.index-rateWrap .rate {
    margin-right: 1.1vw;
}
.index-moneylimit {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.index-moneylimit .index-distanceWrap {
    color: #999;
}
.delivery {
    display: flex;
    align-items: center;
    font-size: 0.096rem;
    margin-left: 1.1vw;
}
.delivery .icon-hollow {
    color: #fff;
    background-color: #2395ff;
    padding: 2px;
    box-sizing: border-box;
}
</style>
