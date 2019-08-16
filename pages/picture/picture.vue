<template>
	<!--
     <scroll-view class="picture" @scrolltolower="loaderMoreTask" scroll-y="true" :style="{height:height+'px'}">
	 -->
	 <view>
		<block v-if="isCanLook">
			<view class="pickerList">
			   <view>
				   <picker :range="sprintArray" @change="sprintPickerChange" :value="sprintIndex">
					  <block v-if="sprintArray.length!=0">
						  冲刺:{{sprintArray[sprintIndex]}}
					  </block> 
					  <block v-else>
						  冲刺:无
					  </block>
				   </picker>
			   </view>
			   <view>
				   <picker :range="departmentArray" @change="departmentPickerChange" :value="departmentIndex">
				   	 专业:{{departmentArray[departmentIndex]}}
				   </picker>
			   </view>
			   <view>
				    <picker :range="departmentUserArray" @change="departmentUserPickerChange" :value="departmentUserIndex">
					  <block v-if="departmentUserIndex==0">
						  人员:{{departmentUserArray[0]}}
					  </block>
					  <block v-else>
						  人员:{{departmentUserArray[departmentUserIndex]}}
					  </block>	  
				   </picker>
			   </view>
			   <view>
			   	   <text @click="toComment">评论</text>
			   </view>
			</view>
			
			<block v-if="isShowInfo">
				
			<view class="sprintStatus">
			       <view class="status">
					   <text>
						   冲刺状态:
						   <block v-if="sprintState==='未开始'">
							   <text style="color:#DD524D;margin-left:10upx">{{sprintState}}</text>
						   </block>
						   <block v-if="sprintState==='进行中'">
						   	  <text style="color:#F0AD4E;margin-left:10upx">{{sprintState}}</text>
						   </block>
						   <block v-if="sprintState==='已完成'">
						   	  <text style="color:#4CD964;margin-left:10upx">{{sprintState}}</text>
						   </block>
					   </text>
					   <image style="width: 10%;
									 height:50upx;
							        "
							  @click="toRotate"	
							  src="../../static/img/Icon/eyes.png"	
						>
						   横屏模式
					   </image>
					   <text>
						   任务的状态:
						    <block v-if="taskState==='未开始'">
						   		<text style="color:#DD524D;margin-left:10upx">{{taskState}}</text>
						   </block>
						   <block v-if="taskState==='进行中'">
						   	  <text style="color:#F0AD4E;margin-left:10upx">{{taskState}}</text>
						   </block>
						   <block v-if="taskState==='已完成'">
						   	  <text style="color:#4CD964;margin-left:10upx">{{taskState}}</text>
						   </block>
						   <block v-if="taskState==='未完成'">
						   	  <text style="color:#DD524D;margin-left:10upx">{{taskState}}</text>
						   </block>
					   </text>
					</view>
					
				    <view class="progress"> 
						<text>冲刺目标:
						     <text style="color: #1890FF; margin-left: 10upx;">{{sprintTarget}}</text>
						</text>
						<view class="progress-item">
							<i-progress :percent="completionDegree" status="active"></i-progress>
						</view>
					</view>
			</view>   
			
			<view class="bookshelf-content" bindscroll="scroll">
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts"  @touchstart="touchLineA" disable-scroll="false" />
			</view>
			 
			<scroll-view class="all" scroll-x="true" > 
			     <view class="task">
					<view>
						<text class="title">序号</text>
						<view v-for="(item,index) in task" :key="index">
						   <block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
							 <text @click="chooseTaskOrder" :id="item.taskId" :style="{background:chooseBackGroundColor}">{{item.taskOrder}}</text>
						   </block>	
						   <block v-else>
							 <text @click="chooseTaskOrder" :id="item.taskId">{{item.taskOrder}}</text>  
						   </block>	   
						</view>
					</view>
					
					<view>
						<text class="title">待办任务</text>
						<view v-for="(item,index) in task" :key="index">
							<block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
								<text @click="dateWorkAdd" :id="JSON.stringify(item)" :style="{background:chooseBackGroundColor}">
								    {{item.taskName}}
								</text>
							</block>
							<block v-else>
								<text @click="dateWorkAdd" :id="JSON.stringify(item)">
								    {{item.taskName}}
								</text>
							</block>
						</view>
					</view>
					
					<view>
						<text class="title">优先级</text>
						<view v-for="(item,index) in task" :key="index">
						  <block v-if="item.taskId === chooseTaskId&&chooseTaskId!=''">	
							 <text @click="toChangePriority" :id="JSON.stringify(item)" :style="{background:chooseBackGroundColor}">{{item.taskPriority}}</text>
						  </block>
						  <block v-else>	
						  	 <text @click="toChangePriority" :id="JSON.stringify(item)">{{item.taskPriority}}</text>
						  </block>	  
						</view>
					</view>
					
					<view>
						<text class="title">预估工时</text>
						<view v-for="(item,index) in  task" :key="index">
						 <block v-if="item.taskId ===chooseTaskId&&chooseTaskId!=''">	
						   <text @click="toChangePredictTime" :id="JSON.stringify(item)" :style="{background:chooseBackGroundColor}">{{item.lastChangeStr}}</text>
						 </block>
						 <block v-else>
							<text @click="toChangePredictTime" :id="JSON.stringify(item)">{{item.lastChangeStr}}</text> 
						 </block>
						</view>
					</view>
					
					<view>
						<text class="title">实际工时</text>
						<view v-for="(item,index) in  task" :key="index">
						 <block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">	
						   <text :style="{background:chooseBackGroundColor}">{{item.actualWorkingHours}}</text>
						 </block>
						 
						 <block v-else>
							  <text>{{item.actualWorkingHours}}</text>
						 </block>
							  
						</view>
					</view>
					
					<view>
						<text class="title">状态</text>
						<view v-for="(item,index) in  task" :key="index">
						    <block v-if="item.taskState===0">
								<block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
								   <text style="color:#DD524D; background-color:#C0C0C0;">未开始</text>
								</block>
								<block v-else>
								   <text style="color:#DD524D;">未开始</text>
								</block>	
							</block>
							
							<block v-else-if="item.taskState===1">
								<block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
								  <text style="color:#4CD964;background-color:#C0C0C0;">完成</text>
								</block>
								<block>
								   <text style="color:#4CD964">完成</text>
								</block>	
							</block>
							
							<block v-else-if="item.taskState===2">
							    <block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
								   <text style="color:#DD524D;background-color:#C0C0C0;">中止</text>
								</block>
								<block v-else>
								   <text style="color:#DD524D;">中止</text>	
								</block>	
							</block>
							
							<block v-else-if="item.taskState===3">
								<block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">
								  <text style="color:#F0AD4E;background-color:#C0C0C0;">进行中</text>
								</block>
								<block v-else>
								  <text style="color:#F0AD4E">进行中</text>
								</block>  
							</block>
							
						</view>
					</view>
					
					<view>
						<text class="title">执行人</text>
						<view v-for="(item,index) in  task" :key="index">
						  <block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">	
						     <text :style="{background:chooseBackGroundColor}">{{item.taskExecuteTrueName}}</text>
						  </block>
						  <block v-else>
							 <text>{{item.taskExecuteTrueName}}</text>
						  </block>	  
						</view>
					</view>
					
					<view>
						<text class="title">产品负责人</text>
						<view v-for="(item,index) in task" :key="index">
						  <block v-if="item.taskId===chooseTaskId&&chooseTaskId!=''">	
							<text :style="{background:chooseBackGroundColor}">{{item.taskChargeTrueName}}</text>
						  </block>
						  <block v-else>
							 <text>{{item.taskChargeTrueName}}</text> 
						  </block>	  
						</view> 
					</view>
					
				<block  v-for="(item,index) in dateWorkArray" :key="index" >  
				   <view class="date">
				   	    <text class="title"  @click="toLookDayNote" :id="item">{{item}}</text>
						<view class="dateWorkTime" v-for="(item2,index2) in dateWorks[index]" :key="index2">
							
							<block v-if="item2!=0">
		                      <!--      
								<block v-if="chooseIndex===0">     
									<text style="color:#4CD964;background-color:#C0C0C0;">{{item2}}</text>
								</block>	
							 -->
							    <block v-if="index2===chooseIndex&&chooseTaskId">     
									 <text style="color:#4CD964;background-color:#C0C0C0;">{{item2}}</text>
								</block>	 							   
							   <block v-else>
								  <text style="color:#4CD964;">{{item2}}</text> 
							   </block>	   
							</block>
							
							<block v-else>					
								 <block v-if="index2===chooseIndex&&chooseTaskId">     
									 <text style="color:#DD524D;background-color:#C0C0C0;">{{item2}}</text>
								</block>	 							   
								<block v-else>
									 <text style="color:#DD524D;">{{item2}}</text> 
								</block>	   
							</block>
							
						</view> 
				   </view>
				</block>   
					 
				</view>	  
			</scroll-view>
			</block>
		</block>
		    
		<block v-else>
			<view>无查看的权限</view>
		</block>	
	</view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue";
	import {format,formatDate}  from "../../static/utils/time.js"
	import {compareTime} from "../../static/utils/utils.js";
	//var _self;
	var canvaLineA = null;
	const query = require('../../static/utils/utils').Query;
	const login = require('../../static/utils/utils').Login;
	const Login = new login();
	const Query = new query(); 
	//引入api
	import {
		getLineData,
		sprintQuery,
		departmentQueryAll,
		queryDepartmentByProjectId,
		userProjectDepartmentQuery,
		taskQuery
	} from '../../static/utils/api.js';

	var _this;
	export default {
		components: {cmdProgress},
		data() {
			return {
				height:"",
				pageNum:0,
				pageSize:100000,                         //暂时不分页查询
				departmentArray: [],         
				departmentIndex: 0,           
				sprintArray: [],
				sprintIndex: 0,
				departmentUserArray:[],               //用于显示的人员
				departmentUserIndex:"",
				userIndex:"",
				windowWidth: 320,
				cWidth: '',
				cHeight: '',  
				pixelRatio: 1,
				
				userInfo: "",     //自己用户的信息
			    roleId: "",       //自己权限的id 
				userId:"" ,         //处于查询的用户的id
				projectId: "",    //项目的id
				sprintId: "",     //冲刺的id
				departmentId: ""  ,//专业id 当用户的权限为2的时候默认进入自己的专业
				
				isCanLook:true,         //是否有查看的权限
				isShowInfo:true,          //是否显示燃尽图还有冲刺状态这些数据
				
				departmentIdArray:[],         //专业的id列表
				sprintIdArray:[],             //冲刺的id列表
				departmentUserIdArray:[],               //人员的id列表存放着所有
				
				
				dateWorkArray:[],         //冲刺的日期
				task:[],
				                                                    
			    taskState:"",          //任务的状态
	            sprintState:""		,  //冲刺的状态	  
				sprintTarget:"",        //冲刺的目标
				completionDegree:""    ,//冲刺完成度
				
				dateWorks:[] ,          //二维数组存放日期还有打卡天数
				
				chooseTaskId:""        ,//选中的任务id,选中的背景变色
			    chooseBackGroundColor:"#C0C0C0"        ,//选中变的颜色
				chooseIndex:""                         //选中任务的下标
				
			}
		},
		// onLoad() {
		// 	//_self = this;
		// 	this.cWidth = uni.upx2px(400);
		// 	this.cHeight = uni.upx2px(500);
		// },
		onShow() {
		    this.cWidth = uni.upx2px(400);            //转换成px宽度
			this.cHeight = uni.upx2px(500);
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					let id = {
						id: res.data.id
					}
					Query.findUser(id)
						.then(data => {
							_this.userInfo = data.data.records[0];
							if(data.data.records[0].isRoot){
								_this.isCanLook = false;
							}else{
							    uni.getStorage({
							    	key: "nowInProject",
							    	success: (res) => {
										_this.roleId = res.data.roleId;
							    		_this.projectId = res.data.projectId; 
										_this.resolveAsync(res.data.projectId);
							    	},
							    })	
							}
						})
						.catch(Error => {
							uni.showToast({
								title: "网络错误",
								icon: "none",
								duration: 1000
							})
						})
				},
				fail: () => {
					uni.redirectTo({
						url: "../login/login"
					})
				}
			})
		},

		methods: {
			//获取系统的信息
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success: function(res) {
						_this.windowWidth = res.windowWidth;
						_this.height = res.windowHeight;
					}
				});
			},
			
			//选中任务背景颜色变成灰色
			chooseTaskOrder:function(e){
				_this = this;
				let taskId = parseInt(e.target.id);
				_this.chooseTaskId = taskId;
				let chooseIndex;
				for(let i = 0;i<_this.task.length;i++){
					if(_this.task[i].taskId===taskId){
						chooseIndex = i;
					}
				}
				_this.chooseIndex = chooseIndex;
				console.log(_this.chooseIndex)
			},
			
			//开启横屏模式,跳转到横屏模式界面
			toRotate:function(){
				let item = {
					sprintId:this.sprintId,
					projectId:this.projectId,
					userId:this.userId,
					departmentId:this.departmentId
				}
				item = JSON.stringify(item);
				uni.navigateTo({
					url: `../landScapePicture/landScapePicture?item=${item}`,
				});
			},
			
			//获取图表信息 
			getChartData:function(sprintId,projectId,userId,departmentId){
				    _this = this;
					console.log("请求的条件",sprintId,projectId,userId,departmentId)
				    uni.request({
					url: `${getLineData}?sprintId=${sprintId}&projectId=${projectId}&userId=${userId}&departmentId=${departmentId}`,
					method: "POST",
					header: {
						'ContentType': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log(res)
						if (res.data.code === 200) {
							let categories = res.data.data.categories;
							let plainData = res.data.data.plainData;
							let planDataList = []; 
							for (var i = 0; i < plainData.length; i++) {
								planDataList[i] = plainData[i].workTime;
							}
							let trueData = res.data.data.trueData;
							let trueDataList = []
							for (var i = 0; i < trueData.length; i++) {
								trueDataList[i] = trueData[i].workTime;
							}
							let LineA = {
								categories: categories,
								series: [{
									textColor:"#E7F0EF",
									color: "#C92121",
									data: planDataList,
									name: "计划数据",
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}, {
									color: "#42C87B", 
									data: trueDataList,
									name: "实际数据",
									textColor:"#E7F0EF",     //这个失效
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}]
							};
							 console.log(LineA);
							_this.getDateWork(categories);                 //根据返回的燃尽图的日期，从而得到显示的日期
						    _this.queryDateWorkInnerTask(sprintId,projectId,userId,departmentId)    //查询下方的任务列表
							_this.showLineA("canvasLineA", LineA);
						}
					}
				});
			},
			
			//获取冲刺时间段内的日期
			getDateWork:function(categories){
				_this = this;
				let dateWorkArray = [];
				for(let i = 0;i<categories.length;i++){
					dateWorkArray.push(categories[i])
				}
				console.log("冲刺日期",dateWorkArray);
				_this.dateWorkArray = dateWorkArray;
			},
			
			//解决异步处理的函数,获取相应的资源
		    resolveAsync:async function(projectId){
			  _this = this;
			  let d = await _this.getDepartmentArray(projectId);
			  let du = await _this.getDepartmentAllUserArray(projectId);
			  let s = await  _this.getSprintArray(projectId);
			  uni.getStorage({
			  	key: 'sprintId',
			  	success: (res) => {
					let sprintId = res.data;
					console.log("拿到的冲刺的id",sprintId)
					console.log("专业idArray",_this.departmentIdArray)
			  		_this.sprintId = parseInt(sprintId);
			  		let userId = "";
			  		let departmentId = "";
					for(let i = 0;i<_this.sprintIdArray.length;i++){
						if(_this.sprintIdArray[i].id === _this.sprintId){
							_this.sprintIndex = i;
						}
					}
			  		if(_this.roleId===1){
			  		   _this.departmentIndex = _this.departmentArray.length-1;
			  		   _this.departmentUserIndex = _this.departmentUserArray.length-1;
			  		   _this.getChartData(sprintId,_this.projectId,userId,departmentId); 
			  		}else if(_this.roleId===2){   //默认选中自己的专业和姓名
			  			userId = _this.userInfo.id;
						console.log(userId);
			  			//用于默认选中自己的专业
			  			for(let i = 0;i<_this.departmentUserIdArray.length;i++){
			  				if(_this.departmentUserIdArray[i].userId === userId){
			  					departmentId = _this.departmentUserIdArray[i].departmentId;
			  					for(let j = 0;j<_this.departmentIdArray.length;j++){
			  						if(_this.departmentIdArray[j].id === departmentId){
			  							let departmentName = _this.departmentIdArray[j].departmentName;
			  							for(let k = 0;k<_this.departmentArray.length;k++){
			  								if(departmentName === _this.departmentArray[k]){
			  								   _this.departmentIndex = k;
			  								}
			  							}
			  						}
			  					}
			  				}
			  			}
						
						//根据专业改变可选的人
						let departmentUserArray = [];
						for(let i = 0;i<_this.departmentUserIdArray.length;i++){
							if(_this.departmentUserIdArray[i].departmentId === departmentId){
								departmentUserArray.push(_this.departmentUserIdArray[i].trueName)
							}
						}
						 departmentUserArray.push("全部");
						_this.departmentUserArray = departmentUserArray;
						
			  			//用于默认选中自己的姓名
			  			for(let i = 0;i<_this.departmentUserIdArray.length;i++){
							if(userId === _this.departmentUserIdArray[i].userId){
								for(let j = 0;j<_this.departmentUserArray.length;j++){
									if(_this.departmentUserArray[j] === _this.departmentUserIdArray[i].trueName){
										_this.departmentUserIndex = parseInt(j);  //这里安卓端出现了点问题，当j为0时无法渲染数组，所以在视图层加了为0时的直接渲染
									}
								}
							}
			  			}
						
			  		   _this.departmentId = departmentId;
					   _this.userId = userId;
			  		   _this.getChartData(sprintId,_this.projectId,userId,departmentId); 
			  		}else if(_this.roleId===3){
			  			_this.departmentIndex = _this.departmentArray.length-1;
			  			_this.departmentUserIndex = _this.departmentUserArray.length-1;
			  			_this.getChartData(sprintId,_this.projectId,userId,departmentId); 
			  		}
			  	}
			  })
			   
			},
			
			
			getDepartmentArray:function(projectId) {
				_this = this;
				return new Promise(resolve=>{
					uni.request({
						url: `${queryDepartmentByProjectId}?projectId=${projectId}`,
						method: "POST",
						data: {},
						header: {
							'ContentType': 'application/json'
						},
						success: (res) => {
							if (res.data.code === 200) {
								//console.log("根据项目id寻找到的",res)
								let departmentArray = [];
								let departmentIdArray = [];
								for (var i = 0; i < res.data.data.length; i++) {
									if(departmentArray.length){
										let jude = 0;    //用于判断是否有一样的专业
										for(let j = 0;j<departmentArray.length;j++){
											if(res.data.data[i].departmentName === departmentArray[j]){
											  	jude = 1;
											}
										}
										if(!jude){
											departmentArray.push(res.data.data[i].departmentName)
											departmentIdArray.push(res.data.data[i])
										}
									}else{
									  departmentArray.push(res.data.data[i].departmentName)
									  departmentIdArray.push(res.data.data[i])
									}
								} 
								departmentArray.push("全部");
								_this.departmentIdArray = departmentIdArray;
								_this.departmentArray = departmentArray;
								console.log(departmentArray);
								console.log(_this.departmentIdArray);
								resolve();
							}
						}
					});
				})
			},
			
			getSprintArray:function(projectId) {
				_this = this;
				return new Promise(resolve=>{
					uni.request({
						url: `${sprintQuery}`,
						method: "POST",
						data: {
							"pageNum": 0,
							"pageSize": 1000,
							"projectId": projectId
						},
						header: {
							'ContentType': 'application/json'
						},
						success: (res) => {
							console.log(res)
							if (res.data.code === 200&&res.data.data.records.length) {
								_this.isShowInfo = true;
								let sprintArray = [];
								for (var i = 0; i < res.data.data.records.length; i++) {
									sprintArray[i] = res.data.data.records[i].sprintName
								}
								_this.sprintArray = sprintArray;
								_this.sprintIdArray = res.data.data.records;
								console.log(sprintArray);
								console.log(res.data.data.records)
								resolve();
							}else{
							  _this.isShowInfo = false;
							  _this.sprintArray = [];
							  resolve();
							}
						},
						fail:(Error)=>{
							uni.showToast({
								title:"网络错误",
								icon:"none",
								duration:1000
							})
						}
					});
				})
			},
			
			getDepartmentAllUserArray:function(projectId){      
				_this = this;
				return new Promise(resolve=>{
					uni.request({
						url:userProjectDepartmentQuery,
						method:"POST",
						data:{
							projectId:projectId
						},
						dataType:'json'
					})
					.then(data=>{
						let departmentUserArray = [];
						for(let i = 0;i<data[1].data.data.records.length;i++){
							departmentUserArray.push( data[1].data.data.records[i].trueName)
						}
						departmentUserArray.push("全部");
						_this.departmentUserArray = departmentUserArray;
						_this.departmentUserIdArray = data[1].data.data.records;   //存放所有
					    console.log(departmentUserArray);
						console.log(data[1].data.data.records)
						resolve();
					})
				})
			},
			
			//冲刺改变
			sprintPickerChange: function(e) {
				let index = parseInt(e.target.value);
				this.chooseIndex = "";
				this.chooseTaskId = "";
				
				this.sprintIndex = index;
				let userId = this.userId;
				let departmentId = this.departmentId;
				let sprintId = "";
				console.log('切换的冲刺', this.sprintArray[index]);
				
				for(let i = 0;i<this.sprintIdArray.length;i++){
					if(this.sprintIdArray[i].sprintName === this.sprintArray[index]){
					   sprintId = this.sprintIdArray[i].id;
					   this.sprintId = sprintId;
					}
				}
				console.log("发送请求的数据",sprintId,this.projectId,userId,departmentId)
			    this.getChartData(sprintId,this.projectId,userId,departmentId);
			},
			
			
			//专业改变
		    departmentPickerChange: function(e) {   //看整个项目的进入就选择专业为全部
				let index = parseInt(e.target.value);
				this.chooseIndex = "";
				this.chooseTaskId = "";
				this.departmentIndex = index;   
				console.log('切换的专业', this.departmentArray[index]);
				let sprintId = this.sprintId;
				let departmentId = "";
				let userId = "";
				let departmentUserArray = [];
				if(this.departmentArray[index] === "全部"){       //全部就显示全部的人
					departmentId = "";
					for(let i = 0;i<this.departmentUserIdArray.length;i++){
						departmentUserArray.push(this.departmentUserIdArray[i].trueName)
					}
				}else{
					for(let i = 0 ;i<this.departmentIdArray.length;i++){      //并且根据专业得到新的departmentUserArray和departmentUserIdArray
						if(this.departmentIdArray[i].departmentName === this.departmentArray[index]){
							departmentId = this.departmentIdArray[i].id;
							for(let j = 0;j<this.departmentUserIdArray.length;j++){      //改变专业可选的人的列表
								if(this.departmentUserIdArray[j].departmentId === departmentId){
								    departmentUserArray.push(this.departmentUserIdArray[j].trueName);	
								}
							}
						}
					}
				}
				
				console.log("发送请求的数据",sprintId,this.projectId,userId,departmentId)
				departmentUserArray.push("全部");
				let  len = departmentUserArray.length-1;
				this.departmentUserArray = departmentUserArray;        //改变专业可选的人
				this.departmentUserIndex = len;                        //并且一开始改变为全部
				this.departmentId = departmentId;
				this.getChartData(sprintId,this.projectId,userId,departmentId);
			},
			
			//专业人的改变
			departmentUserPickerChange:function(e){
				this.chooseIndex = "";
				this.chooseTaskId = "";
				let index = e.target.value;
				this.departmentUserIndex = index;
				console.log("获取值",this.departmentUserArray[index]);
				let sprintId = this.sprintId;
				let departmentId = "";
				
				let userId = "";
				if(this.departmentUserArray[index]==="全部"){
					userId = "";
				}else{
				    for(let i = 0;i<this.departmentUserIdArray.length;i++){           //这里先不考虑重名的
				    	if(this.departmentUserIdArray[i].trueName === this.departmentUserArray[index]){
				    		userId = this.departmentUserIdArray[i].userId;
							departmentId = this.departmentUserIdArray[i].departmentId;
				    	}	
				    }
					
					//跳到该人的专业
				    for(let i = 0;i<this.departmentIdArray.length;i++){
						if(departmentId === this.departmentIdArray[i].id){
							for(let j = 0;j<this.departmentArray.length;j++){
								if(this.departmentIdArray[i].departmentName===this.departmentArray[j]){
									this.departmentIndex = j;
								}
							}
						}
					}
					
				}
				console.log("发送请求的数据",sprintId,this.projectId,userId,departmentId)
				this.userId = userId;
				this.departmentId = departmentId;
				this.getChartData(sprintId,this.projectId,userId,departmentId);
			},
			
			
			scroll: function(e) {
				var scrollLeft = e.detail.scrollLeft;
				this.setData({
					scrollLeft: scrollLeft
				})
				console.log(scrollLeft)
			},
			
			showLineA:function(canvasId, chartData) {
				_this = this;
				canvaLineA = new uCharts({
					$this: _this,
					canvasId: canvasId,
					type: 'line',
					enableScroll: false, //可拖动
					fontSize: 11,
					legend:true,
					dataLabel: false,
					dataPointShape: true,
					background: '#21242E',
					pixelRatio: _this.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type: 'grid',
						disableGrid: true,
						dashLength: 8,
						scrollShow: true,
						fontColor: '#05E0FC',
						rotateLabel:true,
						labelCount:15
					},
					yAxis: {
						title: '预估剩余时间（小时）',
						titleFontColor: 'white',
						gridType: 'solid',
						gridColor: '#CCCCCC',
						splitNumber: 8, //y轴网格的数量
						fontColor: '#05E0FC',
						format: (val) => {
							return val.toFixed(0)
						}
					},
					width: _this.windowWidth,
					height: _this.cHeight * _this.pixelRatio,
					extra: {
						line: { 
							type: 'straight'
						},
						tooltip:{
							bgColor:'#000000',//主体背景颜色
							bgOpacity:0.7,//背景颜色透明度
							gridType:'dash',//辅助线类型（虚线）
							dashLength:5,//虚线单段长度
							gridColor:'#1890ff',//辅助线颜色
							fontColor:'#FFFFFF',//主体文字颜色
							labelBgColor:'#DFE8FF',//标签背景颜色
							labelBgOpacity:0.95,//背景颜色透明度
							labelFontColor:'#666666'//标签文字颜色
						}
					}
				});

			},
			
			touchLineA:function(e) {
				_this = this;
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					} 
				});
			},
			
			//跳转评论页面
			toComment:function(){
				_this = this;
				if(_this.isShowInfo){
					uni.navigateTo({
						url:`../comment/comment?sprintId=${this.sprintId}`
					})
				}else{
					uni.showToast({
						title:"请先添加冲刺",
						duration:1000,
						icon:"none"
					})
				}
			},
			
			//用于判断当前冲刺是否在时间段内,以及是本人的任务
			toJude:function(task,callback){
				_this = this;
				let nowTime = formatDate(new Date());
				let sprintStartTime;
				let sprintEndTime;
				for(let i = 0;i<_this.sprintIdArray.length;i++){
					if(_this.sprintIdArray[i].id === _this.sprintId){
						sprintStartTime = _this.sprintIdArray[i].startTime;
						sprintEndTime = _this.sprintIdArray[i].endTime;
					}
				}
				compareTime(sprintStartTime,sprintEndTime,nowTime,(jude)=>{
					if(jude&&parseInt(task.taskExecuteUserId)===_this.userInfo.id){
						callback(true)
					}else{
						callback(false)
					}
				})
			},
			
			//更新每天的工时
			dateWorkAdd:function(e){
				_this = this;
				let task = JSON.parse(e.target.id);
				console.log("选中的更新的任务",task)
				_this.toJude(task,(jude)=>{
					if(jude){
						console.log(jude)
						let item = {
							projectId:_this.projectId,
							taskId:task.taskId,
							sprintId:task.sprintId,
						    departmentId:task.departmentId,
							taskOrder:task.taskOrder,
							taskName:task.taskName,
							actualWorkingHours:task.actualWorkingHours
						}
						uni.navigateTo({
							url:`../dateWork/dateWork?item=${JSON.stringify(item)}`
						})
					}else{
						uni.showToast({
							title:"不能修改",
							duration:500,
							icon:"none"
						})
					}
				})
			},
			
			//改变优先级
			toChangePriority:function(e){
				_this = this;
				let task = JSON.parse(e.target.id);
				_this.toJude(task,(jude)=>{
					console.log(jude)
					if(jude){
						let taskId = task.taskId;
						uni.navigateTo({
							url:`../updateRedictTime/updateRedictTime?enter=2&taskId=${taskId}`
						})
					}else{
						uni.showToast({
							title:'不能修改',
							icon:"none",
							duration:500
						})
					}
				})
			},
			
			//改变预估工时
			toChangePredictTime:function(e){
				_this = this;
				let task = JSON.parse(e.target.id);
				_this.toJude(task,(jude)=>{
					if(jude){
						console.log(jude)
						let taskId = task.taskId;
						uni.navigateTo({
							url:`../updateRedictTime/updateRedictTime?enter=1&taskId=${taskId}`
						})
					}else{
						uni.showToast({
							title:'不能修改',
							icon:"none",
							duration:500
						})
					}
				})
			},
			
			//查看日报              汇总今天打卡的任务的日报
			toLookDayNote:function(e){
				_this = this;
				let date = e.target.id;
				console.log("日报日期:",date);
				let content = [];
				for(let i = 0;i<_this.task.length;i++){
					if(_this.task[i].dateWorks.length){
						for(let j = 0;j<_this.task[i].dateWorks.length;j++){
							if(date === _this.task[i].dateWorks[j].date){   
							   let dayNote = { 
								   name:_this.task[i].taskExecuteTrueName,
								   noteAndCompletionDegree:_this.task[i].dateWorks[j].note+" "+_this.task[i].dateWorks[j].completionDegree,
							   }
							   content.push(dayNote); 
							}
						}
					}
				}
				let showNote = "";
				let content2 = [];         //将每个人的所有任务的日报汇总成一个对象,每个人的日报自动加名字
				for(let i = 0;i<content.length;i++){
					if(content2.length){
						let jude = true;         //判断量是否能找到
						for(let j = 0;j<content2.length;j++){
							if(content[i].name===content2[j].name){
								jude = false;
								content2[j].noteAndCompletionDegree = content2[j].noteAndCompletionDegree+"\r\n"+content[i].noteAndCompletionDegree
							}
						}
						if(jude){
							let item = {
								name:content[i].name,
								noteAndCompletionDegree:content[i].noteAndCompletionDegree
							}
							content2.push(item);
						}
					}else{
						let item = {
							name:content[i].name,
							noteAndCompletionDegree:content[i].noteAndCompletionDegree
						}
						content2.push(item);
					}
					
				}
				
				for(let i = 0;i<content2.length;i++){
				    showNote += content2[i].name+'\r\n'+content2[i].noteAndCompletionDegree+'\r\n';
				}
				uni.showModal({
					title:`${date}日报`,
					content:`${showNote}`,
					confirmColor:"#4CD964",
					cancelColor:"#DD524D",
					success:(res)=>{
						if(res.confirm){
							
						}else if(res.cancel){
							
						}
					}
				})
			},
			
			//获取详细任务信息的请求
			queryDateWorkInnerTask:function(sprintId,projectId,userId,departmentId){
				_this = this;
				console.log("查询任务的条件",sprintId,projectId,userId,departmentId);
				uni.request({
					url:taskQuery,
					method:'POST',
					data:{
						sprintId:sprintId,
						projectId:projectId,
						taskExecuteUserId:userId,
						departmentId:departmentId, 
						isReview:1,
						pageNum:0,
						pageSize:_this.pageSize                         
					},
					dataType:'json'
				})
				.then(data=>{
					console.log("查询到的任务",data[1].data.data.records)
					let dateWorks = [];                          //这个数组的长度等于任务的长度
					let task = data[1].data.data.records;
					for(let i = 0;i<task.length;i++){
				        if(task[i].dateWorks.length){
							for(let j = 0;j<task[i].dateWorks.length;j++){ //对2019-1-1的时间格式进行转换成0101格式
							  let time = task[i].dateWorks[j].date.split('-');
							  task[i].dateWorks[j].date = time[1]+time[2];
							}
						}else{                        //在dateWork中没有数据的时候
						
						}
						task[i].taskId = task[i].id;  
					}
					
					//构造二维数组（父数组长度为日期的长度、子数组长度为任务的长度。）
					for(let i = 0;i<_this.dateWorkArray.length;i++){
						let array = [];
						for(let j = 0;j<task.length;j++){
							if(task[j].dateWorks.length){        //打过卡的任务
							   let jude = 1;                     //一个判断量，看看这天有没有打卡
							   for(let k = 0;k<task[j].dateWorks.length;k++){                  
							   	if(_this.dateWorkArray[i] === task[j].dateWorks[k].date){
								   array.push(task[j].dateWorks[k].workTime); 
								   jude = 0;	     
								 }
							   }
							   if(jude){               //这天有了就不会再进入(任务打过卡,但是只是不是这天)
								   array.push(0);
							   } 
							}else{  //没有打卡的直接为0
							   array.push(0);
							}
						}
						dateWorks.push(array);
					}
					
					_this.task = task; 
					_this.dateWorks = dateWorks;
					// console.log(task);
					// console.log(_this.dateWorkArray);
					// console.log(dateWorks);
					_this.toJudeTaskStateAndSprintState();                  //冲刺、任务状态、进度条、冲刺目标
				})
				.catch(Error=>{
					console.log(Error) 
					uni.showToast({
						title:"网络错误",
						duration:500,
						icon:'loading'
					})
				})
			},
			
			//判断冲刺状态还有任务状态以及显示冲刺的目标的函数计算完成度的函数。
			toJudeTaskStateAndSprintState:function(){
				_this = this;
			    let nowTime = new Date(Date.parse(formatDate(new Date()).replace(/\-/g,'/')));
				let sprintTarget;
			    let sprintStartTime;
			    let sprintEndTime;
				let taskState = "已完成";
				let sprintState;
				let finishActualWorkingHours = 0;          //已完成的实际工时
				let unfinishActualWorkingHours = 0;        //未完成和进行中实际工时
			    let unfinishPredictTime = 0;               //未完成和进行中的预估
				let completionDegree;                       //完成度
				
			    for(let i = 0;i<_this.sprintIdArray.length;i++){
			    	if(_this.sprintIdArray[i].sprintName === _this.sprintArray[_this.sprintIndex]){
			    		sprintStartTime = new Date(Date.parse(_this.sprintIdArray[i].startTime.replace(/\-/g,'/')));
			    		sprintEndTime = new Date(Date.parse(_this.sprintIdArray[i].endTime.replace(/\-/g,'/')));
						sprintTarget = _this.sprintIdArray[i].sprintTarget;
			    	}
			    }
				if(nowTime>sprintEndTime){
					sprintState = "已完成";
				    for(let i = 0;i<_this.task.length;i++){
				    	if(_this.task[i].taskState == 0){
				    	   taskState = "未完成"
				    	}
				    }	
				}else if(nowTime<=sprintEndTime&&nowTime>=sprintStartTime){
				    sprintState = "进行中";
					taskState = "进行中";
				}else if(nowTime<sprintStartTime){
					sprintState = "未开始";  
					taskState = "未开始"
				}
				
				for(let i = 0;i<_this.task.length;i++){
					switch(_this.task[i].taskState){
						case 0 :
						  unfinishPredictTime = parseFloat(_this.task[i].taskPredictTime)+parseFloat(unfinishPredictTime);
						  unfinishActualWorkingHours = parseFloat(_this.task[i].actualWorkingHours) + parseFloat(unfinishActualWorkingHours);
						  break;
						case 1 :
						  finishActualWorkingHours = parseFloat(_this.task[i].actualWorkingHours) + parseFloat(finishActualWorkingHours);
						  break;
						//中止  
						case 2:      
						  break;
						case 3:
						  unfinishPredictTime = parseFloat(_this.task[i].taskPredictTime) + parseFloat(unfinishPredictTime);
						  unfinishActualWorkingHours = parseFloat(_this.task[i].actualWorkingHours) + parseFloat(unfinishActualWorkingHours);
						  break;
						 default:
						  break;
					}
				}
				console.log(unfinishActualWorkingHours,finishActualWorkingHours,finishActualWorkingHours,unfinishPredictTime);
			    completionDegree = (parseFloat((unfinishActualWorkingHours+finishActualWorkingHours)/(finishActualWorkingHours+unfinishPredictTime))*100).toFixed(2);
				_this.taskState = taskState;
				_this.sprintState = sprintState;  
				_this.sprintTarget = sprintTarget;
				_this.completionDegree = completionDegree
				console.log(taskState,sprintState,sprintTarget,completionDegree);
			},
			
			//下拉触底加载更多的任务
			// loaderMoreTask:function(){
			// 	_this = this;
			// 	if(_this.task.length<_this.pageSize){
			// 		uni.showToast({
			// 			title:"已经到底了",
			// 			duration:500,
			// 			icon:"none"
			// 		})
			// 	}else{
			// 		_this.pageSize +=5;
			// 		_this.queryDateWorkInnerTask(_this.sprintId,_this.projectId,_this.userId,_this.departmentId)
			// 	}
			// }
		}
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}
	.picture{
		width: 100%;
	}
    .pickerList{
		height: 100upx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-top: 5upx;
	}
	.pickerList view {
		height: 50upx;
		color: #F0F8FF;
		width: 20%;
		font-size: 13px;
		background-color: #05E0FC;
		text-align: center;
		border-radius: 4%;
	}
	.pickerList view text{
		font-size: 12px;
		color: #F0F8FF;
		line-height: 50upx;
        flex-wrap: wrap;
	}
	.pickerList view picker{
		line-height: 50upx;
	}
	.charts {
		width: 730upx;
		height: 500upx;
		background-color: transparent;
	}

	.bookshelf-content {
		white-space: nowrap;
		width: 100%;
	}

	.my-button {
		margin-left: 1rem;
		font-size: 12px;
		color: white;
		background-color: rgb(71, 84, 103);
		border-radius: 5px;
		width: 90%;
	}
	.sprintStatus{
		display: flex;
		flex-direction: column;
		width: 100%;
		font-size: 12px;
		color: #F0F8FF;
	}
	.status{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 50upx;
	}
	.progress{
		margin-top:15upx;
		display: flex;
		flex-direction: column;
		height: 100upx;
	}
	.progress text{
		width: 100%;
		height: 50upx;
		line-height: 50upx;
	}
	.progress progress{
		width: 70%;
		margin-top: 10upx;
		font-size: 8px;
	    border-radius: 20upx; 
	}
	.progress-item{
		width:85%;
	}
	.all{
		margin-top: 30upx;
		background-color: transparent;
		width: 100%;
		display: flex;
		flex-direction: row;
	}
	::-webkit-scrollbar{
		width: 4upx;
		height: 6upx;
	}
	.task{
		display: flex;
		flex-direction: row!important;
		justify-content: flex-start;
	}
	.task view{
	    display: flex;
		flex-direction: column;
		text-align: center;
	}
	.task view text{
		 font-size: 13px;  
		 color: #F0F8FF;
		 white-space: nowrap;
		 padding: 5upx;
		 border: 1upx solid #C8C7CC;
	}
	.task view view text{
		font-size: 12px;
		color: #F0F8FF;
		border: 1upx solid #C8C7CC;
	}
	
	/*选中变色*/
	.chooseTaskId{
		background-color: #DED8D8!important;
	}
	
	.date{
	  display: flex;
	  flex-direction: column!important;
	}
	.date text{
		border: 1upx solid #C8C7CC;
		display:inline-block;
		white-space: nowrap;
	}
	.dateWorkTime{
		display: flex;
		flex-direction: column!important;
	}
	
	.title{
		background-color: #05E0FC;
		height: 20px;
		line-height: 20px;
		font-weight: 600;
		border: 2px solid #C8C7CC;
	}
</style>
