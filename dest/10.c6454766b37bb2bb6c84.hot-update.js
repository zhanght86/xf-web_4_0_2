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
	    __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../controllers/info/_backup_restore.controller\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(applicationManagementModule); // 备份还原
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

/***/ 40:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  应用信息
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('ApplicationInfoController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$rootScope", "$timeout", "$log", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $rootScope, $timeout, $log) {
	        $scope.vm = {
	            serviceData: "", // 发布服务列表数据
	            paginationConf: {
	                pageSize: 5, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            applicationInfo: {
	                applicationName: APPLICATION_NAME, //应用名称
	                applicationDescription: "", //应用描述
	                applicationCreateTime: "", //创建时间
	                applicationLisence: "", //应用序列号
	                statusId: "" //应用状态
	            },
	            sceneInfo: { //场景信息
	                knowledgeTypeNum: 6, //知识类型数量
	                exchangeModeNum: 2, //交互方式数量
	                businessFrameNum: 0 //业务框架数量(默认)
	            },
	            allowSubmit: 1, //是否允许提交

	            findApplicationInfo: findApplicationInfo, //查找应用信息
	            findSceneInfo: findSceneInfo, //查看场景信息
	            listServiceData: listServiceData, //查看服务列表信息
	            publishService: publishService, //发布服务
	            startService: startService, //上线服务
	            stopService: stopService, //下线服务
	            restartService: restartService, //重启服务

	            editName: editName, //编辑应用
	            deleteApplication: deleteApplication, //删除应用
	            stopAllServices: stopAllServices //下线应用的所有服务
	        };
	        findApplicationInfo(); //查看应用的基本信息
	        findSceneInfo(); //查看场景信息
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        listServiceData(1);
	        //请求服务列表
	        function listServiceData(index) {
	            ApplicationServer.queryServiceList.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vm.paginationConf.pageSize,
	                "pageSize": $scope.vm.paginationConf.pageSize
	            }, function (response) {
	                $scope.vm.serviceData = response.data;
	                $scope.vm.paginationConf.totalItems = response.total;
	                $scope.vm.paginationConf.numberOfPages = response.total / $scope.vm.paginationConf.pageSize;
	            }, function (error) {
	                $log.log(error);
	            });
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    listServiceData(current);
	                }, 100);
	            }
	        }, true);
	        //发布服务
	        function publishService(serviceId) {
	            ApplicationServer.releaseService.save({
	                "serviceId": serviceId,
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID, //获取用户id
	                "userName": USER_LOGIN_NAME //获取用户名称
	            }, function (response) {
	                if (response.status == 200) {
	                    layer.msg("发布服务成功");
	                    listServiceData(1);
	                } else {
	                    layer.msg("发布服务失败");
	                }
	            }, function (error) {
	                $log.log(error);
	            });
	        }
	        //上线服务
	        function startService(serviceId) {
	            layer.confirm("确认上线？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                layer.close(index);
	                ApplicationServer.startService.save({
	                    "serviceId": serviceId
	                }, function (response) {
	                    if (response.status == 200) {
	                        layer.msg("上线服务成功");
	                        listServiceData(1);
	                    } else {
	                        layer.msg("上线服务失败");
	                    }
	                }, function (error) {
	                    $log.log(error);
	                });
	            });
	        };
	        //下线服务
	        function stopService(serviceId) {
	            layer.confirm("确认下线？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.downService.save({
	                    "serviceId": serviceId
	                }, function (response) {
	                    if (response.status == 200) {
	                        layer.msg("下线服务成功");
	                        listServiceData(1);
	                    } else {
	                        layer.msg("下线服务失败");
	                    }
	                }, function (error) {
	                    $log.log(error);
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
	                        listServiceData(1);
	                    } else {
	                        layer.msg("重启服务失败");
	                    }
	                }, function (error) {
	                    $log.log(error);
	                });
	            });
	        }
	        //查看应用信息
	        function findApplicationInfo(applicationId) {
	            ApplicationServer.viewApplicationInfo.save({
	                "applicationId": APPLICATION_ID
	            }, function (response) {
	                if (response.status == 200) {
	                    $scope.vm.applicationInfo = {
	                        applicationName: response.data.applicationName, //应用名称
	                        applicationDescription: response.data.applicationDescription, //应用描述
	                        applicationCreateTime: response.data.applicationCreateTime, //创建时间
	                        applicationLisence: response.data.applicationLisence, //应用序列号
	                        statusId: response.data.statusId //应用状态
	                    };
	                    $cookieStore.put("applicationName", response.data.applicationName);
	                    APPLICATION_NAME = response.data.applicationName;
	                } else {
	                    layer.msg("查询失败");
	                }
	            }, function (error) {
	                $log.log(error);
	            });
	        }
	        //查看业务框架数量
	        function findSceneInfo() {
	            ApplicationServer.viewFrameNumber.save({
	                "applicationId": APPLICATION_ID
	            }, function (response) {
	                if (response.status == 200) {
	                    $scope.vm.sceneInfo.businessFrameNum = response.data.businessFrameNum;
	                } else {
	                    console.log("业务框架数量查询失败");
	                }
	            }, function (error) {
	                $log.log(error);
	            });
	        }
	        //编辑应用的名称
	        function editName() {
	            $scope.vm.applicationNewName = APPLICATION_NAME; //待编辑的新应用名称
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/info/edit_application_name.html", "", function () {
	                if ($scope.vm.allowSubmit) {
	                    ApplicationServer.updateApplicationName.save({
	                        "applicationId": APPLICATION_ID,
	                        "applicationName": $scope.vm.applicationNewName,
	                        "applicationDescription": $scope.vm.applicationInfo.applicationDescription,
	                        "applicationLisence": $scope.vm.applicationInfo.applicationLisence
	                    }, function (response) {
	                        if (response.status == 200) {
	                            $cookieStore.put("applicationName", $scope.vm.applicationNewName);
	                            APPLICATION_NAME = $scope.vm.applicationNewName;
	                            findApplicationInfo();
	                            layer.msg("信息修改成功");
	                        } else {
	                            layer.msg("修改失败");
	                        }
	                    }, function (error) {
	                        $log.log(error);
	                    });
	                }
	            });
	        }
	        //下线应用的所有服务
	        function stopAllServices() {
	            layer.confirm("确认下线所有服务？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.stopAllService.save({
	                    "applicationId": APPLICATION_ID
	                }, function (data) {
	                    if (data.status == 200) {
	                        layer.msg("下线所有服务成功");
	                        listServiceData(1);
	                        findApplicationInfo(); //查看应用的基本信息
	                    } else {
	                        layer.msg("下线所有服务失败");
	                    }
	                }, function () {
	                    $log.log(error);
	                });
	            });
	        }
	        //删除应用
	        function deleteApplication() {
	            layer.confirm("确认删除当前应用？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                ApplicationServer.removeApplication.save({
	                    "applicationId": APPLICATION_ID,
	                    "userId": USER_ID, //获取用户id
	                    "userName": USER_LOGIN_NAME //获取用户名称
	                }, function (response) {
	                    if (response.status == 200) {
	                        layer.msg("删除成功");
	                        $state.go("admin.manage");
	                    } else {
	                        layer.msg("删除失败");
	                    }
	                }, function (error) {
	                    $log.log(error);
	                });
	            });
	        }
	    }]);
	};

