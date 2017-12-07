webpackHotUpdate(0,{

/***/ 20:
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
	            __webpack_require__.e/* nsure */(8, function () {
	                var template = __webpack_require__(38);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(9, function () {
	                    var loginModule = __webpack_require__(39)(angular); //动态加载Module
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
	                __webpack_require__.e/* nsure */(10, function () {
	                    var homePageModule = __webpack_require__(42)(angular); //动态加载Module
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
	            __webpack_require__.e/* nsure */(11, function () {
	                var template = __webpack_require__(47);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "ApplicationSettingController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(12, function () {
	                    var applicationManagementModule = __webpack_require__(48)(angular);
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
	    //          ##业务建模##
	    //--------------------------------------------------
	    // bot
	    // 框架库
	    // 概念库
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
	        template: __webpack_require__(109),
	        controller: "KnowledgeManagementController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(13, function () {
	                    var knowledgeManagementModule = __webpack_require__(70)(angular);
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
	                template: __webpack_require__(36),
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
	                template: __webpack_require__(37),
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
	                template: __webpack_require__(69),
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
	                template: __webpack_require__(69),
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
	                template: __webpack_require__(111),
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
	                template: __webpack_require__(111),
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
	                template: __webpack_require__(112),
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
	                template: __webpack_require__(112),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(113),
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
	                template: __webpack_require__(114),
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
	                template: __webpack_require__(114),
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
	                template: __webpack_require__(114),
	                controller: "RichTextNewController"
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
	                template: __webpack_require__(114),
	                controller: "RichTextEditController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"homePageNav\">\r\n    <div class=\"header clearfix\">\r\n        <div class=\"logo\">\r\n            <a ui-sref=\"HP.define\"><strong>小富机器人控制台</strong><em class=\"edition\">V4.0</em></a>\r\n            <!--<a ui-sref=\"homePage.define\"><strong>小富机器人控制平台</strong><em class=\"edition\">V4.0</em></a>-->\r\n        </div>\r\n        <ul class=\"nav\">\r\n            <li>\r\n                <a ui-sref=\"HP.define\">首页</a>\r\n            </li>\r\n            <li>\r\n                <a ng-click=\"vm.logApplication()\">应用管理</a>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">业务建模<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"relationalCatalog.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jmzy\"></i>\r\n                            <span>BOT</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"frameworkLibrary.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lmgl\"></i>\r\n                            <span>框架库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"conceptManage.synony\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_gngl\"></i>\r\n                            <span>概念库</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">知识管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"KM.overview\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zszl\"></i>\r\n                            <span>知识总览</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <ul class=\"menu_1 menu_2 \" style=\"min-height: 40%;\">\r\n                            <li>\r\n                                <a ui-sref=\"KM.faq\">\r\n                                    <span>FAQ知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.concept\">\r\n                                    <span>概念知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                          \r\n                                <a ui-sref=\"KM.list\">\r\n                                    <span>列表知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                             \r\n                                <a ui-sref=\"KM.factor\">\r\n                                    <span>要素知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.richText\">\r\n                                    <span>富文本知识</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"KM.dialogue\">\r\n                                    <span>对话知识</span>\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                        <a href=\"javascript:;\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsjg\"></i>\r\n                            <span>知识单条新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.batch\">\r\n                            <i class=\"icon-nav icon-nav__icon-zsplxz\"></i>\r\n                            <span>知识批量新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"KM.document\">\r\n                            <i class=\"icon-nav icon-nav__icon-wdjgxz\"></i>\r\n                            <span>文档加工新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a ui-sref=\"setting.releaseMan\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zsfb\"></i>-->\r\n                            <!--<span>知识发布</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zssh\"></i>-->\r\n                            <!--<span>知识审核</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"KM.history\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lsck\"></i>\r\n                            <span>历史查看</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">测试功能<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.questionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wfcs\"></i>\r\n                            <span>问法测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.sessionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltcs\"></i>\r\n                            <span>会话测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.batchTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_plcs\"></i>\r\n                            <span>批量测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.participle\">\r\n                            <i class=\"icon-nav icon-nav_fcyy\"></i>\r\n                            <span>分词应用</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">应用分析<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.accessStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fwtj\"></i>\r\n                            <span>访问统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.knowledgeRanking\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsdpm\"></i>\r\n                            <span>知识点排名统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_wpp\"></i>-->\r\n                            <!--<span>未匹配问题统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>-->\r\n                            <!--<span>分类统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionDetails\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_hhmx\"></i>\r\n                            <span>会话明细统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.satisfactionDegree\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jjltj\"></i>\r\n                            <span>会话满意度统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.resolutionStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>\r\n                            <span>问答解决率统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.reinforcementLearn\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_zqxx\" ></i>\r\n                            <span>智能学习</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.newKnowledgeDiscoveryLearn\">\r\n                            <i class=\"icon-nav icon-nav_xzzfx\" ></i>\r\n                            <span>未匹配问题聚类</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.operationLog\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_czrz\" ></i>\r\n                            <span>操作日志</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionLog\">\r\n                            <i class=\"icon-nav icon-nav_hhrz\" ></i>\r\n                            <span>会话日志</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">素材管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltzsk\"></i>\r\n                            <span>聊天知识库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_hxck\"></i>-->\r\n                            <!--<span>寒暄词库</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.pictureLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_tpk\"></i>\r\n                            <span>图片库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.teletextMessage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_twfxk\"></i>\r\n                            <span>图文消息库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.speechLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>语音库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.documentLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>文档库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li >-->\r\n                        <!--<a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>-->\r\n                            <!--<span>自动导入更新</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">深度学习<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deeplearnConfig\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>模型构建</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deepLearningCon\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxxl\"></i>\r\n                            <span>模型训练</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.similarityCalculation\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxcs\"></i>\r\n                            <span>模型测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>\r\n                            <span>自动导入更新</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li >\r\n                <a href=\"javascript:;\">系统监控<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.resource\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>资源监控</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.service\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>服务监控</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n        <div class=\"header-r\">\r\n            <div class=\"user-admin mr-20\">\r\n                <a class=\"user-name\" href=\"javascript:;\"><i></i><span>{{vm.userName}}</span></a>\r\n                <div class=\"ua-menu_1-box\">\r\n                    <ul class=\"ua-menu_1\">\r\n                        <li>\r\n                            <a ui-sref=\"HP.permission\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r1\"></i>\r\n                                <span>权限管理</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a ui-sref=\"HP.management\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r2\"></i>\r\n                                <span>切换应用</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:;\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r3\"></i>\r\n                                <span ng-click=\"vm.loginout()\">退出登录</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class=\"mail-conver\" style=\"margin-left:0;\">\r\n                <!--<a ui-sref=\"KM.historyView\" class=\"mail\">-->\r\n                    <!--&lt;!&ndash;<em>2</em>&ndash;&gt;-->\r\n                <!--</a>-->\r\n                <a  class=\"conver\" ng-click=\"vm.queryServiceList()\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"crumbs-nav bgwhite mt20  warp\" ng-show=\"checkShowCrumbs()\">\r\n    <span class=\"cn-lable\">你曾经路过此地：</span>\r\n\r\n    <span class=\"cn-value\" ng-repeat=\"crumb in crumbs track by $index\">\r\n        <a class=\"cn-a\" ui-sref=\"{{crumb.url}}\" ng-bind=\"crumb.name\"></a>\r\n        <i class=\"close\" ng-hide=\"checkShowClose(crumb.url)\" ng-click=\"closeCrumb($index)\" >x</i>\r\n    </span>\r\n</div>"

/***/ })

})