/**
 * Description:应用信息控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 17:16
 */
angular.module('myApplicationSettingModule').controller('applicationInforController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore",
    function ($scope,localStorageService, $state, ngDialog,$cookieStore) {
        $scope.vm = {
            applicationId: $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),   //用户id
            serviceData : "",   // 发布服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 3 , //默认每页数量
            dataTotal: "", //发布服务数据记录总数

            sceneId : "", //场景id
            applicationName : "", //应用名称
            applicationNewName : "", //应用新名称
            applicationDescription : "", //应用描述
            applicationCreateTime : "",//创建时间
            applicationLisence : "", //应用序列号
            statusId : "", //应用状态

            knowledgeTypeNum : "",//知识类型数量
            exchangeModeNum : "", //交互方式数量
            businessFrameNum : "", //业务框架数量

            allowSubmit : 1, //是否允许提交


            findApplicationInfo : findApplicationInfo, //查找应用信息
            findSceneInfo : findSceneInfo, //查看场景信息
            listServiceData : listServiceData, //查看服务列表信息
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务

            editName : editName,    //编辑应用
            deleteApplication: deleteApplication, //删除应用
            stopAllServices : stopAllServices, //下线应用的所有服务

        };

        findApplicationInfo(); //查看应用的基本信息

        findSceneInfo(); //查看场景信息
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
                    listServiceData(1);
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
                    listServiceData(1);
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
                    listServiceData(1);
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
                    listServiceData(1);
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
                    $scope.vm.applicationNewName = data.data.applicationName; //待编辑的新应用名称
                    $scope.vm.applicationDescription =data.data.applicationDescription;//应用描述
                    $scope.vm.applicationCreateTime =data.data.applicationCreateTime;//创建时间
                    $scope.vm.statusId =data.data.statusId; //应用状态
                    $scope.vm.applicationLisence = data.data.applicationLisence;  //应用序列号
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
            httpRequestPost("/api/application/application/findSceneInfo",{
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


        //编辑应用的名称
        function editName(){
            $scope.vm.applicationNewName = $scope.vm.applicationName ; //待编辑的新应用名称
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if ($scope.vm.allowSubmit){
                            httpRequestPost("/api/application/application/updateApplication",{
                                "applicationId": $scope.vm.applicationId,
                                "sceneId" : $scope.vm.sceneId,
                                "applicationName" : $scope.vm.applicationNewName,
                                "applicationDescription" : $scope.vm.applicationDescription,
                                "applicationLisence" : $scope.vm.applicationLisence ,
                                "userId" : $scope.vm.userId
                            },function(data){
                                if(data.status==200){
                                    findApplicationInfo();
                                }else{
                                    layer.msg("修改失败");
                                }
                            },function(){
                                layer.msg("请求失败");
                            })
                        }
                    }else{
                        $scope.vm.applicationNewName="";
                    }
                }
            });
        }

        //下线应用的所有服务
        function stopAllServices(){
            httpRequestPost("/api/application/service/stopAllService",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                if(data.status==200){
                    layer.msg("下线所有服务成功");
                    listServiceData(1);
                    findApplicationInfo(); //查看应用的基本信息
                }else{
                    layer.msg("下线所有服务失败")
                }
            },function(){
                layer.msg("请求失败")
            })
        }

        //删除应用
        function deleteApplication(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/service/deleteAllServices",{
                            "applicationId": $scope.vm.applicationId
                        },function(data){
                            if(data.status==200){
                                layer.msg("删除成功");
                                $state.go("admin.manage");
                            }else{
                                layer.msg("删除失败");
                            }
                        },function(){
                            layer.msg("请求失败");
                        })
                    }
                }
            });
        }
      

    }
]).directive('checkName', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/api/application/application/checkName',
                    data:{
                        applicationId: scope.vm.applicationId,
                        applicationName: scope.vm.applicationNewName
                    }
                }).success(function(data){
                    if(data.data){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                    }
                }).error(function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
});