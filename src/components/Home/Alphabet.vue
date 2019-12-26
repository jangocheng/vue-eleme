<template>
    <div class="area" ref="area_scroll" v-if="cityInfo">
        <!-- 滚动内容 -->
        <div class="scroll_wrap">
            <!-- 热门城市 -->
            <div class="hot_wrap citylist">
                <div class="title">热门城市</div>
                <ul class="hot_city">
                    <li
                        @click="$emit('selectCity', item)"
                        v-for="(item, index) in cityInfo.hotCities"
                        :key="index"
                    >{{ item.name }}</li>
                </ul>
            </div>
            <!-- 所有城市 -->
            <div class="city_wrap">
                <div class="city_content citylist" v-for="(item, index) in keys" :key="index">
                    <div class="title">{{ item }}</div>
                    <ul>
                        <li
                            @click="$emit('selectCity', city)"
                            v-for="(city, index) in cityInfo[item]"
                            :key="index"
                        >{{ city.name }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- #A~Z索引 -->
        <div class="area_keys">
            <ul>
                <li @click="selectKey(0)" :class="{ selectKeyStyle: currentIndex == 0 }">#</li>
                <li
                    v-for="(item, index) in keys"
                    :key="index"
                    @click="selectKey(index + 1)"
                    :class="{ selectKeyStyle: currentIndex == index + 1 }"
                >{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
    name: 'Alphabet',
    data() {
        return {
            scroll: null,
            currentIndex: 0,
            scrollY: 0,
            listHeight: []
        };
    },
    props: {
        cityInfo: Object,
        keys: Array
    },
    methods: {
        initScroll() {
            this.scroll = new BScroll(this.$refs.area_scroll, {
                click: true,
                mouseWheel: true
            });
            // Y轴偏移的值
            this.scroll.on('scroll', pos => {
                this.scrollY = pos.y;
                // console.log(this.scrollY);
            });
            this._calculateHeight();
            // console.log(this.listHeight);
        },
        _calculateHeight() {
            const lists = document.getElementsByClassName('citylist');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < lists.length; i++) {
                const item = lists[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectKey(index) {
            this.currentIndex = index;
            const cityList = this.$refs.area_scroll.getElementsByClassName(
                'citylist'
            );
            const el = cityList[index];
            this.scroll.scrollToElement(el, 250);
        }
    },
    watch: {
        scrollY(newVal) {
            if (newVal > 0) {
                this.currentIndex = 0;
                return;
            }
            for (let i = 0; i < this.listHeight.length - 1; i++) {
                const height1 = this.listHeight[i];
                const height2 = this.listHeight[i + 1];
                if (-newVal >= height1 && -newVal < height2) {
                    this.currentIndex = i;
                    return;
                }
            }
            this.currentIndex = this.listHeight.length - 2;
        }
    }
};
</script>

<style scoped>
.area {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 0 16px;
    background: #fff;
    height: calc(100% - 65px);
    overflow: hidden;
}
.scroll_wrap {
    background: #fff;
    overflow: auto;
}
.title {
    color: #aaa;
    padding: 15px 0;
}
.hot_city {
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.hot_city li {
    width: 30%;
    background: #f1f1f1;
    margin: 0 10px 10px 0;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
}
.city_content li {
    padding: 10px;
    border-bottom: 1px solid #eee;
}
.area_keys {
    position: fixed;
    right: 0;
    top: 25%;
    color: #aaa;
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
    padding: 0 5px;
}
.selectKeyStyle {
    background: #000;
    opacity: 0.4;
    border-radius: 50%;
}
</style>
