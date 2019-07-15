<template>
	<scroll-view class="all" scroll-y="true">
		
		<view class="search_project">
			<i-button @click="bindChange()" i-class="ibutton">申请查看</i-button>
			
			<view class="ipage" v-if="isLookProject">
					<uni-pagination 
						show-icon="true" 
						total="50"
						:current="current"
						@change="handleChange()"
					>
					</uni-pagination>
					<view class="detail">
						<view v-for="(item,index) in nowProjectItems" >
						   <button  @click="chooseProject" class="detail_project" :id="JSON.stringify(item)" >
								<view>P{{index}}</view>
								<view>项目{{index}}</view>
						   </button>								
						</view>
					</view>
			</view>
			 
			<block v-if="isLookApply">
				<view class="applyList">
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputName"></input>
				    </view>
					<view class="appListView2">
						<text>理由:</text>
						<textarea placeholder="填入申请查看项目的理由" 
						          :style="{width:windowWidth+'px'}" 
								  value="" 
								  @input="inputWhy"
						></textarea>
					</view>
					<i-button @click='submitApply' id="1" class="submitApply">提交申请</i-button>
				</view>
			</block>
			
		    <i-button @click="applyProject()" i-class="ibutton">申请项目</i-button>
			
			<block v-if="isApplyProject">
				<view class="applyList">
					<view class="appListView1">
						 <text>申请人:</text>
						 <input placeholder="请填入真实的姓名..." @input="inputName"></input>
					</view>
					<view class="appListView1">
						 <text>项目名:</text>
						 <input placeholder="填入项目名称(15字以内)" @input="inputProjectName"></input>
					</view>
					<view class="appListView2">
						  <text>理由:</text>
						  <textarea placeholder="填入申请项目的理由" 
						            :style="{width:windowWidth+'px'}"
									@input="inputWhy"
						  >
						  </textarea>
					</view>
					<i-button @click='submit' id="2" class="submitApply">提交申请</i-button>
				</view>
			</block>
			
	    </view>
		<view class="ableProjects">
			<view class="titleInfo">可看的项目:</view>
			<block v-if="ableLookProject">
				<view v-for="(item,index) in ableLookProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject">A项目{{index+1}}</button>
				</view>
			</block>	
			<view class="titleInfo">负责的项目:</view>
			<block  v-if="chargeProject">
				<view v-for="(item,index) in chargeProject" :key="index" class="myHadProject">
					<button :id="JSON.stringify(item)" @click="enterProject">C项目{{index+1}}</button>
				</view>	
			</block>	
			<view class="titleInfo">参与的项目:</view>
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
	const time = require('../../static/utils/time');

	
	
	//引入分页的组建-实现分页查询
	import uniPagination from "../../components/uni-pagination/uni-pagination.vue"
	
	import {projectQuery,roleApplyAdd} from '../../static/utils/api.js';
	
	var _this;
	export default {
		components: {uniPagination},
		data() {
			return {
				userInfo:{},              //用户的个人信息，
				nowProjectItems:[],           //实际的项目，存放着项目的信息。
			
				isLookProject:false,     //是否显示查看项目列表
				current:1,               //分页查询的当前页面
				pageSize:10,             //分页查询的查询的最大个数
				isLookApply:false,
				windowWidth:"" ,          //可使用的窗口的宽度
				isApplyProject:false,    //展示申请项目的页面
				lookProject:{},          //存放选中要查看的项目
				
				trueName:"",
				why:"",
				projectName:"",
				
				ableLookProject:[],    //可查看的项目
				chargeProject:[],     //负责的项目
				joinProject:[],        //参与的项目
			}
		},
		
		// mounted() {
		// 	_this = this;
		// 	//如果自己有项目的或者已经可以查看的项目就直接进行跳转
		// 	uni.getStorage({
		// 		key:"nowInProject",
		// 		success:(res)=>{
		// 			uni.redirectTo({
		// 				url:'../index/index'
		// 			})
		// 		},
		// 		fail:()=>{
		// 			 
		// 		}
		// 	})
		// },
		
		onShow() {
			_this = this;
			uni.getStorage({
				key:"userInfo",
				success:(res)=>{ 
				   let id = {
					   id:res.data.id
				   };
				   _this.getSystenInfo();  //获取系统信息
				   _this.firstProjectItem(); //获取第一页项目列表
				   Query.findUser(id)
				   .then(data=>{
					   console.log(data);
					  _this.userInfo = data.data;
					  console.log(_this.userInfo.id);
					  _this.getUserProjectRole();     //查询t_user_role_project中有的用户的项目	
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
		 
		 
		//检查用户查看项目的时间是否过期查看的项目的时间是否过期或者是否有查看项目的权限
		methods:{
			inputName:function(e){
			   _this = this;
			   _this.trueName = e.detail.value;
			},
			inputProjectName:function(e){
				_this = this;
				_this.projectName = e.detail.value;
			},
			inputWhy:function(e){
				_this = this;
				_this.why = e.detail.value;
			},
			
	        //查询t_role_project_role表中所有用户的字段（userId、projectId、roleId）
			getUserProjectRole:function(){
				_this = this;			
				Query.findUserProjectRoleByUserId(_this.userInfo.id)
				.then(data=>{
					//console.log("查询到的用户权限项目",data)
					let dataAll = data.data.records;
					let arry1 = [];
					let arry2 = [];
					let arry3 = [];
					console.log(dataAll);
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
						title:"获取项目类表失败",
						icon:"none",
						duration:1000
					})
				})
				
			},
			
			//选择项目并进入选中项目，设置nowInProject
			enterProject:function(e){
				let nowChooseProject = JSON.parse(e.target.id)
				console.log(nowChooseProject);
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
			
			getSystenInfo:function(){
			 	uni.getSystemInfo({
			 		success:(res)=> {
			 			console.log(res)
			 			_this.windowWidth = (parseInt(res.windowWidth)-80);     //50px是text的upx转成px的长度
			 			console.log(_this.windowWidth)
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
			 
			 firstProjectItem:function() {
			 	_this = this;
			 	uni.request({
			 		url:projectQuery,
			 		method:"POST",
			 		data:{
			 			 id: "",
			 			 pageNum:_this.current,
			 			 pageSize:_this.pageSize
			 		},
			 		dataType:'json'
			 	})
			 	.then(data=>{
			 		console.log(data)
			 		let nowProjectItems = data[1].data.data.records;
			 	    _this.nowProjectItems = nowProjectItems;
			 		
			 		 // console.log("第一次查询的实际的project2",_this.nowProjects)
			 		 // console.log("第一次查询的project",_this.projects)
			 	})
			 },
			 
			//查看项目
			bindChange:function(){
				_this = this;
				_this.isLookProject = !_this.isLookProject;
				_this.isLookApply = false;
				_this.isApplyProject = false
			},
			
			
			//封装从数据库中分页查询的函数
			pageRequest:function(current){
				_this = this;
				uni.request({
					url:projectQuery,
					method:"POST",
					data:{
						id:'',
						pageNum:current,
						pageSize:_this.pageSize
					},
					dataType:'json'
				})
				.then(data=>{
					if(data[1].data.data.records.length){
					 let projects = [];
					  for(let i = 0;i<data[1].data.data.records.length;i++){
					      projects[i] = "项目"+(i+1);
					  }
						_this.nowProjects = data[1].data.data.records;
						_this.projects = projects;
					}else{
						_this.nowProjects = "";
						_this.projects = "";
					}
				})
			},
			
			
			//实现分页查询
			handleChange:function({type,current}){
				_this = this;
				if(type=="next"){
					//console.log("当前页面",current)
					_this.pageRequest(current+1)
				}else{//上一页
					_this.pageRequest(current-1)
				}
			},
			
			//选择申请查看的按钮
			chooseProject:function(e){
				_this = this;
				let chooseProjectItem = JSON.parse(e.target.id);
				_this.lookProject = chooseProjectItem;
				
				if(_this.lookProject!=""){
					_this.isLookProject = !_this.isLookProject;
					_this.isLookApply = !_this.isLookApply;
				}
			},
			
			//申请项目按钮
			applyProject:function(){
				_this = this;
				_this.isApplyProject = !_this.isApplyProject;
				_this.isLookApply = false;
				_this.isLookProject = false;
			},
			
			//提交申请的项目的函数 
			submitApply:function(e){
				_this = this;
				let id = e.target.id;            //1 表示申请查看项目  2表示申请项目
				let applyTime = time.formatDate(new Date()).toString();  
				//console.log("我的申请的时间",applyTime)
				let data={
					projectId:_this.lookProject.id,
					userId:_this.userInfo.id,
					trueName:_this.trueName,
					content:_this.why,
					effectiveTime:applyTime
				};
				console.log("提交的数据",data)
				if(id==="1"&&_this.lookProject&&_this.trueName&&_this.why){  //申请查看的项目
					   uni.showLoading({
							   title:"提交中",
							   success:()=>{
							   uni.request({
									url:roleApplyAdd,
									method:"POST",
									data:{
										projectId:_this.lookProject.id,
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
									title:"提交失败",
									duration:500,
									icon:'none'
								   })	
					             })
							}
				         })	   
				}else if(id==="2"&&_this.projectName&&_this.why){      //申请项目,这里社
					// uni.request({
					// 	url:tt                 ,//申请项目的url
					//     data:{
					// 		userId:_this.data.id,
					// 		projectName:_this.projectName,
					// 		why:_this.why
					// 	},
		   //              dataType:'json',
					// })
					// .then(data=>{
					// 	uni.setStorage({
					// 		key:'casualApplyProject',
					// 		success:()=>{
					// 			uni.showToast({
					// 				title:"提交成功",
					// 				duration:500,
					// 				icon:'none'
					// 			})
					// 		}
					// 	})
					// 	console.log(data)
					// })
				}else{
					uni.showToast({
						duration:500,
						icon:"none",
					    title:"请完善信息"
					})
				}
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
	background-color: #2D8CF0;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top:100upx;
}
::-webkit-scrollbar{
	width: 4upx;
	height: 6upx;
}
.ibutton{
	width: 300upx;
	height: 200upx;
}
.ipage{
	width: 100%;
	height: 800upx;
}
.detail{
	width: 100%;
	height: 700upx;
	background-color: #FF9900;
}
.detail_project{
	width: 100%;
	height: 50upx;
	display: flex;
	flex-direction: row;
	margin-top: 10upx;
	justify-content: space-around;
	align-items: center;
	background-color: #19BE6B;
}
.applyList{
	width: 100%;
	height: 650upx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}
.applyList view{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-top: 10upx;
	width: 100%;
	font-size:25upx;
}
.appListView1{
	height: 100upx;
	align-items: center;
}
.appListView1 input{
	height: 60upx;
	width: 450upx;
    border: 1px solid #19BE6B;
	border-radius: 2%;
}
.appListView1 text{
	height: 100upx;
	margin-left: 30upx;
	width: 100upx;
	line-height: 100upx;
	font-size:30upx!important ;
}
.appListView2{
	height: 250upx;
	background-color: #19BE6B;
}
.appListView2 text{
  margin-left: 30upx;
  line-height: 250upx;
  width: 100upx;
  height: 250upx;
  font-size:30upx!important ;
}
.appListView2 textarea{
	height: 250upx;
	border: 1px solid #2D8CF0;
	margin-right: 10upx;
	border-radius: 2%;
}

/*提交申请表的按钮*/
.submitApply{
	width: 200upx;
	height: 100upx;
	border-radius: 2%;
}


.ableProjects{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;
}
.titleInfo{
	height: 50upx;
	background-color: #007AFF;
	margin-top: 10upx;
	width: 100%;
}

.myHadProject{
	height: 50upx;
	width: 90%;
	font-size: 30upx;
}
.myHadProject button{
	height: 50upx;
	line-height: 50upx;
	text-align: left;
	font-size:25upx ;
}
</style>
