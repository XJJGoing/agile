<template>
	<scroll-view class="comment" scroll-y="true" @scrolltolower="loaderMore">
		<view class="commentDetail">
			
		  <view class="addComment">
			  <view class="content">
				  <text>评论内容:</text>
				  <input placeholder="添加评论内容(最多少于30字)" 
				         @input="inputContent" 
						 :value="content"
						 :style="{width:width+'px'}"
				  >
				  </input>
			  </view>
			  <button @click="addComment">增加评论</button>
		  </view>
		   
		  <view v-for="(item,index) in allComment" :key="index" class="eachDetail">
			   <uni-card 
				   :title="item.trueName" 
				   :thumbnail="item.avatarUrl"
				   :note="'评论时间:'+item.createTime"
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
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	var _this;
	export default {
		components: {uniCard},
		data() {
			return {
				width:'',           //输入框的长度
				
				userInfo:"",        //用户的信息
				projectId:"",        //项目的id，拿到用户所在的项目的id
				sprintId:"",         //用户选中的冲刺的id
				allComment:[],      //所有的评论,包括评论的人（真实姓名），评论的内容，评论的时间
				content:"",
				pageNum:0,         //评论的页数
				pageSize:10       //一开始加载的个数
			}
		},
		
		onLoad(e) {
		  _this = this
		  console.log("评论区",e);
		  _this.getSystem();
		  _this.sprintId = parseInt(e.sprintId);
		  console.log(e.sprintId)
		  wx.getStorage({
		  	key:"userInfo",
			success:(res)=>{
			   let id = {
				   id:res.data.id
			   }
			   Query.findUser(id)
			   .then(data=>{
				   console.log("查询到的用户的信息",data.data.records[0])
				   _this.userInfo = data.data.records[0];
				   uni.getStorage({
					   key:"nowInProject",
					   success:(res)=>{
						   _this.projectId = res.data.projectId;
						   _this.queryComment();
					   }
				   })
			   })
			   .catch(Error=>{
				   uni.showToast({
				   	 title: '网络错误',
					 duration:500,
					 icon:"none"
				   });
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
			
			//获取系统信息设置输入框长度
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = (parseInt(res.windowWidth-80));
					}
				})
			},
			
			//输入评论的内容
			inputContent:function(e){
				let content = e.detail.value;
				if(content.length<=30){
					this.content = content
				}else{
					uni.showToast({
						title:"内容过长",
						duration:1000,
						icon:"none"
					})
				}
			},
			
		   //增加评论
		   addComment:function(){
				_this  = this;
				if(_this.content){
					uni.showLoading({
						title:'增加中',
						success:()=>{
							uni.request({
								url:commentAdd,
								method:"POST",
								data:{
									userId:_this.userInfo.id,
									projectId:_this.projectId,
									sprintId:_this.sprintId,
									content:_this.content
								},
								dataType:'json'
							})
							.then(data=>{  
								console.log("添加评论成功",data)
								uni.hideLoading();
								_this.queryComment();
							})
							.catch(Error=>{
								uni.showToast({
									title:"增加评论失败",
									icon:"none",
									duration:500
								})
							})	
						}
					})
				 }else{
					 uni.showToast({
						title:"评论有误",
						duration:1000,
						icon:"none"
					 })
				 }
		   },
		 
		  //查找评论	 
		  queryComment:function(){
			
			 _this = this; 
			 uni.showLoading({
			 	title:"获取中",
				success:()=>{
					 uni.request({
						url:commnetQuery,
						data:{ 
							projectId: _this.projectId,
							sprintId :_this.sprintId,
							pageNum:_this.pageNum,
							pageSize:_this.pageSize
						},
						method:'POST',
						dataType:'json'
					})
					.then(data=>{  
						uni.hideLoading();
						console.log(data)
						console.log("获取到的评论",data[1].data.data.records)
					    _this.allComment =  data[1].data.data.records;
					})
					.catch(Error=>{
						 uni.showToast({
							icon:"none",
							title:"网络错误",  
							duration:1000
						 })
					})
				}
			 })
		  },
		  
		  //触底加载更多的评论
		  loaderMore:function(){
			  console.log("进入")
			  _this = this;
			  if(_this.pageSize>_this.allComment.length){
				  uni.showToast({
				  	title:"已经到底了哦！",
					icon:"none",
					duration:500
				  })
			  }else{
				  _this.pageSize +=10;
				  _this.queryComment();
			  }
		  }
	},
}
</script>

<style>
.comment{
	width: 100%;
	height: auto;
	overflow-y: scroll;
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
	line-break: 85upx;
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
	width: 140upx;
	line-height: 100upx;
	font-size: 30upx!important;
	color: #E9EFED;
	font-weight: bold;
}

.content input{
	height: 100upx;
	line-height: ""!important;
	font-size: 30upx!important;
	color: #F0F8FF;
}

.commentDetail{
	width: 100%;
}
.eachDetail{
	width: 100%;
	margin-top: 15upx;
}
.commentCard{
	border-radius:10%!important;
}

/*消息模块评论的内容*/
#content{
   font-size:30upx;
}


</style>
