<template>
    <div class="city">
        <!-- 搜索框 -->
        <div class="search_wrap">
            <div class="search">
                <i class="fa fa-search"></i>
                <input type="text" placeholder="输入城市名" v-model="city_val" />
            </div>
            <button
                :disabled="disabled"
                @click="
                    $router.push({ name: 'address', params: { city: city } })
                "
            >取消</button>
        </div>
        <!-- 定位 索引 -->
        <div class="cityIndex" v-if="searchList.length == 0">
            <div class="location">
                <Location
                    :address="city"
                    @click="
                        $router.push({
                            name: 'address',
                            params: { city: city }
                        })
                    "
                ></Location>
            </div>
            <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys"></Alphabet>
        </div>
        <!-- 搜索结果 -->
        <div class="search_list" v-else>
            <ul>
                <li
                    @click="selectCity(item)"
                    v-for="(item, index) in searchList"
                    :key="index"
                >{{ item.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Location from '../../components/Home/Location';
import Alphabet from '../../components/Home/Alphabet';

export default {
    name: 'City',
    data() {
        return {
            city_val: '',
            cityInfo: null,
            keys: [],
            cityList: [],
            searchList: []
        };
    },
    computed: {
        city() {
            return (
                this.$store.getters.location.addressComponent.city ||
                this.$store.getters.location.addressComponent.province
            );
        },
        disabled() {
            if (!this.cityInfo) {
                return true;
            } else {
                return false;
            }
        }
    },
    components: {
        Location,
        Alphabet
    },
    created() {
        this.getCityInfo();
    },
    methods: {
        getCityInfo() {
            this.$axios('/api/city').then(res => {
                delete res.data.__v;
                delete res.data._id;
                this.cityInfo = res.data;
                this.keys = Object.keys(res.data);
                // 去除hotcities
                this.keys.pop();
                this.keys.sort();
                this.keys.forEach(key => {
                    this.cityInfo[key].forEach(oneCity => {
                        this.cityList.push(oneCity);
                    });
                });
                this.$nextTick(() => {
                    this.$refs.allcity.initScroll();
                });
            });
        },
        selectCity(city) {
            // console.log(city);
            this.$router.push({ name: 'address', params: { city: city.name }});
        },
        searchCity() {
            if (!this.city_val) {
                this.searchList = [];
            } else {
                this.searchList = this.cityList.filter(item => {
                    return item.name.indexOf(this.city_val) > -1;
                });
            }
            // console.log(this.searchList);
        }
    },
    watch: {
        city_val() {
            this.searchCity();
        }
    }
};
</script>

<style scoped>
.city {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 45px;
    overflow: hidden;
}
.search_wrap {
    position: fixed;
    top: 0;
    height: 45px;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 0.8vw 4.267vw;
    display: flex;
    justify-content: space-between;
}
.search {
    background-color: #eee;
    border-radius: 2.67vw;
    font-size: 0.16rem;
    line-height: 0.34rem;
    width: 85%;
    box-sizing: border-box;
    padding: 0 4.267vw;
}
.search input {
    background: #eee;
    outline: none;
    border: none;
    margin-left: 1.33vw;
}
.search_wrap button {
    color: #009eef;
    border: none;
    background-color: transparent;
    outline: none;
}
.cityIndex {
    height: 100%;
}
.location {
    background: #fff;
    padding: 1px 4.267vw;
    margin: 0 0 4vw 0;
    box-sizing: border-box;
}

.search_list {
    background: #fff;
    padding: 1.33vw 4.267vw;
}
.search_list li {
    padding: 2.667vw;
    border-bottom: 1px solid #eee;
}
</style>
