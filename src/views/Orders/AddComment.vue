<template>
    <div class="add-comment">
        <Header title="添加评论" :isLeft="true" />
        <div class="comment">
            <!-- 对骑手评价 -->
            <div class="rider-comment"></div>
            <!-- 对商家评价 -->
            <div class="seller-comment"></div>
            <!-- 确认评价 -->
            <button class="comment-btn">{{ commentTips }}</button>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header'

export default {
    name: 'AddComment',
    data() {
        return {
            order: null,
            commentTips: '请评价配送满意度'
        }
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.order = to.params;
        })
    },
    components: {
        Header
    }
}
</script>

<style scoped>
.add-comment {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    padding-top: 45px;
}
</style>>