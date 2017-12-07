webpackHotUpdate(0,{

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 路由配置
	 */
	module.exports = function (angular) {
	    //  导航条 公共
	    var nav = __webpack_require__(22),

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
	                var template = __webpack_require__(37);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
	                    var loginModule = __webpack_require__(38)(angular); //动态加载Module
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
	        template: __webpack_require__(23),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(4, function () {
	                    var homePageModule = __webpack_require__(41)(angular); //动态加载Module
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
	                template: __webpack_require__(24),
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
	                template: __webpack_require__(25),
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
	                template: __webpack_require__(26),
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
	                var template = __webpack_require__(46);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "ApplicationSettingController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(6, function () {
	                    var applicationManagementModule = __webpack_require__(47)(angular);
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
	                template: __webpack_require__(27),
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
	                template: __webpack_require__(28),
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
	                template: __webpack_require__(29),
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
	                template: __webpack_require__(30),
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
	                template: __webpack_require__(31),
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
	                template: __webpack_require__(31),
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
	                template: __webpack_require__(32),
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
	                template: __webpack_require__(33),
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
	                template: __webpack_require__(34),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //--------------------------------------------------
	    //          ##业务建模##
	    //--------------------------------------------------
	    // bot
	    // 框架库
	    // 概念库
	    //--------------------------------------------------
	    //          ##知识管理KM##
	    //--------------------------------------------------
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
	                template: __webpack_require__(68),
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
	                template: __webpack_require__(69),
	                controller: "CustPreviewController"
	            }
	        }
	    },
	    // 知识单条新增
	    //faq
	    // 新增
	    {
	        name: "KM.faq.new",
	        url: "/faq/new",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/edit",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //概念
	    // 新增
	    {
	        name: "KM.faq.new",
	        url: "/node",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/edit",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //列表
	    // 新增
	    {
	        name: "KM.faq.new",
	        url: "/node",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/edit",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //要素
	    // 新增
	    {
	        name: "KM.faq.new",
	        url: "/node",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/edit",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    //富文本
	    // 新增
	    {
	        name: "KM.faq.new",
	        url: "/node",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    },
	    // faq编辑
	    {
	        name: "KM.faq.edit",
	        url: "/edit",
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
	                template: __webpack_require__(36),
	                controller: "NodeManageController"
	            }
	        }
	    }];
	};

/***/ })

})