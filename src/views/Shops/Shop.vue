<template>
    <section>
        <div class="shop" v-if="shopInfo">
            <!-- 头部 -->
            <nav class="header-nav">
                <div class="nav_bg">
                    <img :src="shopInfo.rst.scheme" alt />
                </div>
                <div class="nav_back">
                    <i @click="$router.push('/home')" class="fa fa-chevron-left"></i>
                </div>
                <div class="shop_image">
                    <img :src="shopInfo.rst.image_path" alt />
                </div>
            </nav>

            <!-- 商家信息 -->
            <div class="index-rst">
                <div class="rst-name">
                    <span @click="showInfoModel = true">
                        {{
                        shopInfo.rst.name
                        }}
                    </span>
                    <i class="fa fa-caret-right"></i>
                </div>
                <!-- 弹窗信息 -->
                <InfoModel
                    @close="showInfoModel = false"
                    :rst="shopInfo.rst"
                    :showInfoModel="showInfoModel"
                />

                <!-- 评分月售 -->
                <div class="rst-order">
                    <span>评分{{ shopInfo.rst.rating }}</span>
                    <span>月售{{ shopInfo.rst.recent_order_num }}单</span>
                    <span>蜂鸟专送约{{ shopInfo.rst.order_lead_time }}分钟</span>
                </div>
                <!-- 优惠信息 -->
                <Activity :activities="shopInfo.rst.activities" />

                <!-- 公告 -->
                <p class="rst-promotion">公告: {{ shopInfo.rst.promotion_info }}</p>
            </div>

            <!-- 导航 -->
            <NavBar />
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <!-- 加载完成前显示预览图 -->
        <div v-else class="shell-skeleton">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNzUgNjAzIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yKSI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIgNjloMzc1djUzNEgyeiIvPjxwYXRoIGZpbGw9IiNFRUUiIGQ9Ik0yIDBoMzc1djY5SDJ6Ii8+PHJlY3Qgd2lkdGg9IjY2IiBoZWlnaHQ9IjY2IiB4PSIxNTciIHk9IjIzIiBmaWxsPSIjRjZGNkY2IiByeD0iMiIvPjxwYXRoIGZpbGw9IiNFRUUiIGQ9Ik02NSA5OWgyNTB2MjRINjV6bTAgMzFoMjUwdjEzSDY1eiIvPjxwYXRoIGZpbGw9IiNGNkY2RjYiIGQ9Ik02NSAxNTBoMjUwdjEzSDY1ek0yIDMwMGg3N3YzMDNIMnoiLz48cGF0aCBzdHJva2U9IiNGNkY2RjYiIGQ9Ik0yNi41IDE3Mi41aDMyNnYyOGgtMzI2eiIvPjxwYXRoIGZpbGw9IiNFRUUiIGQ9Ik01MCAxODBoMjgwdjEzSDUweiIvPjxwYXRoIHN0cm9rZT0iI0Y2RjZGNiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgZD0iTS41IDI0OC41aDM3OS4wMDUiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4OCAyNzgpIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMjY3IDgydi0zLjk5OGEuOTk5Ljk5OSAwIDEgMC0yIDBWODJoLTMuOTk4YS45OTkuOTk5IDAgMSAwIDAgMkgyNjV2My45OThhLjk5OS45OTkgMCAxIDAgMiAwVjg0aDMuOTk4YS45OTkuOTk5IDAgMSAwIDAtMkgyNjd6bS0xIDEyYy02LjA3NSAwLTExLTQuOTI1LTExLTExczQuOTI1LTExIDExLTExIDExIDQuOTI1IDExIDExLTQuOTI1IDExLTExIDExeiIvPjxyZWN0IHdpZHRoPSI3NCIgaGVpZ2h0PSI3NCIgeD0iMSIgeT0iMTMiIGZpbGw9IiNGNkY2RjYiIHJ4PSIyIi8+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTg3IDEzaDE0MHYxNkg4N3ptMCAyNWgxMjZ2MTFIODd6bTAgMzFoMzN2MThIODd6Ii8+PHBhdGggc3Ryb2tlPSIjRjZGNkY2IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBkPSJNLjQ3MyAxLjVoMjkzLjAzMiIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4OCAzOTMpIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMjY3IDgydi0zLjk5OGEuOTk5Ljk5OSAwIDEgMC0yIDBWODJoLTMuOTk4YS45OTkuOTk5IDAgMSAwIDAgMkgyNjV2My45OThhLjk5OS45OTkgMCAxIDAgMiAwVjg0aDMuOTk4YS45OTkuOTk5IDAgMSAwIDAtMkgyNjd6bS0xIDEyYy02LjA3NSAwLTExLTQuOTI1LTExLTExczQuOTI1LTExIDExLTExIDExIDQuOTI1IDExIDExLTQuOTI1IDExLTExIDExeiIvPjxyZWN0IHdpZHRoPSI3NCIgaGVpZ2h0PSI3NCIgeD0iMSIgeT0iMTMiIGZpbGw9IiNGNkY2RjYiIHJ4PSIyIi8+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTg3IDEzaDE0MHYxNkg4N3ptMCAyNWgxMjZ2MTFIODd6bTAgMzFoMzN2MThIODd6Ii8+PHBhdGggc3Ryb2tlPSIjRjZGNkY2IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBkPSJNLjQ3MyAxLjVoMjkzLjAzMiIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4OCA1MDkpIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMjY3IDgydi0zLjk5OGEuOTk5Ljk5OSAwIDEgMC0yIDBWODJoLTMuOTk4YS45OTkuOTk5IDAgMSAwIDAgMkgyNjV2My45OThhLjk5OS45OTkgMCAxIDAgMiAwVjg0aDMuOTk4YS45OTkuOTk5IDAgMSAwIDAtMkgyNjd6bS0xIDEyYy02LjA3NSAwLTExLTQuOTI1LTExLTExczQuOTI1LTExIDExLTExIDExIDQuOTI1IDExIDExLTQuOTI1IDExLTExIDExeiIvPjxyZWN0IHdpZHRoPSI3NCIgaGVpZ2h0PSI3NCIgeD0iMSIgeT0iMTMiIGZpbGw9IiNGNkY2RjYiIHJ4PSIyIi8+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTg3IDEzaDE0MHYxNkg4N3ptMCAyNWgxMjZ2MTFIODd6bTAgMzFoMzN2MThIODd6Ii8+PHBhdGggc3Ryb2tlPSIjRjZGNkY2IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBkPSJNLjQ3MyAxLjVoMjkzLjAzMiIvPjwvZz48cGF0aCBmaWxsPSIjRUVFIiBkPSJNNTAgMjIyaDI5djE2SDUwem0zOSAzNWgyOXYxNkg4OXpNOSAyNjdoNTB2MTVIOXptMCA1NGg1MHYxNUg5em0wIDQ5aDUwdjE1SDl6bTAgMTAxaDUwdjE1SDl6bTAtNDloNTB2MTVIOXptMCAxMDFoNTB2MTVIOXptMCA1MGg1MHYxNUg5em0xNjYtMzUxaDI5djE2aC0yOXptMTI2IDBoMjl2MTZoLTI5eiIvPjxwYXRoIGZpbGw9IiNGNUY1RjUiIGQ9Ik0yIDU1NmgzNzV2NDdIMnoiLz48L2c+PC9zdmc+" alt="">
        </div>
    </section>
