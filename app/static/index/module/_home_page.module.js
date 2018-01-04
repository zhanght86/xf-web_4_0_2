/**
 * @Author : MILES .
 * @Create : 2017/11/23.
 * @Module :  首页模块
 */
module.exports = angular => {
    const homePageModule = angular.module('homePageModule', []);
    require('../directives/_permission_tree.directive')(homePageModule);  //zTree
    require('../../../components/page/page')(homePageModule);  // 分页
    require('../../../components/page/page')(homePageModule);  // 分页
    require('../server/_home_page.server')(homePageModule);  // api
    require('../controllers/home_page/_nav.controller')(homePageModule);  // 导航
    require('../controllers/home_page/_content.controller')(homePageModule);  // 主
    require('../controllers/user_control/_application.controller')(homePageModule);  // 应用管理
    require('../controllers/user_control/_user.controller')(homePageModule);  // 用户管理
    require('../controllers/user_control/_role.controller')(homePageModule);  // 角色管理
    require('../controllers/upload_record/_upload_record.controller')(homePageModule);  // 上传记录
};



