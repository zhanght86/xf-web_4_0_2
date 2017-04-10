/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('satisfactionDegreeController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :getCookie("applicationId"),
            getList : getList ,
            listData : null ,   // table 数据

            paginationConf : null ,//分页条件
            pageSize : 5  , //默认每页数量

            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
            dimensionId : null ,

            timeType : 0,
            timeStart : null,
            timeEnd : null,

            orderForSessionNumber : null,
            orderForSessionTime : null,

            timeList : [],
            getdetail : getdetail,
            currentPage : 1,
            total : null,
            talkDetail : null
        };

        var myChart = echarts.init(document.getElementById('statistics'));
        // 指定图表的配置项和数据
        var option = {
            title : {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
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

        //表格列表
        function getList(index){
            //console.log((index-1)*$scope.vm.pageSize );
            httpRequestPost("/api/analysis/userSession/searchList",{
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,

                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeStart,

                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,

            },function(data){
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

        init();
        function init(){
            getDimensions();
            getChannel();
            getList(1);
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
                //"applicationId": "360619411498860544"
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