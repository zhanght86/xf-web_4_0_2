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
    this.sessioonTest = $resource(API_APPLICATION_TEST+'/chatTest/passageway',{},{});
    //页面初始化加载服务
    this.getService = $resource(API_APPLICATION_TEST+'/service/listServiceByApplicationId',{},{});
                                                      
                    /******************************
                         *批量测试*    API_APPLICATION_TEST = "/api/application"
                        ********************************/
    //页面初始化加载已发布服务
    //this.getService = $resource(API_APPLICATION_TEST+'/service/listServiceByApplicationId',{},{});
                                                      
    //查询
    this.BatchsearchFile = $resource(API_MS+'/test/get/file',{},{});
    //删除
    this.batchDelete = $resource(API_MS+'/test/batch/delete',{},{});


    //startTest
    //this.startTest = $resource(API_APPLICATION_TEST+'/batchTest/startTest',{},{});

    //start
    //this.start =  $resource(API_APPLICATION_TEST+'/batchTest/getChannelAndUserName', {}, {});


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
                                       *新知识发现*    API_ANALYSIS = "/api/analysis" ;    API_MS = "/api/ms",
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


    }
}
FunctionServer.$inject = ['$resource'];
module.exports = functionalTestModule =>{
    functionalTestModule.
    service("FunctionServer",FunctionServer)} ;
