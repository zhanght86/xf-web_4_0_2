/**
 * Created by Administrator on 2016/6/3.
 * 控制器 
 */
module.exports=applAnalysisModule => {applAnalysisModule.
    controller('operationLogController', 
        ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
     ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter) => {
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
        /**
         * 表格列表
         **/
        function getData(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.getData.save({
                "startTime": $scope.vm.startTime,
                "endTime": $scope.vm.endTime,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "operationLogAuthor" : $scope.vm.operationLogAuthor
            },function(data){
                layer.close(i);
                if(data.status == 200){
                    $scope.vm.listData = data.data ;
                    $scope.vm.paginationConf.currentPage = index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = Math.ceil(data.data.total/ $scope.vm.paginationConf.pageSize) ;
                    console.log($scope.vm.paginationConf);
                }else{
                    $scope.vm.listData ="";
                    $scope.vm.paginationConf.totalItems = 0;
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 分页监控
         **/
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    getData(current);
                }, 100)

            }
        },true);


    }
])};