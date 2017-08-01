/**
 * Created by Administrator on 2016/6/3.
 * 控制器 
 */
angular.module('applAnalysisModule').controller('operationLogController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            listData : "",          //数据列表
            getData :  getData ,    //获取数据
            startTime : "" ,         //开始时间
            endTime : "" ,          //结束时间
            operationLogAuthor : "", //作者
            paginationConf : {      //分页条件
                pageSize: 8,        //每页条目数量
                pagesLength: 10,    //分页块数量
            }
        };
        getData(1) ;
        //表格列表
        function getData(index){
            httpRequestPost("/api/analysis/operationLog/searchOperationLog",{
                "startTime": $scope.vm.startTime,
                "endTime": $scope.vm.endTime,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "operationLogAuthor" : $scope.vm.operationLogAuthor
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.listData = data.data ;
                        $scope.vm.paginationConf.currentPage = index ;
                        $scope.vm.paginationConf.totalItems =data.data.total ;
                        $scope.vm.paginationConf.numberOfPages = Math.ceil(data.data.total/ $scope.vm.paginationConf.pageSize) ;
                        console.log($scope.vm.paginationConf);
                    });
                }
            },function(error){console.log(error)});
        }

        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getData(current);
                }, 100)

            }
        },true);


    }
]);