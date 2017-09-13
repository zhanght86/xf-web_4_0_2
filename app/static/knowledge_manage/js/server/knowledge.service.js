/**
 * @Author : MILES .
 * @Create : 2017/9/12.
 * @Module :  知识管理接口管理
 */
angular.module("knowledgeManagementModule").service("KnowledgeService",["$resource",function($resource){
                        /******************************
                                        * 知识总览 *
                                    **********************************/
//   客服知识
        //获取知识列表
        this.queryCustKnowList = $resource(API_MS+"/knowledgeManage/overView/searchList",{},{}) ;
        //批量导出知识
        this.exportCustKnow  = $resource(API_MS+"/knowledgeManage/overView/searchList",{},{}) ;
        //获取新增知识数量
        this.queryCustNewNumber = $resource(API_MS+"/knowledgeManage/overView/searchTotalAndToday",{},{}) ;
        //删除知识
        this.removeCustKnow = $resource(API_MS+"/knowledgeManage/deleteKnowledge",{},{}) ;
        //this.custKnowExport = $resource(API_MS+"",{},{})

}]);