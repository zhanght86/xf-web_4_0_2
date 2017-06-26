/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowledgeManagementController', [
    '$scope', 'localStorageService' ,"$state" ,function ($scope,localStorageService, $state) {
        $scope.vm = {
            userName: '',
            password: '',
        };

    }
]);