webpackJsonp([4],{

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/23.
	 * @Module :  首页模块
	 */
	module.exports = function (angular) {
	    var homePageModule = angular.module('homePageModule', []);
	    __webpack_require__(28)(homePageModule); // 导航
	    __webpack_require__(29)(homePageModule); // 主体
	    __webpack_require__(30)(homePageModule); // 应用管理
	    __webpack_require__(31)(homePageModule); // 权限管理
	};

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Created by 41212 on 2017/3/21.
	 */
	module.exports = function (homePageModule) {
	    homePageModule.controller('homePageNavController', ['$scope', '$location', 'localStorageService', 'ngDialog', "$timeout", "$cookieStore", "$state", function ($scope, $location, localStorageService, ngDialog, $timeout, $cookieStore, $state) {
	        $scope.url = $location.url();
	        $scope.urls = $state.current.name;
	        $scope.vm = {
	            applicationId: APPLICATION_ID,
	            sceneId: SCENE_ID,
	            loginout: loginout,
	            userName: USER_NAME,
	            logApplication: logApplication,
	            jump: jump,
	            openServiceConfirm: openServiceConfirm,
	            queryServiceList: queryServiceList,
	            serviceUrl: "",
	            serviceUrlList: ""
	        };
	        if ($scope.url == "/homePage/define") {
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
	            if ($scope.vm.sceneId) {
	                $state.go("setting.Infor");
	            } else {
	                return false;
	            }
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

/***/ 29:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Created by 41212 on 2017/5/2.
	 */
	//首页controller
	module.exports = function (homePageModule) {
	    homePageModule.controller('homePageContentController', ['$scope', '$location', 'localStorageService', "$state", "$cookieStore", function ($scope, $location, localStorageService, $state, $cookieStore) {
	        $scope.vm = {
	            sceneId: SCENE_ID
	        };
	    }]);
	};

/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * Created by mileS on 2017/6/13
	 * 控制器
	 */
	module.exports = function (homePageModule) {
	    homePageModule.controller('adminContentController', ['$scope', "$state", "$timeout", "$stateParams", "ngDialog", "$cookieStore", "$rootScope", function ($scope, $state, $timeout, $stateParams, ngDialog, $cookieStore, $rootScope) {
	        $scope.vm = {
	            userName: USER_NAME,
	            userPermission: $stateParams.userPermission,
	            addApplicationWindow: addApplicationWindow,
	            myApplication: "",
	            selectLicence: "",
	            newApplicationName: "",
	            newScene: "",
	            newLicence: "",
	            newDescribe: "",
	            selectScene: selectScene
	        };
	        function selectScene(id, applicationId) {
	            $cookieStore.put("sceneId", id);
	            $cookieStore.put("applicationId", applicationId);
	            $.getScript('/js/common/config.js');
	            $scope.MASTER.queryChannelList(applicationId);
	            $scope.MASTER.queryDimensionList(applicationId);
	        }
	        getUserInfo();
	        myApplication();
	        selectLicence();
	        //获取用户信息
	        function getUserInfo() {
	            httpRequestPost("/api/user/findRoleIdByUserId", {
	                "userId": USER_ID
	            }, function (data) {
	                //if(data.status==200){
	                console.log(data);
	                $scope.vm.userPermission = data.data.roleList;
	                $scope.$apply();
	                //}
	            }, function (err) {});
	        }
	        //获取当前 应用场景
	        function myApplication() {
	            //console.log(getCookie("userId"));
	            httpRequestPost("/api/application/application/listApplicationByUserId", {
	                //"userId":$cookieStore.get("userId")
	                "userId": USER_ID
	            }, function (data) {
	                console.log(data);
	                $scope.vm.myApplication = data.data;
	                $scope.$apply();
	            }, function (err) {
	                //console.log(err)
	            });
	        }

	        //var timeout = $timeout(function () {
	        //     $scope.vm.selectLicence = ["d","a","b"]
	        //},3000);
	        //获取 scene
	        function selectLicence() {
	            httpRequestPost("/api/application/scene/listAllScene", {}, function (data) {
	                $scope.vm.selectLicence = data.data;
	                $scope.vm.newScene = data.data[0].sceneId;
	                console.log(data.data);
	                $scope.$apply();
	                return data.data;
	            }, function (err) {
	                console.log(err);
	            });
	        }

	        //打开添加窗口
	        function addApplicationWindow() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/index/user_control/switch_application/add_application.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (applicationValidate() == false) {
	                            return false;
	                        }
	                        addApplication();
	                    } else {
	                        $scope.vm.newApplicationName = "";
	                        $scope.vm.newLicence = "";
	                        $scope.vm.newDescribe = "";
	                    }
	                }

	            });
	        }
	        function applicationValidate() {
	            if (lengthCheck($scope.vm.newApplicationName, 0, 50) == false) {
	                layer.msg("应用名称不能为空或超过长度限制50");
	                return false;
	            }
	            if (lengthCheck($scope.vm.newLicence, 0, 20) == false) {
	                layer.msg("LICENSE不能为空或超过长度限制20");
	                return false;
	            }
	            return true;
	        }
	        //添加
	        function addApplication() {
	            //console.log(getCookie("userId"),$scope.vm.newApplicationName,$scope.vm.newScene,$scope.vm.newLicence,$scope.vm.newDescribe);
	            httpRequestPost("/api/application/application/addApplication", {
	                "userId": $cookieStore.get("userId"),
	                "applicationName": $scope.vm.newApplicationName,
	                "sceneId": $scope.vm.newScene,
	                "applicationLisence": $scope.vm.newLicence,
	                "applicationDescription": $scope.vm.newDescribe
	            }, function (data) {
	                if (data.status == 200) {
	                    $state.reload();
	                } else {
	                    layer.msg(data.data);
	                }
	                console.log(data);
	            }, function (err) {
	                console.log(err);
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * Created by mileS on 2017/3/21.
	 */
	module.exports = function (homePageModule) {
	    homePageModule.controller('userManageController', ['$scope', "localStorageService", "$state", "$timeout", "$stateParams", "ngDialog", "$cookieStore", function ($scope, localStorageService, $state, $timeout, $stateParams, ngDialog, $cookieStore) {
	        $scope.vm = {
	            simpleOperateTitle: "",
	            listData: "", // table 数据
	            getData: getData,
	            paginationConf: "", //分页条件
	            userDataTotal: "", //用户总数
	            pageSize: 5,
	            addUser: addUser,
	            editUser: editUser,
	            deleteUser: deleteUser,
	            search: search,
	            stop: stop,
	            userId: $cookieStore.get("userId"),
	            verifyRelease: verifyRelease,
	            //添加用户所需要数据
	            userName: "",
	            userLonginName: "",
	            userPassword: "",
	            userPassWord: "", //用户所输入确认密码
	            userPhoneNumber: "",
	            userEmail: "",
	            remark: "",
	            allowSubmit: 1, //是否允许提交
	            //查询所需数据
	            searchName: "",
	            //查询当前所有应用
	            listApplication: "",
	            //查询当前所有角色
	            listRole: "",
	            roleId: "",
	            prop: [],
	            applicationIds: [],
	            savaProp: savaProp,
	            saveProp: saveProp,
	            filter: filter,
	            selectAll: selectAll,
	            selectSingle: selectSingle,
	            deleteIds: [],
	            selectAllCheck: false,
	            deleteUsers: deleteUsers
	        };
	        function selectAll(ev) {
	            //var self = $(ev.target);
	            if (!$scope.vm.selectAllCheck) {
	                $scope.vm.selectAllCheck = true;
	                $scope.vm.deleteIds = [];
	                angular.forEach($scope.vm.listData, function (item) {
	                    $scope.vm.deleteIds.push(item.userId);
	                });
	            } else {
	                $scope.vm.selectAllCheck = false;
	                $scope.vm.deleteIds = [];
	            }
	            console.log($scope.vm.deleteIds);
	        }
	        function selectSingle(ev, id) {
	            if ($scope.vm.deleteIds.inArray(id)) {
	                $scope.vm.deleteIds.remove(id);
	            } else {
	                $scope.vm.deleteIds.push(id);
	            }
	            console.log($scope.vm.deleteIds);
	        }
	        getData(1);
	        //查询列表
	        function getData(index) {
	            $scope.vm.deleteIds = [];
	            httpRequestPost("/api/user/listUser", {
	                index: (index - 1) * $scope.vm.pageSize,
	                pageSize: $scope.vm.pageSize
	            }, function (data) {
	                $scope.vm.listData = data.data.userManageList;
	                $scope.vm.userDataTotal = data.data.total;
	                $scope.vm.paginationConf = {
	                    currentPage: index, //当前页
	                    totalItems: data.data.total, //总条数
	                    pageSize: $scope.vm.pageSize, //第页条目数
	                    pagesLength: 8 //分页框数量
	                };
	                $scope.$apply();
	            }, function () {
	                //layer.msg("请求失败")
	                console.log("请求失败");
	            });
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if ($scope.vm.searchName) {
	                        search(current);
	                    } else {
	                        getData(current);
	                    }
	                }, 0);
	            }
	        }, true);

	        //添加用户校验
	        function verifyRelease() {
	            if ($scope.vm.userName == null || $scope.vm.userName == "") {
	                layer.msg("姓名不能为空!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            var name = /^[A-Za-z\u4e00-\u9fa5]+$/;
	            if (!name.test($scope.vm.userName)) {
	                layer.msg("姓名只可以输入汉字或字母的组合!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.userName.length > 20) {
	                layer.msg("姓名的长度不能超过20个字符!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.userLoginName == null || $scope.vm.userLoginName == "") {
	                layer.msg("登录名不能为空!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            var reg = /^[0-9a-zA-Z_]{4,20}$/;
	            if (!reg.test($scope.vm.userLoginName)) {
	                layer.msg("登录名只可以是数字、字母、下划线组合，4-20个字符!", { time: 1000 });
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }

	            if ($scope.vm.userPassword == null || $scope.vm.userPassword == "") {
	                layer.msg("密码不能为空!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            var password = /^[0-9a-zA-Z]+$/;
	            if (!password.test($scope.vm.userPassword)) {
	                layer.msg("密码只可以是数字和字母组合!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.userPassword.length > 20) {
	                layer.msg("密码长度不能超过20个字符!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.userPhoneNumber == null || $scope.vm.userPhoneNumber == "") {
	                layer.msg("手机号不能为空!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            var re = /^1[0-9]{10}$/;
	            if (!re.test($scope.vm.userPhoneNumber)) {
	                layer.msg("手机号只可以为1开头的11位数字!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.userEmail == null || $scope.vm.userEmail == "") {
	                layer.msg("邮箱不能为空!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            if ($scope.vm.prop.length == 0) {
	                layer.msg("请至少选择一个应用!");
	                $scope.vm.allowSubmit = 0;
	                return 0;
	            }
	            return 1;
	        }

	        //添加用户
	        function addUser() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/index/user_control/permission_manage/userManageDialog.html",
	                width: "680px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if ($scope.vm.allowSubmit) {
	                            httpRequestPost("/api/user/addUser", {
	                                userId: $scope.vm.userId,
	                                userName: $scope.vm.userName,
	                                userLoginName: $scope.vm.userLoginName,
	                                userPassword: $scope.vm.userPassword,
	                                userPhoneNumber: $scope.vm.userPhoneNumber,
	                                userEmail: $scope.vm.userEmail,
	                                roleId: $scope.vm.roleId,
	                                applicationIds: $scope.vm.prop,
	                                remark: $scope.vm.remark
	                            }, function (data) {
	                                //刷新页面
	                                $state.reload();
	                                if (data.status == 10009) {
	                                    layer.msg("该登录名已经存在，请重新添加!");
	                                } else if (data.status == 10008) {
	                                    layer.msg("用户添加成功!");
	                                } else {
	                                    //layer.msg("用户添加失败!");
	                                    console.log("用户添加失败!");
	                                }
	                            }, function () {
	                                //layer.msg("请求失败")
	                                console.log("请求失败");
	                            });
	                        }
	                        //保存的同时清空数据
	                        $scope.vm.userName = "";
	                        $scope.vm.userLoginName = "";
	                        $scope.vm.userPassword = "";
	                        $scope.vm.userPassWord = "";
	                        $scope.vm.userPhoneNumber = "";
	                        $scope.vm.userEmail = "";
	                        $scope.vm.prop = [];
	                        $scope.vm.remark = "";
	                    } else {
	                        //取消的同时清空数据
	                        $scope.vm.userName = "";
	                        $scope.vm.userLoginName = "";
	                        $scope.vm.userPassword = "";
	                        $scope.vm.userPassWord = "";
	                        $scope.vm.userPhoneNumber = "";
	                        $scope.vm.userEmail = "";
	                        $scope.vm.prop = [];
	                        $scope.vm.remark = "";
	                    }
	                }
	            });
	        }
	        //编辑用户
	        function editUser(data) {
	            $scope.vm.userId = data.userId;
	            $scope.vm.userName = data.userName;
	            $scope.vm.userLoginName = data.userLoginName;
	            $scope.vm.userPassword = data.userPassword;
	            $scope.vm.userPassWord = data.userPassword;
	            $scope.vm.userPhoneNumber = data.userPhoneNumber;
	            $scope.vm.userEmail = data.userEmail;
	            $scope.vm.remark = data.remark;
	            $scope.vm.roleId = data.roleId;
	            $scope.vm.prop = data.applicationName;
	            $scope.vm.applicationIds = data.applicationIds;
	            console.log(data.applicationIds);
	            //$scope.$apply()
	            var dialog = ngDialog.openConfirm({
	                template: "/static/index/user_control/permission_manage/userManageDialog2.html",
	                width: "680px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if ($scope.vm.allowSubmit) {
	                            httpRequestPost("/api/user/updateUserById", {
	                                userId: data.userId,
	                                userName: $scope.vm.userName,
	                                userLoginName: $scope.vm.userLoginName,
	                                userPassword: $scope.vm.userPassword,
	                                userPhoneNumber: $scope.vm.userPhoneNumber,
	                                userEmail: $scope.vm.userEmail,
	                                roleId: $scope.vm.roleId,
	                                applicationIds: $scope.vm.applicationIds,
	                                remark: $scope.vm.remark
	                            }, function (data) {
	                                //刷新页面
	                                $state.reload();
	                                if (data.status == 10012) {
	                                    layer.msg("用户修改成功!");
	                                } else if (data.status = 10009) {
	                                    layer.msg("登录名重复!");
	                                } else {
	                                    //layer.msg("用户修改失败!");
	                                    console.log("用户修改失败!");
	                                }
	                            }, function () {
	                                //layer.msg("请求失败");
	                                console.log("请求失败");
	                            });
	                        }
	                    } else {
	                        //取消的同时清空数据
	                        $scope.vm.userName = "";
	                        $scope.vm.userLoginName = "";
	                        $scope.vm.userPassword = "";
	                        $scope.vm.userPassWord = "";
	                        $scope.vm.userPhoneNumber = "";
	                        $scope.vm.userEmail = "";
	                        $scope.vm.prop = [];
	                        $scope.vm.remark = "";
	                    }
	                }
	            });
	        }
	        //查询用户
	        function search(index) {
	            if ($scope.vm.searchName == '' || $scope.vm.searchName == null) {
	                getData(1);
	            } else {
	                httpRequestPost("/api/user/queryUserByUserName", {
	                    userName: $scope.vm.searchName,
	                    index: (index - 1) * $scope.vm.pageSize,
	                    pageSize: $scope.vm.pageSize
	                }, function (data) {
	                    if (data.status == 10016) {
	                        $scope.vm.listData = "";
	                        $scope.vm.userDataTotal = 0;
	                        $scope.$apply();
	                        layer.msg("没有查询到记录!");
	                    }
	                    $scope.vm.listData = data.data.userManageList;
	                    $scope.vm.userDataTotal = data.data.total;
	                    $scope.vm.paginationConf = {
	                        currentPage: index, //当前页
	                        totalItems: data.data.total, //总条数
	                        pageSize: $scope.vm.pageSize, //第页条目数
	                        pagesLength: 8 //分页框数量
	                    };
	                    $scope.$apply();
	                }, function () {
	                    //layer.msg("请求失败")
	                    console.log("请求失败");
	                });
	            }
	        }

	        //删除用户
	        function deleteUser(userId) {
	            $scope.vm.simpleOperateTitle = "确认要删除吗";
	            var dialog = ngDialog.openConfirm({
	                template: "/static/base/public_html/simple_operate.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        httpRequestPost("/api/user/deleteUser", {
	                            userId: userId
	                        }, function (data) {
	                            if (data.status == 10010) {
	                                layer.msg("用户删除成功!");
	                            } else {
	                                //layer.msg("用户删除失败!");
	                                console.log("用户删除失败!");
	                            }
	                            $state.reload();
	                        }, function () {
	                            //layer.msg("请求失败")
	                            console.log("请求失败");
	                        });
	                    }
	                }
	            });
	        }

	        //批量删除用户
	        //function deleteUsers(){
	        //    httpRequestPost("/api/user/deleteUserByIds",{
	        //        ids :  $scope.vm.deleteIds
	        //    },function(data){
	        //        $state.reload();
	        //    },function(){
	        //        layer.msg("请求失败")
	        //    })
	        //}

	        //批量删除用户
	        function deleteUsers() {
	            if ($scope.vm.deleteIds == 0) {
	                layer.msg("请您选择要删除的用户！");
	                return;
	            }
	            $scope.vm.simpleOperateTitle = "确认要删除吗";
	            var dialog = ngDialog.openConfirm({
	                template: "/static/base/public_html/simple_operate.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    if (e === 1) {
	                        httpRequestPost("/api/user/deleteUserByIds", {
	                            ids: $scope.vm.deleteIds
	                        }, function (data) {
	                            $state.reload();
	                        }, function () {
	                            //layer.msg("请求失败")
	                            console.log("请求失败");
	                        });
	                    }
	                }
	            });
	        }

	        //改变用户状态
	        function stop(userId, statusId) {
	            if (statusId == 10002) {
	                $scope.vm.simpleOperateTitle = "确认要启用该用户吗？";
	                var dialog = ngDialog.openConfirm({
	                    template: "/static/base/public_html/simple_operate.html",
	                    scope: $scope,
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        if (e === 1) {
	                            httpRequestPost("/api/user/updateStatus", {
	                                userId: userId,
	                                statusId: statusId
	                            }, function (data) {
	                                $state.reload();
	                                if (data.status == 10012) {
	                                    layer.msg("用户状态修改成功!");
	                                } else {
	                                    //layer.msg("用户状态修改失败!");
	                                    console.log("用户状态修改失败!");
	                                }
	                            }, function () {
	                                //layer.msg("请求失败")
	                                console.log("请求失败");
	                            });
	                        }
	                    }
	                });
	            } else {
	                $scope.vm.simpleOperateTitle = "确认要停用该用户吗？";
	                var dialog = ngDialog.openConfirm({
	                    template: "/static/base/public_html/simple_operate.html",
	                    scope: $scope,
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        if (e === 1) {
	                            httpRequestPost("/api/user/updateStatus", {
	                                userId: userId,
	                                statusId: statusId
	                            }, function (data) {
	                                $state.reload();
	                                if (data.status == 10012) {
	                                    layer.msg("用户状态修改成功!");
	                                } else {
	                                    //layer.msg("用户状态修改失败!");
	                                    console.log("用户状态修改失败!");
	                                }
	                            }, function () {
	                                //layer.msg("请求失败")
	                                console.log("请求失败");
	                            });
	                        }
	                    }
	                });
	            }
	        }

	        getApplication();
	        //得到应用列表
	        function getApplication() {
	            httpRequestPost("/api/application/application/listAllApplication", {}, function (data) {
	                $scope.vm.listApplication = data.data;
	            }, function () {
	                //layer.msg("请求失败")
	                console.log("请求失败");
	            });
	        }

	        //得到角色列表
	        getRole();
	        function getRole() {
	            httpRequestPost("/api/user/queryRoleList", {}, function (data) {
	                $scope.vm.listRole = data.data;
	            }, function () {
	                //layer.msg("请求失败")
	                console.log("请求失败");
	            });
	        }

	        function savaProp(ev, id) {
	            console.log(id);
	            if ($(ev.target).prop("checked")) {
	                $scope.vm.prop.push(id);
	            } else {
	                $scope.vm.prop.remove(id);
	            }
	        }

	        function saveProp(ev, id) {
	            if ($(ev.target).prop("checked")) {
	                $scope.vm.applicationIds.push(id);
	            } else {
	                $scope.vm.applicationIds.remove(id);
	            }
	        }

	        function filter(val, arr) {
	            var len = arr.length;
	            for (var i = 0; i < arr.length; i++) {
	                if (val != arr[i]) {
	                    len -= 1;
	                }
	            }
	            if (len == 0) {
	                return false;
	            } else {
	                return true;
	            }
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ })

});