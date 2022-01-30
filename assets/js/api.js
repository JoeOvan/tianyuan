// let baseUrl = "http://bdadmin.winzkj.com/admin";
let baseUrl = "http://www.tyjkcy.cn/admin";
// let baseUrl = "http://localhost:8083/admin";
let URL = {
	// 登录
	loginUrl:baseUrl + "/api/login",
	// 注册信息
	registerUrl: baseUrl + "/api/register/",
	// 查询用户信息
	getUserInfoUrl: baseUrl + "/api/register/getUserInfo",
	// 内容列表
	contentListUrl: baseUrl + "/api/content/list",
	// 查询内容详情
	contentUrl:  baseUrl + "/api/content/",
	// 查询栏目分类列表
	categoryListUrl: baseUrl + "/api/category/list/",
	//提交留言
	messageUrl: baseUrl + "/api/content/msg",
	// 查询留言列表
	getMessageList: baseUrl + "/api/content/msg/list",
	// 文件上传方法
	uploadUrl: baseUrl +"/api/content/upload",
	// 提交企业认证资料
	enterpriseSave: baseUrl +"/api/enterPrise/save",
	// 查询企业认证资料
	enterpriseView: baseUrl +"/api/enterPrise/view",
	// 查询投标记录列表
	getBidRecordsList: baseUrl + "/api/content/getBidRecords",
	//查询投标附件
	getBidsDocument: baseUrl + "/api/content/getBid/",
	// 查询招标列表
	getBidInvitationList: baseUrl + "/api/content/selectBidInvitationList",
	// 查询招标内容
	getBidInvitation:baseUrl + "/api/content/getBidInvitation/",
	// 上传投标文件
	uploadBidFile: baseUrl + "/api/content/uploadBidFile",
	// 获取网站信息
	getWebInfo: baseUrl + "/api/content/getWebInfo",
	// 获取网站信息
	submitEmployForm: baseUrl + "/api/content/submitEmployForm",

}
