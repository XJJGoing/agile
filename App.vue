<script>
    const query = require('./static/utils/utils').Query;
	const Query = new query();
	
	import {sprintQuery} from './static/utils/api.js';
	import {formatDate} from './static/utils/time.js';
	import {compareTime} from'./static/utils/utils';
	
	//一进入项目就设置进入本项目的相应的时间段内的冲刺(先查询然后进行时间的比对)
	const enterSprint = (projectId) =>{
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
					console.log(allSprint)
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
			  				data:"",
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
	   } 
	
	var _this;
	export default {
		data () {
			return {
				userInfo:{},       //用户的信息
				projectId:""        //项目的id
			}
		},
		onShow: function() {
			_this = this;
			console.log("启动微信小程序")
			
			//当微信小程序一启动的时候就去判断用户有没有登录,如果为超级用户就直接跳转people页面进行项目的审核
			 //当微信小程序一启动的时候，就去storage中判断有没有nowInproject,
			//而且判断里面roleid为3的时候，再去数据库中查找进而确定还能不能够访问。
			//如果有项目和冲刺就进入时间段内sprintId
			
			uni.getStorage({
				key:'userInfo', 
				success:(res1)=>{
					let id = {
						id:res1.data.id
					}
				    Query.findUser(id)
 					.then(data=>{
						console.log("启动信息",data.data.records[0])
                        if(data.data.records[0].isRoot){
							uni.switchTab({
								url:'/pages/people/people'
							})
						}else{
							_this.userInfo = data.data.records[0]
						     uni.getStorage({
						    	key:'nowInProject',
								success:(res2)=>{
										if(res2.data.roleId===3)
										{     //不用判断等于四,这种设计不存在等于4权限的情况
										 Query.findUserProjectRole(_this.userInfo.id,res2.data.projectId)
										 .then(data=>{
											console.log("获取到的用户的最新的权限",data.data.records)
											if(!data.data.records.length){
												 uni.removeStorage({
													 key:"nowInPorject",
													 success:()=>{ 
														 console.log("权限改变移除nowInProject")
														 uni.redirectTo({
															url: '/pages/apply/apply',
														 }); 
													 }
												 })
											}else{ 
												  uni.setStorage({
												  key:'nowInProject',
												  data:data.data.records[0],
												  success:()=>{
													 //设置projectId并且进入冲刺
						                            _this.projectId = data.data.records[0].projectId;
													enterSprint(_this.projectId);  
													uni.redirectTo({
														url:'/pages/index/index'
													})
												 }
											  })
											}
										})		
									}
									else{
									 //设置projectId并且进入冲刺
									_this.projectId = res2.data.projectId;
									enterSprint(_this.projectId); 
									uni.redirectTo({
										url:'/pages/index/index'
									  })
									}
					        }, 
							fail:()=>{  //没有直接跳
								uni.redirectTo({
									url:'/pages/apply/apply'
								})
							},
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
					},
				   	fail:()=>{
				   			uni.redirectTo({
				   				url:'/pages/login/login'
				   			})
				   		}
				   	})
		 },
			
	    onLaunch:function(){
			
		},
		
		//退出该小程序的时候再次进行权限的判断，将信息保存到nowInProject 中,应付1权限用户将2权限用户改成3、4权限
		onHide: function() {
			//下面这个为正确的代码
			_this = this;
			uni.getStorage({
				key:"nowInProject",
				success:(res)=>{
				  Query.findUserProjectRole(_this.userInfo.id,res.data.projectId)
				  .then(data=>{
					  if(data.data.records[0].roleId===4){  //为4直接清空
						  uni.removeStorage({
						  	key:nowInProject,
						    success:()=>{
								console.log("权限改变成4清空nowInProject")
							}
						  })
					  }else{  //不为4再次进行保存
						 uni.setStorage({
						 	key:'nowInProject',
							data:data.data.records[0],
							success:()=>{
								console.log("更新nowInProject成功,小程序退到后台")
							}
						 })
					  }
				  })
				  .catch(error=>{
					  console.log("退出时网络错误")
				  })
				}
			})
		},
		
		methods:{
		   
		}
			
	}
</script>

<style>
page{
	background-color:  rgb(33, 36, 46);
}
::-webkit-scrollbar {
  width: 6upx;
  height: 4upx;
  border-radius: 10upx;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 10upx rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6upx rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 10upx rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6upx rgba(0, 0, 0, 0.1);
  background-color:#C8C7CC;
}

</style>
 