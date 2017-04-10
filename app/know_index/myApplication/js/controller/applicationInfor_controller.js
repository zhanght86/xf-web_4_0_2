/**
 * Description:应用信息控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 17:16
 */
angular.module('myApplicationSettingModule').controller('applicationInforController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        setCookie("userId","359873057331875840");
        $scope.vm = {
            applicationId: getCookie("applicationId"),
            userId : getCookie("userId"),   //用户id
            serviceData : "",   // 发布服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 3 , //默认每页数量
            dataTotal: "", //发布服务数据记录总数

            sceneId : "", //场景id
            applicationName : "", //应用名称
            applicationDescription : "", //应用描述
            applicationCreateTime : "",//创建时间
            statusId : "", //应用状态

            knowledgeTypeNum : knowledgeTypeNum,//知识类型数量
            exchangeModeNum : exchangeModeNum, //交互方式数量
            businessFrameNum : businessFrameNum, //业务框架数量


            findApplicationInfo : findApplicationInfo, //查找应用信息
            findSceneInfo : findSceneInfo, //查看场景信息
            listServiceData : listServiceData, //查看服务列表信息
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务

            editName : editName,    //编辑应用
            deleteName: deleteName, //删除应用

        };
        findApplicationInfo(); //查看应用的基本信息

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

        //查看应用信息
        function findApplicationInfo(){
            httpRequestPost("/api/application/application/findApplication",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                if(data.status==200){
                    $scope.vm.sceneId =data.data.sceneId; //场景id
                    $scope.vm.applicationName =data.data.applicationName;//应用名称
                    $scope.vm.applicationDescription =data.data.applicationDescription;//应用描述
                    $scope.vm.applicationCreateTime =data.data.applicationCreateTime;//创建时间
                    $scope.vm.statusId =data.data.statusId; //应用状态
                    $scope.$apply();
                }else{
                    layer.msg("查询失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }


            //查看场景信息
        function findSceneInfo(){
            httpRequestPost("/api/application/application/findApplication",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                if(data.status==200){
                    $scope.vm.knowledgeTypeNum =data.data.knowledgeTypeNum; //知识类型数量
                    $scope.vm.exchangeModeNum =data.data.exchangeModeNum;//交互方式数量
                    $scope.vm.businessFrameNum =data.data.businessFrameNum;//业务框架数量
                    $scope.$apply();
                }else{
                    layer.msg("查询失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }


        function editName(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog.html",
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
        function deleteName(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog2.html",
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