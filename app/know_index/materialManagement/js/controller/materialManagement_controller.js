/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", function ($scope,$state) {
        alert()
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {

        };

    }
]);