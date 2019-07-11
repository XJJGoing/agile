<template>
	<scroll-view class="all"
	             scroll-y="true"
    >
	
	<view class="hadSprint">
	  <block v-if='nowSprint'>	
		<text>现有冲刺:</text>
			<view class="sprintNum" v-for="(item,index) in nowSprint" :key="index">
			  	<text id="order">{{item.sprintName}}:</text>
				<text id="target">{{item.sprintTarget}}</text>
			</view>
		</block>	
	</view>
	
		<view class="sprintMessage">	
			<view>
				<text>冲刺号:</text>
				<input placeholder="请填入冲刺号(格式:冲刺1 冲刺2等)" @input="addSprintOrder" ></intput>
		   </view>
		   <view>
			<text>冲刺目标:</text>
			 <input placeholder="请填入冲刺的目标(15个字以内)"  @input="addSprintTarget" ></input>
		   </view>
		</view>
		
	   <button type="primary" @click="addSprint">添加</button>
	</scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const Login = new login();
	
	import {sprintAdd} from '../../static/utils/api.js';
	var _this;
	export default {
		data() {
			return {
				userInfo:"",
				nowInProjectId:"",
				nowSprint:[],    //获取项目
				sprintOrder:"",  //冲刺的序号,在数据库中即为sprintName
				sprintTarget:""  //冲刺的目标
			}
		},
		onShow(){
		  _this = this;
		  uni.getStorage({
		  	key:"userInfo",
			success:(res)=>{
				console.log(res.data);
				let id = {
					id:res.data.id
				}
				return Login.findUser(id)
				.then(data=>{
					console.log("从数据库中返回的用户的信息",data);
					_this.userInfo = data.data.records[0];
					_this.getHadProjectSprint();   
				})
			 },
			 fail:(error=>{
				 uni.redirectTo({
				 	url:'../login/login'
				 })
			 })
		  })
		},
		
		methods: {
			//先不管这个宽度
			// getSystem:function(){   //获取宽度，用来设置input出的长度
			// 	_this = this;
			// 	console.log("进来次函数")
			// 	uni.getSystemInfo({
			// 		success:(res)=>{
			// 			console.log(res)
			// 		   _this.width = res.windowWidth-70      //将剩余的作为input的宽度
			// 		   console.log(_this.width)
			// 		}
			// 	})
			// },
			
			addSprintOrder:function(e){
				this.sprintOrder = e.detail.value
			},
			addSprintTarget:function(e){
				this.sprintTarget = e.detail.value
			},
			//查询本项目已经有的冲刺。
			getHadProjectSprint:function(){   //拿到当前所在的项目的id，在storage中存放着  NowInProjectId
				uni.getStorage({
					key:"nowInProjectId",
					success:(res)=>{
						
						_this.nowInProjectId = res.data;
						 console.log("进来模拟数据")
						    
						//这里对数据进行模拟：    //这里要实现的就是对roleId=1 指定projectId  userId  进行查询
						_this.nowSprint = [{
							id:2,
							sprintName:"模拟名称2",
							sprintTarget:"冲呀2"
						},{
							id:3,
							sprintName:"模拟名称3",
							sprintTarget:"冲呀3"
						},
						{
							id:4,
							sprintName:"模拟名称3",
							sprintTarget:"冲呀3"
						}]
					},
					fail:(error)=>{
						console.log(error)
					}
				})
			},
			addSprint:function(){
				_this = this;
				console.log("提交的数据",_this.sprintOrder,_this.sprintTarget)
				
				if(_this.sprintOrder&&_this.sprintTarget){
					uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:sprintAdd,
								method:"POST",
								data:{
									projectId:_this.nowInProjectId,
									sprintName:_this.sprintOrder,
									sprintTarget:_this.sprintTarget
								},
								dataType:'json'
								})
								.then(res=>{
									console.log("添加冲刺返回的信息",res);
									uni.hideLoading();
									uni.showToast({
										icon:'none',
									    title:"添加成功",
										duration:1000
									})
									_this.getHadProjectSprint()  //再次刷新调用这个界面
								})
								.catch(error=>{
									console.log(error)
									uni.showToast({
										title:"添加失败",
										icon:'none',
										duration:1000
									})
								})				
						 }
				    })
				}else{
					uni.showToast({
						duration:500,
						title:"请完善信息"
					})
				}
			}
		}
	}
</script>

<style>
.all{
	height: auto;
	overflow:scroll;
	margin-top: 20upx;
}
::-webkit-scrollbar{
    width: 2upx;
	height: 6upx;
}
.hadSprint{
	width: 100%;
	height: auto;
	background-color: #F5A623;
	display: flex;
	flex-direction: column;
}

.sprintNum{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: auto;
	overflow-x: scroll;
	padding: 10upx;
	box-sizing: border-box;
	height: 100upx;
	background-color: #007AFF;
}

#order{
	font-size: 35upx;
}
#target{
	font-size:30upx;
	margin-left: 10upx;
}

.sprintMessage{
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #007AFF;
}
.sprintMessage view{
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 5upx;
	height: 100upx;
	width: 100%;
	padding: 10upx;
	background-color: #F5A623;
}
.sprintMessage view text {
	font-size:30upx;
	background-color: #19BE6B;
}
.sprintMessage view input{
   	border-radius: 2upx;
	border: 1upx dotted #007AFF;
	font-size:30upx!important;
	margin-left: 10upx;
	width: 500upx; /*后期根据计算去修改*/
}


</style>
