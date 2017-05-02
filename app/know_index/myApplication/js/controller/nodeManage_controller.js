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
            pageSize : 5 , //默认每页数量
            dataTotal: "", //节点数据记录总数

            nodeCode : "", //节点编号
            nodeId : "", //父级节点id
            nodeAccessIp : "", //父级节点访问地址
            statusId : "", //父级节点状态
            nodeType : "", //父级节点类型
            nodes : [], //新增子集节点集合
            newNodes : [], //去除$$hashkey
            deleteNodes : [], //待删除的子节点
            delNodes : [], //待删除的子节点去除$$hashkey
            subNode : "", //子节点的id
            subNodeAccessIp : "" , //子节点的访问地址
            nodeCreateId : getCookie("userId"), //用户id


            statusData : "", //节点状态数据
            typeData : "", //节点类型数据

            addNode : addNode, //添加节点
            editNode : editNode, //编辑节点
            disabledAndEnabledNode : disabledAndEnabledNode, //禁用或者启用节点
            deleteNode : deleteNode, //删除节点
            findNodeInfo : findNodeInfo, //查找节点信息

            listTypeData : listTypeData, //查询节点类型数据
            listStatusData : listStatusData, //查询状态数据

            addSubNode : addSubNode, //添加子节点到子节点集合中
            removeOldSubNode : removeOldSubNode, //从旧的子节点中删除子节点

            dialogTitle : "",  //对话框标题
            allowSubmit : 1, //是否允许提交
            errorTip : "", //错误访问地址提示
            errorNodeIdTip : "", //错误节点id提示

        };

        listTypeData(); //查询节点类型数据
        listStatusData(); //查询状态数据

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
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vm.pageSize,//每页记录数
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

        //查询节点的基本信息
        function findNodeInfo(nodeCode){
            httpRequestPost("/api/application/node/findNodeInfo",{
                "nodeCode" : nodeCode
            },function(data){
                if(data.status==200){

                    $scope.vm.nodeId = data.data.nodeId;//父级节点id
                    $scope.vm.nodeAccessIp = data.data.nodeAccessIp;//父级节点访问地址
                    $scope.vm.statusId = data.data.statusId; //父级节点状态
                    $scope.vm.nodeType = data.data.nodeType; //父级节点类型
                    $scope.vm.nodeCode = data.data.nodeCode; //父级节点编号
                    $scope.vm.nodes = data.data.nodes; //新增子集节点集合

                    $scope.$apply();
                }else{
                    layer.msg("查询节点信息失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //编辑节点弹出框
        function editNode(nodeCode){
            findNodeInfo(nodeCode);
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NodeManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.allowSubmit){
                            console.log(JSON.stringify($scope.vm.nodes));
                            angular.forEach($scope.vm.nodes,function(data1){
                                var obj = {};
                                obj.nodeId = data1.nodeId;
                                obj.nodeAccessIp = data1.nodeAccessIp;
                                obj.nodeCode = data1.nodeCode;
                                console.log("节点编号"+data1.nodeCode);
                                $scope.vm.newNodes.push(obj);
                            });

                            angular.forEach($scope.vm.deleteNodes,function(data1){
                                var obj = {};
                                obj.nodeId = data1.nodeId;
                                obj.nodeAccessIp = data1.nodeAccessIp;
                                obj.nodeCode = data1.nodeCode;
                                $scope.vm.delNodes.push(obj);
                            });

                            httpRequestPost("/api/application/node/editNode",{
                                "nodeId" : $scope.vm.nodeId, //父级节点id
                                "nodeAccessIp" : $scope.vm.nodeAccessIp, //父级节点访问地址
                                "statusId" : $scope.vm.statusId, //父级节点状态
                                "nodeType" : $scope.vm.nodeType, //父级节点类型
                                "nodes" : $scope.vm.newNodes, //新增子集节点集合
                                "nodeCreateId" : $scope.vm.nodeCreateId, //操作用户id
                                "nodeCode" : $scope.vm.nodeCode, //父级节点编号
                                "deleteNodes" : $scope.vm.delNodes, //待删除的子节点
                                "userId": $scope.vm.nodeCreateId
                            },function(data){
                                if(data.status==200){
                                    layer.msg("编辑成功");
                                    $state.reload();
                                }else{
                                    layer.msg("编辑出错了");
                                }
                            },function(){
                                layer.msg("请求失敗");
                            })
                        }else{
                            layer.msg("访问地址或者节点编号重复了！");
                        }
                    }
                    initNodeInput();
                }
            });
        }

        //添加节点
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
                        if($scope.vm.allowSubmit){
                            angular.forEach($scope.vm.nodes,function(data1){
                                var obj = {};
                                obj.nodeId = data1.nodeId;
                                obj.nodeAccessIp = data1.nodeAccessIp;
                                $scope.vm.newNodes.push(obj);
                            });
                            httpRequestPost("/api/application/node/addNode",{
                                "nodeId" : $scope.vm.nodeId==""?0:$scope.vm.nodeId, //父级节点id
                                "nodeAccessIp" : $scope.vm.nodeAccessIp, //父级节点访问地址
                                "statusId" : $scope.vm.statusId, //父级节点状态
                                "nodeType" : $scope.vm.nodeType, //父级节点类型
                                "nodes" : $scope.vm.newNodes, //新增子集节点集合
                                "nodeCreateId" : $scope.vm.nodeCreateId,  //操作用户id
                                "userId": $scope.vm.nodeCreateId
                            },function(data){
                                if(data.status==200){
                                    layer.msg("添加成功");
                                    $state.reload();
                                }else{
                                    layer.msg("添加出错了！");
                                }
                            },function(){
                                layer.msg("添加失敗");
                            })
                        }else{
                            layer.msg("访问地址或者节点编号重复了！");
                        }
                    }
                    initNodeInput();
                }
            });
        }

        //初始化添加节点页面相应的输入值
        function initNodeInput(){
            $scope.vm.channelName = "";
            $scope.vm.nodeId=""; //父级节点id
            $scope.vm.nodeAccessIp=""; //父级节点访问地址
            $scope.vm.nodes=[]; //新增子集节点集合
            $scope.vm.subNode=""; //子节点的id
            $scope.vm.subNodeAccessIp=""; //子节点的访问地址
            $scope.vm.nodeCode=""; //父级节点编号
        }



        //查询节点类型数据
        function listTypeData(){
            httpRequestPost("/api/application/node/findNodeType",{
            },function(data){
                if(data.status==200){
                    $scope.vm.typeData=data.data;
                    $scope.$apply();
                }else{
                    layer.msg("查询节点类型失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //查询状态数据
        function listStatusData(){
            httpRequestPost("/api/application/node/findNodeStatus",{
            },function(data){
                if(data.status==200){
                    $scope.vm.statusData=data.data;
                    $scope.$apply();
                }else{
                    layer.msg("查询节点类型失败");
                }
            },function(){
                layer.msg("请求失败");
            })
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

        //从原有的子节点中删除子节点
        function removeOldSubNode(node){
            if(node!=null&&node.nodeCode!=null){
                $scope.vm.deleteNodes.push(node);
            }
        }

        //添加子节点信息到子节点集合中并进行校验
        function addSubNode(nodeId,nodeAccessIp){
            if($scope.vm.nodeAccessIp==nodeAccessIp){
                layer.msg("子节点IP与集群节点IP重复了");
                $scope.vm.allowSubmit=0;
                return ;
            }
            var obj = {};
            obj.nodeId = nodeId;
            obj.nodeAccessIp = nodeAccessIp;
            var repeatFlag=false;
            if(nodeId!=null&&nodeAccessIp!=null&&nodeId!=""&&nodeAccessIp!=""){
                console.log("添加前："+$scope.vm.nodes);
                angular.forEach($scope.vm.nodes,function(data1){
                    if(data1.nodeId==nodeId&&data1.nodeAccessIp==nodeAccessIp){
                        repeatFlag=true;
                    }
                });
                if(repeatFlag){
                    layer.msg("重复添加了");
                }else{
                    httpRequestPost("/api/application/node/checkNode",{
                        nodeId : nodeId,
                        nodeAccessIp : nodeAccessIp
                    },function(data){
                        if(data.status==200){
                            $scope.vm.nodes.push(obj);
                            $scope.vm.subNodeId="";
                            $scope.vm.subNodeAccessIp="";
                            $scope.vm.allowSubmit=1;
                            $scope.$apply();
                        }else{
                            $scope.vm.allowSubmit=0;
                            layer.msg(data.info);
                        }
                    },function(){
                        layer.msg("校验失败");
                    })
                }

            }else{
                layer.msg("节点信息不能为空");
            }
        }
    }

]).directive('checkIp', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/api/application/node/checkNode',
                    data:{
                        nodeAccessIp: scope.vm.nodeAccessIp,
                        nodeCode: scope.vm.nodeCode
                    }
                }).success(function(data){
                    if(data.status==200){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                        scope.vm.errorTip=data.info;
                    }
                }).error(function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
}).directive('checkNode', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/api/application/node/checkNode',
                    data:{
                        nodeId: scope.vm.nodeId,
                        nodeAccessIp: scope.vm.nodeAccessIp,
                        nodeCode: scope.vm.nodeCode
                    }
                }).success(function(data){
                    if(data.status==200){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                        scope.vm.errorNodeIdTip=data.info;
                    }
                }).error(function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
});