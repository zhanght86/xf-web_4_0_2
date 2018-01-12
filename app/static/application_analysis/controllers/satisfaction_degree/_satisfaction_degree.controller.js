/**
 * Created by Administrator on 2016/6/3.
 * 满意率 控制器
 */
module.exports=applAnalysisModule => {applAnalysisModule
    .controller('satisfactionDegreeController',
     ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
     ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter) => {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            getList : getList ,
            listData : null ,   // table 数据
            paginationConf:{    //分页条件
                pageSize : 5,
                pagesLength : 10
            },
            dimensions : [] ,
            channels : [] ,
            channelId  : 130 ,
           // dimensionId : null ,
            sendDimensions : [] ,
            sendChannels : [],

            timeType : 1,
            timeStart :"",
            timeEnd :"",

            "orderForSessionNumber": null,
            "orderForUnsatisfiedNumber": null,
            "orderForSatisfactionRate": null,

            sotrBySe : sotrBySe ,
            sotrBySa : sotrBySa ,
            sotrBySaRa : sotrBySaRa

        };
        function sotrBySe(){
            $scope.vm.orderForSessionNumber=($scope.vm.orderForSessionNumber?0:1),
            $scope.vm.orderForUnsatisfiedNumber=null,
            $scope.vm.orderForSatisfactionRate=null,
                //console.log($scope.vm.orderForSessionNumber)
            getList(1)
        }
        function sotrBySa(){
            $scope.vm.orderForUnsatisfiedNumber=($scope.vm.orderForUnsatisfiedNumber?0:1),
            $scope.vm.orderForSessionNumber=null,
            $scope.vm.orderForSatisfactionRate=null,
            getList(1)
        }
        function sotrBySaRa(){
            $scope.vm.orderForSatisfactionRate=($scope.vm.orderForSatisfactionRate?0:1),
            $scope.vm.orderForUnsatisfiedNumber=null,
            $scope.vm.orderForSessionNumber=null,
            getList(1)
        }


        /**
         *  获取Echart 图数据
         **/

        function getList(){
             var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            AppAnalysisServer.getPieData.save({
                "channelId": $scope.vm.channelId==130?null:$scope.vm.channelId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
            },function(data){
                layer.close(i);
                console.log(data)
                $scope.vm.listData = data.data;
                var params;
                if(data && data.status == 200 && data.data != null && data.data.length != 0)
                    params = data.data[0];
                else
                    params = {
                        satisfiedNumber: 0,
                        unsatisfiedNumber: 0
                    };
                var myChart = echarts.init(document.getElementById('statistics'));
                // 指定图表的配置项和数据
                var option = {
                    title : {
                        top: '10%',
                        text: '满意率统计',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['满意率','不满意率']
                    },
                    series : [
                        {
                             name:'满意率统计',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:params.satisfiedNumber, name:'满意率'},
                                {value:params.unsatisfiedNumber, name:'不满意率'},
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
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },function(err){
                console.log("获取满意度失败，请刷新页面");
            });
        }

        /**
         * 初始化数据
         **/
        init();
        function init(){
            //getDimensions();
            //getChannel();
            getList(1);
        }

        
    }
])};