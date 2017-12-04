/**
 * @Author : MILES .
 * @Create : 2017/8/31.
 * @Module :  应用管理服务
 */
// //"use strict";
// module.exports = applicationModule =>{
//         applicationModule.service("ApplicationServer",["$resource",$resource=>{
//
//         }])
// };
angular.module("myApplicationSettingModule").service("ApplicationServer",["$resource",function($resource){

                /******************************
                                  *应用配置*
                            ********************************/
//   渠道管理
        //请求渠道列表
        this.queryChannelList = $resource(API_APPLICATION+"/channel/listChannelByPage", {}, {});
        //获取黑名单列表
        this.queryBlacklist = $resource(API_APPLICATION+"/channel/listBlackListByPage", {}, {});
        //添加黑名单
        this.addBlacklist = $resource(API_APPLICATION+"/channel/addBlackList", {}, {});
        //校验黑名单
        this.checkBlackList = $resource(API_APPLICATION+"/channel/addBlackList", {}, {});
        //移除黑名单 》》单个批量合并为一个
        this.removeBlacklist = $resource(API_APPLICATION+"/channel/batchDelBlackList", {}, {});
        //改变渠道状态
        this.changeChannelStatus = $resource(API_APPLICATION+"/channel/changeStatus", {}, {});
//   场景管理
        //获取知识类型
        this.queryKnowTypeList = $resource(API_APPLICATION+"/scene/listKnowledgeTypeByApplicationId", {}, {});
        //获取交互方式
        this.queryInterviewModeList = $resource(API_APPLICATION+"/scene/listExchangeModeByApplicationId", {}, {});
        //多轮会话搜索
        this.searchMultipleConversation = $resource(API_APPLICATION+"/scene/findMultiInteractiveSetting", {}, {});
        //多轮会话设置
        this.storeMultipleConversation = $resource(API_APPLICATION+"/scene/saveMultiInteractiveSetting", {}, {});

//   热点知识设置
        //获取热点知识列表 + 查询       删除 /hotQuestion/getHotQuestionList
        this.queryHotKnowledgeList = $resource(API_APPLICATION+"/hotQuestion/getHotQuestionList", {}, {});
        //获取知识列表 + 查询                                                                                                      //**********OTHER >>>> API_MS
        this.queryKnowledgeList = $resource(API_MS+"/knowledgeManage/overView/findKnowledgeByApplicationId", {}, {});
        //添加热点知识
        this.addHotKnowledge = $resource(API_APPLICATION+"/hotQuestion/batchAdd", {}, {});
        //删除热点知识
        this.removeHotKnowledge = $resource(API_APPLICATION+"/hotQuestion/deleteHotQuestionByIds", {}, {});
        //上移知识
        this.hotKnowledgeUp = $resource(API_APPLICATION+"/scene/findMultiInteractiveSetting", {}, {});
        //下移知识
        this.hotKnowledgeDown = $resource(API_APPLICATION+"//hotQuestion/moveDown", {}, {});
        //置顶知识
        this.hotKnowledgeStick = $resource(API_APPLICATION+"/hotQuestion/moveUp", {}, {});

//   参数设置
        //查看应用参数
        this.queryParameter = $resource(API_APPLICATION+"/application/findApplicationSetting", {}, {});
        //更新应用参数
        this.updateParameter = $resource(API_APPLICATION+"/application/saveApplicationSetting", {}, {});

//   机器人设置
        //查看机器人参数
        this.queryRobotParameter = $resource(API_APPLICATION+"/application/findRobotSetting", {}, {});
        //更新机器人参数
        this.updateRobotParameter = $resource(API_APPLICATION+"/application/saveRobotSetting", {}, {});
        //保存经典机器人头像
        this.storeClassicalAvatar = $resource(API_APPLICATION+"/application/saveClassicHead", {}, {});
        //保存自定义机器人头像
        this.updateRobotParameter = $resource(API_APPLICATION+"/application/saveRobotSetting", {}, {});

//  转人工设置
        //获取列表
        this.manualGetData = $resource(API_APPLICATION+"/artificial/get/setting/"+APPLICATION_ID, {}, {});
        //修改
        this.manualSaveData = $resource(API_APPLICATION+"/artificial/update", {}, {});


       
                        /******************************
                                        *应用发布*
                                   ********************************/
//发布管理
        //查看服务列表
        this.queryServiceList = $resource(API_APPLICATION+"/service/listServiceByPage", {}, {});
        //获取服务类型
        this.queryServiceTypeList = $resource(API_APPLICATION+"/service/listServiceType", {}, {});
        //获取可用节点
        this.queryAvailableNodeList = $resource(API_APPLICATION+"/node/listNoUsingNode", {}, {});
        //检查服务名称是否重复
        this.verifyServiceName = $resource(API_APPLICATION+"/service/checkName", {}, {});
        //通过id查看服务
        this.queryServiceById = $resource(API_APPLICATION+"/service/findServiceById", {}, {});
        //获取己用节点(通过父节点信息)
        this.queryParentNodeInfo = $resource(API_APPLICATION+"/node/findParentNodeInfo", {}, {});
        //新增服务
        this.addService = $resource(API_APPLICATION+"/service/addAndPublishService", {}, {});
        //发布服务
        this.releaseService = $resource(API_APPLICATION+"/service/publishService", {}, {});
        //更新服务
        this.updateService = $resource(API_APPLICATION+"/service/editService", {}, {});
        //删除服务
        this.removeService = $resource(API_APPLICATION+"/service/deleteService", {}, {});
        //上线服务
        this.startService = $resource(API_APPLICATION+"/service/startService", {}, {});
        //下线服务
        this.downService = $resource(API_APPLICATION+"/service/stopService", {}, {});
        //重启服务
        this.restartService = $resource(API_APPLICATION+"/service/restartService", {}, {});
//节点管理
        //查看节点列表
        this.queryNodeList = $resource(API_APPLICATION+"/node/listNodeByPage", {}, {});
        //查询节点的基本信息
        this.queryNodeInfo = $resource(API_APPLICATION+"/node/findNodeInfo", {}, {});
        //新增节点
        this.addNode = $resource(API_APPLICATION+"/node/addNode", {}, {});
        //编辑节点
        this.updateNode = $resource(API_APPLICATION+"/node/editNode", {}, {});
        //下线节点
        this.startNode = $resource(API_APPLICATION+"/node/stopService", {}, {});
        //禁用节点
        this.disableNode = $resource(API_APPLICATION+"/node/disabledAndEnabledNode", {}, {});
        //删除节点
        this.removetNode = $resource(API_APPLICATION+"/node/deleteNode", {}, {});
        //检验节点是否合理
        this.verifyNode = $resource(API_APPLICATION+"/node/checkNode", {}, {});
                                        /******************************
                                                        *应用信息*
                                                  ********************************/
//应用信息
        //校验应用名称
        this.verifyApplicationName = $resource(API_APPLICATION+"/application/checkName", {}, {});
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
        this.stopAllService = $resource(API_APPLICATION+"/service/stopAllService", {}, {});
        //查看应用信息
        this.viewApplicationInfo = $resource(API_APPLICATION+"/application/findApplication", {}, {});
        //查看场景业务框架数量
        this.viewFrameNumber = $resource(API_APPLICATION+"/application/get/frame", {}, {});
        //修改应用名称
        this.updateApplicationName = $resource(API_APPLICATION+"/application/updateApplication", {}, {});
        //删除当前应用（当前所有服务）
        this.removeApplication = $resource(API_APPLICATION+"/service/deleteAllServices", {}, {});

        /******************************
                         *应用部分 登录后续部分*
                  ********************************/
        //添加应用
        this.addApplication = $resource(API_APPLICATION+"/application/add", {}, {});
        //编辑应用
        this.updateApplication = $resource(API_APPLICATION+"/application/update", {}, {});
        //应用名称与授权证书校验
        this.checkApplicationName = $resource(API_APPLICATION+"/application/name/check", {}, {});
        //查询单个应用
        this.getApplication = $resource(API_APPLICATION+"/application/get/{id}", {}, {});
        //查询所有应用
        this.queryAllApplication = $resource(API_APPLICATION+"/application/get", {}, {});
        //查询用户关联应用列表
        this.queryApplicationByUserId = $resource(API_APPLICATION+"/application/get/user", {}, {});
        // //根据应用id(从cookie获取)列表获取应用名称列表
        // this.qeuryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
        //根据应用id(从cookie获取)列表获取应用名称列表
        this.queryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
        //根据应用id(从cookie获取)列表获取应用名称列表
        this.queryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
        //根据应用id(从cookie获取)列表获取应用名称列表
        this.queryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});

}])
