<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    name: 'App',
    created() {
        this.getLocation();
        this.saveStore();
    },
    methods: {
        saveStore() {
            // 在页面加载时读取sessionStorage里的状态信息
            if (sessionStorage.getItem('store')) {
                this.$store.replaceState(
                    Object.assign(
                        {},
                        this.$store.state,
                        JSON.parse(sessionStorage.getItem('store'))
                    )
                );
            }
            // 在页面刷新时将vuex里的信息保存到sessionStorage里
            window.addEventListener('beforeunload', () => {
                sessionStorage.setItem(
                    'store',
                    JSON.stringify(this.$store.state)
                );
            });
        },
        getLocation() {
            // 精准定位
            const self = this;
            AMap.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 10000
                });

                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);
                AMap.event.addListener(geolocation, 'error', onError);

                function onComplete(data) {
                    // data是具体的定位信息
                    // console.log(data);
                    self.$store.dispatch('setLocation', data);
                    self.$store.dispatch('setAddress', data.formattedAddress);
                }

                function onError(data) {
                    // 定位出错
                    // console.log(data);
                    self.getLngLatLoaction();
                }
            });
        },
        getLngLatLoaction() {
            // 模糊IP定位
            const self = this;
            AMap.plugin('AMap.CitySearch', function() {
                var citySearch = new AMap.CitySearch();
                citySearch.getLocalCity(function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // 查询成功，result即为当前所在城市信息

                        // 经纬度反编码
                        AMap.plugin('AMap.Geocoder', function() {
                            var geocoder = new AMap.Geocoder({
                                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                                city: result.adcode
                            });
                            var lng =
                                (parseFloat(
                                    result.rectangle.split(';')[0].split(',')[0]
                                ) +
                                    parseFloat(
                                        result.rectangle
                                            .split(';')[1]
                                            .split(',')[0]
                                    )) /
                                2;
                            var lat =
                                (parseFloat(
                                    result.rectangle.split(';')[0].split(',')[1]
                                ) +
                                    parseFloat(
                                        result.rectangle
                                            .split(';')[1]
                                            .split(',')[1]
                                    )) /
                                2;
                            var lnglat = [lng, lat];

                            geocoder.getAddress(lnglat, function(
                                status,
                                result
                            ) {
                                if (
                                    status === 'complete' &&
                                    result.info === 'OK'
                                ) {
                                    // result为对应的地理位置详细信息
                                    // console.log(result);
                                    self.$store.dispatch('setLocation', {
                                        addressComponent: {
                                            city:
                                                result.regeocode
                                                    .addressComponent.city,
                                            province:
                                                result.regeocode
                                                    .addressComponent.province
                                        },
                                        formattedAddress:
                                            result.regeocode.formattedAddress
                                    });
                                    self.$store.dispatch(
                                        'setAddress',
                                        result.regeocode.formattedAddress
                                    );
                                }
                            });
                        });
                    }
                });
            });
        }
    }
};
</script>

<style>
#app {
    width: 100%;
    height: 100%;
    background: #f1f1f1;
}
</style>
