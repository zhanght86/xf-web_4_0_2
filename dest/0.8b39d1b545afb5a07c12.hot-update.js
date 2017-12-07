webpackHotUpdate(0,{

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
	    //           ##登录页面
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
	            __webpack_require__.e/* nsure */(2, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: 'LoginController',
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
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
	    //          ##首页
	    //--------------------------------------------------
	    // 首页容器 以及加载依赖
	    {
	        name: 'HP',
	        url: '/HP',
	        data: {
	            roles: []
	        },
	        title: "首页容器加载依赖",
	        template: __webpack_require__(21),
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(4, function () {
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
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(22),
	                controller: "HomePageContentController"
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
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(35),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 权限管理
	    {
	        name: 'HP.permission',
	        url: '/permission',
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "默认首页",
	        views: {
	            'header': {
	                template: nav,
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(23),
	                controller: "PermissionController"
	            }
	        }
	    }];
	};

/***/ })

})