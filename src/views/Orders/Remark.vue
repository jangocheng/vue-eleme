<template>
    <div class="remark">
        <Header :isLeft="true" title="订单备注" />
        <!-- diy -->
        <div class="view-body">
            <section>
                <textarea placeholder="请填写对餐厅或骑手小哥的备注信息" v-model="remark.text" maxlength="100"></textarea>
                <div class="switch">
                    <span
                        @click="handleRadioItem(item)"
                        :class="{selected: item.select}"
                        v-for="(item, index) in remark.radioItem"
                        :key="index"
                        class="switch-item item-line"
                    >{{item.name}}</span>
                </div>
                <div class="switch" v-for="(item, index) in remark.switchItem" :key="index">
                    <span
                        :class="{selected: item.select}"
                        class="switch-item"
                        @click="item.select = !item.select"
                    >{{item.name}}</span>
                </div>
            </section>
            <button @click="submint" class="btn-submit">确定</button>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';

export default {
    name: 'Remark',
    data() {
        return {
            initRemark: {
                radioItem: [
                    { select: false, name: '不要辣' },
                    { select: false, name: '少点辣' },
                    { select: false, name: '多点辣' }
                ],
                switchItem: [
                    { select: false, name: '不要香菜' },
                    { select: false, name: '不要洋葱' },
                    { select: false, name: '多点醋' },
                    { select: false, name: '多点葱' }
                ],
                text: ''
            },
            remark: null
        };
    },
    created() {
        this.remark =
            this.$store.getters.remarkInfo.remark.radioItem.length > 0 &&
            this.$store.getters.remarkInfo.remark.switchItem.length > 0
                ? this.$store.getters.remarkInfo.remark
                : this.initRemark;
        // this.remark = this.initRemark;
    },
    methods: {
        handleRadioItem(item) {
            this.remark.radioItem.forEach(el => {
                el.select = false;
            });
            item.select = true;
        },
        submint() {
            let remarkToStr = '';
            this.remark.radioItem.forEach(el => {
                if (el.select) {
                    remarkToStr += el.name + ',';
                }
            });

            this.remark.switchItem.forEach(el => {
                if (el.select) {
                    remarkToStr += el.name + ',';
                }
            });
            remarkToStr += this.remark.text;
            this.$store.dispatch('setRemarkInfo', {
                tableware: this.$store.getters.remarkInfo.tableware,
                remark: {
                    radioItem: this.remark.radioItem,
                    switchItem: this.remark.switchItem,
                    text: this.remark.text,
                    remarkToStr: remarkToStr
                }
            });
            this.$router.go(-1);
        }
    },
    components: {
        Header
    }
};
</script>

<style scoped>
.remark {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 45px;
}

.view-body {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    font-size: 0.128rem;
    color: #333;
}
.view-body section {
    margin-top: 2.133333vw;
    padding: 4.266667vw;
    background-color: #fff;
    margin-bottom: 2.133333vw;
}
.view-body section textarea {
    width: 100%;
    height: 29.866667vw;
    margin-bottom: 4.266667vw;
    padding: 4.266667vw;
    border: 1px solid #ccc;
    border-radius: 0.666667vw;
    background-color: #f9f9f9;
    color: #666;
    resize: none;
    box-sizing: border-box;
    outline: none;
}
.switch {
    display: inline-block;
    margin: 0 2.666667vw 2.666667vw 0;
    border: 1px solid #ddd;
    overflow: hidden;
    border-radius: 1.066667vw;
}
.switch-item {
    display: inline-block;
    padding: 0 2.133333vw;
    height: 8vw;
    line-height: 8vw;
    text-align: center;
    color: #666;
}
.item-line::after {
    content: " ";
    display: inline-block;
    height: 4vw;
    width: 1px;
    background: #ddd;
    line-height: 8vw;
    vertical-align: middle;
    left: 2.266667vw;
    position: relative;
}
.btn-submit {
    display: block;
    padding: 3.466667vw 0;
    color: #fff;
    background-color: #00e067;
    border-radius: 0.533333vw;
    opacity: 0.98;
    width: 92vw;
    margin: 3.133333vw auto 0;
    font-size: 0.16rem;
    border: none;
    outline: none;
}

/* 选中样式 */
.switch-item.selected {
    background: #0186ff;
    color: #fff;
    position: relative;
}
</style>
