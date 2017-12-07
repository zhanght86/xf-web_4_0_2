webpackJsonp([10],{

/***/ 28:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/20.
	 * @Module :  公用导航
	 */
	module.exports = function (homePageModule) {
	    homePageModule.controller('NavController', ['$scope', '$location', 'localStorageService', 'ngDialog', "$timeout", "$cookieStore", "$state", function ($scope, $location, localStorageService, ngDialog, $timeout, $cookieStore, $state) {
	        $scope.url = $location.url();
	        $scope.urls = $state.current.name;
	        $scope.map = []; // 定义导航
	        $scope.vm = {
	            applicationId: APPLICATION_ID,
	            sceneId: SCENE_ID,
	            loginout: loginout,
	            // userName : USER_NAME,
	            userName: "miles",
	            logApplication: logApplication,
	            jump: jump,
	            openServiceConfirm: openServiceConfirm,
	            queryServiceList: queryServiceList,
	            serviceUrl: "",
	            serviceUrlList: ""
	        };
	        if ($scope.url == "/HP/define") {
	            document.getElementsByTagName("body")[0].style.cssText = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/index-bg.jpg',sizingMethod='scale');background: url(../../images/images/index-bg.jpg) no-repeat;background-size:100%";
	            //document.getElementsByClassName("bodyBg")[0].src = "../../images/images/index-bg.jpg";
	        } else if ($scope.url == "/login") {
	            document.getElementsByTagName("body")[0].style.cssText = "background: url(../../images/images/log-bg.jpg) no-repeat;background-size:100%;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/log-bg.jpg',sizingMethod='scale');";
	        } else {
	            document.getElementsByTagName("body")[0].style.cssText = "background: #f8f8f8";
	        }
	        //if(!$cookieStore.get('userId')){
	        //    $state.go("login")
	        //}
	        function logApplication() {
	            // if($scope.vm.sceneId){
	            $state.go("AM.info");
	            // }else{
	            //     return false
	            // }
	        }
	        function loginout() {
	            $cookieStore.remove('applicationId');
	            $cookieStore.remove('sceneId');
	            $cookieStore.remove('userId');
	            $cookieStore.remove('userName');
	            $cookieStore.remove('userLoginName');
	            localStorage.removeItem('history');
	            httpRequestPost("/api/user/userOut", {
	                "userId": USER_ID,
	                "userLoginName": USER_LOGIN_NAME
	            }, function () {});
	            self.location = "index.html";
	        }
	        //初始化分页配置
	        self.initSearch = function (column) {
	            if (!$scope.SearchPOJO) {
	                $scope.SearchPOJO = $scope.initSearchPOJO();
	            }
	            /**
	             * 加载分页条
	             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	             */
	            $scope.paginationConf = {
	                currentPage: $scope.SearchPOJO.currentPage, //当前页
	                totalItems: 0, //总条数
	                pageSize: $scope.SearchPOJO.pageSize, //第页条目数
	                pagesLength: 6 //分页框数量

	            };
	        };
	        self.initSearch();

	        function queryServiceList() {
	            //服务列表请求
	            httpRequestPost("/api/application/service/listServiceByPage", {
	                "applicationId": $scope.vm.applicationId,
	                "index": ($scope.SearchPOJO.currentPage - 1) * $scope.SearchPOJO.pageSize,
	                "pageSize": $scope.SearchPOJO.pageSize
	            }, function (resource) {
	                if (resource.status == 200 && resource.data != null && resource.data.length > 0) {
	                    $scope.paginationConf.totalItems = resource.total;
	                    $scope.vm.serviceArray = resource.data;
	                    $scope.vm.serviceUrl = resource.data[0].nodeAccessIp; //设置默认选择
	                    $scope.vm.openServiceConfirm();
	                } else {
	                    layer.msg("无应用服务", { time: 1000 });
	                }
	            }, function () {
	                layer.msg("无法加载服务列表", { time: 1000 });
	            });
	        }
	        //引擎跳转方法
	        function openServiceConfirm() {
	            //对话框打开方法
	            var dialog = ngDialog.openConfirm({
	                template: "/static/index/home_page/qa_system.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        $scope.vm.jump($scope.vm.serviceUrl);
	                    }
	                }
	            });
	        }
	        //打开引擎访问界面
	        function jump(url) {
	            window.open('http://' + url + '/index.html');
	        }
	        $scope.checkShowCrumbs = function () {
	            if (!$scope.url.toString().indexOf("/homePage/define") > 0 || !$scope.url.toString().indexOf("/admin/manage") > 0 || !$scope.url.toString().indexOf("/admin/userManage") > 0) {
	                return false;
	            } else {
	                return true;
	            }
	        };
	        $scope.checkShowClose = function (url) {
	            if (url == 'homePage.define') {
	                return true;
	            }
	        };

	        function ObjStory(url, name) {
	            this.url = url;
	            this.name = name;
	        }
	        $scope.getParamList = function () {
	            if (localStorage.history) {
	                var aa = JSON.parse(window.localStorage.history);
	                if (aa.use.length >= 8) {
	                    aa.use.splice(1, 1);
	                }
	                for (var i = 0; i < aa.use.length; i++) {
	                    if (aa.use[i].name == $scope.getUrlName($scope.urls)) {
	                        aa.use.splice(i, 1);
	                    }
	                }
	                if ($scope.getUrlName($scope.urls) != '0') {
	                    aa.use.push(new ObjStory($scope.urls, $scope.getUrlName($scope.urls)));
	                }
	                window.localStorage.history = JSON.stringify(aa);
	                // $scope.crumbs=aa.use.slice(0,-1);
	                $scope.crumbs = aa.use;
	            } else {
	                var obj = {
	                    use: [{ "url": "homePage.define", "name": "首页" }]
	                };
	                window.localStorage.history = JSON.stringify(obj);
	            }
	        };
	        $scope.getUrlName = function (url) {
	            switch (url) {
	                /*case 'homePage.define':
	                    return 0;*/
	                case 'relationalCatalog.manage':
	                    return 'BOT';
	                case 'frameworkLibrary.manage':
	                    return '框架库';
	                case (url.match(/^conceptManage/) || {}).input:
	                    return '概念管理';
	                case (url.match(/^setting/) || {}).input:
	                    return '我的应用';
	                case (url.match(/^custServScenaOverview/) || {}).input:
	                    return '知识管理';
	                case 'functionalTest.questionTest':
	                    return '问法测试';
	                case 'functionalTest.sessionTest':
	                    return '会话测试';
	                case 'functionalTest.batchTest':
	                    return '批量测试';
	                case 'functionalTest.participle':
	                    return '分词应用';
	                case 'functionalTest.participleResult':
	                    return '分词测试结果';
	                case 'knowledgeManagement.custOverview':
	                    return '知识总览';
	                case 'knowledgeManagement.markOverview':
	                    return '知识总览';
	                case 'knowledgeManagement.conceptAdd':
	                    return '营销知识新增';
	                case 'knowledgeManagement.faqAdd':
	                    return 'FAQ知识新增';
	                case 'knowledgeManagement.singleAddConcept':
	                    return '概念知识新增';
	                case 'knowledgeManagement.listAdd':
	                    return '列表知识新增';
	                case 'knowledgeManagement.factorAdd':
	                    return '要素知识新增';
	                case 'knowledgeManagement.markKnow':
	                    return '营销知识新增';
	                case 'knowledgeManagement.knowBatchAdditions':
	                    return '知识批量新增';
	                // case (url.match(/^gateway/) || {}).input:
	                case 'back.gateway':
	                    return '文档加工新增';
	                case 'knowledgeManagement.historyView':
	                    return '历史查看';
	                case 'applAnalysis.accessStatistics':
	                    return '访问统计';
	                case 'applAnalysis.knowledgeRanking':
	                    return '知识点排名统计';
	                case 'applAnalysis.sessionDetails':
	                    return '会话明细统计';
	                case 'applAnalysis.satisfactionDegree':
	                    return '会话满意度统计';
	                case 'applAnalysis.resolutionStatistics':
	                    return '问答解决率统计';
	                case 'applAnalysis.reinforcementLearn':
	                    return '智能学习';
	                case 'applAnalysis.newKnowledgeDiscoveryLearn':
	                    return '未匹配问题聚类';
	                case 'applAnalysis.operationLog':
	                    return '操作日志';
	                case 'applAnalysis.sessionLog':
	                    return '会话日志';
	                case 'materialManagement.chatKnowledgeBase':
	                    return '聊天知识库';
	                case 'materialManagement.pictureLibrary':
	                    return '图片库';
	                case 'materialManagement.speechLibrary':
	                    return '语音库';
	                case 'materialManagement.documentLibrary':
	                    return '文档库';
	                case 'materialManagement.teletextMessage':
	                    return '图文消息库';
	                case 'deepLearning.deeplearnConfig':
	                    return '模型构建';
	                case 'deepLearning.deepLearningCon':
	                    return '模型训练';
	                case 'deepLearning.similarityCalculation':
	                    return '模型测试';
	                case 'deepLearning.dataAcquisition':
	                    return '自动导入更新';
	                case 'admin.manage':
	                    return '应用切换';
	                default:
	                    return 0;
	            }
	        };
	        $scope.getParamList();
	        $scope.closeCrumb = function (index) {
	            $scope.crumbs.splice(index, 1);
	            if ($scope.crumbs.length != 0) {
	                var obj = {
	                    use: $scope.crumbs
	                };
	                window.localStorage.history = JSON.stringify(obj);
	            } else {
	                localStorage.removeItem('history');
	            }
	        };
	        window.onbeforeunload = function () {
	            localStorage.removeItem('history');
	        };
	    }]);
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

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  应用管理模块 ， 加载依赖
	 */
	module.exports = function (angular) {
	    var applicationManagementModule = angular.module('applicationManagementModule', []);
	    __webpack_require__(76)(applicationManagementModule); // 控制器
	    __webpack_require__(28)(applicationManagementModule); // 导航
	    //--------------------------------------------------
	    //          directive
	    //--------------------------------------------------
	    __webpack_require__(77)(applicationManagementModule); // 开关
	    //--------------------------------------------------
	    //          controller
	    //--------------------------------------------------
	    // 应用信息
	    __webpack_require__(40)(applicationManagementModule); // 应用信息
	    __webpack_require__(41)(applicationManagementModule); // 备份还原
	    // 应用配置
	    __webpack_require__(66)(applicationManagementModule); // 授权管理
	    __webpack_require__(67)(applicationManagementModule); // 渠道管理
	    __webpack_require__(68)(applicationManagementModule); // 热点知识设置
	    __webpack_require__(69)(applicationManagementModule); // 授权管理
	    __webpack_require__(70)(applicationManagementModule); // 授权管理
	    __webpack_require__(71)(applicationManagementModule); // 授权管理
	    __webpack_require__(72)(applicationManagementModule); // 授权管理
	    // 应用发布
	    __webpack_require__(49)(applicationManagementModule); // 节点管理
	    __webpack_require__(50)(applicationManagementModule); // 发布管理
	    //--------------------------------------------------
	    //          server
	    //--------------------------------------------------
	    __webpack_require__(73)(applicationManagementModule);
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	    __webpack_require__(78)(applicationManagementModule); //  验证服务名称
	    __webpack_require__(79)(applicationManagementModule); // 验证应用名称
	    __webpack_require__(80)(applicationManagementModule); // 验证节点名称
	};

/***/ }),

