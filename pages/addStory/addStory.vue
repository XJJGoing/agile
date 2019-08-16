<template>
  <view>
	<view class="add-story">
		<text class="title">增加用户故事:</text>
		
	    <view>
		   <text>内容:</text>
		   <input placeholder="请输入用户故事" :style="{width:width+'px'}" v-model="content"/>
	    </view>
		
		<view>
			<text>时间:</text>
			<input placeholder="选择时间"  :style="{width:width+'px'}" @click="openPicker" disabled="true"/>
		</view>
		
		<button @click="submit" class="btn">提交</button>	
		
	</view>
		<view  style="height: 100upx;width: 100%;">
			<w-picker 
				 mode="date" 
				 startYear="2019" 
				 endYear="2030"   
				 :current="true" 
				 @confirm="onConfirm" 
				 ref="picker1"
			 >
			 </w-picker>
		</view>
  </view>	
  
</template>

<script>
	import wPicker from '../../components/w-picker/w-picker.vue';
	var _this;
	export default {
		components:{
			wPicker,
		},
		data() {
			return {
				projectId:"",
				width:"",        ///设置输入框的长度
				content:"",      //故事的内容
			}
		},
		onLoad(){
			
		},
		onShow(){
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key:'nowInProject',
				success:(res)=>{
					_this.projectId = res.data.projectId;
				}
			})
		},
		methods: {
			
			//获取系统的信息  
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = res.windowWidth-parseInt(res.windowWidth*0.2);
					}
				})
			},
			
			
			openPicker:function(){
				this.$refs.picker1.show();
			},
			
			
			onConfirm:function(e){
				console.log(e);
				let chooseTime = e.result;
				_this.chooseTime = chooseTime;
			},
			
			
			
			
			//提交增加用户故事
			submit:function(){           //进行再次的确认提交
				_this = this;
				if(_this.content&&_this.storyTime){
					uni.showLoading({
						success:()=>{
							
						}
					})
				}else{
					uni.showToast({
						title:"请完善信息",
						duration:1000,
						icon:"none"
					})
				}
			}
			
		}
	}
</script>

<style>
.add-story{
	display: flex;
    flex-direction: column;
}
.title{
	height: 60upx;
	line-height: 60upx;
	font-size:30upx;
	font-weight: 600;
	color: #F0F8FF;
	background-color: #05E0FC;
	margin-top: 10upx;
}
.add-story view{
	display: flex;
	margin-top: 10upx;
	flex-direction: row;
	height: 70upx;
	width: 70upx;
	align-items: center;
	font-size: 30upx;
	width: 100%;
}
.add-story view text{
	width: 15%;
	text-align: center;
	color: #F0F8FF;
}
.add-story view input{
	color: #F0F8FF;
}
.btn{
	height: 60upx;
	line-height: 60upx;
	width: 50%;
	background-color: #5087BF;
	color: #F0F8FF;
    margin-top: 50upx;
}

</style>
