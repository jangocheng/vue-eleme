<template>
    <div class="setPwd">
        <Header :isLeft="true" title="修改密码" />
        <div class="input-group">
            <!-- 密码 -->
            <InputGroup
                class="pwdInp"
                :type="type"
                v-model="code_1"
                placeholder="密码"
                :error="errors.low"
            />
            <!-- 确认密码 -->
            <InputGroup
                class="pwdInp"
                :type="type"
                v-model="code_2"
                placeholder="确认密码"
                :error="errors.wor"
            />
            <!-- 修改 -->
            <div class="pwd_btn">
                <button :disabled="disabled" @click="toChange">确认修改</button>
            </div>
            <i class="fa fa-check" :style="{ display: 'none' }"></i>
            <i class="fa fa-times" :style="{ display: 'none' }"></i>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Basal/Header';
import InputGroup from '../../components/Basal/InputGroup';
import { Toast } from 'mint-ui';

export default {
    name: 'SetPwd',
    data() {
        return {
            type: 'password',
            errors: {},
            code_1: '',
            code_2: ''
        };
    },
    watch: {
        code_1(newVal) {
            if (!/^(\w){6,20}$/.test(newVal)) {
                this.errors.low = '请输入6-12位字母、数字和下划线';
            } else {
                this.errors.low = null;
            }
        },
        code_2(newVal) {
            if (newVal.length != 0 && this.code_1 != this.code_2) {
                this.errors.wor = '两此输入的密码不一致';
            } else {
                this.errors.wor = null;
            }
        }
    },
    computed: {
        disabled() {
            if (
                this.code_1 &&
                this.code_2 &&
                this.code_2 == this.code_1 &&
                !this.errors.wor &&
                !this.errors.low
            ) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        toChange() {
            const user_id = this.$store.getters.userInfo._id;
            if (this.$store.getters.userInfo.password == this.code_2) {
                Toast({
                    message: '与原密码相同',
                    iconClass: 'fa fa-times',
                    position: 'middle'
                });
                return;
            }
            this.$axios
                .post(`/api/user/change_pwd/${user_id}`, {
                    password: this.code_2
                })
                .then(res => {
                    console.log(res.data);
                    Toast({
                        message: '操作成功',
                        iconClass: 'fa fa-check',
                        position: 'middle',
                        duration: 2000
                    });
                    // vuex更新个人信息
                    this.$store.dispatch('setUserInfo', res.data.user);
                    setTimeout(() => {
                        this.$router.push('/personalInfo');
                    }, 1000);
                })
                .catch(err => {
                    Toast({
                        message: '操作失败',
                        iconClass: 'fa fa-times',
                        position: 'middle'
                    });
                    console.log(err);
                });
        }
    },
    components: {
        Header,
        InputGroup
    }
};
</script>

<style scoped>
.setPwd {
    width: 100%;
    height: calc(100% - 45px);
    background: #fff;
    overflow: hidden;
}
.input-group {
    width: 80%;
    margin-top: 1rem;
    margin-left: 10%;
}
.pwdInp {
    margin: 0.25rem 0;
}
.pwd_btn {
    margin-top: 0.2rem;
}
.pwd_btn button {
    width: 100%;
    height: 0.4rem;
    background-color: #009eef;
    border-radius: 0.04rem;
    color: white;
    font-size: 0.14rem;
    border: none;
    outline: none;
}
.pwd_btn button[disabled] {
    background-color: #7fccf3;
}
</style>
