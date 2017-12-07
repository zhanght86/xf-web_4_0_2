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
	        abstract: true,
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
	        abstract: true,
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
	        abstract: true,
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
	        abstract: true,
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
	        abstract: true,
	        parent: "BM",
	        title: "概念库",
	        views: {
	            "content@content": {
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

/***/ })

})