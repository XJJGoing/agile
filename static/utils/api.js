//主机域名:
const host = "https://agile.guohe3.com"

//拿用户openid
const getUserOpenId = `${host}/user/getOpenId`

//注册的api
const register = `${host}/user/registerByWeChat`; 

//查找该用户 
const queryUser = `${host}/user/query`;

//查找用户权限项目关系，可以根据userId、roleId、projectId单独和两两和三去查
const userProjectRoleQuery = `${host}/userProjectRole/query`;

//查找项目，库查找所有的项目，也可以单个查询
const projectQuery = `${host}/project/query`; 

//添加申请
const roleApplyAdd = `${host}/roleApply/add`; 

//添加评论
const commentAdd = `${host}/comment/add`;

//增加冲刺的信息
const sprintAdd = `${host}/sprint/add`;

//进行项目的更新（可以单个，也可以多个）
const projectUpdate = `${host}/project/updateBatch`;

//获取所有权限
const getAllRole = `${host}/other/getAllRole`;

//在t_user_project_role中增加信息
const userProjectRoleAdd = `${host}/userProjectRole/add`;

//在t_user_project_role中更新权限信息
const userProjectRoleUpdateBatch = `${host}/userProjectRole/updateBatch`;

//获取所有专业
const getAllDepartment = `${host}/other/getAllDepartment`;

//获取申请记录
const roleApplyQuery = `${host}/roleApply/query`;

//增加用户项目专业记录
const userProjectDepartmentAdd = `${host}/userprojectdepartment/add`;

//查找用户项目专业记录
const userProjectDepartmentQuery = `${host}/userprojectdepartment/query`;

//修改t_user_project_department中的数据
const updateUserProjectDepartment = `${host}/userprojectdepartment/updateBatch`;

//审核的时候更新申请记录
const updateRoleApply = `${host}/roleApply/updateBatch`;

//新增专业的api
const departmentAdd = `${host}/department/add`;

//新增任务的api
const taskAdd = `${host}/task/add`;

//查找专业
const departmentQuery = `${host}/department/query`;

//查找任务
const taskQuery = `${host}/task/query`;

//查找冲刺
const sprintQuery = `${host}/sprint/query`;

//任务的更新
const taskUpdateBatch = `${host}/task/updateBatch`;

//增加消息
const messageAdd = `${host}/message/add`;

//删除任务 /task/deleteBatch
const deleteTask = `${host}/task/deleteBatch`;

//项目的申请
const projectApplyAdd = `${host}/projectapply/add`;

//项目申请表的查找
const projectApplyQuery = `${host}/projectapply/query`;

//项目申请表删除（不通过即删除）
const projectApplyDeleteBatch = `${host}/projectapply/deleteBatch`;

//增加项目(项目审核通过的时候)
const projectAdd = `${host}/project/add`;

//更改项目申请表(项目通过的时候更改审核状态) 
const projectApplyUpdateBatch = `${host}/projectapply/updateBatch`;

//消息模块的查找
const messageQuery = `${host}/message/query`;

//获取评论
const commnetQuery = `${host}/comment/query`;







//提交每日输入工时打卡阶段
const dateWorkAdd = `${host}/datework/add`;


//查找dateWork
const dateWorkQuery = `${host}/datework/query`;

//更新dateWork
const dateWorkUpdateBatch = `${host}/dateWork/updateBatch`

//微信消息推送
const messageSend = `${host}/message/send`;

//设置增加formId和openId缓存的api
const messageSet = `${host}/message/set`;

//删除申请表
const  roleApplyDeleteBatch = `${host}/roleApply/deleteBatch`;

//删除这个用户项目专业表数据
const  userProjectDepartmentDeleteBatch = `${host}/userprojectdepartment/deleteBatch`;

//燃尽图的图表
const  getLineData = `${host}/picture/getLineData`;

module.exports = {
	getUserOpenId:getUserOpenId,
	register:register,
	queryUser:queryUser,
	projectQuery:projectQuery,
	commentAdd:commentAdd,
	userProjectRoleQuery:userProjectRoleQuery,
	roleApplyAdd:roleApplyAdd,
	sprintAdd:sprintAdd,
	projectUpdate:projectUpdate,
	getAllRole:getAllRole,
	userProjectRoleAdd:userProjectRoleAdd,
	getAllDepartment:getAllDepartment,
	roleApplyQuery:roleApplyQuery,
	userProjectDepartmentAdd:userProjectDepartmentAdd,
	userProjectDepartmentQuery:userProjectDepartmentQuery,
	userProjectRoleUpdateBatch:userProjectRoleUpdateBatch,
	updateUserProjectDepartment:updateUserProjectDepartment,
	updateRoleApply:updateRoleApply,
	departmentAdd:departmentAdd,
	taskAdd:taskAdd,
	departmentQuery:departmentQuery,
	sprintQuery:sprintQuery,
	taskQuery:taskQuery,
	taskUpdateBatch:taskUpdateBatch,
	messageAdd:messageAdd,
	deleteTask:deleteTask,
	projectApplyAdd:projectApplyAdd,
	projectApplyQuery:projectApplyQuery,
	projectAdd:projectAdd,
	projectApplyDeleteBatch:projectApplyDeleteBatch,
	projectApplyUpdateBatch:projectApplyUpdateBatch,
	messageQuery:messageQuery,
	commnetQuery:commnetQuery,
	dateWorkAdd:dateWorkAdd,
	dateWorkQuery:dateWorkQuery,
	messageSend:messageSend,
	messageSet:messageSet,
	roleApplyDeleteBatch:roleApplyDeleteBatch,
	userProjectDepartmentDeleteBatch:userProjectDepartmentDeleteBatch,
	dateWorkUpdateBatch:dateWorkUpdateBatch,
	getLineData:getLineData
} 