/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.knowdoc').factory('KnowDocService',['$resource',function ($resource) {
    var knowDocService = {};
    knowDocService.queryKnowDocList = $resource('/knowledgeDocumentation/queryDocumentation', {}, {});
    knowDocService.queryDetailByDocId = $resource('/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    knowDocService.deleteKnowDoc = $resource('/knowledgeDocumentation/deleteDocumentation', {}, {});
    //knowDocService.singleImport = $resource('/back/knowaccess/docimport/docmanager/singleImport', {}, {});
    // knowDocService.queryAnalyseTask = $resource('/back/knowaccess//AnalyseTask/queryAnalyseTask', {}, {});
    // knowDocService.queryAnalyseTaskCount = $resource('/back/knowaccess/AnalyseTask/queryAnalyseTaskCount', {}, {});

    return knowDocService;
}])