/**
 * Created by Administrator on 2016/6/3.
 * 控制器 
 */
module.exports=systemMonitoringModule => {
    systemMonitoringModule
    .controller('OperationLogController',
        ['$scope',"localStorageService","$state","$log","SystemServer","$timeout","$stateParams","$location","ngDialog","$cookieStore","$filter",
     ($scope,localStorageService,$state,$log,SystemServer,$timeout,$stateParams,$location,ngDialog,$cookieStore,$filter) => {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            listData : "",          //数据列表
            getData :  getData ,    //获取数据
            startTime : "" ,         //开始时间
            endTime : "" ,          //结束时间
            //operationLogAuthor : "", //作者
            paginationConf : {      //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search : getData,
                location : true
            },
            pageJump : pageJump

        };
        getData($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
        /**
         * 表格列表
         **/
        function getData(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            SystemServer.getOpeData.save({
                "startTime": $scope.vm.startTime,
                "endTime": $scope.vm.endTime,
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                //"operationLogAuthor" : $scope.vm.operationLogAuthor
            },function(data){
                layer.close(i);
                if(data.status == 200){
                    console.log(data);
                    $scope.vm.listData = data.data.data ;
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
         **页面跳转
         **/
        function pageJump(item){
            if(item.type==123){
                alert("删除操作，页面不跳转");
            }else{
                //alert("页面跳转");
                if(item.moduleType==1021){
                    // var mmId = item.content.substring(item.content.indexOf(',')+1);
                    var mmId = angular.fromJson(item.content).id;
                    SystemServer.searchById.get({
                        "id": mmId
                    },function(data){
                        if(data.status==200){
                            $state.go("MM.chatEdit",{knowTextId:mmId});
                        }
                        if(data.status==500){
                           // layer.msg(data.info,{time:1000});
                            alert(data.info);
                        }
                    },function(err){
                        console.log(err);
                    });

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