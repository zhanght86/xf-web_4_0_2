/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowEditController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "DetailService",'TipService',
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              DetailService,TipService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.knowItemId = $stateParams.knowItemId;
        $scope.processInstanceId = $stateParams.processInstanceId;
        $scope.editFlg = false;
        $scope.pIdFlg = false;

        self.queryKnowItem = function(){
            DetailService.queryKnowItem.get({
                id:$scope.knowItemId
            },function(resource){
                if(resource.status == 200){
                    $scope.knowItem = resource.data
                    var know = $scope.knowItem;
                    var content = $sce.trustAsHtml(know.content);
                    $scope.knowItem.contentHtml = content
                }
            })
        }

        self.getProcessInstanceId  = function(){
            DetailService.getProcessInstanceId.get({
                businessKey:$scope.knowItemId
            },function(resource){
                if(resource.status == 200){
                   if(resource.data == null){
                       $scope.pIdFlg = true;
                   }
                }
            })
        }
        self.queryKnowItem();
        if($scope.processInstanceId == null){
            self.getProcessInstanceId();
        }else{
            $scope.pIdFlg = false;
        }


        //审核知识编辑
        $scope.updateKnowItem = function () {
            DetailService.updateKnowItem.save({
                knowid:$scope.knowItemId,
                title:$scope.knowItem.title,
                content:$scope.knowItem.content
            },function(resource){
                if (resource.status == 200)
                {
                    TipService.setMessage('操作成功!',"success");
                    $scope.editFlg = true;
                }else{
                    TipService.setMessage('操作失败!',"error");
                }
            }
            )
        }

        $scope.startWorkflow = function(){
            DetailService.startWorkflow.save({
                knowItemId:$scope.knowItemId,
                },function(resource){
                    if (resource.status == 200)
                    {
                        TipService.setMessage('流程已发起!',"success");
                    }else{
                        TipService.setMessage('操作失败!',"error");
                    }
                }
            )
        }

        $scope.content = "这是测试的编辑内容";

        $scope.ready = function(editor){
            alert(editor.getContent());
        }

    }
])
