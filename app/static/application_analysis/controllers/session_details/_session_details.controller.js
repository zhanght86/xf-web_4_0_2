/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=applAnalysisModule => {applAnalysisModule
             .controller('sessionDetailsController',
              ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$location",
              ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$location) => {
        $scope.vm = {
            scan:scan ,
            getList : getList ,
            listData : null ,   // table 数据
            paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : getList,
                location : true
            },
            dimensions : [] ,
            channels : [] ,
            channelId  : 130 ,
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
            exportExcel : exportExcel,  //导出
            applicationId:APPLICATION_ID
        };

         /**
         * 表格列表
         **/

        getList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function getList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
            if($scope.vm.timeStart==null&&$scope.vm.endTime!=null){
                 layer.msg("请输入开始时间")
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.sessionGetList.save({
                "channelId": $scope.vm.channelId==130?null:$scope.vm.channelId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
            },function(data){
                layer.close(i);
                 if(data.status==200){
                    if(data.data.data!=null){ 
                     $scope.vm.listData = data.data.data;
                     $scope.vm.paginationConf.totalItems = data.data.total;
                     $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
                    }else{
                        $scope.vm.listData=[];
                         $scope.vm.paginationConf.totalItems = 0;
                        $scope.vm.paginationConf.numberOfPages = 0;
                        layer.msg(data.info)
                    }
               }else{
                   layer.close(i);
               }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 点击查看
         * */
        function scan(id){
            $scope.vm.userId = id;
            getScanData(id,1);
              var dialog = ngDialog.openConfirm({
                template:"/static/application_analysis/views/session_details/session_details_dialog.html",
                scope: $scope,
                width:"930px",
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
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
        /**
         * 获取对应user 的 对话列表
         **/
        function getScanData(id,index){
            //清空历史数据
            clearHistory();            
            AppAnalysisServer.getScanData.save({
                "channelId":$scope.vm.channelId==130?null:$scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "userId" : id
            },function(data){
                if(data.status==200){
                    $scope.vm.total = data.data.total/$scope.vm.paginationConf.pageSize<1?1:data.data.total/$scope.vm.paginationConf.pageSize;
                    $scope.vm.timeList = data.data.data;
                   getdetail($scope.vm.timeList[0].sessionId,1);
                 
                }else{
                    layer.msg(data.info)
                }
            },function(err){
                $log.log(err);
            });
        }


        /**
         * 排序 按时间
         **/
        $scope.$watch('vm.orderForSessionTime', function(){
            $scope.vm.orderForSessionNumber=null;
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });

   

        /**
         * 弹窗获取
         **/
        function getdetail(sessionId,index){            
            AppAnalysisServer.getdetail.save({
                "sessionId" : sessionId,
               "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
            },function(data){
                if(data!=null){
                    $scope.vm.talkDetail = data.data.data;
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
         * 导出表格
         **/
        function exportExcel(){
            var i = layer.msg('导出中...',{icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000});
            AppAnalysisServer.exportExcel.save({
               "applicationId":APPLICATION_ID,
               "channelId": $scope.vm.channelId==130?null:$scope.vm.channelId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status==500){
                    //layer.msg("导出失败")
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                    //window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                    var url=AppAnalysisServer.exportExcelUrl+data.data;
                    downLoadFiles($('.session_details')[0],url);
                }
                console.log();
            },function(err){
                layer.close(i);
                $log.log(err);
            });
         // window.open("api/analysis/user/session/export/"+APPLICATION_ID+"");

        }

    }
])};