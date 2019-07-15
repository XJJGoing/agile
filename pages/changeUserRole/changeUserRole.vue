<template>
	<scroll-view class="all" scroll-y="true">
		<view class="updateUserRole">
		  <view>
			  <text>权限:</text>
			  <picker  @change="rolePickerChange" :value="index" :range="roleArry" >
			    点击选择:{{displayRoleId}}
			  </picker>
		  </view>
		  
		   <view>
		      <text>专业:</text>
			  <picker @change="departmentPickerChange" :value="index" :range="departmentArry">
                点击选择:{{displayDepartmentName}}
              </picker>
		  </view>
		  
		  <view class="addNewDepartment">
			  <button @click="changeDisplay">新增专业:</button>
			  <block v-if="isDisplay">
				  <input placeholder="请输入专业的名称(4个字以内)" @input="inputDeparment"></input>
				  <button @click="addDepartment">确认新增</button>
			  </block>
		  </view>
		  
		  <button @click="submitChange" class="submit" >提交修改</button>
		  
		</view>
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	import {updateUserProjectRole,getAllDepartment} from '../../static/utils/api.js';
	var _this;
	export default {
		data() {
			return {
			   userInfo:" ",
			   projectId:"",
			   changeUserId:"",           //改变的权限的用户的id
			   roleArry:[2,3,4],          //可选的权限
			   departmentArry:[],         //存放目前所有专业的专业名称
			   isDisplay:false,          //是否显示新增专业的列表
			   newDepartment:"",         //输入新增的专业
			   allDepartmentArry:[],      //存放所有的专业的信息，包括专业的id、专业的名字。
			   chooseRole:"" ,             //选择改变的权限
			   chooseDepartmentId:"",     //选择改变的专业
			    
			   displayRoleId:"" ,          //用于显示的的roleId
			   displayDepartmentName:""    //用于显示的选中的专业的名称
			}
		},
		onShow(e){
			 // console.log(e)
		   //    let changeUserId = e.detail.id;
			// console.log("改变的用户的权限的userid",changeUserId);
			_this = this;
			_this.changeUserId = 27;
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{
					let id = {
						id:res.data.id
					}
					Query.findUser(id)
					.then(data=>{
						   _this.userInfo = data.data;
					       let isRoot;
						   uni.getStorage({
						  	 	key:"nowInProject",
						  	 	success:(res)=>{
						  	 		_this.projectId = res.data.projectId;
									_this.getAllDepartment();      //获取所有的专业
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
			//获取目前所有的专业存放到departmentArry中
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
			changeUserRoleId:function(){
				_this = this;
			    uni.request({
			    	url:updateUserProjectRole,
					data:{
						userId:_this.changeUserId,
						roleId:_this.newRole,
						projectId:_this.projectId
					}
			    })
				.then(data=>{
					console.log("更新成功",data)
					uni.hideLoading();
				})
			},
		
		    
		  //改变用户projectId对应departmentId  待完善
		  changeUserDepartmentId:function(){
			  _this = this;
			  uni.request({
			  	url:xxxxxxx,
				data:{
					userId:_this.changeUserId,
					departmentId:_this.chooseDepartmentId, 
					projectId:_this.projectId
				},
				dataType:'json',
				method:""
			  })
			  .then(data=>{
				 console.log("更新成功",data);
				 uni.hideLoading();
			  })
		  },
		  
		  //提交更改的时候
		  submitChange:function(){
			  _this = this;
			  if(_this.chooseRole&&_this.chooseDepartmentId){
				uni.showLoading({
					 title:"提交中",
					 success:()=>{
						   _this.changeUserId();    //改变role
						   _this.changeUserDepartmentId();  //改变department
					 }
				})
			  }else{
				 uni.showToast({
				 	duration:1000,
					icon:"none",
					title:"请完善信息"
				 })
			  }
		  },
		  
		  //是否显示新增专业的代码块
		   changeDisplay:function(){
				this.isDisplay = !this.isDisplay;
		   },
		   
		   //输入专业
		   inputDeparment:function(e){
			   console.log("输入的新增的专业",e.detail.value)
			   this.newDepartment = e.detail.value;
		   },
			 
		   //确认新增专业   ---
		   addDepartment:function(){
			   if(_this.inputDeparment){    //这里添加请求新增专业,待完善，完善对department的增删改查
				  
			   }
		   },
		   
		   //选择权限的改变
		   rolePickerChange:function(e){
			   let index = e.detail.value;
			   this.chooseRole = this.roleArry[index];
			   console.log("选中的roleId",this.chooseRole);
			   this.displayRoleId = this.chooseRole;
		   },
		   
		   //专业改变的时候
		   departmentPickerChange:function(e){
			   let index = e.detail.value;
			   console.log("选中的department名字",this.departmentArry[index]);
			   this.displayDepartmentName = this.departmentArry[index];
			   for(var i in this.allDepartmentArry){
				   if(this.departmentArry[index] === this.allDepartmentArry[i].name){
					   this.chooseDepartmentId = this.allDepartmentArry[i].id;
				   }
			   }
			   console.log("选中的departmentId",this.chooseDepartmentId)
			   
		   }
	   }
	   
	}
</script>

<style>
.all{
	height: auto;
	overflow: scroll;
	background-color: #007AFF;
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
	height: 100upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #19BE6B;
	margin-top: 10upx;
}
.updateUserRole view picker{
	height: 80upx;
	line-height: 80upx;
	border: 1px solid #19BE6B;
	width: 50%;
	margin-left: 10upx;
	background-color: #F5A623!important;
}

.addNewDepartment{
	display: flex!important;
	height: auto!important;
	flex-direction: column!important;
	justify-content: flex-start!important;
}

.addNewDepartment button{
	width: 300upx;
	height: 80upx;
	margin-left: 0upx;
	margin-top: 5upx;
}
.addNewDepartment input{
	margin-left: 0upx;
	width: 100%;
	margin-top: 4upx;
	font-size: 30upx;
	border: 1px solid #FCFBFF;
}
.submit{
	width: 100%;
	margin-top: 10upx;
}

</style>
