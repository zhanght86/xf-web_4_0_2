/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('knowledgeRankingController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter","$window",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter,$window) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
           // applicationId :APPLICATION_ID,
            getList : getList ,
            getKnowledgeList:getKnowledgeList,
            listData : null ,
            listDataK:null,// table 数据 
            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
           // dimensionId : null ,
            timeType : 1,
            timeStart : null,
            timeEnd : null,
            timeList : [],
            total : null,
            talkDetail : null,
            talkDetailTotal : 0,
            userId : null,
            exportKnowledgeExcel : exportKnowledgeExcel,  //导出知识点排名统计
            exportNoMatchExcel : exportNoMatchExcel, //未匹配问题导出
            contentType:0
        };

        /**
         * init echart 图表
         */
        var myChart = echarts.init(document.getElementById('knowRanking'));
        var myChartQuestion = echarts.init(document.getElementById('questionRanking'));

        /**
         * 未匹配問題
         */
        function getList(index){            
            getKnowledgeList(1);            
            AppAnalysisServer.getList.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                console.log(data) ;
                var xData=[] ,yData=[] ;
                angular.forEach(data.data.objs,function(item,index){
                    xData.push(item.userQuestion) ;
                    yData.push(item.questionNumber) ;
                    console.log(xData)
                }) ;
                myChartQuestion.setOption(setEchartOption(xData,yData));
                $scope.vm.listData = data.data.objs;
                $scope.vm.listDataTotal = data.data.total;
            },function(err){
                $log.log(err);
            });
        }

        /**
         * 知識點排名
         */
        function getKnowledgeList(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.getKnowledgeList.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                layer.close(i);
                console.log(data) ;
                var xData=[] ,yData=[] ;
                angular.forEach(data.data.objs,function(item,index){
                    xData.push(item.knowledgeTitle) ;
                    yData.push(item.questionNumber)
                    console.log(xData)
                }) ;
                myChart.setOption(setEchartOption(xData,yData));
                $scope.vm.listDataK = data.data.objs;
                $scope.vm.listDataTotalK = data.data.total;
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 初始化
         */
        init();
        function init(){
            //getDimensions();
            //getChannel();
            getKnowledgeList(1);
            getList(1);
        }

        /**
         **知识点排名导出表格；
         */
        function exportKnowledgeExcel(){            
            AppAnalysisServer.exportKnowledgeExcel.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
              //  "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                console.log(data);
                if(data.status==500){                    
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                   // window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                     var url = AppAnalysisServer.exportKnowledgeExcelUrl + data.data;
                     downLoadFiles($('.knowledgeRanking')[0],url);

                }
                console.log();
            },function(err){
                $log.log(err);
            });
        }
        /**
        *未匹配问题统计导出表格；
        **/
        function exportNoMatchExcel(){
            AppAnalysisServer.exportNoMatchExcel.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                console.log(data);
                if(data.status==500){
                    //layer.msg("导出失败")
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                    //window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                    var url = AppAnalysisServer.exportNoMatchExcelUrl+data.data;
                    downLoadFiles($('.noMatch')[0],url);

                }
                console.log();

            },function(err){
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
                formatDate:function(datestring){
                    if(datestring.length!=8) return;
                    return datestring.substring(2,4)+'/'+datestring.substring(4,6)+'/'+datestring.substring(6,8);
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
                            },
                            axisLabel:{
                                interval: 0 ,
                                rotate:-30 ,
                                formatter:function(val){
                                    if(val.length>7){
                                        val = val.toString().substring(0,7)+"...";
                                    }
                                    return val//横轴信息文字竖直显示
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