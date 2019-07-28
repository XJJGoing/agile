<template>
	<scroll-view class="all" scroll-y="true">
	  <view class="dateWork">
		  <view>
			  <text id="title">任务信息</text>
			  <text>序号:{{taskOrder}}</text>
			  <text>内容:{{taskName}}</text>
		  </view>
		  
		  <view>
			  <text id="title">记录今天的工时</text>
			  <view class="dateWorkDetail1">
				  <text>工时:</text>
				  <input placeholder="输入工时(输入数字)" :style="{width:width+'px'}" @input="inputDayWokrTime" :value="dayWorkTime"></input>
			  </view>
			  <view class="dateWorkDetail2">
				  <text>备注:</text>
				  <textarea placeholder="输入今日日报..." :style="{width:width+'px'}"  :value="dayNote" @input="inputDayNote"></textarea>
			  </view>
			  <view class="dateWorkDetail1">
				    <text>完成度:</text>
					<slider max="100" min="0" step="1" show-value="true" @change="sliderChange" id="slider" :style="{width:width+'px'}" block-size="14">
					</slider>
			  </view>
		  </view>
		  
		  <view>
			  <text id="title">选择状态</text>
				  <view class="detailStatus">
					     <picker  :range="taskStatusArry" :value="completionDegree" @change="pickerChange">
							 <input :value="taskDisplayStatus" disabled="true" ></input>
						 </picker>
					  <text id="arrow">></text>
				  </view>
		  </view>
		  
		  <button class="submit" @click="submitDateWork" >提交</button>
	  </view>	  
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	import {format} from'../../static/utils/time.js';
	import {dateWorkAdd,
	        taskUpdateBatch,
			dateWorkQuery,
			dateWorkUpdateBatch
	       } from "../../static/utils/api.js";
	var _this;
	export default {
		data() {
			return {
			   width:"",                  //设置输入框和输入区域的长度
			   userInfo:"",
			   projectId:"",                             //这三个也传
			   sprintId:"",
			   departmentId:"",
			   taskId:6,                                  //任务的id.
			   taskOrder:"L3",                            //任务的序号 
			   taskName:"购买重量级别的原子弹",            //任务的内容  这三个参数都通过页面传输参数传过来。
			   
               taskStatusArry:["未完成","完成","中止","进行中"],
			   taskDisplayStatus:"未完成",      //默认的任务状态
			   
			   
			   taskState:0,          // 0:未完成 1:完成 2:中止 3:进行中
			   dayWorkTime:"",        //输入的每天工时
			   dayNote:"",            //每天的日报
			   completionDegree:""         ,//每日的完成度
			   
			   dateWorkId:"",                //dateWorkId。用于更新用
			   
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
					  console.log("查询到的用户信息",data.data.records);
					  _this.userInfo = data.data.records[0];
					  _this.getHadNowDateWork();             //当任务已经存在的时候，需要修改的时候显示原来有的。
				  })
				  .catch(Error=>{
					  uni.showToast({
					  	title:'网络错误',
						duration:5000,
						icon:"none"
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
		
		onLoad(e){
			
		},
		
		methods: {
			
			//获取系统信息设置输入框的长度
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = parseInt(res.windowWidth-70)
					}
				})
			},
		   
		    //查询今日有没有打卡，有的就显示，再次提交的时候就更新
			getHadNowDateWork:function(){
				_this = this;
				let dateTime = format(new Date());
			    uni.showLoading({
			    	title:"获取中",
				    success:()=>{
						uni.request({
							url:dateWorkQuery,
							method:"POST",
							data:{
								taskId:_this.taskId,
								userId:_this.userId,
								sprintId:_this.sprintId,
								projectId:_this.projectId,
								date:dateTime,
							},
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							console.log("查找成功",data[1].data.data.records[0]);
						    if(data[1].data.data.records.length){  //查找是否存在
								_this.dateWorkId = data[1].data.data.records[0].id;
								_this.dayWorkTime = data[1].data.data.records[0].workTime;
								_this.dayNote = data[1].data.data.records[0].note;
								_this.taskState = 3;
							}else{
								
							}
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
		    
		   
		    pickerChange:function(e){
				_this = this;
				let index = e.detail.value;
				_this.taskDisplayStatus = _this.taskStatusArry[index];
				_this.taskState = index;
			},			
			inputDayWokrTime:function(e){
				_this = this;
				let dayWorkTime = e.detail.value;
				let reg = /^[0-9]+$/g;
				if(reg.test(dayWorkTime)){
					_this.dayWorkTime = dayWorkTime;
				}else{
					uni.showToast({
						title:"请输入数字",
						icon:"none",
					    duration:500,
						success:()=>{
							_this.dayWorkTime = "";
						}
					})
				}
			},
			
			inputDayNote:function(e){
				let dayNote = e.detail.value;
				_this.dayNote = dayNote;
			},
			
		    sliderChange:function(e){
				_this = this;
				_this.completionDegree = e.detail.value+'%';
			},
			
			
			//提交每日打卡, 之前已经存在的就进行更新。
			submitDateWork:function(){
				_this = this;
				if(_this.dayNote&&_this.dayWorkTime
				   &&_this.completionDegree&&_this.taskId
				   ){
					let dateTime  = format(new Date());
					if(_this.dateWorkId){              //已经存在则进行更新
						_this.updateDateWork()
					}else{
					    uni.showLoading({
					    	title:"提交中",
					    	success:()=>{
					    		uni.request({
					    			url:dateWorkAdd,
					    			method:"POST",
					    			data:{
					    			  taskId:_this.taskId,
					    		      userId:_this.userInfo.id,
					    			  sprintId:_this.sprintId,
					    			  projectId:_this.projectId,
					    			  date:dateTime,
					    			  completionDegree:_this.completionDegree,
					    			  note:_this.dayNote,
					    			  workTime:_this.dayWorkTime
					    			},
					    			dataType:'json'
					    		})
					    		.then(data=>{
					    			console.log('提交成功',data)
					    			if(_this.taskState){  //当选中的状态不为未完成时，更新任务的状态
					    			   _this.updatetTask();
					    			}else{
											uni.showToast({
											title:"打卡成功",
											icon:"../../static/img/Icon/success.png",
											duration:500,
											})
									}
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
				}else{
					uni.showToast({
						title:"请完善信息",
						duration:500,
						icon:"none"
					})
				}
			},
			
			
			//当已经存在dateWorkId的时候进行更新
			updateDateWork:function(){
				_this = this;
				uni.showLoading({
					title:"更新中",
					success:()=>{
						uni.request({
							url:dateWorkUpdateBatch,
							method:"POST",
							data:[{
								"id":_this.dateWorkId,
					            "completionDegree": _this.completionDegree,
					            "note": _this.dayNote,
					            "workTime": _this.dayWorkTime,
					          }],
							dataType:'json',
						})
						.then(data=>{
							console.log("更新打卡",data)
							_this.updatetTask()
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:1000
							})
						})
					}
				})

			},
			
			//当taskStatus选中为非0状态的时候向任务表中更新状态
			updatetTask:function(){
				_this = this;
				uni.showLoading({
					title:"更新中",
					success:()=>{
						uni.request({
							url:taskUpdateBatch,
							method:"POST",
							data:[{
								id:_this.taskId,
								taskState:_this.taskState
							}],
							dataType:'json'
						})
						.then(data=>{
							console.log("更新任务成功",data)
							uni.showToast({
								title:"更新成功",
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
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:1000
							})
						})
					}
				})
			},
			
		}
	}
</script>

<style>
.all{
	width: 100%;
	height: auto;
    overflow-y: scroll;
}
.dateWork{
	display: flex;
	flex-direction: column;
	margin-top: 10upx;
}
.dateWork view{
	display: flex;
	flex-direction: column;
	margin-top: 10upx;
}
.dateWork view text{
	color: #F0F8FF;
	margin-left: 8upx;
	font-size: 30upx;
	margin-top: 20upx;
}
#title{
	height: 60upx;
	background-color:#5087BF;
	line-height: 60upx;
	font-weight: bold;
	font-size: 30upx;
	color: #3F536E!important;
	margin-left: 0upx!important;
}
.dateWorkDetail1,.dateWorkDetail2{
	width: 100%;
	display: flex;
	flex-direction: row!important;
	align-items: center!important;
	margin-top: 10upx;
}
.dateWorkDetail1 text{
    height: 60upx;
	line-height: 60upx;
    margin-top: 0upx!important;
	width: 120upx;
	margin-left: 10upx;
	color: #F1F1F1;
}
.dateWorkDetail1 input{
	height: 60upx;
	line-height: 60upx;
	color: #F0F8FF;
	font-size: 30upx;
}
.dateWorkDetail2 text{
	height: 250upx;
	line-height: 250upx;
	width: 100upx;
	margin-left: 10upx;
	margin-top: 0upx!important;
	color: #F1F1F1;
}

.dateWorkDetail2 textarea{
	height: 250upx;
	border-radius: 2%;
	border: 1px solid #C0C0C0;
	font-size: 30upx;
	font-size: 30upx;
	overflow: scroll;
	color: #F8F1F3;
}
.detailStatus{
	position: relative;
	width: 100%;;
	height: 100upx;
	display: flex;
}
.detailStatus input{
	height: 70upx;
	line-height: 70upx;
	border-radius: 5%;
	line-height: 70upx;
	font-size: 30upx;
	text-align: center;
	color: #F1F1F1;
	margin-top: 10upx;
}
#arrow{
	position: absolute;
	right: 50upx;
	top: -10upx;
	font-weight: bold;
	height: 70upx;
	line-height: 70upx;
}
#slider{
	margin-left: 10upx;
}
.submit{
	height: 70upx;
	line-height: 70upx;
	width: 70%;
	background-color: #6AA2D4;
    font-size: 35upx;
	font-weight: 500;
}
</style>
