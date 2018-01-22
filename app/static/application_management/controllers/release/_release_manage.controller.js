/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  发布管理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('ReleaseManageController',
    ['$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog","$cookieStore","$timeout","$location",
    ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$cookieStore,$timeout,$location)=>{
        $scope.vm = {
            serviceList : "",   // 服务列表数据
            paginationConf :{   // 分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : queryServiceList,
                location : true
            }  ,//分页条件
            nodeList : {     //节点数据
                available : [] ,  // 可用的
                using : ""         //自身
            },
            dialogTitle : "",  //对话框标题
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务
            deleteService : deleteService, //删除服务
            addOrEditService : addOrEditService, //发布及编辑服务弹窗
            categoryIds : [], //分类id列表
            channels : [], //渠道id列表
            code : "", //节点编号
            serviceName: "", //服务名称
            serviceStatus : 0, //服务状态
            serviceType : 10, //服务类型
            categoryData : "", //分类数据
            channelData : "", //渠道数据
            botRoot : "",     //根节点
            newCategoryIds : [],  //选中的分类节点
            serviceids:[],
            verifyRelease : verifyRelease, //发布服务校验
            deleteAllService : deleteAllService,   //批量删除服务
            selectAll:selectAll,
            selectSingle:selectSingle
        };
        queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);    // 获取服务列表
        //请求服务列表
        function queryServiceList(index,pageSize){
            ApplicationServer.queryServiceList.save({
                "index" : (index-1)*pageSize,
                "pageSize": pageSize
            },function(response){
                if(response.status == 200&&response.data!=null||response.data.length>0){
                    $scope.vm.serviceList = response.data.data;
                    $scope.vm.paginationConf.totalItems = response.data.total ;
                    $scope.vm.paginationConf.numberOfPages = response.total/pageSize ;
                }else{
                    $scope.vm.serviceList = "";
                    $scope.vm.paginationConf.totalItems = 0 ;
                    $scope.vm.paginationConf.numberOfPages =0 ;
                }
            },function(error){console.log(error)})
        }
     
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        //根据服务id查询服务信息
        function findServiceByServiceId(serviceId){
            $scope.vm.dialogTitle="编辑服务";
            ApplicationServer.queryServiceById.get({
                "id": serviceId
            },function(data){
                if(data.status==200){
                    $scope.vm.code=data.data.nodeCode;//节点编号
                    $scope.vm.serviceName=data.data.name;//服务名称
                    $scope.vm.serviceStatus=data.data.status;//服务状态
                    $scope.vm.serviceType=data.data.serviceType;//服务类型
                    $scope.vm.url=data.data.url;
                     $scope.vm.nodeList.available.push({
                        id:data.data.nodeCode,
                        url:data.data.url,
                     })
                     console.log( $scope.vm.nodeList.available)
                }else{  
                    layer.msg("查询服务失败");
                }
            },function(error){console.log(error) })
        }
        //校验服务发布
        function verifyRelease(){
            if($scope.vm.serviceName==null||$scope.vm.serviceName==""){
                layer.msg("发布服务的名称不能为空!");
                return 0;
            }else if($scope.vm.code==null||$scope.vm.code==""){
                layer.msg("发布服务时未选择发布节点!");
                return 0;
            }else{
                return 1;
            }
        }
        //发布服务
        function publishService(serviceId){
            layer.confirm("确认发布服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index) {
                ApplicationServer.releaseService.save({
                    "id": serviceId,
                }, function (data) {
                    if (data.status == 200) {
                        layer.msg("发布服务成功");
                         queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    } else {
                        layer.msg("发布服务失败");
                    }
                }, function (error) {
                    console.log(error);
                })
            })
        }
        //上线服务
        function startService(serviceId){
            layer.confirm("确认上线服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.startService.save({
                    "id": serviceId
                },function(data){
                    if(data.status==200){
                        layer.msg("上线服务成功");
                         queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    }else{
                        layer.msg("上线服务失败");
                    }
                },function(error){console.log(error);});
            })
        }
        //下线服务
        function stopService(serviceId){
            layer.confirm("确认下线服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
               ApplicationServer.downService.save({
                   "id": serviceId
               },function(response){
                   if(response.status==200){
                       layer.msg("下线服务成功");
                        queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
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
                         queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    }else{
                        layer.msg("重启服务失败");
                    }
                },function(error){console.log(error)});
            })
        }
        //删除服务
        function deleteService(serviceId){
            layer.confirm("确认删除当前服务？",{
                btn:['确认','取消'],
                shade:false
            },function(){
                ApplicationServer.removeService.save({
                    "id": serviceId,
                },function(data){
                    if(data.status==200){
                        layer.msg("删除服务成功");
                         queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    }else{
                        layer.msg("删除服务失败");
                    }
                },function(error){console.log(error)})
            });
        }
        //获取可用节点数据
        function queryAvailableNodeList(){
            ApplicationServer.queryAvailableNodeList.save({
                },function(data){
                    if(data.status==200){
                        console.log(data)
                        angular.forEach(data.data,(val,index)=>{
                            $scope.vm.nodeList.available.push(val)
                        })
                    }else{
                        layer.msg("查询可用节点失败");
                    }
                },function(error){console.log(error)})
        }
        //新增和修改
        function addOrEditService(serviceId,status){
            $scope.vm.nodeList.available.length=0;
            queryAvailableNodeList() ;
            let server_html = require("../../views/release/release_manage/release_service.html") ;
            $scope.vm.allowSubmit=1
            if(!serviceId){   // 新增
                $scope.vm.dialogTitle="发布新服务";
                $scope.vm.serviceId = "" ;
            }else{             //编辑服务
                 $scope.vm.dialogTitle="编辑服务";
                 $scope.vm.serviceId = serviceId ;
                 findServiceByServiceId(serviceId);
            }
            console.log( $scope.vm.nodeList.available)
            
            $scope.$parent.$parent.MASTER.openNgDialog($scope,server_html,"700px",function(){
                var parameter = {
                    "nodeCode" : $scope.vm.code, //节点id
                    "name": $scope.vm.serviceName, //服务名称
                } ;
                if(!serviceId){
                    ApplicationServer.addService.save(parameter,function(data){
                        if(data.status==200){
                            layer.msg("已成功添加服务");
                            queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        }else{
                            layer.msg(data.info);
                        }
                    },function(error){console.log(error);})
                }else{
                    parameter.id = serviceId ;
                    parameter.status = 30002 ;
                    // parameter.remark = "30002" ;
                    ApplicationServer.updateService.save(parameter,function(data){
                        if(data.status==200){
                            layer.msg(data.info);
                             queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        }else{
                            layer.msg(data.info);
                        }
                    },function(error){console.log(error);})
                }
            },"",function(){
                initPublishServiceInput();
            })
        }
        //弹出分类对话框
        //重置弹框内容
        function initPublishServiceInput(){
            $scope.vm.channels=""; //渠道id列表
            $scope.vm.code=""; //节点编号
            $scope.vm.serviceName=""; //服务名称
            $scope.vm.serviceType=""; //服务类型
        }

        //批量删除
        function deleteAllService(){
            if($scope.vm.serviceids.length==0){
               layer.msg("请选择要删除的服务")
               return
            }
            ApplicationServer.removetAllService.save({
               "idList":$scope.vm.serviceids
            },function(data){
              console.log(data)
                  if(data.status==200){
                    queryServiceList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    initBatchTest();  //清空所选
                    layer.msg(data.data);

                  }else{
                    layer.msg("删除失败")
                  }
            })
        }

         //全选
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.serviceids = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.serviceids=[];
                angular.forEach($scope.vm.serviceList,function (val) {
                    $scope.vm.serviceids.push(val.id);
                })
            }
            console.log($scope.vm.serviceids);
        }
        //单选
        function selectSingle(id){
            if($scope.vm.serviceids.inArray(id)){
                $scope.vm.serviceids.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.serviceids.push(id);

            }
            if($scope.vm.serviceList.length==$scope.vm.serviceids.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.serviceids);
            }
            //全选清空
            function initBatchTest(){
                $scope.vm.isSelectAll=false;
                $scope.vm.serviceids=[];

            }
    }
])};