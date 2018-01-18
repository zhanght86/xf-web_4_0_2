/**
 * @Author : MILES .
 * @Create : 2017/8/31.
 * @Module :  应用管理服务
 */
class ApplicationServer {
        constructor($resource) {
                /******************************
                                  *应用配置*
                            ********************************/

//   热点知识设置
        //获取热点知识列表 + 查询       删除 /hotQuestion/getHotQuestionList
        this.queryHotKnowledgeList = $resource(API_APPLICATION+"/hot/question/get", {}, {});
        //获取热点知识配置 (更新频率)
        this.getHotKnowledgeConfig = $resource(API_APPLICATION+"/hot/question/config/get/:id", {}, {});
        //修改热点知识配置 (更新频率)
        this.updateHotKnowledgeConfig = $resource(API_APPLICATION+"/hot/question/config/update", {}, {});
        //获取知识列表 + 查询
        this.queryKnowledgeList = $resource(API_APPLICATION+"/hot/question/knowledge/get", {}, {});
        //添加热点知识
        this.addHotKnowledge = $resource(API_APPLICATION+"/hot/question/batch/add", {}, {});
        //删除热点知识
        this.removeHotKnowledge = $resource(API_APPLICATION+"/hot/question/batch/delete", {}, {});
        //上移知识
        this.hotKnowledgeUp = $resource(API_APPLICATION+"/hot/question/up", {}, {});
        //下移知识
        this.hotKnowledgeDown = $resource(API_APPLICATION+"/hot/question/down", {}, {});
        //置顶知识
        this.hotKnowledgeStick = $resource(API_APPLICATION+"/hot/question/top", {}, {});

//   参数设置
        //查看应用参数
        this.queryParameter = $resource(API_APPLICATION+"/config/param/get/:id", {}, {});
        //更新应用参数
        this.updateParameter = $resource(API_APPLICATION+"/config/param/update", {}, {});

//   机器人设置
        //查看机器人参数
        this.queryRobotParameter = $resource(API_APPLICATION+"/config/robot/get/:id", {}, {});
        //更新机器人参数
        this.updateRobotParameter = $resource(API_APPLICATION+"/config/robot/update", {}, {});
        //保存经典机器人头像
        this.storeClassicalAvatar = $resource(API_APPLICATION+"/config/classic/avatar/update", {}, {});
        //保存自定义机器人头像
        // this.uploadCustomizedAvatar = $resource(API_APPLICATION+"/config/upload/avatar", {}, {});
//   交互管理
        //查看多伦回话设置
        this.getInteractiveParameter = $resource(API_APPLICATION+"/config/interactive/get/:id", {}, {});
        //修改多伦回话设置
        this.updateInteractiveParameter = $resource(API_APPLICATION+"/config/interactive/update", {}, {});
//   授权
        //查看授权参数
        this.getLicenseInfo = $resource(API_APPLICATION+"/config/license/info/:applicationId", {}, {});
        //更新授权参数
        this.updateRobotParameter = $resource(API_APPLICATION+"/config/robot/update", {}, {});
        //重新授权参数
        this.updateLicense = $resource(API_APPLICATION+"/config/license/regrant", {}, {});

//  转人工设置
        //获取列表
        this.manualGetData = $resource(API_APPLICATION+"/config/customservice/get/:applicationId", {}, {});
        //修改
        this.manualSaveData = $resource(API_APPLICATION+"/config/customservice/update", {}, {});
                        /******************************
                                        *应用发布*
                                   ********************************/
//发布管理
        //查看服务列表
        this.queryServiceList = $resource(API_APPLICATION+"/service/get", {}, {});
        //获取服务类型
        this.queryServiceTypeList = $resource(API_APPLICATION+"/service/type/get", {}, {});
        //获取可用节点
        this.queryAvailableNodeList = $resource(API_APPLICATION+"/node/free/get", {}, {});
        //检查服务名称是否重复
        this.verifyServiceName = $resource(API_APPLICATION+"/service/name/check", {}, {});
        //通过id查看服务
        this.queryServiceById = $resource(API_APPLICATION+"/service/get/:id", {}, {});
        //获取己用节点(通过父节点信息)
        this.queryParentNodeInfo = $resource(API_APPLICATION+"/node/findParentNodeInfo", {}, {});
        //新增服务
        this.addService = $resource(API_APPLICATION+"/service/add/publish", {}, {});
        //发布服务
        this.releaseService = $resource(API_APPLICATION+"/service/pulish", {}, {});
        //更新服务
        this.updateService = $resource(API_APPLICATION+"/service/update", {}, {});
        //删除服务
        this.removeService = $resource(API_APPLICATION+"/service/delete", {}, {});
        //上线服务
        this.startService = $resource(API_APPLICATION+"/service/start", {}, {});
        //下线服务
        this.downService = $resource(API_APPLICATION+"//service/stop", {}, {});
        //重启服务
        this.restartService = $resource(API_APPLICATION+"/service/restart", {}, {});
        //根据服务id获取url
        this.nodeService=$resource(API_APPLICATION+"/node/url/get/:serviceId",{},{})
         //批量删除服务 
        this.removetAllService = $resource(API_APPLICATION+"/service/batch/delete", {}, {});
//节点管理
        //查看节点列表
        this.queryNodeList = $resource(API_APPLICATION+"/node/get", {}, {});
        //查看未使用节点
        this.queryUnusedNodeList = $resource(API_APPLICATION+"/node/free/get", {}, {});
        //查看父节点信息
        this.queryParentNodeInfo = $resource(API_APPLICATION+"/node/parent/get/:id", {}, {});

        //查询节点的基本信息
        // this.queryNodeInfo = $resource(API_APPLICATION+"/node/findNodeInfo", {}, {});
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

       
                                        /******************************
                                                        *应用信息*
                                                  ********************************/
//应用信息
        //校验应用名称
        this.verifyApplicationName = $resource(API_APPLICATION+"/application/name/check", {}, {});
        // //发布服务
        // this.releaseService = $resource(API_APPLICATION+"/service/publish", {}, {});
        // //查看服务列表
        // //this.queryServiceList = $resource(API_APPLICATION+"/service/get", {}, {});
        // //上线服务
        // this.startService = $resource(API_APPLICATION+"/service/start", {}, {});
        // //下线服务
        // this.downService = $resource(API_APPLICATION+"/service/stop", {}, {});
        // //重启服务
        // this.restartService = $resource(API_APPLICATION+"/service/restart", {}, {});
        //下线所有服务
        this.stopAllService = $resource(API_APPLICATION+"/service/stop/all", {}, {});
        //查看应用信息
        this.viewApplicationInfo = $resource(API_APPLICATION+"/application/get/:id", {}, {});
        //修改应用名称
        this.updateApplicationName = $resource(API_APPLICATION+"/application/update", {}, {});
        //删除当前应用（当前所有服务）
        this.removeApplicationServer = $resource(API_APPLICATION+"/service/delete/all", {}, {});

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
     }
}
ApplicationServer.$inject = ['$resource'];
module.exports = applicationManagementModule =>{
        applicationManagementModule.
        service("ApplicationServer",ApplicationServer)} ;