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
    //֪ʶ�ĵ�
    //��ѯ�ĵ�֪ʶ����
    detailService.queryKnowDocByDocId = $resource('/api/ms/knowledgeDocumentation/selectDocumentationById', {}, {});
    //��ѯ�ĵ�֪ʶ��
    detailService.queryDocKnowItems = $resource('api/ms/knowledgeDocumentation/selectDocumentationKnowledgeList', {}, {});
    //�����ĵ�ȫ��֪ʶ��
    detailService.ignoreDocKnowAll = $resource('api/ms/knowledgeDocumentation/ignoreDocumentationKnowledgeAll', {}, {});
    //�����ĵ�����֪ʶ��
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