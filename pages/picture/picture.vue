<template>
	<scroll-view scroll-y="true" class="all">
		<view style="color: #32FBF0;">这是燃尽图部分</view>
    </scroll-view>
</template>

<script>
	const query = require('../../static/utils/utils').Query;
	const login = require('../../static/utils/utils').Login;
    const Login = new login();
	const Query = new query();
	var _this;
	export default {
		data() {
			return {
				userInfo:"",       //用户的信息
				projectId:"",      //项目的id
				sprintId:"",       //冲刺的id
				roleId:"",         //权限的id
				departmentId:""    //专业id 当用户的权限为2的时候默认进入自己的专业
			}
		},
		onShow(){
			_this = this;
			uni.getStorage({
				key:'userInfo',
				success:(res)=>{
					let id = {
						id:res.data.id
					}
					Query.findUser(id)
					.then(data=>{
						console.log("返回的用户信息",data.data.records[0])
						_this.userInfo = data.data.records[0];
						uni.getStorage({
							key:"nowInProject",
							success:(res)=>{
								_this.roleId = res.data.roleId;
								_this.projectId = res.data.projectId;
								uni.getStorage({
									key:'sprintId',
									success:(res)=>{
										_this.sprintId = res.data;
									}
								})
							},
						})
					})
					.catch(Error=>{
						uni.showToast({
							title:"网络错误",
							icon:"none",
							duration:1000
						})
					})
				},
				fail:()=>{
					uni.redirectTo({
						url:"../login/login"
					})
				}
			})
		},
		
		methods: {
			
			//当用户的权限为2的时候，默认进入该用户再该项目下该冲刺下的自己的专业
			
		}
	}
</script>

<style>
.all{
	height: auto;
	width: 100%;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}

</style>
