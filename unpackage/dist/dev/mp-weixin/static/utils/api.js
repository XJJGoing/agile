//注册的api
const register = "http://120.79.49.245:7377/user/registerByWeChat";

//查找该用户
const queryUser = "http://120.79.49.245:7377/user/query";

//查找用户权限项目关系，可以根据userId、roleId、projectId单独和两两和三去查
const userProjectRoleQuery = "http://120.79.49.245:7377/userProjectRole/query";

//查找项目，库查找所有的项目，也可以单个查询
const projectQuery = "http://120.79.49.245:7377/project/query";

//添加申请
const roleApplyAdd = "http://120.79.49.245:7377/roleApply/add";

//添加评论
const commentAdd = "http://120.79.49.245:7377/comment/add";

//查找评论
const commnetQuery = "http://120.79.49.245:7377/comment/add";

//增加冲刺的信息
const sprintAdd = "http://120.79.49.245:7377/sprint/add";

//进行项目的更新（可以单个，也可以多个）
const projectUpdate = "http://120.79.49.245:7377/project/updateBatch";

//获取所有权限
const getAllRole = "http://120.79.49.245:7377/other/getAllRole";

//在t_user_project_role中增加信息
const userProjectRoleAdd = "http://120.79.49.245:7377/userProjectRole/add";

//在t_user_project_role中更新权限信息
const userProjectRoleUpdateBatch = "http://120.79.49.245:7377/userProjectRole/updateBatch"

//获取所有专业
const getAllDepartment = "http://120.79.49.245:7377/other/getAllDepartment";

//获取申请记录
const roleApplyQuery = "http://120.79.49.245:7377/roleApply/query";

//增加用户项目专业记录
const userProjectDepartmentAdd = "http://120.79.49.245:7377/userprojectdepartment/add";

//查找用户项目专业记录
const userProjectDepartmentQuery = "http://120.79.49.245:7377/userprojectdepartment/query";

//修改t_user_project_department中的数据
const updateUserProjectDepartment = "http://120.79.49.245:7377/userprojectdepartment/updateBatch";

//审核的时候更新申请记录
const updateRoleApply = "http://120.79.49.245:7377/roleApply/updateBatch";

//新增专业的api
const departmentAdd = "http://120.79.49.245:7377/department/add";

//新增任务的api
const taskAdd = "http://120.79.49.245:7377/task/add";

//查找专业
const departmentQuery = "http://120.79.49.245:7377/department/query";

//查找所有专业
const departmentQueryAll = "http://120.79.49.245:7377/department/queryAll";

//查找任务
const taskQuery = "http://120.79.49.245:7377/task/query";

//查找冲刺
const sprintQuery = "http://120.79.49.245:7377/sprint/query";

//任务的更新
const taskUpdateBatch = "http://120.79.49.245:7377/task/updateBatch";

//增加消息
const messageAdd = "http://120.79.49.245:7377/message/add";

//删除任务 /task/deleteBatch
const deleteTask ="http://120.79.49.245:7377/task/deleteBatch";

//获取折线图数据
const getLineData ="http://120.79.49.245:7377/picture/getLineData";


module.exports = {
	departmentQueryAll:departmentQueryAll,
	register:register,
	queryUser:queryUser,
	projectQuery:projectQuery,
	commentAdd:commentAdd,
	commnetQuery:commnetQuery,
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
	deleteTask:deleteTask
}