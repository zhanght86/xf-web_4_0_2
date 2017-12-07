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
	    }];
	};

/***/ }),

/***/ 111:
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"main warp knowledgeConcepe\">\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"cl\">\r\n            <div class=\"r-cont-hd L\">\r\n                <span ng-if=\"!vm.knowledgeId\" style=\"color:#666;\">概念知识新增</span>\r\n                <span ng-if=\"vm.knowledgeId\" style=\"color:#666;\">概念知识编辑</span>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n        </div>\r\n        <div class=\"r-cont-bd oh pr\">\r\n\r\n            <div class=\"jqrsz-item\">\r\n                <div class=\"item-line\">\r\n                    <div class=\"lable\">\r\n                        知识标题：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\" style=\"width:100%;\">\r\n                            <input class=\"ipt-txt bd\" type=\"text\" autofocus style=\"height:32px;\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required />\r\n                            <i class=\"btn-empty\"></i>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n              <span select-start-end-time=\"dialog\"></span>\r\n                <!--  bot -->\r\n                <span bot-class-tree=\"\" ></span>\r\n                 <!--bot 生成-->\r\n                <div class=\"item-line mb-10\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot track by $index\">\r\n                    <div class=\"lable\"> BOT路径：</div>\r\n                        <div class=\"value Div clearfix\" >\r\n                            <div class=\"ipt-txt-box mr-10 L\">\r\n                            <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                            </div>\r\n                        </div>\r\n                        <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                    </div>\r\n                </div>\r\n                <div class=\"item-line\">\r\n                    <div class=\"row cl mb-10\">\r\n                        <div class=\"lable\" style=\"width:245px;\">业务框架：</div>\r\n                        <!--<label class=\"form-label col-xs-4 col-sm-2 text-r\">业务框架：</label>-->\r\n                        <div class=\"formControls col-xs-8 col-sm-9\" style=\"padding-left:0;\">\r\n                            <select class=\"input-text\" style=\"width:407px;height:34px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\">\r\n                <!--预览内容-->\r\n                <div ng-repeat=\"(index,item) in vm.scanContent track by $index\">\r\n                    <div class=\"item-line\">\r\n                        <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                            内容{{index+1}}:\r\n                        </div>\r\n                        <div class=\"value\">\r\n                            <div class=\"ipt-txt-box clearfix\">\r\n                                <div class=\"textareaDiv textareaDiv1 textareaDiv2 L \" >\r\n                                    <p ng-repeat=\"text in item.knowledgeContent.split('\\n')\">{{text}}</p>\r\n                                </div>\r\n                                <!--<a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\" mr-15\" ><img src=\"../../../images/images/delete_img.png\" alt=\"\"></a>-->\r\n                                <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">渠道：\r\n                            <span  ng-repeat=\"val in item.channelIdList track by $index\"><span ng-if=\"!$first\"> , </span>{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">维度:\r\n                            <span style=\"margin: 0\" ng-repeat=\"val in item.dimensionIdList track by $index\"><span ng-if=\"!$first\"> , </span>{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"item-line\" style=\"margin-top: 15px\">\r\n                    <div class=\"lable\">\r\n                        知识内容：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\">\r\n                            <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\"  type=\"button\" value=\"+ 新增\"/>\r\n                            <i class=\"btn-empty\"></i>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"jqrsz-item\" style=\"overflow: visible\">\r\n                <!-- 扩展问 生成 -->\r\n                <span concept-extension=\"dialog\" tag=\"true\" api=\"queryConceptExtension\"></span>\r\n                <!--sshoudong  tinajia -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                    <div class=\"lable\">\r\n                        概念扩展：\r\n                    </div>\r\n                    <div class=\"value clearfix\">\r\n                        <div class=\" tag_box L mr-10\" style=\"width:353px;padding:0;\">\r\n                            <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                {{val.tagName}}\r\n                            </span>\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_concept_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <span class=\"L\" ng-if=\"item.extensionQuestionTitle\"><b>来源于</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                    </div>\r\n                </div>\r\n                <!-- 業務框架 生成 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame track by $index\">\r\n                    <div class=\"lable\">\r\n                        概念扩展：\r\n                    </div>\r\n                    <div class=\"value clearfix\">\r\n                        <div class=\" tag_box L mr-10\" style=\"width:353px;padding:0;\">\r\n                            <!--{{item.extensionQuestionTagList}}-->\r\n                            <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                {{val.tagName}}\r\n                            </span>\r\n                        </div>\r\n                        <span class=\"tag_s L\" style=\"margin-right:10px;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_concept_ext',item);;vm.extensionsByFrame.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n\r\n                        <span class=\"L\" ng-if=\"item.extensionQuestionTitle\"><b>来源于:</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-btn-box\" style=\"margin-bottom:120px;\">\r\n                <input type=\"button\" class=\"btn btn-blue mr10\" value=\"保存\" ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateConceptKnow':'storeConceptKnow')\">\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" style=\"background: #2bcacc; color: #fff;\" ng-click=\"vm.scan(vm.knowledgeId?'updateConceptKnow':'storeConceptKnow')\">预览</a>\r\n            </div>\r\n            <!--引导-->\r\n            <div class=\"shadow_div dn\" ></div>\r\n            <div class=\"step_div \">\r\n                <div class=\"step_one dn\" id=\"step_one\" >\r\n                    <div class=\"step_one_s\">1</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                    <div class=\"step_one_s\">2</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                    <div class=\"step_one_s\">3</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                    <div class=\"step_one_s\">4</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                    <div class=\"step_one_s\">5</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化. </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                    <div class=\"step_one_s\">6</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--引导end-->\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .container{\r\n        background:#f8f8f8;\r\n    }\r\n</style>\r\n\r\n"

