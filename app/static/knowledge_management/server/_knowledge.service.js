/**
 * @Author : MILES .
 * @Create : 2017/9/12.
 * @Module :  知识管理接口管理
 */
class KnowledgeService {
        constructor($resource) {
                /******************************
                 * 知识总览 *
                 **********************************/
//   客服知识
                //获取知识列表
                this.queryCustKnowList = $resource(API_MS + "/knowledge/params", {}, {});
                //知识导出
                this.custKnowExport = API_MS + "/knowledgeManage/exportExcel";
                //获取新增知识数量
                this.queryCustNewNumber = $resource(API_MS + "/knowledge/count", {}, {});
                //删除知识
                this.removeCustKnow = $resource(API_MS + "/knowledge/batch/delete", {}, {});
//   知识预览 获取知识
                //faq
                this.queryFaqKnow = $resource(API_MS + "/knowledge/FAQ/get/:id", {id:"@id"}, {});
                //概念
                this.queryConceptKnow = $resource(API_MS + "/knowledge/concept/get/:id", {id:"@id"}, {});
                //列表
                this.queryListKnow = $resource(API_MS + "/knowledge/list/get/:id", {id:"@id"}, {});
                //要素
                this.queryFactorKnow = $resource(API_MS + "/knowledge/task/get/:id", {id:"@id"}, {});

                /******************************
                          * 知识单条新增 *
                         **********************************/
//   bot
                //获取bot全路径
                this.getBotFullPath = $resource(API_MS + "/classify/get/fullname/:id", {}, {});
                //根据名字模糊搜索
                this.seekBotByName = $resource(API_MODELING + "/category/searchbycategoryname", {}, {});
                //获取bot子节点
                this.queryChildNodes = $resource(API_MS + "/classify/get/children/:id", {}, {});
//   faq知识新增
                // 保存
                this.storeFaqKnow = $resource(API_MS + "/knowledge/FAQ/add", {}, {});
                // 获取
                this.getFaqKnow = $resource(API_MS + "/knowledge/FAQ/get/:id", {}, {});
                // 编辑
                this.updateFaqKnow = $resource(API_MS + "/knowledge/FAQ/update", {}, {});
//   概念知识新增
                // 获取图片
                this.queryConceptImage = $resource(API_MATERIAL + "/picture/query", {}, {});
                // 获取语音
                this.queryConceptVoice = $resource(API_MATERIAL + "/voice/query", {}, {});
                // 获取图文
                this.queryConceptImageText = $resource(API_MATERIAL + "/graphic/message/query", {}, {});
                // 保存
                this.storeConceptKnow = $resource(API_MS + "/knowledge/concept/add", {}, {});
                // 获取
                this.getConceptKnow = $resource(API_MS + "/knowledge/concept/get/:id", {}, {});
                // 编辑
                this.updateConceptKnow = $resource(API_MS + "/knowledge/concept/update", {}, {});
//   列表知识新增
                // 保存
                this.storeListKnow = $resource(API_MS + "/knowledge/list/add", {}, {});
                // 获取
                this.getListKnow = $resource(API_MS + "/knowledge/list/get/:id", {}, {});
                // 编辑
                this.updateListKnow = $resource(API_MS + "/knowledge/list/update", {}, {});
//   要素知识新增
                // 保存
                this.storeFactorKnow = $resource(API_MS + "/knowledge/task/add", {}, {});
                // 获取
                this.storeFactorKnow = $resource(API_MS + "/knowledge/task/get/:id", {}, {});
                // 编辑
                this.updateFactorKnow = $resource(API_MS + "/knowledge/task/update", {}, {});
        }};
        KnowledgeService.$inject = ['$resource'];
module.exports = knowledgeManagementModule =>{
        knowledgeManagementModule.
        service("KnowledgeService",KnowledgeService)
} ;