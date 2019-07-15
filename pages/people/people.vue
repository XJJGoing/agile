<template>
   <scroll-view class="people" 
                scroll-y="true"
	>
	 <view class="peopleInfo">
	   <view class="title">
			   <image :src="userInfo.avatarUrl"/>
			   <text>{{userInfo.nickName}}</text>
			   <text id="roleName" >{{roleName}}</text>
	   </view>
	  <view class="function">
		       <block v-if="roleId==0">
				  <i-cell i-class="item" title="项目审核" is-link url="/pages/reviewProject/reviewProject"></i-cell>
			   </block>
			    <block v-if="roleId==1">
			   	  <i-cell i-class="item" title="任务审核" is-link url="/pages/reviewTask/reviewTask"></i-cell>
			   	  <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   	  <i-cell i-class="item" title="用户管理" is-link url="/pages/admin/admin"></i-cell>
			   </block>
			   <block v-if="roleId==2">
				 <i-cell i-class="item" title="新建任务" is-link url="/pages/addTask/addTask"></i-cell>
				 <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   </block>  
                <i-cell i-class="item" title="退出"  @click="logout"></i-cell>
	   </view> 
	 </view>
	 
   </scroll-view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue";
	import icard from "../../static/dist/card/index.js";
	import {getAllRole} from "../../static/utils/api.js";
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	const Login = new login();
	
	var _this;
	export default {
		components: {uniCard,icard},
		data() {
			return {
				userInfo:{},
			    roleId:"",
				isRoot:"" ,         //特别设置的超级权限用户.
				roleName:"",        //权限对应的名称
				allRole:[]         //存放获取到的所有的专业
			}
		},

		// //进行登录的更新
		onShow(){
		  _this = this
		  wx.getStorage({
		  	key:"userInfo",
			success:(res)=>{
			   let id = {
				   id:res.data.id
			   }
			   Query.findUser(id)
			   .then(data=>{
				   console.log("返回的用户的信息",data.data) 
				   _this.userInfo = data.data;
				   let isRoot = data.data.isRoot;
				   if(isRoot){
					   _this.roleId = 0;
					   _this.roleName = "超级用户"
				   }else{
					   uni.getStorage({
					   	key:"nowInProject",
						success:(res)=>{
			 				console.log("设置普通的权限",res.data.roleId)
							_this.roleId = res.data.roleId;
							 //获取对应权限用户权限的名字。
							_this.getRoleName();
						 }  
					   })
				   }
			   })
			},
			fail:()=>{
			  uni.redirectTo({
			  	url:'../login/login'
			  })
			}
		  })
		},
		
		methods: {
			//获取对应权限的名称
			getRoleName:function(){
				_this = this;
				uni.request({
					url:getAllRole,
					method:'GET',
					dataType:'json'
				})
				.then(data=>{
					//根据查询到的权限的名臣对roleName进行赋值
					let allRole = data[1].data.data;
					_this.allRole = allRole;
					allRole.forEach((item,index)=>{
						if(item.id === _this.roleId){ 
							_this.roleName = item.name;
						}
					});
				})
				.catch(error=>{
					uni.showToast({
						icon:"none",
						duration:1000,
						title:"获取失败"
					})
				})
			},
			
			//退出登录
			logout:function(){
			   uni.removeStorage({
			   	 key:'userInfo',
				 success:()=>{
					uni.redirectTo({
						url:'../login/login'
					})
				 }
			   })
			}
		}
	}
</script>

<style>
.people{
	height: auto;
	width: 100%;
	overflow: scroll;
	background-color: #007AFF;
}

::-webkit-scrollbar{
	width:2upx;
	height:6upx;
}

.peopleInfo{
	height: 1000upx;
	width: 100%;
	background-color: #19BE6B;
}

.title{
	width:100%;
	height: 200upx;
	background-color: #F5A623;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 20upx;
	border: 1px solid #007AFF;
	border-radius:3% ;
}
.title image{
	border: 1upx dotted #19BE6B;
	width: 150upx;
	height: 150upx;
}
.title text{
	font-size: 30upx;
	margin-left: 20upx;
}
#roleName{
	font-size: 40upx;
	margin-left: 250upx;
}

/*function部分*/
.function{
	width: 100%;
    display: flex;
	flex-direction: column;
}
.item{
	width: 100%;
	height: 30upx;
    margin-top:5upx;
	background-color: #19BE6B;
}
</style>
