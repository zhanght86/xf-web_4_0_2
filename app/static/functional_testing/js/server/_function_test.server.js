/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
angular.module("functionalTestModule").service("FunctionServer",["$resource",function($resource){

                /******************************
                                  *问法测试*    API_APPLICATION_TEST = "/api/application"
                            ********************************/
    //问法测试
    this.testQuestion = $resource(API_APPLICATION_TEST+"/questionTest/passageway", {}, {});
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
    this.BatchsearchFile = $resource(API_APPLICATION_TEST+'/batchTest/findByValue',{},{});
    //删除
    this.batchDelete = $resource(API_APPLICATION_TEST+'/batchTest/batchDeleteByIds',{},{});
    //stopTest
    this.stopTest = $resource(API_APPLICATION_TEST+'/batchTest/startTest',{},{});

    //startTest
    this.startTest = $resource(API_APPLICATION_TEST+'/batchTest/startTest',{},{});

    //start
    this.start =  $resource(API_APPLICATION_TEST+'/batchTest/getChannelAndUserName', {}, {});
                            /******************************
                                    *批量测试-测试结果*    API_APPLICATION_TEST = "/api/application"
                                    ********************************/
// 测试结果
    //加载表格
    this.showData = $resource(API_APPLICATION_TEST+'/testResult/listBatchFileByPage',{},{});
    //修改
    this.editQuestion = $resource(API_APPLICATION_TEST+'/testResult/updateKnowledge',{},{});
    //查询
    this.searchFile = $resource(API_APPLICATION_TEST+'/testResult/searchKnowledge',{},{});
    //导出
    this.exportExcel = $resource(API_APPLICATION_TEST+'/testResult/export',{},{});
    //批量测试
    this.batchTest = $resource(API_APPLICATION_TEST+'/testResult/batchTest',{},{});
                                     /******************************
                                         *批量测试-测试详情*    API_APPLICATION_TEST = "/api/application"
                                            ********************************/
    //获取数据
    this.DetailgetData = $resource(API_APPLICATION_TEST+'/detail/getDetailList',{},{});
    //添加
    this.addKnow = $resource(API_APPLICATION_TEST+'/detail/addKnowledge',{},{});
    //编辑
    this.editKnow = $resource(API_APPLICATION_TEST+'/detail/updateKnowledge',{},{});
    //删除
    this.deleteKnow = $resource(API_APPLICATION_TEST+'/detail/deleteById',{},{});
    //查询
    this.search = $resource(API_APPLICATION_TEST+'/detail/findKnowledge',{},{});
    //知识导出
    this.exportExcel = $resource(API_APPLICATION_TEST+'/detail/export',{},{});
    //导出
    this.downloadExcel =API_APPLICATION_TEST+'/detail/downloadExcel?fileName=';
                                             


}]);
