<template>
	<scroll-view class="all" scroll-y="true">
		<view class="search_project">
			<button @click="bindChange()" 
			        class="ibutton" 
					plain="true" 
					style="color:#fbf3f5; border:1px solid #fbf3f5;"
					:style="{width:submitInput+'%'}"
			>申请查看项目</button>
			
			<block v-if="isLookApply">
			  <form report-submit="true" @submit="submitApply">
				<view class="applyList">
					<view class="appListProjectName">
						<text>项目编号:</text>
						<input placeholder="请向项目负责人索取编号..." @input="inputProjectName" :value="projectName" :style="{width:width+'px'}"></input>
					</view>
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputName" :value="trueName" :style="{width:width+'px'}"></input>
				    </view>
					<view class="appListView2">
						<text>理由:</text>
						<input placeholder="填入申请查看项目的理由" 
						          :style="{width:width+'px'}" 
								  :value="why" 
								  @input="inputWhy"
						></input>
					</view>
					<button
					          class="submitApply" 
							  plain="true" 
							  style="color:#fbf3f5; border:1px solid #fbf3f5;"
							  form-type="submit"
					>提交申请</button>
				</view>
			  </form>
			</block>
			
		    <button @click="applyProject()" 
			        class="ibutton"
					plain="true" 
					style="color:#fbf3f5; border:1px solid #fbf3f5;"
			>申请新建项目</button>
			
			<block v-if="isApplyProject">
			  <form report-submit="true" @submit="submitApplyProject">	
				<view class="applyList">
					<view class="appListProjectName">
						 <text>项目编号:</text>
						 <input placeholder="填入项目编号(字母开头和数字组合10位数以内)" @input="inputApplyProjectName" :value="applyProjectName" :style="{width:width+'px'}"></input>
					</view> 
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputApplyTrueName" :value="applyTrueName" :style="{width:width+'px'}"></input>
					</view>  
					<view class="appListView2">
						  <text>理由:</text>
						  <input placeholder="填入申请项目的理由....." 
						            :style="{width:width+'px'}"
									:value="applyWhy"
									@input="inputApplyWhy"
									
						  >
						  </input>
					</view>
					<button form-type="submit"
					        class="submitApply" 
							plain="true" 
							:style="{width:submitInput+'%'}"
							style="color:#fbf3f5;border:1px solid #fbf3f5"
					>提交申请</button>
				</view>
				</form>
			  </block>	
			</block>
			
	    </view>
		<view class="ableProjects">
			<view class="titleInfo">
				<text>临时访问项目:</text>
			</view>
			<block v-if="ableLookProject">
				<view v-for="(item,index) in ableLookProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject"  plain="true">{{item.projectName}}</button>
				</view>
			</block>	
			<view class="titleInfo">
				<text>负责人项目:</text>
			</view>
			<block  v-if="chargeProject">
				<view v-for="(item,index) in chargeProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject"  plain="true">{{item.projectName}}</button>
				</view>	
			</block>	
			<view class="titleInfo">
				<text>参与人项目:</text>
			</view>
			<block v-if="joinProject">
				<view v-for="(item,index) in joinProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject"  plain="true">{{item.projectName}}</button>
				</view>	
		    </block>
		</view>
	</scroll-view>
</template>

