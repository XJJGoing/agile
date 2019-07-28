<template>
	<scroll-view class="all" scroll-y="true">
	<block v-if="sprintId">	
	 <form report-submit="true" @submit="submitAddTask">
		<view class="addTask">
			<text id="title">新增任务:</text>
			<view>
				<text id="heading">标识号:</text>
				<input :style="{width:inputWidth+'px'}"  placeholder="真实姓的首字母大写(仅限一个)" @input="inputTaskOrder" :value="taskOrder"></input>
			</view>
			<view>
				<text id="heading">任务内容:</text>
				<input :style="{width:inputWidth+'px'}" placeholder="请输入任务的内容(20个字以内)" @input="inputTaskName"></input>
			</view>
			<view>
				<text id="heading">优先级:</text>
				<picker :range="priority" :value="index" @change="pickerPriorityChange">
					<input :style="{width:inputWidth+'px'}" placeholder="点击选择" :value="taskPriority" disabled="true"></input>
				</picker>
			</view>
			<view>
				<text id="heading">预估工时</text>
				<input :style="{width:inputWidth+'px'}" placeholder="请输入预估工时(单位为小时)" :value="taskPredictTime" @input="inputTaskPredictTime"></input>
			</view>
			<view>
				<text id="heading">专业</text>
				<input :style="{width:inputWidth+'px'}" :value="departmentName" disabled="true"></input>
			</view>
			<view>
				<text id="heading">执行人</text> 
				<input :style="{width:inputWidth+'px'}" :value="userInfo.trueName" disabled="true"></input>
			</view>
			<view>
				<text id="heading">负责人</text>
				<input :style="{width:inputWidth+'px'}" :value="taskChargeUserName" disabled="true"></input>
			</view> 
			<button type="default" class="submit" form-type="submit">提交</button>
		</view>
	  </form>
	 </block>
	 <block v-else>
		 <view class="noSprintInfo">该项目下暂无冲刺</view>
	 </block>
	</scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	import {formatDate} from '../../static/utils/time.js'
	
	//引入api
	import {taskAdd,departmentQuery,taskQuery,messageSend,projectQuery} from '../../static/utils/api.js';
	var _this;
		export default {
			data() {
				return {
					inputWidth:"",           //输入框的长度
					
					userInfo:"",             
                    projectId:"",           //项目的id
					departmentId:"",       //专业的id
					taskExcuteUserId:"",    //执行人的id默认为该用户的id
					taskChargeUserId:"",    //该项目的负责人的id,默认为该项目的权限1的用户的id
					sprintId:true,            //冲刺的id
					workNote:"",            //任务的备注信息
					
					taskChargeUserName:"",   //该项目的负责人的名字
					taskPriority:"",        //项目的优先级（1、2、3、4）;
				    taskPredictTime:"",     //任务的预估时间
					taskOrder:"",           //任务的序号，默认为真实姓名的第一个字母开头,自动获取排序号
					taskName:"",            //任务的内容
					
					departmentName:"",      //专业的名称
					openId:"",             //项目负责人的openId
					projectName:"",       //项目的名称
				
					
					
				    priority:[1,2,3,4],      //优先级实现可以改变
					index:""                 //选择优先级的下标
				}
			},
			onLoad(){
				 this.getSystem();
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
							//console.log(data.data.records[0]);
							_this.userInfo = data.data.records[0];
							_this.taskExcuteUserId = _this.userInfo.id;
							//_this.taskChargeUserName = _this.userInfo.trueName;
	                        uni.getStorage({
	                        	key:"nowInProject",
								success:(res)=>{
					                _this.projectId = res.data.projectId;   //设置项目的id
									uni.getStorage({
										key:"sprintId",
										success:(res)=>{
											_this.sprintId = res.data;     //设置冲刺
											if(!_this.sprintId){  //没有冲刺  则显示暂无冲刺信息
												_this.sprintId = "";
											}else{
											  _this.getChargeUserId();
											  _this.getDepartmentId(); 
											  _this.findProjectNameByProjectId();	
											}
										},
										fail:()=>{
											_this.sprintId = "";
										}
									})
								},
								fail:()=>{
									uni.redirectTo({
										url:'../apply/apply'
									})
								}
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
				
			  //获取系统的信息设置输入框的长度,根据设置的左边的文字占的文字去计算
			  getSystem:function(){
				  _this = this;
				  uni.getSystemInfo({
				  	success:(res)=>{
						_this.inputWidth = parseInt(res.windowWidth)-80;
					}
				  })
			  },	
				
			  //寻找该项目下的权限为1的用户即项目的负责人
			  getChargeUserId:function(){
				  _this = this;
				  console.log("项目",_this.projectId)
				  uni.showLoading({
				  	title:"获取中",
					success:()=>{
						Query.findUserProjectRoleByRoleAndProject(1,_this.projectId)
						.then(data=>{
							uni.hideLoading();
							console.log("查询到的项目负责人的关系",data.data.records[0]);
							_this.taskChargeUserId = data.data.records[0].userId;
							_this.getChargeUserTrueName();
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:'loading'
							})
						})
					}
				  })
			  },
			  
			  //寻找该项目下项目负责人的真实姓名
			  getChargeUserTrueName:function(){
				_this = this;
				uni.showLoading({
				  	title:"获取中",
				  	success:()=>{
						let id = {
							id:_this.taskChargeUserId
						}
				  		Query.findUser(id)
				  		.then(data=>{
				  		    uni.hideLoading();
				  			//console.log(data)
				  			console.log("查询到的项目负责人的真实姓名",data.data.records[0].trueName);
				  			_this.taskChargeUserName = data.data.records[0].trueName;
							_this.openId = data.data.records[0].openId;
				  		})
				  		.catch(Error=>{
				  			uni.showToast({
				  				title:"网络错误",
				  				duration:1000,
				  				icon:'loading'
				  			})
				  		})
				    }
				})
			 },
			 
			 //获取自己在本项目下专业的名称
			 getDepartmentId:function(){
				uni.showLoading({
					title:"获取中",
					success:()=>{
						Query.findUserProjectDepartmentByUserIdAndProjectId(_this.userInfo.id,_this.projectId)
						.then(data=>{
							console.log(data)
							uni.hideLoading();
							console.log("查询到的departmentId",data.data.records[0].departmentId)
							_this.departmentId = data.data.records[0].departmentId;
							_this.getDepartmentName(data.data.records[0].departmentId);
						})
						.catch(error=>{ 
							console.log(error)
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:1000
							})
						})
					}
				})
			 },
			 
			 //根据专业的id去查询专业的name
			getDepartmentName:function(departmentId){
					_this = this;
					uni.showLoading({
					title:"获取中",
					success:()=>{
						uni.request({
							url:departmentQuery,
							method:"POST",
							data:{
								id:departmentId
							},
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							console.log(data)
							console.log("查询到的执行人的专业",data[1].data.data.records[0].name);
							_this.departmentName = data[1].data.data.records[0].name;
						})
						.catch(Error=>{
							console.log(Error)
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:'loading'
							})
						})
					}
				})
			},
			
			//根据项目的id去获取projectName
			findProjectNameByProjectId:function(){
				uni.showLoading({
					title:"获取中",
					success:()=>{
						uni.request({
						   url:projectQuery,
						   data:{
							   id:_this.projectId
						   },
						   method:"POST",
						   dataType:'json'
						})
						.then(data=>{
							console.log("查询到的项目信息",data)
							_this.projectName = data[1].data.data.records[0].projectName;
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
			},
			
			
			//选择有限级的时候
			pickerPriorityChange:function(e){
				let index = parseInt(e.detail.value);
				this.taskPriority = this.priority[index];
			},
			
		    //首先获取本人在本项目下本冲刺的本专业的情况下taskOrder 
			//根据查找到任务的总数进行统计,然后将统计的个数+1
			getNowHadTaskOrder:function(callback){
				_this = this;
				console.log("查询条件",{
							  taskExcuteUserId:_this.userInfo.id,
							  taskSprint:_this.sprintId,
							  projectId:_this.projectId,
							  departmentId:_this.departmentId,
							  pageNum:0,
							  pageSize:1000
							})
				uni.showLoading({
					title:"获取中",
					success:()=>{
						uni.request({
							url:taskQuery,
							method:"POST",
							data:{
							  taskExcuteUserId:_this.userInfo.id,
							  taskSprint:_this.sprintId,
							  projectId:_this.projectId,
							  departmentId:_this.departmentId,
							  pageNum:0,
							  pageSize:1000
							},
							dataType:'json'
						})
						.then(data=>{
							
							//查到任务并且返回长度.
							uni.hideLoading();
							console.log("查询到的任务",data);
							let taskLength = data[1].data.data.records.length;
							  callback(taskLength);
						})
					    .catch(error=>{
							uni.hideLoading();
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:1000
							})
						})
					}
				})
			},
			
			//输入首字母
			//这里获取所有的该项目下该冲刺下该专业该用户的任务
			//即调用getNowHadTaskOrder函数来计算总数然后将输入的值
			//和总数＋1进行拼接作为最终的taskOrder赋给this.taskOrder	
			inputTaskOrder:function(e){
				let taskOrder = e.target.value;
			    let reg = /[A-Z]/i;
				if(reg.test(taskOrder)&&taskOrder.length===1){
					this.getNowHadTaskOrder((length)=>{
						this.taskOrder = taskOrder+(length+1);
					})
				}else{
					this.taskOrder = "";
					uni.showToast({
						title:"输入有误",
						icon:"none",
						duration:500
					})
				}
			},
			
			//输入任务的内容
			inputTaskName:function(e){
				if(e.detail.value.length<=20){
					this.taskName = e.detail.value
				}else{
					this.taskName = "";
					uni.showToast({
						icon:"none",
						title:"任务长度过长"
					})
				}
			},  
			
			//输入预估工时
			inputTaskPredictTime:function(e){
				let taskPredictTime = e.detail.value;
				let reg = /^[0-9]$/g;
				if(reg.test(taskPredictTime)){
					this.taskPredictTime = e.detail.value;
				}else{
					uni.showToast({
						title:'请输入数字',
						duration:500,
						icon:"none"
					})
				}
			},
			
		    //添加任务提交的函数
			submitAddTask:function(e){
			   _this = this;
			   //信息不为空的时候进行提交
			   let data ={
				   "departmentId": _this.departmentId,
				   "isReview": 0,
				   "projectId": _this.projectId,
				   "sprintId": _this.sprintId,
				   "taskChargeUserId": _this.taskChargeUserId,
				   "taskExecuteUserId": _this.taskExcuteUserId,
				   "taskName": _this.taskName,
				   "taskOrder": _this.taskOrder,
				   "taskPlainId":"",                
				   "taskPredictTime": _this.taskPredictTime,
				   "taskPriority": _this.taskPriority,
				   "taskState": 0,
			   };
			   console.log("提交的信息",data)
			   if(_this.projectId&&_this.taskExcuteUserId
			       &&_this.taskChargeUserId&&_this.sprintId
				   &&_this.taskChargeUserName&&_this.taskPriority
				   &&_this.taskPredictTime&&_this.taskOrder
				   &&_this.taskName&&_this.departmentName
				 ){
					 uni.showLoading({
					 	title: '提交中',
					 	mask: false,
						success:()=>{
							 uni.request({
							url:taskAdd,
							method:'POST',
							//这个taskPlainId 在考虑要不要
							data:{
								  "departmentId": _this.departmentId,
								  "isReview": 0,
								  "projectId": _this.projectId,
								  "sprintId": _this.sprintId,
								  "taskChargeUserId": _this.taskChargeUserId,
								  "taskExecuteUserId": _this.taskExcuteUserId,
								  "taskName": _this.taskName,
								  "taskOrder": _this.taskOrder,
								  "taskPlainId":"",                
								  "taskPredictTime": _this.taskPredictTime,
								  "taskPriority": _this.taskPriority,
								  "taskState": 0,
						    },
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							console.log("提交任务成功",data);
							_this.pushAddMessagePush()
						})
						.catch(Error=>{
						  uni.showToast({
							 title: '网络错误',
							 duration:500,
							 icon:"none"
						  });
						})	
				    } 
				  });
				
				 }else{
					 uni.showToast({
					 	title:"请完善信息",
						duration:1000,
						icon:"none"
					 })
				 }
			},
			
			//添加任务增加微信消息推送
			pushAddMessagePush:function(formId){
				_this = this;
				console.log("项目负责人的openId",_this.openId)
				console.log("formId",formId);
				let applyTime = formatDate(new Date());
				uni.showLoading({
					title:"提交提交中", 
					success:()=>{
						uni.request({
							url:messageSend,
							method:"POST",
							data:{
								"touser": _this.openId,                      //目标用户
							    "template_id": "Paifa1aKUvziS35PwSX4L8XWX-aVMamivXDW5c9XOzc",    //模板id
								"page": "pages/reviewTask/reviewTask",
							    "form_id": "",                                 //后台寻找这个目标用户的formId
								"data": {
									 "keyword1": {
										"value": _this.userInfo.trueName,
									},
									"keyword2": { 
										"value": _this.projectName
									},
									"keyword3": {
										"value": _this.departmentName
									},
									"keyword4": {
										"value":"新增"+_this.taskName
									},
									"keyword5": {
										"value":applyTime
									},
									"emphasis_keyword": "keyword1.DATA"
								}
							},	
						}) 
						.then(data=>{
							uni.hideLoading();
							uni.showToast({
								title:"提交成功",
								icon:"../../static/img/Icon/success.png",
								duration:500
							})
							console.log("消息推送成功",data)
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:500
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
	overflow: scroll;
	height: auto;
	width: 100%;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
.addTask{
	display: flex;
	flex-direction: column;
}
#title{
	height: 80upx;
	width: 100%;
	font-size: 35upx;
	font-weight:bold;
	line-height: 80upx;
	background-color:#6195C0;
	margin-left: 2upx;
}
.addTask view{
	height: 100upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	margin-top: 5upx;
	align-items: center
}

#heading{
	font-size:30upx;
	height: 80upx;
	width: 150upx;
	margin-left:10upx;
    line-height: 80upx;
	text-align: left;
	color: #F1F1F1;
	font-weight: bold;
}
.addTask view input{
	margin-left: 10upx;
	height: 80upx;
	font-size:30upx;
    align-items: center;
	color: #F0F8FF;
}
.submit{
	height: 70upx;
	line-height: 70upx;
	font-size: 35upx;
	width: 70%;
	margin-top: 20upx;
}
.noSprintInfo{
	font-size: 30upx;
	color: #E9EFED;
	width: 100%;
	height: 80upx;
	text-align: center;
}
</style>
