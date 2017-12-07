/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */
knowledge_static_web.controller('knowItemDeleteController',
    ['$scope', 'KnowledgeManagementService','TipService','KnowledgePortalService',
        function ($scope, KnowledgeManagementService,TipService,KnowledgePortalService) {



    $scope.knowItemDelete = function(){
        var knowItemId = $scope.ngDialogData.selectedKnowItem.id;
        if(knowItemId ==null || knowItemId ==''){
            TipService.setMessage('知识条目ID不能为空', 'warning ');
            return;
        }
        KnowledgePortalService.deleteKnowItem(knowItemId);

    }
}])