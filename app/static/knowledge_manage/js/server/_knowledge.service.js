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
        //知识导出
        this.custKnowExport = API_MS+"/knowledgeManage/exportExcel";
        //this.exportCustKnow  = $resource(API_MS+"/knowledgeManage/overView/searchList?applicationId=:applicationId&sceneIds=:sceneIds&knowledgeTitle=:knowledgeTitle"+
        //     "&knowledgeContent=:knowledgeContent&knowledgeCreator=:knowledgeCreator"+
        //     "&knowledgeExpDateEnd=:knowledgeExpDateEnd&knowledgeExpDateStart=:knowledgeExpDateStart"+
        //     "&sourceType=:sourceType&updateTimeType=:updateTimeType",{
        //        applicationId : 0,
        //        sceneIds : "",
        //        knowledgeTitle : "" ,
        //        knowledgeContent : "",
        //        knowledgeCreator : "",
        //        knowledgeExpDateEnd : "" ,
        //        knowledgeExpDateStart : "" ,
        //        sourceType : 0  ,
        //        updateTimeType : 0 ,
        //},{}) ;
        //获取新增知识数量
        this.queryCustNewNumber = $resource(API_MS+"/knowledgeManage/overView/searchTotalAndToday",{},{}) ;
        //删除知识
        this.removeCustKnow = $resource(API_MS+"/knowledgeManage/deleteKnowledge",{},{}) ;
//   知识预览 获取知识
        //faq
        this.queryFaqKnow = $resource(API_MS+"/faqKnowledge/getKnowledge",{},{}) ;
        //概念
        this.queryConceptKnow = $resource(API_MS+"/conceptKnowledge/getKnowledge",{},{}) ;
        //富文本
        this.queryRichTextKnow = $resource(API_MS+"/richtextKnowledge/getKnowledge",{},{}) ;
        //列表
        this.queryListKnow = $resource(API_MS+"/listKnowledge/getKnowledge",{},{}) ;
        //要素
        this.queryFactorKnow = $resource(API_MS+"/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId",{},{}) ;

                                /******************************
                                             * 知识总览 *
                                          **********************************/
//   faq知识新增
        // 获取相关问
        this.queryRelatedQuestion = $resource(API_MS+"/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId",{},{}) ;
//   概念知识新增
        // 获取相关问
        this.queryRelatedQuestion = $resource(API_MS+"/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId",{},{}) ;
//   列表知识新增
        // 获取相关问
        this.queryListRelatedQuestion = $resource(API_MS+"/listKnowledge/getKnowledgeTitle",{},{}) ;
//  要素知识新增
        // 获取相关问
        this.queryFactorRelatedQuestion = $resource(API_MS+"/listKnowledge/getKnowledgeTitle",{},{}) ;
//   富文本知识新增
        // 获取相关问
        this.queryRelatedQuestion = $resource(API_MS+"/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId",{},{}) ;

}]);