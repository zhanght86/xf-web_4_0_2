/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('sessionDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        setCookie("applicationId","360619411498860544");
        $scope.vm = {
            applicationId :getCookie("applicationId"),
            scan:scan ,
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
        // 点击查看
        function scan(id){
            getScanData(id,1);
            var dialog = ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/sessionDetailsDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        //获取对应user 的 对话列表
        function getScanData(id,index){
            console.log(index);
            httpRequestPost("/api/analysis/userSession/searchTimeBar",{
                "channelId": $scope.vm.channelId,
                "dimensionId": $scope.vm.dimensionId,

                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeStart,

                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,

                "orderForSessionNumber": $scope.vm.orderForSessionNumber,
                "orderForSessionTime": $scope.vm.orderForSessionTime,
                "userId" : id
            },function(data){
                console.log(id);
                $scope.vm.total = data.data.total/$scope.vm.pageSize;
                $scope.vm.timeList = data.data.objs;
                $scope.$apply();
                console.log(data.data)
            },function(){
            })
        }

        //list 分页变化加载数据
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                getList(current);
            }
        });

        //排序  按会话数量
        $scope.$watch('vm.orderForSessionNumber', function(current){
           console.log(current);
            if(current){
                getList(1)
            }
        });
        //排序 按时间
        $scope.$watch('vm.orderForSessionTime', function(current,old){
            if(current!=old){
                getList(1)
            }
        });
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
        //获取
        function getdetail(sessionId){
            console.log(sessionId);
            httpRequestPost("/api/analysis/userSession/searchTimeBarContent",{
               "sessionId" : sessionId
            },function(data){
                console.log(data)
            },function(err){
                console.log(err)
            })
        }

        $scope.$watch('vm.currentPage', function(current,oldVal){
            if(current!=oldVal){
                getScanData(current);
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