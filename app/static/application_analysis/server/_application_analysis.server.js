/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
class AppAnalysisServer {
        constructor($resource) {

                /******************************
                                  *访问统计*    API_ANALYSIS = "/api/analysis" ;
                            ********************************/
    //左上表格数据
    this.getTopLeft = $resource(API_ANALYSIS+"/access/query/access/top/left", {}, {});
    //右上表格数据
    this.getTopRight = $resource(API_ANALYSIS+'/access/query/access/top/right',{},{});
    
    //访问数据时间统计 导出表格
    this.exportByTime = $resource(API_ANALYSIS+'/access/export',{},{});
    //访问数据时间统计 导出表格 路径
    this.exportByTimeUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
    //访问数据渠道统计 导出表格
    this.exportByChannel = $resource(API_ANALYSIS+'/access/exportByChannel',{},{});
    // 访问数据渠道统计 导出表格 路径
    this.exportByChannelUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';

    //访问数据时间统计
    this.queryAccessDataByTime = $resource(API_ANALYSIS+'/access/query/access/by/time',{},{});
    //访问数据渠道统计
    this.queryAccessDataByChannel = $resource(API_ANALYSIS+'/access/query/access/data/by/type',{},{});
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
    this.getScanData = $resource(API_ANALYSIS+'/user/session/search/time/bar',{},{});
    ///表格列表
    this.sessionGetList = $resource(API_ANALYSIS+'/user/session/search/list',{},{});
    ////弹窗获取
    this.getdetail = $resource(API_ANALYSIS+'/user/session/search/time/content',{},{});
                                    /******************************
                                                *会话满意度统计*    API_ANALYSIS = "/api/analysis" ;
                                         ********************************/
    //表格列表
    this.satisfactionGetList = $resource(API_ANALYSIS+'/satisfaction/searchList',{},{});
    //获取Echart 图数据
    this.getPieData = $resource(API_ANALYSIS+'/satisfaction/chartAndTotal',{},{} );
                                /******************************
                                        *问答解决率统计*    API_ANALYSIS = "/api/analysis" ;
                                        ********************************/
    //表格列表
    //解决率统计图表数据
    this.resolutionStatistics = $resource(API_ANALYSIS+'/solutionStatistics/qaAskSolutionStatistics',{},{});
    //回复数图表数据
    this.replyStatistics = $resource(API_ANALYSIS+'/solutionStatistics/qaAskMatchStatistics',{},{});
                                /******************************
                                             *操作日志*    API_ANALYSIS = "/api/analysis" ;
                                        ********************************/
    //表格列表
    this.getData = $resource(API_ANALYSIS+'/operationLog/searchOperationLog',{},{});
                                /******************************
                                        *会话日志*    API_ANALYSIS = "/api/analysis" ;
                                     ********************************/
    //获取对应user 的 对话列表
    this.getScanData = $resource(API_ANALYSIS+'/user/session/search/time/bar',{},{});
    //表格列表
    this.getSessionLogList = $resource(API_ANALYSIS+'/userSession/searchList',{},{});
    //获取
    this.getdetail = $resource(API_ANALYSIS+'/user/session/search/time/content',{},{});
    //导出表格
    this.exportExcelSessionLog = $resource(API_ANALYSIS+'/userSession/export',{},{});
    //导出表格路径
    this.exportExcelSessionLogUrl = API_ANALYSIS+'/download/downloadExcel?fileName=';
                            /******************************
                                    *智能学习*    API_ANALYSIS = "/api/analysis" ;
                                                 API_MS = "/api/ms",
                                ********************************/
    //表格列表 未学习
    this.searchReinforcement = $resource(API_ANALYSIS+'/knowledgeLearn/reinforcementLearnUnlearn',{},{});
    //表格列表 已学习
    this.listNoReview = $resource(API_ANALYSIS+'/knowledgeLearn/listNoReview',{},{});
    //表格列表 学习弹窗
    this.searchByKnowledgeTitle = $resource(API_MS+'/knowledgeManage/overView/searchList',{},{});
    //忽略
    this.ignore = $resource(API_ANALYSIS+'/knowledgeLearn/ignoreByContent',{},{});
    //获取推荐知识
    this.getRecommend = $resource(API_ANALYSIS+'/userSession/getOneRecommend',{},{});
    //组装知识学习数据
    this.assembleLearnData = $resource(API_ANALYSIS+'/knowledgeLearn/learnByContent',{},{});
    //通过 不通过
    this.review = $resource(API_ANALYSIS+'/knowledgeLearn/review',{},{});

                            /******************************
                                  *未匹配问题聚类*    API_ANALYSIS = "/api/analysis" ;    API_MS = "/api/ms",
                                 ********************************/
    //表格列表 未学习
    this.searchNewKnowledgeDiscovery = $resource(API_ANALYSIS+'/knowledgeLearn/newKnowledgeDiscoveryLearnUnlearn',{},{});
    //表格列表 已学习
    this.listNoReview2 = $resource(API_ANALYSIS+'/knowledgeLearn/listNoReview',{},{});
    //未学习关联弹窗
    this.searchByKnowledgeTitle2 = $resource(API_MS+'/knowledgeManage/overView/searchList',{},{});
    //忽略
    this.ignore2 = $resource(API_ANALYSIS+'/knowledgeLearn/ignoreByContent',{},{});
    //关联
    this.assembleLearnData2 = $resource(API_ANALYSIS+'/knowledgeLearn/learnByContent',{},{});
    //通过 不通过
    this.review2 = $resource(API_ANALYSIS+'/knowledgeLearn/review',{},{});
    //上下文
    this.content = $resource(API_ANALYSIS+'/userSession/searchContent',{},{});


}};
 AppAnalysisServer.$inject = ['$resource'];
module.exports = applAnalysisModule =>{
        applAnalysisModule.
        service("AppAnalysisServer",AppAnalysisServer)
} ;
