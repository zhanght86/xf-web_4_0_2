/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  应用信息
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('ApplicationInfoController',
    ['$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog","$cookieStore","$rootScope","$timeout",
    ($scope,localStorageService,ApplicationServer , $state, ngDialog,$cookieStore,$rootScope,$timeout) =>{
        $scope.vm = {
            serviceData : "",   // 发布服务列表数据
            paginationConf : {     //分页条件
                search : listServiceData,
                location : false ,
                pageSize : 5
            }  ,
            applicationInfo : {
                name        :APPLICATION_NAME, //应用名称
                newName     :"" ,
                description : "", //应用描述
                createTime  : "",//创建时间
                license     : "", //应用序列号
                statusId    : "", //应用状态
            } ,
            sceneInfo : {              //场景信息
                knowledgeTypeNum : 6, //知识类型数量
                exchangeModeNum  : 2,//交互方式数量
                businessFrameNum :0,//业务框架数量(默认)
            } ,
            allowSubmit : 1, //是否允许提交
            // listServiceData : listServiceData, //查看服务列表信息
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务
            editName : editName,    //编辑应用
            deleteApplication: deleteApplication, //删除应用
            stopAllServices : stopAllServices //下线应用的所有服务
        };
        //编辑应用的名称
        let changeName = require("../../views/info/dialog_edit_application_name.html") ;
        //查看业务框架数量
        ApplicationServer.viewFrameNumber.save({
            "id": APPLICATION_ID
        },function(response){
            if(response.status==200){
                $scope.vm.sceneInfo.businessFrameNum = response.data.businessFrameNum
            }else{
                console.log("业务框架数量查询失败");
            }
        },function(error){console.log(error)}) ;
        findApplicationInfo(); //查看应用的基本信息
        listServiceData(1);
        //获取服务列表
        function listServiceData(index){
            ApplicationServer.queryServiceList.save({
                "index" : (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(response){
                $scope.vm.serviceData = response.data;
                $scope.vm.paginationConf.totalItems = response.total ;
                $scope.vm.paginationConf.numberOfPages = response.total/$scope.vm.paginationConf.pageSize ;
            },function(error){console.log(error)})
        }
        //发布服务
        function publishService(serviceId){
            ApplicationServer.releaseService.save({
                "id": serviceId,
            },function(response){
                if(response.status==200){
                    layer.msg("发布服务成功");
                    listServiceData(1);
                }else{
                    layer.msg(response.data);
                }
            },function(error){console.log(error)})
        }
        //上线服务
        function startService(serviceId){
            layer.confirm("确认上线？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                layer.close(index);
                ApplicationServer.startService.save({
                    "id": serviceId
                },function(response){
                    if(response.status==200){
                        layer.msg("上线服务成功");
                        listServiceData(1);
                    }else{
                        layer.msg("上线服务失败");
                    }
                },function(error){console.log(error) })
        })}
        //下线服务
        function stopService(serviceId){
            layer.confirm("确认下线？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
               ApplicationServer.downService.save({
                   "id": serviceId
               },function(response){
                   if(response.status==200){
                       layer.msg("下线服务成功");
                       listServiceData(1);
                   }else{
                       layer.msg("下线服务失败");
                   }
               },function(error){console.log(error)})

            });
        }
        //重启服务
        function restartService(serviceId){
            layer.confirm("确认重启？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.restartService.save({
                    "id": serviceId
                },function(response){
                    if(response.status==200){
                        layer.msg("重启服务成功");
                        listServiceData(1);
                    }else{
                        layer.msg("重启服务失败");
                    }
                },function(error){console.log(error) })
            });
        }
        //查看应用信息
        function findApplicationInfo(){
           ApplicationServer.viewApplicationInfo.get({
                "id": APPLICATION_ID
            },function(response){
                if(response.status==200){
                    $scope.vm.applicationInfo = {
                        name :response.data.name, //应用名称
                        description : response.data.description, //应用描述
                        createTime :response.data.createTime,//创建时间
                        license : response.data.license, //应用序列号
                        statusId : response.data.status, //应用状态
                    } ;
                }else{
                    // $state.reload() ;
                }
            },function(error){console.log(error)})
        }
        //编辑应用的名称
        function editName(){
            $scope.vm.applicationInfo.newName = APPLICATION_NAME ; //待编辑的新应用名称
            $scope.$parent.$parent.MASTER.openNgDialog($scope,changeName,"",function(){
                    ApplicationServer.updateApplicationName.save({
                        "id": APPLICATION_ID,
                        "name" : $scope.vm.applicationInfo.newName,
                        "description" : $scope.vm.applicationInfo.description,
                        "license" : $scope.vm.applicationInfo.license ,
                    },function(response){
                        if(response.status==200){
                            $cookieStore.put("applicationName",$scope.vm.applicationInfo.newName) ;
                            APPLICATION_NAME = $scope.vm.applicationInfo.newName ;
                            findApplicationInfo();
                        } ;
                        layer.msg(response.data)
                    },function(error){console.log(error)})
            }) ;
        }
        //下线应用的所有服务
        function stopAllServices(){
            layer.confirm("确认下线所有服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.stopAllService.save({
                },function(data){
                    if(data.status==200){
                        layer.msg("下线所有服务成功");
                        listServiceData(1);
                        findApplicationInfo(); //查看应用的基本信息
                    }else{
                        layer.msg("下线所有服务失败");
                    }
                },function(){console.log(error)})
            });
        }
        //删除应用
        function deleteApplication(){
            layer.confirm("确认删除当前应用？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.removeApplicationServer.save({
                },function(response){
                    if(response.status==200){
                        layer.msg("删除成功");
                        // $state.go("admin.manage");
                    }else{
                        layer.msg("删除失败");
                    }
                },function(error){console.log(error)})
            });
        }
    }
])};