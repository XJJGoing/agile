<script>
    const query = require('./static/utils/utils').Query;
	const Query = new query();
	
	import {sprintQuery} from './static/utils/api.js';
	import {formatDate} from './static/utils/time.js';
	
	//一进入项目就设置进入本项目的相应的时间段内的冲刺(先查询然后进行时间的比对)
	const enterSprint = (projectId) =>{
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
			  		  if(sprintId===""){ //如果实在都超过了时间段就默认进入最后一个
			  			  sprintId = allSprint.pop().id;
			  		  }
			  		  uni.setStorage({
			  		  	key:'sprintId', 
			  			data:sprintId,
			  		  }) 
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
		onLaunch: function() {
			_this = this;
			console.log("启动微信小程序")
			
			//当微信小程序一启动的时候就去判断用户有没有登录
			 //当微信小程序一启动的时候，就去storage中判断有没有nowInproject,
			//而且判断里面roleid为3的时候，再去数据库中查找进而确定还能不能够访问。
			//如果有项目和冲刺就进入时间段内sprintId
			
			uni.getStorage({
				key:'userInfo', 
				success:(res1)=>{
					 _this.userInfo = res1.data;
						 uni.getStorage({
						 	key:'nowInProject',
							success:(res2)=>{
							   	    if(res2.data.roleId===3)
							        {     //不用判断等于四,这种设计不存在等于4权限的情况
							   		Query.findUserProjectRole(_this.userInfo.id,res2.data.projectId)
							   		.then(data=>{
										console.log("获取到的用户的最新的权限",data)
							   			if(data.data.roleId===4){
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
						},
				   		fail:()=>{
				   			uni.redirectTo({
				   				url:'/pages/login/login'
				   			})
				   		}
				   	})
		 },
			
		onShow: function() {
			console.log('App Show')
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
</style>
