/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
class FunctionServer{
    constructor($resource){

                /******************************
                                  *问法测试*    API_APPLICATION_TEST = "/api/application"  API_MS = "/api/ms",
                            ********************************/
    //问法测试
    this.testQuestion = $resource(API_MS+"/question/test/passageway", {}, {});

            /******************************
                    *会话测试*    API_APPLICATION_TEST = "/api/application"
                    ********************************/
    //test
    this.sessioonTest = $resource(API_MS+'/chat/test/passageway',{},{});
    //页面初始化加载服务
    this.getService = $resource(API_APPLICATION_TEST+'/service/released/get',{},{});
                                                      
                    /******************************
                         *批量测试*    API_APPLICATION_TEST = "/api/application"
                        ********************************/
                                                      
    //查询
    this.BatchsearchFile = $resource(API_MS+'/test/get/file',{},{});
    //删除
    this.batchDelete = $resource(API_MS+'/test/batch/delete',{},{});
    //标注
    this.remark = $resource(API_MS+'/test/add/remark',{},{});

    //获取状态
    this.start = $resource(API_MS+'/test/save/channel/user',{},{});
    //start
    this.startTest =  $resource(API_MS+'/test/start', {}, {});
    //重测
    this.retest = $resource(API_MS+'test/restart/insert',{},{});


                            /******************************
                                    *分词工具*    API_APPLICATION_TEST = "/api/application"
                             ********************************/
    //获取列表
    this.getPartList = $resource(API_MS+'/participle/test/get/list',{},{});
    //删除
    this.deletePart = $resource(API_MS+'/participle/test/delete',{},{});
    //启动
    this.startTestPart = $resource(API_MS+'/participle/test/update/status',{},{});
    //
    this.startPart = $resource(API_MS+'/participle/test/start',{},{});
    //导出
    this.exportPart = API_MS+'/participle/test/result/export/excel';




                                /******************************
                                        *智能学习*    API_ANALYSIS = "/api/analysis" ;
                                                    API_MS = "/api/ms",
                                 ********************************/
        //表格列表 未学习
        this.searchReinforcement = $resource(API_ANALYSIS+'/knowledge/learning/intelligent/unlearn/get',{},{});
        //表格列表 已学习
        this.listNoReview = $resource(API_ANALYSIS+'/knowledge/learning/intelligent/learned/get',{},{});
        //获取推荐知识
        this.getRecommend = $resource(API_ANALYSIS+'/knowledge/learning/recommend/question/get/:id',{},{});
        //组装知识学习数据(保存)
        this.assembleLearnData = $resource(API_ANALYSIS+'/knowledge/learning/associate',{},{});
        //批量忽略
        this.batchIgnore = $resource(API_ANALYSIS+'/knowledge/learning/batch/delete',{},{});
        //表格列表 学习弹窗
        this.searchByKnowledgeTitle = $resource(API_ANALYSIS+'/knowledge/learning/knowledge/get',{},{});
        //审核
        this.review = $resource(API_ANALYSIS+'/knowledge/learning/batch/review',{},{});

                                /******************************
                                       *新知识发现*    API_ANALYSIS = "/api/analysis" ;    API_MS = "/api/ms",
                                 ********************************/
        //获取聚类列表
        this.clusteringList = $resource(API_ANALYSIS+'/knowledge/learning/clustering/get',{},{});
        //表格列表 未学习
        this.searchNewKnowledgeDiscovery = $resource(API_ANALYSIS+'/knowledge/learning/unmatched/question/unlearn/get',{},{});
        //表格列表 已学习
        this.listNoReview2 = $resource(API_ANALYSIS+'/knowledge/learning/unmatched/question/learned/get',{},{});
        //忽略
        this.ignore2 = $resource(API_ANALYSIS+'/knowledgeLearn/ignoreByContent',{},{});
        //上下文
        this.content = $resource(API_ANALYSIS+'/log/content/get',{},{});



        //未学习关联弹窗
        this.searchByKnowledgeTitle2 = $resource(API_MS+'/knowledgeManage/overView/searchList',{},{});
        //关联
        this.assembleLearnData2 = $resource(API_ANALYSIS+'/knowledgeLearn/learnByContent',{},{});
        //通过 不通过
        this.review2 = $resource(API_ANALYSIS+'/knowledgeLearn/review',{},{});



    }
}
FunctionServer.$inject = ['$resource'];
module.exports = functionalTestModule =>{
    functionalTestModule.
    service("FunctionServer",FunctionServer)} ;
