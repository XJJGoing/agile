<template>
   <scroll-view class="people" 
                scroll-y="true"
	>
	 <view class="peopleInfo">
	   <view class="title">
			   <image :src="userInfo.avatarUrl"/>
			   <text>{{userInfo.trueName}}</text>
			   <text id="roleName" >{{roleName}}</text>
			   <view class="hr"></view>
			   <block v-if="roleId===2">
			     <text id="department">{{departmentName}}</text>
			   </block>
	   </view>
	  
	  <view class="function">
		       <block v-if="roleId==0">
				  <i-cell i-class="item" title="项目审核" is-link url="/pages/reviewProject/reviewProject"></i-cell>
				  <form report-submit="true" @submit="addMyFormId">
				  	 <button form-type="submit" class="submitBtn">增加formId</button>  
				  </form>
			   </block>
			    <block v-if="roleId==1">
			   	  <i-cell i-class="item" title="任务审核" is-link url="/pages/reviewTask/reviewTask"></i-cell>
			   	  <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   	  <i-cell i-class="item" title="用户管理" is-link url="/pages/admin/admin"></i-cell>
				  <form report-submit="true" @submit="addMyFormId">
					  <button form-type="submit" class="submitBtn">增加formId</button>
				  </form>
			    </block>
			   <block v-if="roleId==2">
				 <i-cell i-class="item" title="新建任务" is-link url="/pages/addTask/addTask"></i-cell>
				 <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   </block>
				 <i-cell i-class="item" title="关于" is-link url="/pages/about/about"></i-cell>
                 <i-cell i-class="item" title="退出"  @click="logout"></i-cell>
	   </view> 
	 </view>
	 
   </scroll-view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue";
	import {getAllRole,userProjectDepartmentQuery,departmentQuery} from "../../static/utils/api.js";
	
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	const Login = new login();
	
	import {addFormId} from"../../static/utils/utils.js";
	var _this;
	export default {
		components: {uniCard},
		data() {
			return {
				userInfo:{},
			    roleId:"",
				projectId:"",
				isRoot:"" ,         //特别设置的超级权限用户.
				roleName:"",        //权限对应的名称
				allRole:[]         ,//存放获取到的所有的专业
				
				departmentName:"",   //用户专业的名称
			}
		},

		//进行登录的更新
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
				   //console.log("返回的用户的信息",data.data.records[0]) 
				   _this.userInfo = data.data.records[0];
				   let isRoot =  data.data.records[0].isRoot;
				   if(isRoot){
					   _this.roleId = 0;
					   _this.roleName = "管理员"
				   }else{
					   uni.getStorage({
					   	key:"nowInProject",
						success:(res)=>{
			 				//设置普通权限并且,获取对应权限用户权限的名称和专业名称
							_this.projectId = res.data.projectId;
							_this.roleId = res.data.roleId;
							_this.getRoleName();
							if(_this.roleId ===2 ){
							  _this.getUserDepartmentId();	
							}
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
			
			//根据用户的projectId以及用户的userId查找专业
			getUserDepartmentId:function(){
				_this = this;
				uni.request({
					url:userProjectDepartmentQuery,
					method:"POST",
					data:{
						projectId:_this.projectId,
						userId:_this.userInfo.id
					},
					dataType:'json'
				 })
				.then(data=>{
					uni.hideLoading();
					console.log(data)
					if(data[1].data.data.records[0]){
						_this.getUserDepartmentName(data[1].data.data.records[0].departmentId)
					}else{
						_this.departmentName = "";
					}
				})
				.catch(Error=>{
					uni.showToast({
						title:"网络错误",
						icon:"none",
						duration:1000
					})
				})
			},
			
			//根据专业的id进行查询专业的名称
			getUserDepartmentName:function(departmentId){
				uni.request({
					  url:departmentQuery,
					  method:"POST",
					  data:{
						id:departmentId 
					  },
					  dataType:'json'
				})
				.then(data=>{ 
					   uni.hideLoading()
					   _this.departmentName = data[1].data.data.records[0].departmentName
				})
				.catch(Error=>{
					   uni.showToast({
						 title:"网络错误",
						 duration:1000,
						 icon:"none"
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
			},
			
			//向服务器增加自己的formId
			addMyFormId:function(e){
				_this = this;
				addFormId(_this.userInfo.openId,e.detail.formId);
			}
			
		}
	}
</script>

<style>
.people{
	height: auto;
	width: 100%;
	overflow: scroll;
}

::-webkit-scrollbar{
	width:2upx;
	height:6upx;
}

.peopleInfo{
	width: 100%;
}

.title{
	height: 270upx;
	width:100%;
	display: flex;
	flex-direction: row;
	padding: 20upx;
	border: 1upx solid #FEFEFE;
	border-radius:2%;
	position: relative;
}
.title image{
	width: 150upx;
	height: 150upx;
	margin-top: 20upx;
}
.title text{
	font-size: 30upx;
	margin-left: 40upx;
	color: #F0F8FF;
	margin-top: 60upx;
}
#roleName{
	position: absolute;
	right: 100upx;
	font-size: 35upx;
	color: #C0C0C0!important;
}
.hr{
	position: absolute;
	top:230upx;
	left: 0upx; 
	width: 100%;
	border: 1upx solid #FFF5F2;
	height: 1upx;
}

#department{
	position: absolute;
	top: 200upx!important;
	left: 10upx;
	color:#C0C0C0!important;
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
	background-color: none;
	border-radius: 2%;
}
.submitBtn{
	width: 100%;
	height: 75upx;
	line-height: 75upx;
	margin-top:5upx;
	background-color: none;
	border-radius: 2%;  
	text-align: left;
	font-size:28upx;
}
</style>
