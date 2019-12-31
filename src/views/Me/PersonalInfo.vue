<template>
    <div class="personalInfo">
        <Header :isLeft="true" title="个人信息" back="me" />
        <div class="info" v-if="userInfo">
            <div class="head">
                <span>头像</span>
                <div class="head-img"></div>
                <i class="fa fa-angle-right"></i>
            </div>
            <div class="user">
                <span>用户名</span>
                <p>{{ userInfo._id }}</p>
                <i class="fa fa-angle-right"></i>
            </div>
            <div class="phone">
                <p>账号绑定</p>
                <div class="totol">
                    <i class="fa fa-mobile"></i>
                    <p>手机</p>
                    <span>{{ encryptPhone(userInfo.mobile) }}</span>
                    <i class="fa fa-angle-right"></i>
                </div>
            </div>
            <div class="safety">
                <p>安全设置</p>
                <div class="totol" @click="$router.push('/setPwd')">
                    <p>登陆密码</p>
                    <span>修改</span>
                    <i class="fa fa-angle-right"></i>
                </div>
            </div>
            <div class="loginOut">
                <button @click="handleLogout" class="loginOut-btn">退出登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';

export default {
    name: 'PersonalInfo',
    data() {
        return {
            userInfo: null
        };
    },
    created() {
        this.userInfo = this.$store.getters.userInfo;
        this.$showMsg('当前页面暂时仅开放修改密码', 'middle', 3000);
    },
    methods: {
        handleLogout() {
            localStorage.removeItem('ele_login');
            sessionStorage.removeItem('store');
            this.$router.push('/login');
        },
        encryptPhone(phone) {
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
    },
    components: {
        Header
    }
};
</script>

<style scoped>
.personalInfo {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* background-color: #fff; */
}
.info {
    box-sizing: border-box;
    margin-top: 45px;
    height: calc(100% - 45px);
}
/* 头像 */
.head {
    width: 100%;
    height: 21.33vw;
    display: flex;
    background-color: #fff;
}
.head span {
    font-size: 0.18rem;
    line-height: 21.33vw;
    color: #333;
    /* font-weight: bolder; */
    margin-left: 6.667vw;
}
.head .head-img {
    width: 16vw;
    height: 16vw;
    margin: 2.667vw 7vw 2.667vw auto;
    border-radius: 50%;
    background-image: url("../../assets/user_head.png");
    background-size: 16vw;
    background-position: 0px -16vw;
}
.head i {
    font-size: 6.667vw;
    line-height: 21.33vw;
    margin-right: 5.33vw;
}
/* 用户名 */
.user {
    width: 100%;
    height: 21.33vw;
    display: flex;
    background-color: #fff;
}
.user span {
    font-size: 4.8vw;
    line-height: 21.33vw;
    color: #333;
    /* font-weight: bolder; */
    margin-left: 6.667vw;
}
.user p {
    width: 20%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 7% 0 auto;
    line-height: 21.33vw;
}

.user i {
    font-size: 6.667vw;
    line-height: 21.33vw;
    margin-right: 5.33vw;
}
/* 手机 修改密码*/
.phone > p,
.safety > p {
    padding: 4vw 4.53vw;
    color: #999;
}
.totol {
    background-color: #fff;
    display: flex;
    height: 16vw;
}
.totol i:first-child {
    font-size: 0.3rem;
    color: #009eef;
    line-height: 16vw;
    padding-left: 6.667vw;
}
.totol p {
    font-size: 5.33vw;
    line-height: 16vw;
    padding-left: 5.33vw;
}
.totol span {
    font-size: 0.13rem;
    margin: 0 7% 0 auto;
    line-height: 16vw;
}
.totol i:last-child {
    font-size: 6.667vw;
    line-height: 16vw;
    margin-right: 5.33vw;
}
.safety span {
    font-size: 0.16rem;
    color: #009eef;
}
/* .head, .user, .phone, .safety {
    border-bottom: 1px solid #ccc;
} */
/* 退出登录 */
.loginOut-btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 3.73vw 0;
    margin: 5.33vw 0;
    color: #ff5339;
    border-radius: 0.8vw;
    font-size: 0.16rem;
    font-weight: 700;
    background-color: #fff;
}
</style>
