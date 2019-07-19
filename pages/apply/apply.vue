<template>
	<scroll-view class="all" scroll-y="true">
		
		<view class="search_project">
			<button @click="bindChange()" 
			        class="ibutton" 
					plain="true" 
					style="color:#fbf3f5; border:1px solid #fbf3f5;"
			>查看项目</button>
			
			<block v-if="isLookApply">
				<view class="applyList">
					<view class="appListProjectName">
						<text>项目编号:</text>
						<input placeholder="请输入项目的编号..." @input="inputProjectName" :value="projectName" :style="{width:width+'px'}"></input>
					</view>
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputName" :value="trueName" :style="{width:width+'px'}"></input>
				    </view>
					<view class="appListView2">
						<text>理由:</text>
						<textarea placeholder="填入申请查看项目的理由" 
						          :style="{width:width+'px'}" 
								  :value="why" 
								  @input="inputWhy"
						></textarea>
					</view>
					<button  @click='submitApply'  
					          class="submitApply" 
							  plain="true" 
							  style="color:#fbf3f5; border:1px solid #fbf3f5;"
					>提交申请</button>
				</view>
			</block>
			
		    <button @click="applyProject()" 
			        class="ibutton"
					plain="true" 
					style="color:#fbf3f5; border:1px solid #fbf3f5;"
			>申请项目</button>
			
			<block v-if="isApplyProject">
				<view class="applyList">
					<view class="appListProjectName">
						 <text>项目编号:</text>
						 <input placeholder="填入项目编号(即名称15字以内)" @input="inputApplyProjectName" :value="applyProjectName" :style="{width:width+'px'}"></input>
					</view> 
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputApplyTrueName" :value="applyTrueName" :style="{width:width+'px'}"></input>
					</view>
					<view class="appListView2">
						  <text>理由:</text>
						  <textarea placeholder="填入申请项目的理由" 
						            :style="{width:width+'px'}"
									:value="applyWhy"
									@input="inputApplyWhy"
						  >
						  </textarea>
					</view>
					<button @click='submitApplyProject' 
					        class="submitApply" 
							plain="true" 
							style="color:#fbf3f5; border:1px solid #fbf3f5;"
					>提交申请</button>
				</view>
			</block>
			
	    </view>
		<view class="ableProjects">
			<view class="titleInfo">
				 <uni-tag text="可看的项目:" type="primary" ></uni-tag>
			</view>
			<block v-if="ableLookProject">
				<view v-for="(item,index) in ableLookProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject">A项目{{index+1}}</button>
				</view>
			</block>	
			<view class="titleInfo">
				<uni-tag text="负责的项目:" type="warning" ></uni-tag>
			</view>
			<block  v-if="chargeProject">
				<view v-for="(item,index) in chargeProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject">C项目{{index+1}}</button>
				</view>	
			</block>	
			<view class="titleInfo">
				<uni-tag text="参与的项目" type="error" ></uni-tag>
			</view>
			<block v-if="joinProject">
				<view v-for="(item,index) in joinProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject" >J项目{{index+1}}</button>
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

	
	
	//引入分页的组建-实现分页查询
	import uniPagination from "../../components/uni-pagination/uni-pagination.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import {projectQuery,roleApplyAdd,sprintQuery} from '../../static/utils/api.js';
	
	var _this;
	export default {
		components: {uniPagination,uniTag},
		data() {
			return {
				width:"",                 //设置输入框的长度
				userInfo:{},              //用户的个人信息，
				nowProjectItems:[],       //实际的项目，存放着项目的信息。
			
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
					   console.log("用户的信息",data.data.records[0]);
					  _this.userInfo = data.data.records[0];
					  _this.getUserProjectRole();         //查询t_user_role_project中有的用户的项目	
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
			 			_this.width = (parseInt(res.windowWidth)-80);     //50px是text的upx转成px的长度
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
				_this.applyProjectName = e.detail.value;
			},
			
			//输入申请项目的理由
			inputApplyWhy:function(e){
				_this = this;
				_this.applyWhy = e.detail.value;
			},
			
			
	        //查询t_role_project_role表中所有用户的字段（userId、projectId、roleId）
			getUserProjectRole:function(){
				_this = this;			
				Query.findUserProjectRoleByUserId(_this.userInfo.id)
				.then(data=>{
					let dataAll = data.data.records;
					console.log("查询到的用户权限项目",dataAll)
					let arry1 = [];
					let arry2 = [];
					let arry3 = [];
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
					_this.chargeProject = arry1;
					_this.joinProject = arry2;
					_this.ableLookProject = arry3;	
				})
				.catch(error=>{
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
				console.log("进入这个提交申请的函数")
				_this = this;
				let applyTime = formatDate(new Date());  
				console.log("获取申请的时间",applyTime)
				//console.log("我的申请的时间",applyTime)
				//console.log("提交申请的项目编号和真实姓名和原因",_this.projectName,_this.trueName,_this.why)
				if(_this.projectName&&_this.trueName&&_this.why){    //申请查看的项目
				    _this.findProjectIdByProjectName(_this.projectName,(data)=>{
						console.log("查询搭配的即将发送的",data[0])
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
							   				content:_this.why,
							   				effectiveTime:applyTime
							   			},
							   			dataType:'json'
							   		 })
							   		 .then(data=>{
							   			 uni.hideLoading();
							   			 console.log(data)
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
			  
			  
			  //根据项目编号(projectName)寻找projectId的函数
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
			  
			  //提交申请新增项目的函数                  申请项目待完善
			  submitApplyProject:function(){
				  
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
				   	let allSprint = data[1].data.data.records;
				  	let sprintId;
				   	if(allSprint.length){
				  	  //获取当前的时间并且进行时间转换用作比较
				  	  let nowDateTime = new Date(Date.parse(formatDate(new Date())));
				  	  for(var i in allSprint){
				  	  	if(new Date(Date.parse(allSprint[i].startTime))<=nowDateTime
				  	  	&&nowDateTime<new Date(Date.parse(allSprint[i].endTime))){
				  	  		sprintId = allSprint[i].id;
				  	  	}	
				  	  }
				  	  if(sprintId==""){ //如果实在都超过了时间段就默认进入最后一个
				  		  sprintId = allSprint.pop().id;
				  	  }
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
			}
	}
}
</script>

<style>
.all{
	width: 100%;
	overflow: scroll;
}
.search_project{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top:50upx;
	color:#FEFEFE;
}
::-webkit-scrollbar{
	width: 4upx;
	height: 6upx;
}
.ibutton{
	width: 300upx;
	height: 100upx;
	color: #19BE6B;
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
	width: 100%;
	font-size: 25upx;
}
.applyList view text{
	width:120upx;
	margin-left: 10upx;
	line-height: 80upx;
	height: 80upx;
}
.applyList view input{
	margin-left: 5upx;
	height: 80upx;
	line-height: 80upx;
	border-radius: 4%;
	border:1upx solid #eea4b8;
}


.appListView2{
	height: 250upx!important;
}
.appListView2 text{
  height: 250upx!important;
  font-size:30upx!important;
  line-height: 250upx!important;
}
.appListView2 textarea{
	height: 250upx;
    border:1px solid #f8f1f3;
	border-radius: 2%;
	margin-top: 5upx;
}

/*提交申请表的按钮*/
.submitApply{
	width: 200upx;
	height: 100upx;
	border-radius: 2%;
	margin-top: 15upx;
	margin-bottom: 20upx;
	font-size: 30upx;
	line-height: 100upx;
}


.ableProjects{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;
	margin-top: 50upx;
}
.titleInfo{
	height: 50upx;
	margin-top: 10upx;
	width: 100%;
	margin-bottom: 15upx;
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
	font-size:25upx;
	width: 100%;
}
</style>
