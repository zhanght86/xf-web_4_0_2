/**
 * Created by Administrator on 2016/6/3.
 * 控制器  访问统计
 */
module.exports=applAnalysisModule => {
    applAnalysisModule.
    controller('accessStatisticsController',
     ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter","$interval" ,
     ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter,$interval) => {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            dataTopLeft : "" , //左上角表格数据
            dataTopRigth : "" ,//右上角表格数据
            dataByTimeTotalUser:"",
            contentType : 0 ,  //默认显示访问时间统计
           //访问时间
            timerData : "" ,        //查询的所有数据
            channelId : 130 ,        //渠道
           // dimensionId : "",       //維度
            TimerSearchTimeType : 1 ,   //time类型
            timerSearchStartTime : "" , //开始时间
            timerSearchEndTime : "",    //结束时间
            queryAccessDataByTime : queryAccessDataByTime ,
            isTimerChartShow : true ,
            // 导出
            exportByTime : exportByTime ,
            exportByChannel : exportByChannel,

            //访问渠道
            accessSearchTimeType : 1  ,  //渠道time类型
            accessSearchStartTime : "" , //开始时间
            accessSearchEndTime : "" ,   //结束时间
            queryAccessDataByType : queryAccessDataByChannel,
        };
        //***********************************   20117/17 ADD    OPERATOR  : MILES **************************************************************//
        /**
         * 访问数据时间统计 echart
         * **/
        var TimerChart = echarts.init(document.getElementById('access_echart_div'));
        /**
         * 访问数据渠道统计 echart
         * **/
        var accessChart = echarts.init(document.getElementById('access_echart_div2'));
        //myChart.setOption(option);
        

        /**
         * 左上表格数据
         * **/
        void function getTopLeft(){            
            AppAnalysisServer.getTopLeft.save({
            },function(data){
                $scope.vm.dataTopLeft =data.data;
            },function(err){
                $log.log(err);
            });

        }();
        /**
         * 右上表格数据
         * **/
        void function getTopRight(){
           AppAnalysisServer.getTopRight.save({
           },function(data){
               $scope.vm.dataTopRigth=data.data;
           },function(err){
                $log.log(err);
           });
        }();

       
       queryAccessDataByTime();

        /**
         * 访问数据时间统计
         * **/
        function queryAccessDataByTime(){
            var j = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            var xData,yData1,yData2,yData3;
            var dateJump ; //获取时间间隔
            if($scope.vm.timerSearchStartTime && $scope.vm.timerSearchEndTime){
                dateJump = getTimeJump($scope.vm.timerSearchStartTime,$scope.vm.timerSearchEndTime) + 1 ;
                console.log(dateJump)
            }else if($scope.vm.TimerSearchTimeType==1 || $scope.vm.TimerSearchTimeType==2 ){
                dateJump = 1 ;
            }else if($scope.vm.TimerSearchTimeType==3){
                dateJump = 7
            }else{
                dateJump = 30
            } 
            AppAnalysisServer.queryAccessDataByTime.save({
                "startTime":$scope.vm.timerSearchStartTime ,
                "endTime":$scope.vm.timerSearchEndTime ,
                "requestTimeType" : $scope.vm.TimerSearchTimeType ,
                "channelId" : ($scope.vm.channelId==130)?null:$scope.vm.channelId
            },function(data){
                console.log(j)
                 layer.close(j);
                if(data.status==200){
                    console.log(data)
                   //  layer.close(i);
                    if(data.data.length==0){
                        layer.msg("所查询时间段有效数据为空") ;
                        $scope.vm.timerData = "" ;
                        $scope.vm.isTimerChartShow = false ;
                    }else{
                        $scope.vm.isTimerChartShow = true ;
                        /***
                         *  @type单天查询
                         *  @params 昨天 今天
                         *  @params 自定义时间相等
                         * **/
                        if(dateJump==1){
                            // echart 图表显示
                            xData = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00", "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"] ;
                            yData1 = [].fill.call(new Array(24),0) ;
                            yData2 = [].fill.call(new Array(24),0) ;
                            yData3 = [].fill.call(new Array(24),0) ;
                            yData1 = [].fill.call(new Array(24),0) ;
                            angular.forEach(data.data, function(data,index1){
                                 yData1[data.hour] = data.totalSessions ; //总会话数
                              
                            });
                            angular.forEach(data.data, function(data,index1){
                                yData2[data.hour] =data.totalUsers ;  //总用户数
                            });
                             angular.forEach(data.data, function(data,index1){
                                yData3[data.hour] =data.validSessions ;  //有效会话数
                            });
                            //表格数据
                            var tableDate = [];
                            for(var i = 0 ;i < xData.length ; i++ ){
                                if(i!=xData.length-1){
                                    tableDate.push(xData[i]+'-'+xData[i+1])
                                }
                            }
                            $scope.vm.timerData = getOriginData(tableDate.length,tableDate);
                            console.log($scope.vm.timerData)
                             angular.forEach($scope.vm.timerData["有效用户数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["有效用户数"][useIndex].users = item.validUsers
                                        }
                                    }) ;
                                }) ;
                            angular.forEach($scope.vm.timerData["有效会话数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                         if(item.time==useData.date){
                                            $scope.vm.timerData["有效会话数"][useIndex].times = item.validSessions
                                        }
                                    }) ;
                                }) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(useData,useIndex){
                                angular.forEach(data.data,function(item,index){
                                     if(item.time==useData.date){
                                        $scope.vm.timerData["总会话数"][useIndex].times = item.totalSessions
                                    }
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["总用户人数"],function(useData,useIndex){
                                angular.forEach(data.data,function(item,index){
                                     if(item.time==useData.date){
                                        $scope.vm.timerData["总用户人数"][useIndex].users = item.totalUsers
                                    }
                                }) ;
                            }) ;
                           
                            /***
                             *  @type单天查询
                             *  @params 过去七天
                             *  @params 自定义时间大于一天
                             * **/
                        }else if(dateJump==7){
                            //获取时间段内的所有时间
                            if($scope.vm.timerSearchStartTime && $scope.vm.timerSearchEndTime){
                                xData = getAllDateFromDateJump($scope.vm.timerSearchStartTime,$scope.vm.timerSearchEndTime) ;
                            }else{
                                xData = getBeforeDate(dateJump,true,true)  ;
                            }
                            $scope.vm.timerData = getOriginData(xData.length,xData);
                            console.log($scope.vm.timerData)  ;
                            console.log(xData)  ;
                            // 表格显示数据
                             // 表格显示数据
                                angular.forEach($scope.vm.timerData["有效用户数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["有效用户数"][useIndex].users = item.validUsers
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["有效会话数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["有效会话数"][useIndex].times = item.validSessions
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["总会话数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["总会话数"][useIndex].times = item.totalSessions
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["总用户人数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["总用户人数"][useIndex].users = item.totalUsers
                                        }
                                    }) ;
                                }) ;
                            //echart 图表数据
                            yData1 = [].fill.call(new Array(7),0) ;
                            yData2 = [].fill.call(new Array(7),0) ;
                            yData3 = [].fill.call(new Array(7),0) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(item,index){
                                yData1[index] = item.times ;
                            });
                            angular.forEach($scope.vm.timerData["总用户人数"], function(item,index){
                                yData2[index] = item.users ;
                            });
                            angular.forEach($scope.vm.timerData["有效会话数"], function(item,index){
                                yData3[index] = item.times ;
                            });
                        }else {
                             //获取时间段内的所有时间
                            if($scope.vm.timerSearchStartTime && $scope.vm.timerSearchEndTime){
                                xData = getAllDateFromDateJump($scope.vm.timerSearchStartTime,$scope.vm.timerSearchEndTime) ;
                            }else{
                                xData = getBeforeDate(dateJump,true,true)  ;
                            }
                            $scope.vm.timerData = getOriginData(xData.length,xData);
                            console.log($scope.vm.timerData)  ;
                            console.log(xData)  ;
                            // 表格显示数据
                             // 表格显示数据
                                angular.forEach($scope.vm.timerData["有效用户数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["有效用户数"][useIndex].users = item.validUsers
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["有效会话数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["有效会话数"][useIndex].times = item.validSessions
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["总会话数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["总会话数"][useIndex].times = item.totalSessions
                                        }
                                    }) ;
                                }) ;
                                angular.forEach($scope.vm.timerData["总用户人数"],function(useData,useIndex){
                                    angular.forEach(data.data,function(item,index){
                                        if(item.time==useData.date){
                                            $scope.vm.timerData["总用户人数"][useIndex].users = item.totalUsers
                                        }
                                    }) ;
                                }) ;
                            //echart 图表数据
                            yData1 = [].fill.call(new Array(30),0) ;
                            yData2 = [].fill.call(new Array(30),0) ;
                            yData3 = [].fill.call(new Array(30),0) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(item,index){
                                yData1[index] = item.times ;
                            });
                            angular.forEach($scope.vm.timerData["总用户人数"], function(item,index){
                                yData2[index] = item.users ;
                            });
                            angular.forEach($scope.vm.timerData["有效会话数"], function(item,index){
                                yData3[index] = item.times ;
                            });
                        }
                      
                        TimerChart.setOption(setTimerChartOption(xData,yData1,yData2,yData3)) ;
                    }
            }else{
                 layer.close(j);
            }

            },function(err){
                layer.close(j);
                console.log(err);
            });
        };
        /**
         * 访问数据渠道统计
         * **/
        function queryAccessDataByChannel(){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            AppAnalysisServer.queryAccessDataByChannel.save({
                "startTime":$scope.vm.accessSearchStartTime ,
                "endTime":$scope.vm.accessSearchEndTime ,
                "requestTimeType" : $scope.vm.accessSearchTimeType ,
            },function(data){
                layer.close(i);
                var tableList = [] ;
                // 初始渠道
                var  intervaler = $interval(function(){
                    if($scope.MASTER.channelList){
                        angular.forEach($scope.MASTER.channelList,function(item,index){
                            tableList.push({
                                name : item.channelName  ,
                                index : index ,
                                tableData :[
                                    0,0,0,0
                                ]
                            });

                        });
                        $interval.cancel(intervaler) ;
                        var data131 =[];
                        //web
                        var data132 =[];
                        //app
                        var data133 =[];
                        $scope.dataChannel=data.data;
                        //总会话数
                        for(var i = 0;i<$scope.dataChannel.length;i++){
                            if($scope.dataChannel[i].channelId == "131"){
                                data131.push({_key:0,_value:$scope.dataChannel[i].totalSessions});
                                data131.push({_key:1,_value:$scope.dataChannel[i].totalUsers});
                                data131.push({_key:2,_value:$scope.dataChannel[i].validSessions});
                                data131.push({_key:3,_value:$scope.dataChannel[i].validUsers});
                            }
                           if($scope.dataChannel[i].channelId == "132"){
                                data132.push({_key:0,_value:$scope.dataChannel[i].totalSessions});
                                data132.push({_key:1,_value:$scope.dataChannel[i].totalUsers});
                                data132.push({_key:2,_value:$scope.dataChannel[i].validSessions});
                                data132.push({_key:3,_value:$scope.dataChannel[i].validUsers});
                            }
                            if($scope.dataChannel[i].channelId == "133"){
                                data133.push({_key:0,_value:$scope.dataChannel[i].totalSessions});
                                data133.push({_key:1,_value:$scope.dataChannel[i].totalUsers});
                                data133.push({_key:2,_value:$scope.dataChannel[i].validSessions});
                                data133.push({_key:3,_value:$scope.dataChannel[i].validUsers});
                            }
                        }
                       
                        $scope.data131 = data131;
                        $scope.data132 = data132;
                        $scope.data133 = data133;
                        var ydata131;
                        var ydata132;
                        var ydata133;

                        // 指定图表的配置项和数据
                        if(data133[0] == undefined ){
                            ydata133 =0
                        }else{
                            ydata133 =$scope.data133[0]._value
                        }
                        if(data131[0] == undefined ){
                            ydata131 =0
                        }else{
                            ydata131 =$scope.data131[0]._value
                        }
                        if(data132[0] == undefined ){
                            ydata132 =0
                        }else{
                            ydata132 =$scope.data132[0]._value
                        }

                        // 使用刚指定的配置项和数据显示图表。
                        accessChart.setOption(setAccessChartOption(ydata131,ydata132,ydata133));

                    }
                },50) ;
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        };
        queryAccessDataByChannel();


          /**
         * 访问数据时间统计 导出表格
         * **/
        function exportByTime(){
            if($scope.vm.channelId==130){
               var channelId=""
            }else{
                var channelId=$scope.vm.channelId
            }
             var urlParams ="?channelId="+ channelId+"&requestTimeType="+$scope.vm.TimerSearchTimeType +"&startTime="+ $scope.vm.accessSearchStartTime +"&endTime="+ $scope.vm.accessSearchEndTime
             console.log(urlParams)
             var url = "/api/analysis/access/export" + urlParams;
                 downLoadFiles(angular.element('.StatisticsByTime')[0] ,url);

        }
        /**
         * 访问数据渠道统计 导出表格
         * **/
        function exportByChannel(){
             if($scope.vm.channelId==130){
               var channelId=""
            }else{
                var channelId=$scope.vm.channelId
            }
             var urlParams ="?channelId="+ ""+"&requestTimeType="+$scope.vm.accessSearchTimeType +"&startTime="+ $scope.vm.accessSearchStartTime +"&endTime="+ $scope.vm.accessSearchEndTime
             console.log(urlParams)
             var url = "/api/analysis/access/export/by/channel" + urlParams;
                 downLoadFiles(angular.element('.StatisticsByTime')[0] ,url);
        }

         /**
         * 原始数据获取
         * **/
        function getOriginData(n ,data){
            var originData = {
                "时间"       : [] ,
                "有效用户数" : [] ,
                "有效会话数" : [] ,
                "总会话数"   : [] ,
                "总用户人数" : []
            } ;
            for(var i = 0 ; i < n ; i++){
                originData["时间"].push( data[i] ) ;
                originData["有效用户数"].push({
                    "date" : data[i] ,
                    "users" : 0
                }) ;
                originData["有效会话数"].push({
                    "date" : data[i] ,
                    "times" : 0
                }) ;
                originData["总会话数"].push({
                    "date" : data[i] ,
                    "times" : 0
                }) ;
                originData["总用户人数"].push({
                    "date" : data[i] ,
                    "users" : 0
                })
            }
          return originData
        }

        /**
         * 获取小时时间间隔
         * **/
        function getHourStep(time){
            var timer ;
            if(time < 10){
                timer = "0"+time + ":00-"+time+1+":00"
            }else{
                timer = time + ":00-"+time+1+":00"
            }
            console.log(timer)
            return timer ;
        }


       /**
         * 改变 echart 数据   时间统计
         * **/
        function setTimerChartOption(xData,yData1,yData2,yData3){
                  return {
                title : {
                    text: '访问数据时间统计',
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                     data:['会话总人数','用户总人数','有效会话数']
                },
                 toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true},
                       magicType: {
                              type: ['line', 'bar', 'stack', 'tiled']
                          },
                    },
                  
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisTick: {onGap:false},
                        splitLine: {show:false},
                        data : xData
                    }
                    
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} '
                        }
                    }
                ],
                series : [
                    {
                        name:'会话总人数',
                        type:'line',
                         smooth: true,
                        symbol: 'circle',
                        symbolSize: 2,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 5,
                        data:yData1,

                       /* markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },*/
                        itemStyle: {
                        normal: {
                            color: '#2ec7c9',
                            borderColor: '#2ec7c9',
                            borderWidth: 2

                        },
                        
                    },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'用户总人数',
                        type:'line',
                         smooth: true,
                        symbol: 'circle',
                        symbolSize: 2,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 5,
                        data:yData2,

                        /*markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },*/
                        itemStyle: {
                        normal: {
                            color: '#d87a80',
                            borderColor: '#d87a80',
                            borderWidth: 2

                        },
                        
                    },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'有效会话数',
                        type:'line',
                         smooth: true,
                        symbol: 'circle',
                        symbolSize: 2,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 5,
                        data:yData3,
                         itemStyle: {
                            normal: {
                                color: '#ffb980',
                                borderColor: '#ffb980',
                                borderWidth: 2

                            },
                        },
                       /* markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },*/
                        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }
                    }
                ]
            }
        }
        /**
         * 改变 echart 数据   渠道统计
         * **/
        function setAccessChartOption(ydata131,ydata132,ydata133){
            return {
                title: {
                    text: '总会话数',
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                        var tar = params[0];
                        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine: {show:false},
                        data : ['微信','web','app']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'会话数',
                        type:'bar',
                        stack: '总量',
                        data:[ydata131,ydata132,ydata133]
                    },
                ]
            };
        }

    }
])};