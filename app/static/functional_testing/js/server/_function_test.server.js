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
    this.getService = $resource(API_APPLICATION_TEST+'/service/listServiceByApplicationId',{},{});
    //查询
    this.searchFile = $resource(API_APPLICATION_TEST+'/batchTest/findByValue',{},{});
    //


}]);
