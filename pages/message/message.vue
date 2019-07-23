<template>
	<scroll-view scroll-y="true" class="all">
		
		<!--当为权限1的时候显示的是审核查看项目的人的选项-->
		<block v-if="roleId===1">
			<view class="applyMessage"> 
				<text id="title">待审核的申请:</text>
				<view  v-for="(item,index) in allNotAudited" 
				       :key="index" 
				       class="eachOneApply" 
				       @click="showAudited"
					   :id="JSON.stringify(item)"
			    >
					<uni-card 
					    :title="'项目编号:'+item.projectName" 
					    :note="'申请的时间 '+item.effectiveTime" 
					>
					   <view id="content"> 
					       <text>申请人:{{item.trueName}}</text>
						   <text>申请理由:{{item.content}}</text>
					   </view>
					</uni-card>
				</view>
			</view>
		</block>
		
		<!--当权限为2的时候显示的是审核通过的任务--> 
	    <block v-if="roleId===2">
			<view class="task">
				<text id="title">任务进度消息:</text>
				<view class="taskMessage" v-for="(item,index) in myTaskMessage" :key="index">
					<uni-card 
						:title="item.content" 
						:note="'通过时间 '+item.createTime" 
					>
					</uni-card>
				</view>
			</view>
		</block>
			
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	
	//引入查找申请记录的api
	import {roleApplyQuery,messageQuery} from '../../static/utils/api.js';
	
	//引入uni-card
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue"
	
	const Login = new login();
	const Query = new query();
	var _this;
	export default {
		components: {uniCard},
		components: {uniNoticeBar},
		data() {
			return {
				userInfo:" ",  
				projectId:" ",
				roleId:" ",
				allNotAudited:[],          //存放所有的未审核的项目
				
				myTaskMessage:[],                     //存放
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
						  // console.log("查询到的用户的信息",data)
						   _this.userInfo = data.data.records[0];
						   uni.getStorage({
						  	 	key:"nowInProject",
						  	 	success:(res)=>{
						  	 		_this.projectId = res.data.projectId; 
									_this.roleId = res.data.roleId;      //进行相关权限的获取
									if(_this.roleId===1){                //当为1权限的时候，消息中心获取的是申请查看项目的信息 2权限的时候为审核通过和未通过的任务
									  _this.getNotAuditedRole1();
									}else if(this.roleId===2){
									  _this.getTaskMessage();           //获取任务审核状态的消息	
									}
						  	 	}
						  	 })	
						 })
				},
				fail:()=>{
					url:'../login/login'
				}
			})
		},
		onPullDownRefresh(){
			_this = this;
			if(_this.roleId===1){               
			  _this.getNotAuditedRole1();
			}else if(this.roleId===2){
			  _this.getTaskMessage();          
			}
		},
		methods: {	
			
		 //onPullDownRefresh
	     reRresh:function(){
			 this.onShow();
		 },
		 
		 //当进入这个消息中心的为项目的负责人的时候根据projectId和state为0去查找
		 getNotAuditedRole1:function(){
			 _this = this;
			 console.log('本项目',_this.projectId)
			 uni.showLoading({
			 	title:'获取中',
				success:()=>{
					uni.request({
					url:roleApplyQuery,
					method:"POST",
					data:{
					  projectId:_this.projectId,
					  state:0
					 },
					 dataType:'json'
					}) 
					.then(data=>{
					 console.log("获取到的数据",data)
					  uni.hideLoading();
					  _this.allNotAudited = data[1].data.data.records;
					})
					.catch(error=>{
					  uni.hideLoading();
					  uni.showToast({
					  	title:"获取失败",
						icon:"none",
						duration:1000
					  })
					})	
				}
			 })
		 }, 
		 
		 //点击进行审核
		showAudited:function(e){
			console.log(e);
			let chooseItem = e.currentTarget.id;
			uni.navigateTo({
				url:`../auditedRoleApply/auditedRoleApply?chooseItem=${chooseItem}`
			})
		},
		
		 //当进入这个消息中心的为工程师的时候内容显示为任务审核的部分
		//进行查找消息，即工程师的添加的任务的审核的状态的提醒。
	    getTaskMessage:function(){
			_this = this;
			uni.showLoading({
				title:'查找中',
				success:()=>{
					uni.request({
						url:messageQuery,
						method:"POST",
						data:{
							messageTo:_this.userInfo.id,
							isLook:1
						},
						dataType:'json' 
					})
					.then(data=>{
						uni.hideLoading()
					    console.log(data)
						console.log('查找成功',data[1].data.data.records);
						_this.myTaskMessage = data[1].data.data.records;
					})
					.catch(Error=>{
						uni.showToast({
							title:"查找失败",
							icon:"none",
							duration:1000
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
	height: auto;
	width: 100%;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
#title{
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size:30upx;
	font-weight: bold;
	background-color: #6198C1;
}
.applyMessage{
	display: flex;
	flex-direction: column;
}

.eachOneApply{
	width: 100%;
	display: flex;
	flex-direction: column;
	border-radius: 5%;
	margin-top:10upx;
	font-size:30upx
}

#content{
    width: 100%;
	font-size: 30upx;
	border-radius: 5%;
	margin-top: 15upx;
	display: flex;
	flex-direction: column;
}

.task{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.taskMessage{
	width: 100%;
	height: 150upx;
	margin-top: 10upx;
}

</style>
