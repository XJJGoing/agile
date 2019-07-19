<template>
	<scroll-view class="all" scroll-y="true">
		<view class="reviewList">
			
			<text id="title">待审核的任务:</text>
			<view v-for="(item,index) in noReviewTaskList" :key="index" class="eachOneTask">
				<uni-card  
				    :title="'任务序号'+item.taskOrder" 
				>
				    <view class="Taskdetail" :id="JSON.stringify(item)" @click="examine">
						<text>申请人ID:{{item.taskExecuteUserId}}</text>
						<text>内容:{{item.taskName}}</text>
						<text>优先级:{{item.taskPriority}}</text>
						<text>预估工时:{{item.taskPredictTime}}</text>
						<text>专业ID:{{item.departmentId}}</text>
						<text>提交申请时间:{{item.createTime}}</text>
					</view>
				</uni-card>
			</view>
			
		</view>
    </scroll-view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue"
	
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	import {taskQuery,taskUpdateBatch,messageAdd,deleteTask} from '../../static/utils/api.js';
	var _this;
		export default {
			components: {uniCard},
			data() {
				return {
					userInfo:"",
					projectId:"",            //项目的id
				    sprintId:"",            //冲刺的id
					noReviewTaskList:[],    //待审核的任务     
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
							
							//console.log("获取到的用户信息",data.data.records[0])
							_this.userInfo = data.data.records[0];
							uni.getStorage({ //设置项目
								key:"nowInProject",
								success:(res)=>{
									_this.projectId = res.data.projectId;
									uni.getStorage({  //设置冲刺
										key:"sprintId",
										success:(res)=>{
											_this.sprintId = res.data;    
											_this.getAllNoReview();   //获取未审核的项目
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
			methods: {
				
				//查询为未审核的项目  等待完善等着接口的api
				getAllNoReview:function(){
					_this = this;
					uni.showLoading({
						title:'获取中',
						mask: false,
					    success:()=>{
							uni.request({
								url:taskQuery,
								method:'POST',
								data:{
									projectId:_this.projectId,
                                    sprintId:_this.sprintId,
									isReview:0
								},
								dataType:'json'
							})
							.then(data=>{
								uni.hideLoading();
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
					uni.showModal({
						title:"审核任务",
						cancelText:"不通过",
						confirmText:"通过",
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
											_this.getAllNoReview();            //重新获取未审核的任务
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
								
								//同时也增加消息.
								_this.addMessage(task,content);
								
							}else if(res.cancel){ //审核不通过向消息模块增加消息
							   let content = `${task.taskOrder}审核未通过`;
							   
							   //发送消息并且删除该任务,并且重新获取任务
							   _this.addMessage(task,content);
							   _this.deteleTask(task.id);
							   _this.getAllNoReview();
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
				}
			},	
			
		}
</script>

<style>
.class{
	width: 100%;
	height: auto;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
#title{ 
	height: 100upx;
	width: 100%;
	line-height: 100upx;
	font-size: 30upx;
	background-color: rgba(127,238,68,1);
	margin-left: 10upx;
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
