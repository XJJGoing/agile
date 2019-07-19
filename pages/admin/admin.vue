<template>
	<scroll-view class="all" scroll-y="true">
		
		<view class="userDetail">
				<text id="title">项目负责人:</text>
				<block v-if="userList1.length!=0">
				<view v-for="(item,index) in userList1" :key="index" class="eachOne">
					<view :id="JSON.stringify({userId:item.id,roleId:1})" @click="changeUserRole">
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
				 <view :id="JSON.stringify({userId:item.id,roleId:2})" @click="changeUserRole">
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
				  <view :id="JSON.stringify({userId:item.id,roleId:3})" @click="changeUserRole">
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
					roleId:"" ,         //用户的权限  1权限获取本项目的所有的工程师和Boss 0权限没有这个功能不用考虑
					
					allUserProjectRole:[],   //存放着获取到的所有的用户项目权限信息
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
				
				
				//1权限用户的查询
				getAllUserProjectRole1:function(){
					_this = this;
					Query.findUserProjectRoleByProjectId(_this.projectId)
					.then(data=>{
						console.log("1权限用户查询到的",data.data.records);
						   let allUser = data.data.records;
						   _this.allUserProjectRole = allUser;
						   let userList1 = [];
						   let userList2 = [];
						   let userList3 = [];
						   allUser.forEach((item,index)=>{
							  switch (item.roleId){
							  	case 1:
									Query.findUser({id:item.userId})
									.then(data=>{
										userList1.push(data.data.records[0]);
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
										userList2.push(data.data.records[0]);
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
										userList3.push(data.data.records[0]);
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
						    })
						   _this.userList1 = userList1; 
						   _this.userList2 = userList2;
						   _this.userList3 = userList3;
						})
				 },
				 
				 //改变用户的权限,并且将选择的用户的userId和对应的权限传递到改变的页面
				 changeUserRole:function(e){
					 let roleAndUserId = JSON.parse(e.currentTarget.id);
                     if(roleAndUserId.roleId!=1){ //跳转改变权限和授权的时候不允许1权限改变1权限
					 
					    //先根据选中的用户的UserId和项目的projectId寻找到这这条t_user_project_role的id供后面更新用户的权限用
					     for(var i in this.allUserProjectRole){
							 if(this.allUserProjectRole[i].userId===parseInt(roleAndUserId.userId)){
								 let id = this.allUserProjectRole[i].id;
								 roleAndUserId = {
									 ...roleAndUserId,
									 id
								 }
							 }
						 }
						 //console.log("跳转页面传递的参数",roleAndUserId)
						 uni.navigateTo({
							url:`../changeUserRole/changeUserRole?userId=${roleAndUserId.userId}&roleId=${roleAndUserId.roleId}&id=${roleAndUserId.id}`
						}) 
					 }
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
