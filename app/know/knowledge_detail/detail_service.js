/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.detail').factory('DetailService',['$resource',function ($resource) {
    var detailService = {};
    detailService.getKnowledgeDetail = $resource('pre/KnowledgeDetail/getKnowledgeDetail', {}, {});
    detailService.queryCommentByKnowItem = $resource('pre/Comment/queryComment', {}, {});
    detailService.queryRequireByComment = $resource('pre/Comment/queryComment', {}, {});
    detailService.queryVersionByIdentity = $resource('pre/KnowledgeDetail/queryVersionByIdentity', {}, {});
    detailService.queryCompareKnowItem = $resource('pre/KnowledgeDetail/queryCompareKnowItem', {}, {});
    detailService.queryKnowItemsByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    detailService.queryKnowDocByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    detailService.queryLinkKnowItems = $resource('pre/KnowledgeDetail/queryLinkKnowItems', {}, {});
    //查询知识条目
    detailService.queryKnowItem = $resource('pre/KnowledgeDetail/getKnowledgeDetail', {}, {});
    detailService.updateKnowItem = $resource('pre/KnowledgeDetail/editKnowItem', {}, {});
    //删除回复
    detailService.deleteComment = $resource('pre/Comment/deleteComment', {}, {});
    //发起流程
    detailService.startWorkflow = $resource('/back/Workflow/startWorkflow', {}, {});
    //查看知识条目的流程状态
    detailService.getProcessInstanceId = $resource('/back/Workflow/getProcessInstanceId', {}, {});

    return detailService;
}])