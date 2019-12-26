<template>
    <div class="home">
        <!-- 选地址 -->
        <div class="header">
            <div
                class="address_map"
                @click="
                    $router.push({ name: 'address', params: { city: city } })
                "
            >
                <i class="fa fa-map-marker"></i>
                <span v-if="address">{{ address }}</span>
                <span v-else class="positionning">正在定位...</span>
                <i class="fa fa-sort-down"></i>
            </div>
        </div>
        <!-- 搜索商家 -->
        <div
            class="search_wrap"
            :class="{ fixedview: showFilter }"
            @click="$router.push('/search')"
        >
            <div class="shop_search">
                <i class="fa fa-search"></i>
                星巴克专星送
            </div>
        </div>
        <!-- 图超级连接 -->
        <div class="container">
            <div style="position:relative">
                <!-- 弧线 -->
                <div class="pure_top"></div>
                <!-- 轮播图 -->
                <mt-swipe :auto="4000" class="swiper">
                    <mt-swipe-item v-for="(img, index) in swipeImgs" :key="index">
                        <img :src="img" alt />
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!-- 分类图 -->
            <mt-swipe :auto="0" class="entries">
                <mt-swipe-item v-for="(entry, i) in entries" :key="i" class="entry_wrap">
                    <div class="foodentry" v-for="(item, index) in entry" :key="index">
                        <div class="img_wrap">
                            <img :src="item.image" alt />
                        </div>
                        <span>{{ item.name }}</span>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <!-- 推荐商家 -->
        <div class="shoplist-title">推荐商家</div>
        <!-- 筛选导航 -->
        <div class="filterSticky" :class="{ cFixedview: showFilter }">
            <FilterView :filterData="filterData" @searchFixed="showFilterView" @updata="updata"></FilterView>
        </div>
        <!-- 商家信息 -->
        <mt-loadmore
            :class="{ overflowStyle: mintScroll }"
            :top-method="loadData"
            :bottom-method="loadMore"
            :bottom-all-loaded="allLoaded"
            ref="loadmore"
            :autoFill="false"
            :bottomPullText="bottomPullText"
        >
            <div class="shoplist">
                <IndexShop
                    v-for="(item, index) in restaurants"
                    :key="index"
                    :restaurant="item.restaurant"
                    :authentic_id="item.restaurant.authentic_id"
                ></IndexShop>
            </div>
        </mt-loadmore>
        <!-- 回到顶部 -->
        <div class="go-top" v-if="gotoTop" @click="goBack">
            <i class="fa fa-arrow-up"></i>
        </div>
    </div>
</template>

<script>
import { Swip, SwipItem, Loadmore } from 'mint-ui';
import FilterView from '../../components/Shops/FilterView';
import IndexShop from '../../components/Shops/IndexShop';

