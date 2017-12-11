/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
// angular.module("systemMonitoring").service("SystemServer",["$resource",function($resource){
//
//                 /******************************
//                                   *资源监控*   API_ANALYSIS = "/api/analysis" ;
//                             ********************************/
//    this.getData = $resource(API_ANALYSIS+'/monitoringServer/monitoring',{},{});
//
//                 /******************************
//                             *服务监控*   API_ANALYSIS = "/api/analysis" ;
//                  ********************************/
//     this.getServiceDate = $resource(API_ANALYSIS+'/serviceMonitoring/monitoring',{},{});
//
// }]);
/**
 * @Author : MILES .
 * @Create : 2017/8/31.
 * @Module :  应用管理服务
 */
class SystemMonitoringServer {
    constructor($resource) {
        /******************************
         *应用配置*
         ********************************/
//   渠道管理
        //请求渠道列表
        this.userLogin = $resource("/api/v1/user/login", {}, {});
    }
}
    SystemMonitoringServer.$inject = ['$resource'];
module.exports = systemMonitoringModule =>{
    systemMonitoringModule.
    service("SystemMonitoringServer",SystemMonitoringServer)} ;