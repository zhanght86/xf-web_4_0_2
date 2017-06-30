/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.knowdoc').factory('KnowDocService',['$resource',function ($resource) {
    var knowDocService = {};
    knowDocService.queryKnowDocList = $resource('/api/ms/knowledgeDocumentation/queryDocumentationList', {}, {});
    knowDocService.queryDetailByDocId = $resource('/api/ms/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    knowDocService.deleteKnowDoc = $resource('/api/ms/knowledgeDocumentation/deleteDocumentation', {}, {});
    return knowDocService;
}])