/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  应用管理模块 ， 加载依赖
 */
module.exports = angular => {
    const applicationManagementModule = angular.module('applicationManagementModule', []);


    require('../controllers/_main.cotroller')(applicationManagementModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(applicationManagementModule);  // 导航
    //--------------------------------------------------
    //          directive
    //--------------------------------------------------
    require('../../../components/switch_turn/_switch_turn.directive')(applicationManagementModule);      // 开关
    // require('../../../components/page/page')(applicationManagementModule);                               // 分页
    require("../directives/_avatar.directive")(applicationManagementModule) ;                            // 头像
    require('../directives/_check_service_name.direvtive')(applicationManagementModule);                 // 验证服务名称
    require('../directives/_verify_application_name.directive')(applicationManagementModule);            // 验证应用名称
    require('../directives/_verify_node.directive')(applicationManagementModule);                        // 验证节点名称
    require('../directives/caliper/_caliper.directive')(applicationManagementModule);                    // 标尺
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    // 应用信息
    require('../controllers/info/_application_info.controller')(applicationManagementModule);           // 应用信息
    require('../controllers/info/_backup_restore.controller')(applicationManagementModule);             // 备份还原
    // 应用配置
    require('../controllers/configuration/_authorization_management.controller')(applicationManagementModule); // 授权管理
    require('../controllers/configuration/_hot_knowledge_setup.controller')(applicationManagementModule);      // 热点知识设置
    require('../controllers/configuration/_manual_setting.controller')(applicationManagementModule);           // 转人工
    require('../controllers/configuration/_parameter_setup.controller')(applicationManagementModule);          // 参数设置
    require('../controllers/configuration/_robot_setup.controller')(applicationManagementModule);              // 机器人管理
    require('../controllers/configuration/_interaction_manage.controller')(applicationManagementModule);       // 交互管理
    // 应用发布
    require('../controllers/release/_node_manage.controller')(applicationManagementModule);             // 节点管理
    require('../controllers/release/_release_manage.controller')(applicationManagementModule);          // 发布管理
    //--------------------------------------------------
    //          server
    //--------------------------------------------------
    require('../server/_application.server')(applicationManagementModule);
    // applicationManagementModule.run(['$injector', function($injector) {
    //     console.log(11);
    //
    //     console.log($injector.get('paginationDirective'));
    // }])
} ;