</template>

<script>
import InfoModel from '../../components/Shops/InfoModel';
import Activity from '../../components/Shops/Activity';
import NavBar from '../../components/Shops/NavBar';
// import EventBus from '../../EventBus.js'

export default {
    name: 'Shop',
    data() {
        return {
            shopInfo: null,
            showInfoModel: false,
            authentic_id: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.authentic_id = to.query.authentic_id;
            _.getData();
        });
    },
    methods: {
        getData() {
            if (
                this.$store.getters.CBShop &&
                (!this.authentic_id ||
                    this.authentic_id ==
                        this.$store.getters.CBShop.rst.authentic_id)
            ) {
                this.shopInfo = this.$store.getters.CBShop;
                this.$router.push('/goods');
                return;
            }
            this.$axios(
                `/api/profile/batch_shop/${this.authentic_id ||
                    this.$store.getters.CBShop.rst.authentic_id}`
            )
                .then(res => {
                    // console.log(res.data);
                    res.data.recommend.forEach(recommend => {
                        recommend.items.forEach(item => {
                            item.count = 0;
                        });
                    });

                    res.data.menu.forEach(menu => {
                        menu.foods.forEach(food => {
                            food.count = 0;
                        });
                    });
                    this.shopInfo = res.data;
                    this.$store.dispatch('setCBShop', res.data);
                    this.$router.push('/goods');
                })
                .catch(err => {
                    console.log(err);
                    this.$router.push('/home');
                });
        }
    },
    components: {
        InfoModel,
        Activity,
        NavBar
    }
};
</script>

<style scoped>
.shop {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
}
.header-nav {
    position: relative;
}
.nav_bg img {
    width: 100%;
    height: 26.67vw;
}
.nav_back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 26.67vw;
    background: rgba(0, 0, 0, 0.5);
}
.nav_back i {
    color: #fff;
    font-size: 0.208rem;
    margin-left: 1.33vw;
    margin-top: 1.33vw;
}
.shop_image {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -10vw;
    margin-top: 11vw;
}
.shop_image img {
    width: 20vw;
    height: 20vw;
    border-radius: 0.8vw;
}

.index-rst {
    padding: 8vw 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    box-shadow: inset 0 -0.667vw 0.667vw hsla;
}
.index-rst .rst-name {
    flex: 1;
    width: 72vw;
    font-size: 0.208rem;
    line-height: 0.26rem;
    font-weight: 700;
    white-space: nowrap;
    padding-right: 2.667vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.6vw 0;
}
.rst-name span {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
}

.index-rst .rst-order {
    white-space: nowrap;
    height: 3.2vw;
    margin-top: 1.733vw;
    color: #666;
    text-align: center;
    font-size: 0.096rem;
}
.rst-order span {
    margin: 0 0.03rem;
}
.index-rst .rst-promotion {
    width: 80vw;
    font-size: 0.096rem;
    line-height: 0.116rem;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 2.267vw auto 2.67vw;
    padding: 0;
    white-space: nowrap;
}
/* 预览 */
.shell-skeleton img {
    width: 100vw;
    height: 100vh;
}
</style>
