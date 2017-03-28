/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowDocController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "KnowDocService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              KnowDocService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.knowDocId = $stateParams.knowDocId;
        //alert($scope.knowDocId)

        self.getKnowDocInfo = function(){
            KnowDocService.queryDetailByDocId.save({
                    documentationId:$scope.knowDocId},
                function(resource){
                    if(resource.status == 200){
                        $scope.knowDoc = resource.data;
                    }

            },function(){
                
            })
        }

       



        self.getKnowDocInfo();
    }
])
