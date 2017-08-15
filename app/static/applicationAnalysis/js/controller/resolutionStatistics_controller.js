/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('resolutionStatisticsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            getList : getList ,
            dimensions : [] ,
            channels : [] ,
            channelId  : "" ,
            dimensionId : "" ,
            timeType : 1,
            timeStart : "",
            timeEnd : "",
        };
        //獲取渠道
        $scope.master.getDimensions($scope,["dimensions"]) ;
        //获取维度
        $scope.master.getChannels($scope,["channels"]) ;
        getList() ;
        //表格列表
        function getList(){
            var parameter = {
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "requestTimeType":$scope.vm.timeType,
                "applicationId" : APPLICATION_ID ,
                "index": 0 ,
                "pageSize" : 1000
            } ;
            // 解决率统计图表数据
            httpRequestPost("/api/analysis/solutionStatistics/qaAskSolutionStatistics",parameter,function(data){
                console.log(data) ;
                if(data.status == 10014){
                    var chart = [{value:data.data.noSolutionTotal, name:'未解决'},
                                 {value:data.data.total, name:'解决'}] ;
                    solutionRateChartSet(chart) ;

                }
            },function(error){console.log(error)});
            // 回复数图表数据
            httpRequestPost("/api/analysis/solutionStatistics/qaAskMatchStatistics",parameter,function(data){
                console.log(data) ;
                if(data.status == 10014){
                    specificRateChartSet(data.data.responseOfStandardTotal,data.data.responseOfGreetingTotal,
                                        data.data.sensitiveWordResponseTotal,data.data.repeatQuestionResponseTotal,
                                        data.data.expiredKnowledgeResponseTotal,data.data.unknownQuestionResponseTotal)

                }
            },function(error){console.log(error)});
        }
        var solutionRateChart , specificRateChart  ;
        //初始化两个表格
        void function(){
            //左图
            solutionRateChart = echarts.init(document.getElementById('resolution_echart'));

            //右图
            specificRateChart = echarts.init(document.getElementById('resolution_echart2'));
        }() ;;
        // 解决率统计图表
        function solutionRateChartSet(data){
            solutionRateChart.setOption({
                title : {
                    text: '解决率统计',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
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
        // 回复数图表
        function specificRateChartSet(val1,val2,val3,val4,val5,val6){
            specificRateChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                        //name:'访问来源',
                        type:'pie',
                        radius : ['50%', '70%'],
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
]);