/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('satisfactionDegreeController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            getList : getList ,
            listData : null ,   // table 数据

            paginationConf : null ,//分页条件
            pageSize : 5  , //默认每页数量

            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
            dimensionId : null ,
            sendDimensions : [] ,
            sendChannels : [],

            timeType : 0,
            timeStart : $filter('date')(new Date(), 'yyyy-MM-dd'),
            timeEnd : $filter('date')(new Date(), 'yyyy-MM-dd'),

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
            //console.log((index-1)*$scope.vm.pageSize );
            httpRequestPost("/api/analysis/satisfaction/searchList",{
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,
                "applicationId" : $scope.vm.applicationId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,

                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,

                "orderForSatisfactionRate": $scope.vm.orderForSatisfactionRate,

                "orderForSessionNumber": $scope.vm.orderForSessionNumber,

                "orderForUnsatisfiedNumber": $scope.vm.orderForUnsatisfiedNumber,
            },function(data){
                //console.log(data.data);
                $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
                console.log(data)
            },function(){

            })
        };
        //list 分页变化加载数据
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                getList(current);
            }
        });

        function getPieData(){
            httpRequestPost("/api/analysis/satisfaction/chartAndTotal",{
                "applicationId" : $scope.vm.applicationId,
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
                layer.msg("获取满意度失败，请刷新页面")
            });
        }

        init();
        function init(){
            getDimensions();
            getChannel();
            getList(1);
            getPieData()
        }
        //維度

        function  getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.$apply()
                }
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });
        }
        //渠道

        function  getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data;
                    $scope.$apply()
                }
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }

        
    }
]);