/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
class SystemServer {
    constructor($resource) {
                        /******************************
                            *操作日志*   API_ANALYSIS = "/api/analysis" ;
                         ********************************/
        //表格列表
        this.getData = $resource(API_ANALYSIS+'/operationLog/searchOperationLog',{},{});
                    /******************************
                        *资源监控*   API_ANALYSIS = "/api/analysis" ;
                     ********************************/
        this.getData = $resource(API_ANALYSIS+'/monitoringServer/monitoring',{},{});

                    /******************************
                        *服务监控*   API_ANALYSIS = "/api/analysis" ;
                     ********************************/
        this.getServiceDate = $resource(API_ANALYSIS+'/serviceMonitoring/monitoring',{},{});
    }
}
SystemServer.$inject = ['$resource'];
module.exports = systemMonitoringModule =>{
    systemMonitoringModule.
    service("SystemServer",SystemServer)
} ;


