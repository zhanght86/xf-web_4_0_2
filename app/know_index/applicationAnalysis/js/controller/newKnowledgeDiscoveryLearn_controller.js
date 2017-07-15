/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('newKnowledgeDiscoveryLearnController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId")
        };
    }
]);