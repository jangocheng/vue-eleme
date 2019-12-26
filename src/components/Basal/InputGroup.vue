<template>
    <div class="text_group">
        <div
            class="input_group"
            :class="{
                'error-border': error,
                'green-border': greenBorder && !error
            }"
        >
            <!-- 输入框 -->
            <input
                @focus="greenBorder = true"
                @blur="greenBorder = false"
                :type="type"
                :value="value"
                :placeholder="placeholder"
                :name="name"
                @input="$emit('input', $event.target.value)"
            />
            <!-- 获取验证码按钮 -->
            <button v-if="btnTitle" :disabled="disabled" @click="$emit('btnClick')">{{ btnTitle }}</button>
        </div>
        <div v-if="error" class="error-tips">{{ error }}</div>
    </div>
</template>


<script>
export default {
    name: 'InputGroup',
    data() {
        return {
            greenBorder: false
        };
    },
    props: {
        type: {
            type: String,
            default: 'text'
        },
        value: String,
        placeholder: String,
        name: String,
        btnTitle: String,
        disabled: Boolean,
        error: String
    }
};
</script>
<style scoped>
.input_group {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    /* flex布局 */
    display: flex;
    /* 主轴为水平方向，起点在左端 */
    flex-direction: row;
    justify-content: space-between;
}
.input_group input {
    height: 100%;
    width: 60%;
    border: 0;
    outline: none;
}
.input_group button {
    border: none;
    outline: none;
    background: #fff;
}
.input_group button[disabled] {
    color: #aaa;
}
.error-tips {
    color: red;
    padding-top: 5px;
}
.error-border {
    border: 1px solid red;
}
.green-border {
    border: 1px solid #0089dc;
}
</style>
