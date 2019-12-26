<template>
    <div class="Rating-gray">
        <i v-for="(item, index) in itemClasses" :key="index" class="fa" :class="item"></i>
    </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'fa-star';
const CLS_HALF = 'fa-star-half-o';
const CLS_OFF = 'fa-star-o';

export default {
    name: 'Rating',
    props: {
        rating: Number
    },
    computed: {
        itemClasses() {
            const result = [];
            const integer = Math.floor(this.rating);
            const decimal = this.rating - integer >= 0.5;
            for (let i = 0; i < integer; i++) {
                result.push(CLS_ON);
            }
            if (decimal) {
                result.push(CLS_HALF);
            }
            while (result.length < LENGTH) {
                result.push(CLS_OFF);
            }
            // console.log(result)
            return result;
        }
    }
};
</script>

<style scoped>
.Rating-gray {
    margin-right: 1.066667vw;
    color: #ffbe00;
    display: inline-block;
}
</style>
