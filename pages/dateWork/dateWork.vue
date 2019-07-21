<template>
	<scroll-view class="all" scroll-y="true">
	  <view class="dateWork">
		  <view>
			  <text id="title">任务信息</text>
			  <text>序号:</text>
			  <text>内容</text>
		  </view>
		  
		  <view>
			  <text id="title">记录今天的工时</text>
			  <view class="dateWorkDetail">
				  <text>工时:</text>
				  <input placeholder="输入工时"></input>
			  </view>
			  <view class="dateWorkDetail">
				  <text>备注:</text>
				  <input placeholder="输入今日日报"></input>
			  </view>
		  </view>
		  
		  <view>
			  <text id="title">选择状态</text>
			  <view>
				  <picker></picker>
				  <block v-if="">
					  <view>
						  <text>实际工时:</text>
						  <input placeholder="输入实际工时"></input>
					  </view>
				  </block>
			  </view>
		  </view>
		  
		  <button>提交</button>
	  </view>	  
    </scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	var _this;
	export default {
		data() {
			return {
			   userInfo:"",
			   projectId:"",
			   sprintId:"",
			   departmentId:""
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
					  console.log("查询到的用户信息",data.data.records);
					  _this.userInfo = data.data.records;
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
		
		methods: {
			
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
}
.dateWork view{
	display: flex;
	flex-direction: column;
}
.dateWorkDetail{
	display: flex;
	flex-direction: row;
}
.dateWorkDetail text{
    height: 60upx;
	line-height: 60upx;
	width: 100upx;
	margin-left: 10upx;
}
.dateWorkDetail input{
	height: 60upx;
	border: 1upx solid #19BE6B;
}
</style>
