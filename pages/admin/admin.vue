<template>
	<scroll-view class="all" scroll-y="true">
		
		<view class="userDetail">
				<text id="title">项目负责人:</text>
				<block v-if="userList1.length!=0">
				<view v-for="(item,index) in userList1" :key="index" class="eachOne">
					<view :id="item.id" @click="changeUserRole">
						<uni-card 
							:title="item.nickName" 
							:thumbnail="item.avatarUrl" 
						>
						</uni-card>
					</view>
				</view>
				</block>
			
				<text id="title">工程师:</text>
				<block v-if="userList2.length!=0">
				<view v-for="(item,index) in userList2" :key="index" class="eachOne">
				 <view :id="item.id" @click="changeUserRole">
					<uni-card 
						:title="item.nickName" 
						:thumbnail="item.avatarUrl" 
					>
						
					</uni-card>
				 </view>
				</view>
				</block>
			
				<text id="title">Boss:</text>
				<block v-if="userList3.length!=0">
				<view v-for="(item,index) in userList3" :key="index" class="eachOne">
				  <view :id="item.id" @click="changeUserRole">
					<uni-card 
						:title="item.nickName" 
						:thumbnail="item.avatarUrl" 
					>
					  	
					</uni-card>
				   </view>	
				</view>
				</block>
			
		</view>
		
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	import uniCard from "@/components/uni-card/uni-card.vue"
	const Login = new login();
	const Query = new query();
	var _this;
		export default {
			components: {uniCard},
			data() {
				return {
					userInfo:" ",
					projectId:" ",      //所在的项目的id
					userList1:[],       //项目负责人
					userList2:[],       //2全新用户表
					userList3:[],       //3权限用户表
					roleId:"" ,         //用户的权限  1权限获取本项目的所有的工程师和Boss 0权限没有这个功
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
										_this.roleId === 1;     //能进来这个页面肯定为项目的负责人，权限为1
										_this.getAllUserProjectRole1()
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
				
                //0权限用户的查询
				// getAllUserProjectRole0:function(){
				// 	_this = this;
				// 	Query.findAllUserProjectRole()
				// 	.then(data=>{
				// 	   console.log("获取到的所有",data.data.records);
				// 	   //对其进行分类
				// 	   let allUser = data.data.records;
				// 	   let userList1 = [];
				// 	   let userList2 = [];
				// 	   let userList3 = [];
				// 	   allUser.forEach((item,index)=>{
				// 		  switch (item.roleId){
				// 		  	case 1:
				// 			    userList1.push(item)
				// 		  		break;
				// 			case 2:
				// 				userList2.push(item)
				// 				break;
				// 			case 3:
				// 				userList3.push(item)
				// 		  	default:
				// 		  		break;
				// 		  }
				// 	   })
				// 	   _this.userList1 = userList1;
				// 	   _this.userList2 = userList2;
				// 	   _this.userList3 = userList3
				// 	})
				// },
				
				//1权限用户的查询
				getAllUserProjectRole1:function(){
					_this = this;
					Query.findUserProjectRoleByProjectId(_this.projectId)
					.then(data=>{
						console.log("1权限用户查询到的",data.data.records);
						 let allUser = data.data.records;
						   let userList1 = [];
						   let userList2 = [];
						   let userList3 = [];
						   allUser.forEach((item,index)=>{
							  switch (item.roleId){
							  	case 1:
									Query.findUser({id:item.userId})
									.then(data=>{
										console.log("查询到的1去权限用户",data.data);
										userList1.push(data.data);
									})
									.catch(error=>{
										uni.showToast({
											title: '获取失败',
											duration:1000,
											icon:'none'
										});
									})
							  		break;
								case 2:
									Query.findUser({id:item.userId})
									.then(data=>{
										console.log("查询到的2权限用户",data.data);
										userList2.push(data.data);
									})
									.catch(error=>{
										uni.showToast({
											title: '获取失败',
											duration:1000,
											icon:'none'
										});
									})
									break;
								case 3:
									Query.findUser({id:item.userId})
									.then(data=>{
										console.log("查询到的3权限用户",data.data);
										userList3.push(data.data);
									})
									.catch(error=>{
										uni.showToast({
											title: '获取失败',
											duration:1000,
											icon:'none'
										});
									})
							  	default:
							  		break;
							  };
							  _this.userList1 = userList1;
							  _this.userList2 = userList2;
							  _this.userList3 = userList3;
						   })
						   
						})
				 },
				 
				 //改变用户的权限
				 changeUserRole:function(e){
					 let userId = e.detail.id;
					 uni.navigateTo({
					 	url:`../changeUserRole/changeUserRole?userId=${userId}`
					 })
				 }
				
			  }
			}
</script>

<style>
.all{
	width: 100%;
	height: auto;
	overflow: scroll;
	background-color: #007AFF;
}
::-webkit-scrollbar{
	width: 2px;
	height: 6px;
}
#title{
	font-size:35upx;
	color: #F9FAF0;
	width: 100%;
	text-align: left;
	height: 50upx;
	line-height: 50upx;
	background-color: #F5A623;
	margin-top: 10upx;
}
.userDetail{
	height: auto;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}
.eachOne{
	height: 100upx;
	width: 100%;
	margin-top:10upx;
}
</style>
