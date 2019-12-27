<template>
    <div v-if="showSearch" class="addressSearch">
        <div class="search-view">
            <!-- 地图 -->
            <div id="map"></div>
            <!-- 搜索框 -->
            <div class="search-box">
                <div class="search-box-input">
                    <i class="fa fa-search"></i>
                    <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="search_address" />
                </div>
                <button @click="$emit('close')" class="search-box-btn">取消</button>
            </div>
            <!-- 列表 -->
            <ul class="search-list">
                <li
                    v-for="(item, index) in areaList"
                    :key="index"
                    class="search-row"
                    @click="selectAddress(item)"
                >
                    <p class="search-row-title">{{ item.name }}</p>
                    <p class="search-row-location">{{ item.district ? item.district : ''}}{{ item.address }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddressSearch',
    data() {
        return {
            search_address: '',
            areaList: [],
            map: null
        };
    },
    mounted() {
        this.initMap();
    },
    computed: {
        city() {
            return (
                this.$store.getters.location.addressComponent.city ||
                this.$store.getters.location.addressComponent.province
            );
        }
    },
    watch: {
        search_address(val) {
            // console.log(val);
            this.searchPlace(val);
        }
    },
    props: {
        showSearch: Boolean,
        addressInfo: Object
    },
    methods: {
        searchPlace(val) {
            // console.log(this.city);
            AMap.plugin('AMap.Autocomplete', () => {
                // 实例化Autocomplete
                var autoOptions = {
                    // city 限定城市，默认全国
                    city: this.city
                };
                var autoComplete = new AMap.Autocomplete(autoOptions);
                autoComplete.search(val, (status, result) => {
                    // 搜索成功时，result即是对应的匹配数据
                    // console.log(result);
                    if (!result.tips) return;
                    for (let i = 0; i < result.tips.length; i ++) {
                        if(result.tips[i].location != '') {
                            this.initMap(result.tips[i].location)
                            break;
                        }
                    }
                    this.areaList = result.tips;
                });
            });
        },
        selectAddress(item) {
            // console.log(item);
            this.addressInfo.address = item.name + (item.district ? item.district : '') + item.address;
            this.$emit('close');
        },
        initMap(pos = this.$store.getters.location.position) {
            let _this = this;
            AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
                var map = new AMap.Map('map',{
                    zoom:16
                })
                var positionPicker = new PositionPicker({
                    mode:'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map:map//依赖地图对象
                });
                //TODO:事件绑定、结果处理等

                positionPicker.on('success', function(positionResult) {
                    // console.log(positionResult);
                    _this.areaList = positionResult.regeocode.pois;
                });
                positionPicker.on('fail', function(positionResult) {
                    // 海上或海外无法获得地址信息
                });

                positionPicker.start(pos);
            });

        }
    }
};
</script>

<style scoped>
.addressSearch {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 45px;
}
/* 地图 */
#map {
    width: 100vw;
    height: 60vw;
}
/* 搜索框 */
.search-view {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background-color: #fff;
}
.search-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.133333vw 3.866667vw 1.866667vw;
}
.search-box-input {
    flex: 1;
    border: 1px solid #ddd;
    outline: 0;
    color: #999;
    height: 7.466667vw;
    margin-right: 2.666667vw;
    border-radius: 0.533333vw;
    background: #f5f5f5;
    padding: 0 2.133333vw;
    display: flex;
    align-items: center;
}
.search-box-input > input {
    margin-left: 2vw;
    width: 90%;
    background: none;
}
input,
button {
    outline: none;
    border: none;
}
.search-box-btn {
    color: #333;
    border-radius: 0.533333vw;
    width: 14.8vw;
    height: 7.466667vw;
    font-size: 0.144rem;
    white-space: nowrap;
}
/* 列表 */
.search-list {
    padding-left: 4vw;
}
.search-row {
    border-bottom: 0.266667vw solid #eee;
    padding: 2.533333vw 0 3.333333vw;
    line-height: 1.2;
}
.search-row-title {
    color: #333;
    font-size: 0.16rem;
}
.search-row-location {
    color: #999;
    font-size: 0.139rem;
}
</style>
