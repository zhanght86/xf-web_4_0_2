/**
 * Created by Administrator on 2016/6/3.
 * 控制器 
 */
module.exports=systemMonitoringModule => {
    systemMonitoringModule
    .controller('OperationLogController',
        ['$scope',"localStorageService","$state","$log","SystemServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
     ($scope,localStorageService,$state,$log,SystemServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter) => {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            listData : "",          //数据列表
            getData :  getData ,    //获取数据
            startTime : "" ,         //开始时间
            endTime : "" ,          //结束时间
            //operationLogAuthor : "", //作者
            paginationConf : {      //分页条件
                pageSize: 8,        //每页条目数量
                pagesLength: 10,    //分页块数量
            },
            pageJump : pageJump

        };
        getData(1) ;
        /**
         * 表格列表
         **/
        function getData(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            SystemServer.getOpeData.save({
                "startTime": $scope.vm.startTime,
                "endTime": $scope.vm.endTime,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                //"operationLogAuthor" : $scope.vm.operationLogAuthor
            },function(data){
                layer.close(i);
                if(data.status == 200){
                    console.log(data);
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
        /**
         **页面跳转
         **/
        function pageJump(item){
            if(item.type==123){
                alert("删除操作，页面不跳转");
            }else{
                alert("页面跳");
                if(item.moduleType==1021){
                    $state.go("MM.chatAdd",{knowTextId: (item.content.substring(item.content.indexOf(',')+1))});
                }else if(item.moduleType==1004){
                    $state.go();
                }else if(item.moduleType==1005){
                    $state.go();
                }else if(item.moduleType==1006){
                    $state.go();
                }else if(item.moduleType==1007){
                    $state.go();
                }else if(item.moduleType==1008){
                    $state.go();
                }
            }
        }



    }
])};