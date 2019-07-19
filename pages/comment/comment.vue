<template>
	<scroll-view class="comment" scroll-y="true">
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
			}
		},
		
		onShow() {
	      this.getSystem();    
		  _this = this
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
						   uni.getStorage({
							   key:'sprintId',
							   success:(res)=>{
								   _this.sprintId = res.data;
								   _this.queryComment();
							   }
						   })
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
					this.content = "";
					uni.showToast({
						title:"内容过长",
						duration:1000,
						icon:"none"
					})
				}
			},
			
		   //增加评论
		   addComment:function(){
			 //这里mook增加
			 if(this.content){
				 let data = {
					 id:5,
					 trueName:"林永健",
					 avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
					 content:this.content,
					 time:"2019-07-09-17:00"   
				 }
				 this.allComment.push(data)
			 }
			   
			//下方为正确的代码   
		    // _this  = this;
			// if(_this.content){
			//    uni.request({
			//    	url:commentAdd,
			//    	data:{
			//    		userId:_this.userId,
			//    		projectId:_this.projectId,
			//    		sprintId:_this.sprintId,
			//    		content:_this.content
			//    	},
			//    	dataType:'json'
			//    })
			//    .then(data=>{  
			//    	console.log("增加评论成功")
			//    })
			//    .catch(Error=>{
			//    	uni.showToast({
			//    		title:"增加评论失败",
			//    		icon:"none",
			//    		duration:500
			//    	})
			//    })	
			//  }else{
			// 	 uni.showToast({
			// 	 	title:"评论信息不正确",
			// 		duration:1000,
			// 		icon:"none"
			// 	 })
			//  }
		   },
		 
		  //查找评论	  待完善
		  queryComment:function(){
			  
			  //先mook数据
			let  moonComment = [{     
			    id:1,
			 	trueName:"林永健",
			 	avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
			 	content:"这是模拟的评论测试",
			 	time:"2019-07-09-17:00"                    
			 },{ 
			 	id:2,
			 	trueName:"林永健",
			 	avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
			 	content:"这是模拟的评论测试",
			 	time:"2019-07-09-17:00"                   
			 },{
			     id:3,
			     trueName:"林永健",
			     avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ibicjibxHvO5wGt56YmcWhDMicoM7GPeKgibXM9T8gqAyyQrqTtOfJfEibqKB5KxsoibtNT3GPHQsfoySPFEIPRAjBplw/132",
			     content:"这是模拟的评论测试",
			     time:"2019-07-09-17:00"   
			 }] 
			 
			 this.allComment =  moonComment;
			  
			  //下方为正确代码
			 //  _this = this;
			 // uni.request({
			 // 	url:xxx,
				// data:{
				// 	 projectId: _this.projectId,
				// 	 sprintId :_this.sprintId
				// },
				// method:'POST',
				// dataType:'json'
			 // })
			 // .then(data=>{  //获取到的评论对
				//   console.log("拿到的评论",data)
			 // })
			 // .catch(Error=>{
				//  uni.showToast({
				//  	icon:"none",
				// 	title:"获取评论失败",  
				// 	duration:500
				//  })
			 // })
		  // }
		}
	},
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
	width: 140upx;
	line-height: 100upx;
	font-size: 30upx!important;
}

.content input{
	height: 100upx;
	line-height: ""!important;
	font-size: 30upx!important;
}

.commentDetail{
	width: 100%;
}
.eachDetail{
	width: 100%;
	height: 200upx;
	margin-top: 15upx;
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