/***/ 66:
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

/***/ 67:
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

/***/ 68:
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

/***/ 69:
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

/***/ 70:
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

/***/ 71:
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

/***/ 72:
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

/***/ }),

/***/ 73:
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/31.
	 * @Module :  应用管理服务
	 */
	var ApplicationServer = function ApplicationServer($resource) {
	        _classCallCheck(this, ApplicationServer);

	        /******************************
	                          *应用配置*
	                    ********************************/
	        //   渠道管理
	        //请求渠道列表
	        this.queryChannelList = $resource(API_APPLICATION + "/channel/listChannelByPage", {}, {});
	        //获取黑名单列表
	        this.queryBlacklist = $resource(API_APPLICATION + "/channel/listBlackListByPage", {}, {});
	        //添加黑名单
	        this.addBlacklist = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	        //校验黑名单
	        this.checkBlackList = $resource(API_APPLICATION + "/channel/addBlackList", {}, {});
	        //移除黑名单 》》单个批量合并为一个
	        this.removeBlacklist = $resource(API_APPLICATION + "/channel/batchDelBlackList", {}, {});
	        //改变渠道状态
	        this.changeChannelStatus = $resource(API_APPLICATION + "/channel/changeStatus", {}, {});
	        //   场景管理
	        //获取知识类型
	        this.queryKnowTypeList = $resource(API_APPLICATION + "/scene/listKnowledgeTypeByApplicationId", {}, {});
	        //获取交互方式
	        this.queryInterviewModeList = $resource(API_APPLICATION + "/scene/listExchangeModeByApplicationId", {}, {});
	        //多轮会话搜索
	        this.searchMultipleConversation = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	        //多轮会话设置
	        this.storeMultipleConversation = $resource(API_APPLICATION + "/scene/saveMultiInteractiveSetting", {}, {});

	        //   热点知识设置
	        //获取热点知识列表 + 查询       删除 /hotQuestion/getHotQuestionList
	        this.queryHotKnowledgeList = $resource(API_APPLICATION + "/hotQuestion/getHotQuestionList", {}, {});
	        //获取知识列表 + 查询                                                                                                      //**********OTHER >>>> API_MS
	        this.queryKnowledgeList = $resource(API_MS + "/knowledgeManage/overView/findKnowledgeByApplicationId", {}, {});
	        //添加热点知识
	        this.addHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/batchAdd", {}, {});
	        //删除热点知识
	        this.removeHotKnowledge = $resource(API_APPLICATION + "/hotQuestion/deleteHotQuestionByIds", {}, {});
	        //上移知识
	        this.hotKnowledgeUp = $resource(API_APPLICATION + "/scene/findMultiInteractiveSetting", {}, {});
	        //下移知识
	        this.hotKnowledgeDown = $resource(API_APPLICATION + "//hotQuestion/moveDown", {}, {});
	        //置顶知识
	        this.hotKnowledgeStick = $resource(API_APPLICATION + "/hotQuestion/moveUp", {}, {});

	        //   参数设置
	        //查看应用参数
	        this.queryParameter = $resource(API_APPLICATION + "/application/findApplicationSetting", {}, {});
	        //更新应用参数
	        this.updateParameter = $resource(API_APPLICATION + "/application/saveApplicationSetting", {}, {});

	        //   机器人设置
	        //查看机器人参数
	        this.queryRobotParameter = $resource(API_APPLICATION + "/application/findRobotSetting", {}, {});
	        //更新机器人参数
	        this.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});
	        //保存经典机器人头像
	        this.storeClassicalAvatar = $resource(API_APPLICATION + "/application/saveClassicHead", {}, {});
	        //保存自定义机器人头像
	        this.updateRobotParameter = $resource(API_APPLICATION + "/application/saveRobotSetting", {}, {});

	        //  转人工设置
	        //获取列表
	        this.manualGetData = $resource(API_APPLICATION + "/artificial/get/setting/" + APPLICATION_ID, {}, {});
	        //修改
	        this.manualSaveData = $resource(API_APPLICATION + "/artificial/update", {}, {});

	        /******************************
	                        *应用发布*
	                   ********************************/
	        //发布管理
	        //查看服务列表
	        this.queryServiceList = $resource(API_APPLICATION + "/service/listServiceByPage", {}, {});
	        //获取服务类型
	        this.queryServiceTypeList = $resource(API_APPLICATION + "/service/listServiceType", {}, {});
	        //获取可用节点
	        this.queryAvailableNodeList = $resource(API_APPLICATION + "/node/listNoUsingNode", {}, {});
	        //检查服务名称是否重复
	        this.verifyServiceName = $resource(API_APPLICATION + "/service/checkName", {}, {});
	        //通过id查看服务
	        this.queryServiceById = $resource(API_APPLICATION + "/service/findServiceById", {}, {});
	        //获取己用节点(通过父节点信息)
	        this.queryParentNodeInfo = $resource(API_APPLICATION + "/node/findParentNodeInfo", {}, {});
	        //新增服务
	        this.addService = $resource(API_APPLICATION + "/service/addAndPublishService", {}, {});
	        //发布服务
	        this.releaseService = $resource(API_APPLICATION + "/service/publishService", {}, {});
	        //更新服务
	        this.updateService = $resource(API_APPLICATION + "/service/editService", {}, {});
	        //删除服务
	        this.removeService = $resource(API_APPLICATION + "/service/deleteService", {}, {});
	        //上线服务
	        this.startService = $resource(API_APPLICATION + "/service/startService", {}, {});
	        //下线服务
	        this.downService = $resource(API_APPLICATION + "/service/stopService", {}, {});
	        //重启服务
	        this.restartService = $resource(API_APPLICATION + "/service/restartService", {}, {});
	        //节点管理
	        //查看节点列表
	        this.queryNodeList = $resource(API_APPLICATION + "/node/listNodeByPage", {}, {});
	        //查询节点的基本信息
	        this.queryNodeInfo = $resource(API_APPLICATION + "/node/findNodeInfo", {}, {});
	        //新增节点
	        this.addNode = $resource(API_APPLICATION + "/node/addNode", {}, {});
	        //编辑节点
	        this.updateNode = $resource(API_APPLICATION + "/node/editNode", {}, {});
	        //下线节点
	        this.startNode = $resource(API_APPLICATION + "/node/stopService", {}, {});
	        //禁用节点
	        this.disableNode = $resource(API_APPLICATION + "/node/disabledAndEnabledNode", {}, {});
	        //删除节点
	        this.removetNode = $resource(API_APPLICATION + "/node/deleteNode", {}, {});
	        //检验节点是否合理
	        this.verifyNode = $resource(API_APPLICATION + "/node/checkNode", {}, {});
	        /******************************
	                        *应用信息*
	                  ********************************/
	        //应用信息
	        //校验应用名称
	        this.verifyApplicationName = $resource(API_APPLICATION + "/application/checkName", {}, {});
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
	        this.stopAllService = $resource(API_APPLICATION + "/service/stopAllService", {}, {});
	        //查看应用信息
	        this.viewApplicationInfo = $resource(API_APPLICATION + "/application/findApplication", {}, {});
	        //查看场景业务框架数量
	        this.viewFrameNumber = $resource(API_APPLICATION + "/application/get/frame", {}, {});
	        //修改应用名称
	        this.updateApplicationName = $resource(API_APPLICATION + "/application/updateApplication", {}, {});
	        //删除当前应用（当前所有服务）
	        this.removeApplication = $resource(API_APPLICATION + "/service/deleteAllServices", {}, {});

	        /******************************
	                         *应用部分 登录后续部分*
	                  ********************************/
	        //添加应用
	        this.addApplication = $resource(API_APPLICATION + "/application/add", {}, {});
	        //编辑应用
	        this.updateApplication = $resource(API_APPLICATION + "/application/update", {}, {});
	        //应用名称与授权证书校验
	        this.checkApplicationName = $resource(API_APPLICATION + "/application/name/check", {}, {});
	        //查询单个应用
	        this.getApplication = $resource(API_APPLICATION + "/application/get/{id}", {}, {});
	        //查询所有应用
	        this.queryAllApplication = $resource(API_APPLICATION + "/application/get", {}, {});
	        //查询用户关联应用列表
	        this.queryApplicationByUserId = $resource(API_APPLICATION + "/application/get/user", {}, {});
	        // //根据应用id(从cookie获取)列表获取应用名称列表
	        // this.qeuryAllApplicationName = $resource(API_APPLICATION+"/get/applicationids", {}, {});
	        //根据应用id(从cookie获取)列表获取应用名称列表
	        this.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	        //根据应用id(从cookie获取)列表获取应用名称列表
	        this.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	        //根据应用id(从cookie获取)列表获取应用名称列表
	        this.queryAllApplicationName = $resource(API_APPLICATION + "/get/applicationids", {}, {});
	};

	ApplicationServer.$inject = ['$resource'];
	module.exports = function (applicationManagementModule) {
	        applicationManagementModule.service("ApplicationServer", ApplicationServer);
	};

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('ApplicationSettingController', ['$scope', "$state", "$stateParams", "$cookieStore", "$rootScope", function ($scope, $state, $stateParams, $cookieStore, $rootScope) {
	        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
	        $scope.vm = {
	            isSlide: isSlide,
	            isSlide2: isSlide2,
	            sceneId: $cookieStore.get('sceneId'),
	            applicationName: $cookieStore.get("applicationName"),
	            robotName: "" //机器人名称
	        };
	        //获取应用的头像
	        findRobotHead();

	        function isSlide(event) {
	            var self = event.target;
	            if ($(self).hasClass("slideActive")) {
	                $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
	            } else {
	                $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
	            }
	        }
	        function isSlide2(event) {
	            var self = event.target;
	            if ($(self).parent().hasClass("slideActive")) {
	                $(self).parent().removeClass("slideActive").next(".menu_1").stop().slideToggle();
	            } else {
	                $(self).parent().addClass("slideActive").next(".menu_1").stop().slideToggle();
	            }
	        }
	        //获取应用的头像
	        function findRobotHead() {
	            httpRequestPost("/api/application/application/findRobotSetting", {
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                //类名重複
	                if (data.data === 10005) {
	                    $scope.MASTER.headImage = ""; //头像
	                } else {
	                    $cookieStore.put('robotHead', '/img/' + data.data.robotHead);
	                    $scope.MASTER.headImage = '/img/' + data.data.robotHead;
	                    $scope.vm.robotName = data.data.robotName; //机器人名称
	                    $scope.$apply();
	                }
	            }, function () {
	                console.log("获取头像失敗");
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module : 开关按钮
	 */
	module.exports = function (module) {
	    module.directive('switch', function () {
	        return {
	            restrict: 'EA',
	            scope: {
	                title: '=expanderTitle',
	                value: '=' // 1  true   0  false
	            },

	            template: '<div class="b_box" ng-click="toggle()" ng-class="value?\'open1\':\'close1\'" style="float:left;margin-right:10px;">' + '<div class="s_box"  ng-class="value?\'open2\':\'close2\'"></div>' + '</div>',
	            link: function link(scope, element, attrs) {
	                //scope.$apply(function () {
	                scope.toggle = function toggle() {
	                    scope.value = scope.value ? 0 : 1;
	                };
	                //});
	            }
	        };
	    });
	};

/***/ }),

/***/ 78:
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

/***/ 79:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/11.
	 * @Module :  验证应用名称
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkName', function (ApplicationServer, $log) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyApplicationName.save({
	                        applicationId: APPLICATION_ID,
	                        applicationName: scope.vm.applicationNewName
	                    }, function (response) {
	                        if (response.data) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                        }
	                    }, function (error) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                        $log.log(error);
	                    });
	                });
	            }
	        };
	    });
	};

/***/ }),

/***/ 80:
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

});