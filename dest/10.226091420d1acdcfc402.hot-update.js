webpackHotUpdate(10,{

/***/ 50:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  发布管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('ReleaseManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", "$interval", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout, $interval) {
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

/***/ }),

/***/ 51:
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/31.
	 * @Module :  应用管理服务
	 */

	module.exports = function (applicationManagementModule) {
	        applicationManagementModule.service("ApplicationServer", ["$resource", function ($resource) {
	                /******************************
	                                  *应用配置*
	                            ********************************/
	                //   渠道管理
	                //请求渠道列表
	                undefined.queryChannelList = $resource(API_APPLICATION + "/channel/listChannelByPage", {}, {});
	                //获取黑名单列表
	                undefined.queryBlacklist = $resource(API_APPLICATION + "/channel/listBlackListByPage", {}, {});
	                //添加黑名单
	                undefined.addBlacklist = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	                //校验黑名单
	                undefined.checkBlackList = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	                //移除黑名单 》》单个批量合并为一个
	                undefined.removeBlacklist = $resource(API_APPLICATION + "/channel/batchDelBlackList", {}, {});
	                //改变渠道状态
	                undefined.changeChannelStatus = $resource(API_APPLICATION + "/channel/changeStatus", {}, {});
	                //   场景管理
	                //获取知识类型
	                undefined.queryKnowTypeList = $resource(API_APPLICATION + "/scene/listKnowledgeTypeByApplicationId", {}, {});
	                //获取交互方式
	                undefined.queryInterviewModeList = $resource(API_APPLICATION + "/scene/listExchangeModeByApplicationId", {}, {});
	                //多轮会话搜索
	                undefined.searchMultipleConversation = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	                //多轮会话设置
	                undefined.storeMultipleConversation = $resource(API_APPLICATION + "/scene/saveMultiInteractiveSetting", {}, {});

	                //   热点知识设置
	                //获取热点知识列表 + 查询       删除 /hotQuestion/getHotQuestionList
	                undefined.queryHotKnowledgeList = $resource(API_APPLICATION + "/hotQuestion/getHotQuestionList", {}, {});
	                //获取知识列表 + 查询                                                                                                      //**********OTHER >>>> API_MS
	                undefined.queryKnowledgeList = $resource(API_MS + "/knowledgeManage/overView/findKnowledgeByApplicationId", {}, {});
	                //添加热点知识
	                undefined.addHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/batchAdd", {}, {});
	                //删除热点知识
	                undefined.removeHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/deleteHotQuestionByIds", {}, {});
	                //上移知识
	                undefined.hotKnowledgeUp = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	                //下移知识
	                undefined.hotKnowledgeDown = $resource(API_APPLICATION + "//hotQuestion/moveDown", {}, {});
	                //置顶知识
	                undefined.hotKnowledgeStick = $resource(API_APPLICATION + "/hotQuestion/moveUp", {}, {});

	                //   参数设置
	                //查看应用参数
	                undefined.queryParameter = $resource(API_APPLICATION + "/application/findApplicationSetting", {}, {});
	                //更新应用参数
	                undefined.updateParameter = $resource(API_APPLICATION + "/application/saveApplicationSetting", {}, {});

	                //   机器人设置
	                //查看机器人参数
	                undefined.queryRobotParameter = $resource(API_APPLICATION + "/application/findRobotSetting", {}, {});
	                //更新机器人参数
	                undefined.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});
	                //保存经典机器人头像
	                undefined.storeClassicalAvatar = $resource(API_APPLICATION + "/application/saveClassicHead", {}, {});
	                //保存自定义机器人头像
	                undefined.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});

	                //  转人工设置
	                //获取列表
	                undefined.manualGetData = $resource(API_APPLICATION + "/artificial/get/setting/" + APPLICATION_ID, {}, {});
	                //修改
	                undefined.manualSaveData = $resource(API_APPLICATION + "/artificial/update", {}, {});

	                /******************************
	                                *应用发布*
	                           ********************************/
	                //发布管理
	                //查看服务列表
	                undefined.queryServiceList = $resource(API_APPLICATION + "/service/listServiceByPage", {}, {});
	                //获取服务类型
	                undefined.queryServiceTypeList = $resource(API_APPLICATION + "/service/listServiceType", {}, {});
	                //获取可用节点
	                undefined.queryAvailableNodeList = $resource(API_APPLICATION + "/node/listNoUsingNode", {}, {});
	                //检查服务名称是否重复
	                undefined.verifyServiceName = $resource(API_APPLICATION + "/service/checkName", {}, {});
	                //通过id查看服务
	                undefined.queryServiceById = $resource(API_APPLICATION + "/service/findServiceById", {}, {});
	                //获取己用节点(通过父节点信息)
	                undefined.queryParentNodeInfo = $resource(API_APPLICATION + "/node/findParentNodeInfo", {}, {});
	                //新增服务
	                undefined.addService = $resource(API_APPLICATION + "/service/addAndPublishService", {}, {});
	                //发布服务
	                undefined.releaseService = $resource(API_APPLICATION + "/service/publishService", {}, {});
	                //更新服务
	                undefined.updateService = $resource(API_APPLICATION + "/service/editService", {}, {});
	                //删除服务
	                undefined.removeService = $resource(API_APPLICATION + "/service/deleteService", {}, {});
	                //上线服务
	                undefined.startService = $resource(API_APPLICATION + "/service/startService", {}, {});
	                //下线服务
	                undefined.downService = $resource(API_APPLICATION + "/service/stopService", {}, {});
	                //重启服务
	                undefined.restartService = $resource(API_APPLICATION + "/service/restartService", {}, {});
	                //节点管理
	                //查看节点列表
	                undefined.queryNodeList = $resource(API_APPLICATION + "/node/listNodeByPage", {}, {});
	                //查询节点的基本信息
	                undefined.queryNodeInfo = $resource(API_APPLICATION + "/node/findNodeInfo", {}, {});
	                //新增节点
	                undefined.addNode = $resource(API_APPLICATION + "/node/addNode", {}, {});
	                //编辑节点
	                undefined.updateNode = $resource(API_APPLICATION + "/node/editNode", {}, {});
	                //下线节点
	                undefined.startNode = $resource(API_APPLICATION + "/node/stopService", {}, {});
	                //禁用节点
	                undefined.disableNode = $resource(API_APPLICATION + "/node/disabledAndEnabledNode", {}, {});
	                //删除节点
	                undefined.removetNode = $resource(API_APPLICATION + "/node/deleteNode", {}, {});
	                //检验节点是否合理
	                undefined.verifyNode = $resource(API_APPLICATION + "/node/checkNode", {}, {});
	                /******************************
	                                *应用信息*
	                          ********************************/
	                //应用信息
	                //校验应用名称
	                undefined.verifyApplicationName = $resource(API_APPLICATION + "/application/checkName", {}, {});
	                ////发布服务
	                //this.releaseService = $resource(API_APPLICATION+"/service/publishService", {}, {});
	                //查看服务列表
	                //this.queryServiceList = $resource(API_APPLICATION+"/service/listServiceByPage", {}, {});
	                //上线服务
	                //this.startService = $resource(API_APPLICATION+"/service/startService", {}, {});
	                ////下线服务
	                //this.downService = $resource(API_APPLICATION+"/service/stopService", {}, {});
	                ////重启服务
	                //this.restartService = $resource(API_APPLICATION+"/service/restartService", {}, {});
	                //下线所有服务
	                undefined.stopAllService = $resource(API_APPLICATION + "/service/stopAllService", {}, {});
	                //查看应用信息
	                undefined.viewApplicationInfo = $resource(API_APPLICATION + "/application/findApplication", {}, {});
	                //查看场景业务框架数量
	                undefined.viewFrameNumber = $resource(API_APPLICATION + "/application/get/frame", {}, {});
	                //修改应用名称
	                undefined.updateApplicationName = $resource(API_APPLICATION + "/application/updateApplication", {}, {});
	                //删除当前应用（当前所有服务）
	                undefined.removeApplication = $resource(API_APPLICATION + "/service/deleteAllServices", {}, {});

	                /******************************
	                                 *应用部分 登录后续部分*
	                          ********************************/
	                //添加应用
	                undefined.addApplication = $resource(API_APPLICATION + "/application/add", {}, {});
	                //编辑应用
	                undefined.updateApplication = $resource(API_APPLICATION + "/application/update", {}, {});
	                //应用名称与授权证书校验
	                undefined.checkApplicationName = $resource(API_APPLICATION + "/application/name/check", {}, {});
	                //查询单个应用
	                undefined.getApplication = $resource(API_APPLICATION + "/application/get/{id}", {}, {});
	                //查询所有应用
	                undefined.queryAllApplication = $resource(API_APPLICATION + "/application/get", {}, {});
	                //查询用户关联应用列表
	                undefined.queryApplicationByUserId = $resource(API_APPLICATION + "/application/get/user", {}, {});
	                // //根据应用id(从cookie获取)列表获取应用名称列表
	                // this.qeuryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	                //根据应用id(从cookie获取)列表获取应用名称列表
	                undefined.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	        }]);
	};

