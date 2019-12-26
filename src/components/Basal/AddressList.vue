<template>
    <div class="address-view">
        <div class="address-card" v-for="(address, index) in allAddress" :key="index">
            <div class="address-card-body" @click="setAddressInfo(address, index)">
                <p class="address-card-address">
                    <span class="address-text">{{ address.address.slice(0,6) }}. . .</span>
                    <span
                        class="tag"
                        :class="{jia: address.tag == '家', xuexiao: address.tag == '学校', gongsi: address.tag == '公司' }"
                        v-if="address.tag"
                    >{{ address.tag }}</span>
                </p>
                <p class="address-card-bottom">
                    <span>{{ address.bottom }}</span>
                </p>
                <p class="address-card-title">
                    <span
                        class="users"
                    >{{ address.name }}({{ address.sex }})&nbsp;&nbsp;&nbsp;{{ address.phone.slice(0,4) }}****{{ address.phone.slice(7) }}</span>
                </p>
            </div>
            <div class="address-card-edit">
                <i @click.self="handleEdit(address)" class="fa fa-edit"></i>
                <i @click.self="handleDelete(address, index)" class="fa fa-close"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddressList',
    props: {
        allAddress: Array
    },
    methods: {
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
        }
    }
};
</script>

<style scoped>
.address-view {
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
}

/* 编辑和删除 */
.address-card-edit {
    flex-basis: 13.066667vw;
    padding-right: 4vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.address-card-edit > i {
    color: #aaa;
    font-size: 0.192rem;
}
</style>
