<template>
    <div class="seller" v-if="sellerInfo">
        <section>
            <img :src="sellerInfo.header_image" alt />
            <h3>{{ sellerInfo.title }}</h3>
            <div :class="{ allInfo: showInfo }">{{ sellerInfo.brand_intros[0].brief }}</div>
            <div @click="showInfo = !showInfo">
                <span v-if="!showInfo">查看品牌故事</span>
                <span v-else>收起</span>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'Seller',
    data() {
        return {
            sellerInfo: null,
            showInfo: false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$axios('/api/profile/seller').then(res => {
                // console.log(res.data);
                this.sellerInfo = res.data;
            });
        }
    }
};
</script>

<style scoped>
.seller section {
    margin-bottom: 2.666667vw;
    padding: 4.266667vw 4vw 4vw;
    font-size: 0.144rem;
    background-color: #fff;
    color: #666;
    border-bottom: 1px solid #eee;
}
section > img {
    width: 92vw;
    height: 52vw;
    margin-bottom: 4.266667vw;
}
section > h3 {
    color: #333;
    font-weight: 700;
    font-size: 0.16rem;
    margin-bottom: 1.066667vw;
}
section > div:first-of-type {
    height: 32px;
    line-height: 16px;
    font-size: 13px;
    overflow: hidden;
}
.allInfo {
    height: auto !important;
}

section > div:last-child {
    margin: 4vw 0 -4vw;
    text-align: center;
    font-size: 0.128rem;
    padding: 4vw 0;
}
</style>
