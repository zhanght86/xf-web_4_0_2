/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.template').factory('TemplateService',['$resource',function ($resource) {
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