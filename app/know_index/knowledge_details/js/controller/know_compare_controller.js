/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowCompareController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "DetailService","HomeService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              DetailService,HomeService) {
        /**
         * 初始化当前页参数
         */
        var self = this;

        $scope.knowItemIds = $stateParams.knowItemIds;
        
        self.queryCompareKnowItem = function(){
            DetailService.queryCompareKnowItem.get({knowItemIds:$scope.knowItemIds},function(resource){
                if (resource.status == 200 && resource.data.status == 200 && resource.data.data.totalCount ==2) {
                    $scope.knowItem1 = resource.data.data.knowledgeList[0];
                    $scope.knowItem2 = resource.data.data.knowledgeList[1];
                    var result = eq({ value1: $scope.knowItem1.content , value2: $scope.knowItem2.content })
                    
                    $scope.content1 = $sce.trustAsHtml(result.value1+"\r\n")
                    $scope.content2 = $sce.trustAsHtml(result.value2+"\r\n");

                }
            },function(){
                
            })
        }


        self.queryCompareKnowItem();
    }
])
