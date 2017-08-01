/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('accessStatisticsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            dataByTimeTotalUser:"",
            contentType : 0 ,  //默认显示访问时间统计
            channels : "" ,    //所有渠道
            dimensions : "" ,
     //访问时间
            timerData : "" ,        //查询的所有数据
            channelId : "" ,        //渠道
            dimensionId : "",       //維度
            TimerSearchTimeType : 1 ,   //time类型
            timerSearchStartTime : "" , //开始时间
            timerSearchEndTime : "",    //结束时间
            queryAccessDataByTime : queryAccessDataByTime ,
            isTimerChartShow : true ,

    //访问渠道
            accessSearchTimeType : 1  ,  //渠道time类型
            accessSearchStartTime : "" , //开始时间
            accessSearchEndTime : "" ,   //结束时间
            queryAccessDataByType : queryAccessDataByChannel
        };
        //***********************************   20117/17 ADD    OPERATOR  : MILES **************************************************************//
        //維度
        void function getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.$apply(function(){
                        $scope.vm.dimensions = data.data;
                    });
                }
            },function(err){
                console.log(err);
            });
        }() ;
        //渠道
        void function getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.$apply(function(){
                        $scope.vm.channels = data.data;
                    });
                }
            },function(err){
                console.log(err);
            });
        }();
        //访问数据渠道统计
        var myChart2 = echarts.init(document.getElementById('access_echart_div2'));
        //访问数据时间统计
        var TimerChart = echarts.init(document.getElementById('access_echart_div'));
        //myChart.setOption(option);
        //改变echart 数据
        function setChartOption(xData,yData1,yData2){
            return {
                title : {
                    text: '访问数据时间统计',
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['人数']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
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
                        name:'总会话数',
                        type:'line',
                        data:yData1,
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'总用户人数',
                        type:'line',
                        data:yData2,
                        markPoint : {
                            data : [
                                {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }
                    }
                ]
            }
        }
        //原始数据获取
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
        //获取小时时间间隔
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
        //*********************************************************************************************************************************8//
        //左上表格数据
        void function getTopLeft(){
            httpRequestPost("/api/analysis/access/queryAccessDataTopLeft",{
                "applicationId":APPLICATION_ID,
            },function(data){
                $scope.$apply(function(){
                    $scope.dataTopRightToday = data.data["今天"];
                    $scope.dataTopRightTom = data.data["昨天"];
                    $scope.dataTopRightHis = data.data["历史最高"];
                    console.log(data.data);
                })
            },function(){})
        }();
        //右上表格数据
       void function getTopRight(){
            httpRequestPost("/api/analysis/access/queryAccessDataTopright",{
                "applicationId":$cookieStore.get("applicationId"),
            },function(data){
                $scope.$apply(function(){
                    $scope.dataTopLeftToday = data.data["今日"];
                    $scope.dataTopLeftHis = data.data["历史"];
                })
            },function(){

            })
        }();
        //右上表格数据
        $scope.setDate = function(date){
            $scope.startTime = "";
            $scope.endTime = "";
            //今天的时间
            var day = new Date();
            day.setTime(day.getTime());
            var s2 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
            if(date = 0){
                $scope.startTime =s2+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            if(date =1 ){
                //昨天的时间
                day.setTime(day.getTime()-24*60*60*1000);
                var s1 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s1+" 00:00:00";
                $scope.endTime = s1+" 23:59:59";
            }
            if(date = 7 ){
                //过去7天/
                day.setTime(day.getTime()-7*24*60*60*1000);
                var s3 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s3+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            if(date =30){
                //过去7天
                day.setTime(day.getTime()-30*24*60*60*1000);
                var s4 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s4+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            queryAccessDataByTime();
        };

        //访问数据时间统计
        function queryAccessDataByTime(){
            var xData,yData1,yData2 ;
            var dateJump ; //获取时间间隔
            if($scope.vm.timerSearchStartTime && $scope.vm.timerSearchEndTime){
                dateJump = getTimeJump($scope.vm.timerSearchStartTime,$scope.vm.timerSearchEndTime) + 1
                console.log(dateJump)
            }else{
                dateJump = 7 ;
            }
            httpRequestPost("/api/analysis/access/queryAccessDataByTime",{
                "applicationId":APPLICATION_ID ,
                "startTime":$scope.vm.timerSearchStartTime ,
                "endTime":$scope.vm.timerSearchEndTime ,
                "requestTimeType" : $scope.vm.TimerSearchTimeType ,
                "dimensionId" : $scope.vm.dimensionId,
                "channelId" : $scope.vm.channelId
            },function(data){
                $scope.$apply(function(){
                    if(data.data["有效用户数"].length==0 && data.data["有效会话数"].length==0 && data.data["总会话数"].length==0 && data.data["总用户人数"].length==0){
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
                        if($scope.vm.TimerSearchTimeType==1 ||$scope.vm.TimerSearchTimeType==2 || dateJump==1){
                            // echart 图表显示
                            xData = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00",
                                "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"] ;
                            yData1 = [].fill.call(new Array(24),0) ;
                            yData2 = [].fill.call(new Array(24),0) ;
                            angular.forEach(data.data["总会话数"], function(data,index1){
                                yData1[data.date] = data.times ;
                            });
                            angular.forEach(data.data["总用户人数"], function(data,index1){
                                yData2[data.date] = data.users ;
                            });
                            //表格数据
                            var tableDate = [];
                            for(var i = 0 ;i < xData.length ; i++ ){
                                if(i!=xData.length-1){
                                    tableDate.push(xData[i]+'-'+xData[i+1])
                                }
                            }
                            $scope.vm.timerData = getOriginData(tableDate.length,tableDate);
                            angular.forEach($scope.vm.timerData["有效用户数"],function(useData,useIndex){
                                angular.forEach(data.data["有效用户数"],function(item,index){
                                    $scope.vm.timerData["有效用户数"][item.date].users = item.users
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["有效会话数"],function(useData,useIndex){
                                angular.forEach(data.data["有效会话数"],function(item,index){
                                    $scope.vm.timerData["有效会话数"][item.date].times = item.times
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(useData,useIndex){
                                angular.forEach(data.data["总会话数"],function(item,index){
                                    $scope.vm.timerData["总会话数"][item.date].times = item.times
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["总用户人数"],function(useData,useIndex){
                                angular.forEach(data.data["总用户人数"],function(item,index){
                                    $scope.vm.timerData["总用户人数"][item.date].users = item.users
                                }) ;
                            }) ;
                            /***
                             *  @type单天查询
                             *  @params 过去七天
                             *  @params 自定义时间大于一天
                             * **/
                        }else{
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
                            angular.forEach($scope.vm.timerData["有效用户数"],function(useData,useIndex){
                                angular.forEach(data.data["有效用户数"],function(item,index){
                                    if(item.date==useData.date){
                                        $scope.vm.timerData["有效用户数"][useIndex].users = item.users
                                    }
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["有效会话数"],function(useData,useIndex){
                                angular.forEach(data.data["有效会话数"],function(item,index){
                                    if(item.date==useData.date){
                                        $scope.vm.timerData["有效会话数"][useIndex].times = item.times
                                    }
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(useData,useIndex){
                                angular.forEach(data.data["总会话数"],function(item,index){
                                    if(item.date==useData.date){
                                        $scope.vm.timerData["总会话数"][useIndex].times = item.times
                                    }
                                }) ;
                            }) ;
                            angular.forEach($scope.vm.timerData["总用户人数"],function(useData,useIndex){
                                angular.forEach(data.data["总用户人数"],function(item,index){
                                    if(item.date==useData.date){
                                        $scope.vm.timerData["总用户人数"][useIndex].users = item.users
                                    }
                                }) ;
                            }) ;
                            //echart 图表数据
                            yData1 = [].fill.call(new Array(7),0) ;
                            yData2 = [].fill.call(new Array(7),0) ;
                            angular.forEach($scope.vm.timerData["总会话数"],function(item,index){
                                yData1[index] = item.times ;
                            });
                            angular.forEach($scope.vm.timerData["总用户人数"], function(item,index){
                                yData2[index] = item.users ;
                            });
                        }
                        TimerChart.setOption(setChartOption(xData,yData1,yData2)) ;
                    }
                }) ;
            },function(){})
        };
        queryAccessDataByTime();
        //访问数据渠道统计
        function queryAccessDataByChannel(){
            httpRequestPost("/api/analysis/access/queryAccessDataByType",{
                "applicationId":APPLICATION_ID,
                "startTime":$scope.vm.accessSearchStartTime ,
                "endTime":$scope.vm.accessSearchEndTime ,
                "requestTimeType" : $scope.vm.accessSearchTimeType ,
            },function(data){
                //vx
                var data130 =[];
                //web
                var data131 =[];
                //app
                var data132 =[];

                $scope.dataChannelTalk = data.data["总会话数"];
                $scope.dataChannelUser = data.data["总用户人数"];
                $scope.dataChannelVilidTalk = data.data["有效会话数"];
                $scope.dataChannelVilidUser = data.data["有效用户数"];
                //console.log( $scope.dataChannelTalk[0]["times"]);
                //总会话数
                for(var i = 0;i<$scope.dataChannelTalk.length;i++){
                  if($scope.dataChannelTalk[i]["channel"] == "130"){
                      data130.push({_key:0,_value:$scope.dataChannelTalk[i]["times"]});
                  }
                    if($scope.dataChannelTalk[i]["channel"] == "131"){
                        data131.push({_key:0,_value:$scope.dataChannelTalk[i]["times"]});
                    }
                    if($scope.dataChannelTalk[i]["channel"] == "132"){
                        data132.push({_key:0,_value:$scope.dataChannelTalk[i]["times"]});
                    }
                }
                //总用户人数
                for(var i = 0;i<$scope.dataChannelUser.length;i++){
                    if($scope.dataChannelUser[i]["channel"] == "130"){
                        data130.push({_key:1,_value:$scope.dataChannelUser[i]["users"]});
                    }
                    if($scope.dataChannelUser[i]["channel"] == "131"){
                        data131.push({_key:1,_value:$scope.dataChannelUser[i]["users"]});
                    }
                    if($scope.dataChannelUser[i]["channel"] == "132"){
                        data132.push({_key:1,_value:$scope.dataChannelUser[i]["users"]});
                    }
                }
                //有效会话数
                for(var i = 0;i<$scope.dataChannelVilidTalk.length;i++){
                    if($scope.dataChannelVilidTalk[i]["channel"] == "130"){

                        data130.push({_key:2,_value:$scope.dataChannelVilidTalk[i]["times"]});
                    }
                    if($scope.dataChannelVilidTalk[i]["channel"] == "131"){
                        data131.push({_key:2,_value:$scope.dataChannelVilidTalk[i]["times"]});
                    }
                    if($scope.dataChannelVilidTalk[i]["channel"] == "132"){
                        data132.push({_key:2,_value:$scope.dataChannelVilidTalk[i]["times"]});
                    }
                }
                //有效用户数
                for(var i = 0;i<$scope.dataChannelVilidUser.length;i++){
                    if($scope.dataChannelVilidUser[i]["channel"] == "130"){
                        data130.push({_key:3,_value:$scope.dataChannelVilidUser[i]["users"]});
                    }
                    if($scope.dataChannelVilidUser[i]["channel"] == "131"){
                        data131.push({_key:3,_value:$scope.dataChannelVilidUser[i]["users"]});
                    }
                    if($scope.dataChannelVilidUser[i]["channel"] == "132"){
                        data132.push({_key:3,_value:$scope.dataChannelVilidUser[i]["users"]});
                    }
                }

                $scope.data130 = data130;
                $scope.data131 = data131;
                $scope.data132 = data132;


                var ydata130;
                var ydata131;
                var ydata132;

                // 指定图表的配置项和数据
//    var data130 = data130[0]._value;
//    var data131 = data131[0]._value;
//    var data132 = data132[0]._value;
                if(data130[0] == undefined ){
                    ydata130 =0
                }else{
                    ydata130 =$scope.data130[0]._value
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


                var option2 = {
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
//                itemStyle:{
//                    normal:{
//                        barBorderColor:'rgba(0,0,0,0)',
//                        color:'rgba(0,0,0,0)'
//                    },
//                    emphasis:{
//                        barBorderColor:'rgba(0,0,0,0)',
//                        color:'rgba(0,0,0,0)'
//                    }
//                },
                            data:[ydata130,ydata131,ydata132]
                        },
//            {
//                name:'会话数',
//                type:'bar',
//                stack: '总量',
//                itemStyle : { normal: {label : {show: true, position: 'inside'}}},
//                data:[10,20,13]
//            }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart2.setOption(option2);


            },function(){

            })
        };
        queryAccessDataByChannel();

        // //访问数据渠道统计
        // function test(){
        //     httpRequestPost("/api/analysis/access/test",{
        //         "applicationId":$cookieStore.get("applicationId"),
        //         "startTime":$scope.startTime ,
        //         "endTime":$scope.endTime
        //     },function(data){
        //         $scope.dataTopRight = data.data.objs;
        //     },function(){
        //
        //     })
        // };
        // test();

    }
]);