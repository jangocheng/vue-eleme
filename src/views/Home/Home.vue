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
        <div class="search_wrap" :class="{ fixedview: showFilter }" @click="$router.push('/search')" >
            <div class="shop_search">
                <i class="fa fa-search"></i>
                星巴克专星送
            </div>
        </div>
        <!-- 图超级连接 -->
        <div class="container">
            <!-- 轮播图 -->
            <div style="position:relative">
                <!-- 弧线 -->
                <div class="pure_top"></div>
                <mt-swipe :auto="4000" class="swiper">
                    <mt-swipe-item v-for="(img, index) in swipeImgs" :key="index">
                        <img :src="img" alt />
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!-- 分类图 -->
            <div class="entries">
                <!-- 第一排大图标 -->
                <div class="foodentry" v-for="(item, index) in entries" :key="index">
                    <div class="img_wrap">
                        <img :src="item.image" alt />
                    </div>
                    <span>{{ item.name }}</span>
                </div>
                <!-- 二三小图标 -->
                <div class="classify" v-for="(cla, j) in classify" :key="entries.length + j">
                    <div class="img_wrap">
                        <img :src="cla.image" />
                    </div>
                    <span>{{ cla.name }}</span>
                </div>
            </div>
        </div>
        <!-- 红包 -->
        <div class="redpack">
            <div class="vip">
                <div class="vip-des">
                    <h2>超级会员</h2>
                    <strong>1.5</strong>
                    <span>个奖励金可用</span>
                </div>
                <div class="vip-img">
                    <i class="fa fa-diamond"></i>
                </div>
            </div>
            <div class="subsidy">
                <div class="subsidy-des">
                    <h2>优惠津贴</h2>
                    <strong>20元</strong>
                    <span>专属补贴</span>
                </div>
                <div class="subsidy-img">
                    <i class="fa fa-credit-card"></i>
                </div>
            </div>
        </div>
        <!-- 推荐商家 -->
        <div class="shoplist-title">推荐</div>
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
                    :restaurant="item"
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
// import api from '../../api/index'

export default {
    name: 'Home',
    data() {
        return {
            swipeImgs: [],
            entries: [],
            classify: [],
            filterData: null,
            showFilter: false,
            page: 1,
            size: 5,
            restaurants: [],
            allLoaded: false,
            bottomPullText: '上拉加载更多',
            sortRule: null,
            mintScroll: false,
            elOffsetTop: 0,
            homeScrollTop: 0,
            gotoTop: false,
            redpack: [
                { title: '超级会员', number: '1.5', des: '个奖励金可用', icon: ''},
                { title: '津贴优惠', number: '20元', des: '专属补贴', icon: ''}
            ]
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
        document.getElementsByClassName('home')[0].addEventListener('scroll', this.getScrollTop);
        if(!!sessionStorage.getItem('openid')) return;
        /openid=(.{0,28})[^&]*/.test(window.location.href);
        let openid = RegExp.$1;
        sessionStorage.setItem('openid', openid);
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
            // 轮播图和分类图
            this.$api.getFrontPageImgs()
                .then(res => {
                    // console.log(res.data);
                    this.swipeImgs = res.data.swipeImgs;
                    this.entries = res.data.entries;
                    this.classify = res.data.classify;
                })
                .catch(err => {
                    console.log(err);
                });
            // 推荐过滤
            this.$api.getfilterData()
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
            // 一些商家信息
            this.$api.getRestaurants(this.page, this.size, this.sortRule)
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
                this.$api.getRestaurants(this.page, this.size)
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
    width: 90vw;
    background: #fff;
    text-align: center;
    overflow: hidden;
    margin: 0 auto;
    padding-bottom: 3vw;
}
.foodentry,
.classify {
    width: 18vw;
    float: left;
    position: relative;
    margin: 2.9vw 0;
}
.foodentry .img_wrap {
    position: relative;
    display: inline-block;
    width: 12vw;
    height: 12vw;
}
.classify .img_wrap {
    position: relative;
    display: inline-block;
    width: 7vw;
    height: 7vw;
}
.img_wrap img {
    width: 100%;
    height: 100%;
}
.foodentry span {
    display: block;
    color: #666;
    padding-top: 1.6vw;
    font-size: 0.13rem;
}
.classify span {
    display: block;
    color: #666;
    font-size: 0.1rem;
    padding-top: 2vw;
}
/* 红包 */
.redpack {
    display: flex;
    justify-content: space-between;
}
.redpack .vip,
.redpack .subsidy{
    display: flex;
    justify-content: space-between;
    width: 44.6667vw;
    height: 20vw;
    border-radius: 5px;
}
.redpack .vip {
    margin-left: 4.3vw;
    background-image: linear-gradient(to right, #fdf4e2, #fbeccd);
}
.vip-des h2 {
    font-size: 0.18rem;
    color: #624732;
    margin: 1.887vw;
    font-weight: 600;
}
.vip-des strong,
.subsidy-des strong {
    color: #f15139;
    line-height: 12.6667vw;
    margin-left: 1.887vw;
    font-weight: 600;
}
.vip-des span {
    font-size: 0.13rem;
    color: #9d876f;
}
.subsidy-des span {
    font-size: 0.13rem;
    color: #ab9192;
}
.subsidy-des h2 {
    font-size: 0.18rem;
    color: #7d383b;
    margin: 1.887vw;
    font-weight: 600;
}
.redpack .vip .vip-img {
    margin: 12vw 3vw 0 0;
    color: #dfab55;
}
.redpack .subsidy .subsidy-img {
    margin: 12vw 3vw 0 0;
    color: #ff6867;
}
.redpack .subsidy {
    margin-right: 4.3vw;
    background-image: linear-gradient(to right, #fdeee9, #fde9e8);
}
/* 推荐商家 */
.shoplist-title {
    height: 9.6vw;
    line-height: 9.6vw;
    font-weight: 600;
    color: #333;
    padding-left: 3vw;
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
