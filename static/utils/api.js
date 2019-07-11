//注册的api
const register = "http://120.79.49.245:7377/user/registerByWeChat";

//查找该用户
const queryUser = "http://120.79.49.245:7377/user/query";

//查找用户权限项目关系
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


module.exports = {
	register:register,
	queryUser:queryUser,
	projectQuery:projectQuery,
	commentAdd:commentAdd,
	commnetQuery:commnetQuery,
	userPojectRoleQuery:userPojectRoleQuery,
	roleApplyAdd:roleApplyAdd,
	sprintAdd:sprintAdd
}