<template>
    <div class="header" :class="{bgcBule: isBlue}">
        <!-- 左侧返回 -->
        <div class="header-button is-left" v-show="isLeft">
            <i class="fa fa-chevron-left"></i>
            <button @click="goBack">返回</button>
        </div>
        <!-- 中间标题 -->
        <h1 class="header-title">{{ title }}</h1>
    </div>
</template>

<script>
export default {
    name: 'EleHeader',
    props: {
        title: String,
        isLeft: {
            type: Boolean,
            default: false
        },
        back: {
            type: String,
            default: ''
        },
        isBlue: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pushName: this.back
        }
    },
    methods: {
        goBack() {
            if (this.pushName == '') {
                this.$router.go(-1);
            } else {
                if (this.pushName.indexOf('/') == 0) {
                    this.$router.push(this.pushName);
                } else {
                    this.$router.push('/' + this.pushName);
                }
            }
        }
    }
};
</script>

<style scoped>
.header {
    align-items: center;
    /* background-color: #009eef; */
    background-color: #fff;
    box-sizing: border-box;
    /* color: #fff; */
    color: #000;
    display: flex;
    font-size: 16px;
    height: 45px;
    line-height: 1;
    padding: 0 10px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
}
.bgcBule {
    background-color: #009eef !important;
    color: #fff !important;
}
.header-button button {
    background-color: transparent;
    border: 0;
    box-shadow: none;
    color: inherit;
    display: inline-block;
    padding: 0;
    font-size: inherit;
    outline: none;
}
.header-title {
    font-weight: 700;
    font-size: 18px;
    flex: 1;
}
.is-left {
    text-align: left;
}
.is-right {
    text-align: right;
}
</style>