/***/ }),

/***/ 112:
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\"></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap knowledgeList\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-bind=\"vm.knowledgeId?'列表型知识编辑':'列表型知识新增'\"></h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\" pr\">\r\n\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">知识标题：</div>\r\n                        <div>\r\n                            <input type=\"text\" class=\"bk-gray input-text \" autofocus placeholder=\"请输入标题\"\r\n                                   ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\"\r\n                                   ng-maxlength=\"1000\" required style=\"width:394px;\"/>\r\n\r\n                            <p class=\"c-error pd-5\" ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 时间-->\r\n                    <span select-start-end-time=\"notDialog\"></span>\r\n                    <!--  bot -->\r\n                    <span bot-class-tree=\"notDialog\"></span>\r\n                    <!-- 生成bot列表 -->\r\n                    <div class=\"exten_problem\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">BOT路径：</div>\r\n                            <div class=\" clearfix\">\r\n                                <div class=\"ipt-txt-box L\"\r\n                                     style=\"width: 395px;border: 1px solid #e1e1e1;margin-right: 10px;\">\r\n                                    <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                        <!--<span>{{item.className.join(\"/\")}}</span>-->\r\n                                        <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                    </div>\r\n                                </div>\r\n                                <a href=\"javascript:;\" class=\"L mr-10 mt-5\"><img\r\n                                        src=\"../../../../images/images/delete_img.png\"\r\n                                        ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">业务框架：</div>\r\n                        <div>\r\n                            <select class=\"input-text\" style=\"width:395px;\" ng-model=\"vm.frameId\"\r\n                                    ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                    <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryListExtension\"></span>\r\n                    <!--手动添加 ext-->\r\n                    <div class=\"exten_problem\" style=\"overflow: visible\"\r\n                         ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\"\r\n                                     style=\"width:345px;height:35px;border:0;overflow-x: auto;\">\r\n                                    <!--{{item.extensionQuestionTagList}}-->\r\n                                       <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\"\r\n                                             ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                            {{val.tagName}}\r\n                                        </span>\r\n                                </div>\r\n                                <span class=\"tag_s mr-10 L\"\r\n                                      style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                <a href=\"javascript:;\"\r\n                                   ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\"\r\n                                   class=\"L mr-10\"><img src=\"../../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 业务框架 生成ext -->\r\n                    <div class=\"exten_problem\" ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\"\r\n                                     style=\"width:345px;height:35px;border:0;overflow-x: auto\">\r\n                                   <span ng-repeat=\"val in item.extensionQuestionTagList\"\r\n                                         ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                        {{val.tagName}}\r\n                                    </span>\r\n                                </div>\r\n                                <span class=\"tag_s mr-10 L\"\r\n                                      style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                <a href=\"javascript:;\"\r\n                                   ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensionsByFrame.splice($index,1);\"\r\n                                   class=\"L mr-10\"><img src=\"../../../../images/images/delete_img.png\" alt=\"\"></a>\r\n                                <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-50\">\r\n                        <div class=\"list_facContent_L\">知识内容: &nbsp;</div>\r\n                        <div>\r\n                            <div class=\"clearfix mb-10\">\r\n                                <p class=\"mb-10 f-16\">肯定回答:</p>\r\n                                <!--{{vm.newTitle}}-->\r\n                                <textarea class=\"word_div bd\" ng-model=\"vm.newTitle\"\r\n                                          placeholder=\"例如：#违禁品#是违禁物品，不可以带上飞机\"></textarea>\r\n                            </div>\r\n                            <div class=\"clearfix mb-10\">\r\n                                <p class=\"mb-10 f-16\">否定回答:</p>\r\n                                <textarea class=\"word_div bd\" ng-model=\"vm.knowledgeContentNegative\"\r\n                                          placeholder=\"例如：不是违禁物品，可以带上飞机\"></textarea>\r\n                            </div>\r\n                            <div know-content-configuration=\"queryListRelatedQuestion\" template-type=\"false\"></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                    <div class=\"list_facContent_L\"></div>\r\n                    <div>\r\n                        <input type=\"button\" class=\"btn1 btn1_blue mr-20\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateListKnow':'storeListKnow')\"/>\r\n                        <input type=\"button\" class=\"btn1 btn_green\" ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateListKnow':'storeListKnow')\"\r\n                               value=\"保存\"/>\r\n                    </div>\r\n                </div>\r\n                <!--引导-->\r\n                <div class=\"shadow_div dn\"></div>\r\n                <div class=\"step_div \">\r\n                    <div class=\"step_one dn\" id=\"step_one\">\r\n                        <div class=\"step_one_s\">1</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button disabled class=\"c-999 introjs-button introjs-prev\"\r\n                                        ng-click=\"vm.prevDiv($event)\">上一步\r\n                                </button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                        <div class=\"step_one_s\">2</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                        <div class=\"step_one_s\">3</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                        <div class=\"step_one_s\">4</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                            </p>\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                        <div class=\"step_one_s\">5</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                        <div class=\"step_one_s\">6</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>渠道维度：渠道和维度的组合是不可以重复的，添加时一定要注意哦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                        <div class=\"step_one_s\">7</div>\r\n                        <div class=\"step_one_arrow\"></div>\r\n                        <div class=\"step_one_con\">\r\n                            <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                            </p>\r\n\r\n                            <div class=\"tr introjs-tooltipbuttons\">\r\n                                <button class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                <button class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                <button disabled class=\"c-999 introjs-button introjs-next\"\r\n                                        ng-click=\"vm.nextDiv($event)\">下一步\r\n                                </button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!--引导end-->\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ 113:
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap knowledgeFactor\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-if=\"!vm.knowledgeId\">要素型知识新增</h3>\r\n                        <h3 class=\"f22 pl-10 mb15\" ng-if=\"vm.knowledgeId\">要素型知识编辑</h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\"pr\">\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">知识标题：</div>\r\n                        <div >\r\n                            <input  type=\"text\" class=\"bk-gray input-text \" autofocus placeholder=\"请输入标题\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required  style=\"width:394px;\"/>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                    <!-- 时间-->\r\n                    <span select-start-end-time=\"notDialog\"></span>\r\n                    <!--  bot -->\r\n                    <span bot-class-tree=\"notDialog\"></span>\r\n                    <!--手动生成-->\r\n                    <div class=\"exten_problem\"  ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">BOT路径：</div>\r\n                            <div class=\" clearfix\" >\r\n                                <div class=\"ipt-txt-box L\" style=\"width: 394px;border: 1px solid #e1e1e1;margin-right:10px;\">\r\n                                    <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                        <!--<span>{{item.className.join(\"/\")}}</span>-->\r\n                                        <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                    </div>\r\n                                </div>\r\n                                <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"list_facContent mb-10\">\r\n                        <div class=\"list_facContent_L\">业务框架：</div>\r\n                        <div >\r\n                            <select class=\"input-text\" style=\"width:395px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                    <!--  扩展问 -->\r\n                    <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryFactorExtension\"></span>\r\n                    <div class=\"exten_problem\"  ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">概念扩展：</div>\r\n                            <div>\r\n                                <div class=\"L extended_query_txt\" style=\"width:345px;border: 0;margin-right:0;height: 35px;overflow-x: auto;\" >\r\n                                   <span ng-repeat=\"val in item.extensionQuestionTagList\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                      {{val.tagName}}\r\n                                    </span>\r\n                                </div>\r\n                                <span class=\"tag_s  bd L mr-10\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center\">\r\n                                    普通\r\n                                </span>\r\n                                <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                <span class=\"L\"><b>来源于</b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent mb-50\">\r\n                        <div class=\"list_facContent_L\">知识内容: &nbsp;</div>\r\n                        <div >\r\n                            <div class=\"clearfix mb-10\">\r\n                                <span uploader-factor server=\"'api/elementKnowledgeAdd/upload'\"  is-auto=\"'true'\" table-list=\"vm.tableList\"></span>\r\n                                <!--<input  type=\"button\" class=\"btn1 btn1_blue mb-10\" uploader-handle server=\"'api/elementKnowledgeAdd/upload'\" value=\"上传线下编辑场景知识\">-->\r\n                                <!--<span class=\"f-14 pl-10\">请先<a href=\"javascript:;\" class=\"c-primary\">下载模板</a>进行填写</span>-->\r\n                                <div class=\"essential_factor_div bd mt-10\">\r\n                                    <div class=\"mb-10\">\r\n                                        <a href=\"javascript:;\" class=\"add_l ine mr-10\" ng-click=\"vm.addRow()\"><img src=\"../images/ys_img1.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"delete_line mr-10\" ng-click=\"vm.tableRemove(1)\"><img src=\"../images/ys_img2.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"add_column mr-10\"  ng-click=\"vm.addList();\"><img src=\"../images/ys_img3.png\"/></a>\r\n                                        <a href=\"javascript:;\" class=\"delete_column\"  ng-click=\"vm.tableRemove(2)\"><img src=\"../images/ys_img4.png\"/></a>\r\n                                    </div>\r\n                                    <div>\r\n                                        <table class=\"essential_factor_tab\">\r\n                                            <tr ng-repeat=\"(indexRow,row) in vm.tableList.data.listTable track by $index\">\r\n                                                <td ng-repeat=\"(indexColumn,item) in row track by $index\" ng-click=\"vm.tableRow=indexRow;vm.tableColumn=indexColumn\">\r\n                                                    <!--{{item}}-->\r\n                                                    <textarea ng-if=\"indexRow==0\" ng-model=\"item\" value=\"\"  ng-disabled=\"indexColumn==0\"  ng-click=\"indexColumn==0?'':vm.editList(indexRow,indexColumn);\" style=\"width:100%;height:19px;background:inherit;cursor:pointer\">{{item}}</textarea>\r\n                                                    <!--<input type=\"text\" ng-if=\"indexRow==0&&indexColumn!=0\" ng-model=\"item\"   style=\"background:inherit\"/>-->\r\n                                                    <textarea  ng-if=\"indexRow!=0\" ng-model=\"item\" value=\"\" ng-change=\"vm.tableChange(indexRow,indexColumn,item)\" style=\"width:100%;\">{{item}}</textarea>\r\n                                                </td>\r\n                                            </tr>\r\n                                        </table>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div know-content-configuration=\"queryFactorRelatedQuestion\" template-type=\"false\"></div>\r\n                    </div>\r\n                    <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                        <div class=\"list_facContent_L\"></div>\r\n                        <div>\r\n                            <input type=\"button\" class=\"btn1 btn1_blue mr-20\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateFactorKnow':'storeFactorKnow')\"/>\r\n                            <input type=\"button\" class=\"btn1 btn_green\"  ng-disabled=\"vm.limitSave\"   ng-click=\"vm.save(vm.knowledgeId?'updateFactorKnow':'storeFactorKnow')\" value=\"保存\"/>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导-->\r\n                    <div class=\"shadow_div dn\" ></div>\r\n                    <div class=\"step_div \" >\r\n                        <div class=\"step_one dn\" id=\"step_one\" >\r\n                            <div class=\"step_one_s\">1</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识标题：您需要填写这个知识的标准的提问方式哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                            <div class=\"step_one_s\">2</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                            <div class=\"step_one_s\">3</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~</p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                            <div class=\"step_one_s\">4</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                            <div class=\"step_one_s\">5</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                            <div class=\"step_one_s\">6</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>渠道维度：渠道和维度的组合是不可以重复的，添加时一定要注意哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                            <div class=\"step_one_s\">7</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导end-->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ }),

