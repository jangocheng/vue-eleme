<template>
    <div class="me">
        <!-- 头部信息 -->
        <div class="headInfo" @click="handlePush">
            <div class="head-profile">
                <p class="user-mobile" v-if="userInfo">{{ encryptPhone(userInfo.mobile) }}</p>
                <p v-else class="user-mobile">登录/注册</p>
                <p class="tips">
                    <span v-if="userInfo">在忙，也要记得敲代码呦~</span>
                    <span v-else>登录后享受更多特权</span>
                </p>
            </div>
            <div class="head-img"></div>
        </div>
        <!-- 优惠信息 -->
        <div class="discounts" @click="handleE" v-if="userInfo">
            <div class="vip-redpack">
                <div class="left">
                    <p>饿了么超级会员</p>
                    <div class="money">
                        <span>1</span>
                        <span>.0&nbsp;&nbsp;&nbsp;个奖励金</span>
                    </div>
                </div>
                <div class="right">
                    <span>立即使用</span>
                    <i class="fa fa-angle-right"></i>
                </div>
            </div>
            <div class="common-redpack"></div>
        </div>

        <!-- 我的地址等 -->
        <div v-if="userInfo">
            <div class="address-cell" v-for="(item, index) in toorBar" :key="index">
                <i :class="'fa fa-' + item.icon"></i>
                <div class="address-index" @click="handleE(item.event)">
                    <span>{{item.title}}</span>
                    <i class="fa fa-angle-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Me',
    data() {
        return {
            userInfo: '',
            toorBar: [
                {
                    icon: 'location-arrow',
                    title: '收货地址',
                    event: 'myAddress'
                },
                { icon: 'jpy', title: '我的红包', event: '' },
                { icon: 'github', title: 'GitHub', event: '' },
                { icon: 'qq', title: 'QQ', event: '' },
                { icon: 'weixin', title: '微信', event: '' }
            ]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handlePush() {
            if (this.userInfo) {
                this.$router.push('/personalInfo');
            } else {
                this.$router.push('/login');
            }
        },
        getData() {
            this.$axios(`/api/user/user_info/${localStorage.ele_login}`).then(
                res => {
                    // console.log(res.data);
                    this.userInfo = res.data;
                    this.$store.dispatch('setUserInfo', res.data);
                }
            );
        },
        encryptPhone(phone) {
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        },
        handleE(eName) {
            switch (eName) {
                case 'myAddress':
                    this.myAddress();
                    break;
                default:
                    this.$showMsg('暂未开放', 'middle', 1000)
                    break;
            }
        },
        myAddress() {
            if (this.userInfo.myAddress.length > 0) {
                this.$router.push('/myAddress');
            } else {
                this.$router.push({
                    name: 'addAddress',
                    params: {
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
                });
            }
        }
    }
};
</script>

<style scoped>
.me {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background-color: #fff;
}
.headInfo {
    display: flex;
    /* background-image: linear-gradient(90deg, #0af, #0085ff); */
    padding: 6.67vw 4vw;
    /* color: #fff; */
    align-items: center;
}
.head-img {
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 4vw;
    border: 2px solid rgb(247, 227, 190);
    border-radius: 50%;
    background-position: 0px 0px;
    background-size: 0.6rem;
    background-image: url("../../assets/2.png");
}
/* 优惠信息 */
.discounts {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin: 10px auto;
    color: rgb(100, 80, 43);
}
.vip-redpack {
    width: 88vw;
    height: 20vw;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    background: linear-gradient(
        to right,
        rgb(247, 227, 190) 0%,
        rgb(239, 200, 135) 100%
    );
}
.vip-redpack .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3vw;
    font-size: 0.13rem;
}
.vip-redpack .left p {
    font-size: 0.18rem;
    font-weight: 600;
}
.vip-redpack .left span:first-of-type {
    font-size: 0.25rem;
}
.vip-redpack .right {
    line-height: 20vw;
    padding-right: 3vw;
    font-size: 0.13rem;
}
.vip-redpack .right span {
    padding-right: 2vw;
}

.head-profile {
    overflow: hidden;
    margin-left: 4.8vw;
    flex-grow: 1;
}
.head-profile .user-mobile {
    max-width: 40vw;
    font-size: 0.27rem;
    margin-bottom: 2.13vw;
    font-weight: 700;
    display: flex;
    align-items: center;
}
.head-profile .tips {
    display: flex;
    align-items: center;
    font-size: 0.14rem;
    color: #ccc;
}

.address-cell {
    margin-top: 2.67vw;
    /* border-bottom: 1px solid #ddd; */
    font-size: 1rem;
    line-height: 4.53vw;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-left: 6.67vw;
    color: #333;
}
.address-cell > i {
    font-size: 0.208rem;
    color: rgb(74, 165, 240);
    margin-right: 2.67vw;
}
.address-index {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(235, 235, 235);
    width: 100%;
    padding: 3.73vw 2.67vw 3.73vw 0;
    align-content: center;
}
.address-index span {
    font-size: 0.16rem;
}
.address-index > i {
    font-size: 0.208rem;
    color: #ccc;
    padding-right: 5vw;
}
.loginOut-btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 3.73vw 0;
    margin: 5.3vw 0;
    color: #ff5339;
    border-radius: 0.8vw;
    font-size: 0.16rem;
    font-weight: 700;
    background-color: #fff;
    border: 0;
}
</style>
