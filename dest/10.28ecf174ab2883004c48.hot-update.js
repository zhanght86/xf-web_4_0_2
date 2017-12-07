webpackHotUpdate(10,{

/***/ 49:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  节点管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('NodeManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout) {
	        $scope.vm = {
	            nodeData: "", // 节点列表数据
	            paginationConf: {
	                pageSize: 5,
	                pagesLength: 8
	            }, //分页条件

	            nodeCode: "", //节点编号
	            nodeId: "", //父级节点id
	            nodeAccessIp: "", //父级节点访问地址
	            statusId: "", //父级节点状态
	            nodeType: "", //父级节点类型
	            nodes: [], //新增子集节点集合
	            newNodes: [], //去除$$hashkey
	            deleteNodes: [], //待删除的子节点
	            delNodes: [], //待删除的子节点去除$$hashkey
	            subNode: "", //子节点的id
	            subNodeAccessIp: "", //子节点的访问地址
	            statusData: "", //节点状态数据
	            typeData: "", //节点类型数据

	            addNode: addNode, //添加节点
	            editNode: editNode, //编辑节点
	            disabledAndEnabledNode: disabledAndEnabledNode, //禁用或者启用节点
	            deleteNode: deleteNode, //删除节点
	            findNodeInfo: findNodeInfo, //查找节点信息

	            listTypeData: listTypeData, //查询节点类型数据
	            listStatusData: listStatusData, //查询状态数据

	            addSubNode: addSubNode, //添加子节点到子节点集合中
	            removeOldSubNode: removeOldSubNode, //从旧的子节点中删除子节点

	            dialogTitle: "", //对话框标题
	            allowSubmit: 0, //是否允许提交
	            errorTip: "", //错误访问地址提示
	            errorNodeIdTip: "" //错误节点id提示
	        };
	        listTypeData(); //查询节点类型数据
	        listStatusData(); //查询状态数据
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        listNodeData(1);
	        //请求节点列表
	        function listNodeData(index) {
	            ApplicationServer.queryNodeList.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vm.paginationConf.pageSize,
	                "pageSize": $scope.vm.paginationConf.pageSize
	            }, function (response) {
	                $scope.vm.nodeData = response.data;
	                $scope.vm.paginationConf.totalItems = response.total;
	                $scope.vm.paginationConf.numberOfPages = response.total / $scope.vm.paginationConf.pageSize;
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    listNodeData(current);
	                }, 100);
	            }
	        }, true);
	        //查询节点的基本信息
	        function findNodeInfo(nodeCode) {
	            return ApplicationServer.queryNodeInfo.save({
	                "nodeCode": nodeCode
	            }, function (response) {
	                if (response.status == 200) {
	                    $scope.vm.nodeId = response.data.nodeId; //父级节点id
	                    $scope.vm.nodeAccessIp = response.data.nodeAccessIp; //父级节点访问地址
	                    $scope.vm.statusId = response.data.statusId; //父级节点状态
	                    $scope.vm.nodeType = response.data.nodeType; //父级节点类型
	                    $scope.vm.nodeCode = response.data.nodeCode; //父级节点编号
	                    $scope.vm.nodes = response.data.nodes; //新增子集节点集合
	                } else {
	                    layer.msg("查询节点信息失败");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //编辑节点弹出框
	        function editNode(nodeCode) {
	            findNodeInfo(nodeCode).$promise.then(function (data) {
	                // !!!! 同步
	                console.log(data);
	                if ($scope.vm.statusId == 60002) {
	                    initNodeInput();
	                    layer.msg("当前节点正在使用中!");
	                } else {
	                    $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/release/node_manage/addOredit_node.html", "550px", function () {
	                        if ($scope.vm.allowSubmit) {
	                            console.log(JSON.stringify($scope.vm.nodes));
	                            angular.forEach($scope.vm.nodes, function (item) {
	                                $scope.vm.newNodes.push({
	                                    nodeId: item.nodeId,
	                                    nodeAccessIp: item.nodeAccessIp,
	                                    nodeCode: item.nodeCode
	                                });
	                                console.log("节点编号" + data1.nodeCode);
	                            });
	                            angular.forEach($scope.vm.deleteNodes, function (item) {
	                                $scope.vm.delNodes.push({
	                                    nodeId: item.nodeId,
	                                    nodeAccessIp: item.nodeAccessIp,
	                                    nodeCode: item.nodeCode
	                                });
	                            });
	                            ApplicationServer.updateNode.save({
	                                "nodeId": $scope.vm.nodeId, //父级节点id
	                                "nodeAccessIp": $scope.vm.nodeAccessIp, //父级节点访问地址
	                                "statusId": $scope.vm.statusId, //父级节点状态
	                                "nodeType": $scope.vm.nodeType, //父级节点类型
	                                "nodes": $scope.vm.newNodes, //新增子集节点集合
	                                "nodeCreateId": USER_ID, //操作用户id
	                                "nodeCode": $scope.vm.nodeCode, //父级节点编号
	                                "deleteNodes": $scope.vm.delNodes, //待删除的子节点
	                                "userId": USER_ID
	                            }, function (data) {
	                                if (data.status == 200) {
	                                    layer.msg("编辑成功");
	                                    listNodeData(1);
	                                } else {
	                                    layer.msg("编辑出错了");
	                                }
	                            }, function (error) {
	                                console.log(error);
	                            });
	                        } else {
	                            layer.msg("访问地址或者节点编号不合法！");
	                        }
	                    }, "", function () {
	                        initNodeInput();
	                    });
	                }
	            });
	        }

	        //添加节点
	        function addNode() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/release/node_manage/addOredit_node.html", "550px", function () {
	                if ($scope.vm.allowSubmit) {
	                    angular.forEach($scope.vm.nodes, function (item) {
	                        $scope.vm.newNodes.push({
	                            nodeId: item.nodeId,
	                            nodeAccessIp: item.nodeAccessIp
	                        });
	                    });
	                    ApplicationServer.addNode.save({
	                        "nodeId": $scope.vm.nodeId == "" ? 0 : $scope.vm.nodeId, //父级节点id
	                        "nodeAccessIp": $scope.vm.nodeAccessIp, //父级节点访问地址
	                        "statusId": $scope.vm.statusId, //父级节点状态
	                        "nodeType": $scope.vm.nodeType, //父级节点类型
	                        "nodes": $scope.vm.newNodes, //新增子集节点集合
	                        "nodeCreateId": USER_ID, //操作用户id
	                        "userId": USER_ID
	                    }, function (data) {
	                        if (data.status == 200) {
	                            layer.msg("添加成功");
	                            listNodeData(1);
	                        } else {
	                            layer.msg("添加出错了！");
	                        }
	                    }, function (error) {
	                        console.log(error);
	                    });
	                } else {
	                    layer.msg("访问地址或者节点编号不合法！");
	                }
	            }, "", function () {
	                initNodeInput();
	            });
	        }

	        //初始化添加节点页面相应的输入值
	        function initNodeInput() {
	            $scope.vm.channelName = "";
	            $scope.vm.nodeId = ""; //父级节点id
	            $scope.vm.nodeAccessIp = ""; //父级节点访问地址
	            $scope.vm.nodes = []; //新增子集节点集合
	            $scope.vm.subNode = ""; //子节点的id
	            $scope.vm.subNodeAccessIp = ""; //子节点的访问地址
	            $scope.vm.nodeCode = ""; //父级节点编号
	        }
	        //查询节点类型数据
	        function listTypeData() {
	            httpRequestPost("/api/application/node/findNodeType", {}, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.typeData = data.data;
	                    $scope.$apply();
	                } else {
	                    layer.msg("查询节点类型失败");
	                }
	            }, function () {
	                layer.msg("请求失败");
	            });
	        }

	        //查询状态数据
	        function listStatusData() {
	            httpRequestPost("/api/application/node/findNodeStatus", {}, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.statusData = data.data;
	                    $scope.$apply();
	                } else {
	                    layer.msg("查询节点类型失败");
	                }
	            }, function () {
	                layer.msg("请求失败");
	            });
	        }

	        //禁用节点
	        function disabledAndEnabledNode(nodeCode, operator) {
	            layer.confirm("确认" + operator + "？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.disableNode.save({
	                    "nodeCode": nodeCode
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg(data.info);
	                        listNodeData(1);
	                    } else {
	                        layer.msg("操作失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }

	        //删除节点
	        function deleteNode(nodeCode) {
	            layer.confirm("确认删除？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                layer.close(index);
	                ApplicationServer.removetNode.save({
	                    "nodeCode": nodeCode
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg("删除节点成功");
	                        listNodeData(1);
	                    } else {
	                        layer.msg("删除节点失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }

	        //从原有的子节点中删除子节点
	        function removeOldSubNode(node) {
	            if (node != null && node.nodeCode != null) {
	                $scope.vm.deleteNodes.push(node);
	            }
	        }
	        //添加子节点信息到子节点集合中并进行校验
	        function addSubNode(nodeId, nodeAccessIp) {
	            if ($scope.vm.nodeAccessIp == nodeAccessIp) {
	                layer.msg("子节点IP与集群节点IP重复了");
	                $scope.vm.allowSubmit = 0;
	                return;
	            }
	            var obj = {};
	            obj.nodeId = nodeId;
	            obj.nodeAccessIp = nodeAccessIp;
	            var repeatFlag = false;
	            if (nodeId != null && nodeAccessIp != null && nodeId != "" && nodeAccessIp != "") {
	                console.log("添加前：" + $scope.vm.nodes);
	                angular.forEach($scope.vm.nodes, function (data1) {
	                    if (data1.nodeId == nodeId && data1.nodeAccessIp == nodeAccessIp) {
	                        repeatFlag = true;
	                    }
	                });
	                if (repeatFlag) {
	                    layer.msg("重复添加了");
	                } else {
	                    httpRequestPost("/api/application/node/checkNode", {
	                        nodeId: nodeId,
	                        nodeAccessIp: nodeAccessIp
	                    }, function (data) {
	                        if (data.status == 200) {
	                            $scope.vm.nodes.push(obj);
	                            $scope.vm.subNodeId = "";
	                            $scope.vm.subNodeAccessIp = "";
	                            $scope.vm.allowSubmit = 1;
	                            $scope.$apply();
	                        } else {
	                            $scope.vm.allowSubmit = 0;
	                            layer.msg(data.info);
	                        }
	                    }, function () {
	                        layer.msg("校验失败");
	                    });
	                }
	            } else {
	                layer.msg("节点信息不能为空");
	            }
	        }
	    }]);
	};

/***/ }),

/***/ 50:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  发布管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('releaseManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", "$interval", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout, $interval) {
	        $scope.vm = {
	            serviceList: "", // 服务列表数据
	            paginationConf: { // 分页条件
	                pageSize: 5,
	                pagesLength: 10
	            }, //分页条件
	            nodeList: { //节点数据
	                available: [], // 可用的
	                using: "" //自身
	            },
	            dialogTitle: "", //对话框标题
	            publishService: publishService, //发布服务
	            startService: startService, //上线服务
	            stopService: stopService, //下线服务
	            restartService: restartService, //重启服务
	            deleteService: deleteService, //删除服务
	            addOrEditService: addOrEditService, //发布及编辑服务弹窗

	            categoryIds: [], //分类id列表
	            channels: [], //渠道id列表
	            nodeCode: "", //节点编号
	            serviceName: "", //服务名称
	            serviceStatus: 0, //服务状态
	            serviceType: 10, //服务类型
	            categoryData: "", //分类数据
	            channelData: "", //渠道数据
	            serviceTypeList: "", //类型数据
	            botRoot: "", //根节点
	            newCategoryIds: [], //选中的分类节点

	            //flagDialog : true, //发布按钮是否可点击，默认不可点击

	            verifyRelease: verifyRelease //发布服务校验
	        };

	        queryServiceTypeList(); //获取发布类型数据
	        queryServiceList(1); // 获取服务列表
	        //请求服务列表
	        function queryServiceList(index) {
	            ApplicationServer.queryServiceList.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vm.paginationConf.pageSize,
	                "pageSize": $scope.vm.paginationConf.pageSize
	            }, function (response) {
	                $scope.vm.serviceList = response.data;
	                $scope.vm.paginationConf.totalItems = response.total;
	                $scope.vm.paginationConf.numberOfPages = response.total / $scope.vm.paginationConf.pageSize;
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //获取发布类型数据
	        function queryServiceTypeList() {
	            ApplicationServer.queryServiceTypeList.save({}, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.serviceTypeList = data.data;
	                } else {
	                    layer.msg("查询服务类型失败");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    queryServiceList(current);
	                }, 100);
	            }
	        }, true);

	        //根据服务id查询服务信息
	        function findServiceByServiceId(serviceId) {
	            $scope.vm.dialogTitle = "编辑服务";
	            ApplicationServer.queryServiceById.save({
	                "serviceId": serviceId
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.categoryIds = data.data.categoryIds; //分类id列表
	                    $scope.vm.newCategoryIds = data.data.categoryIds; //选中的分类初始化
	                    $scope.vm.channels = data.data.channels; //渠道id列表
	                    $scope.vm.nodeCode = data.data.nodeCode; //节点编号
	                    $scope.vm.serviceName = data.data.serviceName; //服务名称
	                    $scope.vm.serviceStatus = data.data.serviceStatus; //服务状态
	                    $scope.vm.serviceType = data.data.serviceType; //服务类型
	                } else {
	                    layer.msg("查询服务失败");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //校验服务发布
	        function verifyRelease() {
	            if ($scope.vm.serviceName == null || $scope.vm.serviceName == "") {
	                layer.msg("发布服务的名称不能为空!");
	                return 0;
	            } else if ($scope.vm.categoryIds == null || $scope.vm.categoryIds.length == 0) {
	                layer.msg("发布服务时未选择分类!");
	                return 0;
	            } else if ($scope.vm.nodeCode == null || $scope.vm.nodeCode == "") {
	                layer.msg("发布服务时未选择发布节点!");
	                return 0;
	            } else if ($scope.vm.serviceType == null || $scope.vm.serviceType == "") {
	                layer.msg("发布服务时未选择发布类型!");
	                return 0;
	            } else {
	                return 1;
	            }
	        }
	        //发布服务
	        function publishService(serviceId) {
	            layer.confirm("确认发布服务？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.releaseService.save({
	                    "serviceId": serviceId,
	                    "applicationId": APPLICATION_ID,
	                    "userId": USER_ID, //获取用户id
	                    "userName": USER_LOGIN_NAME //获取用户名称
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg("发布服务成功");
	                        queryServiceList(1);
	                    } else {
	                        layer.msg("发布服务失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }
	        //上线服务
	        function startService(serviceId) {
	            layer.confirm("确认上线服务？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.startService.save({
	                    "serviceId": serviceId
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg("上线服务成功");
	                        queryServiceList(1);
	                    } else {
	                        layer.msg("上线服务失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }
	        //下线服务
	        function stopService(serviceId) {
	            layer.confirm("确认下线服务？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.downService.save({
	                    "serviceId": serviceId
	                }, function (response) {
	                    if (response.status == 200) {
	                        layer.msg("下线服务成功");
	                        queryServiceList(1);
	                    } else {
	                        layer.msg("下线服务失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }
	        //重启服务
	        function restartService(serviceId) {
	            layer.confirm("确认重启？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.restartService.save({
	                    "serviceId": serviceId
	                }, function (response) {
	                    if (response.status == 200) {
	                        layer.msg("重启服务成功");
	                        queryServiceList(1);
	                    } else {
	                        layer.msg("重启服务失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }
	        //删除服务
	        function deleteService(serviceId) {
	            layer.confirm("确认删除当前服务？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function () {
	                ApplicationServer.removeService.save({
	                    "serviceId": serviceId,
	                    "applicationId": APPLICATION_ID,
	                    "userId": USER_ID, //获取用户id
	                    "userName": USER_LOGIN_NAME //获取用户名称
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg("删除服务成功");
	                        queryServiceList(1);
	                    } else {
	                        layer.msg("删除服务失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }

	        //获取可用节点数据
	        function queryAvailableNodeList() {
	            ApplicationServer.queryAvailableNodeList.save({}, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.nodeList.available = data.data;
	                } else {
	                    layer.msg("查询可用节点失败");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //选择渠道
	        function selectChannel(channelId) {
	            if ($scope.vm.channels == null) {
	                $scope.vm.channels = [];
	            }
	            var index = $scope.vm.channels.inArray(channelId);
	            if (index) {
	                $scope.vm.channels.remove(channelId);
	            } else {
	                $scope.vm.channels.push(channelId);
	            }
	        }
	        //编辑服务
	        function addOrEditService(serviceId) {
	            if (!serviceId) {
	                // 新增
	                $scope.vm.dialogTitle = "发布新服务";
	                $scope.vm.serviceId = "";
	            } else {
	                //编辑服务
	                $scope.vm.dialogTitle = "编辑服务";
	                $scope.vm.serviceId = serviceId;
	                findServiceByServiceId(serviceId);
	            }
	            queryAvailableNodeList();
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/release/release_manage/release_service.html", "700px", function () {
	                var parameter = {
	                    "applicationId": APPLICATION_ID,
	                    "channels": $scope.vm.channels, //渠道id列表
	                    "nodeCode": $scope.vm.nodeCode, //节点编号
	                    "serviceName": $scope.vm.serviceName, //服务名称
	                    "serviceType": $scope.vm.serviceType, //服务类型
	                    "userName": USER_LOGIN_NAME //获取用户名称
	                };
	                if (!serviceId) {
	                    ApplicationServer.addService.save(parameter, function (data) {
	                        if (data.status == 200) {
	                            layer.msg("已成功添加服务");
	                            queryServiceList(1);
	                        } else {
	                            layer.msg("新增服务失败");
	                        }
	                    }, function (error) {
	                        console.log(error);
	                    });
	                } else {
	                    parameter.serviceId = serviceId;
	                    ApplicationServer.updateService.save(parameter, function (data) {
	                        if (data.status == 200) {
	                            layer.msg("服务修改成功");
	                            queryServiceList(1);
	                        } else {
	                            layer.msg("服务修改失败");
	                        }
	                    }, function (error) {
	                        console.log(error);
	                    });
	                }
	            }, "", function () {
	                initPublishServiceInput();
	            });
	        }
	        //弹出分类对话框
	        //重置弹框内容
	        function initPublishServiceInput() {
	            $scope.vm.channels = ""; //渠道id列表
	            $scope.vm.nodeCode = ""; //节点编号
	            $scope.vm.serviceName = ""; //服务名称
	            $scope.vm.serviceType = ""; //服务类型
	        }
	    }]);
	};

/***/ })

})