export default {
    name: 'Home',
    data() {
        return {
            swipeImgs: [],
            entries: [],
            filterData: null,
            showFilter: false,
            page: 1,
            size: 7,
            restaurants: [],
            allLoaded: false,
            bottomPullText: '上拉加载更多',
            sortRule: null,
            mintScroll: false,
            elOffsetTop: 0,
            homeScrollTop: 0,
            gotoTop: false
        };
    },
    computed: {
        address() {
            return this.$store.getters.address;
        },
        city() {
            return (
                this.$store.getters.location.addressComponent.city ||
                this.$store.getters.location.addressComponent.province
            );
        }
    },
    created() {
        this.getData();
    },
    mounted() {
        document
            .getElementsByClassName('home')[0]
            .addEventListener('scroll', this.getScrollTop);
    },
    methods: {
        getScrollTop() {
            this.elOffsetTop = document.getElementsByClassName(
                'filterSticky'
            )[0].offsetTop;
            this.homeScrollTop = document.getElementsByClassName(
                'home'
            )[0].scrollTop;
            if (this.elOffsetTop - this.homeScrollTop < 60) {
                this.mintScroll = true;
                this.gotoTop = true;
            } else {
                this.mintScroll = false;
                this.gotoTop = false;
            }
        },
        getData() {
            // 轮播图 分类图
            this.$axios('/api/profile/shopping')
                .then(res => {
                    // console.log(res.data);
                    this.swipeImgs = res.data.swipeImgs;
                    this.entries = res.data.entries;
                })
                .catch(err => {
                    console.log(err);
                });
            // 推荐过滤
            this.$axios('/api/profile/filter')
                .then(res => {
                    // console.log(res.data);
                    this.filterData = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
            // 获取商店列表
            this.loadData();
        },
        showFilterView(isShow) {
            this.showFilter = isShow;
        },
        updata(condition) {
            // console.log(condition);
            this.sortRule = condition;
            this.loadData();
        },
        // 获取商店列表
        loadData() {
            this.page = 1;
            this.allLoaded = false;
            this.bottomPullText = '上拉加载更多';
            // 商家信息
            this.$axios
                .post(
                    `/api/profile/restaurants/${this.page}/${this.size}`,
                    this.sortRule
                )
                .then(res => {
                    // console.log(res.data)
                    this.$refs.loadmore.onTopLoaded();
                    this.restaurants = res.data;
                });
        },
        // 上拉加载
        loadMore() {
            if (!this.allLoaded) {
                this.page++;
                this.$axios
                    .post(`/api/profile/restaurants/${this.page}/${this.size}`)
                    .then(res => {
                        this.$refs.loadmore.onBottomLoaded();
                        if (res.data.length > 0) {
                            res.data.forEach(item => {
                                this.restaurants.push(item);
                            });
                            if (res.data.length < this.size) {
                                this.allLoaded = true;
                                this.bottomPullText = '没有更多了哦';
                            }
                        } else {
                            this.allLoaded = true;
                            this.bottomPullText = '没有更多了哦';
                        }
                    });
            }
        },
        goBack() {
            document.getElementsByClassName('home')[0].scrollTop = 0;
        }
    },
    components: {
        FilterView,
        IndexShop
    }
};
</script>

<style scoped>
.home {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 45px;
}
.header {
    height: 40px;
    box-sizing: border-box;
}
.search_wrap {
    position: sticky;
    top: 0;
    z-index: 200;
    height: 54px;
    box-sizing: border-box;
}
.header,
.search_wrap {
    background-color: #009eef;
    padding: 10px 16px;
}

.header .address_map {
    color: #fff;
    font-weight: bold;
}
.address_map i {
    display: inline-block;
    font-size: 0.18rem;
    vertical-align: middle;
}
.address_map span {
    display: inline-block;
    width: 80vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 6px;
    font-size: 0.14rem;
    line-height: 0.16rem;
    vertical-align: middle;
}
.positionning {
    animation: dance 2s infinite;
}
@keyframes dance {
    0% {
        opacity: 1;
        /* transform: translate(0px, 0px); */
    }
    50% {
        opacity: 0;
        /* transform: translate(0px, -5px); */
    }
    0% {
        opacity: 1;
        /* transform: translate(0px, 0px); */
    }
}
.search_wrap .shop_search {
    background-color: #fff;
    font-size: 0.13rem;
    padding: 10px 0;
    border-radius: 27px;
    text-align: center;
    color: #aaa;
}
/* 弧线 */
.pure_top {
    width: 100%;
    height: 100px;
    position: absolute;
    overflow: hidden;
}
.pure_top::after {
    content: "";
    width: 120%;
    height: 50px;
    position: absolute;
    left: -10%;
    top: 0;
    border-radius: 0 0 80% 80%;
    background: #009eef;
}
/* 图 */
.swiper {
    height: 100px;
}
.swiper img {
    width: 90%;
    height: 100px;
    display: inline-block;
    margin-left: 5%;
    border-radius: 5px;
}
.entries {
    background: #fff;
    height: 47.2vw;
    text-align: center;
    overflow: hidden;
}
.foodentry {
    width: 20%;
    float: left;
    position: relative;
    margin-top: 2.9vw;
}
.foodentry .img_wrap {
    position: relative;
    display: inline-block;
    width: 12vw;
    height: 12vw;
}
.img_wrap img {
    width: 100%;
    height: 100%;
}
.foodentry span {
    display: block;
    color: #666;
    font-size: 0.13rem;
}

/* 推荐商家 */
.shoplist-title {
    display: flex;
    align-items: flex;
    justify-content: center;
    height: 9.6vw;
    line-height: 9.6vw;
    font-size: 0.16rem;
    font-weight: 600;
    color: #333;
    background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
    display: block;
    content: "一";
    width: 5.3vw;
    height: 0.27vw;
    color: #999;
}
.shoplist-title:before {
    margin-right: 3.5vw;
}
.shoplist-title:after {
    margin-left: 3.5vw;
}
.filterSticky {
    position: sticky;
    top: 54px;
}
.fixedview {
    width: 100%;
    position: fixed;
    top: 0px;
    z-index: 200;
}
.cFixedview {
    position: fixed;
    top: 54px;
}
.mint-loadmore {
    height: calc(100% - 95px);
    overflow: hidden;
}
.overflowStyle {
    overflow: auto !important;
}
.go-top {
    position: fixed;
    right: 10%;
    bottom: calc(45px + 3%);
    width: 0.4rem;
    height: 0.4rem;
    background: #fff;
    border: 1px solid #999;
    border-radius: 50%;
    z-index: 999;
}
.go-top i {
    line-height: 0.4rem;
    padding-left: 0.06rem;
    font-size: 0.3rem;
    color: #999;
}
</style>
