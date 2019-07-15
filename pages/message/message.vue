<template>
	<scroll-view scroll-y="true" class="all">
		<view class="applyMessage">
			<text id="title">待审核的申请:</text>
			<view >
				
			</view>
		</view>
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	
	//引入查找申请记录的api
	import {roleApplyQuery} from '../../static/utils/api.js';
	
	const Login = new login();
	const Query = new query();
	var _this;
	export default {
		data() {
			return {
				userInfo:" ",  
				projectId:" ",
				roleId:" ",
				allNotAudited:[],     //存放所有的未审核的项目
			}
		},
		onShow(){
			_this = this;
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{
					let id = {
						id:res.data.id
					}
					Query.findUser(id)
					.then(data=>{
						//console.log(data)
						   _this.userInfo = data.data;
					       let isRoot;
						   uni.getStorage({
						  	 	key:"nowInProject",
						  	 	success:(res)=>{
						  	 		_this.projectId = res.data.projectId;
									_this.roleId === res.data.roleId;      //进行相关权限的获取
						  	 	}
						  	 })	
						 })
				},
				fail:()=>{
					url:'../login/login'
				}
			})
		},
		methods: {	
			
		 //当进入这个消息中心的未项目的负责人的时候根据projectId和state为0去查找
		 getNotAudited:function(){
			 _this = this;
			 uni.showLoading({
			 	title:'获取中',
				success:()=>{
					uni.request({
					url:roleApplyQuery,
					method:"POST",
					data:{
					  projectId:_this.projectId,
					  state:0
					 },
					 dataType:'json'
					})
					.then(data=>{
					  uni.hideLoading();
					  console.log("查询到的未审核的申请表",data)
					})
					.catch(error=>{
					  uni.hideLoading();
					  uni.showToast({
					  	title:"获取失败",
						icon:"none",
						duration:1000
					  })
					})	
				}
			 })
		 }, 
		 	
		}
	}
</script>

<style>
.all{
	height: auto;
	width: 100%;
	background-color: #007AFF;
	overflow-y: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
#title{
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size:30upx;
}
.applyMessage{
	display: flex;
	flex-direction: column;
	height: auto;
}

.applyMessage view{
	width: 100%;
	height: 100upx;
}

</style>
