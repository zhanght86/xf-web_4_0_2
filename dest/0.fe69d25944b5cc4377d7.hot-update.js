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

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"homePageNav\">\r\n    <div class=\"header clearfix\">\r\n        <div class=\"logo\">\r\n            <a ui-sref=\"HP.define\"><strong>小富机器人控制台</strong><em class=\"edition\">V4.0</em></a>\r\n            <!--<a ui-sref=\"homePage.define\"><strong>小富机器人控制平台</strong><em class=\"edition\">V4.0</em></a>-->\r\n        </div>\r\n        <ul class=\"nav\">\r\n            <li>\r\n                <a ui-sref=\"HP.define\">首页</a>\r\n            </li>\r\n            <li>\r\n                <a ng-click=\"vm.logApplication()\">应用管理</a>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">业务建模<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"relationalCatalog.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jmzy\"></i>\r\n                            <span>BOT</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"frameworkLibrary.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lmgl\"></i>\r\n                            <span>框架库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"conceptManage.synony\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_gngl\"></i>\r\n                            <span>概念库</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">知识管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"KM.overview\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zszl\"></i>\r\n                            <span>知识总览</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <ul class=\"menu_1 menu_2 \" style=\"min-height: 40%;\">\r\n                            <li>\r\n                                <a ui-sref=\"KM.faq.new\">\r\n                                    <span>FAQ知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.concept.new\">\r\n                                    <span>概念知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                          \r\n                                <a ui-sref=\"KM.list.new\">\r\n                                    <span>列表知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                             \r\n                                <a ui-sref=\"KM.factor.new\">\r\n                                    <span>要素知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.richText.new\">\r\n                                    <span>富文本知识</span>\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                        <a href=\"javascript:;\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsjg\"></i>\r\n                            <span>知识单条新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.batch\">\r\n                            <i class=\"icon-nav icon-nav__icon-zsplxz\"></i>\r\n                            <span>知识批量新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.document\">\r\n                            <i class=\"icon-nav icon-nav__icon-wdjgxz\"></i>\r\n                            <span>文档加工新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a ui-sref=\"setting.releaseMan\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zsfb\"></i>-->\r\n                            <!--<span>知识发布</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zssh\"></i>-->\r\n                            <!--<span>知识审核</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"KM.history\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lsck\"></i>\r\n                            <span>历史查看</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">测试功能<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.questionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wfcs\"></i>\r\n                            <span>问法测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.sessionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltcs\"></i>\r\n                            <span>会话测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.batchTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_plcs\"></i>\r\n                            <span>批量测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.participle\">\r\n                            <i class=\"icon-nav icon-nav_fcyy\"></i>\r\n                            <span>分词应用</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">应用分析<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.accessStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fwtj\"></i>\r\n                            <span>访问统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.knowledgeRanking\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsdpm\"></i>\r\n                            <span>知识点排名统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_wpp\"></i>-->\r\n                            <!--<span>未匹配问题统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>-->\r\n                            <!--<span>分类统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionDetails\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_hhmx\"></i>\r\n                            <span>会话明细统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.satisfactionDegree\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jjltj\"></i>\r\n                            <span>会话满意度统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.resolutionStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>\r\n                            <span>问答解决率统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.reinforcementLearn\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_zqxx\" ></i>\r\n                            <span>智能学习</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.newKnowledgeDiscoveryLearn\">\r\n                            <i class=\"icon-nav icon-nav_xzzfx\" ></i>\r\n                            <span>未匹配问题聚类</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.operationLog\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_czrz\" ></i>\r\n                            <span>操作日志</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionLog\">\r\n                            <i class=\"icon-nav icon-nav_hhrz\" ></i>\r\n                            <span>会话日志</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">素材管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltzsk\"></i>\r\n                            <span>聊天知识库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_hxck\"></i>-->\r\n                            <!--<span>寒暄词库</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.pictureLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_tpk\"></i>\r\n                            <span>图片库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.teletextMessage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_twfxk\"></i>\r\n                            <span>图文消息库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.speechLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>语音库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.documentLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>文档库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li >-->\r\n                        <!--<a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>-->\r\n                            <!--<span>自动导入更新</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">深度学习<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deeplearnConfig\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>模型构建</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deepLearningCon\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxxl\"></i>\r\n                            <span>模型训练</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.similarityCalculation\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxcs\"></i>\r\n                            <span>模型测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>\r\n                            <span>自动导入更新</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">系统监控<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.resource\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>资源监控</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.service\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>服务监控</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n        <div class=\"header-r\">\r\n            <div class=\"user-admin mr-20\">\r\n                <a class=\"user-name\" href=\"javascript:;\"><i></i><span>{{vm.userName}}</span></a>\r\n                <div class=\"ua-menu_1-box\">\r\n                    <ul class=\"ua-menu_1\">\r\n                        <li>\r\n                            <a ui-sref=\"HP.permission\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r1\"></i>\r\n                                <span>权限管理</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a ui-sref=\"HP.management\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r2\"></i>\r\n                                <span>切换应用</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:;\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r3\"></i>\r\n                                <span ng-click=\"vm.loginout()\">退出登录</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class=\"mail-conver\" style=\"margin-left:0;\">\r\n                <!--<a ui-sref=\"KM.historyView\" class=\"mail\">-->\r\n                    <!--&lt;!&ndash;<em>2</em>&ndash;&gt;-->\r\n                <!--</a>-->\r\n                <a  class=\"conver\" ng-click=\"vm.queryServiceList()\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"crumbs-nav bgwhite mt20  warp\" ng-show=\"checkShowCrumbs()\">\r\n    <span class=\"cn-lable\">你曾经路过此地：</span>\r\n\r\n    <span class=\"cn-value\" ng-repeat=\"crumb in crumbs track by $index\">\r\n        <a class=\"cn-a\" ui-sref=\"{{crumb.url}}\" ng-bind=\"crumb.name\"></a>\r\n        <i class=\"close\" ng-hide=\"checkShowClose(crumb.url)\" ng-click=\"closeCrumb($index)\" >x</i>\r\n    </span>\r\n</div>"