/***/ }),

/***/ 42:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  授权管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('AuthorizationManagementController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", '$http', "$cookieStore", "$rootScope", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $http, $cookieStore, $rootScope) {
	        $scope.vm = {};
	    }]);
	};

/***/ }),

/***/ 43:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  渠道管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('ChannelManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout) {
	        //渠道管理
	        $scope.vm = {
	            channelData: "", // 渠道数据
	            paginationConf: "", //分页条件
	            pageSize: 3, //默认每页数量
	            channelDataTotal: "", //渠道数据记录总数
	            //addChannel : addChannel,  //添加渠道
	            //editChannel : editChannel, //编辑渠道
	            //delChannel : delChannel, //删除渠道
	            changeChannel: changeChannel, //修改渠道状态
	            //channelName : "",  //渠道名称
	            //statusId : "",  //状态
	            //channelStatus : "",
	            //dialogTitle : "" //对话框标题
	            simpleOperateTitle: ""
	        };
	        // 黑名单管理
	        $scope.vmo = {
	            blackListData: "", //黑名单数据
	            paginationConf: "", //分页条件
	            pageSize: 2, //默认每页数量
	            blackListDataTotal: "", //黑名单数据记录总数
	            addBlacklist: addBlacklist, //添加黑名单
	            removeBlacklist: removeBlacklist, //批量移除黑名单
	            //channelList : "", //渠道列表
	            blackListIdentify: "", //黑名单标识
	            blackListRemark: "", //黑名单备注
	            channelId: "", //渠道id
	            addBlackListCheck: addBlackListCheck,
	            selectedList: [], //已选择黑名单 ,
	            isSelectedAll: false,
	            selectAll: selectAll, //全部加入黑名单
	            selectSingle: selectSingle
	        };

	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        listChannelData(1);
	        //请求渠道列表
	        function listChannelData(index) {
	            ApplicationServer.queryChannelList.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                $scope.vm.channelData = data.data;
	                $scope.vm.channelDataTotal = data.total;
	                console.log(Math.ceil(data.total / $scope.vm.pageSize));
	                $scope.vm.paginationConf = {
	                    currentPage: index, //当前页
	                    totalItems: data.total, //总记录数
	                    pageSize: $scope.vm.pageSize, //每页记录数
	                    pagesLength: 8 //分页框显示数量
	                };
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
	                    listChannelData(current);
	                }, 100);
	            }
	        }, true);
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        listBlackListData(1);
	        //请求黑名单列表
	        function listBlackListData(index) {
	            ApplicationServer.queryBlacklist.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vmo.pageSize,
	                "pageSize": $scope.vmo.pageSize
	            }, function (data) {
	                $scope.vmo.blackListData = data.data;
	                $scope.vmo.blackListDataTotal = data.total;
	                $scope.vmo.paginationConf = {
	                    currentPage: index, //当前页
	                    totalItems: data.total, //总记录数
	                    pageSize: $scope.vmo.pageSize, //每页记录数
	                    pagesLength: 8 //分页框显示数量
	                };
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        var timeout2;
	        $scope.$watch('vmo.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout2) {
	                    $timeout.cancel(timeout2);
	                }
	                timeout2 = $timeout(function () {
	                    initBlackList();
	                    listBlackListData(current);
	                }, 100);
	            }
	        }, true);
	        //修改渠道状态
	        function changeChannel(channelId, statusId) {
	            $scope.vm.simpleOperateTitle = statusId == 50001 ? "确定要启用吗" : "确定要禁用吗";
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/base/public_html/simple_operate.html", "300px", function () {
	                ApplicationServer.changeChannelStatus.save({
	                    "channelId": channelId
	                }, function (response) {
	                    if (response.data === 10000) {
	                        layer.msg("状态修改成功");
	                        listChannelData(1);
	                    } else if (data.status == 12008) {
	                        layer.msg("存在是指使用该渠道，请修改知识后操作");
	                    } else {
	                        layer.msg("状态修改失败");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }
	        //全选
	        function selectAll() {
	            if (!$scope.vmo.isSelectedAll) {
	                $scope.vmo.isSelectedAll = true;
	                $scope.vmo.selectedList = [];
	                angular.forEach($scope.vmo.blackListData, function (item) {
	                    $scope.vmo.selectedList.push(item.blackListId);
	                });
	            } else {
	                $scope.vmo.isSelectedAll = false;
	                $scope.vmo.selectedList = [];
	            }
	        }
	        // 黑名单单个添加删除
	        function selectSingle(id) {
	            if ($scope.vmo.selectedList.inArray(id)) {
	                $scope.vmo.selectedList.remove(id);
	                $scope.vmo.isSelectedAll = false;
	            } else {
	                $scope.vmo.selectedList.push(id);
	            }
	            if ($scope.vmo.selectedList.length == $scope.vmo.blackListData.length) {
	                $scope.vmo.isSelectedAll = true;
	            }
	        }
	        //添加黑名单
	        function addBlacklist() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/config/channel_manage/add_blacklist.html", "500px", function () {
	                ApplicationServer.addBlacklist.save({
	                    "applicationId": APPLICATION_ID,
	                    "blackListIdentify": $scope.vmo.blackListIdentify,
	                    "blackListRemark": $scope.vmo.blackListRemark,
	                    "blackListUpdateId": USER_ID,
	                    "channelId": $scope.vmo.channelId
	                }, function (data) {
	                    $scope.vmo.blackListRemark = "";
	                    $scope.vmo.isSelectedAll = false;
	                    $scope.vmo.blackListIdentify = "";
	                    layer.msg("添加成功");
	                    if ($scope.vmo.selectedList.length == $scope.vmo.pageSize) {
	                        $scope.vmo.selectedList.pop();
	                        $scope.vmo.isSelectedAll = false;
	                    }
	                    listBlackListData(1);
	                }, function () {
	                    initBlackBackUp();
	                });
	            }, initBlackBackUp);
	        }
	        //檢測是否合理黑名单内容是否合理
	        function addBlackListCheck() {
	            if (!$scope.vmo.blackListIdentify) {
	                layer.msg("请填写正确的ip标识");
	            } else {
	                ApplicationServer.checkBlackList.save({
	                    "applicationId": APPLICATION_ID,
	                    "blackListIdentify": $scope.vmo.blackListIdentify,
	                    "channelId": $scope.vmo.channelId
	                }, function (data) {
	                    //类名重複
	                    if (data.data === 10002) {
	                        layer.msg("黑名单重复！");
	                        initBlackBackUp();
	                    } else {
	                        if (data.data === 10003) {
	                            layer.msg("黑名单IP不合法！");
	                            initBlackBackUp();
	                        } else {
	                            ngDialog.closeAll(1);
	                        }
	                    }
	                });
	            }
	        }
	        //移除黑名单
	        function removeBlacklist(blackListIds) {
	            if (blackListIds.length == 0) {
	                layer.msg("请选择要删除的黑名单!");
	            } else {
	                $scope.vm.simpleOperateTitle = "确定要删除吗";
	                $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/base/public_html/simple_operate.html", "300px", function () {
	                    ApplicationServer.removeBlacklist.save({
	                        "applicationId": APPLICATION_ID,
	                        "blackListIds": blackListIds
	                    }, function (data) {
	                        if (data.data === 10000) {
	                            initBlackList();
	                            layer.msg("移除成功");
	                            listBlackListData(1);
	                        } else {
	                            layer.msg("移除失败");
	                        }
	                    }, function (error) {
	                        console.log(error);
	                    });
	                });
	            }
	        }
	        //黑名单列表选择删除
	        function initBlackList() {
	            $scope.vmo.selectedList = [];
	            $scope.vmo.isSelectedAll = false;
	        }
	        // 黑名单 添加 数据初始化
	        function initBlackBackUp() {
	            $scope.vmo.blackListIdentify = "";
	            $scope.vmo.blackListRemark = "";
	        }

	        //获取所有的渠道
	        //(function getChannelList(){
	        //    httpRequestPost("api/application/channel/listChannels",{
	        //        "applicationId": APPLICATION_ID
	        //    },function(data){
	        //        $scope.vmo.channelList = data.data;
	        //    },function(){
	        //        console.log("请求失败")
	        //    })
	        //})();
	        //获取状态列表
	        //(function getStatusList(){
	        //    httpRequestPost("/api/application/channel/listStatus",{
	        //        "applicationId": APPLICATION_ID
	        //    },function(data){
	        //        $scope.vm.channelStatus = data.data;
	        //    },function(){
	        //        console.log("请求失败")
	        //    })
	        //})() ;

	        //添加渠道窗口
	        //function addChannel(){
	        //    var dialog = ngDialog.openConfirm({
	        //        template:"/static/myApplication/applicationConfig/channelManageDialog.html",
	        //        scope: $scope,
	        //        closeByDocument:false,
	        //        closeByEscape: true,
	        //        showClose : true,
	        //        backdrop : 'static',
	        //        preCloseCallback:function(e){    //关闭回掉
	        //            if(e === 1){
	        //                if($scope.vm.channelName==null||$scope.vm.channelName==""){
	        //                    layer.msg("渠道名称不能为空！");
	        //                    return ;
	        //                }
	        //                httpRequestPost("/api/application/channel/addChannel",{
	        //                    "applicationId": APPLICATION_ID,
	        //                    "channelName": $scope.vm.channelName,
	        //                    "statusId": $scope.vm.statusId.statusId,
	        //                    "channelUpdateId": USER_ID
	        //                },function(data){          //类名重複
	        //                    if(data.data===10002){
	        //                        layer.msg("渠道重复！");
	        //                        $scope.vm.channelName = "";
	        //                    }else{
	        //                        if(data.data===10001){
	        //                            layer.msg("添加出错了！");
	        //                        }else{
	        //                            layer.msg("添加成功");
	        //                            //$state.reload();
	        //                            listChannelData(1);
	        //                        }
	        //                    }
	        //                },function(){
	        //                    layer.msg("添加失敗");
	        //                    $scope.vm.channelName = "";
	        //                })
	        //            }else{
	        //                $scope.vm.channelName = "";
	        //            }
	        //        }
	        //    });
	        //}


	        //修改渠道
	        //function editChannel(item){
	        //    $scope.vm.dialogTitle="编辑渠道";
	        //    $scope.vm.channelName = item.channelName;
	        //    console.log($scope.vm.channelStatus);
	        //    for(var i in $scope.vm.channelStatus){
	        //        if($scope.vm.channelStatus[i].statusId==item.statusId){//获取选中项.
	        //            $scope.vm.statusId =$scope.vm.channelStatus[i];
	        //            break;
	        //        }
	        //    }
	        //    addDialog(singleEdit,item);
	        //}

	        //编辑弹窗，添加公用
	        //function addDialog(callback,item){
	        //    var dialog = ngDialog.openConfirm({
	        //        template:"/static/myApplication/applicationConfig/channelManageDialog.html",
	        //        scope: $scope,
	        //        closeByDocument:false,
	        //        closeByEscape: true,
	        //        showClose : true,
	        //        backdrop : 'static',
	        //        preCloseCallback:function(e){    //关闭回掉
	        //            if(e === 1){
	        //                callback(item)
	        //            }else{
	        //                $scope.vm.channelName = "";
	        //            }
	        //        }
	        //    });
	        //}

	        //编辑事件
	        //function singleEdit(item){
	        //    if($scope.vm.channelName==null||$scope.vm.channelName==""){
	        //        layer.msg("渠道名称不能为空！");
	        //        return ;
	        //    }
	        //    httpRequestPost("/api/application/channel/editChannel",{
	        //        "channelId": item.channelId,
	        //        "applicationId": APPLICATION_ID,
	        //        "channelName": $scope.vm.channelName,
	        //        "statusId": $scope.vm.statusId.statusId,
	        //        "channelUpdateId": USER_ID
	        //    },function(data){
	        //        if(data.data==10002){
	        //            layer.msg("渠道名称重复");
	        //        }else{
	        //            if(data.data==10000){
	        //                layer.msg("编辑成功");
	        //                //$state.reload();
	        //                listChannelData(1);
	        //            }else{
	        //                layer.msg("编辑失败")
	        //            }
	        //        }
	        //    },function(){
	        //        console.log("编辑失败")
	        //    })
	        //}

	        //删除渠道
	        //function delChannel(channelId){
	        //    httpRequestPost("/api/application/channel/delChannel",{
	        //        "channelId": channelId
	        //    },function(data){
	        //        if(data.data==10000){
	        //            layer.msg("删除成功");
	        //            //$state.reload();
	        //            listChannelData(1);
	        //        }else{
	        //            layer.msg("删除失败")
	        //        }
	        //    },function(){
	        //        layer.msg("请求失败")
	        //    })
	        //}
	    }]);
	};

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * Created by mileS on 2017/3/28.
	 * Describe ： 热点知识设置
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('HotKnowledgeSetupController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", "$timeout", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore, $timeout) {
	        $scope.vm = {
	            //热点知识
	            hotKnowList: "", // 热点知识 数据
	            hotQuestionTitle: "", // 热点知识搜索标题
	            simpleOperateTitle: "确定删除选中的热点知识", // 删除热点知识弹框标题
	            hotPaginationConf: { // 热点知识分页
	                pageSize: 5, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            hotKnowDelIds: [], //要删除热点知识的 id 集合
	            isAllHotKnowSelected: false, //热点知识是否全选
	            addHotHotKnow: addHotHotKnow, //添加方法
	            queryHotKnowledgeList: queryHotKnowledgeList, //获取热点知识列表
	            setFlag: false, // 设置手动设置开关
	            toTop: toTop, //知识置顶
	            move: move, //知识上移
	            down: down, //知识下移
	            selectSingleHotKnow: selectSingleHotKnow, // 单独选择热点知识
	            selectAllHotKnow: selectAllHotKnow, //热点知识全选
	            removeHotKnowledge: removeHotKnowledge, //删除知识
	            //所有知识
	            knowledgeList: "", //知识数据
	            knowledgeTitle: "", //知识搜索标题
	            knowPaginationConf: { //添加弹框知识分页
	                pageSize: 5,
	                pagesLength: 8
	            },
	            isAllKnowSelected: false, //是否全选
	            selectedKnow: [],
	            queryKnowledgeList: queryKnowledgeList, // 知识列表弹框
	            selectAllKnow: selectAllKnow, // 全选
	            selectSingleKnow: selectSingleKnow // 单独添加
	        };
	        function selectAllKnow(ev) {
	            //var self = $(ev.target);
	            if (!$scope.vm.isAllHotKnowSelectedDialog) {
	                $scope.vm.isAllHotKnowSelectedDialog = true;
	                $scope.vm.seleceAddAll = [];
	                angular.forEach($scope.vm.knowledgeList, function (item, index) {
	                    $scope.vm.seleceAddAll.push({
	                        chatKnowledgeId: item.knowledgeId,
	                        chatKnowledgeTopic: item.knowledgeTitle,
	                        index: index
	                    });
	                });
	            } else {
	                $scope.vm.isAllHotKnowSelectedDialog = false;
	                $scope.vm.seleceAddAll = [];
	            }
	            //console.log( $scope.vm.seleceAddAll);
	        }
	        //function deleteDialog(item){
	        //    $scope.vm.seleceAddAll.remove(item);
	        //    $(".selectAllBtnDialog").prop("checked",false);
	        //    $(".selectSingle").eq(item.index).attr("checked",false);
	        //}

	        function selectSingleKnow(ev, id, name, index) {
	            var self = $(ev.target);
	            var prop = self.prop("checked");
	            console.log(prop);
	            var obj = {};
	            console.log(id, name);
	            obj.chatKnowledgeId = id;
	            obj.chatKnowledgeTopic = name;
	            obj.index = index;
	            if (!prop) {
	                angular.forEach($scope.vm.seleceAddAll, function (item, index) {
	                    if (id == item.chatKnowledgeId) {
	                        $scope.vm.seleceAddAll.splice(index, 1);
	                    }
	                });
	                //$scope.vm.seleceAddAll.remove(obj);
	                $(".selectAllBtnDialog").prop("checked", false);
	            } else {
	                $(".selectAllBtnDialog").prop("checked", false);
	                $scope.vm.seleceAddAll.push(obj);
	            }
	        }
	        function selectAllHotKnow() {
	            if (!$scope.vm.isAllHotKnowSelected) {
	                $scope.vm.isAllHotKnowSelected = true;
	                $scope.vm.hotKnowDelIds = [];
	                angular.forEach($scope.vm.hotKnowList, function (item) {
	                    $scope.vm.hotKnowDelIds.push(item.hotQuestionId);
	                });
	            } else {
	                $scope.vm.isAllHotKnowSelected = false;
	                $scope.vm.hotKnowDelIds = [];
	            }
	        }
	        function selectSingleHotKnow(id) {
	            if ($scope.vm.hotKnowDelIds.inArray(id)) {
	                $scope.vm.hotKnowDelIds.remove(id);
	                $scope.vm.isAllHotKnowSelected = false;
	            } else {
	                $scope.vm.hotKnowDelIds.push(id);
	            }
	            // 是否触发全选按钮
	            if ($scope.vm.hotKnowDelIds.length == $scope.vm.hotKnowList.length) {
	                $scope.vm.isAllHotKnowSelected = true;
	            }
	        }
	        queryHotKnowledgeList(1);
	        //加载热点知识列表
	        function queryHotKnowledgeList(index) {
	            ApplicationServer.queryHotKnowledgeList.save({
	                index: (index - 1) * $scope.vm.hotPaginationConf.pageSize,
	                pageSize: $scope.vm.hotPaginationConf.pageSize,
	                applicationId: APPLICATION_ID,
	                hotQuestionTitle: $scope.vm.hotQuestionTitle
	            }, function (response) {
	                if (response.status == 10005) {
	                    layer.msg("查询记录为空");
	                    $scope.vm.hotPaginationConf.totalItems = 0;
	                } else {
	                    $scope.vm.hotKnowList = response.data.hotQuestionList;
	                    $scope.vm.hotPaginationConf.totalItems = response.data.total;
	                    $scope.vm.hotPaginationConf.numberOfPages = response.data.total / $scope.vm.hotPaginationConf.pageSize;
	                }
	                initHotKnowSelected();
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        queryKnowledgeList(1);
	        //从聊天知识库查询知识
	        function queryKnowledgeList(index) {
	            ApplicationServer.queryKnowledgeList.save({
	                applicationId: APPLICATION_ID,
	                knowledgeTitle: $scope.vm.knowledgeTitle,
	                pageSize: $scope.vm.knowPaginationConf.pageSize,
	                index: (index - 1) * $scope.vm.knowPaginationConf.pageSize
	            }, function (response) {
	                if (response.data.total == 0) {
	                    layer.msg("查询记录为空");
	                    $scope.vm.knowledgeList = [];
	                    $scope.vm.knowPaginationConf.totalItems = 0;
	                } else {
	                    $scope.vm.knowledgeList = response.data.objs;
	                    $scope.vm.knowPaginationConf.totalItems = response.data.total;
	                    $scope.vm.knowPaginationConf.numberOfPages = response.data.total / $scope.vm.knowPaginationConf.pageSize;
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        var timeout;
	        $scope.$watch('vm.hotPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    queryHotKnowledgeList(current);
	                }, 100);
	            }
	        }, true);
	        var timeout2;
	        $scope.$watch('vm.knowPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout2) {
	                    $timeout.cancel(timeout2);
	                }
	                timeout2 = $timeout(function () {
	                    queryKnowledgeList(current);
	                }, 100);
	            }
	        }, true);
	        //hotQuestionTitle
	        //删除知识
	        function removeHotKnowledge() {
	            if ($scope.vm.hotKnowDelIds == 0) {
	                layer.msg("请选择要删除的知识！");
	            } else {
	                $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/base/public_html/simple_operate.html", "300px", function () {
	                    ApplicationServer.removeHotKnowledge.save({
	                        applicationId: APPLICATION_ID,
	                        ids: $scope.vm.hotKnowDelIds
	                    }, function (data) {
	                        //$state.reload();
	                        if (data.status == 10013) {
	                            $scope.vm.isAllHotKnowSelected = false;
	                            $state.reload();
	                            layer.msg("删除成功");
	                        } else {
	                            layer.msg("删除失败");
	                        }
	                    }, function (error) {
	                        console.log(error);
	                    });
	                });
	            }
	        }

	        //知识置顶
	        function toTop(item) {
	            ApplicationServer.hotKnowledgeStick.save({
	                applicationId: APPLICATION_ID,
	                hotQuestionId: item.hotQuestionId,
	                hotQuestionOrder: item.hotQuestionOrder
	            }, function (response) {
	                queryHotKnowledgeList(1);
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //知识上移
	        function move(item) {
	            ApplicationServer.hotKnowledgeUp.save({
	                applicationId: APPLICATION_ID,
	                hotQuestionId: item.hotQuestionId,
	                hotQuestionOrder: item.hotQuestionOrder
	            }, function (response) {
	                queryHotKnowledgeList(1);
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        //知识下移
	        function down(item) {
	            ApplicationServer.hotKnowledgeDown.save({
	                applicationId: APPLICATION_ID,
	                hotQuestionId: item.hotQuestionId,
	                hotQuestionOrder: item.hotQuestionOrder
	            }, function (response) {
	                queryHotKnowledgeList(1);
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //添加知识
	        function addHotHotKnow() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/config/hot_knowledge_setup/add_hot_knowledge.html", "700px", function () {
	                console.log($scope.vm.seleceAddAll);
	                ApplicationServer.addHotKnowledge.save({
	                    applicationId: APPLICATION_ID,
	                    userId: USER_ID,
	                    hotKnowledgeList: $scope.vm.seleceAddAll
	                }, function (response) {
	                    if (response.status == 10012) {
	                        layer.msg("该知识已经存在,请重新添加!");
	                    } else {
	                        queryHotKnowledgeList(1);
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            }, function () {
	                //取消的同时清空数据
	                $scope.vm.selectAllCheckDialog = false;
	                $scope.vm.seleceAddAll = [];
	                $scope.vm.knowledgeList = [];
	                $scope.vm.knowledgeTitle = "";
	                $scope.vm.knowPaginationConf = '';
	            });
	        }
	        //重置已选择的热点知识
	        function initHotKnowSelected() {
	            $scope.vm.hotKnowDelIds = [];
	            $scope.vm.isAllHotKnowSelected = false;
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  转人工
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('ManualSettingController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", '$http', "$cookieStore", "$rootScope", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $http, $cookieStore, $rootScope) {
	        $scope.vm = {
	            id: '', //返回的id
	            workStartTime: '', //开始时间
	            workEndTime: '', //结束时间
	            commandOn: 0, //人工命令开关 Int
	            noAnswerOn: 0, //机器人未直接回答  Int
	            noAnswerNumber: 0, //机器人未直接回答次数 Int
	            showTip: showTip,
	            hideTip: hideTip,
	            getData: getData,
	            saveData: saveData,
	            checkNum: checkNum

	        };

	        /**
	        ***输入框只能输入正整数
	        **/
	        function checkNum() {
	            var num = $scope.vm.noAnswerNumber;
	            var re = /^\d*$/;
	            if (!re.test(num)) {
	                $scope.vm.noAnswerNumber = 0;
	            }
	        }

	        getData();

	        /**
	        *** 获取时分秒
	        **/
	        function add0(m) {
	            return m < 10 ? '0' + m : m;
	        }

	        function format(shijianchuo) {
	            // ijianchuo是整数，否则要parseInt转换
	            var time = new Date(shijianchuo);
	            var h = time.getHours();
	            var m = time.getMinutes();
	            var s = time.getSeconds();
	            return add0(h) + ':' + add0(m) + ':' + add0(s);
	        }

	        /**
	        *** 获取数据
	        **/
	        function getData() {
	            ApplicationServer.manualGetData.save({
	                // applicationId : APPLICATION_ID
	            }, function (data) {
	                console.log(data);
	                if (data.status == 10000) {
	                    $scope.vm.workStartTime = format(data.data[0].workStartTime);
	                    $scope.vm.workEndTime = format(data.data[0].workEndTime);
	                    $scope.vm.commandOn = data.data[0].commandOn;
	                    $scope.vm.noAnswerOn = data.data[0].noAnswerOn;
	                    $scope.vm.noAnswerNumber = data.data[0].noAnswerNumber;
	                    $scope.vm.id = data.data[0].id;
	                }
	            }, function (err) {
	                console.log(err);
	            });
	            if ($scope.vm.noAnswerOn == 0) {
	                $scope.vm.noAnswerNumber = 0;
	            }
	        }
	        function saveData() {
	            if (!$scope.vm.noAnswerOn) {
	                $scope.vm.noAnswerNumber = 0;
	            }
	            ApplicationServer.manualSaveData.save({
	                "applicationId": APPLICATION_ID,
	                "id": $scope.vm.id,
	                "command": $scope.vm.commandOn,
	                "workStartTime": $scope.vm.workStartTime,
	                "workEndTime": $scope.vm.workEndTime,
	                "noAnswer": $scope.vm.noAnswerOn,
	                "noAnswerNumber": $scope.vm.noAnswerNumber

	            }, function (data) {
	                if (data.status == 10018) {
	                    layer.msg('修改成功');
	                } else {
	                    layer.msg(data.info);
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	        //提示文字
	        function showTip(ev) {
	            var event = ev.target;
	            $(event).addClass("on").next("span").show();
	        }
	        function hideTip(ev) {
	            var event = ev.target;
	            $(event).removeClass("on").next("span").hide();
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 46:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/6.
	 * @Module :  参数设置 控制器
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller("ParameterSetupController", ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", '$http', "$cookieStore", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $http, $cookieStore) {
	        $scope.vm = {
	            settingCommentOn: 1, //评价开关
	            settingDataTimeoutLimit: "", //获取数据时间
	            settingGreetingOn: 1, //寒暄开关
	            settingGreetingThreshold: "", //寒暄阈值
	            settingId: "", //应用参数id
	            settingLowerLimit: "", //下限阈值
	            settingRecommendNumber: "", //推荐问题数量
	            settingRelateNumber: "", //关联问题数量
	            settingTurnRoundOn: 1, //话轮识别开关
	            settingUpperLimit: "", //上限阈值
	            updateParameter: updateParameter, //更新应用参数
	            queryParameter: queryParameter, //查询应用参数
	            turnOn: turnOn, //开关函数
	            parameterLimit: parameterLimit
	        };
	        function parameterLimit(type, val) {
	            // type 0   lt1
	            //type 1    0-1
	            if (type) {
	                if ($scope.vm[val] < 1) {
	                    $scope.vm[val] = 1;
	                }
	            } else {
	                if ($scope.vm[val] > 1) {
	                    $scope.vm[val] = 1;
	                } else if ($scope.vm[val] < 0) {
	                    $scope.vm[val] = 0;
	                }
	            }
	        }
	        //查看应用参数设置
	        queryParameter();
	        //查看机器人参数
	        function queryParameter() {
	            ApplicationServer.queryParameter.save({
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                if (data.data === 10005) {
	                    $scope.vm.settingCommentOn = 1; //评价开关
	                    $scope.vm.settingDataTimeoutLimit = ""; //获取数据时间
	                    $scope.vm.settingGreetingOn = 1; //寒暄开关
	                    $scope.vm.settingGreetingThreshold = ""; //寒暄阈值
	                    $scope.vm.settingId = ""; //应用参数id
	                    $scope.vm.settingLowerLimit = ""; //下限阈值
	                    $scope.vm.settingRecommendNumber = ""; //推荐问题数量
	                    $scope.vm.settingRelateNumber = ""; //关联问题数量
	                    $scope.vm.settingTurnRoundOn = 1; //话轮识别开关
	                    $scope.vm.settingUpperLimit = ""; //上限阈值
	                } else {
	                    $scope.vm.settingCommentOn = data.data.settingCommentOn; //评价开关
	                    $scope.vm.settingDataTimeoutLimit = data.data.settingDataTimeoutLimit; //获取数据时间
	                    $scope.vm.settingGreetingOn = data.data.settingGreetingOn; //寒暄开关
	                    $scope.vm.settingGreetingThreshold = data.data.settingGreetingThreshold; //寒暄阈值
	                    $scope.vm.settingId = data.data.settingId; //应用参数id
	                    $scope.vm.settingLowerLimit = data.data.settingLowerLimit; //下限阈值
	                    $scope.vm.settingRecommendNumber = data.data.settingRecommendNumber; //推荐问题数量
	                    $scope.vm.settingRelateNumber = data.data.settingRelateNumber; //关联问题数量
	                    $scope.vm.settingTurnRoundOn = data.data.settingTurnRoundOn; //话轮识别开关
	                    $scope.vm.settingUpperLimit = data.data.settingUpperLimit; //上限阈值
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        //编辑应用参数
	        function updateParameter() {
	            ApplicationServer.updateParameter.save({
	                "applicationId": APPLICATION_ID,
	                "settingCommentOn": $scope.vm.settingCommentOn,
	                "settingDataTimeoutLimit": $scope.vm.settingDataTimeoutLimit,
	                "settingGreetingOn": $scope.vm.settingGreetingOn,
	                "settingGreetingThreshold": $scope.vm.settingGreetingThreshold,
	                "settingId": $scope.vm.settingId,
	                "settingLowerLimit": $scope.vm.settingLowerLimit,
	                "settingRecommendNumber": $scope.vm.settingRecommendNumber,
	                "settingRelateNumber": $scope.vm.settingRelateNumber,
	                "settingTurnRoundOn": $scope.vm.settingTurnRoundOn,
	                "settingUpdateId": USER_ID,
	                "settingUpperLimit": $scope.vm.settingUpperLimit
	            }, function (data) {
	                if (data.status === 200) {
	                    layer.msg("保存成功");
	                } else {
	                    layer.msg("保存失敗");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //开关
	        function turnOn(targetValue, targetName) {
	            $scope.vm[targetName] = targetValue ? 0 : 1;
	        }
	    }]);
	};

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * Created by dinfo on 2017/3/28.
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('RobotSetupController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", '$http', "$cookieStore", "$rootScope", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $http, $cookieStore, $rootScope) {
	        $scope.vm = {
	            classicHead: ['touxiang1.png', 'touxiang2.png', 'touxiang3.png', 'touxiang4.png', 'touxiang5.png', 'touxiang6.png', 'touxiang7.png', 'touxiang8.png'], //经典头像列表
	            //imgUrl : "", //文件服务器地址
	            robotExpire: "", //时间到期回复
	            robotHead: "", //头像
	            newRobotHead: "", //新的头像
	            robotHotQuestionTimeout: "", //热点问题更新频率
	            robotLearned: "", //学到新知识回答
	            robotName: "", //名称
	            robotRepeat: "", //重复问答回复
	            robotRepeatNumber: "", //重复问答次数
	            robotSensitive: "", // 敏感问答回复
	            robotTimeout: "", //超时提示回复
	            robotTimeoutLimit: "", //超时时长
	            robotUnknown: "", //未知问答回复
	            robotWelcome: "", //欢迎语
	            settingId: "", //机器人参数ID

	            editRobot: editRobot, //编辑机器人参数
	            queryRobotParameter: queryRobotParameter, //查询机器人参数
	            addClassic: addClassic, //弹出经典头像对话框
	            addCustom: addCustom, //弹出自定义头像对话框
	            myFile: "", //上传的图片
	            //x : "", //坐标x
	            //y : "", //坐标y
	            //w : "", //截取的宽度
	            //h : "", //截取的高度
	            isHeadPicSize: isHeadPicSize //头像大小是否合格 1Mb
	        };
	        //弹出经典头像对话框
	        function addClassic() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/config/robot_setup/add_classical_avatar.html", "", function () {
	                ApplicationServer.storeClassicalAvatar.save({
	                    "robotHead": $scope.vm.newRobotHead,
	                    "settingId": $scope.vm.settingId
	                }, function (data) {
	                    if (data.status === 200) {
	                        layer.msg("修改头像成功");
	                        $state.reload();
	                    } else {
	                        layer.msg("修改头像失敗");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            });
	        }

	        //确定头像 大小检测
	        function isHeadPicSize() {
	            var file = document.querySelector('input[type=file]').files[0];
	            console.log(file);
	            //if(!file){
	            //    layer.msg("请选择要上传的头像")
	            //}else if(file.size>1024){
	            //    layer.msg("头像尺寸不能超过1Mb")
	            //}else{
	            ngDialog.closeAll(1);
	            //}
	        }
	        //弹出自定义头像对话框
	        function addCustom() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/config/robot_setup/add_custom_avatar.html", "500px", function () {
	                var file = document.querySelector('input[type=file]').files[0];
	                //if(file.size>1024){
	                //    layer.msg("头像尺寸不能超过1Mb")
	                //}else{
	                var fd = new FormData();
	                //var file =$scope.vm.myFile
	                fd.append('file', file);
	                fd.append('settingId', $scope.vm.settingId);
	                fd.append('x', $('#x').val());
	                fd.append('y', $('#y').val());
	                fd.append('w', $('#w').val());
	                fd.append('h', $('#h').val());
	                console.log(fd);
	                $http({
	                    method: 'POST',
	                    url: "/api/application/application/uploadHead",
	                    data: fd,
	                    headers: { 'Content-Type': undefined },
	                    transformRequest: angular.identity
	                }).success(function (response) {
	                    if (response.status == 200) {
	                        layer.msg("修改头像成功");
	                        //$state.go("setting.vm");
	                        $state.reload();
	                    } else {
	                        layer.msg("上传头像失敗");
	                    }
	                });
	            });
	        }
	        queryRobotParameter();
	        //查看机器人参数
	        function queryRobotParameter() {
	            ApplicationServer.queryRobotParameter.save({
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                //类名重複
	                if (data.data === 10005) {
	                    $scope.vm.robotExpire = ""; //过期知识回答
	                    $scope.vm.robotHead = ""; //头像
	                    $scope.vm.robotHotQuestionTimeout = ""; //热点问题更新频率
	                    $scope.vm.robotLearned = ""; //学到新知识回答
	                    $scope.vm.robotName = ""; //名称
	                    $scope.vm.robotRepeat = ""; //重复问答回复
	                    $scope.vm.robotRepeatNumber = ""; //重复问答次数
	                    $scope.vm.robotSensitive = ""; // 敏感问答回复
	                    $scope.vm.robotTimeout = ""; //超时提示回复
	                    $scope.vm.robotTimeoutLimit = ""; //超时时长
	                    $scope.vm.robotUnknown = ""; //未知问答回复
	                    $scope.vm.robotWelcome = ""; //欢迎语
	                    $scope.vm.settingId = ""; //机器人参数ID
	                    $scope.vm.newRobotHead = ""; //新的头像
	                    //$scope.vm.imgUrl =""; //文件服务器地址
	                } else {
	                    $scope.vm.robotExpire = data.data.robotExpire; //过期知识回答
	                    $scope.vm.robotHead = data.data.robotHead; //头像
	                    //$scope.vm.imgUrl = data.data.imgUrl; //文件服务器地址
	                    $scope.vm.robotHotQuestionTimeout = data.data.robotHotQuestionTimeout; //热点问题更新频率
	                    $scope.vm.robotLearned = data.data.robotLearned; //学到新知识回答
	                    $scope.vm.robotName = data.data.robotName; //名称
	                    $scope.vm.robotRepeat = data.data.robotRepeat; //重复问答回复
	                    $scope.vm.robotRepeatNumber = data.data.robotRepeatNumber; //重复问答次数
	                    $scope.vm.robotSensitive = data.data.robotSensitive; // 敏感问答回复
	                    $scope.vm.robotTimeout = data.data.robotTimeout; //超时提示回复
	                    $scope.vm.robotTimeoutLimit = data.data.robotTimeoutLimit; //超时时长
	                    $scope.vm.robotUnknown = data.data.robotUnknown; //未知问答回复
	                    $scope.vm.robotWelcome = data.data.robotWelcome; //欢迎语
	                    $scope.vm.settingId = data.data.settingId; //机器人参数ID
	                    $scope.vm.newRobotHead = data.data.robotHead; //新的头像
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //编辑机器人参数
	        function editRobot(flag) {
	            if (flag) {
	                ApplicationServer.updateRobotParameter.save({
	                    "robotUpdateId": USER_ID,
	                    "applicationId": APPLICATION_ID,
	                    "robotExpire": $scope.vm.robotExpire,
	                    "robotHead": $scope.vm.robotHead,
	                    "robotHotQuestionTimeout": $scope.vm.robotHotQuestionTimeout,
	                    "robotLearned": $scope.vm.robotLearned,
	                    "robotName": $scope.vm.robotName,
	                    "robotRepeat": $scope.vm.robotRepeat,
	                    "robotRepeatNumber": $scope.vm.robotRepeatNumber,
	                    "robotSensitive": $scope.vm.robotSensitive,
	                    "robotTimeout": $scope.vm.robotTimeout,
	                    "robotTimeoutLimit": $scope.vm.robotTimeoutLimit,
	                    "robotUnknown": $scope.vm.robotUnknown,
	                    "robotWelcome": $scope.vm.robotWelcome,
	                    "settingId": $scope.vm.settingId
	                }, function (data) {
	                    if (data.status === 200) {
	                        layer.msg("保存成功");
	                        //$state.reload();
	                    } else {
	                        layer.msg("保存失敗");
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            }
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 48:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  场景管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('SceneManageController', ['$scope', 'localStorageService', "ApplicationServer", "$state", "ngDialog", "$cookieStore", function ($scope, localStorageService, ApplicationServer, $state, ngDialog, $cookieStore) {
	        $scope.vm = {
	            showType: 0, // 0 知识类型  1 交互 方式
	            sceneId: $cookieStore.get("sceneId"), // 场景id
	            wordsForKnowType: "", //知识类型检索条件
	            wordsInterviewMode: "", //交互方式检索条件
	            //exchangeModeId: "", //交互方式的Id
	            //knowledgeTypeId: "", //知识类型的Id
	            //statusId: "", //状态

	            knowledgeTypeData: "", //知识类型列表
	            exchangeModeData: "", //交互方式列表
	            queryKnowledgeType: queryKnowledgeType, //查询知识类型
	            queryInterviewMode: listExchangeMode, //查询交互方式

	            //updateKnowledgeType:  updateKnowledgeType, //禁用或者启用知识类型
	            //updateExchangeMode: updateExchangeMode, //禁用或者启用交互方式
	            //saveMultiInteractive: saveMultiInteractive,  //多轮交互设置
	            //findMultiInteractive: findMultiInteractive, //查询多轮交互设置
	            multipleConversationSetup: multipleConversationSetup, //多轮交互设置

	            //turnOn : turnOn,//开关函数
	            //turnOn2 : turnOn2,
	            //
	            multipleConversation: { // 多轮会话配置项
	                settingId: "", //配置id
	                categoryFuzzyOn: 1, //类目模糊开关
	                recommendedSimilarity: 0.5, //推荐问相似度
	                subjectMissingOn: 1, //主题缺失开关
	                subjectMemoryRounds: 3, //主题记忆轮数
	                memoryMethod: 1, //记忆方法
	                elementMissingOn: 1, //要素缺失开关
	                elementRecommendationOrder: 1, //要素推荐顺序
	                nonZeroStartOn: 1, //非零点启动开关
	                matchCompleteOn: 1, //完全匹配开关
	                matchTagOn: 1 //标签匹配开关
	            }
	        };
	        //加载知识类型
	        queryKnowledgeType();
	        //加载交互方式
	        listExchangeMode();
	        //请求知识类型列表
	        function queryKnowledgeType(keyword) {
	            ApplicationServer.queryKnowTypeList.save({
	                "applicationId": APPLICATION_ID,
	                "keyword": keyword
	            }, function (response) {
	                $scope.vm.knowledgeTypeData = response.data;
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //请求交互方式列表
	        function listExchangeMode(keyword) {
	            ApplicationServer.queryInterviewModeList.save({
	                "applicationId": APPLICATION_ID,
	                "keyword": keyword
	            }, function (data) {
	                $scope.vm.exchangeModeData = data.data;
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //多轮交互设置
	        function multipleConversationSetup() {
	            ApplicationServer.searchMultipleConversation.save({
	                "applicationId": APPLICATION_ID
	            }, function (response) {
	                if (response.status == 200) {
	                    $scope.vm.multipleConversation = {
	                        settingId: response.data.settingId, //配置id
	                        categoryFuzzyOn: response.data.categoryFuzzyOn, //类目模糊开关
	                        recommendedSimilarity: response.data.recommendedSimilarity, //推荐问相似度
	                        subjectMissingOn: response.data.subjectMissingOn, //主题缺失开关
	                        subjectMemoryRounds: response.data.subjectMemoryRounds, //主题记忆轮数
	                        memoryMethod: response.data.memoryMethod, //记忆方法
	                        elementMissingOn: response.data.elementMissingOn, //要素缺失开关
	                        elementRecommendationOrder: response.data.elementRecommendationOrder, //要素推荐顺序
	                        nonZeroStartOn: response.data.nonZeroStartOn, //非零点启动开关
	                        matchCompleteOn: response.data.matchCompleteOn, //完全匹配开关
	                        matchTagOn: response.data.matchTagOn //标签匹配开关
	                    };
	                    $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/application_manage/config/scene_manage/multiply_setup.html", "600px", function () {
	                        // 参数设置
	                        var parameter = angular.copy($scope.vm.multipleConversation);
	                        parameter.userId = USER_ID;
	                        parameter.applicationId = APPLICATION_ID;
	                        ApplicationServer.storeMultipleConversation.save(parameter, function (response) {
	                            if (response.status == 200) {
	                                layer.msg("修改成功！");
	                            } else {
	                                layer.msg("出现修改异常，请重新修改");
	                            }
	                        }, function (error) {
	                            console.log(error);
	                        });
	                    });
	                } else {
	                    layer.msg("目前还没有进行多轮会话设置");
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        ////多轮交互设置对话框
	        //function saveMultiInteractive(){
	        //    //查询多轮会话设置
	        //    findMultiInteractive();
	        //    var dialog = ngDialog.openConfirm({
	        //        template:"/static/application_manage/config/scene_manage/multiply_setup.html",
	        //        width:"600px",
	        //        scope: $scope,
	        //        closeByDocument:false,
	        //        closeByEscape: true,
	        //        showClose : true,
	        //        backdrop : 'static',
	        //        preCloseCallback:function(e){    //关闭回掉
	        //            if(e === 1){
	        //                ApplicationServer.storeInterviewModeSetup.save({
	        //                    "applicationId":APPLICATION_ID,
	        //                    "categoryFuzzyOn": $scope.vm.categoryFuzzyOn,
	        //                    "elementMissingOn": $scope.vm.elementMissingOn,
	        //                    "elementRecommendationOrder": $scope.vm.elementRecommendationOrder,
	        //                    "matchCompleteOn": $scope.vm.matchCompleteOn,
	        //                    "matchTagOn": $scope.vm.matchTagOn,
	        //                    "memoryMethod": $scope.vm.memoryMethod,
	        //                    "nonZeroStartOn": $scope.vm.nonZeroStartOn,
	        //                    "recommendedSimilarity": $scope.vm.recommendedSimilarity,
	        //                    "settingId": $scope.vm.settingId,
	        //                    "subjectMemoryRounds": $scope.vm.subjectMemoryRounds,
	        //                    "subjectMissingOn": $scope.vm.subjectMissingOn,
	        //                    "userId": USER_ID
	        //                },function(data){
	        //                    if(data.status==200){
	        //                        $scope.vm.settingId= data.data.settingId; //配置id
	        //                        $scope.vm.categoryFuzzyOn= data.data.categoryFuzzyOn;  //类目模糊开关
	        //                        $scope.vm.recommendedSimilarity= data.data.recommendedSimilarity; //推荐问相似度
	        //                        $scope.vm.subjectMissingOn= data.data.subjectMissingOn; //主题缺失开关
	        //                        $scope.vm.subjectMemoryRounds= data.data.subjectMemoryRounds; //主题记忆轮数
	        //                        $scope.vm.memoryMethod= data.data.memoryMethod; //记忆方法
	        //                        $scope.vm.elementMissingOn= data.data.elementMissingOn; //要素缺失开关
	        //                        $scope.vm.elementRecommendationOrder= data.data.elementRecommendationOrder;  //要素推荐顺序
	        //                        $scope.vm.nonZeroStartOn= data.data.nonZeroStartOn; //非零点启动开关
	        //                        $scope.vm.matchCompleteOn= data.data.matchCompleteOn; //完全匹配开关
	        //                        $scope.vm.matchTagOn= data.data.matchTagOn; //标签匹配开关
	        //                        $scope.$apply();
	        //                    }else{
	        //                        layer.msg("目前还没有进行多轮会话设置");
	        //                    }
	        //                },function(error){console.log(error);})
	        //
	        //            }
	        //        }
	        //    });
	        //}
	        //function updateKnowledgeType(item){
	        //    httpRequestPost("/api/application/scene/updateKnowledgeTypeByApplicationId",{
	        //        "applicationId": APPLICATION_ID,
	        //        "statusId": item.statusId,
	        //        "knowledgeTypeId": item.knowledgeTypeId
	        //    },function(data){
	        //        //$state.reload();
	        //        layer.msg("更新知识类型成功！");
	        //        listExchangeMode();
	        //        queryKnowledgeType();
	        //    },function(){
	        //        layer.msg("请求失败")
	        //    })
	        //}
	        //
	        //function updateExchangeMode(item){
	        //    httpRequestPost("/api/application/scene/updateExchangeModeByApplicationId",{
	        //        "applicationId": APPLICATION_ID,
	        //        "statusId": item.statusId,
	        //        "exchangeModeId": item.exchangeModeId
	        //    },function(data){
	        //        //$state.reload();
	        //        layer.msg("更新交互方式成功！");
	        //        listExchangeMode();
	        //        queryKnowledgeType();
	        //        $("#exchangeMode").click();
	        //    },function(){
	        //        layer.msg("请求失败")
	        //    })
	        //}

	        //开关
	        //function turnOn(targetValue,targetName){
	        //    $scope.vm[targetName] = targetValue ? 0 : 1 ;
	        //}
	        ////nnf-7.3-add
	        //function turnOn2(targetValue,targetName){
	        //    $scope.vm[targetName] = targetValue ? 0 : 1 ;
	        //    //添加判断，如果为关，后面两项不可用
	        //    if($scope.vm[targetName]==0){
	        //        $scope.vm.subjectMemoryRounds='';
	        //        $scope.vm.memoryMethod='';
	        //    }else{
	        //        $scope.vm.subjectMemoryRounds=3;
	        //        $scope.vm.memoryMethod=1;
	        //    }
	        //
	        //}
	    }]);
	};

/***/ })

})