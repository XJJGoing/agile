<template>
	<view class="all">
		<text class="title">更新预估工时</text>
		<form report-submit="true" @submit="submit">
			<view>
				<text>任务序号:</text>
				<input :value="task.taskOrder" disabled="true" :style="{width:width+'px'}"></input>
			</view>
			<view>
				<text>任务内容:</text>
				<input :value="task.taskName" disabled="true" :style="{width:width+'px'}"></input>
			</view>
			<block v-if="enterId===1">
				<view>
					<text>预估工时:</text>
					<input :value="taskPredictTime" :disabled="canChangeTaskPredictTime" :style="{width:width+'px'}" @input="inputPredictTime"></input>
				</view>
			</block>
			<block v-if="enterId===2">
				<view>
					<text>优先级:</text>
					<picker :range="priorityArry" :value="index" @change="pickerChangePriority" :style="{width:width+'px'}">{{taskPriority}}</picker>
				</view>
			</block>
			<button form-type="submit"  class="submintBtn">提交</button>
		</form>	
	</view>
</template>

<script>
	import {taskQuery,taskUpdateBatch} from '../../static/utils/api.js';
	import {addFormId} from '../../static/utils/utils.js'
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	var _this;
	export default {
		data() {
			return {
				width:"",                    //输入框的宽度
				userInfo:"",
				enterId:"",                  //用来判断进入这个页面时判断该预估工时还是优先级
				task:"",                    //查询到的task的信息
				taskPredictTime:"",         //预估工时
				taskId:"",                  //传过来的任务的id
				taskPriority:"",             //目前的优先级
				priorityArry:[1,2,3,4],    //优先级
				
				canChangeTaskPredictTime:false,
				restChangeTimes:"",             //剩余的修改预估工时次数
				
				lastChangeStr:"",               //拼接修改后的字符串
	
			}
		},
		onLoad(e){ //传送过来的对象,1为改变预估工时，2为改变优先级
			_this = this;
			_this.enterId = 1;
			_this.taskId = 1;
		   _this.queryTaskInfo();        //查询任务的信息
		},
		onShow(){
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{
					Query.findUser({id:res.data.id})
					.then(data=>{
						_this.userInfo = data.data.records[0];       
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
		},
		methods: {
			
			//获取系统的高度进行设置输入框的宽度
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = res.windowWidth-res.windowWidth*0.2-10;
					}
				})
			},
			
			//改变优先级
			pickerChangePriority:function(e){
				_this = this;
				let index = e.detail.value;
				_this.taskPriority = _this.priorityArry[index];
			},
			
			//输入预估工时
			inputPredictTime:function(e){
				_this = this;
			   let reg = /^[0-9]*$/g;             //只匹配数字
			   let time = e.detail.value;
			   if(reg.test(time)){
				  _this.taskPredictTime = time;
			   }else{
				   _this.inputTaskPredictTime = "";
				   uni.showToast({
				   	title:"只能输入整数",
					duration:500,
					icon:"none"
				   })
			   }
			},
			
		   //根据任务的id查找到相应的任务
		   queryTaskInfo:function(){
			   _this = this;
			   console.log("查询的任务的id",_this.taskId)
			   uni.showLoading({
			   	 title:'查找中',
				 success:()=>{
					 uni.request({
					 	url:taskQuery,
						method:"POST",
						data:{
							id:_this.taskId
						},
						dataType:'json',
					 })
					 .then(data=>{
						 console.log('查询到的',data);
						 uni.hideLoading();
						 _this.task = data[1].data.data.records[0];
						 _this.taskPredictTime = data[1].data.data.records[0].taskPredictTime;
						 _this.taskPriority = data[1].data.data.records[0].taskPriority;
						 _this.toJude();               //判断还能不能修改预估工时
					 })
					 .catch(Error=>{
						 console.log(Error)
						 uni.showToast({
						 	title:"网络错误",
							icon:"loading",
							duration:500
						 })
					 })
				 }
			   })
		   },
		   
		   //提交的函数
		   submit:function(e){
			   _this = this;
			   addFormId(_this.userInfo.openId,e.detail.formId);
			   if(_this.enterId===1){
				 uni.showModal({
				 	  title:"提醒",
					  content:`您当前剩余修改的次数为${_this.restChangeTimes},是否确认修改`,
					  confirmText:"确认",
					  confirmColor:"#4CD964",
					  cancelText:"取消",
					  cancelColor:"#DD524D",
					  success:(res)=>{
						  if(res.confirm){
							  _this.updatePredictTime()
						  }else if(res.cancel){
							  
						  }
					  }
				  })   
			   }else if(_this.enterId===2){
				   _this.updateTaskPriority()
			   }
			   
		   },
		   
		   //更预估工时
		   updatePredictTime:function(){
			   _this = this;
			   
			  //进行时间的拼接以及处理
			  if(_this.taskPredictTime){
			  		if(parseFloat(_this.taskPredictTime)>parseFloat(_this.task.taskPredictTime)){
			  			let time = parseFloat(_this.taskPredictTime)-parseFloat(_this.task.taskPredictTime);
				        _this.lastChangeStr = _this.task.lastChangeStr+'+'+parseInt(time).toString();
			  		}else if(parseFloat(_this.taskPredictTime)<parseFloat(_this.task.taskPredictTime)){
						let time = parseFloat(_this.task.taskPredictTime)-parseFloat(_this.taskPredictTime);
						_this.lastChangeStr = _this.task.lastChangeStr+'-'+parseInt(time).toString();
					}else{
						_this.lastChangeStr = _this.task.lastChangeStr;
					}
					console.log("提交的数据",_this.taskId,_this.lastChangeStr,_this.taskPredictTime)
					uni.showLoading({
						 title:'更新中',
						 success:()=>{ 
							 uni.request({
								url:taskUpdateBatch,
								method:"POST",
								data:[{
									id:_this.taskId,
									taskPredictTime:_this.taskPredictTime,
									lastChangeStr:_this.lastChangeStr
								}],
								dataType:'json',
							 })
							 .then(data=>{
								 console.log('更新成功',data);
								 uni.showToast({
									title:'提交成功',
									icon:"../../static/img/Icon/success.png",
									duration:500,
									success:()=>{
										uni.navigateBack({
											delta:1
										})
									}
								 })
							 })
							 .catch(Error=>{
								 console.log(Error)
								 uni.showToast({
									title:"网络错误",
									icon:"loading",
									duration:500
								 })
							 })
						 }
					})
			   }else{
				   uni.showToast({
				   	 title:'输入有误',
					 duration:1000,
					 icon:"none"
				   })
			   } 
			   
		   },
		   
		   //修改优先级
		   updateTaskPriority:function(){
			   _this = this;
			   uni.showLoading({
			   	 title:'更新中',
				 success:()=>{
					 uni.request({
						url:taskUpdateBatch,
						method:"POST",
						data:[{
							id:_this.taskId,
							taskPriority:_this.taskPriority,
						}],
						dataType:'json',
					 })
					 .then(data=>{
						 uni.showToast({
							title:'提交成功',
							icon:"../../static/img/Icon/success.png",
							duration:500,
							success:()=>{
								uni.navigateBack({
									delta:1
								})
							}
						})
					 })
					 .catch(Error=>{
						 console.log(Error)
						 uni.showToast({
							title:"网络错误",
							icon:"loading",
							duration:500
						 })
					 })
				 }
			   })
		   },
		   
		   //判断用户是否还可以修改预估工时
		   toJude:function(){
			   _this = this;
			   let reg = /[+-]/g;
			   let lastChangeStr = _this.task.lastChangeStr;
			   if(reg.test(lastChangeStr)){            //判断是否有加或者减
				  let arry = reg.split(lastChangeStr);
				  if(arry.length===3){                  //为三不能修改
					  _this.canChangeTaskPredictTime = true;  
					  _this.restChangeTimes = 0;		
				  }else if(arry.length===2){
					  _this.restChangeTimes = 1;
				  }
			   }else{
				   _this.restChangeTimes = 2;
			   }
		   },
		   
		}
	}
</script>

<style>
.all{
	width: 100%;
	height: auto;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
}
.title{
	height: 80upx;
	background-color: #5087BF;
	line-height: 80upx;
	width: 100%;
	font-size: 30upx;
	font-weight: 600;
}
.all view{
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100upx;
	margin-top: 20upx;
}
.all view text{
	width: 20%;
	height: 100upx;
	line-height: 100upx;
	font-size: 30upx;
	margin-left: 10upx;
	color: #F0F8FF;
	font-weight: 600;
}
.all view input {
	line-height: 100upx;
	height: 100upx;
	font-size: 30upx;
	margin-left: 10upx;
	color: #F0F8FF;
}
.all view picker{
	line-height: 100upx;
	height: 100upx;
	color: #F0F8FF;
	font-size: 30upx;
}
.submintBtn{
	margin-top: 60upx;
	height: 80upx;
	width: 60%;
	line-height: 80upx;
	background-color: #5087BF;
}


</style>
