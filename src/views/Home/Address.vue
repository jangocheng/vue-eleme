<template>
    <div class="address">
        <Header :isLeft="true" title="选择收货地址" back="home" />
        <div class="city_search">
            <div class="search">
                <span class="city" @click="$router.push('/city')">
                    {{ city }}
                    <i class="fa fa-angle-down"></i>
                </span>
                <i class="fa fasearch"></i>
                <input type="text" v-model="search_val" placeholder="小区/写字楼/学校" />
            </div>
            <Location :address="address" @click="$router.push('home')" />
        </div>
        <div class="area">
            <ul class="area_list" v-for="(item, index) in areaList" :key="index">
                <li @click="selectAddress(item)">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.district }}{{ item.address }}</p>
                    <div></div>
                </li>
            </ul>
        </div>
        <div :style="{height:'7px',backgroundColor:'#eee'}"></div>
        <div class="address-list" v-show="!search_val">
            <span v-if="allAddress.length > 0">收货地址</span>
            <div v-else class="tips" @click="$router.push({name: 'addAddress', params: addData})">
                <span>您还没有收货地址哦</span>
                <span style="color:#009eef">请搜索或点此去添加地址吧</span>
                <!-- <span>详细地址(如门牌号)可稍后输入哦。</span> -->
            </div>
            <AddressList :allAddress="allAddress" />
        </div>
        <div class="tips" v-if="search_val">
            <span>找不到地址?</span>
            <span>请尝试只输入小区,写字楼或学校名,</span>
            <span>详细地址(如门牌号)可稍后输入哦。</span>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
import AddressList from '../../components/Basal/AddressList';
import Location from '../../components/Home/Location';
export default {
    name: 'EleAddress',
    data() {
        return {
            city: '',
            search_val: '',
            areaList: [],
            allAddress: [],
            addData: {
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
        };
    },
    created() {
        this.getData();
        localStorage.setItem('name', 'home');
    },
    computed: {
        address() {
            return this.$store.getters.location.formattedAddress;
        }
    },
    watch: {
        search_val() {
            this.searchPlace();
        }
    },
    methods: {
        searchPlace() {
            const self = this;
            // console.log(this.search_val);
            AMap.plugin('AMap.Autocomplete', function() {
                // 实例化Autocomplete
                var autoOptions = {
                    // city 限定城市，默认全国
                    city: self.city
                };
                var autoComplete = new AMap.Autocomplete(autoOptions);
                autoComplete.search(self.search_val, function(status, result) {
                    // 搜索成功时，result即是对应的匹配数据
                    // console.log(result);
                    self.areaList = result.tips;
                });
            });
        },
        selectAddress(item) {
            this.$store.dispatch(
                'setAddress',
                item.district + item.address + item.name
            );
            this.$router.push('/home');
        },
        getData() {
            this.$axios(`/api/user/user_info/${localStorage.ele_login}`).then(
                res => {
                    // console.log(res.data);
                    this.allAddress = res.data.myAddress;
                }
            );
        }
    },
    components: {
        Header,
        Location,
        AddressList
    },
    // 接受路由转跳过来传的值
    beforeRouteEnter(to, from, next) {
        // console.log(to);
        // console.log(from);
        next(_ => {
            _.city = to.params.city;
        });
    }
};
</script>

<style scoped>
.address {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 45px;
    background-color: #fff;
}
.city_search {
    background-color: #fff;
    padding: 2.67vw 5.33vw;
    color: #333;
}

.search {
    background-color: #eee;
    height: 0.4rem;
    border-radius: 10px;
    box-sizing: border-box;
    line-height: 0.4rem;
}
.search .city {
    padding: 0 2.67vw;
}
.city i {
    margin-right: 2.67vw;
}
.search input {
    margin-left: 1.33vw;
    background-color: #eee;
    outline: none;
    border: none;
}

.area {
    margin-top: 2.67vw;
    background: #fff;
}
.area li {
    padding: 2.13vw 4.267vw;
    color: #aaa;
}
.area li p {
    font-size: 3.2vw;
}
.area li h4 {
    font-weight: bold;
    color: #333;
    margin-bottom: 1.333vw;
}
.area li div {
    /* width: 95%; */
    margin-top: 2.133vw;
    border-bottom: 1px solid #eee;
}
.address-list {
    margin-left: 3vw;
}
.address-list > span {
    margin: 2.6667vw 2.4vw;
    padding-top: 2vw;
    line-height: 3em;
    font-size: 0.12rem;
}
.tips {
    margin-top: 5.333vw;
}
.tips span {
    display: block;
    font-size: 4.267vw;
    color: #999;
    text-align: center;
    margin: 1.867vw auto;
}
</style>
