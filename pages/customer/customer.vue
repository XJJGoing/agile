<template>
	<view>
	  <block v-if="isCanLook">
		<view v-for="(item,index) in customerStory" :key="index" class="story-view">
			<uni-card 
				:title="'用户故事'+(index+1)" 
				:note="'创建时间:  '+item.storyTime"
				style="margin-top: 50upx;"
			>
			  <view class="story-detail" :id='JSON.stringify(item)' @click="updateStory">
				  需求:<text>{{item.story}}</text>
				  <view class="story-detail-title">
					  <view>
						   <text>冲刺</text>
						   <block v-for="(item2,index2) in item.sprintData" :key="index2">
							   <text>{{item2.sprintName}}</text>
						   </block>
					  </view>
					  <view>
					  		<text>预估工时</text>
							<block v-for="(item2,index2) in item.sprintData" :key="index2">
								<text>{{item2.predictTime}}</text>
							</block>
					  </view>
					  <view>
						  <text>实际工时</text>
						  <block v-for="(item2,index2) in item.sprintData" :key="index2">
						  	<text>{{item2.predictTime}}</text>
						  </block>
					  </view>
					  <view>
						  <text>冲刺状态</text>
						  <block v-for="(item2,index2) in item.sprintData" :key="index2">
							<text>{{item2.sprintState}}</text>
						  </block>
					  </view>	
				  </view>
			  </view>
			</uni-card>
		</view>
		
		<view class="add-story">
			<image src="../../static/img/add_story.png" @click="addStory"></image>
			<text>添加</text>
		</view>
	  </block>
	  
	  <block v-else>
		 无查看权限
	  </block>	  
	  
	</view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue";
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	var _this;
	export default {
		components:{
			uniCard
		},
		data() {
			return {
				userInfo:"",
				projectId:"",
			    roleId:"",  
				isCanLook:true,  //是否能查看本页面
				
				customerStory:[{
				 id:1,
				 storyTime:"2019-8-9",
				 story:"完成机器人的打磨程序的书写",
				 projectId:10,
				 sprintData:[]
				},{
				  id:2,
				  storyTime:"2019-8-9",
				  story:"完成机器人的打磨程序的书写", 	
				  projectId:10,
				  sprintData:[{
					  id:1,
					  sprintName:"冲刺1",
				      actualHours:120,
				  	  predictTime:150,
					  sprintState:'完成'
				  },{
					  id:2,
					  sprintName:"冲刺2",
				      actualHours:120,
				  	  predictTime:150,
					  sprintState:'完成'
				  },{
					  id:3,
					  sprintName:"冲刺3",
				      actualHours:120,
				  	  predictTime:150,
					  sprintState:'完成'
				  }]
				},{
				  id:3,
				  storyTime:"2019-8-9",
				  story:"完成机器人的打磨程序的书写", 	
				  projectId:10,
				  sprintData:[{
					 id:1,
					 sprintName:"冲刺1",
				     actualHours:120,
				  	 predictTime:150,
					 sprintState:'完成'
				  },{
					  id:2,
					  sprintName:"冲刺2",
				      actualHours:120,
				  	  predictTime:150,
					  sprintState:'完成',
				  },{
				  	  id:3, 
				  	  sprintName:"冲刺3",
				      actualHours:120,
				  	  predictTime:150,
					  sprintState:'未完成'
				  }]
				}]
			}
		},
		onShow(){
			_this = this;
			console.log("进来onshow")
			uni.getStorage({
				key:'userInfo',
				success:(res)=>{
				   	Query.findUser({id:res.data.id})
					.then(data=>{
						if(data.data.records[0].isRoot){
						   _this.isCanLook = false;
						}else{
							_this.userInfo = data.data.records[0];
						   uni.getStorage({
						   	key:'nowInProject',
						   	success:(res)=>{
						   		_this.projectId = res.data.projectId;
						   		_this.roleId = res.data.roleId;
						   	  }
						   })	
						}
					})
					.catch(Error=>{
						console.log(Error)
						uni.showToast({
							title:"网络错误",
							duration:1000,
							icon:"loading"
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
		
		methods:{
		    
			//添加用户故事
			addStory:function(){
				_this = this;
				if(_this.roleId===1){
				   uni.navigateTo({
				   	 url:'../addStory/addStory'
				   })
				}else{
					uni.showToast({
						title:'无权限增加',
						duration:1000,
						icon:"none"
					})
				}
			},
			
			//查询该项目下的用户故事
			queryCustomerStory:function(){
				_this = this;
				uni.request({
					url:xxx,
					method:'POST',
					data:{
						projectId:_this.projectId
					},
					dataType:'json',
				})
				.then(data=>{
					
				})
				.catch(Error=>{
					console.log(Error)
					uni.showToast({
						title:"网络错误",
						duration:1000,
						icon:"loading"
					})
				})
			},
			
			//更新用户故事
			updateStory:function(e){
				_this = this;
				console.log(e);
				let story = e.currentTarget.id;
				if(_this.roleId===1){
				  uni.navigateTo({
				  	url:`../updateStory/updateStory?story=${story}`
				  })	
				}else{
					uni.showToast({
						title:"无权修改",
						duration:1000,
						icon:"none"
					})
				}
			}
		}
	}
</script>

<style>
.story-view{
	width: 100%;
	margin-top: 10upx;
}
.story-detail{
	width: 100%;
	font-size: 13px;
}
.story-detail-title{
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin-top: 5upx;
}
.story-detail-title view{
	width: 100%;
	display: flex;
	flex-direction: column;
	text-align: center;
}
.add-story{
	margin-top: 25upx;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items:center;
	height: 100upx;
	font-size: 14px;
	color: #F0F8FF;
	font-weight: 500;
}

.add-story image{
	width: 70upx;
	height: 70upx;
}
</style>
