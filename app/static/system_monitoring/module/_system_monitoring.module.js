/**
 * @Author : MILES .
 * @Create : 2017/12/11.
 * @Module :  系统监控
 */
module.exports = angular => {
    const systemMonitoringModule = angular.module('systemMonitoringModule', []);
    require('../controllers/_main.controller')(systemMonitoringModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(systemMonitoringModule);  // 导航
    require('../server/_system.server')(systemMonitoringModule);  // 服務
    require('../../../components/trust_src/trust_src')(systemMonitoringModule);  // 指令
} ;