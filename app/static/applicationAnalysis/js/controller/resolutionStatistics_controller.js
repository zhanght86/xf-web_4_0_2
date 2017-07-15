/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('resolutionStatisticsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            paginationConf : null ,//分页条件
            pageSize : 5  , //默认每页数量
        };
    }
]);