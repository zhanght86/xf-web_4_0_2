/**
 * Created by dell on 2017/8/5.
 */
angular.module('knowledgeManagementModule').factory('KnowDocService',['$resource',function ($resource) {
    var knowDocService = {};
    knowDocService.queryKnowDocList = $resource('/api/ms/knowledgeDocumentation/queryDocumentationList', {}, {});
    knowDocService.queryDetailByDocId = $resource('/api/ms/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    knowDocService.deleteKnowDoc = $resource('/api/ms/knowledgeDocumentation/deleteDocumentation', {}, {});
    return knowDocService;
}]).factory('DetailService',['$resource',function ($resource) {
    var detailService = {};
    //知识文档
    //查询文档知识详情
    detailService.queryKnowDocByDocId = $resource('/api/ms/knowledgeDocumentation/selectDocumentationById', {}, {});
    //查询文档知识点
    detailService.queryDocKnowItems = $resource('api/ms/knowledgeDocumentation/selectDocumentationKnowledgeList', {}, {});
    //忽略文档全部知识点
    detailService.ignoreDocKnowAll = $resource('api/ms/knowledgeDocumentation/ignoreDocumentationKnowledgeAll', {}, {});
    //忽略文档单个知识点
    detailService.ignoreDocKnow = $resource('api/ms/knowledgeDocumentation/ignoreDocumentationKnowledge', {}, {});
    return detailService;
}]).factory('TemplateService',['$resource',function ($resource) {
    var templateService = {};
    templateService.queryTemplate = $resource('/api/ms/template/queryTemplate', {}, {});
    templateService.deleteTemplate = $resource('/api/ms/template/deleteTemplate', {}, {});
    templateService.queryRules = $resource('/api/ms/templateRule/queryAllRule', {}, {});
    templateService.queryTemplateById = $resource('/api/ms/template/queryTemplate', {}, {});
    templateService.generateRule = $resource('/api/ms/templateRule/getJuniorText', {}, {});
    templateService.getSimilarText = $resource('/api/ms/templateRule/getSimilarText', {}, {});
    templateService.optimizeText = $resource('/api/ms/templateRule/optimizeText', {}, {});
    templateService.queryTemplateContent = $resource('/api/ms/template/previewKnowDoc', {}, {});
    templateService.addWordRule = $resource('/api/ms/templateRule/addWordRule', {}, {});
    templateService.updateWordRule = $resource('/api/ms/templateRule/updateWordRule', {}, {});
    templateService.checkTemName = $resource('/api/ms/template/searchByTemplateName', {}, {});
    templateService.deleteRule = $resource('/api/ms/templateRule/deleteWordRule', {}, {});
    templateService.queryRuleById = $resource('/api/ms/templateRule/queryRuleById', {}, {});
    return templateService;
}])