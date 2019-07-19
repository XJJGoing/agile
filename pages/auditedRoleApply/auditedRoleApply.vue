<template>
	
	<view class="all">
		<view class="chooseTime">
		   <view>申请时间:{{chooseItem.effectiveTime}}</view>
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
					 type="button"
			  >
			  </input>
		   </view>
		   
		</view>
		<view class="buttonAll">
			<button type="warn" @click="examine" :id="2">不通过</button>
			<button type="primary" @click="examine" :id="1">通过</button>
		</view>
	</view>
	
</template>
 
<script>
	var _this = this;
	
	//引入更新申请状态的记录
	import {updateRoleApply,userProjectRoleAdd} from '../../static/utils/api.js';
	
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
        components:{
           wPicker
        },
		data(){
        return {
            chooseTime:"",    //设置的时间
			chooseItem:"",   //选中的项目
        }
      },
	  onLoad(e){;
	  	console.log(e);
	  	console.log(e.chooseItem);
	  	this.chooseItem = JSON.parse(e.chooseItem);
	  	console.log(this.chooseItem);
	   },  
	   
	   methods: {
		   
		   //显示时间选择器
			isDisplay:function(){
				this.$refs.picker.show();
			},
			
			//监听时间选择器拿到的东西
			chooseDate:function(e){
				console.log("拿到的时间",e)
				this.chooseTime = e.result;
			},
			
			//进行审核
			examine:function(e){  //通过和不同过监听同一个函数根据id去判断进而实现通过和不通过
			    _this = this;
				console.log(e.currentTarget.id);
				let state = parseInt(e.currentTarget.id);
				console.log(state);
			    let roleId;
				if(state===1){
					roleId = 3;
				}else{
					roleId = ""
				}
				_this = this;
				if(_this.chooseTime!=""){
					let data = [{
						        id:_this.chooseItem.id,
						  		effectiveTime: _this.chooseTime,
						  		projectId: _this.chooseItem.projectId,
						  		roleId:roleId,
						  		state: state,
						  		userId: _this.chooseItem.userId
						  	  }]
					console.log("提交的数据",data)
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
						  		roleId:roleId,
						  		state: state,
						  		userId: _this.chooseItem.userId
						  	  }],
						  	dataType:'json'
						   })
						  .then(data=>{
						    uni.hideLoading();
						  	console.log(data);
						  	console.log("更新成功")
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
					//在此提交向t_user_project_role中插入数据
					if(state===1&&roleId===3){
						_this.addUserProjectRole();
					}
					
				}else{
					uni.showToast({
						title:"请选择截止时间",
						icon:"none",
						duration:1000
					})
				}
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
						  uni.hideLoading();
					  })
					  .catch(error=>{
						  uni.showToast({
						  	title:"提交失败",
							duration:1000,
							icon:"none"
						  })
					  })
					}
				})
			}
            
	 },	
}
</script>

<style>
.all{
	width: 100%;
	height:auto;
	background-color: #F0F8FF;
}
.buttonAll{
	height: 100upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.chooseTime{
	height: 300upx;
	width: 100%;
	background-color: #007AFF;
	font-size: 30upx;
}

.redictTime{
	margin-top: 20upx;
	height: 200upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.redictTime text{
	height: 100upx;
	font-size: 40upx;
	line-height: 100upx;
	font-size: 30upx!important;
}

.buttonAll button{
	height: 80upx;
	width: 200upx;
	font-size:30upx;
	line-height:80upx ;
}
.pickerInput{
	border: 1px solid #19BE6B;
	height:100upx ;
	border-radius: 2%;
	width: 400upx;
}


</style>
