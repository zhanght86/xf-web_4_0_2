webpackHotUpdate(10,{

/***/ 73:
/***/ (function(module, exports) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/31.
	 * @Module :  应用管理服务
	 */

	//------------------ES6-----------------------
	var ApplicationServer = function ApplicationServer($resource) {
	        _classCallCheck(this, ApplicationServer);

	        this.$resource = $resource;
	};

	LoginService.$inject = ['$http'];

	ngModule.service('loginService', LoginService);

	module.exports = function (applicationManagementModule) {
	        applicationManagementModule.service("ApplicationServer", ["$resource", function ($resource) {
	                /******************************
	                                  *应用配置*
	                            ********************************/
	                //   渠道管理
	                //请求渠道列表
	                undefined.queryChannelList = $resource(API_APPLICATION + "/channel/listChannelByPage", {}, {});
	                //获取黑名单列表
	                undefined.queryBlacklist = $resource(API_APPLICATION + "/channel/listBlackListByPage", {}, {});
	                //添加黑名单
	                undefined.addBlacklist = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	                //校验黑名单
	                undefined.checkBlackList = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	                //移除黑名单 》》单个批量合并为一个
	                undefined.removeBlacklist = $resource(API_APPLICATION + "/channel/batchDelBlackList", {}, {});
	                //改变渠道状态
	                undefined.changeChannelStatus = $resource(API_APPLICATION + "/channel/changeStatus", {}, {});
	                //   场景管理
	                //获取知识类型
	                undefined.queryKnowTypeList = $resource(API_APPLICATION + "/scene/listKnowledgeTypeByApplicationId", {}, {});
	                //获取交互方式
	                undefined.queryInterviewModeList = $resource(API_APPLICATION + "/scene/listExchangeModeByApplicationId", {}, {});
	                //多轮会话搜索
	                undefined.searchMultipleConversation = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	                //多轮会话设置
	                undefined.storeMultipleConversation = $resource(API_APPLICATION + "/scene/saveMultiInteractiveSetting", {}, {});

	                //   热点知识设置
	                //获取热点知识列表 + 查询       删除 /hotQuestion/getHotQuestionList
	                undefined.queryHotKnowledgeList = $resource(API_APPLICATION + "/hotQuestion/getHotQuestionList", {}, {});
	                //获取知识列表 + 查询                                                                                                      //**********OTHER >>>> API_MS
	                undefined.queryKnowledgeList = $resource(API_MS + "/knowledgeManage/overView/findKnowledgeByApplicationId", {}, {});
	                //添加热点知识
	                undefined.addHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/batchAdd", {}, {});
	                //删除热点知识
	                undefined.removeHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/deleteHotQuestionByIds", {}, {});
	                //上移知识
	                undefined.hotKnowledgeUp = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	                //下移知识
	                undefined.hotKnowledgeDown = $resource(API_APPLICATION + "//hotQuestion/moveDown", {}, {});
	                //置顶知识
	                undefined.hotKnowledgeStick = $resource(API_APPLICATION + "/hotQuestion/moveUp", {}, {});

	                //   参数设置
	                //查看应用参数
	                undefined.queryParameter = $resource(API_APPLICATION + "/application/findApplicationSetting", {}, {});
	                //更新应用参数
	                undefined.updateParameter = $resource(API_APPLICATION + "/application/saveApplicationSetting", {}, {});

	                //   机器人设置
	                //查看机器人参数
	                undefined.queryRobotParameter = $resource(API_APPLICATION + "/application/findRobotSetting", {}, {});
	                //更新机器人参数
	                undefined.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});
	                //保存经典机器人头像
	                undefined.storeClassicalAvatar = $resource(API_APPLICATION + "/application/saveClassicHead", {}, {});
	                //保存自定义机器人头像
	                undefined.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});

	                //  转人工设置
	                //获取列表
	                undefined.manualGetData = $resource(API_APPLICATION + "/artificial/get/setting/" + APPLICATION_ID, {}, {});
	                //修改
	                undefined.manualSaveData = $resource(API_APPLICATION + "/artificial/update", {}, {});

	                /******************************
	                                *应用发布*
	                           ********************************/
	                //发布管理
	                //查看服务列表
	                undefined.queryServiceList = $resource(API_APPLICATION + "/service/listServiceByPage", {}, {});
	                //获取服务类型
	                undefined.queryServiceTypeList = $resource(API_APPLICATION + "/service/listServiceType", {}, {});
	                //获取可用节点
	                undefined.queryAvailableNodeList = $resource(API_APPLICATION + "/node/listNoUsingNode", {}, {});
	                //检查服务名称是否重复
	                undefined.verifyServiceName = $resource(API_APPLICATION + "/service/checkName", {}, {});
	                //通过id查看服务
	                undefined.queryServiceById = $resource(API_APPLICATION + "/service/findServiceById", {}, {});
	                //获取己用节点(通过父节点信息)
	                undefined.queryParentNodeInfo = $resource(API_APPLICATION + "/node/findParentNodeInfo", {}, {});
	                //新增服务
	                undefined.addService = $resource(API_APPLICATION + "/service/addAndPublishService", {}, {});
	                //发布服务
	                undefined.releaseService = $resource(API_APPLICATION + "/service/publishService", {}, {});
	                //更新服务
	                undefined.updateService = $resource(API_APPLICATION + "/service/editService", {}, {});
	                //删除服务
	                undefined.removeService = $resource(API_APPLICATION + "/service/deleteService", {}, {});
	                //上线服务
	                undefined.startService = $resource(API_APPLICATION + "/service/startService", {}, {});
	                //下线服务
	                undefined.downService = $resource(API_APPLICATION + "/service/stopService", {}, {});
	                //重启服务
	                undefined.restartService = $resource(API_APPLICATION + "/service/restartService", {}, {});
	                //节点管理
	                //查看节点列表
	                undefined.queryNodeList = $resource(API_APPLICATION + "/node/listNodeByPage", {}, {});
	                //查询节点的基本信息
	                undefined.queryNodeInfo = $resource(API_APPLICATION + "/node/findNodeInfo", {}, {});
	                //新增节点
	                undefined.addNode = $resource(API_APPLICATION + "/node/addNode", {}, {});
	                //编辑节点
	                undefined.updateNode = $resource(API_APPLICATION + "/node/editNode", {}, {});
	                //下线节点
	                undefined.startNode = $resource(API_APPLICATION + "/node/stopService", {}, {});
	                //禁用节点
	                undefined.disableNode = $resource(API_APPLICATION + "/node/disabledAndEnabledNode", {}, {});
	                //删除节点
	                undefined.removetNode = $resource(API_APPLICATION + "/node/deleteNode", {}, {});
	                //检验节点是否合理
	                undefined.verifyNode = $resource(API_APPLICATION + "/node/checkNode", {}, {});
	                /******************************
	                                *应用信息*
	                          ********************************/
	                //应用信息
	                //校验应用名称
	                undefined.verifyApplicationName = $resource(API_APPLICATION + "/application/checkName", {}, {});
	                ////发布服务
	                //this.releaseService = $resource(API_APPLICATION+"/service/publishService", {}, {});
	                //查看服务列表
	                //this.queryServiceList = $resource(API_APPLICATION+"/service/listServiceByPage", {}, {});
	                //上线服务
	                //this.startService = $resource(API_APPLICATION+"/service/startService", {}, {});
	                ////下线服务
	                //this.downService = $resource(API_APPLICATION+"/service/stopService", {}, {});
	                ////重启服务
	                //this.restartService = $resource(API_APPLICATION+"/service/restartService", {}, {});
	                //下线所有服务
	                undefined.stopAllService = $resource(API_APPLICATION + "/service/stopAllService", {}, {});
	                //查看应用信息
	                undefined.viewApplicationInfo = $resource(API_APPLICATION + "/application/findApplication", {}, {});
	                //查看场景业务框架数量
	                undefined.viewFrameNumber = $resource(API_APPLICATION + "/application/get/frame", {}, {});
	                //修改应用名称
	                undefined.updateApplicationName = $resource(API_APPLICATION + "/application/updateApplication", {}, {});
	                //删除当前应用（当前所有服务）
	                undefined.removeApplication = $resource(API_APPLICATION + "/service/deleteAllServices", {}, {});

	                /******************************
	                                 *应用部分 登录后续部分*
	                          ********************************/
	                //添加应用
	                undefined.addApplication = $resource(API_APPLICATION + "/application/add", {}, {});
	                //编辑应用
	                undefined.updateApplication = $resource(API_APPLICATION + "/application/update", {}, {});
	                //应用名称与授权证书校验
	                undefined.checkApplicationName = $resource(API_APPLICATION + "/application/name/check", {}, {});
	                //查询单个应用
	                undefined.getApplication = $resource(API_APPLICATION + "/application/get/{id}", {}, {});
	                //查询所有应用
	                undefined.queryAllApplication = $resource(API_APPLICATION + "/application/get", {}, {});
	                //查询用户关联应用列表
	                undefined.queryApplicationByUserId = $resource(API_APPLICATION + "/application/get/user", {}, {});
	                // //根据应用id(从cookie获取)列表获取应用名称列表
	                // this.qeuryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	        }]);
	};

/***/ })

})