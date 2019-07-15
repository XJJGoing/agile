<script>
	const query = require('./static/utils/utils').Query;
	const Query = new query();
	var _this;
	export default {
		data () {
			return {
				userInfo:{},       //用户的信息
			}
		},
		onLaunch: function() {
			_this = this;
			console.log("启动微信小程序")
			//当微信小程序一启动的时候就去判断用户有没有登录
			uni.getStorage({
				key:'userInfo', 
				success:(res)=>{
					 //当微信小程序一启动的时候，就去storage中判断有没有nowInproject,
					 //而且判断里面roleid为3的时候，再去数据库中查找进而确定还能不能够访问。
					 _this.userInfo = res.data;	
					    if(res.data.roleId===3)
					    {     //不用判断等于四,这种设计不存在等于4权限的情况
								Query.findUserProjectRole(res.data.userId,res.data.projectId)
								.then(data=>{
									if(data.data.roleId===4){
										 uni.removeStorage({
											 key:"nowInPorject",
											 success:()=>{
												 console.log("权限改变移出nowInProject")
											 }
										 })
									}else{
									      uni.setStorage({
										  key:'nowInProject',
										  data:data.data.records[0],
										  success:()=>{
											uni.redirectTo({
												url:'/pages/index/index'
									        })
								         }
							          })
								    }
							    })		
				   		 }
						 else{
							uni.redirectTo({
								url:'/pages/index/index'
							})
						  }
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
		
	}
</script>

<style>
page{
	background-color:  rgb(33, 36, 46);
}
</style>
