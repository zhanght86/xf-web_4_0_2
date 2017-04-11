/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBasePreController', [
    '$scope',"$state","$stateParams", function ($scope,$state,$stateParams) {
        console.log($stateParams.scanData);
        //$state.go("materialManagement.chatKnowledgeBasePreview");
        $scope.vm = {
            scanData : $stateParams.scanData,
            save : save ,
            edit : edit ,
        };

        function save(){
            $stateParams.scanData.save($stateParams.scanData)
        }
        function edit(){
            console.log($stateParams.chatKnowledgeId);
            $state.go($stateParams.scanData.editUrl,{scanDataList: $stateParams.scanData});
        }




    }
]);