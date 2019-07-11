<template>
	<scroll-view scroll-y="true"
	             class="project"
	>
	
	<view class="chooseItem">
		<picker @change="bindPickerMyProject" :value="index1" :range="myProject">切换首页项目</picker>
		<picker @change="bindPickerLookProject" :value="index2" :range="myLookProject">可查看的项目</picker>
	</view>
	
	<view class="title">项目信息</view>
	<view class="projectInfo">
		 <view>
			 <text>项目名称:</text>
			 <input disabled="true" :value="nowProject.projectName"></input>
		 </view>
		 <view>
			 <text>项目目标:</text>
			 <input placeholder="填入项目的目标" :value="nowProject.projectTarget" @input="ftarget" :disabled="!isDisplay"></input>
		 </view>
		 <view>
			 <text>交付时间:</text>
			 <input placeholder="填入项目交付的时间" :value="nowProject.projectFinishTime"  @input="ffinishTime" :disabled="!isDisplay"></input>
		 </view>
		 <view>
			 <text>项目成果:</text>
			 <input placeholder="填入项目的成果" :value="nowProject.projectResult" @input="fresult" :disabled="!isDisplay"></input>
		 </view>
		 <view>
			 <text>项目管理:</text>
			 <input placeholder="填入项目的管理" :value="nowProject.projectManagement" @input="fmanagement" :disabled="!isDisplay"></input>
		 </view>
		 <view>
			 <text>冲刺个数:</text>
			 <input placeholder="填入项目冲刺的个数" :value="nowProject.projectSprintNum" @input="fprintNum" :disabled="!isDisplay"></input>
		 </view>
		 <view>
			 <text>项目成员:</text>
			 <input placeholder="填入项目的成员" :value="nowProject.projectPeople" @input="fpeople" :disabled="!isDisplay"></input>
		 </view>
	</view>
	
	<block v-if="roleId==1">
		 <view class="footer">
			 <block v-if="roleId==1&&isDisplay">
			   <button type="primary" @click="submit">提交</button>
			 </block>
			 <button type="primary">添加项目冲刺</button>
		 </view>
	 </block>
	 
	</scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	const Login = new login();
	
	import {projectQuery,userPojectRoleQuery} from '../../static/utils/api.js'
	var _this;
	export default {
		data() {
			return {
				userInfo:{},
				projectId:1,          //假数据根据 查看的casual去查找
                nowProject:{},				  //显示的项目
				isDisplay:true,             //是否显示按钮
				roleId:"",
				
				target:"",
				finishTime:"",
				result:"",
				management:"",
				sprintNum:"",
				people:"",
	                                  
				myProject:[],       //切换的项目,权限为 1 2的项目
				index1:"",
				myLookProject:[]   ,//切换项目，项目的权限为可查看的。	
				index2:"",
				
			}
		},
		
		//写好的页面加载的函数
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
					 _this.userInfo = data.data.records[0];
					 uni.getStorage({
						 key:"casualLookProjectId",
						 success:(res)=>{
							 _this.projectId = res.data;
							 _this.getProject();                 //或者当前项目的信息
							 _this.getUserProjectRole();        //所有的有关此用户的项目（1234权限）从用户权限关系表

						 },
						 fail:()=>{
						    uni.redirectTo({
						    	url:'../apply/apply'
						    })	 
						 }
					 })
				   })
				   .catch(error=>{
					   console.log(error)
				   })
				},
				fail:()=>{
					uni.redirectTo({
						url:'../login/login'
					})
				}
			})
		},
		
		
		//授权登录暂时使用
		// mounted(){
		// 	uni.getStorage({
		// 		key:"userInfo",
		// 		success:(res)=>{
		// 		  _this.userInfo = res.data;
		// 		  uni.getStorage({
		// 		  	key:'roleId',
		// 			success:(res)=>{
		// 				console.log(res.data)
		// 				_this.roleId = res.data
		// 			},
		// 			fail:()=>{
		// 				_this.roleId = ""
		// 			}
		// 		  })
		// 		},
		// 		fail:(error)=>{
		// 			console.log(error)
		// 			uni.redirectTo({
		// 				  url:'../login/login'
		// 			})
		// 		}
		// 	})
  //       },
		
		onLoad() {
			
		},
		
		methods: {
			//填写信息的函数
			ftarget:function(e){
				this.target = e.detail.value
			},
			ffinishTime:function(e){
				this.finishTime = e.detail.value
			},
			fresult:function(e){
				this.result = e.detail.value
			},
			fmanagement:function(e){
				this.management = e.detail.value
			},
			fsprintNum:function(e){
				this.sprintNum = e.detail.value
			},
			fpeople:function(e){
				this.people = e.detail.value
			},
			bindPickerMyProject:function(e){
				let index = e.detail.value;
				this.index1 = index;
				this.projectId = this.myProject[index].projectId;
				
				//这里进行数据的模拟模拟改变nowProject  
				this.nowProject = {
				  projectName:"我是模拟名字",
				  projectTarget:"我是模拟目标",
				  projectSprintNum:"我是模拟冲刺",
				  projectManagement:"我是模拟的项目管理",
				  projectPeople:"我是模拟的人数",
				  projectFinishTime:"我是模拟的完成时间",
				  projectResult:"我是模拟交付结果"
				}
				
				//根据实际的信息再次获取项目的数据
				//this.getProject();
				
			},
			bindPickerLookProject:function(e){
				let index = e.detail.value;
				this.index2 = index;
				this.projectId = this.myLookProject[index].projectId;
				
				//进行数据的模拟
				this.nowProject = {
				  projectName:"我是模拟名字2",
				  projectTarget:"我是模拟目标2",
				  projectSprintNum:"我是模拟冲刺2",
				  projectManagement:"我是模拟的项目管理2",
				  projectPeople:"我是模拟的人数2",
				  projectFinishTime:"我是模拟的完成时间2",
				  projectResult:"我是模拟交付结果2"
				}
				
				//再次获取项目的信息
				//this.getProject()
			},
			
           //显示查看的项目,并且判断项目的信息为空的时候可以实现填写项目的信息。
		   getProject:function(){
			   _this = this;
			   uni.request({
			   	url:projectQuery,
				method:"POST",
				data:{
					projectId:_this.projectId,
				    pageNum: 0,
                    pageSize: 1,
				 },
				 dataType:'json'
			   })
			   .then(data=>{                      //这里增加个people
				   let project = data[1].data.data.records[0];    //模拟增加个people
				   let projectPeople = "5人";
				   _this.nowProject = {
					   ...project,
					     projectPeople,
				   };
				   if(_this.nowProject.projectName&&_this.nowProject.projectTarget&&
				     _this.nowProject.projectFinishTime&&_this.nowProject.projectResult
					 &&_this.nowProject.projectManagement&&_this.nowProject.projectSprintNum&&_this.nowProject.projectPeople
					 ){
						 _this.isDisplay = false;
					  } 
			   })
		   },
		   
		   //查询权限项目的函数 ：根据权限来查找
		   queryProjectRole:function(data,callback){
			   uni.request({
			   	 url:userPojectRoleQuery,
				 data:data,
	             success:(res)=>{
					 callback(res.data)
				 },
				 fail:()=>{
					 uni.showToast({
					 	title:"网络连接错误",
						duration:1000,
						icon:"none"
					 })
				 }
			   })
		   },
		   
		   //获取用户的权限为将1 2 3权限的项目全部查找到再进行分类
		   getUserProjectRole:function(){
			   console.log("进入此函数")
			   _this = this;
			   let data1 = {
				   userId : _this.userInfo.id,    
			   }
			   let data = [{     //假数据
				   id:2,
				   roleId:1,
				   projectId:3,
		           userId:26
			   },{
				   	id:3,
				   	roleId:2,
				   	projectId:4,
				    userId:26
				},{
					id:4,
					roleId:3,
					projectId:5,
					userId:26	
				},{
					id:5,
					roleId:4,
					projectId:6,
					userId:26	
				}];
		      data.forEach((item,index)=>{
				 if(item.roleId===1||item.roleId===2){
					 _this.myProject.push(item.projectId)
				 }else if(item.roleId===3){
					 _this.myLookProject.push(item.projectId)
				 }  
			  })	
			  console.log(_this.myProject,"-------",_this.myLookProject)
			   
		   },
		   // //设置当前所在项目的用户的权限以及当前所在的项目
		   // setStorageRoleIdProjectId:function(){
			  //  Query.findUserProjectRole()
		   // }
		   
		   //提交项目的函数
		   submit:function(){
			   _this = this;
			   if(_this.target&&_this.sprintNum&&_this.management&&_this.people&&_this.finishTime&&_this.result){
				   
			   }else{
				   uni.showToast({
						title:"请完善信息",   
						icon:"none",
						duration:500
				   })
			   }
		   }
		   
		   
		   
		   
		}
	}
</script>

<style>
.project{
	width: 100%;
	height: auto;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
.chooseItem{
	display: flex;
	flex-direction:row;
	justify-content: space-around;
}
.chooseItem picker{
	height: 60upx;
	width: 200upx;
	font-size:28upx;
	background-color: #19BE6B;
	text-align: center;
	line-height: 60upx;
}
.title{
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size: 30upx;
	background-color: #F5A623;
	padding: 10upx;
	box-sizing: border-box;
}

.projectInfo{
	display: flex;
	flex-direction: column;
}
.projectInfo view{
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 80upx;
	width: 100%;
	padding: 20upx;
	margin-top: 3upx;
	background-color: #19BE6B;
}
.projectInfo view text{
  font-size:30upx;
}
.projectInfo view input{
	font-size:30upx;
	height: 60upx;
	border: 1px solid #F0F8FF;
	width: 500upx;
	margin-left: 5upx;
}
.footer{
	height: 200upx;
	display: flex;
	flex-direction: column;
	width: 100%;
}
.footer button{
	margin-top: 5upx;
	width: 80%;
	height: 80upx;
}
</style>
