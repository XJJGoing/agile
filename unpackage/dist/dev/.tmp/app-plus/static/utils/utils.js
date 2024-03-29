//引入api
import {queryUser,
        userProjectRoleQuery,
		userProjectDepartmentQuery,
		departmentQuery
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
	
	//得到OpenId
	getOpenId(code){
		return new Promise((resolve,reject)=> {
	       let appId = "wxd763acfcb06de61a";
		   let appSecret = "e8e7ea381fff59c2081d115cb312b22e";
		   uni.request({
		   	 url:`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`,
			 method:"GET",
			 data:{},
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
}


module.exports = {
	  Login:Login,
	  Query:Query
}