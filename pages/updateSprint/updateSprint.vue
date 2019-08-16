<template>
  <view>
	<view class="sprintMessage" :style="{height:height+'px'}">
		<form report-submit="true" @submit="submit">
			<view>
				<text>冲刺目标:</text>
				<input :style="{width:width+'px'}" @input="inputSprintTarget" :value="sprintTarget"></input>
			</view>
			<view>
				<text>结束时间:</text>
				<input :style="{width:width+'px'}" @click="openPicker" disabled="true" :value="chooseTime"></input>
			</view>
			<button form-type="submit">提交</button>
		</form>
	</view>
	
    <view>
		<w-picker 
			 mode="date" 
			 startYear="2019" 
			 endYear="2030"   
			 :current="true" 
			 @confirm="onConfirm" 
			 ref="picker3"
		  >
		  </w-picker>
	</view>
	
 </view>	
</template>

<script>
	import {sprintUpdateBatch} from '../../static/utils/api.js';
	import {addFormId} from '../../static/utils/utils.js';
	import wPicker from "@/components/w-picker/w-picker.vue";
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	var _this;
	export default {
		components:{
			wPicker
		},
		data() {
			return {
				userInfo:"",
			    sprint:"",	
				width:"",         //设置输入框的长度
				height:"",
				sprintTarget:"",   
				chooseTime:"",   
			}
		},
		onLoad(e){
			_this = this;
			_this.getSystem();
			let item = JSON.parse(e.item);
			_this.sprint = item;
			_this.sprintTarget = item.sprintTarget; 
			_this.chooseTime = item.endTime;
			uni.getStorage({
				key:'userInfo',
				success:(res)=>{
					let id  = {id:res.data.id};
					Query.findUser(id)
					.then(data=>{
						_this.userInfo = data.data.records[0];
					})
					.catch(Error=>{
						uni.showToast({
							title:'网络错误',
							icon:"none",
							duration:500
						})
					})
				}
			})
		},
		methods: {
			
			inputSprintTarget:function(e){
				_this = this;
				//console.log(e.detail.value)
				let sprintTarget = e.detail.value;
				if(sprintTarget>20){
					uni.showToast({
						title:"长度不能超过20",
						duration:500,
						icon:"none"
					})
				}else{
				  _this.sprintTarget = sprintTarget;	
				}
			},
			
			openPicker:function(){
				_this.$refs.picker3.show();
			},
			
			onConfirm:function(e){
				console.log(e);
				_this.chooseTime = e.result;
			},
			
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = parseInt(res.windowWidth-res.windowWidth*0.3);
						_this.height = parseInt(res.windowHeight);
					}
				})
			},
			
			//进行冲刺的更新
			submit:function(e){
				_this = this;
				let formId = e.detail.formId;
				let openId = _this.userInfo.openId;
				addFormId(openId,formId);
				console.log("提交的信息",_this.chooseTime,_this.sprintTarget)
				if(_this.chooseTime&&_this.sprintTarget){
						uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:sprintUpdateBatch,
								method:"POST",
								data:[{
									id:_this.sprint.id,
									endTime:_this.chooseTime,
									sprintTarget:_this.sprintTarget
								}],
								dataType:'json'
							})
							.then(data=>{
								console.log("提交更新成功",data)
								uni.showToast({
									title:'修改成功',
									icon:"../../static/img/Icon/success.png",
									success:()=>{
										uni.navigateBack({
											delta:1
										})
									}
								})
							})
							.catch(Error=>{
								console.log(Error);
								uni.showToast({
									title:'网络错误,请稍后重试',
									icon:"loading",
									duration:1000
								})
							})
						}
					})
				}else{
					uni.showToast({
						title:"请完善修改信息",
						icon:"none",
						duration:500
					})
				}
			}
		}
	}
</script>

<style>
.sprintMessage{
	display: flex;
	flex-direction: column;
	margin-top: 20px;
}
.sprintMessage view{
	display: flex;
	flex-direction: row;
	height: 80upx;
	width: 100%;
	font-size: 14px;
	color: #F0F8FF;
	margin-top: 10px;
}
.sprintMessage view text{
	margin-left: 2%;
	height: 80upx;
	line-height: 80upx;
	width: 20%;
}
.sprintMessage view input{
	margin-left: 1%;
	height: 80upx;
	line-height: 80upx;
}
.sprintMessage button{
	width: 60%;
	height: 80upx;
	line-height: 80upx;
	background-color: #6CA0D9;
	margin-top: 30upx;
}
.wpicker{
	height: 400upx;
	width: 100%;
}
</style>
