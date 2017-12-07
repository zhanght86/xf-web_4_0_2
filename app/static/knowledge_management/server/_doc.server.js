/**
 * @Author : MILES .
 * @Create : 2017/8/31.
 * @Module :  文档加工
 */
class KnowDocService {
    constructor($resource) {
    var knowDocService = {};
    knowDocService.queryKnowDocList = $resource(API_MS + '/knowledgeDocumentation/queryDocumentationList', {}, {});
    knowDocService.queryDetailByDocId = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    knowDocService.deleteKnowDoc = $resource(API_MS + '/knowledgeDocumentation/deleteDocumentation', {}, {});
    return knowDocService;
}}
class DetailService {
    constructor($resource) {
        var detailService = {};
        //知识文档
        //查询文档知识详情
        detailService.queryKnowDocByDocId = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationById', {}, {});
        //查询文档知识点
        detailService.queryDocKnowItems = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationKnowledgeList', {}, {});
        //忽略文档全部知识点
        detailService.ignoreDocKnowAll = $resource(API_MS + '/knowledgeDocumentation/ignoreDocumentationKnowledgeAll', {}, {});
        //忽略文档单个知识点
        detailService.ignoreDocKnow = $resource(API_MS + '/knowledgeDocumentation/ignoreDocumentationKnowledge', {}, {});
        return detailService;
    }}
class TemplateService {
    constructor($resource) {
        var templateService = {};
        templateService.queryTemplate = $resource(API_MS + '/template/queryTemplate', {}, {});
        templateService.deleteTemplate = $resource(API_MS + '/template/deleteTemplate', {}, {});
        templateService.queryRules = $resource(API_MS + '/templateRule/queryAllRule', {}, {});
        templateService.queryTemplateById = $resource(API_MS + '/template/queryTemplate', {}, {});
        templateService.generateRule = $resource(API_MS + '/templateRule/getJuniorText', {}, {});
        templateService.getSimilarText = $resource(API_MS + '/templateRule/getSimilarText', {}, {});
        templateService.optimizeText = $resource(API_MS + '/templateRule/optimizeText', {}, {});
        templateService.queryTemplateContent = $resource(API_MS + '/template/previewKnowDoc', {}, {});
        templateService.addWordRule = $resource(API_MS + '/templateRule/addWordRule', {}, {});
        templateService.updateWordRule = $resource(API_MS + '/templateRule/updateWordRule', {}, {});
        templateService.checkTemName = $resource(API_MS + '/template/searchByTemplateName', {}, {});
        templateService.deleteRule = $resource(API_MS + '/templateRule/deleteWordRule', {}, {});
        templateService.queryRuleById = $resource(API_MS + '/templateRule/queryRuleById', {}, {});
        return templateService;
    }}
        KnowDocService.$inject = ['$resource'];
        DetailService.$inject = ['$resource'];
        TemplateService.$inject = ['$resource'];
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
        .factory("KnowDocService",KnowDocService)
        .factory("DetailService",DetailService)
        .factory("TemplateService",TemplateService)
} ;