/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('sessionLogController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            scan:scan ,
            getList : getList ,
            listData : null ,   // table 数据
            paginationConf : {      //分页条件
                pageSize: 5,        //每页条目数量
                pagesLength: 10,    //分页块数量
            } ,//分页条件
            pageSize : 10  , //默认每页数量
            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
            dimensionId : null ,
            timeType : 1,
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
            contentIndex:2 ,
            exportExcel : exportExcel  //导出
        };

        /**
         * 点击查看
         **/
        function scan(id){
            $scope.vm.userId = id;
            getScanData(id,1);
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/session_details/session_details_dialog.html','930px',function(){

            },function(){

            });
        }
        function clearHistory(){
            $scope.vm.total = 0;
            $scope.vm.talkDetailTotal = 0;
            $scope.vm.timeList = null;
            $scope.vm.talkDetail = null;
        }

        /**
         * 获取对应user 的 对话列表
         **/
        function getScanData(id,index){
            //清空历史数据
            clearHistory();
            AppAnalysisServer.getScanData.save({
                "applicationId" : APPLICATION_ID,
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
                    getdetail($scope.vm.timeList[0].sessionId,1);
                }
            },function(err){
                $log.log(err);
            });
        }

        /**
         * list 分页变化加载数据
         **/
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getList(current);
                }, 100)

            }
        },true);

        /**
         * 排序  按会话数量
         */
        $scope.$watch('vm.orderForSessionNumber', function(){
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });
        /**
         * 排序 按时间
         */
        $scope.$watch('vm.orderForSessionTime', function(){
            $scope.vm.orderForSessionNumber=null;
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });

        /**
         * 表格列表
         */
        function getList(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.getSessionLogList.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime
            },function(data){
                layer.close(i);
                if(data.info　== "没有查询到记录"){
                    layer.msg("此时间段内查询无会话日志") ;
                    $scope.vm.paginationConf.totalItems =0 ;
                    $scope.vm.listData = '';
                    //$scope.vm.paginationConf.currentPage =index ;

                }else{
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = Math.ceil(data.data.total/ $scope.vm.paginationConf.pageSize) ;
                    $scope.vm.listData = data.data;
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 获取
         */
        function getdetail(sessionId,index){

            AppAnalysisServer.getdetail.save({
                "sessionId" : sessionId,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                if(data!=null){
                    $scope.vm.talkDetail = data.data.objs;
                    $scope.vm.talkDetailTotal = data.data.total;
                }
            },function(err){
                $log.log(err);
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

        /**
         * 初始化
         */
        init();
        function init(){
            //getDimensions();
            //getChannel();
            getList(1);
        }

        /**
         *  导出表格
         */
        function exportExcel(){
            var i = layer.msg('导出中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.exportExcelSessionLog.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "endTime": $scope.vm.timeEnd,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime,
                "index": 0,
                "pageSize": 10
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status==500){                    
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                    //window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                    var url= AppAnalysisServer.exportExcelSessionLogUrl+data.data;
                    downLoadFiles($('.session_log')[0],url);
                }
                console.log();
            },function(err){
                layer.close(i);
                $log.log(err);
            });


        }

    }
]);