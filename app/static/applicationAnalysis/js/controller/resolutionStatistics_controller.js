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
            timeType : 0,
            timeStart : "",
            timeEnd : "",
        };
        //獲取渠道
        $scope.master.getDimensions($scope,["dimensions"]) ;
        //获取维度
        $scope.master.getChannels($scope,["channels"]) ;
        //表格列表
        function getList(index){
            httpRequestPost("/api/analysis/",{
                "startTime": $scope.vm.startTime,
                "endTime": $scope.vm.endTime,
                "operationLogAuthor" : $scope.vm.operationLogAuthor
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){

                    });
                }
            },function(error){console.log(error)});
        }
        var solutionRateChart , specificRateChart  ;
        void function(){
            //左图
            solutionRateChart = echarts.init(document.getElementById('resolution_echart'));

            //右图
            specificRateChart = echarts.init(document.getElementById('resolution_echart2'));
        }() ;
        //getList(1) ;
        chartsSetOption()
        function chartsSetOption(data1,data2){
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
                        data:[
                            {value:500, name:'未解决'},
                            {value:2000, name:'解决'},
                        ],
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
            specificRateChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:['直接回答','推荐回答','引导回答','未知回答','引导成功','敏感词回答']
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
                        name:'访问来源',
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
                            {value:335, name:'直接回答'},
                            {value:310, name:'推荐回答'},
                            {value:234, name:'引导回答'},
                            {value:135, name:'未知回答'},
                            {value:548, name:'引导成功'},
                            {value:1000, name:'敏感词回答'}
                        ]
                    }
                ]
            })
        }
    }
]);