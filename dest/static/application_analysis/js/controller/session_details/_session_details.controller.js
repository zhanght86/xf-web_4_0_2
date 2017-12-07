/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('sessionDetailsController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            scan:scan ,
            getList : getList ,
            listData : null ,   // table 数据
           // paginationConf : null ,//分页条件
            paginationConf:{

            },
            pageSize : 10  , //默认每页数量
            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
           // dimensionId : null ,
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
         *  init echart 图表
         */
        var myChart = echarts.init(document.getElementById('sessionDetail'));

        /**
         * 点击查看
         * */
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
                "applicationId" :APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
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
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                getList(current);
            }
        });

        /**
         * 排序  按会话数量
         **/
        $scope.$watch('vm.orderForSessionNumber', function(){
            if($scope.vm.paginationConf.currentPage){
                getList($scope.vm.paginationConf.currentPage);
            }else{
                getList(1);
            }
        });

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
         * 表格列表
         **/
        function getList(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.sessionGetList.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime
            },function(data){
                layer.close(i);
                console.log(data) ;
                var xData=[] ,yData=[] ;
                angular.forEach(data.data.objs,function(item,index){
                    xData.push(item.userId) ;
                    yData.push(item.sessionNumber);
                    console.log(xData);
                }) ;
                myChart.setOption(setEchartOption(xData,yData));
                $scope.vm.listData = data.data.objs;
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 弹窗获取
         **/
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
         * 初始化数据
         **/
        init();
        function init(){
           // getDimensions();
           // getChannel();
            getList(1);
        }

        /**
         * 导出表格
         **/
        function exportExcel(){
            var i = layer.msg('导出中...',{icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000});
            AppAnalysisServer.exportExcel.save({
                "applicationId" : $scope.vm.applicationId,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime" : $scope.vm.timeStart ,
                "endTime": $scope.vm.timeEnd,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime,
                "index": 0,
                "pageSize": 10
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

        }

        function setEchartOption(xData,yData){
            return {
                //title: '知识点排名统计表' ,
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xData,
                        axisTick: {
                            alignWithLabel: true
                        } ,
                        axisLabel:{
                            interval: 0 ,
                            rotate:-30 ,
                            formatter:function(val){
                                if(val.length>10){
                                    val = val.toString().substring(0,10)+"...";
                                }
                                return val //横轴信息文字竖直显示
                            }
                        } ,
                    }
                ],
                grid: { // 控制图的大小，调整下面这些值就可以，
                    x: 40,
                    x2: 100,
                    y2: 150// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                },
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'访问次数',
                        type:'bar',
                        barWidth: '60%',
                        data:yData,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }}
                ]
            }
        }
    }
]);