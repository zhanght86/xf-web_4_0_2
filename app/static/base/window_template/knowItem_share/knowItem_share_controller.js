/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */
knowledge_static_web.controller('knowItemShareController',
    ['$scope', 'KnowledgeManagementService','TipService','KnowledgePortalService',
        function ($scope, KnowledgeManagementService,TipService,KnowledgePortalService) {

    
    KnowledgeManagementService.get({}, function (result) {
        if (result.status == 200 && result.data.list.length > 0) {
            $scope.knowLibraries = result.data.list;
        }
    })
            
    $scope.knowItemShare = function(){
        var knowItemId = $scope.ngDialogData.selectedKnowItem.id;
        if($scope.selectedKnowLibrary ==null || $scope.selectedKnowLibrary ==''){
            TipService.setMessage('请选定知识库', 'warning ');
            return;
        }
        if(knowItemId ==null && $knowItemId == ''){
            TipService.setMessage('请选定知识条目', 'warning ');
            return;
        }
        KnowledgePortalService.share(knowItemId,$scope.selectedKnowLibrary);

    }
}])