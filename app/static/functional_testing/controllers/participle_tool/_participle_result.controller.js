/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('ParticipleResultController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore)=> {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        //console.log($stateParams) ;
        $scope.vm = {
            paginationConf : {             //分页条件
                pageSize : 5,        ////默认每页数量
                pagesLength: 10//分页框数量
            },




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
])};