/***/ 114:
/***/ (function(module, exports) {

	module.exports = "<!-- new markKnow  -->\r\n<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"wrap markKnow\">\r\n    <div class=\"content_wrap page-container\" style=\"padding:0;\">\r\n        <div class=\"wrap mb30\">\r\n            <div class=\"content_box mb25 mt10\">\r\n                <div class=\"cl mb-20\">\r\n                    <div class=\"L\">\r\n                        <h3 class=\"f22 pl-10 mb15\"  ng-bind=\"vm.knowledgeId?'富文本型知识编辑':'富文本型知识新增'\"></h3>\r\n                    </div>\r\n                    <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n                </div>\r\n                <div class=\" pr\">\r\n                    <div class=\"pt30 pb30\" style=\"border-bottom: 1px dashed #dadada;\">\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">知识标题：</div>\r\n                            <div >\r\n                                <input  type=\"text\" class=\"bk-gray input-text \" autofocus  placeholder=\"请输入标题\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required  style=\"width:394px;\"/>\r\n                                <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- 时间-->\r\n                        <span select-start-end-time=\"notDialog\"></span>\r\n                        <!--  bot -->\r\n                        <span bot-class-tree=\"notDialog\"></span>\r\n                        <!-- 生成bot列表 -->\r\n                        <div class=\"exten_problem\"  ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">BOT路径：</div>\r\n                                <div class=\" clearfix\" >\r\n                                    <div class=\"ipt-txt-box L\" style=\"width: 395px;border: 1px solid #e1e1e1;margin-right: 10px;\">\r\n                                        <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;\">\r\n                                            <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                                        </div>\r\n                                    </div>\r\n                                    <a href=\"javascript:;\" class=\"L mr-10 mt-5\" ><img src=\"../../../../images/images/delete_img.png\" ng-click=\"vm.creatSelectBot.splice($index,1)\" alt=\"\"></a>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"list_facContent mb-10\">\r\n                            <div class=\"list_facContent_L\">业务框架：</div>\r\n                            <div >\r\n                                <select class=\"input-text\" style=\"width:395px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                    <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent\" style=\"padding-top:30px;padding-bottom:30px;border-bottom: 1px dashed #dadada;\">\r\n                        <div class=\"list_facContent_L\" style=\"top:30px;\">知识内容: &nbsp;</div>\r\n                        <!--预览内容-->\r\n                        <div ng-repeat=\"(index,item) in vm.scanContent track by $index\">\r\n                            <div class=\"item-line\">\r\n                                <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                                    内容{{index+1}}:\r\n                                </div>\r\n                                <div class=\"value\">\r\n                                    <div class=\"ipt-txt-box clearfix\">\r\n                                        <div class=\"textareaDiv textareaDiv1 textareaDiv2 L \">\r\n                                            <p ng-if=\"item.knowledgeContentNegative == 113\" ng-bind-html=\"item.knowledgeContent | toHtml\"></p>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 112\" style=\"text-align: center\">\r\n                                                <p>语音名称：{{item.knowledgeContentDetail.name}}</p>\r\n                                                <p><img src=\"/images/audio_pic1.png\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n                                            </div>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 111\" style=\"text-align: center\">\r\n                                                <p>图片名称：{{item.knowledgeContentDetail.name}}</p>\r\n                                                <p><img ng-src=\"/img/{{item.knowledgeContent}}\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n                                            </div>\r\n                                            <div ng-if=\"item.knowledgeContentNegative == 114\" style=\"text-align: center\">\r\n                                              <p>图文标题：{{item.knowledgeContentDetail.name}}</p>\r\n                                              <p><img ng-src=\"/img/{{item.knowledgeContentDetail.url}}\" title=\"{{item.knowledgeContentDetail.name}}\" style=\"width: 120px;height: 80px;margin-top: 10px;\" alt=\"\"/></p>\r\n\r\n                                           </div>\r\n                                        </div>\r\n                                        <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                        <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"item-line item_line\">\r\n                                <div class=\"optionDiv\">渠道：\r\n                                    <span class=\"mr-10\" ng-repeat=\"val in item.channelIdList track by $index\">{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"item-line item_line\" >\r\n                                <div class=\"optionDiv\">维度:\r\n                                    <span style=\"margin: 0 4px;\" ng-repeat=\"val in item.dimensionIdList track by $index\">{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"item-line\">\r\n                            <div class=\"value\">\r\n                                <div class=\"ipt-txt-box\">\r\n                                    <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\"  type=\"button\" value=\"+ 新增\"/>\r\n                                    <i class=\"btn-empty\"></i>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div  style=\"padding-top:30px;padding-bottom:30px;\">\r\n                        <span concept-extension=\"notDialog\" tag=\"true\" api=\"queryRichTextExtension\"></span>\r\n                        <!--手动添加-->\r\n                        <div class=\"exten_problem\"  style=\"overflow: visible\" ng-repeat=\"(itemIndex,item) in vm.extensions track by $index\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">概念扩展：</div>\r\n                                <div >\r\n                                    <div class=\"L extended_query_txt\" style=\"width:345px;height:35px;border:0;overflow-x: auto;\" >\r\n                                        <!--{{item.extensionQuestionTagList}}-->\r\n                                           <span ng-repeat=\"val in item.extensionQuestionTagList track by $index\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                                {{val.tagName}}\r\n                                            </span>\r\n                                        <!--{{item.extensionQuestionTitle}}-->\r\n                                    </div>\r\n                                    <span class=\"tag_s mr-10 L\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                    <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                    <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- 業務框架 生成 -->\r\n                        <div class=\"exten_problem\"  ng-repeat=\"(itemIndex,item) in vm.extensionsByFrame\">\r\n                            <div class=\"list_facContent mb-10\">\r\n                                <div class=\"list_facContent_L\">概念扩展：</div>\r\n                                <div>\r\n                                    <div class=\"L extended_query_txt\" style=\"width:345px;height:35px;border:0;overflow-x: auto\" >\r\n                                       <span ng-repeat=\"val in item.extensionQuestionTagList\" ng-class=\"{' tag_item':true , ' tagExistFalse':!val.exist}\">\r\n                                            {{val.tagName}}\r\n                                        </span>\r\n                                    </div>\r\n                                    <span class=\"tag_s mr-10 L\" style=\"background: #e0eaf1;border: 1px solid #eee;height: 25px;line-height: 25px;padding: 0 10px;text-align: center;\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                                    <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_list_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                                    <span class=\"L\"><b>来源于: </b> <span>{{item.extensionQuestionTitle}}</span></span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"list_facContent \" style=\"margin-bottom:80px;\">\r\n                        <div class=\"list_facContent_L\"></div>\r\n                        <div >\r\n                            <input type=\"button\" class=\"btn1 btn1_blue mr-20\" ng-disabled=\"vm.limitSave\"  ng-click=\"vm.save(vm.knowledgeId?'updateRichTextKnow':'storeRichTextKnow')\" value=\"保存\"/>\r\n                            <input type=\"button\" class=\"btn1 btn_green\" value=\"预览\" ng-click=\"vm.scan(vm.knowledgeId?'updateRichTextKnow':'storeRichTextKnow')\"/>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导-->\r\n                    <div class=\"shadow_div dn\" ></div>\r\n                    <div class=\"step_div \" >\r\n                        <div class=\"step_one dn\" id=\"step_one\" >\r\n                            <div class=\"step_one_s\">1</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识标题：您需要填写这个知识的标准的提问方式哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                            <div class=\"step_one_s\">2</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                            <div class=\"step_one_s\">3</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                            <div class=\"step_one_s\">4</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                            <div class=\"step_one_s\">5</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"step_one step_seven dn\" id=\"step_seven\">\r\n                            <div class=\"step_one_s\">6</div>\r\n                            <div class=\"step_one_arrow\"></div>\r\n                            <div class=\"step_one_con\">\r\n                                <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!\r\n                                </p>\r\n                                <div class=\"tr introjs-tooltipbuttons\">\r\n                                    <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                                    <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                                    <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!--引导end-->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ })

})