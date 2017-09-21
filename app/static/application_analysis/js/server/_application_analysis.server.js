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

    //访问数据时间统计
    this.queryAccessDataByTime = $resource(API_ANALYSIS+'/access/queryAccessDataByTime',{},{});
    //访问数据渠道统计
    this.queryAccessDataByChannel = $resource(API_ANALYSIS+'/access/queryAccessDataByType',{},{});
                                /******************************
                                            *知识点排名统计*    API_ANALYSIS = "/api/analysis" ;
                                            ********************************/
    //未匹配问题
    this.getList = $resource(API_ANALYSIS+'/noMatch/searchList',{},{});
    //知识点排名
    this.getKnowledgeList = $resource(API_ANALYSIS+'/knowledgeRanking/searchKnowledgeRankingList',{},{});

    //知识点排名导出表格
    this.exportKnowledgeExcel = $resource(API_ANALYSIS+'/knowledgeRanking/export',{},{});
    //知识点排名Url
    this.exportKnowledgeExcelUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';

    //未匹配问题导出表格
    this.exportNoMatchExcel = $resource(API_ANALYSIS+'/noMatch/export',{},{});
    //未匹配问题导出表格路径
    this.exportNoMatchExcelUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
                                    /******************************
                                                *会话明细统计*    API_ANALYSIS = "/api/analysis" ;
                                            ********************************/
    //导出
    this.exportExcel = $resource(API_ANALYSIS+'/userSession/export',{},{});
    //导出路径
    this.exportExcelUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
    //获取对应user 的 对话列表
    this.getScanData = $resource(API_ANALYSIS+'/userSession/searchTimeBar',{},{});
    ///表格列表
    this.sessionGetList = $resource(API_ANALYSIS+'/userSession/searchList',{},{});
    ////弹窗获取
    this.getdetail = $resource(API_ANALYSIS+'/userSession/searchTimeBarContent',{},{});
                                    /******************************
                                                *会话满意度统计*    API_ANALYSIS = "/api/analysis" ;
                                         ********************************/
    //表格列表
    this.satisfactionGetList = $resource(API_ANALYSIS+'/satisfaction/searchList',{},{});
    //获取Echart 图数据
    this.getPieData = $resource(API_ANALYSIS+'/satisfaction/chartAndTotal',{},{} );


}]);
