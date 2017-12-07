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
	                template: __webpack_require__(115),
	                controller: "RichTextEditController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 115:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap process_know\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10 pr\">\r\n                <div class=\"mb-20\">\r\n                    <h3 class=\"f22 mb15\" ng-bind=\"!vm.knowledgeId?'流程型知识新增':'流程型知识编辑'\"></h3>\r\n                </div>\r\n                <div class=\"pr\">\r\n                    <div class=\"pl50\">\r\n                        <button class=\"btn1 btn1_blue mb30\" id=\"addNode\" ng-click=\"vm.newIndex = vm.flowKnowledgeContentList.length;vm.resetParams()\" is-arrow-show=\"1\">新增节点</button>\r\n                        <button class=\"btn1 btn1_blue mb30\"  ng-click=\"vm.addNewKnow()\" ng-disabled=\"!vm.flowKnowledgeContentList.length\">保存</button>\r\n                        <div>\r\n                            <div class=\"pl20 clearfix\">\r\n                                <div class=\"clearfix \" id=\"node_box_wrap\" style=\"min-height: 444px;padding-bottom:100px;\">\r\n\r\n                                    <div class=\" node_box_wrap pt50\"  ng-repeat=\"item in vm.flowKnowledgeContentList track by $index\" ng-class=\"{'first':$first,'last':$last}\" >\r\n                                        <div class=\"node_box pr\" >\r\n                                            <img src=\"../../../images/node_icon3.jpg\" class=\"node_img\" ng-hide=\"$first&&$last\"/>\r\n                                            <h3 class=\"f18 bold mb10 cp\" ng-bind=\"item.nodeName\" ng-click=\"vm.editNode(item,$index)\" is-arrow-show=\"1\"></h3>\r\n                                            <p class=\"f14 mb30 c-666\" ng-bind=\"item.triggerValueOfTitle\"></p>\r\n                                            <p class=\"c-999\" ng-bind=\"item.triggerKnowledgeOfTitle\"></p>\r\n                                            <div class=\"node_box_div clearfix\" is-operation-show=\"0\">\r\n                                                <a href=\"javascript:;\" class=\"node_right pa pd-5\"></a>\r\n                                                <ul class=\"node_box_ul p15 clearfix pa\">\r\n                                                    <li ng-click=\"vm.newNode($index)\">在上方新建节点</li>\r\n                                                    <li ng-click=\"vm.newNode($index+1)\">在下方新建节点</li>\r\n                                                    <li ng-click=\"vm.moveUp($index)\" ng-if=\"!$first\">向上移动</li>\r\n                                                    <li ng-click=\"vm.moveDown($index)\" ng-if=\"!$last\">向下移动</li>\r\n                                                    <!--<li ng-click=\"vm.flowKnowledgeContentList.splice($index,1);vm.bindingNodeChange(0,$index)\" class=\"c-red\">删除</li>-->\r\n                                                    <li ng-click=\"vm.deleteNode($index,1,0)\" class=\"c-red\">删除</li>\r\n                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div style=\"margin-left:75px;\" ng-if=\"item.actionType==0 || (item.actionType==2&&item.contentSubsequentList[0].nodeNo!=null) || item.actionType==1\">\r\n                                            <!--<div class=\"node_top\"></div>-->\r\n                                            <ol class=\"node_ol clearfix\">\r\n                                                <li class=\"f14 c_blue last\" ng-if=\"item.actionType==0\" ng-bind=\"'等待用户输入'\" style=\"max-width: 320px\"></li>\r\n                                                <li class=\"f14 c_blue\" ng-class=\"$last?'last':''\" ng-if=\"item.actionType==2&&action.nodeNo!=null\"  ng-repeat=\"action in item.contentSubsequentList track by $index\" style=\"max-width: 320px\">\r\n                                                    跳转到节点:{{action.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                                </li>\r\n                                                <li class=\"f14 c_blue\" ng-class=\"$last?'last':''\" ng-if=\"item.actionType==1\" title=\"{{action.answer}}\"  ng-repeat=\"action in item.contentSubsequentList track by $index\" ng-bind=\"'命中答案-'+action.answer\" style=\"max-width: 320px;\">\r\n                                                    命中答案-{{action.answer}}跳转到:{{action.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                                </li>\r\n                                            </ol>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <!--右侧-->\r\n                <div class=\"right_popup pa\">\r\n                    <a href=\"javascript:;\" class=\"arrow pa act\" name=\"editList\" is-arrow-show=\"2\"></a>\r\n                    <div class=\"right_popup_div clearfix \" >\r\n                        <a href=\"javascript:;\" class=\"clase_a pa\" is-arrow-show=\"0\" ng-click=\"vm.resetParams()\">×</a>\r\n                        <div style=\"width:100%;height:100%;border-bottom: 1px solid #e5e9ec;padding: 100px 10px 0 50px;\" >\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">节点名称 :</span>\r\n                                <input type=\"text\" class=\"txt txt_l bd\" ng-model=\"vm.nodeName\"  style=\"width: 260px;\" placeholder=\"请输入节点名称\"/>\r\n                            </div>\r\n                            <div>\r\n                                <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                    <span class=\"framework_s\">触发条件 :</span>\r\n                                    <input type=\"text\" class=\"txt txt_l bd_bot\"  id=\"knowTitle\" ng-show=\"vm.triggerCondition==0||vm.triggerCondition==3\" ng-focus=\"vm.triggerCondition=3\" ng-blur=\"vm.inputBlur()\" placeholder=\"请输入BOT或知识标题\" style=\"width:260px\"/>\r\n                                    <div class=\"bd p20 trigger_condition\" ng-show=\"vm.triggerCondition==3\" >\r\n                                        <p class=\"mb10\">请选择</p>\r\n                                        <ul>\r\n                                            <li class=\"\" ng-click=\"vm.triggerCondition=1\">BOT  可以添加多个意图类</li>\r\n                                            <li class=\"\" ng-click=\"vm.triggerCondition = 2;vm.triggerKnowledge=''\">知识 只能添加一条知识</li>\r\n                                        </ul>\r\n                                    </div>\r\n                                    <!--显示bot-->\r\n                                    <div class=\"value Div clearfix\" ng-show=\"vm.triggerCondition==1\">\r\n                                        <div class=\"ipt-txt-box L mr-10\">\r\n                                            <input class=\"ipt-txt bd botTagAuto strikeBotTagAuto\" disabled ng-model=\"vm.strikeValue.name\"   type=\"text\"  style=\"width: 260px;height:32px;padding-right:28px;box-sizing: border-box;\"/>\r\n                                            <i class=\"btn-menu_1\" ng-click=\"master.slideToggle('.strikeRootClassfy')\" style=\"right:1px;top:2px;width:23px;height:28px;\"></i>\r\n                                            <div class=\"rootClassfy aside-navs aside-navs2 strikeRootClassfy\" style=\"overflow: hidden; display: none;\">\r\n                                                <ul class=\"menus show\">\r\n                                                    <!--//test-->\r\n                                                    <li ng-repeat=\"item in vm.botRoot\">\r\n                                                        <div class=\"slide-a\">\r\n                                                            <a class=\"ellipsis\" href=\"javascript:;\">\r\n                                                                <i class=\"icon-jj\" data-option=\"{{item.categoryId}}\"></i>\r\n                                                                <span>{{item.categoryName}}</span>\r\n                                                            </a>\r\n                                                        </div>\r\n                                                    </li>\r\n                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"L mr10\">\r\n                                            触发次数：\r\n                                            <input type=\"number\" strike-num=\"100\" ng-model=\"vm.strikeNumber\" class=\"bd pl-10 ng-pristine ng-valid ng-valid-number\" style=\"height:32px;width:100px;\">\r\n                                        </div>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.triggerCondition=0;vm.strikeValue='';vm.triggerKnowTitle=''\" class=\"mr-15 mt-5\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                    </div>\r\n\r\n                                    <!--显示知识标题-->\r\n                                    <div ng-show=\"vm.triggerCondition==2\">\r\n                                        <input type=\"text\" class=\"txt bd trigger_know_title_key\"  ng-blur=\"vm.removeAutoList()\" ng-model=\"vm.triggerKnowTitle.name\" placeholder=\"请输入标题\" style=\"width:260px;\"/>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.triggerCondition=0;\" class=\"mr-15 mt-5\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                        <!-- 联想输入 -->\r\n                                        <ul class=\"association_ul p10 bd pa\" ng-if=\"vm.triggerCondition==2 && vm.recommendKnow.length\">\r\n                                            <li ng-repeat=\"recommend in vm.recommendKnow track by $index\" ng-bind=\"recommend.knowledgeTitle\" ng-click=\"vm.selectKnowTitle(recommend,'triggerKnowTitle')\"></li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">机器人回复 :</span>\r\n                                <input type=\"text\" ng-disabled=\"vm.triggerCondition==2\" ng-blur=\"vm.removeAutoList()\" class=\"txt txt_l bd_bot robot_key_words\"  style=\"width: 260px\" ng-model=\"vm.triggerKnowledge.name\" placeholder=\"请输入知识标题\" />\r\n                                <!--  联想输入 查询结果 -->\r\n                                <ul class=\"association_ul p10 bd pa\" ng-if=\"vm.triggerCondition!=2 && vm.recommendKnow.length\">\r\n                                    <li ng-repeat=\"recommend in vm.recommendKnow track by $index\" ng-bind=\"recommend.knowledgeTitle\" ng-click=\"vm.selectKnowTitle(recommend,'triggerKnowledge')\"></li>\r\n                                </ul>\r\n                            </div>\r\n                            <div class=\"mb-50 framework\" style=\"padding-left:80px;\">\r\n                                <span class=\"framework_s\">后续动作 :</span>\r\n                                <select class=\"bd\" ng-model=\"vm.actionType\">\r\n                                    <option value=\"0\" style=\"cursor: pointer;\">等待用户输入</option>\r\n                                    <option value=\"2\">跳转到其他流程</option>\r\n                                    <option value=\"1\" ng-disabled=\"!vm.isFactorKnow\" ng-class=\"!vm.isFactorKnow?'bg_e3':''\">根据答案进行跳转</option>\r\n                                </select>\r\n                                <div class=\"pt20\">\r\n                                    <div class=\"mb10\" ng-show=\"vm.actionType==0\"></div>\r\n                                    <div class=\"mb10\" ng-show=\"vm.actionType==2\">\r\n                                        跳转到：\r\n                                        <span ng-if=\"vm.knowJump[0].nodeNo!=null\">\r\n                                        <a href=\"javascript:;\" style=\"width: auto;\" class=\"appoint cp\" ng-if=\"vm.knowJump[0].nodeNo!=null\">\r\n                                            节点:{{vm.knowJump[0].nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n\r\n                                        </a>\r\n                                         <img src=\"../../../images/images/delete_img.png\" alt=\"\" ng-click=\"vm.knowJump[0].nodeNo=null\">\r\n                                    </span >\r\n\r\n                                        <a href=\"javascript:;\" style=\"width: auto;padding:5px 10px;display:inline-block;line-height:23px;\" class=\"appoint cp\" ng-if=\"vm.knowJump[0].nodeNo==null\"  ng-click=\"vm.openSelectNodeDialog(1,'',vm.knowJump[0].nodeNo)\">\r\n                                            指定节点\r\n                                        </a>\r\n                                    </div>\r\n                                    <div ng-show=\"vm.actionType==1\">\r\n                                        <div ng-if=\"vm.factorContent.length\" ng-repeat=\"content in vm.factorContent track by $index\"  class=\"mb10\">\r\n                                            答案{{$index+1}} <span class=\"answer_span\" ng-bind=\"content.answer\"></span>\r\n                                            跳转到：\r\n                                            <span ng-if=\"content.nodeNo!=null\">\r\n                                            <a href=\"javascript:;\" class=\"appoint\" style=\"width: auto;\" >\r\n                                                指定节点：{{content.nodeNo | showNodeName:vm.flowKnowledgeContentList}}\r\n                                            </a>\r\n                                            <img src=\"../../../images/images/delete_img.png\" alt=\"\"  ng-click=\"vm.factorContent[$index].nodeNo=null\">\r\n                                        </span>\r\n                                            <a href=\"javascript:;\" class=\"appoint\" style=\"width: auto;padding:5px 10px;display:inline-block;line-height:23px;\" ng-if=\"content.nodeNo==null\" ng-click=\"vm.openSelectNodeDialog(2,$index,content.nodeNo)\" >\r\n                                                指定\r\n                                            </a>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <button class=\"btn1 btn1_blue mb30\"  ng-click=\"vm.storeNewProcess(vm.isEditIndex)\">保存节点</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n\r\n"

/***/ })

})