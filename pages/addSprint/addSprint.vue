<template>
	<scroll-view class="all"
	             scroll-y="true"
    >
	
	<view class="hadSprint">
		<view class="titleView">
			<text class="title">现有冲刺:</text>
		</view>
		<block v-if='nowHadSprint.length!=0'>
			<view class="sprintNum" v-for="(item,index) in nowHadSprint" :key="index">
			  	<uni-card :title="item.sprintName"
					      :note="'创建时间:'+item.createTime"
				>
			  	 <view class="sprintDetail">
					 <text id="target">目标:{{item.sprintTarget}}</text>
					 <text id="startTime">启动时间:{{item.startTime}}</text>
					 <text id="endTime">截止时间:{{item.endTime}}</text>
				 </view>  
			  	</uni-card>
			</view>
        </block>
		<block v-else>
			<view>该项目下暂无冲刺</view>
		</block>
	</view>
	
		<view class="sprintMessage">
			<form report-submit="true" @submit="addSprint">
			<view class="titleView">
				<text class="title">添加冲刺:</text>
			</view>
			<view>
				<text>冲刺序号:</text>
				<input placeholder="请填入冲刺号(格式:冲刺1 冲刺2等)" @input="addSprintName"  :style="{width:width+'px'}"></intput>
		   </view>
		   <view>
			<text>冲刺目标:</text>
			<input placeholder="请填入冲刺的目标(20个字以内)"  :style="{width:width+'px'}" @input="addSprintTarget"></input>
		   </view>
		   <view class="chooseTime">
		   	  <text>启动时间:</text>
		      <input placeholder="点击选择冲刺启动时间"  :style="{width:width+'px'}" @click="openStartTimePicker" :value="startTime" disabled="true"></input>
		   </view>
		   <view class="chooseTime">
		   	  <text>截止时间:</text>
		      <input placeholder="点击选择冲刺截止时间"  :style="{width:width+'px'}" :value="endTime" @click="openEndTimePicker" disabled="true"></input>
		   </view>
		   
			<button class="submitButton" form-type="submit">提交</button>
			</form>
		</view>
		<view class="wpicker">
           	<w-picker 
				 mode="dateTime" 
				 startYear="2019" 
				 endYear="2030"   
				 :current="true" 
				 @confirm="onConfirm1" 
				 ref="picker1"
           	 >
           	</w-picker>
			
			<w-picker 
				 mode="dateTime" 
				 startYear="2019" 
				 endYear="2030"   
				 :current="true" 
				 @confirm="onConfirm2" 
				 ref="picker2"
           	  ></w-picker>		
		</view>
		
	</scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	const Login = new login();
	import {addFormId} from '../../static/utils/utils.js';
	import {sprintQuery,sprintAdd} from '../../static/utils/api.js';
	
	//引入时间选择器的插件
    import wPicker from "@/components/w-picker/w-picker.vue";
	import uniCard from "@/components/uni-card/uni-card.vue";
	
	var _this;
	export default {
		components:{
         wPicker,
		 uniCard
       },
		data() {
			return {
				width:"",         //用来设置输入框的长度
				userInfo:"",
				projectId:"",     //当前所在项目的projectId
				nowHadSprint:[],    
				sprintName:"",        //冲刺的序号.
				sprintTarget:"",       //冲刺的目标
				
			    startTime:"",       //启动时间
				endTime:"",          //截止时间 
			}
		},
		onShow(){
		  _this = this;
		  _this.getSystem();          //设置输入框的长度
		  uni.getStorage({
		  	key:"userInfo",
			success:(res)=>{
				console.log(res.data);
				let id = {
					id:res.data.id
				}
				return Query.findUser(id)
				.then(data=>{
					// console.log("用户的信息",data.data.records[0]);
					_this.userInfo = data.data.records[0];
					uni.getStorage({
						key:"nowInProject",
						success:(res)=>{
							_this.projectId = res.data.projectId;
						    _this.getHadProjectSprint();
						},
						fail:()=>{
							uni.redirectTo({
								url:'../apply/apply'
							})
						}
					})
				})
			 },
			 fail:(error=>{
				 uni.redirectTo({
				 	url:'../login/login' 
				 })
			 })
		  })
		},
		
		methods: {
			getSystem:function(){   //获取宽度，用来设置input出的长度
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
					   _this.width = parseInt(res.windowWidth)-90      //将剩余的作为input的宽度
					}
				})
			},
			
			//添加冲刺序号即名称
			addSprintName:function(e){
				 let reg = /冲刺(\d)+/g;
	            if(e.detail.value.length<=4&&reg.test(e.detail.value)){
				  this.sprintName = e.detail.value;
				}else{
					uni.showToast({
						title:"输入格式有误",
						duration:500,
						icon:"none"
					})
				}
			},
			
			//添加冲刺的目标
			addSprintTarget:function(e){
				if(e.detail.value.length<=20){
				  this.sprintTarget = e.detail.value	
				}else{
					uni.showToast({
						title:"长度过长",
						icon:"none",
						duration:500
					})
				}
			},
			
			//打开冲刺开始时间选择器:
			openStartTimePicker:function(){
				_this = this;
				_this.$refs.picker1.show();
			},
			
			//打开冲刺结束时间选择器
			openEndTimePicker:function(){
				_this = this
				_this.$refs.picker2.show();
			},
			
			//选冲刺启动的时间
			onConfirm1:function(e){
				console.log(e)
				this.startTime = e.result;
			},
			  
			//选择冲刺的截止时间
			onConfirm2:function(e){
				this.endTime = e.result;
			},
			
			//查询本项目已经有的冲刺。
			getHadProjectSprint:function(){
				  _this = this;
				uni.showLoading({
				  	 title:"获取中",
					 success:()=>{
						 uni.request({
							url:sprintQuery,
							method:"POST",
							data:{
								projectId:_this.projectId,
							},
							dataType:'json'
						 })
						 .then(data=>{
							 // console.log("返回的信息",data)
							 uni.hideLoading();
							  _this.nowHadSprint = data[1].data.data.records;
						 })
					     .catch(Error=>{
							 uni.showToast({
							 	title:"网络错误",
								icon:"none",
								duration:1000
							 })
						 })
					 }
				})
			},
			
			
			addSprint:function(e){
				_this = this;
				addFormId(_this.userInfo.openId,e.detail,formId)
				let jude;           //用来判断时间格式是否有误
                let startTime = new Date(Date.parse(_this.startTime));
				let endTime = new Date(Date.parse(this.endTime));
				if(startTime>=endTime){
					jude = false;
				}else{
					jude = true;
				}
				if(_this.sprintName&&_this.sprintTarget&&_this.startTime&&_this.endTime&&jude){
					uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:sprintAdd,
								method:"POST",
								data:{
									projectId:_this.projectId,
									sprintName:_this.sprintName,
									sprintTarget:_this.sprintTarget,
									startTime:_this.startTime,
									endTime:_this.endTime
								},
								dataType:'json'
								})
								.then(data=>{
									console.log("添加冲刺返回的信息",data);
									uni.hideLoading();
									uni.showToast({
										icon:'none',
									    title:"添加成功",
										duration:1000
									})
									_this.getHadProjectSprint()     //再次刷新调用这个获取该项目所有的冲刺		
								})
								.catch(error=>{
									uni.showToast({
										title:"网络错误",
										icon:'none',
										duration:1000
									})
								})				
						 }
				    })
				}else{
					uni.showToast({
						duration:500,
						icon:"none",
						title:"信息有误"
					})
				}
			}
		}
	}
