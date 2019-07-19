<template>
    <view class="uni-icon margin5px" :class="['uni-icon-'+type]" :style="{color:color,'font-size':  fontSize}" @click="onClick()"></view>
</template>

<script>
    export default {
        props: {
            /**
             * 图标类型
             */
            type: String,
            /**
             * 图标颜色
             */
            color: String,
            /**
             * 图标大小
             */
            size: String
        },
        computed: {
            fontSize() {
                return this.size
            }
        },
        methods: {
            onClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
    @import "./icon.css";
	.margin5px{
		margin: 5px;
	}
</style>
