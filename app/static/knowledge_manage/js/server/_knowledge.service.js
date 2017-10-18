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
                                             * 知识单条新增 *
                                          **********************************/
//   bot
        //获取bot全路径
        this.getBotFullPath = $resource(API_MODELING+"/category/getcategoryfullname",{},{}) ;
        //根据名字模糊搜索
        this.seekBotByName = $resource(API_MODELING+"/category/searchbycategoryname",{},{}) ;
        //获取bot子节点
        this.queryChildNodes = $resource(API_MODELING+"/category/listbycategorypid",{},{}) ;
//   faq知识新增
        // 获取相关问
        this.queryFapRelatedQuestion = $resource(API_MS+"/conceptKnowledge/getKnowledgeTitle",{},{}) ;
        // 检验扩展问
        this.queryFaqExtension = $resource(API_MS+"/faqKnowledge/checkExtensionQuestion",{},{}) ;
        // 保存
        this.storeFaqKnow = $resource(API_MS+"/faqKnowledge/addFAQKnowledge",{},{}) ;
        // 编辑
        this.updateFaqKnow = $resource(API_MS+"/faqKnowledge/editFAQKnowledge",{},{}) ;
//   概念知识新增
        // 获取相关问
        this.queryConceptRelatedQuestion = $resource(API_MS+"/conceptKnowledge/getKnowledgeTitle",{},{}) ;
        // 检验扩展问
        this.queryConceptExtension = $resource(API_MS+"/conceptKnowledge/checkExtensionQuestion",{},{}) ;
        // 保存
        this.storeConceptKnow = $resource(API_MS+"/conceptKnowledge/addConceptKnowledge",{},{}) ;
        // 编辑
        this.updateConceptKnow = $resource(API_MS+"/conceptKnowledge/editKnowledge",{},{}) ;
//   列表知识新增
        // 获取相关问
        this.queryListRelatedQuestion = $resource(API_MS+"/listKnowledge/getKnowledgeTitle",{},{}) ;
        // 检验扩展问
        this.queryListExtension = $resource(API_MS+"/listKnowledge/checkExtensionQuestion",{},{}) ;
        // 保存
        this.storeListKnow = $resource(API_MS+"/listKnowledge/addListKnowledge",{},{}) ;
        // 编辑
        this.updateListKnow = $resource(API_MS+"/listKnowledge/editKnowledge",{},{}) ;
//   要素知识新增
        // 获取相关问
        this.queryFactorRelatedQuestion = $resource(API_MS+"/factorKnowledge/getKnowledgeTitle",{},{}) ;
        // 检验扩展问
        this.queryFactorExtension = $resource(API_MS+"/elementKnowledgeAdd/checkDistribute",{},{}) ;
        // 保存
        this.storeFactorKnow = $resource(API_MS+"/elementKnowledgeAdd/addElementKnowledge",{},{}) ;
        // 编辑
        this.updateFactorKnow = $resource(API_MS+"/elementKnowledgeAdd/editElementKnowledge",{},{}) ;
//   富文本知识新增
        // 获取相关问
        this.queryRichTextRelatedQuestion = $resource(API_MS+"/richtextKnowledge/getKnowledgeTitle",{},{}) ;
        // 检验扩展问
        this.queryRichTextExtension = $resource(API_MS+"/richtextKnowledge/checkExtensionQuestion",{},{}) ;
        // 保存
        this.storeRichTextKnow = $resource(API_MS+"/elementKnowledgeAdd/addElementKnowledge",{},{}) ;
        // 编辑
        this.updateRichTextKnow = $resource(API_MS+"/elementKnowledgeAdd/editElementKnowledge",{},{}) ;
        // 根据id 获取图文封面图片 url ，title 方法     //pic
        this.getMediaPicture = $resource(API_MS+"/picture/queryPictureUrl",{},{}) ;
        // 根据id 获取图文封面图片 url ，title 方法     //voice
        this.getMediaVoice = $resource(API_MS+"/voiceManage/queryVoiceUrl",{},{}) ;
        // 根据id 获取图文封面图片 url ，title 方法     //pic
        this.getMediaImgText= $resource(API_MS+"/graphicMessage/findOneGraphicMessage",{},{}) ;



}]);