<script>
	//引入封装好模块
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	
	//引入时间格式处理函数
	import {formatDate} from '../../static/utils/time.js';
    import {addFormId} from '../../static/utils/utils.js';
	import {compareTime} from '../../static/utils/utils.js';
	
	
	//引入分页的组建-实现分页查询
	import {projectQuery,
	        roleApplyAdd,
			sprintQuery,
			projectApplyAdd,
			messageSend
	        } from '../../static/utils/api.js';
	
	var _this;
	export default {
		data() {
			return {
				width:"",                 //设置输入框的长度
				submitInput:"",
				userInfo:{},              //用户的个人信息，
			
				isLookApply:false,
				windowWidth:"" ,          //可使用的窗口的宽度
				isApplyProject:false,    //展示申请项目的页面
				
				trueName:"",             //申请查看的人的真实姓名
				why:"",                  //申请查看的理由
				projectName:"",            //申请查项目的项目的编号
				 
				applyTrueName:"",      //申请项目的人的真实姓名
				applyProjectName:"",   //申请项目的项目编号
				applyWhy:"",           //申请项目的理由 
				
				
				ableLookProject:[],     //可查看的项目
				chargeProject:[],       //负责的项目
				joinProject:[],         //参与的项目
				
				allUserProjectInfo:[],    //存放着所有项目的信息
			}
		},
		
		onShow() {
			_this = this;
			_this.getSystem();
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{ 
				   let id = {
					   id:res.data.id
				   };
				   _this.getSystem();  //获取系统信息
				   Query.findUser(id)
				   .then(data=>{
					   //console.log("用户的信息",data.data.records[0]);
					   if(data.data.records[0].isRoot){
						   uni.switchTab({
						   	 url:'../people/people'
						   })
					   }else{
						 _this.userInfo = data.data.records[0];
						 _this.getAllProjectInfo();         //查询所有的项目信息   
					   }
				   })
				   .catch(error=>{
					   uni.showToast({ 
					   	title:"网络连接错误",
						icon:'none',
						duration:500
					   })
				   })
				},
				fail:(error)=>{
					uni.redirectTo({
						url:'../login/login'
					})
				}
			})
		},
		 
		methods:{
			
			//获取系统信息设置输入框的长达
			getSystem:function(){
			 	uni.getSystemInfo({
			 		success:(res)=> {
						let textWidth = parseInt(res.windowWidth*0.2);
						let submitInput = parseInt(200/res.windowWidth)*100;
			 			_this.width = parseInt(res.windowWidth)-textWidth;    
			 		},
			 		fail:()=> {
			 			uni.showToast({
			 				duration:500,
			 				title:"获取宽度失败",
			 				icon:"none"
			 			})
			 		}
			 	})
			 },
			
			//输入查看者的真实姓名
			inputName:function(e){
			   _this = this;
			   _this.trueName = e.detail.value;
			},
			
			//输入项目的编号
			inputProjectName:function(e){
				_this = this;
				_this.projectName = e.detail.value;
			},
			
			//输入申请查看项目的原因
			inputWhy:function(e){
				_this = this;
				_this.why = e.detail.value;
			},
			
			//输入申请项目人的真实姓名
			inputApplyTrueName:function(e){
				_this = this;
				_this.applyTrueName = e.detail.value;
			},
			
			//输入申请项目的名称
			inputApplyProjectName:function(e){
				_this = this;
				let reg = /[A-Za-z]+[0-9]+/g;
			    let applyProjectName = e.detail.value;
				if(reg.test(applyProjectName)){
					_this.applyProjectName = applyProjectName;
				}
				if(applyProjectName.length>10){
				      _this.applyProjectName = "";
						uni.showToast({
							title:"编号格式有误",
							duration:1000,
							icon:"none"
						})
				}
			},
			
			//输入申请项目的理由
			inputApplyWhy:function(e){
				_this = this;
				_this.applyWhy = e.detail.value;
			},
			
			//获取所有项目的信息
			 getAllProjectInfo:function(){
						  _this = this;
						  uni.showLoading({
						  	title:"获取中",
							success:()=>{
							  Query.findAllProjectInfo()
							  .then(data=>{
								  uni.hideLoading();
								 // console.log("获取到的所有的项目的信息",data.data.records);
								  _this.allUserProjectInfo = data.data.records;
								  _this.getUserProjectRole();
							   })
							   .catch(Error=>{
								   uni.showToast({
								   	title:"网络错误",
									icon:"none",
									duration:1000
								   })
							   })
							}
						  })
			    },
			
			
	        //查询t_role_project_role表中所有用户的字段（userId、projectId、roleId并进行显示编号处理
			getUserProjectRole:function(){
				_this = this;
				let arry1 = [];
				let arry2 = [];
				let arry3 = [];
				let arry4 = [];
				let arry5 = [];
				let arry6 = [];
				let promise = ()=>{
				    return new Promise(resolve=>{
						resolve()
					})	
				}
				Query.findUserProjectRoleByUserId(_this.userInfo.id)
				.then(data=>{
					let dataAll = data.data.records;
					if(dataAll.length!=0){
					  dataAll.forEach((item,index)=>{
					   if(item.roleId===1){
					  	   arry1.push(item)
					   }else if(item.roleId===2){
					       arry2.push(item)
					   }else if(item.roleId===3){
					       arry3.push(item)
					   }
					  });	
					}
					
					//进行显示编号的处理
					for(let i = 0;i<_this.allUserProjectInfo.length;i++){
						for(let j = 0;j<arry1.length;j++){
							if(_this.allUserProjectInfo[i].id === arry1[j].projectId){
								let projectName = _this.allUserProjectInfo[i].projectName;
								let newObject = {...arry1[j],projectName};
								arry4.push(newObject);
							}
						}
					}
					for(let i = 0;i<_this.allUserProjectInfo.length;i++){
						for(let j = 0;j<arry2.length;j++){
							if(_this.allUserProjectInfo[i].id === arry2[j].projectId){
								let projectName = _this.allUserProjectInfo[i].projectName;
								let newObject = {...arry2[j],projectName};
								arry5.push(newObject);
							}
						}
					}
					for(let i = 0;i<_this.allUserProjectInfo.length;i++){
						for(let j = 0;j<arry3.length;j++){
							if(_this.allUserProjectInfo[i].id === arry3[j].projectId){
								let projectName = _this.allUserProjectInfo[i].projectName;
								let newObject = {...arry3[j],projectName};
								arry6.push(newObject);
							}
						}
					}
					promise();
				})
				.then(()=>{
					_this.chargeProject = arry4;
					_this.joinProject = arry5;
					_this.ableLookProject = arry6;
				})
				.catch(error=>{
					console.log(error);
					uni.showToast({
						title:"网络错误",
						icon:"none",
						duration:1000
					})
				})
				
			},
			
			//根据具体得到的ableLookProject chargeProject joinProject这三个去查询项目的信息
			//选择项目并进入选中项目，设置nowInProject,并且调用设置sprintId的函数
			enterProject:function(e){
				_this = this;
				let nowChooseProject = JSON.parse(e.target.id)
				console.log(nowChooseProject);
				let projectId = nowChooseProject.projectId;
				_this.setSprintId(projectId)
				uni.setStorage({
					key:"nowInProject",
					data:nowChooseProject,
					success:()=>{
						uni.switchTab({
							url:'../index/index'
						})
					},
					fail:(error)=>{
						console.log("请重新选择")
					}
				})
			},
			
			 
			//查看项目
			bindChange:function(){
				_this = this;
				_this.isLookApply = !_this.isLookApply;
				_this.isApplyProject = false
			},
			
			
			
			//申请项目显示项目申请表
			applyProject:function(){
				_this = this;
				_this.isApplyProject = !_this.isApplyProject;
				_this.isLookApply = false;
			},
			
			
			//提交申请的项目的函数,提交之前先去t_project中寻找有没有这个项目编号.
			//有的就直接拿projectId下来
			submitApply:function(e){
				_this = this;
				addFormId(_this.userInfo.openId,e.detail.formId);
				if(_this.projectName&&_this.trueName&&_this.why){    //申请查看的项目
				    _this.findProjectIdByProjectName(_this.projectName,(data)=>{
						if(data.length!=0){
						  let projectId = data[0].id;
						   console.log(_this.toJude(projectId))
						   
						   //首先判断用户是不是已经有了这个项目的权限了
	                       if(_this.toJude(projectId)){
							   uni.showToast({
							    	title:"您已有该项目权限",
									duration:1000,
									icon:"none"
							   })
						   }else{
							    uni.showLoading({
							      title:"提交中",
							      success:()=>{
							   		 uni.request({
							   			url:roleApplyAdd,
							   			method:"POST",
							   			data:{
							   				projectId:projectId,
							   				userId:_this.userInfo.id,
							   				trueName:_this.trueName,
							   				content:_this.why
							   			},
							   			dataType:'json'
							   		 })
							   		 .then(data=>{
							   			 uni.hideLoading();
							   			 console.log(data)
										 _this.getUserOpenIdByPushUserId(projectId)     //拿到projectId用于获取该项目的负责人的openId
							   		 })
							   		 .catch(error=>{
							   				uni.showToast({
							   				title:"网络错误",
							   				duration:500,
							   				icon:'none'
							   			 })	
							   		 })
							   	}
							   })
						   }
								  
						}else{
							uni.showToast({
								title:"项目的编号不存在",
								duration:1500,
								icon:"none"
							})
						}
					})
				}else{
					uni.showToast({
						duration:500,
						icon:"none",
					    title:"请完善信息"
					})
				 }
			  },
			  
			  
			  //根据项目编号(projectName)寻找projectId的函数-用于申请查看项目
			  findProjectIdByProjectName:function(projectName,callback){
				  _this = this;
				  uni.showLoading({
				  	 title:"查询中",
					 success:()=>{
					   uni.request({
					  	url:projectQuery,
						method:"POST",
						data:{
							projectName:projectName
						},
						dataType:'json'
					  }) 
					  .then(data=>{
					  	 uni.hideLoading();
						 console.log("查询到的数据",data[1].data.data.records)
						 callback(data[1].data.data.records)
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
			  
			  
			  
			  //提交申请新增项目的函数申请的时候已经有的不添加，没有的就添加
			  submitApplyProject:function(e){
				  _this = this;
				  addFormId(_this.userInfo.openId,e.detail.formId);
				  if(_this.applyWhy&&_this.applyTrueName&&_this.applyProjectName){
					   uni.showLoading({
							title:"提交中",
							success:()=>{
								uni.request({
									url:projectApplyAdd,
									method:"POST",
									data:{
										projectName:_this.applyProjectName,
										userId:_this.userInfo.id,
										trueName:_this.applyTrueName,
										reason:_this.applyWhy
									},
									dataType:'json'
								})
								.then(data=>{
									uni.hideLoading();
									if(data[1].data.code===200){
										_this.pushApplyProject()
									}else if(data[1].data.code===525){
										uni.showToast({
											title:"编号已存在",
											icon:"none",
											duration:1000
										})
									}
								})
								.catch(Error=>{
									uni.showToast({
										title:"网路错误",
										duration:1000,
										icon:"none"
									})
								})
							}
					   })
				  }else{
					  uni.showToast({
					  	title:"信息不完整",
						icon:"none",
						duration:1000
					  })
				  }
			  },
			  
			  
			  //设置冲刺到storage中的sprintId中
			  setSprintId:function(projectId){
				    console.log("进入设置冲刺的函数")
				    _this = this;
				  	if(projectId){
				   	uni.request({
				   	url:sprintQuery,
				   	method:"POST",
				   	data:{
				   		projectId:projectId,
						pageNum:0,
						pageSize:1000
				   	},
				   	dataType:'json',
				   })
				   .then(data=>{
				   	let allSprint = data[1].data.data.records;
				  	let sprintId = "";
				   	if(allSprint.length){
				  	  //获取当前的时间并且进行时间转换用作比较
						 let nowDateTime = formatDate(new Date());
						 for(let i = 0;i<allSprint.length;i++){
							compareTime(allSprint[i].startTime,allSprint[i].endTime,nowDateTime,(jude)=>{
								if(jude){
									sprintId = allSprint[i].id;
									console.log("设置了冲刺",sprintId);
									uni.setStorage({
										key:'sprintId', 
										data:sprintId,
									})
								}
							})
						 } 
						 if(sprintId===""){           //如果实在都超过了时间段就默认进入最后一个
							   let len = allSprint.length-1;
							   sprintId = allSprint[len].id;
							   uni.setStorage({
								key:'sprintId', 
								data:sprintId,
								success:()=>{
									console.log("设置冲刺成功",sprintId);
								}
							   })
						 }  	 
				   	}else{
				  		uni.setStorage({
				  			key:'sprintId',
				  			data:""
				  		})
				  	}
				   })
				   .catch(Error=>{
				   	uni.showToast({
				   		title:"网络错误",
				   		duration:1000,
				   		icon:"loading"
				   	})
				   })	
			  }
			},
			
			//一个方法用户判断用户是否已经有了某些项目的权限,有了就不用再次提交了
			toJude:function(projectId){
				_this = this;
				console.log(projectId)
				let arry1 = _this.ableLookProject.concat(_this.joinProject);
				let arry2 = arry1.concat(_this.chargeProject)
				console.log("拼接后的项目",arry2)
				for(var i in arry2){
					if(arry2[i].projectId === projectId){
						return true
					}
				}
				return false;
			},
			
			//消息推送申请查看项目
			pushApplyLookProject:function(openId){
				_this = this;
				console.log("拿到的openId",openId);
				let applyTime = formatDate(new Date());
				uni.showLoading({
					title:"提交提交中",
					success:()=>{
						uni.request({
							url:messageSend,
							method:"POST",
							data:{
								"touser": openId,              //目标用户
							    "template_id": "FE-AORZYC_o3cwMXmLYPpPNt0hgHVbyld3isE2i3z5U",    //模板id
								"page": "pages/message/message",
							    "form_id": "",                                               //表单提交后返回的formid
								"data": {
									 "keyword1": {
										"value": _this.projectName,
									},
									"keyword2": { 
										"value": _this.trueName
									},
									"keyword3": {
										"value": applyTime
									},
									"keyword4": {
										"value": _this.why
									},
									"emphasis_keyword": "keyword1.DATA"
								}
							},	
						}) 
						.then(data=>{
							uni.hideLoading();
							uni.showToast({
								title:"提交成功",
								icon:"../../static/img/Icon/success.png",
								duration:500,
								success:()=>{
									_this.isLookApply = false;
								}
							})
							console.log("消息推送成功",data)
						})
						.catch(Error=>{
							uni.showToast({
								title:"网络错误",
								icon:"loading",
								duration:500
							})
						})
					}
				})
			},
			
			//用于提交申请的项目
			pushApplyProject:function(formId){
				_this = this;
				let applyTime = formatDate(new Date());
				Query.findRootUserInfo()                    //查找超级用户的openid
				.then(data=>{
					console.log(data)
					let openId = data.data.records[0].openId;
					console.log(openId)
					uni.showLoading({
						title:"提交中",
						success:()=>{
							uni.request({
								url:messageSend,
								method:"POST",
								data:{
									  "touser":openId,
									  "template_id":"WbZENx_FJEUAppF6QtaGDYbsyIHsATescsF0YVFRib4",    //模板id
									  "page":"pages/reviewProject",
									  "form_id":"",                                   //实际后台拼接目标用户缓存中的openId
									  "data": {
									  	 "keyword1":{
									  		"value":_this.applyProjectName,
									  	},
									  	"keyword2":{ 
									  		"value":_this.applyTrueName,
									  	},
									  	"keyword3":{
									  		"value":applyTime,
									  	},
									  	"keyword4":{
									  		"value":_this.applyWhy
									  	},
									  	"emphasis_keyword": "keyword1.DATA"
									  }	
								},	
							})
							.then(data=>{
								uni.hideLoading();
								uni.showToast({
									title:"提交成功",
									icon:"../../static/img/Icon/success.png",
									duration:500,
									success:()=>{
									   _this.isApplyProject = false;
									}
								})
								console.log("消息推送成功",data)
							})
							.catch(Error=>{
								uni.showToast({
									title:"网络错误",
									icon:"loading",
									duration:500
								})
							})
						}
					})
				})
				.catch(Error=>{
					uni.showToast({
						title:"网络错误",
						duration:500,
						icon:"loading"
					})
				})
			},
			
			
			
			//查询申请项目负责人userId并查询用户的openid
			getUserOpenIdByPushUserId:function(projectId){
				_this = this;
				Query.findUserProjectRoleByRoleAndProject(1,projectId)
				.then(data=>{
					console.log("查询到的",data)
					let userId = data.data.records[0].userId;
					let id = {
						id:userId
					}
					return Query.findUser(id)
				})
				.then(data=>{
					console.log(data)
					console.log("拿用户的",data)
					let openId = data.data.records[0].openId;
					console.log(openId);
					_this.pushApplyLookProject(openId)
				})
				.catch(Error=>{
					uni.showToast({
						title:"网络错误",
						icon:"loading",
						duration:500
					})
				})
				
			},
			
			
	}
}
</script>

<style>
page{
	
}
.all{
	width: 100%;
	overflow: scroll;
}
.search_project{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	color:#F0F8FF;
}
::-webkit-scrollbar{
	width: 4upx;
	height: 6upx;
}
.ibutton{
	width: 40%;
	height: 100upx;
	color:#F0F8FF;
	border-radius: 4%;
	font-size: 35upx;
	font-weight: 300;
	margin-top: 10upx;
}

.applyList{
	width: 100%;
	display: flex;
	flex-direction: column;
    justify-content: flex-start;
	align-items: center;
}
.applyList view{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-top: 5upx;
	height: 100upx;
	font-size: 26upx;
	width: 100%;
}
.applyList view text{
	width:20%;
	margin-left: 2%;
	line-height: 80upx;
	height: 80upx;
}
.applyList view input{
	margin-left: 5upx;
	height: 80upx;
	line-height: 80upx;
	border-radius: 4%;
}


.appListView2{
	height: 100upx!important;
}
.appListView2 text{
  height: 100upx!important;
  font-size:26upx!important;
  line-height: 100upx!important;
}
/*.appListView2 textarea{
	height: 80upx;
	border-radius: 2%;
	margin-top: 5upx;
}*/

/*提交申请表的按钮*/
.submitApply{
	height: 100upx;
	border-radius: 2%;
	margin-top: 15upx;
	margin-bottom: 20upx;
	font-size: 30upx;
	line-height: 100upx;
	color: #333333;
	border: 1px solid #FCFBFF;
}


.ableProjects{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;
	margin-top: 150upx;
}
.titleInfo{
	background-color:#063143 ;
	height: 50upx;
	margin-top: 10upx;
	width: 100%;
	font-size: 30upx;
	margin-bottom: 15upx;
	color:#F0F8FF;
	font-weight: 800;
}
.titleInfo text{
	line-height: 50upx;
}
.uniTag{
	background-color: #5087BF;
}

.myHadProject{
	height: 50upx;
	width: 100%;
	font-size: 30upx;
}
.myHadProject button{
	height: 50upx;
	line-height: 50upx;
	text-align: left;
	font-size:26upx;
	width: 100%;
	font-weight: 700;
	color: #F8F1F3;
	border: 0upx;
}
</style>
