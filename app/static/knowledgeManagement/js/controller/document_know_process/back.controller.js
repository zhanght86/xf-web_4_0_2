/**
 * Created by miles on 2017/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('backController', [
    '$scope', '$location', "$interval", "$timeout", "$state",
    function ($scope, $location, $interval, $timeout, $state) {
        $state.go("back.gateway");
    }
]);