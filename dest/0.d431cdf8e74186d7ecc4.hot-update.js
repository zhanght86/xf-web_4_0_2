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
	                template: __webpack_require__(41),
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

/***/ 20:
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"homePageNav\">\r\n    <div class=\"header clearfix\">\r\n        <div class=\"logo\">\r\n            <a ui-sref=\"homePage.define\"><strong>小富机器人控制台</strong><em class=\"edition\">V4.0</em></a>\r\n            <!--<a ui-sref=\"homePage.define\"><strong>小富机器人控制平台</strong><em class=\"edition\">V4.0</em></a>-->\r\n        </div>\r\n        <ul class=\"nav\">\r\n            <li>\r\n                <a ui-sref=\"homePage.define\">首页</a>\r\n            </li>\r\n            <li>\r\n                <a ng-click=\"vm.logApplication()\">应用管理</a>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">业务建模<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"relationalCatalog.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jmzy\"></i>\r\n                            <span>BOT</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"frameworkLibrary.manage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lmgl\"></i>\r\n                            <span>框架库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"conceptManage.synony\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_gngl\"></i>\r\n                            <span>概念库</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">知识管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.custOverview\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zszl\"></i>\r\n                            <span>知识总览</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <ul class=\"menu_1 menu_2 \" style=\"min-height: 40%;\">\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.faqAdd\">\r\n                                    <span>FAQ知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.singleAddConcept\">\r\n                                    <span>概念知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                          \r\n                                <a ui-sref=\"knowledgeManagement.listAdd\">\r\n                                    <span>列表知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                             \r\n                                <a ui-sref=\"knowledgeManagement.factorAdd\">\r\n                                    <span>要素知识新增</span>\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ui-sref=\"knowledgeManagement.markKnow\">\r\n                                    <span>富文本知识</span>\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                        <a href=\"javascript:;\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsjg\"></i>\r\n                            <span>知识单条新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.knowBatchAdditions\">\r\n                            <i class=\"icon-nav icon-nav__icon-zsplxz\"></i>\r\n                            <span>知识批量新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"back.gateway\">\r\n                            <i class=\"icon-nav icon-nav__icon-wdjgxz\"></i>\r\n                            <span>文档加工新增</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a ui-sref=\"setting.releaseMan\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zsfb\"></i>-->\r\n                            <!--<span>知识发布</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_zssh\"></i>-->\r\n                            <!--<span>知识审核</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"knowledgeManagement.historyView\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_lsck\"></i>\r\n                            <span>历史查看</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">测试功能<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.questionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wfcs\"></i>\r\n                            <span>问法测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.sessionTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltcs\"></i>\r\n                            <span>会话测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.batchTest\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_plcs\"></i>\r\n                            <span>批量测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"functionalTest.participle\">\r\n                            <i class=\"icon-nav icon-nav_fcyy\"></i>\r\n                            <span>分词应用</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">应用分析<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.accessStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fwtj\"></i>\r\n                            <span>访问统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.knowledgeRanking\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_zsdpm\"></i>\r\n                            <span>知识点排名统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_wpp\"></i>-->\r\n                            <!--<span>未匹配问题统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>-->\r\n                            <!--<span>分类统计</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionDetails\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_hhmx\"></i>\r\n                            <span>会话明细统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.satisfactionDegree\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_jjltj\"></i>\r\n                            <span>会话满意度统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.resolutionStatistics\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_fltj\"></i>\r\n                            <span>问答解决率统计</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.reinforcementLearn\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_zqxx\" ></i>\r\n                            <span>智能学习</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.newKnowledgeDiscoveryLearn\">\r\n                            <i class=\"icon-nav icon-nav_xzzfx\" ></i>\r\n                            <span>未匹配问题聚类</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"applAnalysis.operationLog\" style=\"border-top: 1px dashed #afafb8;\">\r\n                            <i class=\"icon-nav icon-nav_czrz\" ></i>\r\n                            <span>操作日志</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"applAnalysis.sessionLog\">\r\n                            <i class=\"icon-nav icon-nav_hhrz\" ></i>\r\n                            <span>会话日志</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">素材管理<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_ltzsk\"></i>\r\n                            <span>聊天知识库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li>-->\r\n                        <!--<a href=\"javascript:;\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_hxck\"></i>-->\r\n                            <!--<span>寒暄词库</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.pictureLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_tpk\"></i>\r\n                            <span>图片库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.teletextMessage\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_twfxk\"></i>\r\n                            <span>图文消息库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.speechLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>语音库</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"materialManagement.documentLibrary\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_wdk\"></i>\r\n                            <span>文档库</span>\r\n                        </a>\r\n                    </li>\r\n                    <!--<li >-->\r\n                        <!--<a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">-->\r\n                            <!--<i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>-->\r\n                            <!--<span>自动导入更新</span>-->\r\n                        <!--</a>-->\r\n                    <!--</li>-->\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">深度学习<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deeplearnConfig\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>模型构建</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.deepLearningCon\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxxl\"></i>\r\n                            <span>模型训练</span>\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a ui-sref=\"deepLearning.similarityCalculation\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxcs\"></i>\r\n                            <span>模型测试</span>\r\n                        </a>\r\n                    </li>\r\n                    <li >\r\n                        <a ui-sref=\"deepLearning.dataAcquisition\" style=\"border-top: 1px dashed #afafb8\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_sjcj\"></i>\r\n                            <span>自动导入更新</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n            <li ng-if=\"vm.applicationId\">\r\n                <a href=\"javascript:;\">系统监控<i class=\"nav-more nav-more__nav-more\"></i></a>\r\n                <ul class=\"menu_1\">\r\n                    <li>\r\n                        <a ui-sref=\"systemMonitoring.resource\">\r\n                            <i class=\"icon-nav icon-nav__icon-nav_mxgj\"></i>\r\n                            <span>资源监控</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n        <div class=\"header-r\">\r\n            <div class=\"user-admin mr-20\">\r\n                <a class=\"user-name\" href=\"javascript:;\"><i></i><span>{{vm.userName}}</span></a>\r\n                <div class=\"ua-menu_1-box\">\r\n                    <ul class=\"ua-menu_1\">\r\n                        <li>\r\n                            <a ui-sref=\"homePage.userManage\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r1\"></i>\r\n                                <span>权限管理</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a ui-sref=\"homePage.manage\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r2\"></i>\r\n                                <span>切换应用</span>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:;\">\r\n                                <i class=\"icon-header-r icon-header-r__h-r3\"></i>\r\n                                <span ng-click=\"vm.loginout()\">退出登录</span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class=\"mail-conver\" style=\"margin-left:0;\">\r\n                <!--<a ui-sref=\"knowledgeManagement.historyView\" class=\"mail\">-->\r\n                    <!--&lt;!&ndash;<em>2</em>&ndash;&gt;-->\r\n                <!--</a>-->\r\n                <a  class=\"conver\" ng-click=\"vm.queryServiceList()\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"crumbs-nav bgwhite mt20  warp\" ng-show=\"checkShowCrumbs()\">\r\n    <span class=\"cn-lable\">你曾经路过此地：</span>\r\n\r\n    <span class=\"cn-value\" ng-repeat=\"crumb in crumbs track by $index\">\r\n        <a class=\"cn-a\" ui-sref=\"{{crumb.url}}\" ng-bind=\"crumb.name\"></a>\r\n        <i class=\"close\" ng-hide=\"checkShowClose(crumb.url)\" ng-click=\"closeCrumb($index)\" >x</i>\r\n    </span>\r\n</div>\r\n\r\n<style>\r\n\r\n\r\n</style>"

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

	module.exports = "<div class=\"i-nav\">\r\n    <div class=\"i-img-box i-img1\">\r\n        <a  ui-sref=\"knowledgeManagement.markPreview\" ng-if=\"vm.sceneId==2\">\r\n            <div class=\"psa\">\r\n                <strong>营销场景知识管理</strong>\r\n                <p>可以针对营销场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n        <a ui-sref=\"knowledgeManagement.custOverview\" ng-if=\"vm.sceneId==1\">\r\n            <div class=\"psa\" >\r\n                <strong>客服场景知识管理</strong>\r\n                <p>可以针对客服场景内容的知识进行管理</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img2\">\r\n        <a ui-sref=\"relationalCatalog.manage\">\r\n            <div class=\"psa\">\r\n                <strong>业务建模</strong>\r\n                <p>针对概念，业务分类进行继承复用以及上传</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img3\">\r\n        <a ui-sref=\"functionalTest.questionTest\">\r\n            <strong class=\"psa1\">测试功能</strong>\r\n            <p class=\"psa2\">提供多样化测试工具</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img4\">\r\n        <a ui-sref=\"materialManagement.chatKnowledgeBase\">\r\n            <strong class=\"psa1\">素材管理</strong>\r\n            <p class=\"psa2\">可以上传不同的富文本内容</p>\r\n        </a>\r\n    </div>\r\n    <div class=\"i-img-box i-img5\">\r\n        <a ui-sref=\"back.gateway\">\r\n            <div class=\"psa\">\r\n                <strong>知识自动加工</strong>\r\n                <p>针对不同格式的知识，生成结构化知识的体系</p>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <h4 class=\"pt-20 pb-20\"><img src=\"../../../../images/u15.png\" width=\"20\" height=\"20\" />\r\n        <b class=\"f16 ml-5 mt-5\" style=\"color:green;\">我的应用</b>\r\n    </h4>\r\n    <div class=\"p20 my_appbox cl mb-20\">\r\n        <div class=\"L\">\r\n            <div class=\"mb-10\">用户名称： {{vm.userName}}</div>\r\n            <div>\r\n                <!--<span>所属部门：云创中心</span>-->\r\n                <span>用户权限：\r\n                    <span ng-repeat=\"permission in vm.userPermission\" >{{permission}} </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div class=\"R\">\r\n            <div ng-click=\"vm.addApplicationWindow()\" style=\"cursor: pointer\">\r\n                <img src=\"../../../../images/u25.png\" width=\"50\" height=\"50\" />\r\n                <p class=\"mt-10\">新建应用</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"application_box clearfix\">\r\n        <div class=\"L text-c application_box_list bd\" ng-repeat=\"application in vm.myApplication\">\r\n            <a ui-sref=\"setting.Infor\" >\r\n                <!--<img ng-if=\"application.sceneId==2\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\"  src=\"../../../../images/marketing.png\" width=\"80\" height=\"80\"/>-->\r\n                <img ng-click=\"vm.selectScene(application.sceneId,application.id)\" src=\"../../../../images/cust_service.png\" width=\"80\" height=\"80\"/>\r\n                <!--<img ng-if=\"application.sceneId==3\" ng-click=\"vm.selectScene(application.sceneId,application.applicationId)\" src=\"../../../../images/images/u33.png\" width=\"80\" height=\"80\"/>-->\r\n            </a>\r\n            <div class=\"p10 mb-10 bd_bot\" >\r\n                <p title=\"{{application.name}}\" class=\"name\" >{{application.name | limitCheckFilter:8}}</p>\r\n                <!--<p class=\"name\" ng-if=\"application.name.length<=8\">{{application.name}}</p>-->\r\n                <p class=\"scene\">场景类型：<span>客服型</span></p>\r\n                    <p class=\"status\">应用状态：\r\n                        <span ng-if=\"application.statusId==40001\" class=\"c-orange\">未使用</span>\r\n                        <span ng-if=\"application.statusId==40002\" class=\"c-primary\">使用中</span>\r\n                        <span ng-if=\"application.statusId==40003\" class=\"c-error\">已停用</span>\r\n                    </p>\r\n            </div>\r\n            <p title=\"{{application.description}}\" class=\"describe\">{{application.description | limitCheckFilter:8}}</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .application_box{background:#fff;padding:20px 0 20px 20px; clear: both;}\r\n    .application_box_list{padding:10px;box-sizing:border-box;width:273px;margin:0 20px 20px 0;height:220px;}\r\n    .application_box_list p{min-height:21px;}\r\n    .application_box_list .describe{\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n    .application_box_list .status .c-blue{\r\n        color:lightblue;\r\n    }\r\n\r\n    \r\n</style>"

/***/ })

})