<template>
	<scroll-view class="comment" scroll-y="true">
		<view class="commentDetail">
			
		  <view class="addComment">
			  <view class="content">
				  <text>评论内容:</text>
				  <input placeholder="添加评论内容(最多少于50字)"></input>
			  </view>
			  <button @click="addComment">增加评论</button>
		  </view>
		   
		  <view v-for="(item,index) in moonComment" :key="index" class="eachDetail">
			   <uni-card 
				   :title="item.trueName" 
				   :thumbnail="item.avatarUrl" 
				   :note="item.time"
				    class="commentCard"
				>
				  <text id="content">{{item.content}}</text>
			   </uni-card>
		   </view>
		   
		</view>
	</scroll-view>
</template>

<script>
    //引入插件
	import uniCard from "@/components/uni-card/uni-card.vue"
    //引入增加评论和查找所有评论的api
	import {commentAdd,commnetQuery} from '../../static/utils/api.js';
	
	//引入登录的模块
	const login = require('../../static/utils/utils').Login;
	const Login = new login();
	var _this;
	export default {
		components: {uniCard},
		data() {
			return {
				userInfo:"",      //用户的信息
				projectId:1,     //项目的id，拿到用户所在的项目的id
				sprintId:1,      //用户选中的冲刺的id
				allComment:[],   //所有的评论,包括评论的人（真实姓名），评论的内容，评论的时间
				moonComment:[{    //模拟的数据
				    id:1,
					userId:21,
					projectId:1,
					sprintId:1,
					trueName:"林永健",
					avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
					content:"这是模拟的评论测试",
					time:"2019-07-09-17:00"                    
				},{ 
					id:2,
					userId:21,
					projectId:1,
					sprintId:1,
					trueName:"林永健",
					avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
					content:"这是模拟的评论测试",
					time:"2019-07-09-17:00"                   
				},{
				    id:3,
				    userId:21,
				    projectId:1,
					sprintId:1,
					trueName:"林永健",
					avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
					content:"这是模拟的评论测试",
					time:"2019-07-09-17:00" 
				}]
			}
		},
		
	    //登录部分，进行全局变量userInfo以及storage的更新	
		// onShow() {
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
		// 	   })
		// 	},
		// 	fail:() {
		// 	  uni.redirectTo({
		// 	  	url:'../login/login'
		// 	  })
		// 	}
		//   })
		// }
		
		//这个只是目前暂时使用的
		onShow() {
			_this = this;
			uni.getStorage({
				key:'userInfo',
				success:(res)=>{
					_this.userInfo = res.data;
				}
			})
		},
		
		
		methods: {
		   //增加评论
		   addComment:function(){
		   	_this  = this;
		   	let content  = "测试内容";
		   	let userId = _this.userInfo.id;
		   	let projectId = _this.projectId;
		   	let sprintId = _this.sprintId;
		   	let commentData = {
		   	    userId,
		   		projectId,
		   		sprintId,
		   		content
		   	}
		   	
		   	//进行评论的增加
		   	uni.request({
		   		url:commentAdd,
		   		data:commentData,
		   		dataType:'json'
		   	})
		   	.then(data=>{  //增加成功并且重新获取
		   		console.log("增加评论成功")
		   	})
		   	.catch(Error=>{
		   		uni.showToast({
		   			title:"增加评论失败",
		   			icon:"none",
		   			duration:500
		   		})
		   	})
		   },
		 
		  //查找评论	
		  queryComment:function(){
			  _this = this;
			  let queryData = {
				  projectId: _this.projectId,
				  sprintId :_this.sprintId
			  }
			 uni.request({
			 	url:commnetQuery,
				data:queryData,
				dataType:'json'
			 })
			 .then(data=>{  //获取到的评论对
				  console.log("拿到的评论",data)
			 })
			 .catch(Error=>{
				 uni.showToast({
				 	icon:"none",
					title:"获取评论失败",  
					duration:500
				 })
			 })
		  }
		}
	}
</script>

<style>
.comment{
	width: 100%;
	height: auto;
	overflow-y: scroll;
	background-color: #007AFF;
}
::-webkit-scrollbar{
	width: 2upx;
	height: 6upx;
}
.addComment{
	display: flex;
	flex-direction: column;
	height: 250upx;
}
.addComment button{
	margin-top: 15upx;
	width: 90%;
	height: 85upx;
	border-radius: 1px solid #E9EFED;
}

.content{
	width: 100%;
	height: 100upx;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	font-size: 35upx;
	margin-left:10upx ;
	margin-top: 20upx;
}

.content text{
	height: 100upx;
	line-height: 100upx;
}

.content input{
	height: 100upx;
	width: 500upx;
	line-height: ""!important;
	font-size: 30upx!important;
}

.commentDetail{
	width: 100%;
}
.eachDetail{
	width: 100%;
	height: 200upx;
	margin-top: 10upx;
	background-color: #19BE6B;
}
.commentCard{
	border-radius:10%!important;
}

/*消息模块评论的内容*/
#content{
   font-size:30upx;
}


</style>
