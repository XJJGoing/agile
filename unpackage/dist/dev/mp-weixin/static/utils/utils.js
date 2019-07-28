//引入api
import {queryUser,
        userProjectRoleQuery,
		userProjectDepartmentQuery,
		departmentQuery,
		projectQuery,
		getUserOpenId,
		messageSet
	   } from './api';

//登录模块
class Login {
	constructor(arg) {
		
	}
	//得到code
    getCode(){
		return new Promise((resolve,reject)=>{
			uni.login({
				success:(res)=>{
					resolve(res.code)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
	//得到UserInfo
	getUserInfo(){
		return new Promise((resolve,reject)=>{
			uni.getUserInfo({
				success:(res)=>{
				 resolve(res)	
				},
				fail:(error)=>{
				  reject(error)
				}
			})
		})
	}
	
	//得到OpenId `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
	getOpenId(code){
		return new Promise((resolve,reject)=> {
	       let appId = "wxd763acfcb06de61a";
		   let appSecret = "e8e7ea381fff59c2081d115cb312b22e";
		   uni.request({
		   	 url:getUserOpenId,
			 method:"POST", 
			 data:{
				 appId:appId, 
				 appSecret:appSecret,
				 code:code
			 },
			 header:{
				 "Content-Type": "application/x-www-form-urlencoded"
			 },
			 success:(res)=>{  
				 resolve(res)
			 },
			 fail:(error)=>{
				 reject(error)
			 }
		   })
		})
	}
	
	//发送整理好的用户的信息到服务器
	insertUser(userInfo,api,method){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:api,
				method:method,
				data:userInfo, 
				dataType:'json',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
}


//查询的模块
class Query  {
	constructor(arg){
	    	
	}
	//查询数据库中的用户
	findUser(id){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:queryUser,
				method:"POST",
				data:id,
				dataType:'json',
				success:(res)=>{
				  resolve(res.data)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
	//查询用户的项目权限关系
	findUserProjectRole(userId,projectId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectRoleQuery,
				data:{
					userId:userId,
					projectId:projectId
				},
				dataType:'json',
	            method:'POST',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
	//根据用户的id对t_user_project_role表进行查询
	findUserProjectRoleByUserId(userId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectRoleQuery, 
				data:{
					userId:userId
				},
				method:"POST",
				dataType:'json',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
	//通过项目的projectId去查询t_user_project_role
	findUserProjectRoleByProjectId(projectId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectRoleQuery,
				data:{
					projectId:projectId
				},
				method:"POST",
				dataType:'json',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(Error)=>{
					reject(Error)
				}
			})
		})
	}
	
	//不用根据任何条件，直接查询所有的t_user_project_role中的所有的数据
	findAllUserProjectRole(){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectRoleQuery,
				data:{
					userId:"",
					roleId:"",
					projectId:""
				},
				dataType:'json',
				success:(data)=>{
				   resolve(res.data)
				},
				fail:(error)=>{
					reject(error)
				}
			})
		})
	}
	
	//根据项目的roleId和projectId去查询
	findUserProjectRoleByRoleAndProject(roleId,projectId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectRoleQuery,
				data:{
					roleId:roleId,
					projectId:projectId
				},
				method:"POST",
				dataType:'json',
	            success:(res)=>{
					resolve(res.data)
				},
				fail:(Error=>{
					reject(Error)
				})
			})
		})
	}
	
	//根据projectId和useId查询用户所在的departmentId
	findUserProjectDepartmentByUserIdAndProjectId(userId,projectId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:userProjectDepartmentQuery,
				data:{
					userId:userId,
					projectId:projectId
				},
				dataType:'json',
				method:"POST",
				success:(res)=>{
					resolve(res.data)
				},
				fail:(Error)=>{
					reject(Error)
				}
			})
		})
	}
	
	//根据专业的id去查询专业的名称
	findUserDepartmentNameByDepartment(departmentId){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:departmentQuery,
				data:{
					departmentId:departmentId
				},
				dataType:'json',
				method:'POST',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(Error)=>{
					reject(Error)
				}
			})
		})
	}
	
	//查询所有的项项目信息
	findAllProjectInfo(){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:projectQuery,
				method:"POST",
				data:{
					pageSize: 1000,
				},
				dataType:'json',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(Error)=>{
					reject(Error)
				}
			})
		})
	}
	
	//查询超级用户的信息进而拿openId
	findRootUserInfo(){
		return new Promise((resolve,reject)=>{
			uni.request({
				url:queryUser,
				method:"POST",
				data:{
					isRoot:1,
				},
				dataType:'json',
				success:(res)=>{
					resolve(res.data)
				},
				fail:(Error)=>{
					reject(Error)
				}
			})
		})
	}
}


//向redis中根据openId去插入formId 没有就新建
const addFormId = (openId,formId)=>{
	let reg = /\s/g;
	console.log("formId和openId",openId,formId);
	console.log(reg.test(formId))
	if(formId&&!reg.test(formId)){
		uni.request({
		      url:`${messageSet}?&openId=${openId}&formId=${formId}`,
			  method:"POST",
			  header:{
				  "Content-Type":"application/xxx-www-form-urlencoded"
			  },
			  success:(res)=>{
				 console.log(res)
				 console.log("增加formId成功",)
			  },
			  fail:()=>{
				  uni.showToast({
				  	title:"网络错误",
					duration:500,
					icon:"none"
				  })
			  }
		})
	}else{
		console.log("增加formId失败")
	}
}

module.exports = {
	  Login:Login,
	  Query:Query,
	  addFormId:addFormId
}