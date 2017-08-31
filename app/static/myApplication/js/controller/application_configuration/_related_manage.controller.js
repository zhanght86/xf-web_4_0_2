/**
 * Description:关联管理 ---》》》 营销知识显示
 * Author: miles
 * Date: 2017/4/28 16:30
 */
angular.module('myApplicationSettingModule').controller('relateManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout) {
        $scope.vm = {
            applicationServiceData : "",   // 本应用服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 5 , //默认每页数量
            dataTotal: "", //节点数据记录总数
            serviceIds : [], //当前选中的关联服务id
            relatedServiceIds : [], //当前选中的被关联的服务id
            searchWord : "", //检索词
            selectServiceId : selectServiceId, //选择关联的服务
            addRelatedService : addRelatedService, //关联服务弹窗
            cancelRelatedService : cancelRelatedService, //取消关联服务弹窗
            listApplicationServiceData : listApplicationServiceData //分页查询本应用的服务
        };

        $scope.other = {
            applicationServiceData : "",   // 其他应用服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 5 , //默认每页数量
            dataTotal: "", //节点数据记录总数
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listApplicationServiceData(1);
        //请求应用本身的服务列表
        function listApplicationServiceData(index){
            httpRequestPost(API_APPLICATION+"/relation/listServiceRelation",{
                "applicationId": APPLICATION_ID,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "searchWord": $scope.vm.searchWord
            },function(data){
                $scope.vm.applicationServiceData = data.data;
                $scope.vm.dataTotal =data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vm.pageSize,//每页记录数
                    pagesLength: 8,//分页框显示数量
                };
                $scope.$apply();
            },function(){
                console.log("请求失败")
            })
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    listApplicationServiceData(current);
                }, 100)

            }
        },true);
        listOtherApplicationServiceData(1) ;
        //请求其他应用本身的服务列表
        function listOtherApplicationServiceData(index){
            httpRequestPost(API_APPLICATION+"/relation/listOtherApplicationService",{
                "applicationId": APPLICATION_ID,
                "index" : (index-1)*$scope.other.pageSize,
                "pageSize": $scope.other.pageSize
            },function(data){
                $scope.other.applicationServiceData = data.data;
                $scope.other.dataTotal =data.total;
                $scope.other.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vm.pageSize,//每页记录数
                    pagesLength: 8,//分页框显示数量
                };
                $scope.$apply();
            },function(){
                console.log("请求失败")
            })
        }
        var timeout2 ;
        $scope.$watch('other.paginationConf.currentPage', function(current){
            if(current){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    listOtherApplicationServiceData(current);
                }, 100)
            }
        },true);

        function addRelatedService(ids){
            if($scope.vm.serviceIds==null||$scope.vm.serviceIds.length==0){
                layer.msg("请选择服务");
            }else{
                $scope.$parent.MASTER.openNgDialog($scope,"/static/myApplication/applicationConfig/relate_manage/add_relate.html","",function(){
                    if($scope.vm.relatedServiceIds==null||$scope.vm.relatedServiceIds.length==0 || !$scope.vm.relatedServiceIds){
                        layer.msg("请选择要关联的服务");
                    }else{
                        httpRequestPost(API_APPLICATION+"/relation/relatedService",{
                            "applicationId" : APPLICATION_ID, //本应用的id
                            "userId": USER_ID,
                            "serviceIds" : $scope.vm.serviceIds, //当前选中的关联服务id
                            "relatedServiceIds" : new Array($scope.vm.relatedServiceIds) //当前选中的被关联的服务id
                        },function(data){
                            if(data.status==200){
                                layer.msg("关联成功");
                                listApplicationServiceData(1);
                            }else{
                                layer.msg("关联出错了");
                            }
                        },function(){
                            console.log("请求失敗");
                        })
                }},function(){
                    $scope.vm.serviceIds=[]; //当前选中的关联服务id
                    $scope.vm.relatedServiceIds=[]; //当前选中的被关联的服务id
                    },"","") ;
            }

        }
        function cancelRelatedService(){
            if($scope.vm.serviceIds==null||$scope.vm.serviceIds.length==0){
                layer.msg("请选择要取消的服务");
            }else{
                var dialog = ngDialog.openConfirm({
                    template:"/static/myApplication/applicationConfig/relate_manage/cancel_relate.html",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){    //关闭回掉
                        if(e === 1){
                            httpRequestPost(API_APPLICATION+"/relation/cancelRelatedService",{
                                "serviceIds" : $scope.vm.serviceIds //当前选中的关联服务id
                            },function(data){
                                if(data.status==200){
                                    layer.msg("取消关联成功");
                                    listApplicationServiceData(1);
                                }else{
                                    layer.msg("取消关联出错了");
                                }
                            },function(){
                                layer.msg("请求失敗");
                            })
                        }
                    }
                });
            }

        }
        //选择关联的服务id
        function selectServiceId(serviceId){
            //if($scope.vm.serviceIds==null){
            //    $scope.vm.serviceIds=[];
            //}
            $scope.vm.serviceIds=[];
            $scope.vm.serviceIds.push(serviceId);
            //var index=$scope.vm.serviceIds.inArray(serviceId);
            //if(!index){
            //    $scope.vm.serviceIds.push(serviceId);
            //}
        }

    }
]);