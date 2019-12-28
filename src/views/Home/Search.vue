<template>
    <div class="search">
        <!-- 搜索 -->
        <Header :isLeft="true" title="搜索"></Header>
        <div class="search_header">
            <form class="search_wrap">
                <i class="fa fa-search"></i>
                <input type="text" v-model="key_word" placeholder="输入商家 商品信息" />
                <button @click.prevent="searchHandle">搜索</button>
            </form>
        </div>
        <!-- 搜索展示 -->
        <div class="shop" v-if="result && !showShop">
            <div class="empty_wrap" v-if="empty">
                <img src="https://fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png" />
                <div class="empty_txt">
                    <h4>附近没有搜索结果</h4>
                    <span>换个关键词试试吧</span>
                </div>
            </div>
            <div v-else>
                <SearchIndex
                    :data="result.restaurants"
                    @push="pushShop"
                ></SearchIndex>
                <SearchIndex :data="result.words" @click="shopItemClick"></SearchIndex>
            </div>
        </div>
        <!-- 搜索前提示 -->
        <div class="search-tips" v-if="!key_word">
            <!-- 历史记录 -->
            <div class="search_history" v-if="searchHistory.length > 0">
                <div class="title">
                    <span>历史记录</span>
                    <i class="fa fa-trash-o" @click="clearSearchHistory"></i>
                </div>
                <ul>
                    <li
                        @click="key_word = item"
                        class="search_history_item"
                        v-for="(item, index) in searchHistory"
                        :key="index"
                    >{{ item }}</li>
                </ul>
            </div>
            <!-- 热门搜索 -->
            <div class="search_history">
                <div class="title">
                    <span>热门搜索</span>
                </div>
                <ul>
                    <li
                        @click="key_word = item"
                        class="search_history_item"
                        v-for="(item, index) in searchHot"
                        :key="index"
                    >{{ item }}</li>
                </ul>
            </div>
        </div>
        <!-- 商家信息 -->
        <div class="container" v-if="showShop">
            <!-- 排序筛选 -->
            <FilterView class="filterSticky" :filterData="filterData" @updata="updata"></FilterView>
            <!-- 商家展示 -->
            <div
                class="shoplist"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <IndexShop
                    v-for="(item, index) in restaurants"
                    :key="index"
                    :restaurant="item"
                ></IndexShop>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
import SearchIndex from '../../components/Shops/SearchIndex';
import FilterView from '../../components/Shops/FilterView';
import IndexShop from '../../components/Shops/IndexShop';
import { InfiniteScroll } from 'mint-ui';

export default {
    name: 'Search',
    data() {
        return {
            key_word: '',
            result: null,
            empty: false,
            showShop: false,
            filterData: null,
            sortRule: null,
            restaurants: [],
            page: 0,
            size: 8,
            loading: false,
            searchHistory: [],
            searchHot: []
        };
    },
    components: {
        Header,
        SearchIndex,
        FilterView,
        IndexShop
    },
    created() {
        this.$axios('/api/profile/filter')
            .then(res => {
                this.filterData = res.data;
            })
            .catch(err => {
                console.log(err);
            });
        if (localStorage.getItem('SEARCH_HISTORY')) {
            this.searchHistory = localStorage
                .getItem('SEARCH_HISTORY')
                .split(',');
        }
        this.$axios('/api/profile/hotwords')
            .then(res => {
                this.searchHot = res.data.hot_words;
                // console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    },
    watch: {
        key_word() {
            this.empty = false;
            this.showShop = false;
            this.keyWrodChange();
        }
    },
    methods: {
        keyWrodChange() {
            // console.log(this.key_word);
            if (!this.key_word) {
                this.result = null;
                return;
            }
            this.$axios(`/api/profile/typeahead/${this.key_word}`)
                .then(res => {
                    console.log(res.data);
                    this.result = res.data;
                })
                .catch(err => {
                    console.log(err)
                    this.result = null;
                });
        },
        searchHandle() {
            if (!this.key_word) return;
            this.addSearchHistory(this.key_word);
            if (
                this.result &&
                (this.result.restaurants.length > 0 ||
                    this.result.restaurants.words > 0)
            ) {
                this.showShop = true;
            } else {
                this.empty = true;
            }
        },
        shopItemClick() {
            this.page = 0;
            this.restaurants = [];
            this.showShop = true;
        },
        updata(condition) {
            this.sortRule = condition;
            // this.shopItemClick();
        },
        loadMore() {
            this.page++;
            this.$axios
                .post(`/api/profile/restaurants/${this.page}/${this.size}`)
                .then(res => {
                    if (res.data.length > 0) {
                        this.restaurants = res.data;
                    }
                    if (res.data.length < 8) {
                        this.loading = true;
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        addSearchHistory(key) {
            let temp = [];
            if (this.searchHistory) {
                temp = this.searchHistory.filter(_ => {
                    return _ != key;
                });
            }
            if (temp.length < 8) {
                temp.unshift(key);
            } else {
                temp.pop();
                temp.unshift(key);
            }
            this.searchHistory = temp;
            localStorage.setItem('SEARCH_HISTORY', this.searchHistory);
        },
        clearSearchHistory() {
            this.searchHistory = [];
            localStorage.removeItem('SEARCH_HISTORY');
        },
        pushShop(id) {
            console.log(id)
            this.$router.push({name: 'shop', query: {authentic_id: id}})
        }
    }
};
</script>

<style scoped>
.search {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background: #fff;
}
.search_header {
    background: #fff;
    position: sticky;
    top: 44px;
    margin-top: 45px;
    padding: 0 4.266667vw;
}
.search_header .search_wrap {
    padding: 2.933333vw 2.933333vw 2.933333vw 0;
    display: flex;
    align-items: center;
    position: relative;
}
.search_wrap .fa-search {
    width: 2.933333vw;
    height: 2.933333vw;
    color: #888;
    position: absolute;
    top: 4.6666666vw;
    left: 2.933333vw;
}
.search_wrap input {
    flex-grow: 1;
    border-radius: 10px;
    background-color: #f8f8f8;
    padding: 1.733333vw 4vw 1.733333vw 8.8vw;
    color: #666;
    outline: none;
    border: none;
}
.search_wrap button {
    outline: none;
    border: none;
    color: #333;
    font-size: 0.426667rem;
    background: #fff;
    font-weight: 700;
    margin-left: 2.933333vw;
    font-size: 14px;
}

.shop {
    width: 100%;
    height: calc(100% - 95px);
    overflow: auto;
}

.empty_wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    display: flex;
    justify-content: center;
}
.empty_wrap img {
    width: 35vw;
    height: 35vw;
}
.empty_txt h4 {
    color: #666;
    font-size: 0.16rem;
    margin: 12vw 0 2vw 0;
}
.empty_txt span {
    color: #999;
    font-size: 0.128rem;
}
.search_history {
    margin-bottom: 30px;
}
.search_history .title {
    width: 100%;
    /* color: #666; */
    font-weight: 700;
    display: inline-flex;
    justify-content: space-between;
}
.search_history i {
    padding-right: 3vw;
}
.search_history span {
    font-size: 0.177rem;
    padding-left: 3vw;
}
.search_history ul {
    display: flex;
    flex-wrap: wrap;
}
.search_history_item {
    border-radius: 1px;
    margin: 8px 13px;
    padding: 7px 10px;
    font-size: 13px;
    color: #666;
    background-color: #f7f7f7;
}
.container {
    width: 100%;
}
.filterSticky {
    position: sticky;
    top: 94px;
}
</style>
