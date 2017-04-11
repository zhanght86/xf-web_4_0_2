/**
 * Description:节点管理控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 14:52
 */
angular.module('myApplicationSettingModule').controller('nodeManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        setCookie("userId","359873057331875840");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            nodeData : "",   // 节点列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            dataTotal: "", //节点数据记录总数

            addNode : addNode, //添加节点
            editNode : editNode, //编辑节点
            disabledAndEnabledNode : disabledAndEnabledNode, //禁用或者启用节点
            deleteNode : deleteNode, //删除节点
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listNodeData(1);
        //请求节点列表
        function listNodeData(index){
            httpRequestPost("/api/application/node/listNodeByPage",{
                "applicationId": $scope.vm.applicationId,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.nodeData = data.data;
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
                listNodeData(current);
            }
        });


        function editNode(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NodeManageDialog.html",
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



        //添加渠道窗口
        function addNode(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NodeManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/channel/addChannel",{
                            "applicationId": $scope.vm.applicationId,
                            "channelName": $scope.vm.channelName,
                            "statusId": $scope.vm.statusId.statusId,
                            "channelUpdateId": $scope.vm.userId
                        },function(data){
                            if(data.data===10002){
                                layer.msg("渠道重复！");
                                $scope.vm.channelName = "";
                            }else{
                                layer.msg("添加成功");
                                $state.reload()
                            }
                        },function(){
                            layer.msg("添加失敗");
                            $scope.vm.channelName = "";
                        })
                    }else{
                        $scope.vm.channelName = "";
                    }
                }
            });
        }


        //禁用节点
        function disabledAndEnabledNode(nodeCode){
            httpRequestPost("/api/application/node/disabledAndEnabledNode",{
                "nodeCode": nodeCode
            },function(data){
                if(data.status==200){
                    layer.msg(data.info);
                    $state.reload()
                }else{
                    layer.msg("操作失败");
                }
            },function(){
                layer.msg("请求失败");
            })

        }

        //删除节点
        function deleteNode(nodeCode){
            httpRequestPost("/api/application/node/deleteNode",{
                "nodeCode": nodeCode
            },function(data){
                if(data.status==200){
                    layer.msg("删除节点成功");
                    $state.reload()
                }else{
                    layer.msg("删除节点失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }
    }
]);