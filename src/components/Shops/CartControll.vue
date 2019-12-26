<template>
    <div class="cartcontroll">
        <span class="cartbutton dec" v-if="food.count > 0" @click.stop="decreaseCount">
            <i class="fa fa-minus"></i>
        </span>
        <span class="cartcount" v-if="food.count > 0">{{food.count}}</span>
        <span class="cartbutton inc" @click.stop="increaseCount">
            <i class="fa fa-plus-circle"></i>
        </span>
    </div>
</template>

<script>
export default {
    name: 'CartControll',
    props: {
        food: Object
    },
    methods: {
        decreaseCount() {
            this.food.count--;
        },
        increaseCount() {
            this.food.count++;
        }
    }
};
</script>

<style scoped>
.cartcontroll {
    display: inline-flex;
    align-items: center;
}
.cartbutton {
    width: 18px;
    height: 18px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    position: relative;
}
.cartbutton i {
    display: block;
    color: rgb(35, 149, 255);
    position: absolute;
}
.dec {
    margin-bottom: 3px;
    border-radius: 50%;
    border: 1px solid rgb(35, 149, 255);
}
.dec i {
    font-size: 16px;
    top: 1.5px;
    left: 2.5px;
}
.inc i {
    font-size: 23px;
    bottom: -1.1px;
    left: 0.6px;
}

.cartcount {
    display: inline-block;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    vertical-align: middle;
    font-size: 0.128rem;
    width: 6.933333vw;
    overflow: hidden;
}
</style>
