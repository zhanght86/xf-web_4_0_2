/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.template').factory('TemplateService',['$resource',function ($resource) {
    var templateService = {};
    templateService.queryTemplate = $resource('/api/template/queryTemplate', {}, {});
    templateService.deleteTemplate = $resource('/api/template/deleteTemplate', {}, {});
    templateService.queryRules = $resource('/api/templateRule/queryAllRule', {}, {});
    templateService.queryTemplateById = $resource('/api/template/queryTemplate', {}, {});
    templateService.generateRule = $resource('/api/templateRule/getJuniorText', {}, {});
    templateService.getSimilarText = $resource('/api/templateRule/getSimilarText', {}, {});
    templateService.optimizeText = $resource('/api/templateRule/optimizeText', {}, {});
    templateService.queryTemplateContent = $resource('/api/template/previewKnowDoc', {}, {});
    templateService.addWordRule = $resource('/api/templateRule/addWordRule', {}, {});
    templateService.updateWordRule = $resource('/api/templateRule/updateWordRule', {}, {});
    templateService.checkTemName = $resource('/api/template/searchByTemplateName', {}, {});
    templateService.deleteRule = $resource('/api/templateRule/deleteWordRule', {}, {});
    templateService.queryRuleById = $resource('/api/templateRule/queryRuleById', {}, {});

    return templateService;
}])