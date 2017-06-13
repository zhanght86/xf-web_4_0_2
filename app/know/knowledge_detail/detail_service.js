/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.detail').factory('DetailService',['$resource',function ($resource) {
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
}])