/**
 * Description:发布服务管理页面的控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 9:59
 */
angular.module('myApplicationSettingModule').controller('serviceReleaseController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        setCookie("userId","359873057331875840");
        $scope.vm = {
            applicationId: getCookie("applicationId"),
            serviceData : "",   // 服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            dataTotal: "", //发布服务数据记录总数
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务
            deleteService : deleteService, //删除服务

        };


        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listServiceData(1);
        //请求服务列表
        function listServiceData(index){
            httpRequestPost("/api/application/service/listServiceByPage",{
                "applicationId": $scope.vm.applicationId,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.serviceData = data.data;
                console.log($scope.vm.serviceData)
                $scope.vm.dataTotal =data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/$scope.vm.pageSize), //总页数
                    pageSize: 1,//分页框的分组单位
                    pagesLength: 8,//分页框显示数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                listServiceData(current);
            }
        });

        //发布服务
        function publishService(serviceId){
            httpRequestPost("/api/application/service/publishService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("发布服务成功");
                    $state.reload()
                }else{
                    layer.msg("发布服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //上线服务
        function startService(serviceId){
            httpRequestPost("/api/application/service/startService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("上线服务成功");
                    $state.reload()
                }else{
                    layer.msg("上线服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }
        //下线服务
        function stopService(serviceId){
            httpRequestPost("/api/application/service/stopService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("下线服务成功");
                    $state.reload()
                }else{
                    layer.msg("下线服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //重启服务
        function restartService(serviceId){
            httpRequestPost("/api/application/service/restartService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("重启服务成功");
                    $state.reload()
                }else{
                    layer.msg("重启服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //删除服务
        function deleteService(serviceId){
            httpRequestPost("/api/application/service/deleteService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("删除服务成功");
                    $state.reload()
                }else{
                    layer.msg("删除服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }



    }
]);