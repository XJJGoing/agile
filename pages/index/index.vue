<template>
	<scroll-view scroll-y="true"
	             class="project"
	>
	<block v-if="roleId==0">
		<text style="{color:#FCFBFF;font-size: 40upx; height: 100upx;}">无参看权限!!!</text>
	</block>
	
   <block v-else>
	<view class="chooseItem">
			 <picker @change="bindPickerMyProject" :value="index" :range="myProject">
				 <text>切换首页项目</text>
			 </picker>
			<picker @change="bindPickerLookProject" :value="index" :range="myLookProject">
			    <text>切换可看项目</text>
			</picker>
	</view>
	
	<view class="titleView">
	   <text class="title">项目信息:</text>
	</view>
	<view class="projectInfo">
		 <view>
			 <text>项目编号:</text>
			 <input disabled="true" :value="nowProject.projectName" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>项目目标:</text>
			 <input placeholder="填入项目的目标" :value="nowProject.projectTarget" @input="ftarget" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>交付时间:</text>
			 <input placeholder="填入项目交付的时间" :value="nowProject.projectFinishTime"  @input="ffinishTime" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>项目成果:</text>
			 <input placeholder="填入项目的成果" :value="nowProject.projectResult" @input="fresult" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>项目管理:</text>
			 <input placeholder="填入项目的管理" :value="nowProject.projectManagement" @input="fmanagement" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>冲刺个数:</text>
			 <input placeholder="填入项目冲刺的个数" :value="nowProject.projectSprintNum" @input="fspintNum" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
		 <view>
			 <text>项目成员:</text>
			 <input placeholder="填入项目的成员(输入数字)" :value="nowProject.projectPeople" @input="fpeople" :disabled="isChooseInput" :style="{width:width+'px'}"></input>
		 </view>
	</view>
	   
	 <block v-if="roleId===1">
		 <view class="footer">
			 <block v-if="roleId===1&&isDisplay">
				   <QSWavesButton btnType="default" 
								  @click="saveProject"
								  plain="true"
								  class="QSbutton"
								  wavesColor="rgba(211,220,114,0.93)"
								  btnStyle="{font-size:35upx;color: #E9EFED;}"
					>
					<text>提交</text>
				   </QSWavesButton>
			 </block>
				 <QSWavesButton btnType="default"
				                @click="addSprint"
								plain="true"
								class="QSbutton"
								wavesColor="rgba(114,220,158,0.93)"
								btnStyle="{font-size:35upx;color:#E9EFED;}"
				 >
				  <text>添加冲刺</text>
				 </QSWavesButton>
		 </view>
	 </block>
		 <QSWavesButton btnType="default" 
						@click="returnApply"
						plain="true"
						class="QSbutton"
						wavesColor="#e4712b"
						btnStyle="{font-size:35upx;color:#E9EFED;width:400upx;}"
		 >
		 <text>申请查看其他项目</text>
		 </QSWavesButton>
  </block>
	</scroll-view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Query = new query();
	const Login = new login();
	import {addFormId} from '../../static/utils/utils.js';
	import {formatDate} from '../../static/utils/time.js';
	import {projectQuery,userPojectRoleQuery,projectUpdate,sprintQuery} from '../../static/utils/api.js'
	
	 import uniTag from "@/components/uni-tag/uni-tag.vue"
	 import QSWavesButton from '@/components/QS-WavesButton/QS-WavesButton.vue';
	var _this;
	export default {
		components:{
			QSWavesButton,
			uniTag
		},
		data() {
			return {
				width:"",                  //设置input的长度
				userInfo:{},
				projectId:"",                 //假数据 
                nowProject:{},				  //显示的项目
				isDisplay:true,              //是否显示按钮
				isChooseInput:true,          //是否可以输入
				roleId:"",
				
				target:"",
				finishTime:"",
				result:"", 
				management:"",
				sprintNum:"",
				people:"",
	            
				allUserProjectRoles:[],     //从t_user_role_project这张表中拿到的所有的权限为1234的项目		
				allUserProjectInfo:[],      //所有的项目信息
							  
				myProject:[],       //切换的项目,权限为 1 2的项目的编号即项目的projectName
				myLookProject:[]   ,//切换项目，项目的权限为可查看的编号projectName
			    
				
			}
		},
		mounted(){
			         //获取所有的项目信息 
		},
		
		//写好的页面加载的函数
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
					 _this.userInfo = data.data.records[0];
					 if(data.data.records[0].isRoot){
						 _this.roleId=0;
					 }else{
					    uni.getStorage({
							 key:"nowInProject",
							 success:(res)=>{
								 _this.projectId = res.data.projectId;
								 _this.roleId = res.data.roleId;
								   _this.getAllProjectInfo();              //获取所有项目的信息
							 },
							 fail:()=>{
								uni.redirectTo({
									url:'../apply/apply'
								})	 
							 }
						 })
					   }
					})
				   .catch(error=>{
					   console.log(error)
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
			
			//设置输入框的长度
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.width = parseInt(res.windowWidth)-80;
					}
				})
			},
			
			//填写信息的函数 
			ftarget:function(e){
				this.target = e.detail.value;
			},
			
			ffinishTime:function(e){
				 this.finishTime = e.detail.value;
			},
			
			fresult:function(e){
				this.result = e.detail.value;
			},
			
			fmanagement:function(e){
				 this.management = e.detail.value;
			},
			
			fspintNum:function(e){
				this.sprintNum = e.detail.value;
			},
			
			fpeople:function(e){
				  let reg = /^[0-9]$/g
				  let people = e.detail.value;
				  if(reg.test(people)){
					  this.people = people;
				  }else{
					uni.showToast({
						title:"请输入数字",
						icon:"none",
						duration:500
					})  
				  }
			},
			
			//切换12权限项目
			bindPickerMyProject:function(e){
				_this = this;
				let index = e.detail.value;             
				let chooseProjectName = _this.myProject[index];            //选中的项目的名称
				let chooseProjectId;                                       //选中的项目的id
				for(let i = 0;i<_this.allUserProjectInfo.length;i++){      //筛选选中的项目的id
					if(chooseProjectName === _this.allUserProjectInfo[i].projectName){
						chooseProjectId = _this.allUserProjectInfo[i].id;
					}
				}
				let nowInProject;                                  //暂时存放项目权限用户信息.
				_this.allUserProjectRoles.forEach((item,index)=>{
					if(item.projectId === chooseProjectId){
						nowInProject = item;
					}
				})
				uni.setStorage({  //改变nowInProject
					key:"nowInProject",
					data:nowInProject,
					success:()=>{
					   //改变项目的项目的id和权限,并且重新获取信息.
					  _this.projectId = nowInProject.projectId;
					  _this.roleId = nowInProject.roleId;
					  _this.getProject();
					  _this.setSprintId(_this.projectId);
					},
					fail:()=>{
						uni.showToast({  
							title:"切换失败",
							icon:"loading", 
							duration:1000
						})
					}
				})
			},
			
			//切换3可看项目
			bindPickerLookProject:function(e){
				_this = this;
				let index = e.detail.value;
				let chooseProjectName = _this.myLookProject[index];            //选中的项目的名称
				let chooseProjectId;                                           //选中的项目的id
				for(let i = 0;i<_this.allUserProjectInfo.length;i++){         //筛选选中的项目的id
					if(chooseProjectName === _this.allUserProjectInfo[i].projectName){
						chooseProjectId = _this.allUserProjectInfo[i].id;
					}
				} 
                let nowInProject;                                   //准备将storage中的nowInProject给替换掉.
				_this.allUserProjectRoles.forEach((item,index)=>{
					if(item.projectId === chooseProjectId){
						nowInProject = item
					}
				})
				uni.setStorage({  
					key:"nowInProject",
					data:nowInProject,
					success:()=>{
					   //改变项目的项目的id和权限,并且重新获取信息.
					  _this.projectId = nowInProject.projectId;
					  _this.roleId = nowInProject.roleId; 
					  _this.getProject();
					  _this.setSprintId(_this.projectId);
					},
					fail:()=>{
						uni.showToast({
							title:"切换失败",
							icon:"loading",
							duration:1000
						})
					}
				})
			},
			
		   //获取所有的项目的信息
		  getAllProjectInfo:function(){
			  _this = this;
			  uni.showLoading({
			  	title:"获取中",
				success:()=>{
				  Query.findAllProjectInfo()
				  .then(data=>{
					  uni.hideLoading();
					  console.log("获取到的所有的项目的信息",data.data.records);
					  _this.allUserProjectInfo = data.data.records;
					  _this.getProject();                  //请求结束之后页面项目的信息
					  _this.getUserProjectRole();          //所有的有关此用户的项目（1234权限）从用户权限关系表中查询
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
			
           //显示查看的项目,并且判断项目的信息为空的时候可以实现填写项目的信息,
		   //不需要再次发送请求
		   getProject:function(){
			       _this = this;
				   let project;
			       for(let i = 0;i<_this.allUserProjectInfo.length;i++){
					   if(_this.projectId === _this.allUserProjectInfo[i].id){
						   project = _this.allUserProjectInfo[i];
					   }
				   }
				   console.log("具体的项目",project)
				   _this.nowProject = project;
				   
				   //对已经有的数据项赋值给输入赋值的数据项，即为空的填不为空的不用再填
				   _this.target = project.projectTarget;
				   _this.sprintNum = project.projectSprintNum;
				   _this.management = project.projectManagement;
				   _this.people = project.projectPeople;
				   _this.finishTime = project.projectFinishTime;
				   _this.result = project.projectResult;
				   
				   //判断是否显示按钮和是否可以输入
				   if(project.projectName&&project.projectTarget&&
				     project.projectFinishTime&&project.projectResult
					 &&project.projectManagement&&project.projectSprintNum&&project.projectPeople!=0&&_this.roleId===1
					 ){ 
						 _this.isDisplay = false;               //不为空不显示,输入默认就行了
						 _this.isChooseInput = true;
					  }else if(_this.roleId===1){
						  _this.isDisplay = true;
						  _this.isChooseInput = false;           //有空的并且权限为1
					  }else{  //其他权限 不可以输入 以及不显示,无论空不空
						  _this.isChooseInput = true;
						  _this.isDisplay = false;
					  }  
			   
		   },
		   
		   
		   //获取用户的权限为将1 2 3 4权限的项目全部查找到再进行分类并且显示项目编号
		   getUserProjectRole:function(){ 
			   _this = this;
			   let arry1 = [];
			   let arry2 = [];
			   let arry3 = [];
			   let arry4 = [];
				Query.findUserProjectRoleByUserId(_this.userInfo.id)
				.then(data=>{
					let dataAll = data.data.records;
					_this.allUserProjectRoles = dataAll;
					if(dataAll!=0){
					  dataAll.forEach((item,index)=>{
					    if(item.roleId===1||item.roleId===2){
					  	  arry1.push(item.projectId);
					  	 }else if(item.roleId===3){
					  	  arry2.push(item.projectId); 
					  	 }
					   });	 
					}
					
					//进行显示项目编号处理
					for(let i = 0;i<_this.allUserProjectInfo.length;i++){
						for(let j = 0;j<arry1.length;j++){
							if(_this.allUserProjectInfo[i].id === arry1[j]){
								arry3.push(_this.allUserProjectInfo[i].projectName)
							}
						}
					}
					for(let i = 0;i<_this.allUserProjectInfo.length;i++){
						for(let j = 0;j<arry2.length;j++){
							if(_this.allUserProjectInfo[i].id === arry2[j]){
								arry4.push(_this.allUserProjectInfo[i].projectName)
							}
						}
					}
				})
				_this.myProject = arry3;
				_this.myLookProject = arry4;
		   },
		   
		   
		   //提交项目的函数
		   saveProject:function(){
			   console.log("提交的信息",{
				   target:_this.target,
				   sprintNum:_this.sprintNum,
				   management:_this.management,
				   people:_this.people,
				   finishTime:_this.finishTime,
				   result:_this.result,
			   })
			   if(_this.target&&_this.sprintNum&&_this.management&&_this.people&&_this.finishTime&&_this.result){
				   //这里项目信息，将项目信息提交到服务端
				   let data = [{
					   id:_this.projectId,
					   projectId:_this.projectId,
					   projectTarget:_this.target,
					   projectSprintNum:_this.sprintNum,
					   projectManagement:_this.management,
					   projectPeople:_this.people,
					   projectFinishTime:_this.finishTime,
					   projectResult:_this.result 
				   }];
				   
				   //提交到服务端并且进行项目的更新后并重新获取该项目的信息
				   uni.showModal({
				   	title:"提醒",
					content:"项目信息只能完成提交一次,后期无法再修改，提交之前请确认是否所有信息正确且无误",
					confirmText:"确认",
					confirmColor:"#19BE6B",
					cancelText:"再看看",
					cancelColor:"#DD524D",
					success:(res)=>{
						if(res.confirm){
					         uni.showLoading({
					        	  title:"提交中",
								  success:()=>{
									  uni.request({
									   url:projectUpdate,
									   data:data,
									   method:'POST',
									   dataType:'json' 
									 })
									 .then(data=>{
										console.log("更新后的项目",data); 
										uni.hideLoading();
										
									   //提交之后因为项目的信息有改变，所以重新获取全部的项目信息。
									   _this.getAllProjectInfo();
									   
									 })
									 .catch(error=>{
										 uni.showToast({
										 title:"提交失败",
										 duration:1000,
										})
									 })	  
								  }
					        }) 		
						}else if(res.cancel){
							
						}
					}
				  })  
			   }else{
				   uni.showToast({
						title:"请完善信息",   
						icon:"none",
						duration:500
				   })
			   }
		   },
		   
		   //添加冲刺进行页面的跳转。
		   addSprint:function(){
			   uni.navigateTo({
			   	 url:"../addSprint/addSprint"
			   })
		   },  
		      
		   //继续申请查看其他的项目
		   returnApply:function(){
			   uni.removeStorage({
			   	key:"nowInProject",
				success:()=>{
				  uni.redirectTo({
				  	url:'../apply/apply'
				  })	
				 }
			   })
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
		   	   	},
		   	   	dataType:'json',
		   	   })
		   	   .then(data=>{
				console.log("进入获取到的冲刺",data[1].data.data.records)
		   	   	let allSprint = data[1].data.data.records;
		   	  	let sprintId; 
				console.log(allSprint.length)
		   	   	if(allSprint.length){
		   	  	  //获取当前的时间并且进行时间转换用作比较
		   	  	  let nowDateTime = new Date(Date.parse(formatDate(new Date())));
		   	  	  for(var i=0; i<allSprint.length;i++){
		   	  	  	if(new Date(Date.parse(allSprint[i].startTime))<=nowDateTime
		   	  	  	&&nowDateTime<new Date(Date.parse(allSprint[i].endTime))){
		   	  	  		sprintId = allSprint[i].id;
		   	  	  	}	
		   	  	  }
		   	  	  if(!sprintId){                 //如果实在都超过了时间段就默认进入最后一个
				      let len = allSprint.length-1;
		   	  		  sprintId = allSprint[len].id;
		   	  	  }
				  console.log(sprintId)
		   	  	  uni.setStorage({
		   	  	  	key:'sprintId',
		   	  		data:sprintId
		   	  	  })
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
		        
		}
	}
</script>

<style>
.project{
	width: 100%;
	height: auto;
	overflow: scroll;
}
::-webkit-scrollbar{
	height: 6upx;
	width: 2upx;
}
.chooseItem{
	display: flex;
	flex-direction:row;
	justify-content: space-around;
	margin-bottom: 5upx;
}
.chooseItem picker{
	height: 60upx;
	width: 200upx;
	border-radius: 4%;
	text-align: center;
	background-color:rgba(171,159,174,0.93);
}
.chooseItem picker text{
	height: 60upx;
	width: 200upx;
	line-height: 60upx;
    font-size:28upx;
	text-align: center;
}

.titleView{
  width: 100%;
  height: 70upx;
  background-color:#94B6CB ;
  margin-left: 0upx;
}

.title{
	width: 100%;
	height: 70upx;
	line-height: 70upx;
	font-size: 35upx;
	font-family: webfont;
}  

.projectInfo{
	display: flex;
	flex-direction: column;
}
.projectInfo view{
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 70upx;
	width: 100%;
	padding: 20upx;
	margin-top: 3upx;
}
.projectInfo view text{
  font-size:30upx;
  width: 140upx;
  font-weight: 500;
  color:#FCFFFE;
}
.projectInfo view input{
	font-size:28upx;
	height: 60upx;
	margin-left: 5upx;
	color: #FEFAFB;
	line-height: 60upx;
}
.footer{ 
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.QSbutton{
	margin-top: 5upx;
	width: 50%;
	height: 80upx;
	line-height: 80upx;
	margin-top: 10upx;
	margin-bottom: 30upx;
}
.QSbutton text{
	color:#E9EFED;
}

/*字体设置*/
@font-face {
  font-family: 'webfont';
  font-display: swap;
  src: url('//at.alicdn.com/t/webfont_i271qcyeekd.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_i271qcyeekd.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_i271qcyeekd.woff2') format('woff2'),
  url('//at.alicdn.com/t/webfont_i271qcyeekd.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_i271qcyeekd.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_i271qcyeekd.svg#杨任东竹石体-Bold') format('svg'); /* iOS 4.1- */
}
</style>
