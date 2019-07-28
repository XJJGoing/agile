<template>
	<scroll-view class="all" scroll-y="true" @scrolltolower="loaderMore" :style="{height:height+'px'}">
		<view class="project">
			<view class="title">待审核的项目:</view>
			<view v-for="(item,index) in noExamineProject" 
			     :key="index" 
				 class="eachProject"
				 :id="JSON.stringify(item)"
				 @click="examineItem"
		    >
				<uni-card 
				    :title="'项目编号:'+item.projectName"  
				    :note="'申请时间:'+item.createTime"
			    >
				  <view class="eachProjectDetail">
					<text>申请人:{{item.trueName}}</text>
					<text>理由:{{item.reason}}</text>
				  </view> 
				</uni-card>
			</view>
		</view>
    </scroll-view>
</template>

<script>
   const login = require('../../static/utils/utils').Login;
   const query = require('../../static/utils/utils').Query;
   const Login = new login();
   const Query = new query();
   
   import {formatDate} from '../../static/utils/time.js';
   import uniCard from "@/components/uni-card/uni-card.vue"
   
   import {
	       projectApplyQuery,
		   userProjectRoleAdd,
		   projectAdd,
		   projectApplyDeleteBatch,
		   projectApplyUpdateBatch,
		   messageSend
		  } 
           from '../../static/utils/api.js';
   
   var _this;
	export default {
		components:{
		 uniCard
		},
		data() {
			return {
				height:"",
				userInfo:"",
				noExamineProject:[],
				pageNum:0,
				pageSize:5
			}
		},
		onShow(){
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{
					let id = {
						id:res.data.id
					}
					Query.findUser(id)
					.then(data=>{
						console.log("用户信息",data);
						_this.userInfo = data.data.records[0];
						if(_this.userInfo.isRoot){  
							_this.getAllNoExamineProjects();
						}else{
							uni.redirectTo({
								url:'../people/people'
							})
						}
					})
				},
				fail:()=>{
					uni.redirectTo({
						url:'../login/login'
					})
				}
			})
		},
		onPullDownRefresh(){
			_this = this;
			_this.getAllNoExamineProjects();
		},
		methods: {
			
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.height = res.windowHeight;
					}
				})
			},
			
			//获取申请项目表的所有未审核的项目
			getAllNoExamineProjects:function(){
				_this = this;
				uni.showLoading({
					title:'获取中',
				    success:()=>{
						uni.request({
							url:projectApplyQuery,
							method:"POST",
							data:{
								  state: 0,
								  pageNum:_this.pageNum,
								  pageSize:_this.pageSize
							},
							dataType:'json',
						})
						.then(data=>{
							uni.hideLoading();
							console.log("项目",data);
							console.log("查询到的未审核的项目",data[1].data.data.records)
							_this.noExamineProject = data[1].data.data.records;
						})
						.catch(Error=>{
							uni.showToast({
								title:'网络错误',
								icon:"none",
								duration:1000
							})
						})
					}
				})
			},
			
			
			
			examineItem:function(e){
				_this = this;
				let project = JSON.parse(e.currentTarget.id);
				console.log('选中的项目',project)
			    uni.showModal({
			    	title:"审核",
					confirmText:'通过',
					confirmColor:"#4CD964",
					cancelText:"不通过",
					cancelColor:"#F93D08",
					success:(res)=>{
						if(res.confirm){
							uni.showModal({
							  title:"是否确定",
							  confirmText:"确定",
							  confirmColor:"#19BE6B",
							  cancelText:"取消",
							  confirmColor:"#F93D08",
							  success:(res)=>{
								  if(res.confirm){
									  
									  //增加成功后才去更改查看情况
									 _this.addProjectInfo(project);
								  }else{
								  
							    }
							  } 
							})
						}else if(res.cancel){
							uni.showModal({
							  title:"是否确定",
							  confirmText:"确定",
							  confirmColor:"#19BE6B",
							  cancelText:"取消",
							  confirmColor:"#F93D08",
							  success:(res)=>{
								  if(res.confirm){
									 //不通过的直接进行删除
									_this.deleteNoPassApply(project)
								  }else{
								  
							     }
							  }
							})
						}
					}
			    })
			},
			
			
			//改变t_project_apply中的isReview的状态
			changeReview:function(project){
				_this = this;
				uni.showLoading({
					title:"提交中",
					success:()=>{
						uni.request({
						    url:projectApplyUpdateBatch,
							method:'POST',
							data:[{
									id: project.id,
									state: 1, 
							}],
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							
							uni.showToast({
								title:"提交成功",
								duration:500,
								icon:"none",
							})
							//重新刷新
							_this.getAllNoExamineProjects();
							_this.pushMessage();          //同步进行就行了
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:"none"
							})
						})
					}
				})
			},
			
			//在t_project表中增加一条字段
			addProjectInfo:function(project){
				_this = this;
				uni.showLoading({
					title:"提交中",
					success:()=>{
						uni.request({
						    url:projectAdd,
							method:'POST',
							data:{
								projectName:project.projectName,
		                        projectChargeUserId: project.userId,
							},
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							_this.addUserProjectRole(project,data[1].data.data.id)
						}) 
						.catch(Error=>{ 
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:"none"
							})
						})
					}
				})
			},
			
			//在t_user_project_role中增加一条字段
			addUserProjectRole:function(project,projectId){
				_this = this;
				uni.showLoading({
					title:"提交中",
					success:()=>{
						uni.request({
						    url:userProjectRoleAdd,
							method:'POST',
							data:{
				                userId: project.userId,
								projectId:projectId,
								roleId:1
							},
							dataType:'json'
						})
						.then(data=>{
							uni.hideLoading();
							uni.showToast({
								title:"提交成功",
								duration:500,
								icon:"none"
							})
				            _this.changeReview(project);
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:"none"
							})
						})
					}
				})
			},
			
			//不通过的项目直接进行删除
			deleteNoPassApply:function(project){
				_this = this;
				let id = [];
				id.push(project.id);
				uni.showLoading({
					title:"提交中",  
					success:()=>{
						uni.request({ 
						    url:projectApplyDeleteBatch,
							method:'POST',
							data:id,
							dataType:'json'
						})
						.then(data=>{
							console.log("删除成功",data)
							uni.hideLoading();
							uni.showToast({
								title:"提交成功",
								duration:500,
								icon:"none"
							})
							
							//重新刷新
							_this.getAllNoExamineProjects();
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								duration:1000,
								icon:"none"
							})
						})
					}
				})
			},
			
			//将申请的项目通过的消息推送回去
			pushMessage:function(project){
				_this = this;
				let time = formatDate(new Date())
				Query.findUser({id:project.userId})
				.then(data=>{
					let openId = data.data.records[0].openId;
					uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:messageSend,
							    method:'POST',
								data:{
									"touser":openId,
									"page":"pages/index/index",
				                    "template_id":"OPM7GA_vTZbtxK8ACVwRoIpq2uxKl7SrF4TdRdB6N_I",
									"formId":"",
									"data":{
										"keyword1":{
											"value":project.projectName
										},
										"keyword2":{
											"value":time
										},
										"keyword3":{
											"value":"申请的项目已通过"
										},
										"keyword4":{
											"value":"请熟记自己唯一的项目编号,以及前往项目主页填写项目信息以及添加冲刺"
										},
										"emphasis_keyword": "keyword1.DATA"
									}
								},
								dataType:'json'
							})
							.then(data=>{
								console.log("推送成功")
							})
							.catch(Error=>{
								uni.showToast({
									title:"网络错误",
									duration:500,
									icon:"loading"
								})
							})
						}
					})
				})
				.catch(Error=>{
					uni.showToast({
						title:'网络错误',
						duration:500,
						icon:"loading"
					})
				})
				
			},
			
			loaderMore:function(){
				_this = this;
				if(_this.pageSize>_this.noExamineProject.length){
					uni.showToast({
						title:"已经到底了哦!",
						duration:1000,
						icon:"none"
					})
				}else{
					_this.pageSize += 5
					_this.getAllNoExamineProjects();
				}
			},
			
			
			
		}
	}
</script>

<style>
.all{
	width: 100%;
	overflow: scroll;
}

::-webkit-scrollbar{
	width: 2upx;
	height: 6upx;
}

.project{
	display: flex;
	flex-direction: column;
	width: 100%;
}
.title{
	width: 100%;
	height: 70upx;
	line-height: 70upx;
    font-size: 30upx;
	font-weight: bold;
	background-color:#6CA0D9;
}
.title text{
   margin-left: 5upx;
   height: 70upx;
   line-height: 70upx;
}
.eachProject{
	width: 100%;
    margin-top: 10upx;
}
.eachProjectDetail{
	display: flex;
	flex-direction: column;
	background-color:#FEF2DA;
    padding: 10upx;
}
.eachProjectDetail text{
	margin-top: 5upx;
	margin-left: 5upx;
	font-size: 30upx;
}

</style>
