<template>
	<scroll-view class="all" scroll-y="true">
		<view class="updateUserRole">
		  <view>
			  <text>权限:</text>
			  <picker  @change="rolePickerChange" :value="index" :range="roleArry" :style="{width:width+'px'}">
				  {{beChangeUserRoleId}}
			  </picker>
		  </view>
		  
		  <block v-if="beChangeUserRoleId===2">
			   <view>
				  <text>专业:</text>
				  <picker @change="departmentPickerChange" :value="index" :range="departmentArry" :style="{width:width+'px'}">
					 <block v-if="hadDepartment">
						 {{hadDepartment}}
					 </block>
					 <block v-else>
						 请选择
					 </block>
				  </picker>
			  </view>
			  
			  <view class="addNewDepartment">
				  <text>专业名:</text>
				  <input placeholder="请输入新增专业的名称(4个字以内)" @input="inputDeparment" :style="{width:inputWidth+'px'}"></input>
			  </view>
			  
			  <button @click="addDepartment" class="sureAddDepartment">确认新增</button>
		  </block>
		  
		  <button @click="submitChange" class="submit" >提交修改</button>
		  
		</view>
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	import {userProjectRoleUpdateBatch,
	        getAllDepartment,
			userProjectDepartmentAdd,
			userProjectDepartmentQuery,
			updateUserProjectDepartment,
			departmentAdd
			} from '../../static/utils/api.js';
	var _this;
	export default {
		data() {
			return {
			   pickerWidth:"",                         //picker的长度
			   inputWidth:"",                     			 
			   userInfo:" ",
			   projectId:"",
			   beChangeUserId:"",           //改变的权限的用户的id
			   beChangeUserRoleId:"",         //原本的用户的权限
			   beChangeUserProjectRoleId:"",  //t_user_project_role这张表中的id 用于更新权限用的
			   
			   roleArry:[2,3,4],          //可选的权限
			   departmentArry:[],         //存放目前所有专业的专业名称
			   isDisplay:false,          //是否显示新增专业的列表
			   newDepartment:"",         //输入新增的专业
			   allDepartmentArry:[],      //存放所有的专业的信息，包括专业的id、专业的名字。
			   
			    
			   hadDepartment:""         ,//查询到的用户已经有的专业
			   hadDepartmentId:""        ,//查询到的原本已经有的departmentId
			   hadUserProjectDepartmentId:""  ,//查询到原本已经有的t_user_project_department那张表的id用于更新用
			   
			   isHadUserProjectDepartment:false,    //判断这个用户之前有没有这个字段在t_user_project_department中
			}
		},
		onShow(){
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{
					let id = {
						id:res.data.id
					}
					Query.findUser(id)
					.then(data=>{
						   _this.userInfo = data.data;
						   uni.getStorage({
						  	 	key:"nowInProject",
						  	 	success:(res)=>{
						  	 		_this.projectId = res.data.projectId;
									_this.getAllDepartment();             //获取所有的专业
									_this.queryUserProjectDepartment();   //查询该用户目前的专业
						  	 	}
						  	 })	
						 })
				},
				fail:()=>{
					url:'../login/login'
				}
			})
		},
		
		onLoad(e){
			_this = this;
			let changeUserIdRoleId = e;
			_this.beChangeUserId = parseInt(changeUserIdRoleId.userId);
			_this.beChangeUserRoleId = parseInt(changeUserIdRoleId.roleId);
			_this.beChangeUserProjectRoleId = parseInt(changeUserIdRoleId.id);
			console.log(_this.beChangeUserId,_this.beChangeUserRoleId,_this.beChangeUserProjectRoleId)
		},
		
		methods: {	
			
			//获取系统的信息设置picker的长度
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.pickerWidth = parseInt(res.windowWidth)-60;
						_this.inputWidth = parseInt(res.windowWidth)-100;
					}
				})
			},
			
			//获取目前所有的专业名称存放到departmentArry中供选择,所有专业的信息放到allDepartmentArry中
			getAllDepartment:function(){
			   _this = this;
			   uni.request({
			   	 url:getAllDepartment,
				 method:"GET",
			   })
			   .then(data=>{
				   console.log("获取到的所有的专业",data[1].data.data);
				   let department = data[1].data.data;
				   _this.allDepartmentArry = department;
				   let arry = [];
				  for(var i in department){
					  arry.push(department[i].name)
				  }
				   _this.departmentArry = arry;
			    })
				.catch(error=>{
				uni.showToast({
					icon:"loading",
					title:"获取失败",
					duration:1000
				 })
			  })
			},
			
			
			//改变用户对应的projectId的权限
			updateUserRoleId:function(){
				let data = {
					    id:_this.beChangeUserProjectRoleId,
						userId:_this.beChangeUserId,
						roleId:_this.beChangeUserRoleId,
						projectId:_this.projectId
				};
				console.log("url",userProjectRoleUpdateBatch)
				console.log("提交修改权限的信息",data)
				_this = this; 
			    uni.request({
			    	url:userProjectRoleUpdateBatch,
					method:'POST',
					data:[{
						id:_this.beChangeUserProjectRoleId,
						userId:_this.beChangeUserId,
						roleId:_this.beChangeUserRoleId,
						projectId:_this.projectId
					}],
					dataType:'json'
			    })
				.then(data=>{ 
					console.log("更新成功",data)
					uni.hideLoading();
				})
			},
		
		    
		  //在t_user_project_department中增加projectId对应departmentId  
		  addUserDepartmentId:function(){
			  _this = this;
			  let data = {
				  userId:_this.beChangeUserId,
				  departmentId:_this.hadDepartmentId, 
				  projectId:_this.projectId
			  };
			  console.log("提交修改专业的信息",data)
			  uni.request({
			  	url:userProjectDepartmentAdd,
				method:"POST",
				data:{ 
					"departmentId": _this.hadDepartmentId,
					"projectId": _this.projectId,
				    "userId": _this.beChangeUserId
				},
				dataType:'json'
			  })
			  .then(data=>{
				 console.log("新增成功",data);
				 uni.hideLoading();
			  })
		  },
		  
		  //在已经有t_user_project_department的情况下进行修改
		  updateUserProjectDepartment:function(){
			  uni.showLoading({
			  	title:"修改中",
				success:()=>{
					uni.request({
						url:updateUserProjectDepartment,
						data:[{
							id:_this.hadUserProjectDepartmentId,
							userId:_this.beChangeUserId,
							project:_this.projectId,
							departmentId:_this.hadDepartmentId
						}],
						method:'POST',
						success:(data)=>{
							uni.hideLoading();
							console.log("存在信息，进行更新",data)
						}
					})
				 },
				 fail:()=>{
					 uni.showToast({
					 	title:"网络连接错误",
						duration:1000,
						icon:"loading"
					 })
				 }
			  })
		  },
		  
		  //查询t_user_project_department中用户的专业
		  queryUserProjectDepartment:function(){
			  _this = this;
			  uni.request({
			  	url:userProjectDepartmentQuery,
				data:{
				  userId:_this.beChangeUserId,
				  project:_this.projectId
				},
				dataType:'json',
				method:"POST"
			  })
			  .then(data=>{
				  console.log(data);
				  console.log("查找到的用户项目专业信息",data[1].data.data.records[0]);
				  let department = data[1].data.data.records[0];
				  if(department!=undefined){
					  _this.hadUserProjectDepartmentId = department.id;
					  _this.isHadUserProjectDepartment = true;
					  let departmentId = data[1].data.data.records[0].departmentId;
					 _this.hadDepartmentId = departmentId;
					 for(var i in _this.allDepartmentArry){
					 	 if(departmentId === _this.allDepartmentArry[i].id){
					 		  _this.hadDepartment = _this.allDepartmentArry[i].name
							  console.log(_this.hadDepartment)
					 	 }
					 }  
				  }else{
					  _this.hadDepartment = "";
					  _this.isHadUserProjectDepartment = false;
					  _this.hadUserProjectDepartmentId = "";
				  }
				 
			  })
		  },
		  
		  
		  
		  //提交更改的时候
		  submitChange:function(){
			  _this = this;
			  if(_this.hadDepartmentId){
				 uni.showLoading({
				 	 title:"提交中",
				 	 success:()=>{
				 		   if(_this.isHadUserProjectDepartment){ //已经有的字段，进行更新
							   _this.updateUserProjectDepartment();
						   }else{  //没有字段调用插入
						       console.log("进行字段的插入")
							   _this.addUserDepartmentId();
						   }
				 	 }
				 }) 
			  }
			  if(_this.beChangeUserRoleId){
				   uni.showLoading({
				  	 title:"提交中",
				  	 success:()=>{
				  		   _this.updateUserRoleId();  //改变roleId
				  	 }
				  }) 
			  }
			  else{
				 uni.showToast({
				 	duration:1000,
					icon:"none",
					title:"请完善信息"
				 })
			  }
		  },
		  
		   
		   //输入专业
		   inputDeparment:function(e){
			  let departName = e.detail.value;
			  let reg = /^[\u4e00-\u9fa5]+$/;    //匹配中文
			  if(reg.test(departName)){
				  this.newDepartment = departName;
			  }else{
				  uni.showToast({
				  	title:"信息有误",
					duration:1000,
					icon:"none"
				  })
			  }
			  
		   },
			 
		   //确认新增专业   ---
		   addDepartment:function(){
			   _this = this;
			   if(_this.newDepartment&&_this.newDepartment.length<=4){ 
	
				  //这里添加请求新增专业
				  uni.showLoading({
				  	title:"添加中",
				    success:()=>{ 
						 uni.request({
							url:departmentAdd,
						    method:"POST",
							data:{
								name:_this.newDepartment
							},
						    dataType:'josn'
						 })
						 .then(data=>{ //新增专业成功，在此调用获取所有专业的函数
							uni.hideLoading();
						    _this.getAllDepartment() 
						 })
						 .catch(error=>{
							uni.showToast({
								title:"添加失败",
								icon:"loading",
								duration:1000
							})
						 })
					}
				  })
			   }else{
				  uni.showToast({
				  	title:"请按照要求填入专业",
					duration:1000,
					icon:'none'
				  })
			   }
		   },
		   
		   //选择权限的改变
		   rolePickerChange:function(e){
			   let index = e.detail.value;
			   console.log("选中的roleId",this.roleArry[index]);
			   this.beChangeUserRoleId = this.roleArry[index]
		   },
		   
		   //专业改变的时候
		   departmentPickerChange:function(e){
			   let index = e.detail.value;
			   console.log("选中的department名字",this.departmentArry[index]);
			   this.hadDepartment = this.departmentArry[index];
			   for(var i in this.allDepartmentArry){
				   if(this.departmentArry[index] === this.allDepartmentArry[i].name){
					   this.hadDepartmentId = this.allDepartmentArry[i].id;
				   }
			   }
			   console.log("选中的departmentId",this.hadDepartmentId)
			   
		   } 
	   }
	   
	}
</script>

<style>
.all{
	height: auto;
	overflow: scroll;
}
::-webkit-scrollbar{
	width: 2upx;
	height: 6upx;
}

.updateUserRole{
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.updateUserRole view{
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 10upx;
}
.updateUserRole view text{
	margin-left: 10upx;
	font-size: 30upx;
	font-weight: bold;
	color: #F0F8FF;
	width: 100upx;
}

.updateUserRole view picker{
	margin-left: 10upx;
	color: #F1F1F1;
}

.addNewDepartment{
	display: flex!important;
	flex-direction: row!important;
	margin-top: 15upx;
}

.addNewDepartment text{
	height: 100upx;
	font-size: 30upx;
	width: 200upx;
	line-height: 100upx;
	margin-left: 5upx;
}
.addNewDepartment input{
	margin-left: 10upx;
	height: 100upx;
	font-size: 30upx;
	color: #F0F8FF;
}
.sureAddDepartment{
	margin-top: 10upx;
	width:50%;
}
.submit{
	width: 90%;
	margin-top: 10upx;
}

</style>
