<template>
    <div class="myAddress">
        <div class="header">
            <div class="header-button" @click="$router.push('/' + back)">
                <i class="fa fa-chevron-left"></i>
            </div>
            <h1 class="header-title">我的地址</h1>
            <!-- 新增收货地址 -->
            <div class="address-view-bottom" @click="addAddress">
                <span>新增地址</span>
            </div>
        </div>
        <!-- 显示收货地址 -->
        <AddressList :allAddress="allAddress" />
    </div>
</template>

<script>
import AddressList from '../../components/Basal/AddressList';

export default {
    name: 'MyAddress',
    data() {
        return {
            allAddress: [],
            selectIndex: 0
        };
    },
    beforeRouteEnter(to, from, next) {
        next(_ => {
            _.setLS(from.name);
            _.getData();
        });
    },
    computed: {
        back() {
            return localStorage.name;
        }
    },
    methods: {
        addAddress() {
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
        },
        getData() {
            this.$axios(`/api/user/user_info/${localStorage.ele_login}`).then(
                res => {
                    // console.log(res.data);
                    this.allAddress = res.data.myAddress;
                }
            );
        },
        handleEdit(address) {
            this.$router.push({
                name: 'addAddress',
                params: {
                    title: '编辑地址',
                    addressInfo: address
                }
            });
        },
        handleDelete(address, index) {
            this.$axios
                .delete(
                    `/api/user/address/${localStorage.ele_login}/${address._id}`
                )
                .then(res => {
                    this.allAddress.splice(index, 1);
                });
        },
        setAddressInfo(address, index) {
            this.selectIndex = index;
            this.$store.dispatch('setNowAddrInfo', address);
            this.$store.dispatch('setAddress', address.address);
            this.$router.push('/' + localStorage.name);
        },
        setLS(name) {
            switch (name) {
                case 'me':
                    localStorage.setItem('name', 'me');
                    break;
                case 'addAddress':
                    break;
                case 'settlement':
                    localStorage.setItem('name', 'settlement');
                    break;
                default:
                    break;
            }
        }
    },
    components: {
        AddressList
    }
};
</script>

<style scoped>
.myAddress {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
}
.header {
    display: flex;
    justify-content: space-between;
    height: 55px;
    line-height: 55px;
    box-sizing: border-box;
    padding: 0 3vw;
    font-size: 0.22rem;
}
.header .header-title {
    padding-left: 10vw;
}
.header .address-view-bottom {
    color: #13a8f8;
    font-size: 0.18rem;
}

/* .address-view {
    overflow-y: auto;
    padding-bottom: 13.866667vw;
}
.address-card {
    background-color: #fff;
    margin: 4vw 0 0 4vw;
    padding-bottom: 5vw;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    min-height: 18.133333vw;
}
.address-card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}
.address-card-title {
    font-size: 0.15rem;
    line-height: 1.2em;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 2vw;
}

.address-card-address {
    font-size: 0.17rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    overflow: hidden;
}
.address-card-address .tag {
    display: inline-block;
    position: relative;
    margin-right: 0.8vw;
    padding: 0.54vw;
    white-space: nowrap;
    border-radius: 0.133333vw;
    font-size: 0.16rem !important;
    line-height: 1em;
    font-weight: initial;
}
.address-card-address .tag.jia {
    color: #dd706b;
    border: 1px solid #f1cfce;
}
.address-card-address .tag.gongsi {
    color: #6e8cb0;
    border: 1px solid #c0d5ea;
}
.address-card-address .tag.xuexiao {
    color: #79975b;
    border: 1px solid #cddbc2;
}

.address-card-bottom {
    font-size: 0.17rem;
    font-weight: lighter;
} */

/* 编辑和删除 */
/* .address-card-edit {
    flex-basis: 13.066667vw;
    padding-right: 4vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.address-card-edit > i {
    color: #aaa;
    font-size: 0.192rem;
} */
</style>
