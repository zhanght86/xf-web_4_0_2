/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBasePreController', [
    '$scope',"$state","$stateParams", function ($scope,$state,$stateParams) {
        //console.log($stateParams.scanData);
        $state.go("materialManagement.chatKnowledgeBasePreview");
        $scope.vm = {
            scanData : angular.fromJson($stateParams.scanData),
            save : save ,
            edit : edit ,
        };

        function save(){
            $scope.vm.scanData.save($scope.vm.scanData)
        }
        function edit(){
            //console.log($stateParams.scanData);
            $state.go($scope.vm.scanData.editUrl,{scanDataList: $stateParams.scanData});
        }

    }
]);