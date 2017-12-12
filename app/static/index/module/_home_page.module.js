/**
 * @Author : MILES .
 * @Create : 2017/11/23.
 * @Module :  首页模块
 */
module.exports = angular => {
    const homePageModule = angular.module('homePageModule', []);
    require('../server/_home_page.server')(homePageModule);  // api
    require('../controllers/home_page/_nav.controller')(homePageModule);  // 导航
    require('../controllers/home_page/_content.controller')(homePageModule);  // 主
    require('../controllers/user_control/_application.controller')(homePageModule);  // 应用管理
    require('../controllers/user_control/_permission.controller')(homePageModule);  // 权限管理
     require('../controllers/upload_record/_upload_record.controller')(homePageModule);  // 上传记录
};



