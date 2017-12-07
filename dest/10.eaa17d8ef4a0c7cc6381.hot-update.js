webpackHotUpdate(10,{

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  应用管理模块 ， 加载依赖
	 */
	module.exports = function (angular) {
	    var applicationManagementModule = angular.module('applicationManagementModule', []);
	    //--------------------------------------------------
	    //          controller
	    //--------------------------------------------------
	    // 应用信息
	    __webpack_require__(40)(applicationManagementModule); // 应用信息
	    __webpack_require__(41)(applicationManagementModule); // 备份还原
	    // 应用配置
	    __webpack_require__(42)(applicationManagementModule); // 授权管理
	    __webpack_require__(43)(applicationManagementModule); // 渠道管理
	    __webpack_require__(44)(applicationManagementModule); // 热点知识设置
	    __webpack_require__(45)(applicationManagementModule); // 授权管理
	    __webpack_require__(46)(applicationManagementModule); // 授权管理
	    __webpack_require__(47)(applicationManagementModule); // 授权管理
	    __webpack_require__(48)(applicationManagementModule); // 授权管理
	    // 应用发布
	    __webpack_require__(49)(applicationManagementModule); // 节点管理
	    __webpack_require__(50)(applicationManagementModule); // 发布管理
	    //--------------------------------------------------
	    //          server
	    //--------------------------------------------------
	    __webpack_require__(51)(applicationManagementModule);
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	    __webpack_require__(52)(applicationManagementModule); //  验证服务名称
	    __webpack_require__(53)(applicationManagementModule); // 验证应用名称
	    __webpack_require__(54)(applicationManagementModule); // 验证节点名称
	};

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  备份还原
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('BackupRestoreController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$rootScope", "$timeout", "$log", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $rootScope, $timeout, $log) {
	        $scope.vm = {};
	    }]);
	};

/***/ }),

/***/ 49:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  节点管理
	 */
	angular.module('myApplicationSettingModule').controller('nodeManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout) {
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

/***/ })

})