/***/ }),

/***/ 52:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/8.
	 * @Module : 检验服务名称是否重复
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkServiceName', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) {
	                        return;
	                    } else {
	                        ApplicationServer.verifyServiceName.save({
	                            serviceName: scope.vm.serviceName,
	                            serviceId: scope.vm.serviceId
	                        }, function (data) {
	                            if (data.data) {
	                                c.$setValidity('unique', true);
	                                scope.vm.allowSubmit = 1;
	                            } else {
	                                c.$setValidity('unique', false);
	                                scope.vm.allowSubmit = 0;
	                            }
	                        }, function (data) {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                        });
	                    }
	                });
	            }
	        };
	    });
	};

/***/ }),

/***/ 54:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/8.
	 * @Module : 检验节点是否合理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkIp', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyNode.save({
	                        nodeAccessIp: scope.vm.nodeAccessIp,
	                        nodeCode: scope.vm.nodeCode
	                    }, function (data) {
	                        if (data.status == 200) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                            scope.vm.errorTip = data.info;
	                        }
	                    }, function (data) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                    });
	                });
	            }
	        };
	    }).directive('checkNode', function ($http, ApplicationServer) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyNode.save({
	                        nodeId: scope.vm.nodeId,
	                        nodeAccessIp: scope.vm.nodeAccessIp,
	                        nodeCode: scope.vm.nodeCode
	                    }, function (data) {
	                        if (data.status == 200) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                            scope.vm.errorNodeIdTip = data.info;
	                        }
	                    }, function (data) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                    });
	                });
	            }
	        };
	    });
	};

/***/ })

})