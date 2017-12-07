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
	            __webpack_require__.e/* nsure */(2, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: 'loginController',
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
	                    var loginModule = __webpack_require__(25)(angular); //动态加载Module
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
	                controller: "homePageNavController"
	            },
	            'content': {
	                template: __webpack_require__(22),
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
	                template: __webpack_require__(35),
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
	            },
	            'content': {
	                template: __webpack_require__(23),
	                controller: "userManageController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <h4 class=\"pt-20 pb-20\"><img src=\"../../../../images/u15.png\" width=\"20\" height=\"20\" />\r\n        <b class=\"f16 ml-5 mt-5\" style=\"color:green;\">我的应用</b>\r\n    </h4>\r\n    <div class=\"p20 my_appbox cl mb-20\">\r\n        <div class=\"L\">\r\n            <div class=\"mb-10\">用户名称： {{vm.userName}}</div>\r\n            <div>\r\n                <!--<span>所属部门：云创中心</span>-->\r\n                <span>用户权限：\r\n                    <span ng-repeat=\"permission in vm.userPermission\" >{{permission}} </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"R\">\r\n            <div ng-click=\"vm.addApplicationWindow()\" style=\"cursor: pointer\">\r\n                <img src=\"../../../../images/u25.png\" width=\"50\" height=\"50\" />\r\n                <p class=\"mt-10\">新建应用</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"application_box clearfix\">\r\n        <div class=\"L text-c application_box_list bd\" ng-repeat=\"application in vm.myApplication\">\r\n            <a ui-sref=\"setting.Infor\" >\r\n                <!--<img ng-if=\"application.sceneId==2\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\"  src=\"../../../../images/marketing.png\" width=\"80\" height=\"80\"/>-->\r\n                <img ng-click=\"vm.selectScene(application.sceneId,application.id)\" src=\"../../../../images/cust_service.png\" width=\"80\" height=\"80\"/>\r\n                <!--<img ng-if=\"application.sceneId==3\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/images/u33.png\" width=\"80\" height=\"80\"/>-->\r\n            </a>\r\n            <div class=\"p10 mb-10 bd_bot\" >\r\n                <p title=\"{{application.name}}\" class=\"name\" >{{application.name | limitCheckFilter:8}}</p>\r\n                <!--<p class=\"name\" ng-if=\"application.name.length<=8\">{{application.name}}</p>-->\r\n                <p class=\"scene\">场景类型：<span>客服型</span></p>\r\n                    <p class=\"status\">应用状态：\r\n                        <span ng-if=\"application.statusId==40001\" class=\"c-orange\">未使用</span>\r\n                        <span ng-if=\"application.statusId==40002\" class=\"c-primary\">使用中</span>\r\n                        <span ng-if=\"application.statusId==40003\" class=\"c-error\">已停用</span>\r\n                    </p>\r\n            </div>\r\n            <p title=\"{{application.description}}\" class=\"describe\">{{application.description | limitCheckFilter:8}}</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .application_box{background:#fff;padding:20px 0 20px 20px; clear: both;}\r\n    .application_box_list{padding:10px;box-sizing:border-box;width:273px;margin:0 20px 20px 0;height:220px;}\r\n    .application_box_list p{min-height:21px;}\r\n    .application_box_list .describe{\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n    .application_box_list .status .c-blue{\r\n        color:lightblue;\r\n    }\r\n\r\n    \r\n</style>"

/***/ })

})