<template>
	<scroll-view class="all" scroll-y="true">
		
		<view class="userDetail">
				<text id="title">项目经理:</text>
				<block v-if="userList1.length!=0">
				<view v-for="(item,index) in userList1" :key="index" class="eachOne">
					<view :id="JSON.stringify({userId:item.id,roleId:1})" @click="changeUserRole">
						<uni-card 
							:title="item.trueName" 
							:thumbnail="item.avatarUrl" 
						>
						<view class="info">
							
						</view>
						</uni-card> 
					</view>
				</view>
				</block>
			
				<text id="title">工程师:</text>
				<block v-if="userList2.length!=0">
				<view v-for="(item,index) in userList2" :key="index" class="eachOne">
				 <view :id="JSON.stringify({userId:item.id,roleId:2})" @click="changeUserRole">
					<uni-card 
						:title="item.trueName" 
						:thumbnail="item.avatarUrl" 
					>
						<view class="info">
							<text>专业:{{item.departmentName}}</text>
						</view>
					</uni-card>
				 </view>
				</view>
				</block>
			
				<text id="title">Boss:</text>
				<block v-if="userList3.length!=0">
				<view v-for="(item,index) in userList3" :key="index" class="eachOne">
				  <view :id="JSON.stringify({userId:item.id,roleId:3})" @click="changeUserRole">
					<uni-card 
						:title="item.trueName" 
						:thumbnail="item.avatarUrl" 
					>
					  <view class="info">
						  
					  </view>	
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
	import uniCard from "@/components/uni-card/uni-card.vue";
	import {getAllDepartment} from '../../static/utils/api.js';
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
					userList2:[],       //2权限用户表
					userList3:[],       //3权限用户表
					roleId:"" ,         //用户的权限  1权限获取本项目的所有的工程师和Boss 0权限没有这个功能不用考虑
					
					allUserProjectRole:[],   //存放着获取到的所有的用户项目权限信息
					
					allDepartmentInfo:[]     //存放着所有专业的信息
				}
			},
			onShow(){
				_this = this;
				_this.getAllDepartment();     //获取所有专业
				uni.getStorage({
					key:"userInfo",
					success:(res)=>{
						let id = {
							id:res.data.id
						}
						Query.findUser(id)
						.then(data=>{
							   console.log(data)
							   _this.userInfo = data.data.records[0];
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
						   let item;       //中间量
						   allUser.forEach((item,index)=>{
							  switch (item.roleId){
							  	case 1:
									Query.findUser({id:item.userId})
									.then(data=>{
									  userList1.push(data.data.records[0])	
									})
									.catch(Error=>{
										console.log(Error)
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
										item = data.data.records[0];
										return Query.findUserProjectDepartmentByUserIdAndProjectId(data.data.records[0].id,_this.projectId)
									})
									.then(data=>{
									  let departmentId = data.data.records[0].departmentId;
									  for(var i = 0;i<_this.allDepartmentInfo.length;i++){
										  if(_this.allDepartmentInfo[i].id===departmentId){
											  item.departmentName = _this.allDepartmentInfo[i].departmentName
										  }
									  }
									  userList2.push(item);
									})
									.catch(Error=>{
										console.log(Error)
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
									.catch(Error=>{
										console.log(Error)
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
						 if(roleAndUserId.roleId===2){
							 uni.showModal({
							 	title:"提醒",
								content:"项目启动并且冲刺开始后请勿修改用户的专业和权限不然会造成数据紊乱后果自理",
								confirmText:"同意",
								confirmColor:"#19BE6B",
								cancelText:"不同意",
								cancelColor:"#DD524D",
								success:(res)=>{
									if(res.confirm){
									   uni.navigateTo({
									  	url:`../changeUserRole/changeUserRole?userId=${roleAndUserId.userId}&roleId=${roleAndUserId.roleId}&id=${roleAndUserId.id}`
									  }) 
									}else if(res.cancel){
										
									}
								}
							 })
						 }else{
							 uni.navigateTo({
								url:`../changeUserRole/changeUserRole?userId=${roleAndUserId.userId}&roleId=${roleAndUserId.roleId}&id=${roleAndUserId.id}`
							})  
						 }
					 }
				 },
				 
				 
				 //获取所有的专业
				 getAllDepartment:function(){
					 _this = this;
					 uni.showLoading({
					 	title:'获取中',
						 success:()=>{
							 uni.request({
							 	url:getAllDepartment,
								method:"GET"
							 })
							 .then(data=>{
								 console.log("获取到的所有的专业",data)
								 uni.hideLoading();
								 _this.allDepartmentInfo = data[1].data.data;
							 })
							 .catch(Error=>{
								uni.showToast({
									title:"网络错误",
									duration:500,
									icon:"loading"
								})
							 })
						  }
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
}
::-webkit-scrollbar{
	width: 2px;
	height: 6px;
}
.userDetail{
	height: auto;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}
#title{
	font-size:30upx;
	font-weight: 600;
	color: #F9FAF0;
	width: 100%;
	text-align: left;
	height: 50upx;
	line-height: 50upx;
	background-color: #05E0FC;
	margin-top: 10upx;
}
.eachOne{
	width: 100%;
	margin-top:10upx;
}
.info{
	display:flex;
	flex-direction: column;
	height: 50upx;
}
.info text{
	font-size: 30upx;
	margin-top: 10upx;
	margin-left: 5upx;
}
</style>
