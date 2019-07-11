<template>
   <scroll-view class="people" 
                scroll-y="true"
	>
	 <view class="peopleInfo">
	   <view class="title">
			   <image :src="userInfo.avatarUrl"/>
			   <text>{{userInfo.nickName}}</text>
			   <text id="roleName" >工程师</text>
	   </view>
	  <view class="function">
		       <block>
				  <i-cell i-class="item" title="更新任务" is-link url="/pages/updateTask/updateTask"></i-cell>
				  <i-cell i-class="item" title="用户管理" is-link url="/pages/admin/admin"></i-cell>
				  <i-cell i-class="item" title="项目审核" is-link url="/pages/reviewProject/reviewProject"></i-cell>
			   </block>
			    <block>
			   	  <i-cell i-class="item" title="任务审核" is-link url="/pages/reviewTask/reviewTask"></i-cell>
			   	  <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   	  <i-cell i-class="item" title="用户管理" is-link url="/pages/admin/admin"></i-cell>
			   </block>
			   <block>
				 <i-cell i-class="item" title="新建任务" is-link url="/pages/addTask/addTask"></i-cell>
				 <i-cell i-class="item" title="消息中心" is-link url="/pages/message/message"></i-cell>
			   </block>  
                <i-cell i-class="item" title="退出" is-link url="/pages/login/login"></i-cell>
	   </view> 
	 </view>
	 
   </scroll-view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue"
	import icard from "../../static/dist/card/index.js"
	const login = require('../../static/utils/utils').Login;
	const Login = new login();
	var _this;
	export default {
		components: {uniCard,icard},
		data() {
			return {
				userInfo:{},
				userProjectRole:{}
			}
		},
		
		//这个只是暂时monn
		onShow(){
		  _this = this;
		  uni.getStorage({
		  	key:'userInfo',
			success:(res)=> {
				console.log(res.data);
				_this.userInfo = res.data;
				console.log("全局变量userInfo",_this.userInfo);
			},
			fail:()=>{
				 uni.redirectTo({
					url:'../login/login'
				 })	
			}
		  })	  
		},
		
		// //进行登录的更新
		// onShow(){
		//   _this = this
		//   wx.getStorage({
		//   	key:"userInfo",
		// 	success:(res)=>{
		// 	   let id = {
		// 		   id:res.data.id
		// 	   }
		// 	   Login.findUser(id)
		// 	   .then(data=>{
		// 		   _this.userInfo = data.data
		// 		  uni.setStorage('userInfo',data.data)
		// 		  return Login.findUserProjectRole(data.data.id)
		// 	   })
		// 	   .then(data=>{
		// 		   uni.setStorage('userProjectRole',data)
		// 	   })
		// 	},
		// 	fail:()=>{
		// 	  uni.redirectTo({
		// 	  	url:'../login/login'
		// 	  })
		// 	}
		//   })
		// },
		// 
		methods: {
			
		}
	}
</script>

<style>
.people{
	height: auto;
	width: 100%;
	overflow: scroll;
	background-color: #007AFF;
}

::-webkit-scrollbar{
	width:2upx;
	height:6upx;
}

.peopleInfo{
	height: 1000upx;
	width: 100%;
	background-color: #19BE6B;
}

.title{
	width:100%;
	height: 200upx;
	background-color: #F5A623;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 20upx;
	border: 1px solid #007AFF;
	border-radius:3% ;
}
.title image{
	border: 1upx dotted #19BE6B;
	width: 150upx;
	height: 150upx;
}
.title text{
	font-size: 30upx;
	margin-left: 20upx;
}
#roleName{
	font-size: 40upx;
	margin-left: 250upx;
}

/*function部分*/
.function{
	width: 100%;
    display: flex;
	flex-direction: column;
}
.item{
	width: 100%;
	height: 30upx;
    margin-top:5upx;
	background-color: #19BE6B;
}
</style>
