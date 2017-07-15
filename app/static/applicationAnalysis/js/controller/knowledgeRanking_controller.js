/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('knowledgeRankingController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            contentType:0

        };


        
    }
]);