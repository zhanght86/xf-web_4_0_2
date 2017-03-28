/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.template').factory('TemplateService',['$resource',function ($resource) {
    var templateService = {};
    templateService.queryTemplate = $resource('/template/queryTemplate', {}, {});
    templateService.deleteTemplate = $resource('/template/deleteTemplate', {}, {});
    templateService.queryRules = $resource('/templateRule/queryAllRule', {}, {});
    templateService.queryTemplateById = $resource('/template/queryTemplate', {}, {});
    templateService.generateRule = $resource('/templateRule/getJuniorText', {}, {});
    templateService.getSimilarText = $resource('/templateRule/getSimilarText', {}, {});
    templateService.optimizeText = $resource('/templateRule/optimizeText', {}, {});
    templateService.queryTemplateContent = $resource('/template/previewKnowDoc', {}, {});
    templateService.addWordRule = $resource('/templateRule/addWordRule', {}, {});
    templateService.checkTemName = $resource('/template/searchByTemplateName', {}, {});
    templateService.deleteRule = $resource('/templateRule/deleteWordRule', {}, {});
    templateService.queryRuleById = $resource('/templateRule/queryRuleById', {}, {});

    return templateService;
}])