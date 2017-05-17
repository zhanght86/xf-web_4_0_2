
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('markKnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","knowledgeAddServer","$window",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,knowledgeAddServer,$window) {

        if(!$window.opener.knowledgeScan){
            $state.go("markServScenaOverview.manage")
        }else{
            var knowledgeScan = $window.opener.knowledgeScan
            console.log($stateParams.scanKnowledge);
            $scope.vm = {
                applicationId :$cookieStore.get("applicationId"),
                knowledgeId : knowledgeScan.knowledgeId,        //del
                knowledgeType : knowledgeScan.knowledgeType,
                listData : null,
                edit :  edit
            };
            // 展示渠道维度使用
            //獲取渠道
            knowledgeAddServer.getDimensions({ "applicationId" : $scope.vm.applicationId},
                function(data) {
                    if(data.data){
                        $scope.vm.dimensions = data.data;
                    }
                }, function(error) {
                });
            //获取维度
            knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
                function(data) {
                    if(data.data){
                        $scope.vm.channels = data.data
                    }
                }, function(error) {
                });
            //修改

            function edit(){
                $state.go("knowledgeManagement.conceptAdd",{data:$scope.vm.listData})
            }
            getData();
            function getData(){
                httpRequestPost("/api/ms/conceptKnowledge/getKnowledge",{
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : $scope.vm.applicationId
                },function(data){
                    console.log(data);
                    $scope.vm.listData = data.data;
                    $scope.$apply();
                },function(){
                    layer.msg("获取失败")
                });
            }
        }

    }
]);