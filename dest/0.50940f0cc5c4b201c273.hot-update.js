webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/22.
	 * @Module :  项目入口模块 以及加载依赖关系
	 */
	// require('./assets/libs/ng-dialog/css/ngDialog.css');
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
	    // resource
	    __webpack_require__(7);
	    ngDepModules.push('ngResource');
	    // 本地存储
	    __webpack_require__(9);
	    ngDepModules.push('LocalStorageModule');
	    //cookie
	    __webpack_require__(11);
	    ngDepModules.push('ngCookies');
	    //弹框
	    __webpack_require__(13);
	    ngDepModules.push('ngDialog');
	    // 路由
	    __webpack_require__(14);
	    ngDepModules.push('ngRoute');
	}
	loadBasicModules();
	// define one angular module
	var xf_web = angular.module('xf_web', ngDepModules);
	// 加载controller
	__webpack_require__(16)(xf_web);
	// 加载指令
	__webpack_require__(17)(xf_web);
	// 加载config
	__webpack_require__(18)(xf_web);
	// 加载router
	// require('./entrance/app.router')(xf_web);
	// 加载service
	__webpack_require__(126)(xf_web);
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
	    routeStates = __webpack_require__(20)(angular, constantMethod);
	    routeStates.forEach(function (state) {
	        $stateProvider.state(state);
	    });
	    $urlRouterProvider.otherwise(function ($injector, $location) {
	        $location.path('/HP/define');
	    });
	}]);

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 路由配置
	 */
	module.exports = function (angular) {
	    //  导航条 公共
	    var nav = __webpack_require__(21),

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

	    var map = {
	        name: "xf_map",
	        nodes: [{
	            describe: "登录",
	            permissionId: "",
	            name: "login",
	            url: "/login",
	            children: ""
	        }]
	    };
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
	            __webpack_require__.e/* nsure */(2, function () {
	                var template = __webpack_require__(53);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
	                    var loginModule = __webpack_require__(54)(angular); //动态加载Module
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
	        template: __webpack_require__(22),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(4, function () {
	                    var homePageModule = __webpack_require__(57)(angular); //动态加载Module
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
	                template: __webpack_require__(23),
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
	                template: __webpack_require__(24),
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
	                template: __webpack_require__(25),
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
	            __webpack_require__.e/* nsure */(5, function () {
	                var template = __webpack_require__(62);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "ApplicationSettingController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(6, function () {
	                    var applicationManagementModule = __webpack_require__(63)(angular);
	                    $ocLazyLoad.load({
	                        name: "applicationManagementModule"
	                    });
	                    defer.resolve(applicationManagementModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // --------------------应用信息-------------------- //
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
	                template: __webpack_require__(26),
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
	                template: __webpack_require__(27),
	                controller: "BackupRestoreController"
	            }
	        }
	    },
	    // --------------------应用配置-------------------- //
	    // 机器人设置
	    {
	        name: "AM.robot",
	        url: "/robot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "机器人设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(28),
	                controller: "RobotSetupController"
	            }
	        }
	    },
	    // 参数设置
	    {
	        name: "AM.parameter",
	        url: "/parameter",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "参数设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(29),
	                controller: "ParameterSetupController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(30),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 授权管理
	    {
	        name: "AM.authorization",
	        url: "/authorization",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "授权管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(30),
	                controller: "AuthorizationManagementController"
	            }
	        }
	    },
	    // 热点知识配置
	    {
	        name: "AM.hot",
	        url: "/hot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(31),
	                controller: "HotKnowledgeSetupController"
	            }
	        }
	    },
	    // 场景管理
	    {
	        name: "AM.scene",
	        url: "/scene",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "场景管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(32),
	                controller: "SceneManageController"
	            }
	        }
	    },
	    // 渠道管理
	    {
	        name: "AM.channel",
	        url: "/channel",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "渠道管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(33),
	                controller: "ChannelManageController"
	            }
	        }
	    },
	    // --------------------应用发布-------------------- //
	    // 发布管理
	    {
	        name: "AM.release",
	        url: "/release",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "渠道管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(34),
	                controller: "ReleaseManageController"
	            }
	        }
	    },
	    // 节点管理
	    {
	        name: "AM.node",
	        url: "/node",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "节点管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(35),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //--------------------------------------------------
	    //          ##业务建模BM##
	    //--------------------------------------------------
	    {
	        name: "BM",
	        url: "/BM",
	        data: {
	            roles: []
	        },
	        title: "业务建模容器加载依赖",
	        template: __webpack_require__(36),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(7, function () {
	                    var businessModelingModule = __webpack_require__(81)(angular);
	                    $ocLazyLoad.load({
	                        name: "businessModelingModule"
	                    });
	                    defer.resolve(businessModelingModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // bot
	    {
	        name: "BM.bot",
	        url: "/bot",
	        data: {
	            roles: []
	        },
	        parent: "BM",
	        title: "bot",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(37),
	                controller: "BotController"
	            }
	        }
	    }, {
	        name: "BM.botApply",
	        url: "/botApply",
	        data: {
	            roles: []
	        },
	        parent: "BM",
	        title: "类目库套用",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(38),
	                controller: "BotApplyController"
	            }
	        }
	    },
	    // 框架库
	    {
	        name: "BM.frame",
	        url: "/frame",
	        data: {
	            roles: []
	        },
	        parent: "BM",
	        title: "框架库",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(39),
	                controller: "FrameLibraryController"
	            }
	        }
	    },
	    //概念库
	    {
	        name: "BM.concept",
	        url: "/concept",
	        data: {
	            roles: []
	        },
	        parent: "BM",
	        title: "概念库",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(40)
	                // controller: "FrameLibraryController"
	            }
	        }
	    },
	    // 集合概念
	    {
	        name: "BM.concept.aggregate",
	        url: "/concept/aggregate",
	        data: {
	            roles: []
	        },
	        parent: "BM",
	        title: "概念库",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(40)
	                // controller: "FrameLibraryController"
	            },
	            "footer": {
	                template: __webpack_require__(41),
	                controller: "AggregateConceptController"
	            }
	        }
	    },

	    //--------------------------------------------------
	    //          ##知识管理KM##
	    //--------------------------------------------------
	    {
	        name: "KM",
	        url: "/KM",
	        data: {
	            roles: []
	        },
	        title: "知识管理容器加载依赖",
	        template: __webpack_require__(42),
	        controller: "KnowledgeManagementController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(8, function () {
	                    var knowledgeManagementModule = __webpack_require__(93)(angular);
	                    $ocLazyLoad.load({
	                        name: "knowledgeManagementModule"
	                    });
	                    defer.resolve(knowledgeManagementModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // 知识总览
	    {
	        name: "KM.overview",
	        url: "/overview",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "知识总览",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(43),
	                controller: "CustOverviewController"
	            }
	        }
	    }, {
	        name: "KM.preview",
	        url: "/preview",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "知识查看",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(44),
	                controller: "CustPreviewController"
	            }
	        }
	    },
	    // 知识单条新增
	    //faq
	    // 新增
	    {
	        name: "KM.faq",
	        url: "/faq",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "faq 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(45),
	                controller: "FaqNewController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/faq/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "faq 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(45),
	                controller: "FaqEditController"
	            }
	        }
	    },
	    //概念
	    // 新增
	    {
	        name: "KM.concept",
	        url: "/concept",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "概念 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(46),
	                controller: "ConceptNewController"
	            }
	        }
	    },
	    // 编辑
	    {
	        name: "KM.concept.edit",
	        url: "/concept/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "概念 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(46),
	                controller: "ConceptEditController"
	            }
	        }
	    },
	    //列表
	    // 新增
	    {
	        name: "KM.list",
	        url: "/list",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "列表 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(47),
	                controller: "ConceptNewController"
	            }
	        }
	    },
	    // 编辑
	    {
	        name: "KM.list.edit",
	        url: "/list/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "列表 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(47),
	                controller: "ListEditController"
	            }
	        }
	    },
	    //要素
	    // 新增
	    {
	        name: "KM.factor",
	        url: "/factor",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "要素 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(48),
	                controller: "FactorNewController"
	            }
	        }
	    },
	    // 编辑
	    {
	        name: "KM.factor.edit",
	        url: "/factor/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "要素 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(48),
	                controller: "FactorEditController"
	            }
	        }
	    },
	    //富文本
	    // 新增
	    {
	        name: "KM.richText",
	        url: "/richText",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "富文本 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(49),
	                controller: "RichTextNewController"
	            }
	        }
	    },
	    // 编辑
	    {
	        name: "KM.richText.edit",
	        url: "/richText/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "富文本 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(49),
	                controller: "RichTextEditController"
	            }
	        }
	    },
	    //对话知识
	    // 新增
	    {
	        name: "KM.dialogue",
	        url: "/dialogue",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "对话 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(50),
	                controller: "DialogueNewController"
	            }
	        }
	    },
	    // 编辑
	    {
	        name: "KM.dialogue.edit",
	        url: "/dialogue/edit/:knowledgeId",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "对话 编辑",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(50),
	                controller: "DialogueEditController"
	            }
	        }
	    },
	    // 知识批量新增
	    {
	        name: "KM.batch",
	        url: "/batch",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "批量 新增",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(51),
	                controller: "KnowBatchAdditionsController"
	            }
	        }
	    },
	    // 文档加工
	    //     {
	    //         name: "KM.document",
	    //         url: "/document",
	    //         data: {
	    //             roles: []
	    //         },
	    //         parent : "KM",
	    //         title : "批量 新增" ,
	    //         views: {
	    //             "header": {
	    //                 template: nav,
	    //                 controller: "NavController"
	    //             },
	    //             "content": {
	    //                 template: require("../static/knowledge_management/views/batch/batch.html"),
	    //                 controller: "KnowBatchAdditionsController"
	    //             }
	    //         }
	    //     },
	    // 历史查看
	    {
	        name: "KM.history",
	        url: "/history",
	        data: {
	            roles: []
	        },
	        parent: "KM",
	        title: "历史查看",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(52),
	                controller: "HistoryViewController"
	            }
	        }
	    }];
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"homePageNav\">\r\n    <div class=\"header clearfix\">\r\n        <div class=\"logo\">\r\n            <a ui-sref=\"HP.define\"><strong>小富机器人控制台</strong><em class=\"edition\">V4.0</em></a>\r\n            <!--<a ui-sref=\"homePage.define\"><strong>小富机器人控制平台</strong><em class=\"edition\">V4.0</em></a>-->\r\n        </div>\r\n        <ul class=\"nav\">\r\n            <li>\r\n                <a ui-sref=\"HP.define\">首页</a>\r\n            </li>\r\n            <li>\r\n                <a ng-click=\"vm.logApplication()\">应用管理</a>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">业务建模<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"BM.bot\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jmzy\"></i>\r\n                            <span>BOT</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"BM.frame\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lmgl\"></i>\r\n                            <span>框架库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"BM.concept\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_gngl\"></i>\r\n                            <span>概念库</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">知识管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"KM.overview\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zszl\"></i>\r\n                            <span>知识总览</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <ul class=\"menu_1 menu_2 \" style=\"min-height: 40%;\">\r\n                            <li>\r\n                                <a ui-sref=\"KM.faq\">\r\n                                    <span>FAQ知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.concept\">\r\n                                    <span>概念知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                          \r\n                                <a ui-sref=\"KM.list\">\r\n                                    <span>列表知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                             \r\n                                <a ui-sref=\"KM.factor\">\r\n                                    <span>要素知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.richText\">\r\n                                    <span>富文本知识</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.dialogue\">\r\n                                    <span>对话知识</span>\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                        <a href=\"javascript:;\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsjg\"></i>\r\n                            <span>知识单条新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.batch\">\r\n                            <i class=\"icon-nav icon-nav__icon-zsplxz\"></i>\r\n                            <span>知识批量新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.document\">\r\n                            <i class=\"icon-nav icon-nav__icon-wdjgxz\"></i>\r\n                            <span>文档加工新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a ui-sref=\"setting.releaseMan\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zsfb\"></i>-->\r\n                            <!--<span>知识发布</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zssh\"></i>-->\r\n                            <!--<span>知识审核</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"KM.history\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lsck\"></i>\r\n                            <span>历史查看</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">测试功能<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.questionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wfcs\"></i>\r\n                            <span>问法测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.sessionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltcs\"></i>\r\n                            <span>会话测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.batchTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_plcs\"></i>\r\n                            <span>批量测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.participle\">\r\n                            <i class=\"icon-nav icon-nav_fcyy\"></i>\r\n                            <span>分词应用</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">应用分析<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.accessStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fwtj\"></i>\r\n                            <span>访问统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.knowledgeRanking\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsdpm\"></i>\r\n                            <span>知识点排名统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_wpp\"></i>-->\r\n                            <!--<span>未匹配问题统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>-->\r\n                            <!--<span>分类统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionDetails\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_hhmx\"></i>\r\n                            <span>会话明细统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.satisfactionDegree\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jjltj\"></i>\r\n                            <span>会话满意度统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.resolutionStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>\r\n                            <span>问答解决率统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.reinforcementLearn\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_zqxx\" ></i>\r\n                            <span>智能学习</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.newKnowledgeDiscoveryLearn\">\r\n                            <i class=\"icon-nav icon-nav_xzzfx\" ></i>\r\n                            <span>未匹配问题聚类</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.operationLog\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_czrz\" ></i>\r\n                            <span>操作日志</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionLog\">\r\n                            <i class=\"icon-nav icon-nav_hhrz\" ></i>\r\n                            <span>会话日志</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">素材管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltzsk\"></i>\r\n                            <span>聊天知识库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_hxck\"></i>-->\r\n                            <!--<span>寒暄词库</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.pictureLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_tpk\"></i>\r\n                            <span>图片库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.teletextMessage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_twfxk\"></i>\r\n                            <span>图文消息库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.speechLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>语音库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.documentLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>文档库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li >-->\r\n                        <!--<a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>-->\r\n                            <!--<span>自动导入更新</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">深度学习<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deeplearnConfig\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>模型构建</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deepLearningCon\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxxl\"></i>\r\n                            <span>模型训练</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.similarityCalculation\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxcs\"></i>\r\n                            <span>模型测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>\r\n                            <span>自动导入更新</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">系统监控<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.resource\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>资源监控</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.service\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>服务监控</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n        <div class=\"header-r\">\r\n            <div class=\"user-admin mr-20\">\r\n                <a class=\"user-name\" href=\"javascript:;\"><i></i><span>{{vm.userName}}</span></a>\r\n                <div class=\"ua-menu_1-box\">\r\n                    <ul class=\"ua-menu_1\">\r\n                        <li>\r\n                            <a ui-sref=\"HP.permission\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r1\"></i>\r\n                                <span>权限管理</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a ui-sref=\"HP.management\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r2\"></i>\r\n                                <span>切换应用</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:;\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r3\"></i>\r\n                                <span ng-click=\"vm.loginout()\">退出登录</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class=\"mail-conver\" style=\"margin-left:0;\">\r\n                <!--<a ui-sref=\"KM.historyView\" class=\"mail\">-->\r\n                    <!--&lt;!&ndash;<em>2</em>&ndash;&gt;-->\r\n                <!--</a>-->\r\n                <a  class=\"conver\" ng-click=\"vm.queryServiceList()\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"crumbs-nav bgwhite mt20  warp\" ng-show=\"checkShowCrumbs()\">\r\n    <span class=\"cn-lable\">你曾经路过此地：</span>\r\n\r\n    <span class=\"cn-value\" ng-repeat=\"crumb in crumbs track by $index\">\r\n        <a class=\"cn-a\" ui-sref=\"{{crumb.url}}\" ng-bind=\"crumb.name\"></a>\r\n        <i class=\"close\" ng-hide=\"checkShowClose(crumb.url)\" ng-click=\"closeCrumb($index)\" >x</i>\r\n    </span>\r\n</div>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"homeWrapper\">\r\n    <div ui-view=\"header\"></div>\r\n\r\n    <div ui-view=\"sidebar\"></div>\r\n\r\n    <div ui-view=\"content\"></div>\r\n\r\n    <div ui-view=\"footer\"></div>\r\n</div>\r\n"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"i-nav\">\r\n    <div class=\"i-img-box i-img1\">\r\n        <a ui-sref=\"knowledgeManagement.custOverview\" >\r\n            <div class=\"psa\" >\r\n                <strong>客服场景知识管理</strong>\r\n                <p>可以针对客服场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img2\">\r\n        <a ui-sref=\"relationalCatalog.manage\">\r\n            <div class=\"psa\">\r\n                <strong>业务建模</strong>\r\n                <p>针对概念，业务分类进行继承复用以及上传</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img3\">\r\n        <a ui-sref=\"functionalTest.questionTest\">\r\n            <strong class=\"psa1\">测试功能</strong>\r\n            <p class=\"psa2\">提供多样化测试工具</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img4\">\r\n        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n            <strong class=\"psa1\">素材管理</strong>\r\n            <p class=\"psa2\">可以上传不同的富文本内容</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img5\">\r\n        <a ui-sref=\"back.gateway\">\r\n            <div class=\"psa\">\r\n                <strong>知识自动加工</strong>\r\n                <p>针对不同格式的知识，生成结构化知识的体系</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <h4 class=\"pt-20 pb-20\"><img src=\"../../../../images/u15.png\" width=\"20\" height=\"20\" />\r\n        <b class=\"f16 ml-5 mt-5\" style=\"color:green;\">我的应用</b>\r\n    </h4>\r\n    <div class=\"p20 my_appbox cl mb-20\">\r\n        <div class=\"L\">\r\n            <div class=\"mb-10\">用户名称： {{vm.userName}}</div>\r\n            <div>\r\n                <!--<span>所属部门：云创中心</span>-->\r\n                <span>用户权限：\r\n                    <span ng-repeat=\"permission in vm.userPermission\" >{{permission}} </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"R\">\r\n            <div ng-click=\"vm.addApplicationWindow()\" style=\"cursor: pointer\">\r\n                <img src=\"../../../../images/u25.png\" width=\"50\" height=\"50\" />\r\n                <p class=\"mt-10\">新建应用</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"application_box clearfix\">\r\n        <div class=\"L text-c application_box_list bd\" ng-repeat=\"application in vm.myApplication\">\r\n            <a ui-sref=\"setting.Infor\" >\r\n                <!--<img ng-if=\"application.sceneId==2\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\"  src=\"../../../../images/marketing.png\" width=\"80\" height=\"80\"/>-->\r\n                <img ng-click=\"vm.selectScene(application.sceneId,application.id)\" src=\"../../../../images/cust_service.png\" width=\"80\" height=\"80\"/>\r\n                <!--<img ng-if=\"application.sceneId==3\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/images/u33.png\" width=\"80\" height=\"80\"/>-->\r\n            </a>\r\n            <div class=\"p10 mb-10 bd_bot\" >\r\n                <p title=\"{{application.name}}\" class=\"name\" >{{application.name | limitCheckFilter:8}}</p>\r\n                <!--<p class=\"name\" ng-if=\"application.name.length<=8\">{{application.name}}</p>-->\r\n                <p class=\"scene\">场景类型：<span>客服型</span></p>\r\n                    <p class=\"status\">应用状态：\r\n                        <span ng-if=\"application.statusId==40001\" class=\"c-orange\">未使用</span>\r\n                        <span ng-if=\"application.statusId==40002\" class=\"c-primary\">使用中</span>\r\n                        <span ng-if=\"application.statusId==40003\" class=\"c-error\">已停用</span>\r\n                    </p>\r\n            </div>\r\n            <p title=\"{{application.description}}\" class=\"describe\">{{application.description | limitCheckFilter:8}}</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .application_box{background:#fff;padding:20px 0 20px 20px; clear: both;}\r\n    .application_box_list{padding:10px;box-sizing:border-box;width:273px;margin:0 20px 20px 0;height:220px;}\r\n    .application_box_list p{min-height:21px;}\r\n    .application_box_list .describe{\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n    .application_box_list .status .c-blue{\r\n        color:lightblue;\r\n    }\r\n\r\n    \r\n</style>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <div class=\"p20\" style=\"background:#fff;\">\r\n        <div class=\"text-c mb-20\">\r\n            <input type=\"text\" placeholder=\"用户姓名\" ng-model=\"vm.searchName\" style=\"width:250px\" class=\"input-text\">\r\n            <button class=\"btn1 btn1_blue\" type=\"button\"  ng-click=\"vm.search(1)\">搜用户</button>\r\n        </div>\r\n        <div class=\"bd p20\" style=\"background:#fcfdfd;\">\r\n            <div class=\"mb-10 cl\">\r\n            \t<span class=\"L\">\r\n                \t<button  class=\"btn1 btn1_blue\" ng-click=\"vm.addUser()\"> 添加用户</button>\r\n                </span>\r\n                <span class=\"R\">\r\n                \t<!--<button  class=\"btn1 btn_delete\"> 批量删除</button>-->\r\n                    <button  class=\"btn1 btn_delete\" ng-click=\"vm.deleteUsers()\"> 批量删除</button>\r\n                </span>\r\n            </div>\r\n            <div class=\"cl\">\r\n                <div class=\"r\">\r\n                    <!--<span class=\"c-999 pl-10\">共有数据：<strong id=\"user_total\">3</strong> 条 </span>-->\r\n                    <span class=\"c-999 pl-10\">共有数据：<b >{{vm.userDataTotal}}</b> 条</span>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"mt-20\">\r\n                <table class=\"stop_word_tab\" id=\"user_table\">\r\n                    <thead>\r\n                    <tr>\r\n                        <th class=\"bold\" width=\"3%\"><input class=\"selectAllBtn\" type=\"checkbox\" ng-click=\"vm.selectAll($event)\" ng-checked=\"vm.selectAllCheck || (vm.deleteIds.length == vm.listData.length)\"/></th>\r\n                        <th class=\"bold\" width=\"8%\">姓名</th>\r\n                        <th class=\"bold\" width=\"8%\">登录名</th>\r\n                        <th class=\"bold\" width=\"11%\">手机</th>\r\n                        <th class=\"bold\" width=\"13%\">邮箱</th>\r\n                        <th class=\"bold\" width=\"8%\">角色</th>\r\n                        <th class=\"bold\" width=\"15%\">更新时间</th>\r\n                        <th class=\"bold\" width=\"10%\">应用范围</th>\r\n                        <th class=\"bold\" width=\"9%\">状态</th>\r\n                        <th class=\"bold\" width=\"15%\">操作</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr ng-repeat=\"item in vm.listData\">\r\n                        <!--<td>    {{item}}</td>-->\r\n                        <td><input type=\"checkbox\" ng-checked=\"vm.selectAllCheck || vm.deleteIds.inArray(id)\" ng-click=\"vm.selectSingle($event,item.userId)\"/></td>\r\n                        <td>{{item.userName}}</td>\r\n                        <td>{{item.userLoginName}}</td>\r\n                        <td>{{item.userPhoneNumber}}</td>\r\n                        <td>{{item.userEmail}}</td>\r\n                        <td>{{item.roleName}}</td>\r\n                        <td>{{item.createTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                        <td><span ng-repeat=\"val in item.applicationName[0].data\">{{val.applicationName}}<i ng-if=\"$index!=item.applicationName[0].data.length-1\">,</i></span></td>\r\n                        <td>\r\n                            <span class=\"btn1 btn_green2\" ng-if=\"item.statusId==10001\">已启用</span>\r\n                            <span class=\"btn1 btn_red\" ng-if=\"item.statusId==10002\">未启用</span>\r\n                        </td>\r\n                        <td>\r\n                            <span ng-if=\"item.statusId==10001\"><a href=\"javascript:;\" title=\"停用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">停用</a></span>\r\n                            <span ng-if=\"item.statusId==10002\"><a href=\"javascript:;\" title=\"启用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">启用</a></span>\r\n\r\n                            <a href=\"javascript:;\" title=\"编辑\" class=\"mr-10 c-orange\" ng-click=\"vm.editUser(item)\">编辑</a>\r\n                            <a href=\"javascript:;\" title=\"删除\" class=\"mr-10 c-red\" ng-click=\"vm.deleteUser(item.userId)\">删除</a>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n            <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<style>\r\n\r\n\r\n</style>\r\n\r\n\r\n\r\n"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"msgR-cont pd30 L\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>应用信息</span>\r\n    </div>\r\n    <p class=\"msgR-name\">{{vm.applicationInfo.applicationName}}\r\n                <span ng-click=\"vm.editName()\">\r\n                    <i></i>修改名称\r\n                </span>\r\n    </p>\r\n    <ul class=\"msgR-state\">\r\n        <li ng-if=\"vm.applicationInfo.statusId==40001\">应用状态：未使用</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40002\">应用状态：使用中</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40003\">应用状态：已停用</li>\r\n        <li>场景类型：<span ng-bind=\"'客服型'\"></span></li>\r\n        <li>创建时间：{{vm.applicationInfo.applicationCreateTime | date : 'yyyy-MM-dd'}}</li>\r\n    </ul>\r\n    <div class=\"jqrsz-btn-box\" style=\"padding: 30px 0;margin-bottom:0; \">\r\n        <a class=\"btn btn-blue mr10\" ng-click=\"vm.stopAllServices()\" >下线所有服务</a>\r\n        <a class=\"btn btn-gray mr10\" id=\"deletePop\" ng-click=\"vm.deleteApplication()\" style=\"background: #e2e2e2; color: #666;\">删除应用</a>\r\n        <a class=\"btn btn-green\" ui-sref=\"AM.restore\">备份/还原</a>\r\n    </div>\r\n    <p class=\"msgR-title mb-10\">应用高级信息</p>\r\n    <div class=\"clearfix\" >\r\n        <ul class=\"msgR-table-1 L\">\r\n            <li class=\"msgR-table-head\">场景信息</li>\r\n            <li>业务框架 <span>{{vm.sceneInfo.businessFrameNum}}种</span></li>\r\n            <li>知识类型 <span>{{vm.sceneInfo.knowledgeTypeNum}}种</span></li>\r\n            <li>交互方式 <span>{{vm.sceneInfo.exchangeModeNum}}种</span></li>\r\n        </ul>\r\n        <ul class=\"msgR-table-1 msgR-table-2 L\">\r\n            <li class=\"msgR-table-head\">发布信息</li>\r\n            <li ng-repeat=\"item in vm.serviceData\">\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30001\">未发布</span>\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30002\">已发布</span>\r\n                <span class=\"release\" ng-if=\"item.serviceStatus==30003\">已下线</span>\r\n                &nbsp; {{item.serviceName}}\r\n                <p ng-if=\"item.serviceStatus==30001\"><a class=\"release\" ng-click=\"vm.publishService(item.serviceId)\">发布</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30002\"><a class=\"Offline\" ng-click=\"vm.stopService(item.serviceId)\">下线</a>&nbsp; | &nbsp;<a class=\"restart\" ng-click=\"vm.restartService(item.serviceId)\">重启</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30003\"><a class=\"release\" ng-click=\"vm.startService(item.serviceId)\">上线</a>\r\n                </p>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n\r\n</div>\r\n"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"msgR-cont pd30 L backup_restore\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>备份还原</span>\r\n    </div>\r\n    <div class=\"pl50 mb-20 pt30\">\r\n        <h4 class=\"mb-20 bold\">系统备份</h4>\r\n        <div class=\"pl-20 mb-30\">\r\n            <div class=\"mb-15 system_backup clearfix\">\r\n                <span class=\"mr-20 L\">请选择您希望备份的模块</span>\r\n                <!--<label class=\"on\"> 知识管理</label>-->\r\n                <!--<label class=\"\"> 意图管理</label>-->\r\n                <!--<label class=\"\"> 系统管理</label>-->\r\n                <ul class=\"L\">\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>知识管理</li>\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>意图管理</li>\r\n                    <li class=\"L\"><div class=\"L\" checkbox-backup></div>系统管理</li>\r\n                </ul>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"btn btn-primary\">开始备份</a> <span class=\"c-red\">*点击备份过后直接下载</span>\r\n        </div>\r\n        <h4 class=\"mb-20 bold\">系统还原</h4>\r\n        <div class=\"pl-20\">\r\n            <a href=\"javascript:;\" class=\"btn btn-primary\">开始还原</a> <span class=\"c-red\">*还原完成之后，是否退出系统</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"robotSetup r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>机器人设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh\">\r\n        <!--<form name=\"mySetting\" class=\"css-form\" novalidate ng-submit=\"vm.editRobot(mySetting.$valid)\">-->\r\n        <form name=\"mySetting\" class=\"css-form\" novalidate>\r\n        <div class=\"jqrsz-item\">\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">机器人昵称：</span>\r\n                <div>\r\n                    <input name=\"robotName\" class=\"input-text\" type=\"text\" placeholder=\"给机器人起个名字吧\"\r\n                           ng-model=\"vm.robotName\" ng-maxlength=\"8\" ng-pattern=\"/^[\\u2E80-\\uFE4F]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotName.$dirty && mySetting.robotName.$invalid\">\r\n                        昵称输入不能超过8个汉字，请重新输入！\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"item-line mt15 mb10\">\r\n                <div class=\"lable\">\r\n                    机器人头像：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"poto-box\">\r\n                        <!--<img ng-src=\"{{vm.imgUrl}}{{vm.robotHead}}\"/>-->\r\n                        <img ng-src=\"/img/{{vm.robotHead}}\"/>\r\n                    </div>\r\n                    <div class=\"up-tip\">\r\n                        网页聊天中左上角展示的圆形头像，<br />设置像素为70*70\r\n                    </div>\r\n                    <div class=\"up-btn\">\r\n                        <a class=\"js-jdbtn\" ng-click=\"vm.addClassic()\">经典</a>\r\n                        <a class=\"js-zdybtn\" ng-click=\"vm.addCustom()\">自定义</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">欢迎语：</span>\r\n                <div>\r\n                    <textarea class=\"textarea\" name=\"robotWelcome\" check-welcome=\"robotWelcome\" placeholder=\"请再次输入欢迎语!\"\r\n                              ng-model=\"vm.robotWelcome\"\r\n                              ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！\\\\r\\n]+$/\"/> >小富机器人欢迎您！</textarea>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotWelcome.$error.pattern\">\r\n                        欢迎语只能是汉字，请重新输入\r\n                    </div>\r\n                    <!--{{mySetting.robotWelcome.$error.len}}-->\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotWelcome.$error.len\">\r\n                        欢迎语不能超过10条，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!--<div class=\"setting_div\">-->\r\n                <!--<span class=\"setting_span\">企业名称设置：</span>-->\r\n                <!--<div>-->\r\n                    <!--<input class=\"input-text\" type=\"text\" name=\"\" placeholder=\"\" />-->\r\n                    <!--<div class=\"error-tip c-red\" >-->\r\n                        <!--错误提示-->\r\n                    <!--&lt;!&ndash;</div>&ndash;&gt;-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n\r\n        </div>\r\n\r\n        <div class=\"jqrsz-item\">\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">热点知识更新频率：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotHotQuestionTimeout\" placeholder=\"热点问题的更新频率，只限正整数\"\r\n                           ng-model=\"vm.robotHotQuestionTimeout\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\" />\r\n                    <span>分钟</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotHotQuestionTimeout.$dirty && mySetting.robotHotQuestionTimeout.$invalid\">\r\n                        热点知识更新频率必须大于0，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">未知回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotUnknown\" placeholder=\"当机器人答不上来时，机器人的回复\"\r\n                           ng-model=\"vm.robotUnknown\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotUnknown.$dirty && mySetting.robotUnknown.$invalid\">\r\n                        您输入的未知回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">敏感词回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotSensitive\" placeholder=\"当会话中包含敏感词时，机器人的回复\"\r\n                           ng-model=\"vm.robotSensitive\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotSensitive.$dirty && mySetting.robotSensitive.$invalid\">\r\n                        您输入的敏感词回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">过期知识回答：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotExpire\" type=\"text\" placeholder=\"当问答的知识已经过期了，机器人的回复\"\r\n                           ng-model=\"vm.robotExpire\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotExpire.$dirty && mySetting.robotExpire.$invalid\">\r\n                        过期知识回答不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"jqrsz-item\">\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">重复回答次数：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotRepeatNumber\"\r\n                           ng-model=\"vm.robotRepeatNumber\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\"/>\r\n                    <span>次</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotRepeatNumber.$dirty && mySetting.robotRepeatNumber.$invalid\">\r\n                        重复回答次数必须设置为大于0，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">重复回答提示：</span>\r\n                <div>\r\n                    <input class=\"input-text\" type=\"text\" name=\"robotRepeat\" placeholder=\"当用户重复回答超过设置次数时，机器人的回复\"\r\n                           ng-model=\"vm.robotRepeat\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotRepeat.$dirty && mySetting.robotRepeat.$invalid\">\r\n                        重复回答提示不能超过50个字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">会话超时时间：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotTimeoutLimit\" type=\"text\"\r\n                           ng-model=\"vm.robotTimeoutLimit\" style=\"width: 190px;\" ng-pattern=\"/^([1-9][0-9]*){1,3}$/\"/>\r\n                    <span>分钟</span>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotTimeoutLimit.$dirty && mySetting.robotTimeoutLimit.$invalid\">\r\n                        会话超时时间必须设置为大于0，请重新设置\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"setting_div\">\r\n                <span class=\"setting_span\">会话超时提示：</span>\r\n                <div>\r\n                    <input class=\"input-text\" name=\"robotTimeout\" type=\"text\" placeholder=\"当会话超时后，机器人的回复\"\r\n                           ng-model=\"vm.robotTimeout\" ng-maxlength=\"50\"\r\n                           ng-pattern=\"/^[\\u2E80-\\uFE4F\\（\\）\\《\\》\\——\\；\\，\\。\\“\\”\\<\\>\\！]+$/\"/>\r\n                    <div class=\"error-tip c-red\" ng-show=\"mySetting.robotTimeout.$dirty && mySetting.robotTimeout.$invalid\">\r\n                        会话超时提示不能超过50个汉字，请重新输入\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"tc\">\r\n            <button class=\"btn1 btn1_blue mr10\" ng-click=\"vm.editRobot(mySetting.$valid)\">保存</button>\r\n            <!--<button  class=\"btn btn-blue mr10\" type=\"submit\">保存</button>-->\r\n            <button class=\"btn1 btn_gray\" ng-click=\"vm.queryRobotParameter()\">取消</button>\r\n        </div>\r\n        </form>\r\n    </div>\r\n\r\n</div>\r\n"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30 parameterSetting\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>参数设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh pt30 \">\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    评论小尾巴：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"dib pt-5 mr-15\">\r\n                        <div switch value=\"vm.settingCommentOn\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    寒暄开关：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <div class=\"dib pt-5 mr-15\">\r\n                        <div switch value=\"vm.settingGreetingOn\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--<div class=\"jqrsz-item jqrsz-item2\">-->\r\n            <!--<div class=\"item-line\">-->\r\n                <!--<div class=\"lable\">-->\r\n                    <!--话轮识别：-->\r\n                <!--</div>-->\r\n                <!--<div class=\"value\">-->\r\n                    <!--<div class=\"dib pt-5 mr-15\">-->\r\n                        <!--<div ng-class=\"{1: 'open1 b_box', 0: 'close1 b_box'}[vm.settingTurnRoundOn]\"-->\r\n                             <!--ng-click=\"vm.turnOn(vm.settingTurnRoundOn,'settingTurnRoundOn')\"-->\r\n                             <!--style=\"float:left;margin-right:10px;\">-->\r\n                            <!--<div ng-class=\"{1: 'open2 s_box', 0: 'close2 s_box'}[vm.settingTurnRoundOn]\"></div>-->\r\n                        <!--</div>-->\r\n                    <!--</div>-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    关联个数：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingRelateNumber\"\r\n                           ng-change=\"vm.parameterLimit(1,'settingRelateNumber')\" step=\"1\"\r\n                           placeholder=\"配置关联问题的个数，标准格式为数字型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    推荐个数：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingRecommendNumber\"\r\n                           ng-change=\"vm.parameterLimit(1,'settingRecommendNumber')\" step=\"1\"\r\n                           placeholder=\"配置推荐问题个数，标准格式为数字型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--<div class=\"jqrsz-item jqrsz-item2\">-->\r\n            <!--<div class=\"item-line\">-->\r\n                <!--<div class=\"lable\">-->\r\n                    <!--获取数据时间：-->\r\n                <!--</div>-->\r\n                <!--<div class=\"value\">-->\r\n                    <!--<input class=\"input-text\" type=\"number\" ng-model=\"vm.settingDataTimeoutLimit\"-->\r\n                           <!--ng-change=\"vm.parameterLimit(1,'settingDataTimeoutLimit')\" step=\"1\"-->\r\n                           <!--placeholder=\"获取数据时间限制，标准格式为数字型\" style=\"width: 350px;\" required>-->\r\n                <!--</div>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    上限阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingUpperLimit\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingUpperLimit')\" step=\"0.1\"\r\n                           placeholder=\"配置上限阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    下限阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingLowerLimit\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingLowerLimit')\" step=\"0.1\"\r\n                           placeholder=\"配置下线阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-item jqrsz-item2\">\r\n            <div class=\"item-line\">\r\n                <div class=\"lable\">\r\n                    寒暄阈值：\r\n                </div>\r\n                <div class=\"value\">\r\n                    <input class=\"input-text\" type=\"number\" ng-model=\"vm.settingGreetingThreshold\"\r\n                           ng-change=\"vm.parameterLimit(0,'settingGreetingThreshold')\" step=\"0.1\"\r\n                           placeholder=\"配置寒暄阈值，标准格式为float型\" style=\"width: 350px;\" required>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"jqrsz-btn-box\">\r\n            <a class=\"btn btn-blue mr10\" ng-click=\"vm.updateParameter()\">保存</a>\r\n            <a class=\"btn btn-gray\" ng-click=\"vm.queryParameter()\">取消</a>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"robotSetup r-cont pd30 manual\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>转人工设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh mb20 mt30 \" style=\"padding-left:85px;\">\r\n        <div class=\"setting_div mb20 pr\" style=\"padding-left:130px;\">\r\n            <span class=\"setting_span pa\" style=\"width:130px;\">人工客服有效期：</span>\r\n            <div class=\"clearfix\">\r\n                <span class=\"L mr10\">\r\n                    <input type=\"text\" id=\"startTime\" onchange=\"\" ng-model=\"vm.workStartTime\" onclick=\"WdatePicker({dateFmt:'HH:mm:ss',maxDate:'#F{$dp.$D(\\'endTime\\')}',onpicked:function(){}})\" class=\"input-text Wdate\" style=\"width:185px;border:1px solid #e1e1e1;height:31px;font-size:14px;\" placeholder=\"HH:mm:ss\" readonly=\"readonly\">\r\n                    -\r\n                    <input type=\"text\" id=\"endTime\" onchange=\"\" ng-model=\"vm.workEndTime\" onclick=\"WdatePicker({dateFmt:'HH:mm:ss',maxDate:'#F{$dp.$D(\\'endTime\\')}',onpicked:function(){}})\" class=\"input-text Wdate\" style=\"width:185px;border:1px solid #e1e1e1;height:31px;font-size:14px;\" placeholder=\"HH:mm:ss\" readonly=\"readonly\">\r\n                </span>\r\n                <span class=\"L pt-5\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave =\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span\" >人工客服有效期</span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"setting_div mb20 pr\" style=\"padding-left:130px;\">\r\n            <span class=\"setting_span pa\" style=\"width:130px;line-height:20px;\">转人工条件：</span>\r\n            <div class=\"clearfix mb30\">\r\n                <label class=\"L mr30\"><input type=\"checkbox\" ng-model=\"vm.commandOn\"  ng-checked=\"vm.commandOn\"/> 人工命令</label>\r\n\r\n                <!--<div class=\"L mr30\"><div checkbox-backup class=\"L\"></div><span class=\"L\">人工命令</span></div>-->\r\n                <span class=\"L\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave=\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span \" >人工命令</span>\r\n                </span>\r\n            </div>\r\n            <div class=\"clearfix mb30\">\r\n                <label class=\"L mr30\"><input type=\"checkbox\"  ng-model=\"vm.noAnswerOn\"  name=\"checkbox\"  ng-checked=\"vm.noAnswerOn\"/> 机器人未直接回答</label>\r\n                <!--<div class=\"L mr30\"><div checkbox-backup class=\"L\" ng-model=\"vm.noAnswerOn\" ng-click=\"toggleNum()\"></div><span class=\"L\">机器人未直接回答</span></div>-->\r\n                <span class=\"L\" >\r\n                    <a href=\"javascript:;\" class=\"tool_tip\" ng-mouseenter=\"vm.showTip($event)\" ng-mouseleave=\"vm.hideTip($event)\"></a>\r\n                    <span class=\"pd-5 tooltip_span\" >机器人未直接回答</span>\r\n                </span>\r\n            </div>\r\n            <div class=\"clearfix mb20\">\r\n                未直接回答次数：\r\n                <input type=\"text\" class=\"bd txt input_xs\" ng-model=\"vm.noAnswerNumber\" ng-keyup=\"vm.checkNum()\" ng-disabled=\"!vm.noAnswerOn\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\" pt30 pb30 pl130\">\r\n            <button class=\"btn btn-primary\" ng-click=\"vm.saveData()\">保存</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n<script>\r\n\r\n</script>\r\n"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>热点知识设置</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"pr con_box_serl bd mr10\" style=\"margin:0 auto 20px;\">\r\n                <input type=\"text\" class=\"txt L\" placeholder=\"\" ng-model=\"vm.hotQuestionTitle\" style=\"width:257px;\">\r\n                <!--<input type=\"button\" class=\"btn1\" value=\"查找\" >-->\r\n                <button class=\"btn1\" type=\"button\"  ng-click=\"vm.queryHotKnowledgeList()\">查找</button>\r\n            </div>\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                            <button class=\"L btn1 btn_delete mr-10\" ng-click=\"vm.removeHotKnowledge()\">批量删除</button>\r\n                        \t<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vm.addHotHotKnow()\">添加</button>\r\n                            <button class=\"btn1 btn_green\" ng-click=\"vm.setFlag=!vm.setFlag\"><span style=\"color:#fff;\" ng-if=\"vm.setFlag\">手动设置</span><span style=\"color:#fff;\" ng-if=\"!vm.setFlag\">自动设置</span></button>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <!--<span>共有数据：<b >3</b> 条</span>-->\r\n                             <span class=\"c-999 pl-10\">共有数据：<b >{{vm.hotPaginationConf.totalItems}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <th class=\"bold\" width=\"5%\"><input class=\"selectAllBtn\" type=\"checkbox\" ng-click=\"vm.selectAllHotKnow()\" ng-checked=\"vm.isAllHotKnowSelected\"/></th>\r\n                            <th class=\"bold\" width=\"15%\">热点知识</th>\r\n                            <th class=\"bold\" width=\"12%\">排序</th>\r\n                            <th class=\"bold\" width=\"18%\">最终问及时间</th>\r\n                            <th class=\"bold\" width=\"17%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.hotKnowList\">\r\n                            <!--{{vm.hotKnowList}}-->\r\n                            <!--<td><input type=\"checkbox\" ng-checked=\"vm.isAllHotKnowSelected\" ng-click=\"vm.selectSingle($event,item.hotQuestionId)\"/></td>-->\r\n                            <td><input type=\"checkbox\" ng-checked=\"vm.hotKnowDelIds.inArray(item.hotQuestionId)\" ng-click=\"vm.selectSingleHotKnow(item.hotQuestionId)\"/></td>\r\n                            <td>{{item.hotQuestionTitle}}</td>\r\n                            <td>{{item.hotQuestionOrder}}</td>\r\n                            <td>{{item.hotQuestionUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary mr-10\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\"  ng-click=\"vm.toTop(item)\"  ng-if=\"item.hotQuestionOrder!=1\" value=\"置顶\">\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary mr-10\"  ng-click=\"vm.move(item)\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\" ng-if=\"item.hotQuestionOrder!=1\" value=\"上移\">\r\n                                <input type=\"button\" ng-disabled=\"!vm.setFlag\"  style=\"display: inline-block;background:#fff\" class=\"c-primary\"  ng-click=\"vm.down(item)\" ng-class=\"{true:'cur-point',false:'cur-disable'}[vm.setFlag]\"  ng-if=\"item.hotQuestionOrder!=vm.vm.hotPaginationConf.totalItems || item.hotQuestionOrder == 1\" value=\"下移\">\r\n                                <!--<input class=\"c-primary mr-10\" href=\"javascript:;\" ng-click=\"vm.move(item)\"  ng-if=\"item.hotQuestionOrder!=1\">上移</a>-->\r\n                                <!--<a  class=\"c-primary\" href=\"javascript:;\" ng-click=\"vm.down(item)\"  ng-if=\"item.hotQuestionOrder!=vm.vm.hotPaginationConf.totalItems || item.hotQuestionOrder == 1\">下移</a>-->\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.hotPaginationConf.totalItems && vm.hotPaginationConf.totalItems>0\" conf=\"vm.hotPaginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n</style>"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd mb-20\">\r\n        <span>场景管理</span>\r\n    </div>\r\n    <div class=\"scene_box\">\r\n        <div class=\"scene_box_top\">\r\n            <span  ng-click=\"vm.showType=0\" ng-class=\"{1: '', 0: 'cur'}[vm.showType]\">知识类型</span>\r\n            <span id=\"exchangeMode\"  ng-click=\"vm.showType=1\" ng-class=\"{1: 'cur', 0: ''}[vm.showType]\">交互方式</span>\r\n        </div>\r\n        <div class=\"scene_box_bot\">\r\n            <div style=\"display:block;\" ng-show=\"!vm.showType\">\r\n                <h3 ng-if=\"vm.sceneId==1\" class=\"pt-20 pb-20 f16\">客服型场景所包含的知识类型</h3>\r\n                <h3 ng-if=\"vm.sceneId==2\" class=\"pt-20 pb-20 f16\">营销型场景所包含的知识类型</h3>                <div class=\"mb-20\" >\r\n                    <input type=\"text\" class=\"bd input-text \" ng-model=\"vm.wordsForKnowType\" placeholder=\"请输入知识框架\" style=\"width:257px;\">\r\n                    <input type=\"button\" class=\"btn1 btn1_blue \" value=\"查找\" ng-click=\"vm.queryKnowledgeType(vm.wordsForKnowType)\">\r\n                </div>\r\n                <div class=\"cl\" >\r\n                    <div class=\"bd know_style\" style=\"height:180px;\" ng-repeat=\"item in vm.knowledgeTypeData\">\r\n                        <p class=\"tc\">{{item.knowledgeTypeName}}</p>\r\n                        <dl class=\"bd_bot text-c pb-10 mb-10\">\r\n                            <dt><img src=\"../../../images/images/u1435.png \" width=\"50\" height=\"50\"/></dt>\r\n                            <!--<dd>-->\r\n                                <!--<a ng-click=\"vm.updateKnowledgeType(item);\" ng-if=\"item.statusId==20001\">禁用</a>-->\r\n                                <!--<a ng-click=\"vm.updateKnowledgeType(item);\" ng-if=\"item.statusId==20002\">启用</a>-->\r\n                            <!--</dd>-->\r\n                        </dl>\r\n                        <p class=\"c-999\">*{{item.knowledgeTypeDescription}}</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div  ng-show=\"vm.showType\">\r\n                <h3 ng-if=\"vm.sceneId==1\" class=\"pt-20 pb-20 f16\">客服型场景所包含的知识类型</h3>\r\n                <h3 ng-if=\"vm.sceneId==2\" class=\"pt-20 pb-20 f16\">营销型场景所包含的知识类型</h3>\r\n                <div class=\"mb-20\" >\r\n                    <input type=\"text\" class=\"bd input-text \" ng-model=\"vm.wordsInterviewMode\" placeholder=\"请输入交互方式\" style=\"width:257px;\">\r\n                    <input type=\"button\" class=\"btn1 btn1_blue \" value=\"查找\" ng-click=\"vm.listExchangeMode(vm.wordsInterviewMode)\">\r\n                </div>\r\n                <div class=\"cl\">\r\n                    <!--<div class=\"bd know_style\" style=\"height:180px;\" ng-repeat=\"item in vm.exchangeModeData\">-->\r\n                        <!--<p class=\"tc\">{{item.exchangeModeName}}</p>-->\r\n                        <!--<dl class=\"bd_bot text-c pb-10 mb-10\">-->\r\n                            <!--<dt><img src=\"../../../images/images/u1456.png \" width=\"50\" height=\"50\"/></dt>-->\r\n                            <!--<dd>-->\r\n                                <!--&lt;!&ndash;<a ng-click=\"vm.updateExchangeMode(item);\" ng-if=\"item.statusId==20001\">禁用</a>&ndash;&gt;-->\r\n                                <!--&lt;!&ndash;<a ng-click=\"vm.updateExchangeMode(item);\" ng-if=\"item.statusId==20002\">启用</a>&ndash;&gt;-->\r\n                                <!--<a ng-if=\"item.exchangeModeId==13&&item.statusId==20001\" ng-click=\"vm.saveMultiInteractive()\">配置</a>-->\r\n                            <!--</dd>-->\r\n                        <!--</dl>-->\r\n                        <!--<p class=\"c-999\">{{item.exchangeDescription}}</p>-->\r\n                    <!--</div>-->\r\n                    <div>\r\n                        <table class=\"stop_word_tab\">\r\n                            <tr>\r\n                                <td width=\"20%\" class=\"bold\">交互方式</td>\r\n                                <td width=\"60%\" class=\"bold\">详情</td>\r\n                                <td width=\"20%\" class=\"bold\">操作</td>\r\n                            </tr>\r\n                            <tr ng-repeat=\"item in vm.exchangeModeData\">\r\n                                <td>{{item.exchangeModeName}}</td>\r\n                                <td>{{item.exchangeDescription}}</td>\r\n                                <td><a ng-if=\"item.exchangeModeId==13&&item.statusId==20001\" ng-click=\"vm.multipleConversationSetup()\">多轮会话配置</a></td>\r\n                            </tr>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>渠道管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <!--<div class=\"pr con_box_serl bd mr10\" style=\"margin:0 auto 20px;\">-->\r\n            <!--<input type=\"text\" class=\"txt L\" placeholder=\"请输入维度名称\"  style=\"width:257px;\">-->\r\n            <!--<input type=\"button\" class=\"btn1\" value=\"查找\" >-->\r\n            <!--</div>-->\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<!--<span class=\"L\">-->\r\n                            <!--&lt;!&ndash;<button class=\"L btn1 btn_delete mr-10\" >删除渠道</button>&ndash;&gt;-->\r\n                        \t<!--<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vm.addChannel()\">添加渠道</button>-->\r\n                        <!--</span>-->\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vm.channelDataTotal}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"6%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"14%\">ID</th>\r\n                            <th class=\"bold\" width=\"15%\">渠道名称</th>\r\n                            <th class=\"bold\" width=\"19%\">创建时间</th>\r\n                            <th class=\"bold\" width=\"15%\">状态</th>\r\n                            <th class=\"bold\" width=\"19%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.channelData\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.channelId}}</td>\r\n                            <td>{{item.channelName}}</td>\r\n                            <td>{{item.channelUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>\r\n                                <span ng-if=\"item.statusId==50001\" class=\"btn1 btn_green2\">未启用</span>\r\n                                <span ng-if=\"item.statusId==50002\" class=\"btn1 btn_green2\">已启用</span>\r\n                            </td>\r\n                            <td>\r\n                                <a ng-if=\"item.statusId==50001\"\r\n                                   class=\"c-error \" ng-click=\"vm.changeChannel(item.channelId,item.statusId)\">启用</a>\r\n                                <a ng-if=\"item.statusId==50002\"\r\n                                   class=\"c-error \" ng-click=\"vm.changeChannel(item.channelId,item.statusId)\">禁用</a>\r\n                                <!--<a href=\"javascript:;\" class=\"c-primary mr-10\" ng-click=\"vm.editChannel(item)\">编辑</a>-->\r\n                                <!--<a href=\"javascript:;\" class=\"c-error\" ng-click=\"vm.delChannel(item.channelId)\">删除</a>-->\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"r-cont-hd\">\r\n        <span>黑名单管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                            <button class=\"L btn1 btn_delete mr-10\" ng-click=\"vmo.removeBlacklist(vmo.selectedList)\">批量移除黑名单</button>\r\n                        \t<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vmo.addBlacklist()\">添加黑名单</button>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vmo.blackListDataTotal}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab  Blacklist_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <th class=\"bold\" width=\"6%\">\r\n                                <input  type=\"checkbox\" ng-click=\"vmo.selectAll()\" ng-checked=\"vmo.isSelectedAll\"/>\r\n                            </th>\r\n                            <th class=\"bold\" width=\"19%\">ID</th>\r\n                            <th class=\"bold\" width=\"15%\">标识</th>\r\n                            <th class=\"bold\" width=\"19%\">加入黑名单时间</th>\r\n                            <th class=\"bold\" width=\"27%\">备注</th>\r\n                            <th class=\"bold\" width=\"14%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vmo.blackListData\">\r\n                            <td>\r\n                                <input  type=\"checkbox\" name=\"selected\" ng-checked=\"vmo.selectedList.inArray(item.blackListId)\"\r\n                                        ng-click=\"vmo.selectSingle(item.blackListId)\"/>\r\n                            </td>\r\n                            <td>{{item.blackListId}}</td>\r\n                            <td>{{item.blackListIdentify}}</td>\r\n                            <td>{{item.blackListUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>{{item.blackListRemark}}</td>\r\n                            <td>\r\n                                <a class=\"c-error\" ng-click=\"vmo.removeBlacklist([item.blackListId])\">移除</a>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vmo.paginationConf.totalItems && vmo.paginationConf.totalItems>0\" conf=\"vmo.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>发布管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh  ReleaseManage\">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                        \t<!--<a ui-sref=\"setting.newService\"  >-->\r\n                            <!--<a ng-click=\"$state.go('setting.newService');\">-->\r\n                            <a href=\"javascript:;\" ng-click=\"vm.addOrEditService()\">\r\n                                <button class=\"L btn1 btn1_blue \">发布新服务</button>\r\n                            </a>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vm.paginationConf.totalItems}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"5%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"25%\">名称</th>\r\n                            <th class=\"bold\" width=\"20%\">服务类型</th>\r\n                            <th class=\"bold\" width=\"20%\">发布时间</th>\r\n                            <th class=\"bold\" width=\"15%\">状态</th>\r\n                            <th class=\"bold\" width=\"20%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.serviceList\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.serviceName}}</td>\r\n                            <td ng-if=\"item.serviceType==10\">生产服务</td>\r\n                            <td ng-if=\"item.serviceType==11\">测试服务</td>\r\n                            <td>{{item.serviceCreateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td ng-if=\"item.serviceStatus==30001\">未发布</td>\r\n                            <td ng-if=\"item.serviceStatus==30002\">已发布</td>\r\n                            <td ng-if=\"item.serviceStatus==30003\">已下线</td>\r\n                            <td ng-if=\"item.serviceStatus!=30001 && item.serviceStatus!=30002 && item.serviceStatus!=30003\">&nbsp;</td>\r\n                            <td>\r\n                                <a ng-if=\"item.serviceStatus==30001\"\r\n                                   ng-click=\"vm.publishService(item.serviceId)\" class=\"mr-10 c-orange\">发布</a>\r\n                                <a ng-if=\"item.serviceStatus==30002\"\r\n                                   ng-click=\"vm.stopService(item.serviceId)\" class=\"mr-10 c-orange\">下线</a>\r\n                                <a ng-if=\"item.serviceStatus==30003\"\r\n                                   ng-click=\"vm.startService(item.serviceId)\" class=\"mr-10 c-orange\">上线</a>\r\n                                <a ng-if=\"item.serviceStatus==30002\"\r\n                                   ng-click=\"vm.restartService(item.serviceId)\" class=\"mr-10 c-orange\">重启</a>\r\n                                <a ng-click=\"vm.addOrEditService(item.serviceId)\" class=\"c-primary mr-10\" >编辑</a>\r\n                                <a ng-click=\"vm.deleteService(item.serviceId)\" class=\"c-error\">删除</a>\r\n                            </td>\r\n                        </tr>\r\n\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n</style>"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>节点管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    <button  class=\" btn1 btn1_blue \" ng-click=\"vm.addNode()\" >添加节点</button>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"5%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"10%\">节点编号</th>\r\n                            <th class=\"bold\" width=\"30%\">访问地址</th>\r\n                            <th class=\"bold\" width=\"12%\">节点类型</th>\r\n                            <th class=\"bold\" width=\"12%\">使用状态</th>\r\n                            <th class=\"bold\" width=\"12%\">运行状态</th>\r\n                            <th class=\"bold\" width=\"20%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.nodeData\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.nodeId}}</td>\r\n                            <td>{{item.nodeAccessIp}}</td>\r\n                            <td ng-if=\"item.nodeType==200\" ng-bind=\"item.nodeType==200?'单个节点':'集群节点'\"></td>\r\n                            <!--<td ng-if=\"item.nodeType==201\">集群节点</td>-->\r\n                            <td ng-if=\"item.statusId==60001\">未使用</td>\r\n                            <td ng-if=\"item.statusId==60002\">已使用</td>\r\n                            <td ng-if=\"item.statusId==60003\">已禁用</td>\r\n                            <td ng-if=\"item.nodeRunningId==70001\" ng-bind=\"item.nodeRunningId==70001?'运行正常':'运行异常'\"></td>\r\n                            <!--<td ng-if=\"item.nodeRunningId==70002\"></td>-->\r\n                            <td>\r\n                                <a ng-if=\"item.statusId==60001\"\r\n                                   ng-click=\"vm.disabledAndEnabledNode(item.nodeCode,'禁用')\" class=\"mr-10 c-orange\">禁用</a>\r\n                                <a ng-if=\"item.statusId==60003\"\r\n                                   ng-click=\"vm.disabledAndEnabledNode(item.nodeCode,'启用')\" class=\"mr-10 c-orange\">启用</a>\r\n                                <a ng-click=\"vm.editNode(item.nodeCode)\" class=\"c-primary mr-10\" >编辑</a>\r\n                                <a ng-if=\"item.statusId!=60002\" ng-click=\"vm.deleteNode(item.nodeCode)\" class=\"c-error\">删除</a>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	module.exports = "<div ui-view=\"header\"></div>\r\n\r\n<div ui-view=\"content\"></div>\r\n\r\n<div ui-view=\"sidebar\"></div>\r\n<div ui-view=\"footer\"></div>"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"main warp\">\r\n    <div class=\"libraryCnt\">\r\n        <div class=\"libraryFt pd-20 mr-20\">\r\n            <div class=\"tac libSearch\">\r\n                <div class=\"search-auto\">\r\n                    <input id=\"category-autocomplete\" class=\"bd ipt-txt\" type=\"text\" style=\"width: 280px;height:30px;box-sizing:border-box;\">\r\n                </div>\r\n            </div>\r\n            <div class=\"libraryPtoDiv\">\r\n                <!--<img src=\"../../images/images/bank_16.png\" width=\"55\" height=\"55\">-->\r\n                <!--<h3>银行领域</h3>-->\r\n            </div>\r\n            <div class=\"item-line pl-30 mt-20\">\r\n                <div class=\"value menu_1Div\" id=\"menu_1Div\">\r\n                    <div class=\"ipt-txt-box\">\r\n                        <div class=\"aside-navs aside-navs-v show\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"libraryRth\" style=\"width:720px;\">\r\n            <div class=\"tac mt10\" style=\"margin: 0; text-align: left\">\r\n                <a class=\"btn btn-blue\" ui-sref=\"botApply.manage\">类目库套用</a>\r\n                <a class=\"btn btn-green ml15\" href=\"javascript:;\" ng-click=\"vm.batchUpload()\">批量导入类目树</a>\r\n                <a class=\"btn btn-green2 ml15\" href=\"javascript:;\" ng-click=\"vm.exportAll()\">导出类目库</a>\r\n            </div>\r\n            <div class=\"HierarchyCnt\">\r\n                <p id=\"createMethod\" class=\"mb-20 f16\">新建</p>\r\n                <div>\r\n                    <span>类型: </span>\r\n                    <select id=\"category-type\" class=\"bd\">\r\n                        <option value=163>默认</option>\r\n                        <option value=161>流程</option>\r\n                        <option value=160>划分</option>\r\n                        <option value=162>属性</option>\r\n                    </select>\r\n                </div>\r\n                <div>\r\n                    <span>名称: </span>\r\n                    <input class=\"input_text\" id=\"category-name\" type=\"text\"/>\r\n                    <p id=\"category-name-error\" class=\"c-error pd-5\" style=\"margin-left: 98px;\"></p>\r\n                </div>\r\n                <div style=\"margin-top: 12px;\">\r\n                    <span style=\"vertical-align: top;\">描述: </span>\r\n                    <textarea class=\"input_text\" id=\"category-describe\" style=\"width: 420px;height: 78px;\"></textarea>\r\n                    <p id=\"category-describe-error\" class=\"c-error pd-5\" style=\"margin-left: 98px;\"></p>\r\n                </div>\r\n                <div class=\"tac mt10\" style=\"text-align: left;padding-left: 105px;margin-top: 60px;\">\r\n                    <a id=\"add\" class=\"btn btn-blue\" href=\"javascript:;\" ng-click=\"vm.addBot()\">保存</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	module.exports = "<div ui-view=\"header\"></div>\r\n\r\n<div class=\"main warp\">\r\n    <div class=\"libraryCnt\">\r\n        <div class=\"libraryFt pd-20 mr-20\">\r\n            <div class=\"tac libSearch\">\r\n                <div class=\"search-auto\">\r\n                    <input id=\"category-autocomplete\" class=\"bd ipt-txt\" type=\"text\" style=\"width: 280px;\">\r\n                </div>\r\n            </div>\r\n            <h3 class=\"tc mb-20\">资源BOT<i ng-click=\"vm.addBotLibrary()\" style=\"display: inline-block;margin-left: 20px;cursor: pointer;\"><img src=\"../../../images/images/add_img.png\" alt=\"\"></i></h3>\r\n            <div class=\"item-line\">\r\n                <div class=\"value menu_1Div\" id=\"menu_1Div\">\r\n                    <div class=\"ipt-txt-box\">\r\n                        <div id=\"library\" class=\"aside-navs show\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"library_mid  L mr-20\" >\r\n            <div class=\"mb-20\">\r\n                <a href=\"javascript:;\" class=\"right_arrow\" ng-click=\"vm.applyCategory()\"> >> >> </a>\r\n            </div>\r\n        </div>\r\n        <div class=\"libraryFt pd-20\">\r\n            <h3 class=\"tc mb-20\">场景BOT</h3>\r\n            <div class=\"item-line\">\r\n                <div class=\"value menu_1Div\">\r\n                    <div class=\"ipt-txt-box\">\r\n                        <div id=\"category\" class=\"aside-navs show\" ></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n<style>\r\n    .libraryFt{width:480px;}\r\n    .library_mid{width:200px;height:875px;background:#fff;padding:50px 20px;}\r\n    .library_mid .sel{width:150px;height:30px;}\r\n    .right_arrow,.left_arrow{width:150px;height:40px;border-radius:5px;background:#50bbeb;color:#fff;display:block;line-height:40px;text-align:center;}\r\n</style>\r\n"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"main warp\">\r\n    <div class=\"libraryCnt clearfix\">\r\n        <div class=\"libraryFt pd-20 mr-20\" style=\"box-sizing: border-box;\">\r\n            <div class=\"tac libSearch\">\r\n                <div class=\"search-auto\">\r\n                    <input id=\"category-autocomplete\" class=\"bd ipt-txt\" type=\"text\" style=\"width: 280px;height:30px;box-sizing:border-box;\">\r\n                </div>\r\n            </div>\r\n            <div class=\"libraryPtoDiv\">\r\n                <!--<img src=\"../../images/images/bank_16.png\"/>-->\r\n                <!--<h3>银行领域</h3>-->\r\n            </div>\r\n            <div class=\"item-line mt-20\" style=\"padding-left:60px;\">\r\n                <div class=\"value menu_1Div\" id=\"menu_1Div\">\r\n                    <div class=\"ipt-txt-box\">\r\n                        <div class=\"aside-navs aside-navs-v show\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"libraryRth aaa \" style=\"box-sizing: border-box;\">\r\n            <div class=\"tac mt10 mb-20\" style=\"text-align: left\">\r\n                <a class=\"btn btn-blue\" href=\"javascript:;\" ng-click=\"vm.addFrame()\">新增框架</a>\r\n                <a class=\"btn btn-green ml15\" href=\"javascript:;\" ng-click=\"vm.batchUpload()\">批量导入框架</a>\r\n                <a class=\"btn btn-green ml15\" href=\"javascript:;\" ng-click=\"vm.downloadTemplate()\">下载模板</a>\r\n                <a class=\"btn btn-green2 ml15\" href=\"javascript:;\" ng-click=\"vm.exportAll()\">导出框架</a>\r\n                <a class=\"btn btn-green2 ml15\" href=\"javascript:;\" ng-click=\"vm.batchDelete()\">删除</a>\r\n            </div>\r\n            <div class=\"tac mt10 mb-20\" style=\"margin-top: 8px; text-align: left\">\r\n                <!--<span class=\"bold\">框架名称:</span> -->\r\n                <input type=\"text\" class=\"input_text\" id=\"keyWords\" placeholder=\"框架名称\"/>\r\n                <input type=\"button\" value=\"查找\" ng-click=\"vm.searchByFrameTitle(1,0)\" class=\"btn1 btn1_blue\"/>\r\n            </div>\r\n            <table class=\"stop_word_tab\" style=\"margin-top: 10px;\">\r\n                <thead>\r\n                <tr>\r\n                    <th class=\"bold\" width=\"10%\"><input id=\"selectAll\" type=\"checkbox\"/></th>\r\n                    <th class=\"bold\" width=\"30%\">框架名称</th>\r\n                    <th class=\"bold\" width=\"30%\">框架类型</th>\r\n                    <th class=\"bold\" width=\"30%\">操作</th>\r\n                </tr>\r\n                </thead>\r\n                <tr ng-repeat=\"item in vm.listData\">\r\n                    <td><input type=\"checkbox\" name=\"sid\" value=\"{{item.frameId}}\"></td>\r\n                    <td>{{item.frameTitle}}</td>\r\n                    <td>{{item.frameTypeId | frameTypeFilter}}</td>\r\n                    <td>\r\n                        <a href=\"javascript:;\" class=\"color-blue modifyConcept\" ng-click=\"vm.editFrame(item)\">修改</a> &nbsp;\r\n                        <a href=\"javascript:;\" class=\"delConcept\" ng-click=\"vm.deleteFrame(item)\">删除</a>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n            <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n    .ngdialog{\r\n        z-index: 5!important;\r\n    }\r\n\r\n    .libraryRthCnt{position:relative; cursor: pointer;}\r\n    .delete_a{width:15px;height:17px;display:block;right:5px;top:5px;z-index:100;background: url(../images/icon-ljt.png) no-repeat;}\r\n    .delete_a:hover{background-image:url(../images/icon-ljt_on.png);}\r\n</style>\r\n\r\n\r\n\r\n\r\n\r\n"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"main warp\">\r\n    <div class=\"page-lrcont210 clearfix bgwhite mt10\">\r\n        <div class=\"l-aside fl\">\r\n            <div class=\"aside-nav aside-nav2\">\r\n                <ul class=\"leftMenuUl\">\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.synony\" >\r\n                            <i class=\"icon-l icon-navA icon-navB\"></i>\r\n                            <span>同义概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"BM.concept.aggregate\">\r\n                            <i class=\"icon-l icon-navA icon-navC\"></i>\r\n                            <span>集合概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.business\">\r\n                            <i class=\"icon-l icon-navA icon-navD\"></i>\r\n                            <span>业务概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.sensitive\">\r\n                            <i class=\"icon-l icon-navA icon-navE\"></i>\r\n                            <span>敏感概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.disable\">\r\n                            <i class=\"icon-l icon-navA icon-navG\"></i>\r\n                            <span>停用概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.intention\">\r\n                            <i class=\"icon-l icon-navA icon-navI\"></i>\r\n                            <span>强制分词概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ui-sref=\"conceptManage.bot\">\r\n                            <i class=\"icon-l icon-navA icon-navJ\"></i>\r\n                            <span>bot概念管理</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div ui-view=\"content\"></div>\r\n    </div>\r\n\r\n</div>\r\n<style>\r\n    .menu_1{\r\n        display: block;\r\n    }\r\n    .aside-nav2 .slide-a:hover .icon-navB{background-position: 0 -4px;}\r\n    .aside-nav2 .slide-a:hover .icon-navC{background-position: 0 -52px;}\r\n    .aside-nav2 .slide-a:hover .icon-navD{background-position: 0 -102px;}\r\n    .aside-nav2 .slide-a:hover .icon-navE{background-position: 0 -154px;}\r\n    .aside-nav2 .slide-a:hover .icon-navF{background-position: 0 -203px;}\r\n    .aside-nav2 .slide-a:hover .icon-navG{background-position: 0 -253px;}\r\n    .aside-nav2 .slide-a:hover .icon-navH{background-position: -1px -301px;}\r\n    .aside-nav2 .slide-a:hover .icon-navI{background-position: -1px -351px;}\r\n    .aside-nav2 .slide-a:hover .icon-navJ{background-position: -1px -402px;}\r\n    .aside-nav2 .slide-a:hover .icon-navK{background-position: -1px -450px;}\r\n\r\n</style>\r\n\r\n\r\n\r\n\r\n\r\n\r\n"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30 L\" style=\"width: 100%;box-sizing:border-box;\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>集合概念管理</span>\r\n    </div>\r\n    <div>\r\n        <div class=\"conceptSearch clearfix\">\r\n            <div class=\" L mr-5\" >\r\n                <select id=\"searchType\" ng-model=\"vm.searchType\" class=\"bd L\" style=\"width:110px;height: 30px;border-right:0;\">\r\n                    <option value=\"collectiveConceptKey\" selected>集合概念类名</option>\r\n                    <option value=\"collectiveConceptWeight\">集合概念权重</option>\r\n                    <option value=\"collectiveConceptTerm\">概念集合</option>\r\n                    <option value=\"collectiveConceptModifier\">修改人</option>\r\n                    <option value=\"collectiveConceptModifyTime\">更新时间</option>\r\n                </select>\r\n                <div class=\"L \" style=\"height:30px;overflow:hidden;\">\r\n                    <input type=\"text\" ng-if=\"vm.searchType!='collectiveConceptModifyTime' || vm.searchType!='collectiveConceptWeight'\" ng-model=\"vm.searchVal\" class=\"input_text \" style=\"height:30px;overflow: hidden;\" ng-keypress=\"($event.which === 13)?vm.search():0\"/>\r\n                    <div  ng-if=\"vm.searchType=='collectiveConceptModifyTime'\" style=\"margin-top:-30px;\">\r\n                        <input type=\"text\" id=\"startTime\" onchange=\"\"  ng-model=\"vm.timeStart\"  onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\'endTime\\')}'})\" class=\"input-text Wdate \"  style=\"background-color:#fff;width:170px;border:1px solid #e1e1e1;height: 30px;font-size: 15px;color: #333!important;\" placeholder=\"请选择开始日期\" readonly>\r\n                        -\r\n                        <input type=\"text\" id=\"endTime\"   onchange=\"\" ng-model=\"vm.timeEnd\" onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\'startTime\\')}'})\" class=\"input-text Wdate \"  style=\"background-color:#fff;width:170px;border:1px solid #e1e1e1;height: 30px;font-size: 15px;color: #333!important;\" placeholder=\"请选择结束日期\" readonly>\r\n                    </div>\r\n                    <div  ng-if=\"vm.searchType=='collectiveConceptWeight'\"  style=\"margin-top:-30px;\">\r\n                        <select class=\"input_text\" id=\"collectiveConceptWeight\" style=\"height: 30px;\">\r\n                            <option value=\"31\">极重要</option>\r\n                            <option value=\"32\">重要</option>\r\n                            <option value=\"33\" selected>一般</option>\r\n                            <option value=\"34\">不重要</option>\r\n                            <option value=\"35\">极不重要</option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <input type=\"button\" value=\"查找\" ng-click=\"vm.searchCollectiveConcept(1)\"  class=\"btn1 btn1_blue L \" />\r\n            <div class=\" conceptSearchRt\">\r\n                <a class=\"btn btn-blue mr10\" id=\"addCase\" ng-click=\"vm.addCollective()\">概念新增</a>\r\n                <a class=\"btn btn-blue mr10\" href=\"javascript:;\" ng-click=\"vm.batchUpload()\">概念导入</a>\r\n                <!--<a class=\"btn btn-green mr10\" href=\"javascript:;\">继续概念库</a>-->\r\n                <a class=\"btn btn-green2 mr10\" href=\"javascript:;\" ng-click=\"vm.exportAll()\">概念导出</a>\r\n                <a class=\"btn btn-red mr10\" href=\"javascript:;\" ng-click=\"vm.batchDelete()\">删除</a>\r\n            </div>\r\n        </div>\r\n        <table class=\"stop_word_tab\">\r\n            <thead>\r\n                <tr>\r\n                    <th class=\"bold\" width=\"5%\"><input id=\"selectAll\" type=\"checkbox\"/></th>\r\n                    <th class=\"bold\" width=\"10%\">集合概念类名</th>\r\n                    <th class=\"bold\" width=\"10%\">集合概念权重</th>\r\n                    <th class=\"bold\" width=\"35%\">概念集合</th>\r\n                    <th class=\"bold\" width=\"20%\">更新时间</th>\r\n                    <th class=\"bold\" width=\"10%\">修改人</th>\r\n                    <th class=\"bold\" width=\"10%\">操作</th>\r\n                </tr>\r\n            </thead>\r\n            <tr ng-repeat=\"item in vm.listData\">\r\n                <td><input type=\"checkbox\" name=\"sid\" value=\"{{item.collectiveConceptId}}\"></td>\r\n                <td>{{item.collectiveConceptKey}}</td>\r\n                <td>{{item.collectiveConceptWeight | weightFilter}}</td>\r\n                <td>\r\n                    <span ng-class=\"($index%2==1)?'ng-blue':'ng-red'\" ng-repeat = \"i in item.collectiveConceptTerm.split('；')\"><i ng-if=\"$index!=0 && i \" style=\"color: #333;\">, </i>{{i}}</span>\r\n                </td>\r\n                <td>{{item.collectiveConceptModifyTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                <td>{{item.collectiveConceptModifier}}</td>\r\n                <td>\r\n                    <a href=\"javascript:;\" class=\"color-blue modifyConcept\" ng-click=\"vm.editCollective(item)\">修改</a> &nbsp;\r\n                    <a href=\"javascript:;\" class=\"delConcept\" ng-click=\"vm.deleteCollective(item.collectiveConceptId)\">删除</a>\r\n                </td>\r\n            </tr>\r\n        </table>\r\n        <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n    </div>\r\n\r\n</div>\r\n<style>\r\n    .pagination {\r\n        margin: 0 !important;\r\n    }\r\n    .ngdialog{\r\n        z-index: 5!important;\r\n    }\r\n</style>\r\n"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	module.exports = "<div ui-view=\"header\"></div>\r\n\r\n<div ui-view=\"content\"></div>\r\n\r\n<div ui-view=\"sidebar\"></div>"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	module.exports = "<!--<div ui-view=\"header\"></div>-->\r\n<div class=\"main warp customer-over\">\r\n    <div class=\"page-lrcont210 clearfix bgwhite mt10\" style=\"min-height: 800px;\">\r\n        <div class=\"l-aside fl\">\r\n            <div class=\"aside-hd tac\">\r\n                <!--<img class=\"hd-img\" src=\"../../../images/images/poto.png\"/>-->\r\n                <!--{{vm.imgUrl}}  +++    {{vm.robotHead}}-->\r\n                <!--<img class=\"hd-img\" ng-src=\"{{vm.imgUrl}}{{vm.robotHead}}\"/>-->\r\n                <div style=\"width:110px;height:110px;overflow: hidden;border-radius:50%;margin:0 auto;border:3px solid #fff;\">\r\n                    <!--<img class=\"hd-img\" ng-src=\"../../images/touxiang1.png\"/>-->\r\n                    <img class=\"hd-img\" ng-src=\"{{$parent.$parent.MASTER.headImage}}\"/>\r\n                </div>\r\n                <span class=\"hd-name ellipsis\">{{vm.applicationName}}</span>\r\n            </div>\r\n            <div class=\"aside-nav aside-navn\">\r\n                <ul class=\"\">\r\n                    <li class=\"type1\"  ng-repeat=\"item in vm.botRoot\" data-option-id=\"{{item.categoryId}}\">\r\n                        <a class=\"slide-a ellipsis\" href=\"javascript:;\">\r\n                            <i class=\"icon-jj ngBotAdd\" data-option-id=\"{{item.categoryId}}\"></i>\r\n                            <span data-option-id=\"{{item.categoryId}}\">{{item.categoryName}}</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"sideBotFullPath\">\r\n                <ul>\r\n                    <li class=\"fullpath\" ng-repeat=\"item in vm.selectedBot\">\r\n                       {{item}}\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"r-cont pd30\">\r\n            <div class=\"r-cont-hd\">\r\n                <span>客服型场景知识总览</span>\r\n            </div>\r\n            <div class=\"r-cont-bd\">\r\n                <div class=\"csso-cz-box clearfix mt30 \">\r\n                    <div class=\"L pr \">\r\n                        <div class=\"\">\r\n                            <div class=\"L\" style=\"position: relative;\">\r\n                                <input type=\"text\" class=\"input_text L mr-10\" ng-model=\"vm.knowledgeTitle\" placeholder=\"请输入知识标题\" ng-keypress=\"vm.keySearch($event)\"  />\r\n                                <button class=\"btn1 btn1_blue L mr-10\" ng-click=\"vm.napSearch()\" style=\"height:31px;font-size:14px;\">查找</button>\r\n                                <!--<span ng-click=\"vm.napSearch()\" class=\"cust_searchTip\" ></span>-->\r\n                            </div>\r\n                            <button class=\"btn se-search-btn L\" ng-click=\"vm.heighSarch=!vm.heighSarch\" style=\"border: 1px solid #3ea9fb;\">高级查找</button>\r\n                            <!--<button class=\"btn1 btn1_blue advanced_sear_btn\" ng-click=\"vm.heighSarch=!vm.heighSarch\">高级查找</button>-->\r\n                            <!--<button class=\"btn1 btn1_blue advanced_sear_btn\" ng-click=\"vm.paramsReset()\">重置</button>-->\r\n                        </div>\r\n                        <div class=\"advanced_search bd\" style=\"background:#fff;width:540px;\">\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识内容:</span>\r\n                                <input type=\"text\" class=\"input_text\" ng-model=\"vm.seekAdvanceParameter.knowledgeContent\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识扩展问:</span>\r\n                                <input type=\"text\" ng-model=\"vm.seekAdvanceParameter.searchExtension\" class=\"input_text\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识有效期：</span>\r\n                                <span>\r\n                                    <input type=\"text\" id=\"startTime\" onchange=\"\"  ng-model=\"vm.seekAdvanceParameter.knowledgeExpDateStart\"  onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\'endTime\\')}'})\" class=\"input-text Wdate \"  style=\"width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;\" placeholder=\"请选择开始日期\" readonly>\r\n                                    -\r\n                                    <input type=\"text\" id=\"endTime\"   onchange=\"\" ng-model=\"vm.seekAdvanceParameter.knowledgeExpDateEnd\" onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\'startTime\\')}'})\" class=\"input-text Wdate \"  style=\"width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;\" placeholder=\"请选择结束日期\" readonly>\r\n                                </span>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">作者:</span>\r\n                                <input type=\"text\" class=\"input_text\" ng-model=\"vm.seekAdvanceParameter.knowledgeCreator\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识类型:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\"  value=\"\" type=\"radio\" name=\"knoe_type\"/>全部</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\"  value=\"100\" type=\"radio\" name=\"knoe_type\" />FAQ</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"101\" type=\"radio\" name=\"knoe_type\" />概念</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"102\" type=\"radio\" name=\"knoe_type\" />列表</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"103\"  type=\"radio\" name=\"knoe_type\" />要素</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"106\"  type=\"radio\" name=\"knoe_type\" />富文本</label>\r\n\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识来源:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"0\" />全部</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"120\" />单条新增</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"122\" />文档加工</label>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">更新时间:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"0\"/>不限</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"1\"/>近三天</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"2\"/>近七天</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"3\"/>近一月</label>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"tc\">\r\n                                <input type=\"button\" class=\"btn1 btn1_blue mr-10\" value=\"搜索\" ng-click=\"vm.napSearch()\" />\r\n                                <button class=\"btn1 btn_green advanced_sear_btn\" ng-click=\"vm.paramsReset()\">重置</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"fr\">\r\n                        <select class=\"sel bd L mr-10\" ng-model=\"vm.newKnowledge\" ng-change=\"vm.jumpToNewKonwledge(vm.newKnowledge)\" style=\"width: 126px;\">\r\n                            <option value=\"false\" style=\"display:none;\">单条知识新增</option>\r\n                            <option value=\"100\">FAQ型知识新增</option>\r\n                            <option value=\"101\">概念知识型新增</option>\r\n                            <option value=\"102\">列表型知识新增</option>\r\n                            <option value=\"103\">要素型知识新增</option>\r\n                            <option value=\"106\">富文本知识新增</option>\r\n                        </select>\r\n                        <a class=\"L btn btn-blue mr-10\" href=\"javascript:;\" ui-sref=\"knowledgeManagement.knowBatchAdditions\" style=\"line-height:17px;\">批量导入</a>\r\n                        <!--<a class=\"btn btn-green\" href=\"javascript:;\" style=\"line-height:17px;\">知识加工</a>-->\r\n                        <button class=\"btn1 L btn_green\"  ng-click=\"vm.exportExcel()\" style=\"height:31px;font-size:14px;\">知识导出</button>\r\n\r\n                    </div>\r\n                </div>\r\n                <div class=\"csso-cont mt30\">\r\n\r\n                    <div class=\"clearfix csso-hd\">\r\n                        <div class=\"fl\">\r\n                            <!--<input type=\"checkbox\" ng-checked=\"vm.isSelectAll\" ng-click=\"vm.selectAll(vm.listData)\"/>-->\r\n                            <!--<a href=\"javascript:;\" class=\"selectall_a  selectall_a1  L\" ng-checked=\"vm.isSelectAll\" ng-click=\"vm.selectAll(vm.listData)\"></a>-->\r\n                            <!-- 全选-->\r\n                            <span class=\"L\" checkbox-overview ng-click=\"vm.selectAll(vm.listData)\" result=\"vm.isSelectAll\"></span>\r\n\r\n                            <span class=\"L\"><span>总计<em>{{vm.paginationConf.totalItems}}</em>条数据，今日新增<em>{{vm.newNumber}}</em>条</span></span>\r\n                        </div>\r\n                        <div class=\"fr\"  ng-click=\"vm.delData()\">\r\n                            <a class=\"ljtClose-btn\" href=\"javascript:;\" >\r\n                                <i class=\"icon-ljtClose\"></i>\r\n                                <span style=\"color:#e84f4f;\" >删除</span>\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"clearfix csso-bd \" style=\"min-height:300px;padding-left:15px;\">\r\n                        <ul class=\"csso-lsit\">\r\n                            <li ng-repeat=\"item in vm.listData\">\r\n                                <div class=\"title\">\r\n                                    <span checkbox-overview ng-click=\"vm.addDelIds(item.knowledgeId,vm.knowledgeIds)\" result=\"vm.knowledgeIds.inArray(item.knowledgeId)\"></span>\r\n                                    <a href=\"javascript:;\" ui-sref=\"knowledgeManagement.custPreview({knowledgeId:item.knowledgeId,knowledgeType:item.knowledgeType})\">\r\n                                        {{item.knowledgeTitle}}\r\n                                    </a>\r\n                                </div>\r\n                                <div class=\"txt-cont mt10\">\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">概念扩展个数：</div>\r\n                                        <div class=\"value oh\">\r\n                                            {{item.extensionCount}} 个\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">知识内容：</div>\r\n                                        <!--{{item.knowledgeContent}}-->\r\n                                        <!--{{vm.listData}}-->\r\n                                        <div class=\"value oh\">\r\n                                            <ul class=\"\">\r\n                                                <li ng-if=\"item.knowledgeType==106 \" title=\"{{item.knowledgeContent}}\">\r\n                                                    <!--<p>{{item.knowledgeContent}}</p>-->\r\n                                                    <!--<p  ng-if=\"item.knowledgeContentNegative==110\">文本</p>-->\r\n                                                    <p  ng-if=\"item.knowledgeContentNegative==111\">\r\n                                                        图片\r\n                                                    </p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==112\">语音</p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==113\">文本</p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==114\">图文</p>\r\n                                                </li>\r\n                                                <!-- 列表 概念  faq 知識-->\r\n                                                <li ng-if=\"item.knowledgeType!=103 && item.knowledgeType!=106\" title=\"{{item.knowledgeContent}}\">\r\n                                                    <!--<p>{{item.knowledgeContent}}</p>-->\r\n                                                    <p ng-if=\"item.knowledgeContent.length<=50\">{{item.knowledgeContent}}</p>\r\n                                                    <p ng-if=\"item.knowledgeContent.length>50\">{{item.knowledgeContent.substring(0,50)+'...'}}</p>\r\n                                                </li>\r\n                                                <!-- 要素知識-->\r\n                                                <li ng-if=\"item.knowledgeType==103\">\r\n                                                    <p><strong>该要素知识包含条数：</strong> {{item.tableCount}}条</p>\r\n                                                    <p><strong>新添加要素数：</strong> {{item.elementsCount}}条</p>\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">知识类型：</div>\r\n                                        {{item.knowledgeTypeDetail}}\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"csso-info oh\">\r\n                                    <div class=\"fr\">\r\n                                        <span class=\"mr-20\">作者：{{item.knowledgeCreator}}</span>\r\n                                        <span>更新时间：{{item.knowledgeModifyTime |  date : 'yyyy-MM-dd'}}</span>\r\n                                    </div>\r\n                                </div>\r\n                            </li>\r\n                        </ul>\r\n                        <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	module.exports = "<!--<div ui-view=\"header\"></div>-->\r\n<div class=\"main warp\">\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"r-cont-hd\">\r\n            <span>知识预览</span>\r\n        </div>\r\n        <ul class=\"Preview\">\r\n            <li>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.knowledgeTitle\">\r\n                    <span>知识标题：</span>\r\n                    {{vm.listData.knowledgeBase.knowledgeTitle}}\r\n                </p>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.knowledgeExpDateStart\">\r\n                    <span>知识有效期：</span>\r\n                    {{vm.listData.knowledgeBase.knowledgeExpDateStart  |  date : 'yyyy-MM-dd '}} 至 {{vm.listData.knowledgeBase.knowledgeExpDateEnd |  date : 'yyyy-MM-dd '}}\r\n                </p>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.classificationAndKnowledgeList\" ng-repeat=\"item in vm.listData.knowledgeBase.classificationAndKnowledgeList track by $index\"><span ng-class=\"$index==0?'':'mileVs'\">BOT路径：</span> <b  style=\"font-weight:normal;\">{{item.className.join(\"/\")}}</b></p>\r\n            </li>\r\n\r\n            <!-- 要素列表 faq -->\r\n            <li  ng-if=\"vm.knowledgeType!=101\" class=\"borderN\">\r\n                <p ng-if=\"vm.knowledgeType!=100\" ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">概念扩展：</span>\r\n                     <span style=\"width: auto;\" >\r\n                        {{item.extensionQuestionTitle}}\r\n                    </span>\r\n                </p>\r\n                <p ng-if=\"vm.knowledgeType==100\" ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">扩展问题：</span>{{item.extensionQuestionTitle}}\r\n                </p>\r\n            </li>\r\n            <li ng-class=\"vm.knowledgeType==101?'':'borderN'\" style=\"border-bottom: 0\">\r\n                <div class=\"knowContent mb-10\" ng-repeat=\"item in vm.listData.knowledgeContents track by $index\">\r\n                    <span ng-class=\"$index!=0?'mileVs':''\">知识内容：</span>\r\n                    <div class=\"PreviewRight\">\r\n                        <!-- faq 概念 列表 富文本-->\r\n                        <p  ng-if=\"vm.knowledgeType!=103\">内容 {{$index+1 | numberToWord}}</p>\r\n                        <!-- fqq 概念-->\r\n                        <div  ng-if=\"(vm.knowledgeType!=103) && (vm.knowledgeType!=102)\">\r\n                            <!--{{item.knowledgeContent}}-->\r\n                                <p ng-if=\"vm.knowledgeType==106\"  ng-bind-html=\"item.knowledgeContent | emotion  | toHtml\"></p>\r\n                                <p ng-if=\"vm.knowledgeType!=106\" ng-repeat=\"text in item.knowledgeContent.split('\\n') track by $index\">{{text}}</p>\r\n                                <!--</textarea>-->\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                        <!-- 列表-->\r\n                        <div ng-if=\"vm.knowledgeType==102\">\r\n                            <p>肯定回答:</p>\r\n                            <p>{{item.knowledgeContent}}</p>\r\n                            <p>否定回答:</p>\r\n                            <p>{{item.knowledgeContentNegative}}</p>\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                        <!-- 要素 表格形式-->\r\n                        <div ng-if=\"vm.knowledgeType==103\" style=\"width:920px;max-height:500px;overflow:auto;\">\r\n                                <table class=\"essential_factor_tab\" style=\"width:auto;\">\r\n                                    <tr ng-repeat=\"(indexRow,row) in item.knowledgeContent.listTable track by $index\">\r\n                                        <td ng-repeat=\"(indexColumn,item) in row track by $index\" >\r\n                                            <div style=\"min-width:80px;max-width:300px;height:40px;overflow: auto;text-align: center;\">{{item}}</div>\r\n                                        </td>\r\n                                    </tr>\r\n                                </table>\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                    </div>\r\n                    <p class=\"mb-10\">\r\n                        <span>知识配置：</span>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeRelatedQuestionOn\">显示相关问题</b>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeBeRelatedOn\">在相关问题内提示</b>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeCommonOn\">弹出评价小尾巴</b>\r\n                    </p>\r\n                    <!--<p ng-repeat=\" (indexVal,val) in item.knowledgeRelevantContentList\">-->\r\n                        <!--<span ng-class=\"indexVal?'':'mileVs'\">已添加知识：</span>-->\r\n                        <!--<span style=\"width:100%;\">{{indexVal}}{{val}}</span>-->\r\n                    <!--</p>-->\r\n                    <div class=\"pr\" ng-if=\"item.knowledgeRelevantContentList.length\" style=\"padding-left:150px;\">\r\n                        <span  class=\"pa dib\" style=\"width:150px;left:0;top:0;color:#666;\">已添加知识：</span>\r\n                        <div>\r\n                            <p class=\"mb-10\" ng-repeat=\" (indexVal,val) in item.knowledgeRelevantContentList track by $index\">\r\n                                <span style=\"width:100%;text-align:left;color:#333;\">{{indexVal+1}}. {{val}}</span>\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n            <!-- 概念知识 位置-->\r\n            <li class=\"borderN\"  ng-if=\"vm.knowledgeType==101\">\r\n                <p ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">概念扩展：</span>\r\n                     <span style=\"width: auto;\" >\r\n                        {{item.extensionQuestionTitle}}\r\n                    </span>\r\n                </p>\r\n            </li>\r\n            <div class=\"jqrsz-btn-box\" style=\"padding-left: 150px;margin-top: 4px;\">\r\n                <a class=\"btn btn-blue mr10\" ui-sref=\"knowledgeManagement.custOverview\">返回</a>\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" ng-click=\"vm.edit()\" style=\"background: #2bcacc; color: #fff;\">修改</a>\r\n            </div>\r\n        </ul>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"main warp knowledgeFaq\">\r\n\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"cl\">\r\n            <div class=\"r-cont-hd L\">\r\n                <span ng-if=\"!vm.knowledgeId\" style=\"color:#666;\">FAQ知识新增</span>\r\n                <span ng-if=\"vm.knowledgeId\" style=\"color:#666;\">FAQ知识编辑</span>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n        </div>\r\n        <div class=\"r-cont-bd oh pr\">\r\n            <!--<form novalidate=\"novalidate\" name=\"form\">-->\r\n            <div class=\"jqrsz-item\">\r\n                <div class=\"item-line\">\r\n                    <div class=\"lable\">\r\n                        知识标题：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\" style=\"width:100%;\">\r\n                            <input class=\"ipt-txt bd \" type=\"text\" autofocus style=\"width:407px;height:32px;\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required />\r\n                            <i class=\"btn-empty\"></i>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- 时间-->\r\n                <span select-start-end-time=\"dialog\"></span>\r\n                <!--  bot -->\r\n                <span bot-class-tree=\"dialog\" ></span>\r\n <!--bot  類目數 点击生成  -->\r\n                <div class=\"item-line mb-10\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot track by $index\">\r\n                    <div class=\"lable\"> BOT路径：</div>\r\n                    <div class=\"value Div clearfix\" >\r\n                        <div class=\"ipt-txt-box L mr-10\">\r\n                            <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;width:407px;\">\r\n                                <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                            </div>\r\n                        </div>\r\n                        <a href=\"javascript:;\" class=\"L mr-10 mt-5\"  ng-click=\"vm.creatSelectBot.splice($index,1)\"><img src=\"../../../../images/images/delete_img.png\"  alt=\"\"></a>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"item-line\">\r\n                    <div class=\"row cl mb-10\">\r\n                        <div class=\"lable\" style=\"width:245px;\">业务框架：</div>\r\n                        <!--<label class=\"form-label col-xs-4 col-sm-2 text-r\">业务框架：</label>-->\r\n                        <div class=\"formControls col-xs-8 col-sm-9\" style=\"padding-left:0;\">\r\n                            <select  class=\"input-text pickFrame\" style=\"width:407px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\" style=\"overflow: visible\">\r\n                <span concept-extension=\"dialog\" tag=\"false\" api=\"queryFaqExtension\"></span>\r\n<!--手动添加 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensions\" ng-repeat=\"item in vm.extensions track by $index\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                           {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_faq_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>-->\r\n                    </div>\r\n                </div>\r\n<!-- 業務框架 生成 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensionsByFrame\" ng-repeat=\"item in vm.extensionsByFrame\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                            {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"vm.backUpExt(item);vm.extensionsByFrame.splice($index,1)\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<a href=\"javascript:;\" class=\"L edit_a mr-10 mt-5\" ng-click=\"vm.KnowledgeEdit()\"></a>-->\r\n                        <span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\">\r\n                <div ng-if=\"vm.scanContent\" ng-repeat=\"(itemIndex,item) in vm.scanContent\">\r\n                    <div class=\"item-line\">\r\n                        <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                           内容{{itemIndex+1}}:\r\n                        </div>\r\n                        <div class=\"value\">\r\n                            <div class=\"ipt-txt-box clearfix\">\r\n                                <div class=\"textareaDiv textareaDiv1 textareaDiv2 L\">\r\n                                    <p ng-repeat=\"text in item.knowledgeContent.split('\\n') \">{{text}}</p>\r\n                                </div>\r\n                                <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">渠道：\r\n                            <span class=\"mr-10\" ng-repeat=\"val in item.channelIdList\"><span ng-if=\"!$first\">, </span>{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <!--<div class=\"item-line item_line\" >-->\r\n                        <!--<div class=\"left\"></div>-->\r\n                        <!--<div class=\"optionDiv\">-->\r\n                            <!--维度:-->\r\n                            <!--<span class=\"mr-10\"  ng-repeat=\"val in item.dimensionIdList\"><span ng-if=\"!$first\">, </span>{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>-->\r\n                        <!--</div>-->\r\n                    <!--</div>-->\r\n                </div>\r\n                <div class=\"item-line\" style=\"margin-top: 15px\">\r\n                    <div class=\"lable\">\r\n                        知识内容：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\">\r\n                            <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\" type=\"button\" value=\"+ 新增\"/>\r\n                            <i class=\"btn-empty\"></i>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-btn-box\" style=\"margin-bottom:120px;\">\r\n                <input class=\"btn btn-blue mr10\" value=\"保存\" type=\"button\"  ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateFaqKnow':'storeFaqKnow')\">\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" style=\"background: #2bcacc; color: #fff;\" ng-click=\"vm.scan()\">预览</a>\r\n            </div>\r\n            <!--引导-->\r\n            <div class=\"shadow_div dn\" ></div>\r\n            <div class=\"step_div \" >\r\n                <div class=\"step_one dn\" id=\"step_one\" >\r\n                    <div class=\"step_one_s\">1</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识标题：您需要填写这个知识的标准的提问方式哦~~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                    <div class=\"step_one_s\">2</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                    <div class=\"step_one_s\">3</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                    <div class=\"step_one_s\">4</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                    <div class=\"step_one_s\">5</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                    <div class=\"step_one_s\">6</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--引导end-->\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"main warp knowledgeConcepe\">\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"cl\">\r\n            <div class=\"r-cont-hd L\">\r\n                <span ng-if=\"!vm.knowledgeId\" style=\"color:#666;\">概念知识新增</span>\r\n                <span ng-if=\"vm.knowledgeId\" style=\"color:#666;\">概念知识编辑</span>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n        </div>\r\n        <div class=\"r-cont-bd oh pr\">\r\n\r\n            <div class=\"jqrsz-item\">\r\n                <div class=\"item-line\">\r\n                    <div class=\"lable\">\r\n                        知识标题：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\" style=\"width:100%;\">\r\n                            <input class=\"ipt-txt bd\" type=\"text\" autofocus style=\"height:32px;\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required />\r\n                            <i class=\"btn-empty\"></i>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n              <span select-start-end-time=\"dialog\"></span>\r\n                <!--  bot -->\r\n                <span bot-class-tree=\"\" ></span>\r\n                 <!--bot 生成-->\r\n                <div class=\"item-line mb-10\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot track by $index\">\r\n                    <div class=\"lable\"> BOT路径：</div>\r\n                        <div class=\"value Div clearfix\" >\r\n                            <div class=\"ipt-txt-box mr-10 L\">\r\n                            <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                            </div>\r\n                        </div>\r\n                        <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                    </div>\r\n                </div>\r\n                <div class=\"item-line\">\r\n                    <div class=\"row cl mb-10\">\r\n                        <div class=\"lable\" style=\"width:245px;\">业务框架：</div>\r\n                        <!--<label class=\"form-label col-xs-4 col-sm-2 text-r\">业务框架：</label>-->\r\n                        <div class=\"formControls col-xs-8 col-sm-9\" style=\"padding-left:0;\">\r\n                            <select class=\"input-text\" style=\"width:407px;height:34px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\">\r\n                <!--预览内容-->\r\n                <div ng-repeat=\"(index,item) in vm.scanContent track by $index\">\r\n                    <div class=\"item-line\">\r\n                        <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                            内容{{index+1}}:\r\n                        </div>\r\n                        <div class=\"value\">\r\n                            <div class=\"ipt-txt-box clearfix\">\r\n                                <div class=\"textareaDiv textareaDiv1 textareaDiv2 L \" >\r\n                                    <p ng-repeat=\"text in item.knowledgeContent.split('\\n')\">{{text}}</p>\r\n                                </div>\r\n                                <!--<a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\" mr-15\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>-->\r\n                                <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">渠道：\r\n                            <span  ng-repeat=\"val in item.channelIdList track by $index\"><span ng-if=\"!$first\"> , </span>{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">维度:\r\n                            <span style=\"margin: 0\" ng-repeat=\"val in item.dimensionIdList track by $index\"><span ng-if=\"!$first\"> , </span>{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"item-line\" style=\"margin-top: 15px\">\r\n                    <div class=\"lable\">\r\n                        知识内容：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\">\r\n                            <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\"  type=\"button\" value=\"+ 新增\"/>\r\n                            <i class=\"btn-empty\"></i>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"jqrsz-item\" style=\"overflow: visible\">\r\n                <!-- 扩展问 生成 -->\r\n                <span concept-extension=\"dialog\" tag=\"true\" api=\"queryConceptExtension\"></span>\r\n                <!--sshoudong  tinajia -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                    <div class=\"lable\">\r\n                        概念扩展：\r\n                    </div>\r\n                    <div class=\"value clearfix\">\r\n                        <div class=\" tag_box L mr-10\" style=\"width:353px;padding:0;\">\r\n                            <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                {{val.tagName}}\r\n                            </span>\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_concept_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <span class=\"L\" ng-if=\"item.extensionQuestionTitle\"><b>来源于</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                    </div>\r\n                </div>\r\n                <!-- 業務框架 生成 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame track by $index\">\r\n                    <div class=\"lable\">\r\n                        概念扩展：\r\n                    </div>\r\n                    <div class=\"value clearfix\">\r\n                        <div class=\" tag_box L mr-10\" style=\"width:353px;padding:0;\">\r\n                            <!--{{item.extensionQuestionTagList}}-->\r\n                            <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                {{val.tagName}}\r\n                            </span>\r\n                        </div>\r\n                        <span class=\"tag_s L\" style=\"margin-right:10px;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_concept_ext',item);;vm.extensionsByFrame.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n\r\n                        <span class=\"L\" ng-if=\"item.extensionQuestionTitle\"><b>来源于:</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-btn-box\" style=\"margin-bottom:120px;\">\r\n                <input type=\"button\" class=\"btn btn-blue mr10\" value=\"保存\" ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateConceptKnow':'storeConceptKnow')\">\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" style=\"background: #2bcacc; color: #fff;\" ng-click=\"vm.scan(vm.knowledgeId?'updateConceptKnow':'storeConceptKnow')\">预览</a>\r\n            </div>\r\n            <!--引导-->\r\n            <div class=\"shadow_div dn\" ></div>\r\n            <div class=\"step_div \">\r\n                <div class=\"step_one dn\" id=\"step_one\" >\r\n                    <div class=\"step_one_s\">1</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                    <div class=\"step_one_s\">2</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                    <div class=\"step_one_s\">3</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                    <div class=\"step_one_s\">4</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                    <div class=\"step_one_s\">5</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化. </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                    <div class=\"step_one_s\">6</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--引导end-->\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .container{\r\n        background:#f8f8f8;\r\n    }\r\n</style>\r\n\r\n"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\"></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap knowledgeList\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-bind=\"vm.knowledgeId?'列表型知识编辑':'列表型知识新增'\"></h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\" pr\">\r\n\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">知识标题：</div>\r\n                        <div>\r\n                            <input type=\"text\" class=\"bk-gray input-text \" autofocus placeholder=\"请输入标题\"\r\n                                   ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\"\r\n                                   ng-maxlength=\"1000\" required style=\"width:394px;\"/>\r\n\r\n                            <p class=\"c-error pd-5\" ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 时间-->\r\n                    <span select-start-end-time=\"notDialog\"></span>\r\n                    <!--  bot -->\r\n                    <span bot-class-tree=\"notDialog\"></span>\r\n                    <!-- 生成bot列表 -->\r\n                    <div class=\"exten_problem\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">BOT路径：</div>\r\n                            <div class=\" clearfix\">\r\n                                <div class=\"ipt-txt-box L\"\r\n                                     style=\"width: 395px;border: 1px solid #e1e1e1;margin-right: 10px;\">\r\n                                    <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                        <!--<span>{{item.className.join(\"/\")}}</span>-->\r\n                                        <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                    </div>\r\n                                </div>\r\n                                <a href=\"javascript:;\" class=\"L mr-10 mt-5\"><img\r\n                                        src=\"../../../../images/images/delete_img.png\"\r\n                                        ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">业务框架：</div>\r\n                        <div>\r\n                            <select class=\"input-text\" style=\"width:395px;\" ng-model=\"vm.frameId\"\r\n                                    ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                    <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryListExtension\"></span>\r\n                    <!--手动添加 ext-->\r\n                    <div class=\"exten_problem\" style=\"overflow: visible\"\r\n                         ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\"\r\n                                     style=\"width:345px;height:35px;border:0;overflow-x: auto;\">\r\n                                    <!--{{item.extensionQuestionTagList}}-->\r\n                                       <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\"\r\n                                             ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                            {{val.tagName}}\r\n                                        </span>\r\n                                </div>\r\n                                <span class=\"tag_s mr-10 L\"\r\n                                      style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                <a href=\"javascript:;\"\r\n                                   ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\"\r\n                                   class=\"L mr-10\"><img src=\"../../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 业务框架 生成ext -->\r\n                    <div class=\"exten_problem\" ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\"\r\n                                     style=\"width:345px;height:35px;border:0;overflow-x: auto\">\r\n                                   <span ng-repeat=\"val in item.extensionQuestionTagList\"\r\n                                         ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                        {{val.tagName}}\r\n                                    </span>\r\n                                </div>\r\n                                <span class=\"tag_s mr-10 L\"\r\n                                      style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                <a href=\"javascript:;\"\r\n                                   ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensionsByFrame.splice($index,1);\"\r\n                                   class=\"L mr-10\"><img src=\"../../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-50\">\r\n                        <div class=\"list_facContent_L\">知识内容: &nbsp;</div>\r\n                        <div>\r\n                            <div class=\"clearfix mb-10\">\r\n                                <p class=\"mb-10 f-16\">肯定回答:</p>\r\n                                <!--{{vm.newTitle}}-->\r\n                                <textarea class=\"word_div bd\" ng-model=\"vm.newTitle\"\r\n                                          placeholder=\"例如：#违禁品#是违禁物品，不可以带上飞机\"></textarea>\r\n                            </div>\r\n                            <div class=\"clearfix mb-10\">\r\n                                <p class=\"mb-10 f-16\">否定回答:</p>\r\n                                <textarea class=\"word_div bd\" ng-model=\"vm.knowledgeContentNegative\"\r\n                                          placeholder=\"例如：不是违禁物品，可以带上飞机\"></textarea>\r\n                            </div>\r\n                            <div know-content-configuration=\"queryListRelatedQuestion\" template-type=\"false\"></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                    <div class=\"list_facContent_L\"></div>\r\n                    <div>\r\n                        <input type=\"button\" class=\"btn1 btn1_blue mr-20\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateListKnow':'storeListKnow')\"/>\r\n                        <input type=\"button\" class=\"btn1 btn_green\" ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateListKnow':'storeListKnow')\"\r\n                               value=\"保存\"/>\r\n                    </div>\r\n                </div>\r\n                <!--引导-->\r\n                <div class=\"shadow_div dn\"></div>\r\n                <div class=\"step_div \">\r\n                    <div class=\"step_one dn\" id=\"step_one\">\r\n                        <div class=\"step_one_s\">1</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button disabled class=\"c-999 introjs-button introjs-prev\"\r\n                                        ng-click=\"vm.prevDiv($event)\">上一步\r\n                                </button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                        <div class=\"step_one_s\">2</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                        <div class=\"step_one_s\">3</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                        <div class=\"step_one_s\">4</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                            </p>\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                        <div class=\"step_one_s\">5</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                        <div class=\"step_one_s\">6</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>渠道维度：渠道和维度的组合是不可以重复的，添加时一定要注意哦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                        <div class=\"step_one_s\">7</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button disabled class=\"c-999 introjs-button introjs-next\"\r\n                                        ng-click=\"vm.nextDiv($event)\">下一步\r\n                                </button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!--引导end-->\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap knowledgeFactor\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-if=\"!vm.knowledgeId\">要素型知识新增</h3>\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-if=\"vm.knowledgeId\">要素型知识编辑</h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\"pr\">\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">知识标题：</div>\r\n                        <div >\r\n                            <input  type=\"text\" class=\"bk-gray input-text \" autofocus placeholder=\"请输入标题\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required  style=\"width:394px;\"/>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 时间-->\r\n                    <span select-start-end-time=\"notDialog\"></span>\r\n                    <!--  bot -->\r\n                    <span bot-class-tree=\"notDialog\"></span>\r\n                    <!--手动生成-->\r\n                    <div class=\"exten_problem\"  ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">BOT路径：</div>\r\n                            <div class=\" clearfix\" >\r\n                                <div class=\"ipt-txt-box L\" style=\"width: 394px;border: 1px solid #e1e1e1;margin-right:10px;\">\r\n                                    <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                        <!--<span>{{item.className.join(\"/\")}}</span>-->\r\n                                        <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                    </div>\r\n                                </div>\r\n                                <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">业务框架：</div>\r\n                        <div >\r\n                            <select class=\"input-text\" style=\"width:395px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                    <!--  扩展问 -->\r\n                    <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryFactorExtension\"></span>\r\n                    <div class=\"exten_problem\"  ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\" style=\"width:345px;border: 0;margin-right:0;height: 35px;overflow-x: auto;\" >\r\n                                   <span ng-repeat=\"val in item.extensionQuestionTagList\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                      {{val.tagName}}\r\n                                    </span>\r\n                                </div>\r\n                                <span class=\"tag_s  bd L mr-10\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center\">\r\n                                    普通\r\n                                </span>\r\n                                <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                <span class=\"L\"><b>来源于</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-50\">\r\n                        <div class=\"list_facContent_L\">知识内容: &nbsp;</div>\r\n                        <div >\r\n                            <div class=\"clearfix mb-10\">\r\n                                <span uploader-factor server=\"'api/elementKnowledgeAdd/upload'\"  is-auto=\"'true'\" table-list=\"vm.tableList\"></span>\r\n                                <!--<input  type=\"button\" class=\"btn1 btn1_blue mb-10\" uploader-handle server=\"'api/elementKnowledgeAdd/upload'\" value=\"上传线下编辑场景知识\">-->\r\n                                <!--<span class=\"f-14 pl-10\">请先<a href=\"javascript:;\" class=\"c-primary\">下载模板</a>进行填写</span>-->\r\n                                <div class=\"essential_factor_div bd mt-10\">\r\n                                    <div class=\"mb-10\">\r\n                                        <a href=\"javascript:;\" class=\"add_l ine mr-10\" ng-click=\"vm.addRow()\"><img src=\"../images/ys_img1.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"delete_line mr-10\" ng-click=\"vm.tableRemove(1)\"><img src=\"../images/ys_img2.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"add_column mr-10\"  ng-click=\"vm.addList();\"><img src=\"../images/ys_img3.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"delete_column\"  ng-click=\"vm.tableRemove(2)\"><img src=\"../images/ys_img4.png\"/></a>\r\n                                    </div>\r\n                                    <div>\r\n                                        <table class=\"essential_factor_tab\">\r\n                                            <tr ng-repeat=\"(indexRow,row) in vm.tableList.data.listTable track by $index\">\r\n                                                <td ng-repeat=\"(indexColumn,item) in row track by $index\" ng-click=\"vm.tableRow=indexRow;vm.tableColumn=indexColumn\">\r\n                                                    <!--{{item}}-->\r\n                                                    <textarea ng-if=\"indexRow==0\" ng-model=\"item\" value=\"\"  ng-disabled=\"indexColumn==0\"  ng-click=\"indexColumn==0?'':vm.editList(indexRow,indexColumn);\" style=\"width:100%;height:19px;background:inherit;cursor:pointer\">{{item}}</textarea>\r\n                                                    <!--<input type=\"text\" ng-if=\"indexRow==0&&indexColumn!=0\" ng-model=\"item\"   style=\"background:inherit\"/>-->\r\n                                                    <textarea  ng-if=\"indexRow!=0\" ng-model=\"item\" value=\"\" ng-change=\"vm.tableChange(indexRow,indexColumn,item)\" style=\"width:100%;\">{{item}}</textarea>\r\n                                                </td>\r\n                                            </tr>\r\n                                        </table>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div know-content-configuration=\"queryFactorRelatedQuestion\" template-type=\"false\"></div>\r\n                    </div>\r\n                    <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                        <div class=\"list_facContent_L\"></div>\r\n                        <div>\r\n                            <input type=\"button\" class=\"btn1 btn1_blue mr-20\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateFactorKnow':'storeFactorKnow')\"/>\r\n                            <input type=\"button\" class=\"btn1 btn_green\"  ng-disabled=\"vm.limitSave\"   ng-click=\"vm.save(vm.knowledgeId?'updateFactorKnow':'storeFactorKnow')\" value=\"保存\"/>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导-->\r\n                    <div class=\"shadow_div dn\" ></div>\r\n                    <div class=\"step_div \" >\r\n                        <div class=\"step_one dn\" id=\"step_one\" >\r\n                            <div class=\"step_one_s\">1</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识标题：您需要填写这个知识的标准的提问方式哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                            <div class=\"step_one_s\">2</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                            <div class=\"step_one_s\">3</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                            <div class=\"step_one_s\">4</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                            <div class=\"step_one_s\">5</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                            <div class=\"step_one_s\">6</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>渠道维度：渠道和维度的组合是不可以重复的，添加时一定要注意哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                            <div class=\"step_one_s\">7</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导end-->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	module.exports = "<!-- new markKnow  -->\r\n<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap markKnow\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\"  ng-bind=\"vm.knowledgeId?'富文本型知识编辑':'富文本型知识新增'\"></h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\" pr\">\r\n                    <div class=\"pt30 pb30\" style=\"border-bottom: 1px dashed #dadada;\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">知识标题：</div>\r\n                            <div >\r\n                                <input  type=\"text\" class=\"bk-gray input-text \" autofocus  placeholder=\"请输入标题\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required  style=\"width:394px;\"/>\r\n                                <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- 时间-->\r\n                        <span select-start-end-time=\"notDialog\"></span>\r\n                        <!--  bot -->\r\n                        <span bot-class-tree=\"notDialog\"></span>\r\n                        <!-- 生成bot列表 -->\r\n                        <div class=\"exten_problem\"  ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">BOT路径：</div>\r\n                                <div class=\" clearfix\" >\r\n                                    <div class=\"ipt-txt-box L\" style=\"width: 395px;border: 1px solid #e1e1e1;margin-right: 10px;\">\r\n                                        <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                            <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                        </div>\r\n                                    </div>\r\n                                    <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">业务框架：</div>\r\n                            <div >\r\n                                <select class=\"input-text\" style=\"width:395px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                    <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent\" style=\"padding-top:30px;padding-bottom:30px;border-bottom: 1px dashed #dadada;\">\r\n                        <div class=\"list_facContent_L\" style=\"top:30px;\">知识内容: &nbsp;</div>\r\n                        <!--预览内容-->\r\n                        <div ng-repeat=\"(index,item) in vm.scanContent track by $index\">\r\n                            <div class=\"item-line\">\r\n                                <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                                    内容{{index+1}}:\r\n                                </div>\r\n                                <div class=\"value\">\r\n                                    <div class=\"ipt-txt-box clearfix\">\r\n                                        <div class=\"textareaDiv textareaDiv1 textareaDiv2 L \">\r\n                                            <p ng-if=\"item.knowledgeContentNegative == 113\" ng-bind-html=\"item.knowledgeContent | toHtml\"></p>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 112\" style=\"text-align: center\">\r\n                                                <p>语音名称：{{item.knowledgeContentDetail.name}}</p>\r\n                                                <p><img src=\"/images/audio_pic1.png\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n                                            </div>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 111\" style=\"text-align: center\">\r\n                                                <p>图片名称：{{item.knowledgeContentDetail.name}}</p>\r\n                                                <p><img ng-src=\"/img/{{item.knowledgeContent}}\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n                                            </div>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 114\" style=\"text-align: center\">\r\n                                              <p>图文标题：{{item.knowledgeContentDetail.name}}</p>\r\n                                              <p><img ng-src=\"/img/{{item.knowledgeContentDetail.url}}\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n\r\n                                           </div>\r\n                                        </div>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                        <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"item-line item_line\">\r\n                                <div class=\"optionDiv\">渠道：\r\n                                    <span class=\"mr-10\" ng-repeat=\"val in item.channelIdList track by $index\">{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"item-line item_line\" >\r\n                                <div class=\"optionDiv\">维度:\r\n                                    <span style=\"margin: 0 4px;\" ng-repeat=\"val in item.dimensionIdList track by $index\">{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"item-line\">\r\n                            <div class=\"value\">\r\n                                <div class=\"ipt-txt-box\">\r\n                                    <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\"  type=\"button\" value=\"+ 新增\"/>\r\n                                    <i class=\"btn-empty\"></i>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div  style=\"padding-top:30px;padding-bottom:30px;\">\r\n                        <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryRichTextExtension\"></span>\r\n                        <!--手动添加-->\r\n                        <div class=\"exten_problem\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">概念扩展：</div>\r\n                                <div >\r\n                                    <div class=\"L extended_query_txt\" style=\"width:345px;height:35px;border:0;overflow-x: auto;\" >\r\n                                        <!--{{item.extensionQuestionTagList}}-->\r\n                                           <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                                {{val.tagName}}\r\n                                            </span>\r\n                                        <!--{{item.extensionQuestionTitle}}-->\r\n                                    </div>\r\n                                    <span class=\"tag_s mr-10 L\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                    <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                    <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- 業務框架 生成 -->\r\n                        <div class=\"exten_problem\"  ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">概念扩展：</div>\r\n                                <div>\r\n                                    <div class=\"L extended_query_txt\" style=\"width:345px;height:35px;border:0;overflow-x: auto\" >\r\n                                       <span ng-repeat=\"val in item.extensionQuestionTagList\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                            {{val.tagName}}\r\n                                        </span>\r\n                                    </div>\r\n                                    <span class=\"tag_s mr-10 L\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                    <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                    <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                        <div class=\"list_facContent_L\"></div>\r\n                        <div >\r\n                            <input type=\"button\" class=\"btn1 btn1_blue mr-20\" ng-disabled=\"vm.limitSave\"  ng-click=\"vm.save(vm.knowledgeId?'updateRichTextKnow':'storeRichTextKnow')\" value=\"保存\"/>\r\n                            <input type=\"button\" class=\"btn1 btn_green\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateRichTextKnow':'storeRichTextKnow')\"/>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导-->\r\n                    <div class=\"shadow_div dn\" ></div>\r\n                    <div class=\"step_div \" >\r\n                        <div class=\"step_one dn\" id=\"step_one\" >\r\n                            <div class=\"step_one_s\">1</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                            <div class=\"step_one_s\">2</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                            <div class=\"step_one_s\">3</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                            <div class=\"step_one_s\">4</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                            <div class=\"step_one_s\">5</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                            <div class=\"step_one_s\">6</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导end-->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap process_know\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10 pr\">\r\n                <div class=\"mb-20\">\r\n                    <h3 class=\"f22 mb15\" ng-bind=\"!vm.knowledgeId?'流程型知识新增':'流程型知识编辑'\"></h3>\r\n                </div>\r\n                <div class=\"pr\">\r\n                    <div class=\"pl50\">\r\n                        <button class=\"btn1 btn1_blue mb30\" id=\"addNode\" ng-click=\"vm.newIndex = vm.flowKnowledgeContentList.length;vm.resetParams()\" is-arrow-show=\"1\">新增节点</button>\r\n                        <button class=\"btn1 btn1_blue mb30\"  ng-click=\"vm.addNewKnow()\" ng-disabled=\"!vm.flowKnowledgeContentList.length\">保存</button>\r\n                        <div>\r\n                            <div class=\"pl20 clearfix\">\r\n                                <div class=\"clearfix \" id=\"node_box_wrap\" style=\"min-height: 444px;padding-bottom:100px;\">\r\n\r\n                                    <div class=\" node_box_wrap pt50\"  ng-repeat=\"item in vm.flowKnowledgeContentList track by $index\" ng-class=\"{'first':$first,'last':$last}\" >\r\n                                        <div class=\"node_box pr\" >\r\n                                            <img src=\"../../../images/node_icon3.jpg\" class=\"node_img\" ng-hide=\"$first&&$last\"/>\r\n                                            <h3 class=\"f18 bold mb10 cp\" ng-bind=\"item.nodeName\" ng-click=\"vm.editNode(item,$index)\" is-arrow-show=\"1\"></h3>\r\n                                            <p class=\"f14 mb30 c-666\" ng-bind=\"item.triggerValueOfTitle\"></p>\r\n                                            <p class=\"c-999\" ng-bind=\"item.triggerKnowledgeOfTitle\"></p>\r\n                                            <div class=\"node_box_div clearfix\" is-operation-show=\"0\">\r\n                                                <a href=\"javascript:;\" class=\"node_right pa pd-5\"></a>\r\n                                                <ul class=\"node_box_ul p15 clearfix pa\">\r\n                                                    <li ng-click=\"vm.newNode($index)\">在上方新建节点</li>\r\n                                                    <li ng-click=\"vm.newNode($index+1)\">在下方新建节点</li>\r\n                                                    <li ng-click=\"vm.moveUp($index)\" ng-if=\"!$first\">向上移动</li>\r\n                                                    <li ng-click=\"vm.moveDown($index)\" ng-if=\"!$last\">向下移动</li>\r\n                                                    <!--<li ng-click=\"vm.flowKnowledgeContentList.splice($index,1);vm.bindingNodeChange(0,$index)\" class=\"c-red\">删除</li>-->\r\n                                                    <li ng-click=\"vm.deleteNode($index,1,0)\" class=\"c-red\">删除</li>\r\n                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div style=\"margin-left:75px;\" ng-if=\"item.actionType==0 || (item.actionType==2&&item.contentSubsequentList[0].nodeNo!=null) || item.actionType==1\">\r\n                                            <!--<div class=\"node_top\"></div>-->\r\n                                            <ol class=\"node_ol clearfix\">\r\n                                                <li class=\"f14 c_blue last\" ng-if=\"item.actionType==0\" ng-bind=\"'等待用户输入'\" style=\"max-width: 320px\"></li>\r\n                                                <li class=\"f14 c_blue\" ng-class=\"$last?'last':''\" ng-if=\"item.actionType==2&&action.nodeNo!=null\"  ng-repeat=\"action in item.contentSubsequentList track by $index\" style=\"max-width: 320px\">\r\n                                                    跳转到节点:{{action.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                                </li>\r\n                                                <li class=\"f14 c_blue\" ng-class=\"$last?'last':''\" ng-if=\"item.actionType==1\" title=\"{{action.answer}}\"  ng-repeat=\"action in item.contentSubsequentList track by $index\" ng-bind=\"'命中答案-'+action.answer\" style=\"max-width: 320px;\">\r\n                                                    命中答案-{{action.answer}}跳转到:{{action.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                                </li>\r\n                                            </ol>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <!--右侧-->\r\n                <div class=\"right_popup pa\">\r\n                    <a href=\"javascript:;\" class=\"arrow pa act\" name=\"editList\" is-arrow-show=\"2\"></a>\r\n                    <div class=\"right_popup_div clearfix \" >\r\n                        <a href=\"javascript:;\" class=\"clase_a pa\" is-arrow-show=\"0\" ng-click=\"vm.resetParams()\">×</a>\r\n                        <div style=\"width:100%;height:100%;border-bottom: 1px solid #e5e9ec;padding: 100px 10px 0 50px;\" >\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">节点名称 :</span>\r\n                                <input type=\"text\" class=\"txt txt_l bd\" ng-model=\"vm.nodeName\"  style=\"width: 260px;\" placeholder=\"请输入节点名称\"/>\r\n                            </div>\r\n                            <div>\r\n                                <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                    <span class=\"framework_s\">触发条件 :</span>\r\n                                    <input type=\"text\" class=\"txt txt_l bd_bot\"  id=\"knowTitle\" ng-show=\"vm.triggerCondition==0||vm.triggerCondition==3\" ng-focus=\"vm.triggerCondition=3\" ng-blur=\"vm.inputBlur()\" placeholder=\"请输入BOT或知识标题\" style=\"width:260px\"/>\r\n                                    <div class=\"bd p20 trigger_condition\" ng-show=\"vm.triggerCondition==3\" >\r\n                                        <p class=\"mb10\">请选择</p>\r\n                                        <ul>\r\n                                            <li class=\"\" ng-click=\"vm.triggerCondition=1\">BOT  可以添加多个意图类</li>\r\n                                            <li class=\"\" ng-click=\"vm.triggerCondition = 2;vm.triggerKnowledge=''\">知识 只能添加一条知识</li>\r\n                                        </ul>\r\n                                    </div>\r\n                                    <!--显示bot-->\r\n                                    <div class=\"value Div clearfix\" ng-show=\"vm.triggerCondition==1\">\r\n                                        <div class=\"ipt-txt-box L mr-10\">\r\n                                            <input class=\"ipt-txt bd botTagAuto strikeBotTagAuto\" disabled ng-model=\"vm.strikeValue.name\"   type=\"text\"  style=\"width: 260px;height:32px;padding-right:28px;box-sizing: border-box;\"/>\r\n                                            <i class=\"btn-menu_1\" ng-click=\"master.slideToggle('.strikeRootClassfy')\" style=\"right:1px;top:2px;width:23px;height:28px;\"></i>\r\n                                            <div class=\"rootClassfy aside-navs aside-navs2 strikeRootClassfy\" style=\"overflow: hidden; display: none;\">\r\n                                                <ul class=\"menus show\">\r\n                                                    <!--//test-->\r\n                                                    <li ng-repeat=\"item in vm.botRoot\">\r\n                                                        <div class=\"slide-a\">\r\n                                                            <a class=\"ellipsis\" href=\"javascript:;\">\r\n                                                                <i class=\"icon-jj\" data-option=\"{{item.categoryId}}\"></i>\r\n                                                                <span>{{item.categoryName}}</span>\r\n                                                            </a>\r\n                                                        </div>\r\n                                                    </li>\r\n                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"L mr10\">\r\n                                            触发次数：\r\n                                            <input type=\"number\" strike-num=\"100\" ng-model=\"vm.strikeNumber\" class=\"bd pl-10 ng-pristine ng-valid ng-valid-number\" style=\"height:32px;width:100px;\">\r\n                                        </div>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.triggerCondition=0;vm.strikeValue='';vm.triggerKnowTitle=''\" class=\"mr-15 mt-5\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                    </div>\r\n\r\n                                    <!--显示知识标题-->\r\n                                    <div ng-show=\"vm.triggerCondition==2\">\r\n                                        <input type=\"text\" class=\"txt bd trigger_know_title_key\"  ng-blur=\"vm.removeAutoList()\" ng-model=\"vm.triggerKnowTitle.name\" placeholder=\"请输入标题\" style=\"width:260px;\"/>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.triggerCondition=0;\" class=\"mr-15 mt-5\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                        <!-- 联想输入 -->\r\n                                        <ul class=\"association_ul p10 bd pa\" ng-if=\"vm.triggerCondition==2 && vm.recommendKnow.length\">\r\n                                            <li ng-repeat=\"recommend in vm.recommendKnow track by $index\" ng-bind=\"recommend.knowledgeTitle\" ng-click=\"vm.selectKnowTitle(recommend,'triggerKnowTitle')\"></li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">机器人回复 :</span>\r\n                                <input type=\"text\" ng-disabled=\"vm.triggerCondition==2\" ng-blur=\"vm.removeAutoList()\" class=\"txt txt_l bd_bot robot_key_words\"  style=\"width: 260px\" ng-model=\"vm.triggerKnowledge.name\" placeholder=\"请输入知识标题\" />\r\n                                <!--  联想输入 查询结果 -->\r\n                                <ul class=\"association_ul p10 bd pa\" ng-if=\"vm.triggerCondition!=2 && vm.recommendKnow.length\">\r\n                                    <li ng-repeat=\"recommend in vm.recommendKnow track by $index\" ng-bind=\"recommend.knowledgeTitle\" ng-click=\"vm.selectKnowTitle(recommend,'triggerKnowledge')\"></li>\r\n                                </ul>\r\n                            </div>\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">后续动作 :</span>\r\n                                <select class=\"bd\" ng-model=\"vm.actionType\">\r\n                                    <option value=\"0\" style=\"cursor: pointer;\">等待用户输入</option>\r\n                                    <option value=\"2\">跳转到其他流程</option>\r\n                                    <option value=\"1\" ng-disabled=\"!vm.isFactorKnow\" ng-class=\"!vm.isFactorKnow?'bg_e3':''\">根据答案进行跳转</option>\r\n                                </select>\r\n                                <div class=\"pt20\">\r\n                                    <div class=\"mb10\" ng-show=\"vm.actionType==0\"></div>\r\n                                    <div class=\"mb10\" ng-show=\"vm.actionType==2\">\r\n                                        跳转到：\r\n                                        <span ng-if=\"vm.knowJump[0].nodeNo!=null\">\r\n                                        <a href=\"javascript:;\" style=\"width: auto;\" class=\"appoint cp\" ng-if=\"vm.knowJump[0].nodeNo!=null\">\r\n                                            节点:{{vm.knowJump[0].nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n\r\n                                        </a>\r\n                                         <img src=\"../../../images/images/delete_img.png\" alt=\"\" ng-click=\"vm.knowJump[0].nodeNo=null\">\r\n                                    </span >\r\n\r\n                                        <a href=\"javascript:;\" style=\"width: auto;padding:5px 10px;display:inline-block;line-height:23px;\" class=\"appoint cp\" ng-if=\"vm.knowJump[0].nodeNo==null\"  ng-click=\"vm.openSelectNodeDialog(1,'',vm.knowJump[0].nodeNo)\">\r\n                                            指定节点\r\n                                        </a>\r\n                                    </div>\r\n                                    <div ng-show=\"vm.actionType==1\">\r\n                                        <div ng-if=\"vm.factorContent.length\" ng-repeat=\"content in vm.factorContent track by $index\"  class=\"mb10\">\r\n                                            答案{{$index+1}} <span class=\"answer_span\" ng-bind=\"content.answer\"></span>\r\n                                            跳转到：\r\n                                            <span ng-if=\"content.nodeNo!=null\">\r\n                                            <a href=\"javascript:;\" class=\"appoint\" style=\"width: auto;\" >\r\n                                                指定节点：{{content.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                            </a>\r\n                                            <img src=\"../../../images/images/delete_img.png\" alt=\"\"  ng-click=\"vm.factorContent[$index].nodeNo=null\">\r\n                                        </span>\r\n                                            <a href=\"javascript:;\" class=\"appoint\" style=\"width: auto;padding:5px 10px;display:inline-block;line-height:23px;\" ng-if=\"content.nodeNo==null\" ng-click=\"vm.openSelectNodeDialog(2,$index,content.nodeNo)\" >\r\n                                                指定\r\n                                            </a>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <button class=\"btn1 btn1_blue mb30\"  ng-click=\"vm.storeNewProcess(vm.isEditIndex)\">保存节点</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n\r\n"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"wrap pt-10\" >\r\n    <div class=\"know_batch_add pd30\">\r\n        <h3 class=\"f16 mb-20 bold\">知识批量新增</h3>\r\n        <div class=\"mb-20\">知识批量新增目前只支持结构化上传，非结构化请<a ui-sref=\"back.gateway\" class=\"c_blue\"> 点击此处 </a>，进行文档加工</div>\r\n        <div class=\"clearfix\">\r\n\r\n            <div class=\"L know_batch_left bd p20\">\r\n                <div class=\"framework mb-10\" style=\"padding-left: 148px;\">\r\n                    <span class=\"framework_s \">选择上传的知识类型:</span>\r\n                    <div>\r\n                        <select class=\"bd\" ng-model=\"vm.templateType\" style=\"height:30px;\">\r\n                            <option value=\"190\" ng-if=\"vm.sceneId==1\">FAQ/概念型知识/列表型知识</option>\r\n                            <option value=\"191\" ng-if=\"vm.sceneId==1\">要素型知识</option>\r\n                            <option value=\"192\" ng-if=\"vm.sceneId==2\">营销概念</option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n                <div class=\"framework mb-20\" style=\"padding-left: 148px;\">\r\n                    <span class=\"framework_s \">选择导入文件:</span>\r\n                    <div>\r\n                        <div class=\"mb-10\">\r\n                            <div know-batch-up\r\n                                 server=\"/api/ms/knowledgeManage/uploadFaqAndConceptExecl\"\r\n                                 template-type=\"vm.templateType\"\r\n                                 file-name=\"vm.fileName\">\r\n                            </div>\r\n                        </div>\r\n                        <div ng-if=\"vm.fileName\">\r\n                            已选文件 : {{vm.fileName}}\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n                <div>\r\n                    本知识库支持excel模板批量直接导入，请 <a class=\"c_blue\" ng-click=\"vm.downTemplate();\">下载模板</a> 进行填写\r\n                </div>\r\n            </div>\r\n            <div class=\"R know_batch_right bd p20\">\r\n                <p class=\"bold mb-10\">以下情况会上传失败</p>\r\n                <p class=\"mb-5\">• 文件格式错误；</p>\r\n                <p class=\"mb-5\">• 问题已经在知识库中存在；</p>\r\n                <p class=\"mb-5\">• 问题所属的分类未被创建；</p>\r\n                <p class=\"mb-5\">• 中文标点错误</p>\r\n                <p class=\"mb-5\">• 要素知识格式错误</p>\r\n                <p class=\"mb-5\">• 要素数量不符</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n</style>\r\n"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"wrap\" style=\"background:#fff;\">\r\n    <div class=\"pd-20 mt-10\" >\r\n        <div class=\"bd pr history_div\" >\r\n            <select class=\"sel \">\r\n                <option>操作人</option>\r\n                <option>加工文件</option>\r\n                <option>加工日期</option>\r\n            </select>\r\n            <input type=\"text\" />\r\n            <input type=\"button\" value=\"查找\" class=\"pa btn1 btn1_blue\" />\r\n        </div>\r\n        <div class=\"history_tabdiv\">\r\n            <table class=\"history_table\">\r\n                <thead>\r\n                    <td class=\"bold\" width=\"25%\">文件名</td>\r\n                    <td class=\"bold\" width=\"10%\">目标位置</td>\r\n                    <td class=\"bold\"  width=\"10%\">状态</td>\r\n                    <td class=\"bold\"  width=\"10%\">操作人</td>\r\n                    <td class=\"bold\"  width=\"9%\">上传总条数</td>\r\n                    <td class=\"bold\"  width=\"9%\">上传成功条数</td>\r\n                    <td class=\"bold\"  width=\"13%\">上传时间</td>\r\n                    <td class=\"bold\"  width=\"14%\">操作</td>\r\n                </thead>\r\n                <tbody>\r\n                    <tr class=\"type1\" ng-repeat=\"item in vm.uploadRecordList\" >\r\n                        <td>{{item.uploadName}}</td>\r\n                        <td>{{item.uploadType | uploadRecordTypeFilter}}</td>\r\n                        <td>{{item.uploadStatus | uploadRecordStatus}}</td>\r\n                        <td>{{item.userName}}</td>\r\n                        <td>{{item.uploadSum}}</td>\r\n                        <td>{{item.uploadSuccess}}</td>\r\n                        <td>{{item.uploadTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                        <td>\r\n                            <button  ng-if=\"item.uploadSum!=item.uploadSuccess\" class=\"btn1 btn1_blue mr-10\" ng-click=\"downRecordFile(item.uploadName)\">查看</button>\r\n                            <button  class=\"btn1 btn_delete\"  ng-click=\"deleteRecord(item.uploadId)\">删除</button>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n            <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<script>\r\n\r\n</script>"

/***/ })
])