<template>
	<view class="userinfo">
			  <view class="userinfo-avatar">
			    <open-data  type="userAvatarUrl"></open-data>
			  </view>
			  <view class="userinfo-nickName">
				 <open-data  type="userNickName" style="color: white;"></open-data>
			  </view>
				<view class="login">
		            <input placeholder="请输入真实姓名否则无法登陆" 
					       @input="inputTrueName" 
						   :value="trueName"
				     >
				    </input>         
					<button open-type="getUserInfo"
							v-if="canIUse"  
							@click="bindGetUserInfo()"
							style="color: white;"
							plain="trueName"
							:disabled="disable"
					>
						授权登录
					</button>
					<view v-else>请升级微信的版本</view>
			  </view>	 
	</view>
</template>

<script>
	var _this;
	//登录的用户的增加用户入库的api
	import {register} from '../../static/utils/api.js';
	
	//封装好的登录的函数
	const login = require('../../static/utils/utils.js').Login;
	const Login = new login();
	
	export default {
		data() {
			return {
				canIUse:wx.canIUse('button.open-type.getUserInfo'),
				trueName:"",
				disable:true
			}
		},
		
		//登录之前就查看本地是否存在用户证明授权登录过直接跳转到申请表
		mounted() {
		   
		},
		 methods:{
			 
		  //输入这是的姓名	 
		  inputTrueName:function(e){
			  let trueName = e.detail.value;
			  let reg = /^[\u4e00-\u9fa5]+$/i;  //正则表达式匹配中文
			  if(reg.test(trueName)&&trueName.length<=4&&trueName.length>=2){
				  this.trueName = trueName;
				  this.disable = false;
			  }else{
				  this.disable = true;
				  uni.showToast({
				  	title:"输入有误",
					duration:1000,
					icon:"none"
				  })
			  }
		  },
			 
			   
		  bindGetUserInfo:function(){
			  let openId;
			  let sessionKey;
			  let trueName = this.trueName;
			  uni.showLoading({
				  title:"登录中",
			  	  success:()=>{
				   Login.getCode()
				   .then(data=>{
				   		return Login.getOpenId(data)
				   })
				   .then(data=>{
				   	   openId = data.data.openid;
					   sessionKey = data.data.session_key;
				   	   return Login.getUserInfo()
				   })
				   .then(data=>{
				   	   let userInfo = {
						    ...data.userInfo,
				   			openId,
							sessionKey,
							trueName
				   		};
						//console.log("发送到服务器的信息",userInfo)  
				   	    return Login.insertUser(userInfo,register,"POST")
				   })
				   .then(data=>{
					   uni.hideLoading();
					   console.log("返回的用户的信息",data.data)
					  // console.log(userInfo)
					   uni.setStorage({
					   	 key:'userInfo',
						 data:data.data,
						 success:()=>{
							 uni.redirectTo({
							 	url:'../apply/apply'
							 })
						 },
						 fail:()=> {
						   	uni.showToast({
						   		title:"网络连接错误",
								duration:1000,
								icon:"loading"
						   	})
			              }
					    })		
					})	     
				   .catch(error=>{
				   	  console.log(error)
				   })	
				}
			  })
		}
	  }
	}
</script>

<style>
.userinfo{
	width: 750upx;
	height: 600upx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.userinfo-avatar{
	width: 160upx;
	height: 160upx;
	margin-top: 150upx;
}

.userinfo-nickName{
	font-size:30upx;
	text-align: center;
	width: 160upx;
	height: 50upx;
	margin-top: 10upx;
}
.login{
    width: 100%upx;
	height: 200upx;
	margin-top: 20upx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.login input{
	width: 450upx;
	height: 100upx;
	border: 1upx solid #30FAF6;
	border-radius: 2%;
	font-size: 30upx;
	line-height: 100upx;
	color: #E9EFED;
}
.login button{
	font-size: 30upx;
    border-radius:2% ;
	width: 320upx;
	height: 80upx;
	border:1px solid #FCFBFF;
	margin-top: 10upx;
}

</style>