</script>

<style>
.all{
	height: auto;
	overflow:scroll;
	margin-top: 20upx;
}
::-webkit-scrollbar{
    width: 2upx;
	height: 6upx;
}
.hadSprint{
	width: 100%;
	display: flex;
	flex-direction: column;
}

.titleView{
  width: 100%;
  height: 70upx!important;
  background-color:#6AA2D4;
  margin-left: 0upx;
  margin-bottom: 5upx;
}

.title{
	width: 100%;
	height: 70upx!important;
	line-height: 70upx;
	font-size: 35upx;
	font-weight: 500;
	text-align: left!important;
} 

.sprintNum{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items:center;
	margin-top:10upx;
    width: 100%;
}

.sprintDetail{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.sprintDetail text{
	height: 30upx;
	margin-top: 15upx;
	margin-left: 6upx;
	font-size: 30upx;
}
/*
#target{
	font-size:30upx;
}
#startTime{
	font-size:30upx;
}
#endTime{
	
}
*/

.sprintMessage{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10upx;
}
.sprintMessage view{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-top: 5upx;
	height: 100upx;
	width: 100%;
	padding: 10upx;
	color: #F8F1F3;
}

.sprintMessage view text {
    width: 160upx;
	font-size:30upx;
	margin-left: 10upx;
	text-align: center;
}
.sprintMessage view input{
	font-size:30upx!important;
	margin-left: 10upx;
	height: 80upx;
}
.wpicker{
	width: 100%;
	height: 600upx;
}

.submitButton{
	width: 60%;
	height: 80upx;
	border-radius:2%;
	margin-top: 10upx;
	background-color: #6AA2D4;
	color: #E9EFED;
}


</style>
