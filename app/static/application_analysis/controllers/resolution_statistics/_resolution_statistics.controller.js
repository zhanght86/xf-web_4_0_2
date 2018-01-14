/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=applAnalysisModule => {applAnalysisModule
    .controller('resolutionStatisticsController',
     ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter) => {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            getList : getList ,
            dimensions : [] ,
            channels : [] ,
            channelId  : "" ,
           // dimensionId : "" ,
            timeType : 1,
            timeStart : "",
            timeEnd : "",
        };
       
        /**
         * 表格列表
         **/
        getList() ;
        function getList(){
            var i = layer.msg('资源加载中',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            var parameter = {
                "channelId": $scope.vm.channelId,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "requestTimeType":$scope.vm.timeType,
            } ; 
            // 解决率统计图表数据
            AppAnalysisServer.solveStatistics.save(parameter
                ,function(data){
                    layer.close(i);
                    console.log(data) ;
                    if(data.status == 200&&data.data!=null){
                        var chart = [{value:data.data.noSolutionTotal, name:'未解决'},
                                     {value:data.data.solutionTotal, name:'解决'}] ;
                        solutionRateChartSet(chart) ;

                    }
                },function(err){
                    layer.close(i);
                    $log.log(err);
                }
            );

            // 回复数图表数据
            AppAnalysisServer.matchStatistics.save(parameter
                ,function(data){
                    layer.close(i);
                    console.log(data) ;
                   if(data.status == 200&&data.data!=null){
                        specificRateChartSet(data.data.responseOfStandardTotal,
                                            data.data.responseOfGreetingTotal,
                                            data.data.sensitiveWordResponseTotal,
                                            data.data.repeatQuestionResponseTotal,
                                            data.data.expiredKnowledgeResponseTotal,
                                            data.data.unknownQuestionResponseTotal)

                    }else{
                        specificRateChartSet("","","","","","")
                    }
                },function(err){
                    layer.close(i);
                    $log.log(err);
                }
            );
        }
        var solutionRateChart , specificRateChart  ;

        /**
         * 初始化两个表格
         **/
        void function(){
            //左图
            solutionRateChart = echarts.init(document.getElementById('resolution_echart'));

            //右图
            specificRateChart = echarts.init(document.getElementById('resolution_echart2'));
        }() ;;

        /**
         * 问答解决率统计图表 Echart
         **/
        function solutionRateChartSet(data){
            solutionRateChart.setOption({
                title : {
                    top: '10%',
                    text: '解决率统计',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                  toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'center',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['未解决','解决']
                },
                series : [
                    {  
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }) ;
        }

        /**
         * 问答匹配数图表   Echart
         **/
        function specificRateChartSet(val1,val2,val3,val4,val5,val6){
            specificRateChart.setOption({
                title : {
                    top: '10%',
                    text: '问答匹配详情',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                grid: {
                    left: '1%',
                    right: '35%',
                    top: '5%',
                    bottom: '6%',
                    containLabel: true
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:['标准回答数','寒暄回复数','敏感词回复数','重复问题回复数','过去知识回复数','未知问题回复数']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'center',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                series : [
                    {
                        name:'问答匹配详情',
                        type:'pie',
                         center: ['50%', '58%'],
                        radius : ['40%', '60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '14',
                                        fontWeight : ''
                                    }
                                }
                            }
                        },
                        data:[
                            {value:val1, name:'标准回答数'},
                            {value:val2, name:'寒暄回复数'},
                            {value:val3, name:'敏感词回复数'},
                            {value:val4, name:'重复问题回复数'},
                            {value:val5, name:'过去知识回复数'},
                            {value:val6, name:'未知问题回复数'}
                        ]
                    }
                ]
            })
        }
    }
])};