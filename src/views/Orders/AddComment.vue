<template>
    <div class="add-comment">
        <Header title="添加评论" :isLeft="true" bgcC="#f6f6f6"/>
        <div class="comment">
            <!-- 对骑手评价 -->
            <div class="rider-comment">
                <div class="rider-info">
                    <div class="rider-head"></div>
                    <div class="rider-other">
                        <h4>
                            <span>王老三</span>
                            <strong>蜂鸟转送</strong>
                        </h4>
                        <h5>40分钟(13：27送达)</h5>
                    </div>
                </div>
                <div class="comment-rank">
                    <div class="comment-rank-ban">
                        <div></div>
                        <h4>非常差</h4>
                    </div>
                    <div class="comment-rank-general">
                        <div></div>
                        <h4>一般</h4>
                    </div>
                    <div class="comment-rank-good">
                        <div></div>
                        <h4>超赞</h4>
                    </div>
                </div>
            </div>
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
    background-color: #f6f6f6;
    padding-top: 45px;
}
.rider-comment {
    width: 94vw;
    height: 54vw;
    margin: 3vw;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 7px;
}
.rider-info {
    display: flex;
    justify-content: flex-start;
    padding-top: 3.112vw;
    margin: 3.112vw;
}
.rider-info .rider-head {
    width: 10.334vw;
    height: 10.334vw;
    background-image: url('../../assets/comment.png');
    background-size: 10.334vw;
    background-position: 0 0;
}
.rider-other {
    margin-left: 2.115vw;
    height: 10.334vw;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
.rider-other h4 {
    font-size: 0.19rem;
}
.rider-other h4 strong {
    font-size: 0.13rem;
    background: #009eef;
    color: #fff;
    border-radius: 2px;
    margin-left: 2vw;
    padding: 0 5px;
}
.comment-rank {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 5.333vw;
}
.comment-rank h4 {
    padding-top: 2.6667vw;
}
.comment-rank > div div {
    margin: 2.556vw;
    width: 15.233vw;
    height: 15.233vw;
    background-size: 15.233vw;
}
.comment-rank > div:nth-of-type(1) div {
    background-image: url('../../assets/bad.png');
    /* background-position: 0 -200px; */
}
.comment-rank > div:nth-of-type(2) div {
    background-image: url('../../assets/general.png');
    /* background-position: 0 -200px; */
}
.comment-rank > div:nth-of-type(3) div {
    background-image: url('../../assets/good.png');
    /* background-position: 0 -200px; */
}
</style>>