<template>
	<view>
		这是主页{{title}}
	    <button type="primary">这是主页</button>
	</view>
	 
</template>

<script>
	const {test} = require('../../static/utils/utils');
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
          test(11);
		},
		methods: {

		}
	}
</script>

<style>
</style>
