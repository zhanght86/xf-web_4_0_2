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

    //删除知识
    this.delKnowledge = $resource(API_APPLICATION_TEST+"/chatKnowledge/deleteConceCptChatKnowledge", {}, {});





}]);
