/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

module.exports = angular =>{
    const systemMonitoringModule = angular.module('systemMonitoringModule',[]);
    require('../controllers/_main.controller')(systemMonitoringModule);           //控制器
    require('../../index/controllers/home_page/_nav.controller')(systemMonitoringModule);   //导航
    //--------------------------------------------------
    //          directive
    //--------------------------------------------------
    require('../../../components/page/page')(systemMonitoringModule);  // 分页
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    // 操作日志
    require('../controllers/operation_log/_operation_log.controller')(systemMonitoringModule);
    // 资源监控
    require('../controllers/resource_monitoring/_resource_monitoring.controller')(systemMonitoringModule);
    // 服务监控
    require('../controllers/service_monitoring/_service_monitoring.controller')(systemMonitoringModule);

    //--------------------------------------------------
    //          server
    //--------------------------------------------------
    require('../server/_system.server')(systemMonitoringModule);


    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
    //--------------------------------------------------
    //         filters
    //--------------------------------------------------
    require('../filters/_operate.filter')(systemMonitoringModule);


}

