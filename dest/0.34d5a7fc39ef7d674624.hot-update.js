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
	                var template = __webpack_require__(38);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
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
	                __webpack_require__.e/* nsure */(4, function () {
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
	            __webpack_require__.e/* nsure */(5, function () {
	                var template = __webpack_require__(47);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "ApplicationSettingController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(6, function () {
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
	                template: __webpack_require__(69),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
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
	                template: __webpack_require__(35),
	                controller: "NodeManageController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 69:
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"main warp knowledgeFaq\">\r\n\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"cl\">\r\n            <div class=\"r-cont-hd L\">\r\n                <span ng-if=\"!vm.knowledgeId\" style=\"color:#666;\">FAQ知识新增</span>\r\n                <span ng-if=\"vm.knowledgeId\" style=\"color:#666;\">FAQ知识编辑</span>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n        </div>\r\n        <div class=\"r-cont-bd oh pr\">\r\n            <!--<form novalidate=\"novalidate\" name=\"form\">-->\r\n            <div class=\"jqrsz-item\">\r\n                <div class=\"item-line\">\r\n                    <div class=\"lable\">\r\n                        知识标题：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\" style=\"width:100%;\">\r\n                            <input class=\"ipt-txt bd \" type=\"text\" autofocus style=\"width:407px;height:32px;\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required />\r\n                            <i class=\"btn-empty\"></i>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- 时间-->\r\n                <span select-start-end-time=\"dialog\"></span>\r\n                <!--  bot -->\r\n                <span bot-class-tree=\"dialog\" ></span>\r\n <!--bot  類目數 点击生成  -->\r\n                <div class=\"item-line mb-10\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot track by $index\">\r\n                    <div class=\"lable\"> BOT路径：</div>\r\n                    <div class=\"value Div clearfix\" >\r\n                        <div class=\"ipt-txt-box L mr-10\">\r\n                            <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;width:407px;\">\r\n                                <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                            </div>\r\n                        </div>\r\n                        <a href=\"javascript:;\" class=\"L mr-10 mt-5\"  ng-click=\"vm.creatSelectBot.splice($index,1)\"><img src=\"../../../../images/images/delete_img.png\"  alt=\"\"></a>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"item-line\">\r\n                    <div class=\"row cl mb-10\">\r\n                        <div class=\"lable\" style=\"width:245px;\">业务框架：</div>\r\n                        <!--<label class=\"form-label col-xs-4 col-sm-2 text-r\">业务框架：</label>-->\r\n                        <div class=\"formControls col-xs-8 col-sm-9\" style=\"padding-left:0;\">\r\n                            <select  class=\"input-text pickFrame\" style=\"width:407px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\" style=\"overflow: visible\">\r\n                <span concept-extension=\"dialog\" tag=\"false\" api=\"queryFaqExtension\"></span>\r\n<!--手动添加 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensions\" ng-repeat=\"item in vm.extensions track by $index\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                           {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_faq_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>-->\r\n                    </div>\r\n                </div>\r\n<!-- 業務框架 生成 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensionsByFrame\" ng-repeat=\"item in vm.extensionsByFrame\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                            {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"vm.backUpExt(item);vm.extensionsByFrame.splice($index,1)\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<a href=\"javascript:;\" class=\"L edit_a mr-10 mt-5\" ng-click=\"vm.KnowledgeEdit()\"></a>-->\r\n                        <span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\">\r\n                <div ng-if=\"vm.scanContent\" ng-repeat=\"(itemIndex,item) in vm.scanContent\">\r\n                    <div class=\"item-line\">\r\n                        <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                           内容{{itemIndex+1}}:\r\n                        </div>\r\n                        <div class=\"value\">\r\n                            <div class=\"ipt-txt-box clearfix\">\r\n                                <div class=\"textareaDiv textareaDiv1 textareaDiv2 L\">\r\n                                    <p ng-repeat=\"text in item.knowledgeContent.split('\\n') \">{{text}}</p>\r\n                                </div>\r\n                                <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">渠道：\r\n                            <span class=\"mr-10\" ng-repeat=\"val in item.channelIdList\"><span ng-if=\"!$first\">, </span>{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">\r\n                            维度:\r\n                            <span class=\"mr-10\"  ng-repeat=\"val in item.dimensionIdList\"><span ng-if=\"!$first\">, </span>{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"item-line\" style=\"margin-top: 15px\">\r\n                    <div class=\"lable\">\r\n                        知识内容：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\">\r\n                            <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\" type=\"button\" value=\"+ 新增\"/>\r\n                            <i class=\"btn-empty\"></i>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-btn-box\" style=\"margin-bottom:120px;\">\r\n                <input class=\"btn btn-blue mr10\" value=\"保存\" type=\"button\"  ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateFaqKnow':'storeFaqKnow')\">\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" style=\"background: #2bcacc; color: #fff;\" ng-click=\"vm.scan()\">预览</a>\r\n            </div>\r\n            <!--引导-->\r\n            <div class=\"shadow_div dn\" ></div>\r\n            <div class=\"step_div \" >\r\n                <div class=\"step_one dn\" id=\"step_one\" >\r\n                    <div class=\"step_one_s\">1</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识标题：您需要填写这个知识的标准的提问方式哦~~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                    <div class=\"step_one_s\">2</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                    <div class=\"step_one_s\">3</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                    <div class=\"step_one_s\">4</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                    <div class=\"step_one_s\">5</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                    <div class=\"step_one_s\">6</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--引导end-->\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ })

})