/**
 * Created by Administrator on 2016/6/3.
 * 满意率 控制器
 */
angular.module('applAnalysisModule').controller('satisfactionDegreeController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
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
            channelId  : null ,
            dimensionId : null ,
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
        //表格列表
        function getList(index){
            //console.log((index-1)*$scope.vm.paginationConf.pageSize );
            getPieData();

            AppAnalysisServer.satisfactionGetList.save({
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "applicationId" : APPLICATION_ID,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "orderForSatisfactionRate": $scope.vm.orderForSatisfactionRate,
                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForUnsatisfiedNumber": $scope.vm.orderForUnsatisfiedNumber,
            },function(data){
                //console.log(data.data);
                $scope.vm.listData = data.data.objs;
                // $scope.vm.paginationConf = {
                //     currentPage: index,//当前页
                //     totalItems: Math.ceil(data.data.total/5), //总条数
                //     pageSize: 1,//第页条目数
                //     pagesLength: 8,//分页框数量
                // };
                $scope.vm.paginationConf.currentPage =index ;
                $scope.vm.paginationConf.totalItems =data.data.total ;
                $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                console.log($scope.vm.paginationConf);
                console.log(data)
            },function(err){
                $log.log(err);
            });
        };
        //list 分页变化加载数据
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                getList(current);
            }
        });
        //获取Echart 图数据
        function getPieData(){

            AppAnalysisServer.getPieData.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
            },function(data){
                var params;
                if(data && data.status == 200 && data.data != null && data.data.length != 0)
                    params = data.data.objs[0];
                else
                    params = {
                        satisfiedNumber: 0,
                        unsatisfiedNumber: 0
                    };
                var myChart = echarts.init(document.getElementById('statistics'));
                // 指定图表的配置项和数据
                var option = {
                    title : {
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

        init();
        function init(){
            //getDimensions();
            //getChannel();
            getList(1);
            getPieData()
        }

        
    }
]);