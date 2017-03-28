/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowVersionController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state",
    "DetailService","HomeService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,
              DetailService,HomeService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.compareKnowItemIds = [];
        $scope.knowItemId = $stateParams.knowItemId;

        self.queryVersionByIdentity = function(){
            DetailService.queryVersionByIdentity.get({knowItemId:$scope.knowItemId},function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.knowItemList = resource.data.data.knowledgeList
                }
            },function(){

            })
        }

        $scope.toCompare = function(knowItemId){
            if($.inArray(knowItemId,  $scope.compareKnowItemIds) == -1){
                $scope.compareKnowItemIds.push(knowItemId)
            }else{
                $scope.compareKnowItemIds.splice(jQuery.inArray(knowItemId,$scope.compareKnowItemIds),1); ;
            }
        }

        $scope.exitCompare = function(){
            if($scope.compareKnowItemIds.length == 2){
                $state.go("index.version_compare",{knowItemIds:$scope.compareKnowItemIds});
            }else{
                alert("请选择两个需要比较的知识条目");
            }
        }

        self.queryVersionByIdentity();
    }
])
