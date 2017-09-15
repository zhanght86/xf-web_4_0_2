/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('participleResultController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore, knowledgeAddServer) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        //console.log($stateParams) ;
        $scope.vm = {
            pageSize : 5,            //每页条数；
            paginationConf : '',     //分页条件
            paginationConf1 : '',     //分页条件
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            batchNumberId:$stateParams.batchNumberId,



        };
        //分页定时器
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    initBatchTest();
                }, 100);
            }
        },true);





    }
]);