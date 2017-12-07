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
	__webpack_require__(26)(xf_web);
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

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module :
	 */
	"use strict";

	module.exports = function (ngModule) {
	    /*  定义常量 统一为constantMethod方法
	     *   使用为注入方式
	     * */
	    ngModule.constant('constantMethod', {
	        "LAZY_LOAD_DEP": lazyLoadDep, // js
	        "LAZY_LOAD_TEMPLATE": lazyLoadTemplate, // html
	        "Modules_Config": [{
	            name: 'treeControl',
	            serie: true,
	            files: []
	        }]
	    })
	    /**
	     * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
	     * 这里的run方法只会在angular启动的时候运行一次。
	     * @param  {[type]} $rootScope
	     * @param  {[type]} $state
	     * @param  {[type]} $stateParams
	     * @return {[type]}
	     */
	    .run(function ($rootScope, $state, $stateParams, $location, localStorageService, $window) {
	        $rootScope.$state = $state;
	        $rootScope.$stateParams = $stateParams;

	        //监听路由的变化，一旦发生变化校验用户登录情况
	        $rootScope.$on("$stateChangeStart", function (event, next, toParams, fromState, fromParams) {
	            console.log(next, toParams, fromState, fromParams);
	        });

	        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
	            console.log(toState, toParams, fromState, fromParams);
	        });
	        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
	            console.log('没有找到对应的状态');
	            /*unfoundState包含了三个属性:*/
	            /*1.to:前往的状态名(也就是没有找到的这个状态名)
	             * 2.toParams:前往的状态的参数(在使用ui-sref或者$state.go()的时候可以传入,这个例子里就是{a:1,b:2})
	             * 3.options:使用$state.go()的时候传入的第三个参数.
	             * */
	            /*最后两个参数同上*/
	            console.log(unfoundState);
	            //如果不写这句,那么接下来就会报错,卡住js进程了.
	            event.preventDefault();
	        });
	        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
	            console.log('----切换状态出错----');
	            /*error是一个包含了错误信息的对象*/
	            console.info(error);
	        });
	        //视图事件
	        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
	            console.log('----视图开始加载----');
	        });
	        $rootScope.$on('$viewContentLoaded', function (event) {
	            console.log('----视图渲染完毕----');
	        });
	        //back button function called from back button"s ng-click="back()"
	        $rootScope.back = function () {
	            //实现返回的函数
	            $state.go($rootScope.previousState_name, $rootScope.previousState_params);
	        };
	    });
	};
	//oclzayload 封装
	var lazyLoadTemplate = function lazyLoadTemplate(tpls) {
	    for (var _len = arguments.length, base = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        base[_key - 1] = arguments[_key];
	    }

	    if (base) {
	        angular.forEach(tpls, function (item, index) {
	            tpls[index] = base + item;
	        });
	    }
	    return ['$q', function ($q) {
	        var deferred = $q.defer();
	        __webpack_require__.e/* nsure */(1, function () {
	            var template = __webpack_require__(17)(tpls);
	            deferred.resolve(template);
	        });
	        return deferred.promise;
	    }];
	};
	var lazyLoadDep = function lazyLoadDep(tpls) {
	    for (var _len2 = arguments.length, angular = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        angular[_key2 - 1] = arguments[_key2];
	    }

	    return {
	        loadTemplate: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	            var defer = $q.defer();
	            __webpack_require__.e/* nsure */(1/* duplicate */, function () {
	                /**
	                 *let module = LoginModule(angular);
	                 *注意import导入LoginModule方法与require('./login.module')直接引用LoginModule方法是有区别的，
	                 *import导入LoginModule方法不能分离js
	                 */
	                var Module = __webpack_require__(17)(tpls)(angular); //动态加载Module
	                $ocLazyLoad.load({
	                    name: Module.name //name就是你module的名称
	                });
	                defer.resolve(Module);
	            });
	            return defer.promise;
	        }]
	    };
	};

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
	    //           登录页面
	    //--------------------------------------------------
	    {
	        name: 'login',
	        url: '/login',
	        data: {
	            roles: []
	        },
	        title: "登录",
	        templateProvider: ['$q', function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(6, function () {
	                var template = __webpack_require__(33);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: 'loginController',
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(7, function () {
	                    var loginModule = __webpack_require__(34)(angular); //动态加载Module
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
	    //          首页
	    //--------------------------------------------------
	    // 首页容器 以及加载依赖
	    {
	        name: 'HP',
	        url: '/HP',
	        data: {
	            roles: []
	        },
	        title: "首页容器加载依赖",
	        template: __webpack_require__(30),
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(4, function () {
	                    var homePageModule = __webpack_require__(36)(angular); //动态加载Module
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
	        name: 'HP.define"',
	        url: '/define',
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "首页",
	        views: {
	            'header': {
	                template: nav,
	                controller: "homePageNavController"
	            },
	            'content': {
	                template: __webpack_require__(31),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 应用 管理
	    {
	        name: 'HP.management',
	        url: '/management',
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "应用管理",
	        views: {
	            'header': {
	                template: nav,
	                controller: "homePageNavController"
	            },
	            'content': {
	                template: __webpack_require__(32),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 权限管理
	    {
	        name: 'HP.permission"',
	        url: '/permission',
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "默认首页",
	        views: {
	            'header': {
	                template: nav,
	                controller: "homePageNavController"
	            }
	            // 'content': {
	            //     template: require('../static/admin/userManage.html'),
	            //     controller: "userManageController"
	            // }
	        }
	    }];
	};

	(function is360se() {
	    var UA = window.navigator.userAgent;
	    if (UA.toLowerCase().indexOf('360se') > -1 && UA.indexOf('compatible') != -1) {
	        alert('请切换至急速模式');
	    }
	})();

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

	module.exports = "<div class=\"homeWrapper\">\r\n    <div ui-view=\"header\"></div>\r\n\r\n    <div ui-view=\"sidebar\"></div>\r\n\r\n    <div ui-view=\"content\"></div>\r\n\r\n    <div ui-view=\"footer\"></div>\r\n</div>\r\n"

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"i-nav\">\r\n    <div class=\"i-img-box i-img1\">\r\n        <a  ui-sref=\"knowledgeManagement.markPreview\" ng-if=\"vm.sceneId==2\">\r\n            <div class=\"psa\">\r\n                <strong>营销场景知识管理</strong>\r\n                <p>可以针对营销场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n        <a ui-sref=\"knowledgeManagement.custOverview\" ng-if=\"vm.sceneId==1\">\r\n            <div class=\"psa\" >\r\n                <strong>客服场景知识管理</strong>\r\n                <p>可以针对客服场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img2\">\r\n        <a ui-sref=\"relationalCatalog.manage\">\r\n            <div class=\"psa\">\r\n                <strong>业务建模</strong>\r\n                <p>针对概念，业务分类进行继承复用以及上传</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img3\">\r\n        <a ui-sref=\"functionalTest.questionTest\">\r\n            <strong class=\"psa1\">测试功能</strong>\r\n            <p class=\"psa2\">提供多样化测试工具</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img4\">\r\n        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n            <strong class=\"psa1\">素材管理</strong>\r\n            <p class=\"psa2\">可以上传不同的富文本内容</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img5\">\r\n        <a ui-sref=\"back.gateway\">\r\n            <div class=\"psa\">\r\n                <strong>知识自动加工</strong>\r\n                <p>针对不同格式的知识，生成结构化知识的体系</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ 32:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <h4 class=\"pt-20 pb-20\"><img src=\"../../../../images/u15.png\" width=\"20\" height=\"20\" />\r\n        <b class=\"f16 ml-5 mt-5\" style=\"color:green;\">我的应用</b>\r\n    </h4>\r\n    <div class=\"p20 my_appbox cl mb-20\">\r\n        <div class=\"L\">\r\n            <div class=\"mb-10\">用户名称： {{vm.userName}}</div>\r\n            <div>\r\n                <!--<span>所属部门：云创中心</span>-->\r\n                <span>用户权限：\r\n                    <span ng-repeat=\"permission in vm.userPermission\" >{{permission}} </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"R\">\r\n            <div ng-click=\"vm.addApplicationWindow()\" style=\"cursor: pointer\">\r\n                <img src=\"../../../../images/u25.png\" width=\"50\" height=\"50\" />\r\n                <p class=\"mt-10\">新建应用</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"application_box clearfix\">\r\n        <div class=\"L text-c application_box_list bd\" ng-repeat=\"application in vm.myApplication\">\r\n            <a ui-sref=\"setting.Infor\" >\r\n                <img ng-if=\"application.sceneId==2\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\"  src=\"../../../../images/marketing.png\" width=\"80\" height=\"80\"/>\r\n                <img ng-if=\"application.sceneId==1\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/cust_service.png\" width=\"80\" height=\"80\"/>\r\n                <img ng-if=\"application.sceneId==3\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/images/u33.png\" width=\"80\" height=\"80\"/>\r\n            </a>\r\n            <div class=\"p10 mb-10 bd_bot\" >\r\n                <p title=\"{{application.applicationName}}\" class=\"name\" ng-if=\"application.applicationName.length>8\">{{application.applicationName | limitCheckFilter}}</p>\r\n                <p class=\"name\" ng-if=\"application.applicationName.length<=8\">{{application.applicationName}}</p>\r\n                <p class=\"scene\" ng-repeat=\"licence in vm.selectLicence\"\r\n                   ng-if=\"application.sceneId==licence.sceneId\">场景类型：<span>{{licence.sceneName}}</span></p>\r\n                    <p class=\"status\">应用状态：\r\n                        <span ng-if=\"application.statusId==40001\" class=\"c-orange\">未使用</span>\r\n                        <span ng-if=\"application.statusId==40002\" class=\"c-primary\">使用中</span>\r\n                        <span ng-if=\"application.statusId==40003\" class=\"c-error\">已停用</span>\r\n                    </p>\r\n            </div>\r\n            <p title=\"{{application.applicationDescription}}\" class=\"describe\" ng-if=\"application.applicationDescription.length>8\">{{application.applicationDescription | limitCheckFilter}}</p>\r\n            <p class=\"describe\" ng-if=\"application.applicationDescription.length<=8\">&nbsp;{{application.applicationDescription}}</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .application_box{background:#fff;padding:20px 0px 20px 20px; clear: both;}\r\n    .application_box_list{padding:10px;box-sizing:border-box;width:273px;margin:0 20px 20px 0;height:220px;}\r\n    .application_box_list p{min-height:21px;}\r\n    .application_box_list .describe{\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n    .application_box_list .status .c-blue{\r\n        color:lightblue;\r\n    }\r\n\r\n    \r\n</style>"

/***/ })

})