/***/ }),

/***/ 68:
/***/ (function(module, exports) {

	module.exports = "<!--<div ui-view=\"header\"></div>-->\r\n<div class=\"main warp customer-over\">\r\n    <div class=\"page-lrcont210 clearfix bgwhite mt10\" style=\"min-height: 800px;\">\r\n        <div class=\"l-aside fl\">\r\n            <div class=\"aside-hd tac\">\r\n                <!--<img class=\"hd-img\" src=\"../../../images/images/poto.png\"/>-->\r\n                <!--{{vm.imgUrl}}  +++    {{vm.robotHead}}-->\r\n                <!--<img class=\"hd-img\" ng-src=\"{{vm.imgUrl}}{{vm.robotHead}}\"/>-->\r\n                <div style=\"width:110px;height:110px;overflow: hidden;border-radius:50%;margin:0 auto;border:3px solid #fff;\">\r\n                    <!--<img class=\"hd-img\" ng-src=\"../../images/touxiang1.png\"/>-->\r\n                    <img class=\"hd-img\" ng-src=\"{{$parent.$parent.MASTER.headImage}}\"/>\r\n                </div>\r\n                <span class=\"hd-name ellipsis\">{{vm.applicationName}}</span>\r\n            </div>\r\n            <div class=\"aside-nav aside-navn\">\r\n                <ul class=\"\">\r\n                    <li class=\"type1\"  ng-repeat=\"item in vm.botRoot\" data-option-id=\"{{item.categoryId}}\">\r\n                        <a class=\"slide-a ellipsis\" href=\"javascript:;\">\r\n                            <i class=\"icon-jj ngBotAdd\" data-option-id=\"{{item.categoryId}}\"></i>\r\n                            <span data-option-id=\"{{item.categoryId}}\">{{item.categoryName}}</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"sideBotFullPath\">\r\n                <ul>\r\n                    <li class=\"fullpath\" ng-repeat=\"item in vm.selectedBot\">\r\n                       {{item}}\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"r-cont pd30\">\r\n            <div class=\"r-cont-hd\">\r\n                <span>客服型场景知识总览</span>\r\n            </div>\r\n            <div class=\"r-cont-bd\">\r\n                <div class=\"csso-cz-box clearfix mt30 \">\r\n                    <div class=\"L pr \">\r\n                        <div class=\"\">\r\n                            <div class=\"L\" style=\"position: relative;\">\r\n                                <input type=\"text\" class=\"input_text L mr-10\" ng-model=\"vm.knowledgeTitle\" placeholder=\"请输入知识标题\" ng-keypress=\"vm.keySearch($event)\"  />\r\n                                <button class=\"btn1 btn1_blue L mr-10\" ng-click=\"vm.napSearch()\" style=\"height:31px;font-size:14px;\">查找</button>\r\n                                <!--<span ng-click=\"vm.napSearch()\" class=\"cust_searchTip\" ></span>-->\r\n                            </div>\r\n                            <button class=\"btn se-search-btn L\" ng-click=\"vm.heighSarch=!vm.heighSarch\" style=\"border: 1px solid #3ea9fb;\">高级查找</button>\r\n                            <!--<button class=\"btn1 btn1_blue advanced_sear_btn\" ng-click=\"vm.heighSarch=!vm.heighSarch\">高级查找</button>-->\r\n                            <!--<button class=\"btn1 btn1_blue advanced_sear_btn\" ng-click=\"vm.paramsReset()\">重置</button>-->\r\n                        </div>\r\n                        <div class=\"advanced_search bd\" style=\"background:#fff;width:540px;\">\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识内容:</span>\r\n                                <input type=\"text\" class=\"input_text\" ng-model=\"vm.seekAdvanceParameter.knowledgeContent\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识扩展问:</span>\r\n                                <input type=\"text\" ng-model=\"vm.seekAdvanceParameter.searchExtension\" class=\"input_text\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识有效期：</span>\r\n                                <span>\r\n                                    <input type=\"text\" id=\"startTime\" onchange=\"\"  ng-model=\"vm.seekAdvanceParameter.knowledgeExpDateStart\"  onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\'endTime\\')}'})\" class=\"input-text Wdate \"  style=\"width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;\" placeholder=\"请选择开始日期\" readonly>\r\n                                    -\r\n                                    <input type=\"text\" id=\"endTime\"   onchange=\"\" ng-model=\"vm.seekAdvanceParameter.knowledgeExpDateEnd\" onclick=\"WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\'startTime\\')}'})\" class=\"input-text Wdate \"  style=\"width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;\" placeholder=\"请选择结束日期\" readonly>\r\n                                </span>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">作者:</span>\r\n                                <input type=\"text\" class=\"input_text\" ng-model=\"vm.seekAdvanceParameter.knowledgeCreator\"/>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识类型:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\"  value=\"\" type=\"radio\" name=\"knoe_type\"/>全部</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\"  value=\"100\" type=\"radio\" name=\"knoe_type\" />FAQ</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"101\" type=\"radio\" name=\"knoe_type\" />概念</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"102\" type=\"radio\" name=\"knoe_type\" />列表</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"103\"  type=\"radio\" name=\"knoe_type\" />要素</label>\r\n                                    <label class=\"mr-10\"><input ng-model=\"vm.seekAdvanceParameter.knowledgeType\" value=\"106\"  type=\"radio\" name=\"knoe_type\" />富文本</label>\r\n\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">知识来源:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"0\" />全部</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"120\" />单条新增</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"knoe_sources\" ng-model=\"vm.seekAdvanceParameter.sourceType\" value=\"122\" />文档加工</label>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"framework mb-10\" style=\"padding-left: 85px;\">\r\n                                <span class=\"framework_s\">更新时间:</span>\r\n                                <div>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"0\"/>不限</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"1\"/>近三天</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"2\"/>近七天</label>\r\n                                    <label class=\"mr-10\"><input type=\"radio\" name=\"time\" ng-model=\"vm.seekAdvanceParameter.updateTimeType\" value=\"3\"/>近一月</label>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"tc\">\r\n                                <input type=\"button\" class=\"btn1 btn1_blue mr-10\" value=\"搜索\" ng-click=\"vm.napSearch()\" />\r\n                                <button class=\"btn1 btn_green advanced_sear_btn\" ng-click=\"vm.paramsReset()\">重置</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"fr\">\r\n                        <select class=\"sel bd L mr-10\" ng-model=\"vm.newKnowledge\" ng-change=\"vm.jumpToNewKonwledge(vm.newKnowledge)\" style=\"width: 126px;\">\r\n                            <option value=\"false\" style=\"display:none;\">单条知识新增</option>\r\n                            <option value=\"100\">FAQ型知识新增</option>\r\n                            <option value=\"101\">概念知识型新增</option>\r\n                            <option value=\"102\">列表型知识新增</option>\r\n                            <option value=\"103\">要素型知识新增</option>\r\n                            <option value=\"106\">富文本知识新增</option>\r\n                        </select>\r\n                        <a class=\"L btn btn-blue mr-10\" href=\"javascript:;\" ui-sref=\"knowledgeManagement.knowBatchAdditions\" style=\"line-height:17px;\">批量导入</a>\r\n                        <!--<a class=\"btn btn-green\" href=\"javascript:;\" style=\"line-height:17px;\">知识加工</a>-->\r\n                        <button class=\"btn1 L btn_green\"  ng-click=\"vm.exportExcel()\" style=\"height:31px;font-size:14px;\">知识导出</button>\r\n\r\n                    </div>\r\n                </div>\r\n                <div class=\"csso-cont mt30\">\r\n\r\n                    <div class=\"clearfix csso-hd\">\r\n                        <div class=\"fl\">\r\n                            <!--<input type=\"checkbox\" ng-checked=\"vm.isSelectAll\" ng-click=\"vm.selectAll(vm.listData)\"/>-->\r\n                            <!--<a href=\"javascript:;\" class=\"selectall_a  selectall_a1  L\" ng-checked=\"vm.isSelectAll\" ng-click=\"vm.selectAll(vm.listData)\"></a>-->\r\n                            <!-- 全选-->\r\n                            <span class=\"L\" checkbox-overview ng-click=\"vm.selectAll(vm.listData)\" result=\"vm.isSelectAll\"></span>\r\n\r\n                            <span class=\"L\"><span>总计<em>{{vm.paginationConf.totalItems}}</em>条数据，今日新增<em>{{vm.newNumber}}</em>条</span></span>\r\n                        </div>\r\n                        <div class=\"fr\"  ng-click=\"vm.delData()\">\r\n                            <a class=\"ljtClose-btn\" href=\"javascript:;\" >\r\n                                <i class=\"icon-ljtClose\"></i>\r\n                                <span style=\"color:#e84f4f;\" >删除</span>\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"clearfix csso-bd \" style=\"min-height:300px;padding-left:15px;\">\r\n                        <ul class=\"csso-lsit\">\r\n                            <li ng-repeat=\"item in vm.listData\">\r\n                                <div class=\"title\">\r\n                                    <span checkbox-overview ng-click=\"vm.addDelIds(item.knowledgeId,vm.knowledgeIds)\" result=\"vm.knowledgeIds.inArray(item.knowledgeId)\"></span>\r\n                                    <a href=\"javascript:;\" ui-sref=\"knowledgeManagement.custPreview({knowledgeId:item.knowledgeId,knowledgeType:item.knowledgeType})\">\r\n                                        {{item.knowledgeTitle}}\r\n                                    </a>\r\n                                </div>\r\n                                <div class=\"txt-cont mt10\">\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">概念扩展个数：</div>\r\n                                        <div class=\"value oh\">\r\n                                            {{item.extensionCount}} 个\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">知识内容：</div>\r\n                                        <!--{{item.knowledgeContent}}-->\r\n                                        <!--{{vm.listData}}-->\r\n                                        <div class=\"value oh\">\r\n                                            <ul class=\"\">\r\n                                                <li ng-if=\"item.knowledgeType==106 \" title=\"{{item.knowledgeContent}}\">\r\n                                                    <!--<p>{{item.knowledgeContent}}</p>-->\r\n                                                    <!--<p  ng-if=\"item.knowledgeContentNegative==110\">文本</p>-->\r\n                                                    <p  ng-if=\"item.knowledgeContentNegative==111\">\r\n                                                        图片\r\n                                                    </p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==112\">语音</p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==113\">文本</p>\r\n                                                    <p ng-if=\"item.knowledgeContentNegative==114\">图文</p>\r\n                                                </li>\r\n                                                <!-- 列表 概念  faq 知識-->\r\n                                                <li ng-if=\"item.knowledgeType!=103 && item.knowledgeType!=106\" title=\"{{item.knowledgeContent}}\">\r\n                                                    <!--<p>{{item.knowledgeContent}}</p>-->\r\n                                                    <p ng-if=\"item.knowledgeContent.length<=50\">{{item.knowledgeContent}}</p>\r\n                                                    <p ng-if=\"item.knowledgeContent.length>50\">{{item.knowledgeContent.substring(0,50)+'...'}}</p>\r\n                                                </li>\r\n                                                <!-- 要素知識-->\r\n                                                <li ng-if=\"item.knowledgeType==103\">\r\n                                                    <p><strong>该要素知识包含条数：</strong> {{item.tableCount}}条</p>\r\n                                                    <p><strong>新添加要素数：</strong> {{item.elementsCount}}条</p>\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"txt-item oh\">\r\n                                        <div class=\"lable fl\">知识类型：</div>\r\n                                        {{item.knowledgeTypeDetail}}\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"csso-info oh\">\r\n                                    <div class=\"fr\">\r\n                                        <span class=\"mr-20\">作者：{{item.knowledgeCreator}}</span>\r\n                                        <span>更新时间：{{item.knowledgeModifyTime |  date : 'yyyy-MM-dd'}}</span>\r\n                                    </div>\r\n                                </div>\r\n                            </li>\r\n                        </ul>\r\n                        <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ 69:
/***/ (function(module, exports) {

	module.exports = "<!--<div ui-view=\"header\"></div>-->\r\n<div class=\"main warp\">\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"r-cont-hd\">\r\n            <span>知识预览</span>\r\n        </div>\r\n        <ul class=\"Preview\">\r\n            <li>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.knowledgeTitle\">\r\n                    <span>知识标题：</span>\r\n                    {{vm.listData.knowledgeBase.knowledgeTitle}}\r\n                </p>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.knowledgeExpDateStart\">\r\n                    <span>知识有效期：</span>\r\n                    {{vm.listData.knowledgeBase.knowledgeExpDateStart  |  date : 'yyyy-MM-dd '}} 至 {{vm.listData.knowledgeBase.knowledgeExpDateEnd |  date : 'yyyy-MM-dd '}}\r\n                </p>\r\n                <p class=\"mb-10\" ng-if=\"vm.listData.knowledgeBase.classificationAndKnowledgeList\" ng-repeat=\"item in vm.listData.knowledgeBase.classificationAndKnowledgeList track by $index\"><span ng-class=\"$index==0?'':'mileVs'\">BOT路径：</span> <b  style=\"font-weight:normal;\">{{item.className.join(\"/\")}}</b></p>\r\n            </li>\r\n\r\n            <!-- 要素列表 faq -->\r\n            <li  ng-if=\"vm.knowledgeType!=101\" class=\"borderN\">\r\n                <p ng-if=\"vm.knowledgeType!=100\" ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">概念扩展：</span>\r\n                     <span style=\"width: auto;\" >\r\n                        {{item.extensionQuestionTitle}}\r\n                    </span>\r\n                </p>\r\n                <p ng-if=\"vm.knowledgeType==100\" ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">扩展问题：</span>{{item.extensionQuestionTitle}}\r\n                </p>\r\n            </li>\r\n            <li ng-class=\"vm.knowledgeType==101?'':'borderN'\" style=\"border-bottom: 0\">\r\n                <div class=\"knowContent mb-10\" ng-repeat=\"item in vm.listData.knowledgeContents track by $index\">\r\n                    <span ng-class=\"$index!=0?'mileVs':''\">知识内容：</span>\r\n                    <div class=\"PreviewRight\">\r\n                        <!-- faq 概念 列表 富文本-->\r\n                        <p  ng-if=\"vm.knowledgeType!=103\">内容 {{$index+1 | numberToWord}}</p>\r\n                        <!-- fqq 概念-->\r\n                        <div  ng-if=\"(vm.knowledgeType!=103) && (vm.knowledgeType!=102)\">\r\n                            <!--{{item.knowledgeContent}}-->\r\n                                <p ng-if=\"vm.knowledgeType==106\"  ng-bind-html=\"item.knowledgeContent | emotion  | toHtml\"></p>\r\n                                <p ng-if=\"vm.knowledgeType!=106\" ng-repeat=\"text in item.knowledgeContent.split('\\n') track by $index\">{{text}}</p>\r\n                                <!--</textarea>-->\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                        <!-- 列表-->\r\n                        <div ng-if=\"vm.knowledgeType==102\">\r\n                            <p>肯定回答:</p>\r\n                            <p>{{item.knowledgeContent}}</p>\r\n                            <p>否定回答:</p>\r\n                            <p>{{item.knowledgeContentNegative}}</p>\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                        <!-- 要素 表格形式-->\r\n                        <div ng-if=\"vm.knowledgeType==103\" style=\"width:920px;max-height:500px;overflow:auto;\">\r\n                                <table class=\"essential_factor_tab\" style=\"width:auto;\">\r\n                                    <tr ng-repeat=\"(indexRow,row) in item.knowledgeContent.listTable track by $index\">\r\n                                        <td ng-repeat=\"(indexColumn,item) in row track by $index\" >\r\n                                            <div style=\"min-width:80px;max-width:300px;height:40px;overflow: auto;text-align: center;\">{{item}}</div>\r\n                                        </td>\r\n                                    </tr>\r\n                                </table>\r\n                            <span>&nbsp;</span>\r\n                        </div>\r\n                    </div>\r\n                    <p class=\"mb-10\">\r\n                        <span>知识配置：</span>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeRelatedQuestionOn\">显示相关问题</b>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeBeRelatedOn\">在相关问题内提示</b>\r\n                        <b style=\"font-weight:normal;margin-right:10px;\" ng-show=\"item.knowledgeCommonOn\">弹出评价小尾巴</b>\r\n                    </p>\r\n                    <!--<p ng-repeat=\" (indexVal,val) in item.knowledgeRelevantContentList\">-->\r\n                        <!--<span ng-class=\"indexVal?'':'mileVs'\">已添加知识：</span>-->\r\n                        <!--<span style=\"width:100%;\">{{indexVal}}{{val}}</span>-->\r\n                    <!--</p>-->\r\n                    <div class=\"pr\" ng-if=\"item.knowledgeRelevantContentList.length\" style=\"padding-left:150px;\">\r\n                        <span  class=\"pa dib\" style=\"width:150px;left:0;top:0;color:#666;\">已添加知识：</span>\r\n                        <div>\r\n                            <p class=\"mb-10\" ng-repeat=\" (indexVal,val) in item.knowledgeRelevantContentList track by $index\">\r\n                                <span style=\"width:100%;text-align:left;color:#333;\">{{indexVal+1}}. {{val}}</span>\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n            <!-- 概念知识 位置-->\r\n            <li class=\"borderN\"  ng-if=\"vm.knowledgeType==101\">\r\n                <p ng-repeat=\"item in vm.listData.extensionQuestions track by $index\">\r\n                    <span ng-class=\"$index!=0?'milesVh':''\">概念扩展：</span>\r\n                     <span style=\"width: auto;\" >\r\n                        {{item.extensionQuestionTitle}}\r\n                    </span>\r\n                </p>\r\n            </li>\r\n            <div class=\"jqrsz-btn-box\" style=\"padding-left: 150px;margin-top: 4px;\">\r\n                <a class=\"btn btn-blue mr10\" ui-sref=\"knowledgeManagement.custOverview\">返回</a>\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" ng-click=\"vm.edit()\" style=\"background: #2bcacc; color: #fff;\">修改</a>\r\n            </div>\r\n        </ul>\r\n    </div>\r\n</div>\r\n"

/***/ })

})