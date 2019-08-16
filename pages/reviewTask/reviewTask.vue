<template>
	<scroll-view class="all" scroll-y="true" @scrolltolower="loaderMore" :style="{height:height+'px'}">
		<view class="reviewList">
			<text id="title">待审核的任务:</text>
			<view v-for="(item,index) in noReviewTaskList" :key="index" class="eachOneTask">
				<uni-card  
				    :title="'任务序号 '+item.taskOrder" 
				>
				    <view class="Taskdetail" :id="JSON.stringify(item)" @click="examine">
						<text>申请人:{{item.taskExecuteTrueName}}</text>
						<text>内容:{{item.taskName}}</text>
						<text>优先级:{{item.taskPriority}}</text>
						<text>预估工时:{{item.taskPredictTime}}</text>
						<text>专业:{{item.departmentName}}</text>
						<text>提交申请时间:{{item.createTime}}</text>
					</view>
				</uni-card>
			</view>
			
		</view>
    </scroll-view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue";
	import {formatDate} from '../../static/utils/time.js';
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	import {taskQuery,taskUpdateBatch,messageAdd,deleteTask,messageSend} from '../../static/utils/api.js';
	var _this;
		export default {
			components: {uniCard},
			data() {
				return {
					height:"",                  
					userInfo:"",
					projectId:"",            //项目的id
				    sprintId:"",            //冲刺的id
					noReviewTaskList:[],    //待审核的任务     
					pageNum:0,              //页数
					pageSize:5              
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
							
							//console.log("获取到的用户信息",data.data.records[0])
							_this.userInfo = data.data.records[0];
							uni.getStorage({                //设置项目
								key:"nowInProject",
								success:(res)=>{
									_this.projectId = res.data.projectId;
									uni.getStorage({        //设置冲刺
										key:"sprintId",
										success:(res)=>{
											_this.sprintId = res.data;    
											_this.getAllNoReview(_this.projectId,_this.sprintId);   //获取未审核的项目
										},
										fail:()=>{
											uni.showToast({
												title:"该项目暂无冲刺",
											    icon:"none",
												duration:1000
											})
										}
									})
								},
								fail:(Error)=>{
									uni.redirectTo({
										url:'../apply/apply'
									})
								}
							})
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								icon:"none",
								duration:500
							})
						})
					},
					fail:()=>{
						uni.redirectTo({
							url:'../login/login'
						})
					}
				})
			},
			onPullDownRefresh(){
				_this = this;
				_this.getAllNoReview(_this.projectId,_this.sprintId);
			},
			methods: {
				
				getSystem:function(){
					_this = this;
					uni.getSystemInfo({
						success:(res)=>{
							_this.height = res.windowHeight;
							console.log(_this.height)
						}
					})
				},
				
				//查询为未审核的任务  
				getAllNoReview:function(projectId,sprintId){
					console.log("查询的条件",projectId,sprintId)
					_this = this;
					uni.showLoading({
						title:'获取中',
						mask: false,
					    success:()=>{
							uni.request({
								url:taskQuery,
								method:'POST',
								data:{
									projectId:projectId,
                                    sprintId:sprintId,
									isReview:0,
									pageNum:_this.pageNum,
									pageSize:_this.pageSize
								},
								dataType:'json'
							})
							.then(data=>{
								uni.hideLoading();
								console.log("查询到的",data);
								console.log("查询到的未审核的任务",data[1].data.data.records);
								_this.noReviewTaskList = data[1].data.data.records;
							})
							.catch(Error=>{
								uni.showToast({
									title:"获取失败",
									icon:"none"
								})
							})
						}
					})
				},
				
				//进行任务的审核
				examine:function(e){
					_this = this;
					let task = JSON.parse(e.currentTarget.id);
					console.log('选中更新的任务',task);
					let taskExecuteUserId = task.taskExecuteUserId;
				    let taskName = task.taskOrder+task.taskName;
					uni.showModal({
						title:"审核任务",
						cancelText:"不通过",
						confirmText:"通过",
						confirmColor:"#19BE6B",
						cancelColor:"#DD524D",
						success:(res)=>{
							if(res.confirm){
								uni.showModal({
									title:'是否确定？',
									confirmText:"确定",
									cancelText:"取消",
									confirmColor:"#19BE6B",
									cancelColor:"#DD524D",
									success:(res)=>{
										if(res.confirm){
											let content = `${task.taskOrder}审核已通过`
											uni.showLoading({
												title:"提交中",
												success:()=>{
													uni.request({
														url:taskUpdateBatch,
														method:"POST",
														data:[{
															    "id":task.id,
																"isReview": 1,
															  }],
														dataType:'json'
													})
													.then(data=>{
														uni.hideLoading()
														console.log("审核成功",data);
														_this.getAllNoReview(_this.projectId,_this.sprintId);      //重新获取未审核的任务
													})
													.catch(Error=>{
														uni.showToast({
															title:"网络错误",
															duration:500,
															icon:"none"
														})
													})
												}
											})
											
											//同时也增加消息和推送消息
											 let content2 = "通过";
											 _this.pushMessage(taskExecuteUserId,taskName,content2);
											_this.addMessage(task,content)
										}else{
											
										}
									}
								})
								
							}else if(res.cancel){ //审核不通过向消息模块增加消息
							   uni.showModal({
									title:"是否确定？",
									confirmText:"确定",
									cancelText:"取消",
									confirmColor:"#19BE6B",
									cancelColor:"#DD524D",
									success:(res)=>{
										if(res.confirm){
											let content = `${task.taskOrder}审核未通过`;
											let content2 = "未通过";
											
											//发送消息并且删除该任务推送微信消息,并且重新获取任务
											_this.addMessage(task,content);
											_this.pushMessage(taskExecuteUserId,taskName,content2)
											_this.deteleTask(task.id);
											_this.getAllNoReview();
										}else{
											
										}
									}
							   })
							}
						}
					})
				},
				
				//向消息模块增加内容
				addMessage:function(task,content){
					_this = this;
					uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:messageAdd,
								method:"POST",
								data:{
								     "content": content,
									 "isLook": 1,
									 "messageFrom": task.taskChargeUserId,
									 "messageTo": task.taskExecuteUserId
							    },
								dataType:'json'
							})
							.then(data=>{
								uin.hideLoading();
								console.log("增加消息成功")
							})
							.catch(Error=>{
								uni.showToast({
									title:'网络错误',
									duration:1000,
									icon:"none"
								})
							})
						}
					})
				},
				
				//审核不通过对任务进行删除
				deteleTask:function(taskId){
					_this = this;
				    uni.showLoading({
				    	title:"提交中",
						success:()=>{
							uni.request({
								url:deleteTask,
							    data:[taskId],
								method:"POST",
								dataType:'json'
							})
							.then(data=>{
								uni.hideLoading();
								console.log('删除任务成功')
							})
							.catch(Error=>{
								uni.showToast({
									title:'网络错误',
									icon:'none',
									duration:1000
								})
							}) 
						}
				    })
				},
				
				//审核的结果微信消息推送给用户
				pushMessage:function(taskExecuteUserId,taskName,content){
					_this = this;
					console.log(taskExecuteUserId)
					let time = formatDate(new Date());
					Query.findUser({id:taskExecuteUserId})
					.then(data=>{
						let openId = data.data.records[0].openId;
						console.log(openId);
	                    uni.request({
	                    	url:messageSend,
	                    	method:"POST",
	                    	data:{
	                    		 "touser": openId,             
								 "template_id": "i_uMOCIeL3R7vfxZtOBg88_-IiZbLN5VItvgQM_AJ2I",   
								 "page": "pages/message/message",
								 "form_id":"", 
								 "data": {
									 "keyword1": {
												 "value": taskName
											 },
									  "keyword2":{ 
												"value": content
											 },
										   "keyword3":{
												 "value": time
										 },
										"emphasis_keyword": "keyword1.DATA"
									}
	                    	},	
	                    })
						.then(data=>{
							console.log("消息推送成功",data);
						})
					    .catch(Error=>{
							console.log(Error)
						})
					})
					
				},
				
				//触底加载加载待审核的项目
				loaderMore:function(){
					_this = this;
					if(_this.pageSize>_this.noReviewTaskList.length){
						uni.showToast({
							title:"已经到底了哦!",
							icon:"none",
							duration:1000
						})
					}else{
						_this.pageSize +=5;
						_this.getAllNoReview()
					}
				}
			},
			
		}
</script>

<style>
.class{
	width: 100%;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 4upx;
	width: 4upx;
}
#title{ 
	height: 70upx;
	width: 100%;
	line-height: 70upx;
	font-weight: bold;
	font-size: 30upx;
	background-color: rgb(153,153,153);
	margin-top: 5upx;
}
.reviewList{
	display: flex;
	flex-direction: column;
	width: 100%;
}
.eachOneTask{
	margin-top: 10upx;
	width: 100%;
}
.Taskdetail text{
	width: 100%;
	height: 40upx;
	line-height: 40upx;
}
.Taskdetail{
	display: flex;
	flex-direction: column;
	font-size: 30upx;
}
</style>
