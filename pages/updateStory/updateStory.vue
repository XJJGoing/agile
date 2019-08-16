<template>
  <view>
	<view class="add-story">
		<text class="title">修改用户故事内容:</text>
		
		<form report-submit="true" @submit="submit">
			<view>
			   <text>内容:</text>
			   <input placeholder="请输入用户故事" :style="{width:width+'px'}" @input="updateStory" :value="content"/>
			</view>
			
			<view>
				<text>时间:</text>
				<input placeholder="选择时间"  
					   :style="{width:width+'px'}" 
					   @click="openPicker" 
					   disabled="true" 
					   :value="storyTime"
				/>
			</view>
		 <button form-type="submit" class="btn">提交修改</button>
		</form>
		
		<form report-submit="true" @submit="addSprint">
			<view>
				<button form-type="submit" class="btn">添加冲刺</button>
			</view>	
		</form>
		
		<view class="choose-sprint">
			<!-- <text class="choose-sprint-title">添加冲刺:</text> -->
		</view>
	  
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
	import {addFormId} from '../../static/utils/utils.js';
	import {sprintQuery,
	        sprintUpdateBatch
			} from '../../static/utils/api.js';
	var _this;
	export default {
		components:{
			wPicker,
		},
		data() {
			return { 
				userInfo:"",
				story:"",                    //页面传输过来的用户故事
				projectId:"",
				width:"",                       ///设置输入框的长度
				content:"",                     //用户修改的故事
				storyTime:"",                   //修改的时间
		         
				 
					
			}
		},
		onLoad(e){   
			_this = this;
			console.log("更改的用户故事",JSON.parse(e.story));
			let story = JSON.parse(e.story);
		    _this.story = story;
			_this.content = story.story;
			_this.storyTime = story.storyTime;
			_this.getSystem();
			uni.getStorage({
				key:'nowInProject',
				success:(res)=>{
					_this.projectId = res.data.projectId;
					uni.getStorage({
						key:"userInfo",
						success:(res2)=>{
							_this.userInfo = res2.data; 
						}
					})
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
			
			
			//修改内容
			updateStory:function(e){
				this.story = e.detail.value;
			},
			
			
			
			openPicker:function(){
				this.$refs.picker1.show();
			},
			
			
			onConfirm:function(e){
				console.log(e);
				let chooseTime = e.result;
				_this.storyTime = chooseTime;
			},
			
			
			
			
			//提交修改用户故事的内容
			submit:function(e){           
				_this = this;
				addFormId(_this.userInfo.openId,e.detail.formId)
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
			},
			
			//在该用户故事下增加冲刺
			addSprint:function(e){
				_this = this;
				let storyId = _this.story.id;
				addFormId(_this.userInfo.openId,e.detail.formId);
				uni.navigateTo({
					url:`../addSprint/addSprint?storyId=${storyId}`
				})
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


/* .choose-sprint{
    display: flex;
	flex-direction: column!important;	
	height: auto!important;
    width: 100%;
	margin-top: 20upx!important;
	margin-bottom: 20upx;
}
.choose-sprint-title{
	width: 100%!important;
	height: 60upx!important;
	line-height: 60upx!important;
	text-align: left!important;
	background-color: #05E0FC;
}

.sprint-detail{
	width: 100%;
	display: flex;
	flex-direction: row!important;
	justify-content: flex-start;
	padding: 10upx;
	color: #F0F8FF;
	flex-wrap: wrap;
}
.sprint-detail label{
	margin: 0.5%;
} */
.btn{
	height: 60upx;
	line-height: 60upx;
	width: 50%;
	background-color: #5087BF;
	color: #F0F8FF;
	margin-top: 20px;
}

</style>

