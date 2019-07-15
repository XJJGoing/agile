<template>
	<view>
	  这是审核项目的页面	
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

</style>
