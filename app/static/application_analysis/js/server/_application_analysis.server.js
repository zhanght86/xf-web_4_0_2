/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
angular.module("applAnalysisModule").service("AppAnalysisServer",["$resource",function($resource){

                /******************************
                                  *访问统计*    API_ANALYSIS = "/api/analysis" ;
                            ********************************/
    //左上表格数据
    this.getTopLeft = $resource(API_ANALYSIS+"/access/queryAccessDataTopLeft", {}, {});
    //右上表格数据
    this.getTopRight = $resource(API_ANALYSIS+'/access/queryAccessDataTopright',{},{});
    
    //访问数据时间统计 导出表格
    this.exportByTime = $resource(API_ANALYSIS+'/access/export',{},{});
    //访问数据时间统计 导出表格 路径
    this.exportByTimeUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
    //访问数据渠道统计 导出表格
    this.exportByChannel = $resource(API_ANALYSIS+'/access/exportByChannel',{},{});
    // 访问数据渠道统计 导出表格 路径
    this.exportByChannelUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
    
                                             


}]);
