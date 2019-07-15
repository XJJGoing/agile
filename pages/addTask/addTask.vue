<template>
	<view>
		
	</view>
</template>

<script>
	const login = require('../../static/utils/utils').Login;
	const query = require('../../static/utils/utils').Query;
	const Login = new login();
	const Query = new query();
	var _this;
		export default {
			data() {
				return {
					userInfo:"",
                    projectId:"",           //项目的id
				    taskChargeUserId:"",    //该项目的负责人的id,默认为改项目的权限1的用户的id
					taskChargeUserName:"",  //该项目的负责人的名字
					taskExcuteUserId:"",    //执行人的id默认为该用户的id
					taskPriority:"",        //项目的优先级（1、2、3、4）;
				    taskPredictTime:"",     //任务的预估时间
					departmentId:"",       //专业的id，默认为该用户的用户表中的departmentId
					
					
					
				    priority:[1,2,3,4]      //优先级列表
				}
			},
			onShow(){
				uni.getStorage({
					key:"userInfo",
					success:(res)=>{
						let id = {
							id:res.data.id
						}
						Query.findUser(id)
						.then(data=>{
							_this.userInfo = data.data.records[0];
						})
					}
				})
			},
			methods: {
				
			}
		}
</script>

<style>

</style>
