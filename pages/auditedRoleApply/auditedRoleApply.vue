<template>
	
	<view class="all">
		<view class="chooseTime">
		   <view class="title">申请时间:{{chooseItem.createTime}}</view>
           <view class="redictTime">
			  <text>截止时间:</text>
			  <w-picker
			          mode="dateTime"
					  startYear="2019"
					  endYear="2030"
					  @confirm="chooseDate"
					  current="true"
					  ref="picker"
			  >
			  </w-picker>
			  <input class="pickerInput" 
			         @click="isDisplay" 
					 placeholder="点击我选择" 
					 :value="chooseTime"
					 disabled="true"
					 :style="{width:width+'px'}"
			  >
			  </input>
		   </view>
		   
		</view>
			<view class="buttonAll">
				<form report-submit="true" @submit="examine">
				 <button type="warn"  form-type="submit" id="2">不通过</button>
				</form>
				<form report-submit="true" @submit="examine">	
				 <button type="primary" form-type="submit" id="1">通过</button>
				</form>
			</view>
	</view>
	
</template>
 
<script>
	var _this = this;
	
	//引入更新申请状态的记录
	import {updateRoleApply,
	        userProjectRoleAdd,
			roleApplyDeleteBatch,
			messageSend
		   } from '../../static/utils/api.js';
 	import {addFormId} from "../../static/utils/utils.js";
	import {formatDate} from "../../static/utils/time.js";
	
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
        components:{
           wPicker
        },
		data(){ 
        return {
			userInfo:"",       //用户的信息
		    width:"",         //输入框的长度
            chooseTime:"",    //设置的时间
			chooseItem:"",   //选中的审核的项目
        }
      },
	  onLoad(e){
		this.getSystem();
	  	this.chooseItem = JSON.parse(e.chooseItem);
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
					  _this.userInfo = data.data.records[0]
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
		   //获取系统信息
		   getSystem:function(){
			   _this = this;
			   uni.getSystemInfo({
			   	 success:(res)=>{
					 _this.width = parseInt(res.windowWidth)-70;
				 }
			   })
		   },
		   
		   //显示时间选择器
			isDisplay:function(){
				this.$refs.picker.show();
			},
			
			//监听时间选择器拿到的东西
			chooseDate:function(e){
				this.chooseTime = e.result;
			},
			
			//进行审核
			examine:function(e){  //通过和不同过监听同一个函数根据id去判断进而实现通过和不通过
			    _this = this;
				let nowTime = new Date(Date.parse(formatDate(new Date())));
				console.log(e)
				addFormId(_this.userInfo.openId,e.detail.formId);
				console.log(e.currentTarget.id);
				let state = parseInt(e.target.target.id);
				console.log(state);
			    let roleId;
				if(state===1){
					let roleId = 3;
					if(_this.chooseTime&&new Data(Date.parse(_this.chooseTime))>nowTime){
						console.log("提交的消息",{
									id:_this.chooseItem.id,
							  		effectiveTime: _this.chooseTime,
							  		projectId: _this.chooseItem.projectId,
							  		state: 1,
							  		userId: _this.chooseItem.userId
							  	  })
						uni.showLoading({
							title:"提交中",
							success:()=>{
							  uni.request({
							  	url:updateRoleApply,
							  	method:"POST",
							  	data:[{
									id:_this.chooseItem.id,
							  		effectiveTime: _this.chooseTime,
							  		projectId: _this.chooseItem.projectId,
							  		state: 1,
							  		userId: _this.chooseItem.userId,
							  	  }],
								  dataType:'json'
							   })
							  .then(data=>{
							    uni.hideLoading();
							  	  console.log(data);
							  	  console.log("更新成功");
							      _this.addUserProjectRole();       //增加权限以及推送消息
							   })
							   .catch(error=>{
							  	   uni.showToast({
							  			duration:1000,
							  		    title:"网络错误",
							  			icon:"loading"
							  	 })
							   })	  	
							 }
						})
						
					}else{
						uni.showToast({
							title:"请选择截止时间",
							icon:"none",
							duration:1000
						})
				    }
				}else if(state===2){   //不通过直接删除
					_this.deleteRoleApply();
					uni.navigateBack({
						delta:1
					})
				}
				
			},
			
			  
			//不通过的时候删除这条申请记录
			deleteRoleApply:function(){
				let id = [];
				id.push(_this.chooseItem.id)
				uni.showLoading({
					title:"提交中",
					success:()=>{
						uni.request({
							url:roleApplyDeleteBatch,
							method:"POST",
							data:id,
				            dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							console.log(data);
							uni.showToast({
								title:"提交成功",
								icon:'../../static/img/Icon/success.png',
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
			
			//审核查看的时候顺便在t_user_project_role中插入一条数组权限为3
			addUserProjectRole:function(){
				_this = this;
				let addData = {
					userId:_this.chooseItem.userId,
					roleId:3,
					projectId:_this.chooseItem.projectId,
				}
				console.log("提交的数据",addData)
				uni.showLoading({
					title:"提交中",
					success:()=>{
					  uni.request({
					  	url:userProjectRoleAdd,
						data:addData,
						method:"POST",
						dataType:'json'
					  })
					  .then(data=>{
						  console.log("插入成功",data);
						  _this.pushMessage();
					  })
					  .catch(error=>{
						  console.log(error)
						  uni.showToast({
						  	title:"提交失败",
							duration:1000,
							icon:"none"
						  })
					  })
					}
				})
			},
			
			//申请查看通过和不通过都将消息推送给用户
			pushMessage:function(){
				_this = this;
			    let time = formatDate(new Date());
				Query.findUser({id:_this.chooseItem.userId})
				.then(data=>{
				   let openId = data.data.records[0].openId;
				   console.log("推送给的用户的openId",openId)
				   uni.showLoading({
				   	title:"提交中",
					success:()=>{
						uni.request({
							url:messageSend,
							method:"POST",
							data:{
								"touser":openId,
								"template_id":"0FFMkBzLjvI51ZlVhuGj5eWPppXMWwJnc2xdI0E4Y5Y",
								"page":"pages/index/index",
								"formId":"",
								"data":{
									"keyword1": {
										"value": '您申请查看编号为 '+_this.chooseItem.projectName+'的项目申请已通过',
									},
									"keyword2": { 
										"value": "截止 "+time
									},
									"keyword3": {
										"value": "访问过程中请勿将内部数据透露。"
									},
									"emphasis_keyword": "keyword1.DATA"
								}
							}
						})
						.then(data=>{
							console.log("推送成功");
							uni.showToast({
								title:"提交成功",
								icon:'../../static/Img/Icon/success.png',
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
				})
			},
            
	 },	
}
</script>

<style>
.all{
	width: 100%;
	height:auto;
}

.chooseTime{
	display: flex;
	flex-direction: column;
	width: 100%;
	font-size: 30upx;
}
.title{
	margin-top: 10upx;
	font-weight: bold;
	color: #F1F1F1;
}
.redictTime{
	margin-top: 20upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.redictTime text{
	height: 100upx;
	font-weight: bold;
	margin-top: 50upx;
	width: 150upx;
	font-size: 30upx!important;
	color: #F1F1F1;
}
.pickerInput{
	height:100upx;
	color: #F1F1F1;
}
.buttonAll{
	height: 100upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}

.buttonAll button{
	height: 80upx;
	width: 200upx;
	font-size:30upx;
	line-height:80upx ;
}
#content{
	display: flex;
	flex-direction: column;
	margin-top: 10upx;
}


</style>
