/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
angular.module("systemMonitoring").service("SystemServer",["$resource",function($resource){

                /******************************
                                  *资源监控*   API_ANALYSIS = "/api/analysis" ;
                            ********************************/
   this.getData = $resource(API_ANALYSIS+'/monitoringServer/monitoring',{},{});
    







}]);
