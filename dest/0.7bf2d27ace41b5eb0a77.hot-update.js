webpackHotUpdate(0,{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/22.
	 * @Module :  入口文件
	 */
	var routeStates = void 0,
	    angular = void 0,
	    ngDepModules = [];
	angular = __webpack_require__(2);
	// require("oclazyload") ;
	// require("angular-cookies") ;
	// require("angular-ui-router");
	// require("angular-local-storage");
	// require("ng-dialog");
	// require("angular-route");
	function loadBasicModules() {
	    // 按需加载
	    __webpack_require__(5);
	    ngDepModules.push('oc.lazyLoad');
	    // 路由
	    __webpack_require__(6);
	    ngDepModules.push('ui.router');
	    // 本地存储
	    __webpack_require__(7);
	    ngDepModules.push('LocalStorageModule');
	    //cookie
	    __webpack_require__(9);
	    ngDepModules.push('ngCookies');
	    //弹框
	    __webpack_require__(11);
	    ngDepModules.push('ngDialog');
	    // 路由
	    __webpack_require__(12);
	    ngDepModules.push('ngRoute');
	}
	loadBasicModules();
	// define one angular module
	var xf_web = angular.module('xf_web', ngDepModules);
	//登录
	angular.module("loginModule", []);
	//首页
	angular.module("homePageModule", []);
	//系统管理
	angular.module("SMModule", []);
	// 加载controller
	__webpack_require__(14)(xf_web);
	// 加载指令
	__webpack_require__(15)(xf_web);
	// 加载config
	__webpack_require__(16)(xf_web);
	// 加载router
	// require('./entrance/app.router')(xf_web);
	// 加载service
	__webpack_require__(32)(xf_web);
	// require('./entrance/app.router')(xf_web);
	/**
	 * 配置路由。
	 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由，为了实现路由的多层嵌套
	 * @param  {[type]} $stateProvider
	 * @param  {[type]} $urlRouterProvider
	 * @return {[type]}
	 */
	xf_web.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider", "$routeProvider", "$locationProvider", "$provide", "$compileProvider", "$controllerProvider", "$filterProvider", "$ocLazyLoadProvider", "constantMethod", "$rootScopeProvider", function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, $routeProvider, $locationProvider, $provide, $compileProvider, $controllerProvider, $filterProvider, $ocLazyLoadProvider, constantMethod, $rootScopeProvider) {
	    $rootScopeProvider.digestTtl(15);
	    //--------------------------------------------------
	    //            配置ajax请求
	    //--------------------------------------------------
	    $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
	    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
	    // 禁止ajax缓存
	    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	    //    地址时间戳显示
	    // /* 根据url的变化加载内容 */
	    $httpProvider.interceptors.push(['$injector', function ($injector) {
	        return $injector.get('AuthInterceptor');
	    }]);

	    //--------------------------------------------------
	    //            配置localStorageServiceProvider
	    //--------------------------------------------------
	    localStorageServiceProvider.setPrefix("xf");
	    localStorageServiceProvider.setNotify(true, true);

	    //--------------------------------------------------
	    //            配置 将依赖的脚本进行注入操作
	    //--------------------------------------------------
	    xf_web.controller = $controllerProvider.register;
	    xf_web.directive = $compileProvider.directive;
	    xf_web.filter = $filterProvider.register;
	    xf_web.factory = $provide.factory;
	    xf_web.service = $provide.service;
	    xf_web.constant = $provide.constant;
	    xf_web.value = $provide.value;
	    //--------------------------------------------------
	    //            配置 将依赖的脚本进行注入操作
	    //--------------------------------------------------
	    $ocLazyLoadProvider.config({
	        debug: false,
	        events: false,
	        modules: constantMethod.Modules_Config
	    });
	    //--------------------------------------------------
	    //            路由 配置
	    //--------------------------------------------------
	    // $locationProvider.hashPrefix('!');
	    // $locationProvider.html5Mode(true);    // 如果不设置 路由不会生效
	    routeStates = __webpack_require__(19)(angular, constantMethod);
	    routeStates.forEach(function (state) {
	        $stateProvider.state(state);
	    });
	    $urlRouterProvider.otherwise(function ($injector, $location) {
	        $location.path('/HP/define');
	    });
	}]);

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 路由配置
	 */
	module.exports = function (angular) {
	    //  导航条 公共
	    var nav = __webpack_require__(20),

	    // 定义basePath
	    loginPath = "../static/login",
	        // 登录
	    homePath = "../static/index",
	        // 应用管理
	    applicationPath = "../static/login",
	        // 应用管理
	    knowledgePath = "../static/login",
	        // 知识管理
	    modelingPath = "../static/login",
	        // 业务建模
	    testingPath = "../static/login",
	        // 测试功能
	    analysisPath = "../static/login",
	        // 应用分析
	    materialgPath = "../static/login",
	        // 素材管理
	    deepLearningPath = "../static/login",
	        // 深度学习
	    systemPath = "../static/login"; // 系统监控
	    return [
	    //--------------------------------------------------
	    //           ##登录页面##
	    //--------------------------------------------------
	    {
	        name: "login",
	        url: "/login",
	        data: {
	            roles: []
	        },
	        title: "登录",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(6, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(7, function () {
	                    var loginModule = __webpack_require__(36)(angular); //动态加载Module
	                    $ocLazyLoad.load({
	                        name: "loginModule" //name就是你module的名称
	                    });
	                    defer.resolve(loginModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    //--------------------------------------------------
	    //          ##首页##
	    //--------------------------------------------------
	    {
	        name: "HP",
	        url: "/HP",
	        data: {
	            roles: []
	        },
	        title: "首页容器加载依赖",
	        template: __webpack_require__(21),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(8, function () {
	                    var homePageModule = __webpack_require__(27)(angular); //动态加载Module
	                    $ocLazyLoad.load({
	                        name: "homePageModule" //name就是你module的名称
	                    });
	                    defer.resolve(homePageModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // 首页
	    {
	        name: "HP.define",
	        url: "/define",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(22),
	                controller: "HomePageContentController"
	            }
	        }
	    },
	    // 应用 管理
	    {
	        name: "HP.management",
	        url: "/management",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "应用管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(35),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 权限管理
	    {
	        name: "HP.permission",
	        url: "/permission",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "默认首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(23),
	                controller: "PermissionController"
	            }
	        }
	    },
	    //--------------------------------------------------
	    //          ##应用管理MP##
	    //--------------------------------------------------
	    {
	        name: "AM",
	        url: "/AM",
	        data: {
	            roles: []
	        },
	        title: "应用管理",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(9, function () {
	                var template = __webpack_require__(38);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(10, function () {
	                    var applicationManagementModule = __webpack_require__(39)(angular);
	                    $ocLazyLoad.load({
	                        name: "applicationManagementModule"
	                    });
	                    defer.resolve(applicationManagementModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // 应用信息
	    {
	        name: "AM.info",
	        url: "/info",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "应用信息",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(55),
	                controller: "ApplicationInfoController"
	            }
	        }
	    },
	    // 备份还原
	    {
	        name: "AM.restore",
	        url: "/restore",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "备份还原",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(56),
	                controller: "BackupRestoreController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"homePageNav\">\r\n    <div class=\"header clearfix\">\r\n        <div class=\"logo\">\r\n            <a ui-sref=\"homePage.define\"><strong>小富机器人控制台</strong><em class=\"edition\">V4.0</em></a>\r\n            <!--<a ui-sref=\"homePage.define\"><strong>小富机器人控制平台</strong><em class=\"edition\">V4.0</em></a>-->\r\n        </div>\r\n        <ul class=\"nav\">\r\n            <li>\r\n                <a ui-sref=\"homePage.define\">首页</a>\r\n            </li>\r\n            <li>\r\n                <a ng-click=\"vm.logApplication()\">应用管理</a>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">业务建模<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"relationalCatalog.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jmzy\"></i>\r\n                            <span>BOT</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"frameworkLibrary.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lmgl\"></i>\r\n                            <span>框架库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"conceptManage.synony\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_gngl\"></i>\r\n                            <span>概念库</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">知识管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.custOverview\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zszl\"></i>\r\n                            <span>知识总览</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <ul class=\"menu_1 menu_2 \" style=\"min-height: 40%;\">\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.faqAdd\">\r\n                                    <span>FAQ知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.singleAddConcept\">\r\n                                    <span>概念知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                          \r\n                                <a ui-sref=\"knowledgeManagement.listAdd\">\r\n                                    <span>列表知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                             \r\n                                <a ui-sref=\"knowledgeManagement.factorAdd\">\r\n                                    <span>要素知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.markKnow\">\r\n                                    <span>富文本知识</span>\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                        <a href=\"javascript:;\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsjg\"></i>\r\n                            <span>知识单条新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.knowBatchAdditions\">\r\n                            <i class=\"icon-nav icon-nav__icon-zsplxz\"></i>\r\n                            <span>知识批量新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"back.gateway\">\r\n                            <i class=\"icon-nav icon-nav__icon-wdjgxz\"></i>\r\n                            <span>文档加工新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a ui-sref=\"setting.releaseMan\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zsfb\"></i>-->\r\n                            <!--<span>知识发布</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zssh\"></i>-->\r\n                            <!--<span>知识审核</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.historyView\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lsck\"></i>\r\n                            <span>历史查看</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">测试功能<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.questionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wfcs\"></i>\r\n                            <span>问法测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.sessionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltcs\"></i>\r\n                            <span>会话测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.batchTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_plcs\"></i>\r\n                            <span>批量测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.participle\">\r\n                            <i class=\"icon-nav icon-nav_fcyy\"></i>\r\n                            <span>分词应用</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">应用分析<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.accessStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fwtj\"></i>\r\n                            <span>访问统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.knowledgeRanking\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsdpm\"></i>\r\n                            <span>知识点排名统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_wpp\"></i>-->\r\n                            <!--<span>未匹配问题统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>-->\r\n                            <!--<span>分类统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionDetails\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_hhmx\"></i>\r\n                            <span>会话明细统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.satisfactionDegree\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jjltj\"></i>\r\n                            <span>会话满意度统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.resolutionStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>\r\n                            <span>问答解决率统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.reinforcementLearn\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_zqxx\" ></i>\r\n                            <span>智能学习</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.newKnowledgeDiscoveryLearn\">\r\n                            <i class=\"icon-nav icon-nav_xzzfx\" ></i>\r\n                            <span>未匹配问题聚类</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.operationLog\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_czrz\" ></i>\r\n                            <span>操作日志</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionLog\">\r\n                            <i class=\"icon-nav icon-nav_hhrz\" ></i>\r\n                            <span>会话日志</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">素材管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltzsk\"></i>\r\n                            <span>聊天知识库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_hxck\"></i>-->\r\n                            <!--<span>寒暄词库</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.pictureLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_tpk\"></i>\r\n                            <span>图片库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.teletextMessage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_twfxk\"></i>\r\n                            <span>图文消息库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.speechLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>语音库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.documentLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>文档库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li >-->\r\n                        <!--<a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>-->\r\n                            <!--<span>自动导入更新</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">深度学习<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deeplearnConfig\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>模型构建</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deepLearningCon\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxxl\"></i>\r\n                            <span>模型训练</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.similarityCalculation\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxcs\"></i>\r\n                            <span>模型测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>\r\n                            <span>自动导入更新</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">系统监控<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.resource\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>资源监控</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n        <div class=\"header-r\">\r\n            <div class=\"user-admin mr-20\">\r\n                <a class=\"user-name\" href=\"javascript:;\"><i></i><span>{{vm.userName}}</span></a>\r\n                <div class=\"ua-menu_1-box\">\r\n                    <ul class=\"ua-menu_1\">\r\n                        <li>\r\n                            <a ui-sref=\"HP.permission\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r1\"></i>\r\n                                <span>权限管理</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a ui-sref=\"HP.management\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r2\"></i>\r\n                                <span>切换应用</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:;\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r3\"></i>\r\n                                <span ng-click=\"vm.loginout()\">退出登录</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class=\"mail-conver\" style=\"margin-left:0;\">\r\n                <!--<a ui-sref=\"knowledgeManagement.historyView\" class=\"mail\">-->\r\n                    <!--&lt;!&ndash;<em>2</em>&ndash;&gt;-->\r\n                <!--</a>-->\r\n                <a  class=\"conver\" ng-click=\"vm.queryServiceList()\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"crumbs-nav bgwhite mt20  warp\" ng-show=\"checkShowCrumbs()\">\r\n    <span class=\"cn-lable\">你曾经路过此地：</span>\r\n\r\n    <span class=\"cn-value\" ng-repeat=\"crumb in crumbs track by $index\">\r\n        <a class=\"cn-a\" ui-sref=\"{{crumb.url}}\" ng-bind=\"crumb.name\"></a>\r\n        <i class=\"close\" ng-hide=\"checkShowClose(crumb.url)\" ng-click=\"closeCrumb($index)\" >x</i>\r\n    </span>\r\n</div>\r\n\r\n<style>\r\n\r\n\r\n</style>"

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

	module.exports = "<div class=\"homeWrapper\">\r\n    <div ui-view=\"header\"></div>\r\n\r\n    <div ui-view=\"sidebar\"></div>\r\n\r\n    <div ui-view=\"content\"></div>\r\n\r\n    <div ui-view=\"footer\"></div>\r\n</div>\r\n"

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

	module.exports = "<div class=\"i-nav\">\r\n    <div class=\"i-img-box i-img1\">\r\n        <a ui-sref=\"knowledgeManagement.custOverview\" >\r\n            <div class=\"psa\" >\r\n                <strong>客服场景知识管理</strong>\r\n                <p>可以针对客服场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img2\">\r\n        <a ui-sref=\"relationalCatalog.manage\">\r\n            <div class=\"psa\">\r\n                <strong>业务建模</strong>\r\n                <p>针对概念，业务分类进行继承复用以及上传</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img3\">\r\n        <a ui-sref=\"functionalTest.questionTest\">\r\n            <strong class=\"psa1\">测试功能</strong>\r\n            <p class=\"psa2\">提供多样化测试工具</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img4\">\r\n        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n            <strong class=\"psa1\">素材管理</strong>\r\n            <p class=\"psa2\">可以上传不同的富文本内容</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img5\">\r\n        <a ui-sref=\"back.gateway\">\r\n            <div class=\"psa\">\r\n                <strong>知识自动加工</strong>\r\n                <p>针对不同格式的知识，生成结构化知识的体系</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <div class=\"p20\" style=\"background:#fff;\">\r\n        <div class=\"text-c mb-20\">\r\n            <input type=\"text\" placeholder=\"用户姓名\" ng-model=\"vm.searchName\" style=\"width:250px\" class=\"input-text\">\r\n            <button class=\"btn1 btn1_blue\" type=\"button\"  ng-click=\"vm.search(1)\">搜用户</button>\r\n        </div>\r\n        <div class=\"bd p20\" style=\"background:#fcfdfd;\">\r\n            <div class=\"mb-10 cl\">\r\n            \t<span class=\"L\">\r\n                \t<button  class=\"btn1 btn1_blue\" ng-click=\"vm.addUser()\"> 添加用户</button>\r\n                </span>\r\n                <span class=\"R\">\r\n                \t<!--<button  class=\"btn1 btn_delete\"> 批量删除</button>-->\r\n                    <button  class=\"btn1 btn_delete\" ng-click=\"vm.deleteUsers()\"> 批量删除</button>\r\n                </span>\r\n            </div>\r\n            <div class=\"cl\">\r\n                <div class=\"r\">\r\n                    <!--<span class=\"c-999 pl-10\">共有数据：<strong id=\"user_total\">3</strong> 条 </span>-->\r\n                    <span class=\"c-999 pl-10\">共有数据：<b >{{vm.userDataTotal}}</b> 条</span>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"mt-20\">\r\n                <table class=\"stop_word_tab\" id=\"user_table\">\r\n                    <thead>\r\n                    <tr>\r\n                        <th class=\"bold\" width=\"3%\"><input class=\"selectAllBtn\" type=\"checkbox\" ng-click=\"vm.selectAll($event)\" ng-checked=\"vm.selectAllCheck || (vm.deleteIds.length == vm.listData.length)\"/></th>\r\n                        <th class=\"bold\" width=\"8%\">姓名</th>\r\n                        <th class=\"bold\" width=\"8%\">登录名</th>\r\n                        <th class=\"bold\" width=\"11%\">手机</th>\r\n                        <th class=\"bold\" width=\"13%\">邮箱</th>\r\n                        <th class=\"bold\" width=\"8%\">角色</th>\r\n                        <th class=\"bold\" width=\"15%\">更新时间</th>\r\n                        <th class=\"bold\" width=\"10%\">应用范围</th>\r\n                        <th class=\"bold\" width=\"9%\">状态</th>\r\n                        <th class=\"bold\" width=\"15%\">操作</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr ng-repeat=\"item in vm.listData\">\r\n                        <!--<td>    {{item}}</td>-->\r\n                        <td><input type=\"checkbox\" ng-checked=\"vm.selectAllCheck || vm.deleteIds.inArray(id)\" ng-click=\"vm.selectSingle($event,item.userId)\"/></td>\r\n                        <td>{{item.userName}}</td>\r\n                        <td>{{item.userLoginName}}</td>\r\n                        <td>{{item.userPhoneNumber}}</td>\r\n                        <td>{{item.userEmail}}</td>\r\n                        <td>{{item.roleName}}</td>\r\n                        <td>{{item.createTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                        <td><span ng-repeat=\"val in item.applicationName[0].data\">{{val.applicationName}}<i ng-if=\"$index!=item.applicationName[0].data.length-1\">,</i></span></td>\r\n                        <td>\r\n                            <span class=\"btn1 btn_green2\" ng-if=\"item.statusId==10001\">已启用</span>\r\n                            <span class=\"btn1 btn_red\" ng-if=\"item.statusId==10002\">未启用</span>\r\n                        </td>\r\n                        <td>\r\n                            <span ng-if=\"item.statusId==10001\"><a href=\"javascript:;\" title=\"停用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">停用</a></span>\r\n                            <span ng-if=\"item.statusId==10002\"><a href=\"javascript:;\" title=\"启用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">启用</a></span>\r\n\r\n                            <a href=\"javascript:;\" title=\"编辑\" class=\"mr-10 c-orange\" ng-click=\"vm.editUser(item)\">编辑</a>\r\n                            <a href=\"javascript:;\" title=\"删除\" class=\"mr-10 c-red\" ng-click=\"vm.deleteUser(item.userId)\">删除</a>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n            <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<style>\r\n\r\n\r\n</style>\r\n\r\n\r\n\r\n"

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <h4 class=\"pt-20 pb-20\"><img src=\"../../../../images/u15.png\" width=\"20\" height=\"20\" />\r\n        <b class=\"f16 ml-5 mt-5\" style=\"color:green;\">我的应用</b>\r\n    </h4>\r\n    <div class=\"p20 my_appbox cl mb-20\">\r\n        <div class=\"L\">\r\n            <div class=\"mb-10\">用户名称： {{vm.userName}}</div>\r\n            <div>\r\n                <!--<span>所属部门：云创中心</span>-->\r\n                <span>用户权限：\r\n                    <span ng-repeat=\"permission in vm.userPermission\" >{{permission}} </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"R\">\r\n            <div ng-click=\"vm.addApplicationWindow()\" style=\"cursor: pointer\">\r\n                <img src=\"../../../../images/u25.png\" width=\"50\" height=\"50\" />\r\n                <p class=\"mt-10\">新建应用</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"application_box clearfix\">\r\n        <div class=\"L text-c application_box_list bd\" ng-repeat=\"application in vm.myApplication\">\r\n            <a ui-sref=\"setting.Infor\" >\r\n                <!--<img ng-if=\"application.sceneId==2\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\"  src=\"../../../../images/marketing.png\" width=\"80\" height=\"80\"/>-->\r\n                <img ng-click=\"vm.selectScene(application.sceneId,application.id)\" src=\"../../../../images/cust_service.png\" width=\"80\" height=\"80\"/>\r\n                <!--<img ng-if=\"application.sceneId==3\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/images/u33.png\" width=\"80\" height=\"80\"/>-->\r\n            </a>\r\n            <div class=\"p10 mb-10 bd_bot\" >\r\n                <p title=\"{{application.name}}\" class=\"name\" >{{application.name | limitCheckFilter:8}}</p>\r\n                <!--<p class=\"name\" ng-if=\"application.name.length<=8\">{{application.name}}</p>-->\r\n                <p class=\"scene\">场景类型：<span>客服型</span></p>\r\n                    <p class=\"status\">应用状态：\r\n                        <span ng-if=\"application.statusId==40001\" class=\"c-orange\">未使用</span>\r\n                        <span ng-if=\"application.statusId==40002\" class=\"c-primary\">使用中</span>\r\n                        <span ng-if=\"application.statusId==40003\" class=\"c-error\">已停用</span>\r\n                    </p>\r\n            </div>\r\n            <p title=\"{{application.description}}\" class=\"describe\">{{application.description | limitCheckFilter:8}}</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .application_box{background:#fff;padding:20px 0 20px 20px; clear: both;}\r\n    .application_box_list{padding:10px;box-sizing:border-box;width:273px;margin:0 20px 20px 0;height:220px;}\r\n    .application_box_list p{min-height:21px;}\r\n    .application_box_list .describe{\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n    .application_box_list .status .c-blue{\r\n        color:lightblue;\r\n    }\r\n\r\n    \r\n</style>"

/***/ }),

/***/ 55:
/***/ (function(module, exports) {

	module.exports = "<div class=\"msgR-cont pd30 L\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>应用信息</span>\r\n    </div>\r\n    <p class=\"msgR-name\">{{vm.applicationInfo.applicationName}}\r\n                <span ng-click=\"vm.editName()\">\r\n                    <i></i>修改名称\r\n                </span>\r\n    </p>\r\n    <ul class=\"msgR-state\">\r\n        <li ng-if=\"vm.applicationInfo.statusId==40001\">应用状态：未使用</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40002\">应用状态：使用中</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40003\">应用状态：已停用</li>\r\n        <li>场景类型：<span ng-bind=\"'客服型'\"></span></li>\r\n        <li>创建时间：{{vm.applicationInfo.applicationCreateTime | date : 'yyyy-MM-dd'}}</li>\r\n    </ul>\r\n    <div class=\"jqrsz-btn-box\" style=\"padding: 30px 0;margin-bottom:0; \">\r\n        <a class=\"btn btn-blue mr10\" ng-click=\"vm.stopAllServices()\" >下线所有服务</a>\r\n        <a class=\"btn btn-gray mr10\" id=\"deletePop\" ng-click=\"vm.deleteApplication()\" style=\"background: #e2e2e2; color: #666;\">删除应用</a>\r\n        <a class=\"btn btn-green\" ui-sref=\"setting.backup\">备份/还原</a>\r\n    </div>\r\n    <p class=\"msgR-title mb-10\">应用高级信息</p>\r\n    <div class=\"clearfix\" >\r\n        <ul class=\"msgR-table-1 L\">\r\n            <li class=\"msgR-table-head\">场景信息</li>\r\n            <li>业务框架 <span>{{vm.sceneInfo.businessFrameNum}}种</span></li>\r\n            <li>知识类型 <span>{{vm.sceneInfo.knowledgeTypeNum}}种</span></li>\r\n            <li>交互方式 <span>{{vm.sceneInfo.exchangeModeNum}}种</span></li>\r\n        </ul>\r\n        <ul class=\"msgR-table-1 msgR-table-2 L\">\r\n            <li class=\"msgR-table-head\">发布信息</li>\r\n            <li ng-repeat=\"item in vm.serviceData\">\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30001\">未发布</span>\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30002\">已发布</span>\r\n                <span class=\"release\" ng-if=\"item.serviceStatus==30003\">已下线</span>\r\n                &nbsp; {{item.serviceName}}\r\n                <p ng-if=\"item.serviceStatus==30001\"><a class=\"release\" ng-click=\"vm.publishService(item.serviceId)\">发布</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30002\"><a class=\"Offline\" ng-click=\"vm.stopService(item.serviceId)\">下线</a>&nbsp; | &nbsp;<a class=\"restart\" ng-click=\"vm.restartService(item.serviceId)\">重启</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30003\"><a class=\"release\" ng-click=\"vm.startService(item.serviceId)\">上线</a>\r\n                </p>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n\r\n</div>\r\n"

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

	module.exports = "<div class=\"msgR-cont pd30 L backup_restore\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>备份还原</span>\r\n    </div>\r\n    <div class=\"pl50 mb-20 pt30\">\r\n        <h4 class=\"mb-20 bold\">系统备份</h4>\r\n        <div class=\"pl-20 mb-30\">\r\n            <div class=\"mb-15 system_backup clearfix\">\r\n                <span class=\"mr-20 L\">请选择您希望备份的模块</span>\r\n                <!--<label class=\"on\"> 知识管理</label>-->\r\n                <!--<label class=\"\"> 意图管理</label>-->\r\n                <!--<label class=\"\"> 系统管理</label>-->\r\n                <ul class=\"L\">\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>知识管理</li>\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>意图管理</li>\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>系统管理</li>\r\n                </ul>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"btn btn-primary\">开始备份</a> <span class=\"c-red\">*点击备份过后直接下载</span>\r\n        </div>\r\n        <h4 class=\"mb-20 bold\">系统还原</h4>\r\n        <div class=\"pl-20\">\r\n            <a href=\"javascript:;\" class=\"btn btn-primary\">开始还原</a> <span class=\"c-red\">*还原完成之后，是否退出系统</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ })

})