/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationSettingModule').controller('channelManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId: getCookie("applicationId"),
            channelData : "",   // 渠道数据
            blackListData : "",  //黑名单数据
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            addChannel : addChannel,  //添加渠道
            addBlacklist: addBlacklist, //添加黑名单
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listChannelData(0);
        //console.log($scope.vm.applicationId)
        //请求渠道列表
        function listChannelData(index){
            httpRequestPost("/api/application/channel/listChannelByPage",{
                "applicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.channelData = data.data;
                //console.log(data)
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/$scope.vm.pageSize), //总页数
                    pageSize: 1,//每页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                //console.log(current,$scope.vm.pageSize);
                httpRequestPost("/api/application/channel/listChannelByPage",{
                    "applicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(){
                    listChannelData(current);
                },function(){
                })
            }
        });


        function addChannel(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/channelManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
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
        function addBlacklist(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/blacklistManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
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

      

    }
]);