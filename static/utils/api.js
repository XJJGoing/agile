//注册的api
const register = "http://120.79.49.245:7377/user/registerByWeChat";

//查找该用户
const queryUser = "http://120.79.49.245:7377/user/query";

//查找用户权限项目关系，可以根据userId、roleId、projectId单独和两两和三去查
const userPojectRoleQuery = "http://120.79.49.245:7377/userProjectRole/query";

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

//改变某用户的权限
const updateUserProjectRole = "http://120.79.49.245:7377/userProjectRole/updateBatch";

//获取所有专业
const getAllDepartment = "http://120.79.49.245:7377/other/getAllDepartment";

//获取申请记录
const roleApplyQuery = "http://120.79.49.245:7377/roleApply/query";

module.exports = {
	register:register,
	queryUser:queryUser,
	projectQuery:projectQuery,
	commentAdd:commentAdd,
	commnetQuery:commnetQuery,
	userPojectRoleQuery:userPojectRoleQuery,
	roleApplyAdd:roleApplyAdd,
	sprintAdd:sprintAdd,
	projectUpdate:projectUpdate,
	getAllRole:getAllRole,
	updateUserProjectRole:updateUserProjectRole,
	getAllDepartment:getAllDepartment,
	roleApplyQuery:roleApplyQuery
}