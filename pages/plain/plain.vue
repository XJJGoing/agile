<template>
	<view>
		<text>这是燃尽图</text>
	</view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	var _this;
		export default {
			data() {
				return {
					userInfo:"",
					
				}
			},
			onShow(){
				uni.getStorage({
					key:"userInfo",
					success:(res)=>{
						let id = {
							id:res.data.id
						}
						Query.findUser(id)
						.then(data=>{
							_this.userInfo = data.data.records[0];
						})
					}
				})
			},
			methods: {
				
			}
		}
</script>

<style>
 .class{
	 border: aliceblue;
 }
</style>
