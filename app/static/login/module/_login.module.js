/**
 * @Author : MILES .
 * @Create : 2017/11/23.
 * @Module :  登录模块
 */
module.exports = angular => {
    const loginModule = angular.module('loginModule', []);
    require('../server/_login.server')(loginModule);              // 服务
    require('../controllers/_login.controller.js')(loginModule);  // 控制器
};