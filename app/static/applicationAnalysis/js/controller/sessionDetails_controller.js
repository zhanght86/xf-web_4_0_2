/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('sessionDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            scan:scan ,
            getList : getList ,
            listData : null ,   // table 数据
            paginationConf : null ,//分页条件
            pageSize : 5  , //默认每页数量
            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
            dimensionId : null ,
            timeType : 0,
            timeStart : null,
            timeEnd : null,
            orderForSessionNumber : null,
            orderForSessionTime : null,
            timeList : [],
            getdetail : getdetail,
            currentPage : 1,
            total : null,
            talkDetail : null,
            talkDetailTotal : 0,
            userId : null,
            prePage : prePage ,
            nextPage : nextPage,
            clearHistory:clearHistory,
            contentIndex:2
        };
        // 点击查看
        function scan(id){
            $scope.vm.userId = id;
            getScanData(id,1);
            ngDialog.openConfirm({
                template:"/static/applicationAnalysis/sessionDetailsDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                width:'930px',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        function clearHistory(){
            $scope.vm.total = 0;
            $scope.vm.talkDetailTotal = 0;
            $scope.vm.timeList = null;
            $scope.vm.talkDetail = null;
        }
        //获取对应user 的 对话列表
        function getScanData(id,index){
            //清空历史数据
            clearHistory();
            httpRequestPost("/api/analysis/userSession/searchTimeBar",{
                "applicationId" : $scope.vm.applicationId,
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "userId" : id
            },function(data){
                if(data!=null){
                    $scope.vm.total = data.data.total/$scope.vm.pageSize<1?1:data.data.total/$scope.vm.pageSize;
                    $scope.vm.timeList = data.data.objs;
                    $scope.$apply();
                    getdetail($scope.vm.timeList[0].sessionId,1);
                }
            });
        }

        //list 分页变化加载数据
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                getList(current);
            }
        });

        //排序  按会话数量
        $scope.$watch('vm.orderForSessionNumber', function(){
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });
        //排序 按时间
        $scope.$watch('vm.orderForSessionTime', function(){
            $scope.vm.orderForSessionNumber=null;
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });

     //表格列表
        function getList(index){
            httpRequestPost("/api/analysis/userSession/searchList",{
                "applicationId" : $scope.vm.applicationId,
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime
            },function(data){
                console.log(data) ;
                $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8//分页框数量
                };
                $scope.$apply();
            });
        }
        //获取
        function getdetail(sessionId,index){
            httpRequestPost("/api/analysis/userSession/searchTimeBarContent",{
                "sessionId" : sessionId,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                if(data!=null){
                    $scope.vm.talkDetail = data.data.objs;
                    $scope.vm.talkDetailTotal = data.data.total;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        }
        function nextPage(){
            if($scope.vm.currentPage<$scope.vm.total){
                $scope.vm.currentPage+=1;
                getScanData($scope.vm.userId,$scope.vm.currentPage);
                getdetail($scope.vm.timeList[0].sessionId,1);
            }else if($scope.vm.currentPage=$scope.vm.total){
                $scope.vm.currentPage=$scope.vm.total
            }
        }
        function prePage(){
            if($scope.vm.currentPage=1){
                $scope.vm.currentPage=1;
            }else{
                getScanData($scope.vm.userId,$scope.vm.currentPage);
                getdetail( $scope.vm.timeList[0].sessionId,1);
            }
        }
        init();
        function init(){
            getDimensions();
            getChannel();
            getList(1);
        }
        //維度
        function getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        }

        //渠道
        function getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        }
    }
]);