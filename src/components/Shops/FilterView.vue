<template>
    <div :class="{ open: isSort || isScreen }" @click.self="hideView" class="filterAll">
        <!-- 导航 -->
        <div v-if="filterData" class="filter_wrap">
            <aside class="filter">
                <div
                    class="filter-nav"
                    v-for="(item, index) in filterData.navTab"
                    :key="index"
                    :class="{ 'filter-bold': currentFilter == index }"
                    @click="filterSort(index)"
                >
                    <span>{{ item.name }}</span>
                    <i v-if="item.icon" :class="'fa fa-' + item.icon"></i>
                </div>
            </aside>
        </div>
        <!-- 排序 -->
        <section class="filter-extend" v-if="isSort">
            <ul>
                <li
                    v-for="(item, index) in filterData.sortBy"
                    :key="index"
                    @click="selectSort(item, index)"
                >
                    <span :class="{ selectName: currentSort == index }">{{ item.name }}</span>
                    <i class="fa fa-check" v-show="currentSort == index"></i>
                </li>
            </ul>
        </section>
        <!-- 筛选 -->
        <section class="filter-extend" v-if="isScreen">
            <div class="filter-sort">
                <div class="morefilter" v-for="(screen, index) in filterData.screenBy" :key="index">
                    <p class="title">{{ screen.title }}</p>
                    <ul>
                        <li
                            v-for="(item, i) in screen.data"
                            :key="i"
                            :class="{ selected: item.select }"
                            @click="selectScreen(item, screen)"
                        >
                            <img v-if="item.icon" :src="item.icon" alt />
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="morefilter-btn">
                <span @click="clearFliter" class="morefilter-clear" :class="{ edit: edit }">清空</span>
                <span @click="filterOk" class="morefilter-ok">确定</span>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'FilterView',
    data() {
        return {
            currentFilter: 0,
            isSort: false,
            currentSort: 0,
            isScreen: false
        };
    },
    props: {
        filterData: Object
    },
    computed: {
        edit() {
            // return true
            let edit = false;
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    if (item.select) edit = true;
                });
            });
            return edit;
        }
    },
    methods: {
        filterSort(index) {
            this.currentFilter = index;
            switch (index) {
                case 0:
                    this.isScreen = false;
                    this.isSort = true;
                    this.$emit('searchFixed', true);
                    break;
                case 1:
                    this.currentSort = 0;
                    this.filterData.navTab[0].name = '综合排序';
                    this.$emit('updata', {
                        condition: this.filterData.navTab[1].condition
                    });
                    this.hideView();
                    break;
                case 2:
                    this.currentSort = 0;
                    this.filterData.navTab[0].name = '综合排序';
                    this.$emit('updata', {
                        condition: this.filterData.navTab[2].condition
                    });
                    this.hideView();
                    break;
                case 3:
                    this.isScreen = true;
                    this.isSort = false;
                    this.$emit('searchFixed', true);
                    break;
                default:
                    this.hideView();
                    break;
            }
        },
        hideView() {
            this.isSort = false;
            this.isScreen = false;
            this.$emit('searchFixed', false);
        },
        selectSort(item, index) {
            this.currentSort = index;
            this.filterData.navTab[0].name = item.name;
            // this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
            this.hideView();

            // 更新数据
            this.$emit('updata', { condition: item.code });
        },
        selectScreen(item, screen) {
            if (screen.id !== 'MPI') {
                // 单选
                screen.data.forEach(ele => {
                    ele.select = false;
                });
            }
            item.select = !item.select;
        },
        clearFliter() {
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    item.select = false;
                });
            });
        },
        filterOk() {
            const screenData = {
                MPI: '',
                offer: '',
                per: ''
            };
            let str = '';
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach((item, index) => {
                    if (item.select) {
                        if (screen.id !== 'MPI') {
                            // 单选
                            screenData[screen.id] = item.code;
                        } else {
                            // 多选
                            str += item.code + ',';
                            screenData[screen.id] = str;
                        }
                    }
                });
            });
            // console.log(str);
            this.$emit('updata', { condition: screenData });
            this.hideView();
        }
    }
};
</script>

<style scoped>
.filterAll {
    width: 100% !important;
}
/* 导航 */
.filter_wrap {
    background: #fff;
}
.filter {
    position: relative;
    border-bottom: 1px solid #ddd;
    line-height: 10.4vw;
    z-index: 10;
    height: 10.7vw;
    display: flex;
    justify-content: space-around;
}
.filter-nav {
    flex: 1;
    text-align: center;
    color: #666;
    font-size: 0.133rem;
}
.filter-nav i {
    width: 1.6vw;
    height: 0.8vw;
    margin-left: 1.3vw;
    margin-bottom: 0.5vw;
    fill: #333;
    will-change: transform;
}
.filter-bold {
    font-weight: 600;
    color: #009eef;
}
.open {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease-in-out;
    z-index: 9 !important;
}
/* 排序 */
.filter-extend {
    background-color: #fff;
    color: #333;
    padding-top: 2.1vw;
    font-size: 0.15rem;
    position: absolute;
    width: 100%;
    z-index: 8;
    left: 0;
    top: 41px;
}
.filter-extend li {
    position: relative;
    padding-left: 5.3vw;
    line-height: 10.7vw;
    overflow: hidden;
}
.fa-check {
    float: right;
    color: #009eef;
    margin-right: 3.7vw;
    line-height: 10.7vw;
}

.selectName {
    color: #009eef;
}
/* 筛选 */
.filter-sort {
    background: #fff;
    padding: 0 2.7vw;
    line-height: normal;
}
.morefilter {
    margin: 2.7vw 0;
    overflow: hidden;
}
.morefilter .title {
    margin-bottom: 2vw;
    color: #666;
    font-size: 0.12rem;
}
.morefilter ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 0.12rem;
}
.morefilter li {
    box-sizing: border-box;
    width: 30%;
    height: 9.3vw;
    line-height: 9.3vw;
    margin: 0.8vw 1%;
    background: #fafafa;
}
.morefilter li img {
    width: 3.5vw;
    height: 3.5vw;
    vertical-align: middle;
    margin-right: 0.8vw;
}
.morefilter li span {
    margin-left: 2%;
    vertical-align: middle;
}

.morefilter-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fafafa;
    box-shadow: 0 -0.3vw 0.5vw 0 #ededed;
    line-height: 11.5vw;
    box-sizing: border-box;
}
.morefilter-btn span {
    font-size: 0.132rem;
    text-align: center;
    text-decoration: none;
    flex: 1;
}
.morefilter-clear {
    color: #ddd;
    background: #fff;
}
.morefilter-ok {
    color: #fff;
    background: #00d762;
    border: 0.13vw solid #00d762;
}

.selected {
    color: #3190e8 !important;
    background-color: #edf5ff !important;
}

.edit {
    color: #333 !important;
}
</style>
