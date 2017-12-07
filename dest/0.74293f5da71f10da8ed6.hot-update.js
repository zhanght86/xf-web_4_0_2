webpackHotUpdate(0,{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/22.
	 * @Module :  入口文件
	 */
	var routeStates = void 0,
	    angular = void 0,
	    ngDepModules = [];
	angular = __webpack_require__(4);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(13);
	__webpack_require__(14);
	function loadBasicModules() {
	    // 按需加载
	    __webpack_require__(7);
	    ngDepModules.push('oc.lazyLoad');
	    // 路由
	    __webpack_require__(10);
	    ngDepModules.push('ui.router');
	    // 本地存储
	    __webpack_require__(11);
	    ngDepModules.push('LocalStorageModule');
	    //cookie
	    __webpack_require__(8);
	    ngDepModules.push('ngCookies');
	    //弹框
	    __webpack_require__(13);
	    ngDepModules.push('ngDialog');
	    // 路由
	    __webpack_require__(14);
	    ngDepModules.push('ngRoute');
	}
	loadBasicModules();
	// define one angular module
	var xf_web = angular.module('xf_web', ngDepModules);
	//登录
	angular.module("loginModule", []);
	//首页
	angular.module("HPModule", []);
	//系统管理
	angular.module("SMModule", []);
	// 加载controller
	__webpack_require__(16)(xf_web);
	// 加载指令
	__webpack_require__(17)(xf_web);
	// 加载config
	__webpack_require__(18)(xf_web);
	// 加载router
	__webpack_require__(21)(xf_web);
	// 加载service
	__webpack_require__(25)(xf_web);
	// require('./entrance/app.router')(xf_web);
	/**
	 * 配置路由。
	 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由，为了实现路由的多层嵌套
	 * @param  {[type]} $stateProvider
	 * @param  {[type]} $urlRouterProvider
	 * @return {[type]}
	 */
	xf_web.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider", "$routeProvider", "$locationProvider", "$provide", "$compileProvider", "$controllerProvider", "$filterProvider", "$ocLazyLoadProvider", "constantMethod", "$rootScopeProvider", function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, $routeProvider, $locationProvider, $provide, $compileProvider, $controllerProvider, $filterProvider, $ocLazyLoadProvider, constantMethod, $rootScopeProvider) {
	    $rootScopeProvider.digestTtl(15);
	    //--------------------------------------------------
	    //            配置ajax请求
	    //--------------------------------------------------
	    $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
	    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
	    // 禁止ajax缓存
	    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	    //    地址时间戳显示
	    // /* 根据url的变化加载内容 */
	    $httpProvider.interceptors.push(['$injector', function ($injector) {
	        return $injector.get('AuthInterceptor');
	    }]);

	    //--------------------------------------------------
	    //            配置localStorageServiceProvider
	    //--------------------------------------------------
	    localStorageServiceProvider.setPrefix("xf");
	    localStorageServiceProvider.setNotify(true, true);

	    //--------------------------------------------------
	    //            配置 将依赖的脚本进行注入操作
	    //--------------------------------------------------
	    xf_web.controller = $controllerProvider.register;
	    xf_web.directive = $compileProvider.directive;
	    xf_web.filter = $filterProvider.register;
	    xf_web.factory = $provide.factory;
	    xf_web.service = $provide.service;
	    xf_web.constant = $provide.constant;
	    xf_web.value = $provide.value;
	    //--------------------------------------------------
	    //            配置 将依赖的脚本进行注入操作
	    //--------------------------------------------------
	    $ocLazyLoadProvider.config({
	        debug: false,
	        events: false,
	        modules: constantMethod.Modules_Config
	    });
	    //--------------------------------------------------
	    //            路由 配置
	    //--------------------------------------------------
	    // $locationProvider.hashPrefix('!');
	    // $locationProvider.html5Mode(true);    // 如果不设置 路由不会生效
	    // routeStates = require('./entrance/app.router')(angular,constantMethod);
	    // routeStates.forEach(state => {
	    //     $stateProvider.state(state);
	    // });
	    // $urlRouterProvider.otherwise(function($injector, $location){
	    //     $location.path('/login');
	    // });
	}]);

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module : 路由配置
	 */
	module.exports = function (angular) {
	    // return [
	    //     //--------------------------------------------------
	    //     //           登录页面
	    //     //--------------------------------------------------
	    //     {
	    //         name: 'login',
	    //         url: '/login',
	    //         data: {
	    //             roles: []
	    //         },
	    //         title : "登录" ,
	    //         templateProvider:
	    //             ['$q', function ($q) {
	    //                 let deferred = $q.defer();
	    //                 require.ensure([], function () {
	    //                     let template = require('../static/login/views/login.html');
	    //                     deferred.resolve(template);
	    //                 });
	    //                 return deferred.promise;
	    //             }],
	    //         controller: 'loginController',
	    //         resolve:
	    //             {
	    //                 loadDep: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad)=> {
	    //                     let defer = $q.defer();
	    //                     require.ensure([], ()=> {
	    //                         let loginModule = require('../static/login/module/loginModule.js')(angular);   //动态加载Module
	    //                         $ocLazyLoad.load({
	    //                             name: "loginModule"                                           //name就是你module的名称
	    //                         });
	    //                         defer.resolve(loginModule);
	    //                     });
	    //                     return defer.promise;
	    //                 }]
	    //             }
	    //     },
	    //
	    // ];
	    angular.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	        $urlRouterProvider.otherwise(function ($injector, $location) {
	            $location.path('/login');
	        });
	        $stateProvider
	        //登录路由
	        //    .state("login", {
	        //        url: "/login",
	        //        templateUrl: 'static/login/login.html',
	        //        controller: "loginController"
	        //    })
	        // 首页路由
	        .state("homePage", {
	            url: "/homePage",
	            templateUrl: 'static/index/main.html'
	            //controller: "homePageController"
	        }).state("homePage.define", {
	            url: "/define",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/index/home_page/content.html',
	                    controller: "homePageContentController"
	                }
	            }
	        }).state("homePage.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/index/user_control/switch_application/adminContent.html',
	                    controller: "adminContentController"
	                }
	            }

	        })
	        //用户管理
	        .state("homePage.userManage", {
	            url: "/userManage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/index/user_control/permission_manage/userManage.html',
	                    controller: "userManageController"
	                }
	            }
	        })

	        //--------------------------------------------------------------------
	        //应用管理 application_manage
	        .state("setting", {
	            url: "/setting",
	            templateUrl: 'static/application_manage/main.html',
	            controller: "myApplicationSettingController"
	        }).state("setting.robot", {
	            url: "/robot",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/robot_setup/robot_setup.html',
	                    controller: "robotSetupController"
	                }
	            }
	        }).state("setting.parameter", {
	            url: "/parameter",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/parameter_setup/parameter_setup.html',
	                    controller: "parameterSetupController"
	                }
	            }
	        }).state("setting.manual", {
	            url: "/manual",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/manual_setting/manual_setting.html',
	                    controller: "manualSettingController"
	                }
	            }
	        }).state("setting.chatPageConfig", {
	            url: "/chatPageConfig",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/hot_knowledge_setup/hot_knowledge_setup.html',
	                    controller: "hotKnowledgeSetupController"
	                }
	            }
	        }).state("setting.sceneManage", {
	            url: "/sceneManage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/scene_manage/scene_manage.html',
	                    controller: "sceneManageController"
	                }
	            }
	        })
	        // 维度管理
	        .state("setting.dimension", {
	            url: "/dimension",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/dimension_manage/dimension_manage.html',
	                    controller: "dimensionManageController"
	                }
	            }
	        })
	        // 渠道管理
	        .state("setting.channel", {
	            url: "/channel",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/channel_manage/channel_manage.html',
	                    controller: "channelManageController"
	                }
	            }
	        })
	        // 关联管理  ---》》》营销显示
	        .state("setting.association", {
	            url: "/association",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/config/relate_manage/relate_manage.html',
	                    controller: "relateManageController"
	                }
	            }
	        })
	        //应用信息
	        .state("setting.Infor", {
	            url: "/Infor",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/info/info.html',
	                    controller: "applicationInforController"
	                }
	            }
	        }).state("setting.backup", {
	            url: "/backup",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/info/backup_restore.html',
	                    controller: "backupRestoreController"
	                }
	            }
	        })
	        //应用发布
	        .state("setting.releaseMan", {
	            url: "/releaseMan",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/release/release_manage/release_manage.html',
	                    controller: "releaseManageController"
	                }
	            }
	        }).state("setting.nodeMan", {
	            url: "/nodeMan",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_manage/release/node_manage/node_manage.html',
	                    controller: "nodeManageController"
	                }
	            }
	        })

	        //--------------------------------------------------------------------------
	        //业务建模 business_modeling

	        .state("relationalCatalog.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                }
	            }
	        }).state("relationalCatalog", {
	            url: "/relationalCatalog",
	            templateUrl: 'static/business_modeling/bot/relational_catalog.html',
	            controller: "relationalCatalogController"
	        }).state("botApply.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                }
	            }
	        }).state("botApply", {
	            url: "/botApply",
	            templateUrl: 'static/business_modeling/bot/bot_apply.html',
	            controller: "botApplyController"
	        })
	        //业务建模---框架库
	        .state("frameworkLibrary.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                }
	            }
	        }).state("frameworkLibrary", {
	            url: "/frameworkLibrary",
	            templateUrl: 'static/business_modeling/frame_database/framework_library.html',
	            controller: "frameworkLibraryController"
	        })
	        //业务建模---框架库--faq框架新增
	        .state("faqNewFrame.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                }
	            }
	        }).state("faqNewFrame", {
	            url: "/faqNewFrame",
	            templateUrl: 'static/business_modeling/frame_database/faq_new_frame.html',
	            controller: "faqNewFrameController"
	        })
	        //业务建模---框架库--要素框架新增
	        .state("factorNewFrame.manage", {
	            url: "/manage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                }
	            }
	        }).state("factorNewFrame", {
	            url: "/factorNewFrame",
	            templateUrl: 'static/business_modeling/frame_database/factor_new_frame.html',
	            controller: "factorNewFrameController"
	        })
	        //业务建模---概念管理
	        .state("conceptManage", {
	            url: "/conceptManage",
	            templateUrl: 'static/business_modeling/concept_library/main.html',
	            controller: "conceptLibraryController"
	        }).state("conceptManage.synony", {
	            url: "/synony",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/synony/synony_concept_manage.html',
	                    controller: "synonyConceptManageController"
	                }
	            }
	        }).state("conceptManage.aggregate", {
	            url: "/aggregate",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/aggregate/aggregate_concept_manage.html',
	                    controller: "aggregateConceptManageController"
	                }
	            }
	        }).state("conceptManage.business", {
	            url: "/business",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/business/business_concept_manage.html',
	                    controller: "businessConceptManageController"
	                }
	            }
	        }).state("conceptManage.sensitive", {
	            url: "/sensitive",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/sensitive/sensitive_concept_manage.html',
	                    controller: "sensitiveConceptManageController"
	                }
	            }
	        }).state("conceptManage.errorCorrection", {
	            url: "/errorCorrection",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/error_correction/error_correction_manage.html',
	                    controller: "errorCorrectionConceptManageController"
	                }
	            }
	        }).state("conceptManage.disable", {
	            url: "/disable",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/disable/disable_concept_manage.html',
	                    controller: "disableConceptManageController"
	                }
	            }
	        }).state("conceptManage.intention", {
	            url: "/intention",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/intention/intention_concept_manage.html',
	                    controller: "intentionConceptManageController"
	                }
	            }
	        }).state("conceptManage.sentiment", {
	            url: "/sentiment",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/sentiment/sentiment_concept_manage.html',
	                    controller: "sentimentConceptManageController"
	                }
	            }
	        }).state("conceptManage.bot", {
	            url: "/bot",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/bot/bot_concept_manage.html',
	                    controller: "botConceptManageController"
	                }
	            }
	        }).state("conceptManage.semanticExpression", {
	            url: "/semanticExpression",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/business_modeling/concept_library/semantic_expression/semantic_expression_manage.html',
	                    controller: "semanticExpressionConceptManageController"
	                }
	            }
	        })

	        //---------------------------------------------------------------------------
	        //知识管理knowledge_management
	        .state("knowledgeManagement", {
	            url: "/knowledgeManagement",
	            templateUrl: 'static/knowledge_manage/main.html',
	            controller: "knowledgeManagementController"

	        })
	        //客服知識總覽
	        .state("knowledgeManagement.custOverview", {
	            url: "/custOverview",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/overview/custOverview.html',
	                    controller: "custOverviewController"
	                }
	            }
	        })
	        //客服知識預覽
	        .state("knowledgeManagement.custPreview", {
	            url: "/custPreview/:knowledgeId/:knowledgeType",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/overview/custPreview.html',
	                    controller: "custPreviewController"
	                }
	            }
	        })
	        //營銷知識總覽
	        .state("knowledgeManagement.markOverview", {
	            url: "/markOverview",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/overview/markOverview.html',
	                    controller: "markOverviewController"
	                }
	            }
	        })
	        //營銷知識預覽
	        .state("knowledgeManagement.markPreview", {
	            url: "/markPreview/:knowledgeId/:knowledgeType",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/overview/markPreview.html',
	                    controller: "markPreviewController"
	                }
	            }
	        })
	        //概念新增
	        .state("knowledgeManagement.singleAddConcept", {
	            url: "/singleAddConcept/:data/:knowledgeTitle",
	            //params:{"knowledgeTitle":null},
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/concept/customer.html',
	                    controller: "conceptController"
	                }
	            }
	        })
	        //营销场景-概念新增
	        .state("knowledgeManagement.conceptAdd", {
	            url: "/ConceptAdd/:data/:knowledgeTitle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/concept/markting.html',
	                    controller: "newConceptController"
	                }
	            }
	        }).state("knowledgeManagement.faqAdd", {
	            url: "/faqAdd/:data/:knowledgeTitle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/faq/faq.html',
	                    controller: "knowManaFaqController"
	                }
	            }
	        }).state("knowledgeManagement.listAdd", {
	            url: "/listAdd/:data/:knowledgeTitle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/list/list.html',
	                    controller: "knowManaListController"
	                }
	            }
	        }).state("knowledgeManagement.factorAdd", {
	            url: "/factorAdd/:data/:knowledgeTitle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/factor/factor.html',
	                    controller: "knowledgeEssentialController"
	                }
	            }
	        }).state("knowledgeManagement.markKnow", {
	            url: "/markKnow/:data/:knowledgeTitle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/single_add/rich_text/rich_text.html',
	                    controller: "markKnowController"
	                }
	            }
	        })
	        //知識預覽
	        .state("knowledgeManagement.knowledgeScan", {
	            url: "/knowledgeScan/:knowledgeScan",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/public_html/knowledgeScan.html',
	                    controller: "knowledgeScanController"
	                }
	            }
	        })
	        //批量知识新增
	        .state("knowledgeManagement.knowBatchAdditions", {
	            url: "/knowBatchAdditions",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/batch_add/knowBatchAdditions.html',
	                    controller: "knowBatchAdditionsController"
	                }
	            }
	        })
	        // 历史查看
	        .state("knowledgeManagement.historyView", {
	            url: "/historyView",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/knowledge_manage/history/history.html',
	                    controller: "historyViewController"
	                }
	            }
	        })

	        //  知识接入
	        //任务分析
	        .state("back", {
	            url: "/back",
	            templateUrl: 'static/knowledge_manage/document_process/main.html',
	            controller: "backController"
	        }).state("back.gateway", {
	            url: "/gateway/:isGo/:knowDocId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'main_container': {

	                    templateUrl: 'static/knowledge_manage/document_process/main_container.html',
	                    controller: "analyseTaskController"
	                }
	            }
	        }).state("back.doc_results_view", {
	            url: "/doc_results_view/:isGo/:knowDocId/:knowDocCreateTime/:knowDocUserName",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'main_container': {
	                    templateUrl: 'static/knowledge_manage/document_process/doc_results_view.html',
	                    controller: "doc_results_viewController"
	                }
	            }
	        })
	        //模板管理
	        .state("back.template", {
	            url: "/gateway/template",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'main_container': {
	                    templateUrl: 'static/knowledge_manage/document_process/main_template_container.html',
	                    controller: "temController"
	                }
	            }
	        })
	        //创建模板
	        .state("back.createTemplate", {
	            url: "/gateway/create_template/:isGo/:temId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'main_container': {
	                    templateUrl: 'static/knowledge_manage/document_process/main_create_template_container.html',
	                    controller: "createTemController"
	                }
	            }
	        })
	        //规则抽取
	        .state("back.docselect", {
	            url: "/doc_select/:temId/:level/:roleId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'main_container': {
	                    templateUrl: 'static/knowledge_manage/document_process/doc_select.html',
	                    controller: "docSelectController"
	                }
	            }
	        })

	        //-------------------------------------------------------------------------------------
	        //测试功能 function_testing
	        .state("functionalTest", {
	            url: "/functionalTest",
	            templateUrl: 'static/functional_testing/main.html',
	            controller: "functionalTestController"

	        })
	        //问法测试
	        .state("functionalTest.questionTest", {
	            url: "/questionTest",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/question_test/question_test.html',
	                    controller: "questionTestController"
	                }
	            }
	        })
	        //会话测试
	        .state("functionalTest.sessionTest", {
	            url: "/sessionTest",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/session_test/session_test.html',
	                    controller: "sessionTestController"
	                }
	            }
	        })
	        //批量测试
	        .state("functionalTest.batchTest", {
	            url: "/batchTest",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/batch_test/batch_test/batch_test.html',
	                    controller: "batchTestController"
	                }
	            }
	        }).state("functionalTest.testResult", {
	            url: "/testResult/:batchNumberId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/batch_test/test_result/test_result.html',
	                    controller: "testResultController"
	                }
	            }
	        }).state("functionalTest.viewDetails", {
	            url: "/viewDetails/:batchNumberId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/batch_test/view_details/view_details.html',
	                    controller: "viewDetailsController"
	                }
	            }
	        }).state("functionalTest.participle", {
	            url: "/participle",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/participle/participle.html',
	                    controller: "participleController"
	                }
	            }
	        }).state("functionalTest.participleResult", {
	            url: "/participleResult",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/functional_testing/participle/participle_result.html',
	                    controller: "participleResultController"
	                }
	            }
	        })
	        //--------------------------------------------------------------------------------------
	        //应用分析 application_analusis
	        .state("applAnalysis", {
	            url: "/applAnalysis",
	            templateUrl: 'static/application_analysis/main.html',
	            controller: "applAnalysisController"

	        }).state("applAnalysis.accessStatistics", {
	            url: "/accessStatistics",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/access_statistics/access_statistics.html',
	                    controller: "accessStatisticsController"
	                }
	            }
	        }).state("applAnalysis.knowledgeRanking", {
	            url: "/knowledgeRanking",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/knowledge_ranking/knowledge_ranking.html',
	                    controller: "knowledgeRankingController"
	                }
	            }
	        }).state("applAnalysis.sessionDetails", {
	            url: "/sessionDetails",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/session_details/session_details.html',
	                    controller: "sessionDetailsController"
	                }
	            }
	        }).state("applAnalysis.satisfactionDegree", {
	            url: "/satisfactionDegree",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/satisfaction_degree/satisfaction_degree.html',
	                    controller: "satisfactionDegreeController"
	                }
	            }
	        }).state("applAnalysis.resolutionStatistics", {
	            url: "/resolutionStatistics",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/resolution_statistics/resolution_statistics.html',
	                    controller: "resolutionStatisticsController"
	                }
	            }
	        }).state("applAnalysis.reinforcementLearn", {
	            url: "/reinforcementLearn",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/reinforcement_learn/reinforcement_learn.html',
	                    controller: "reinforcementLearnController"
	                }
	            }
	        }).state("applAnalysis.newKnowledgeDiscoveryLearn", {
	            url: "/newKnowledgeDiscoveryLearn",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/new_know_discovery_learn/new_know_discovery_learn.html',
	                    controller: "newKnowledgeDiscoveryLearnController"
	                }
	            }
	        }).state("applAnalysis.operationLog", {
	            url: "/operationLog",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/operation_log/operation_log.html',
	                    controller: "operationLogController"
	                }
	            }
	        }).state("applAnalysis.sessionLog", {
	            url: "/sessionLog",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/application_analysis/session_log/session_log.html',
	                    controller: "sessionLogController"
	                }
	            }
	        })
	        //--------------------------------------------------------------------------------
	        //素材管理 material_management
	        //聊天知识库
	        .state("materialManagement", {
	            url: "/materialManagement/:userPermission",
	            templateUrl: 'static/material_management/main.html'
	            //controller: "adminController"
	        }).state("materialManagement.chatKnowledgeBase", {
	            url: "/chatKnowledgeBase/:userPermission",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/chat/knowledge_base/chat_knowledge_base.html',
	                    controller: "chatKnowledgeBaseController"
	                }
	            }
	        }).state("materialManagement.chatKnowledgeBasePreview", {
	            url: "/chatKnowledgeBasePreview/:scanData/:id",
	            //cache:'true',
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/chat/knowledge_base_prew/chat_knowledge_base_preview.html',
	                    controller: "chatKnowledgeBasePreController"
	                }
	            }
	        }).state("materialManagement.faqChat", {
	            url: "/faqChat/:scanDataList",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/chat/faq/faq_chat.html',
	                    controller: "faqChatController"
	                }
	            }
	        }).state("materialManagement.conceptChat", {
	            url: "/conceptChat/:scanDataList",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/chat/concept/concept_chat.html',
	                    controller: "conceptChatController"
	                }
	            }
	        })
	        //语音库
	        .state("materialManagement.speechLibrary", {
	            url: "/speechLibrary",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/speech_library/speech_library.html',
	                    controller: "speechLibraryController"
	                }
	            }
	        })
	        //图片库
	        .state("materialManagement.pictureLibrary", {
	            url: "/pictureLibrary",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/picture_library/picture_library.html',
	                    controller: "pictureLibraryController"
	                }
	            }
	        })
	        //新建图文消息
	        .state("materialManagement.teletextMessage", {
	            url: "/teletextMessage",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/teletext_message/teletext_message.html',
	                    controller: "teletextMessageController"
	                }
	            }
	        }).state("materialManagement.addtemes", {
	            url: "/addtemes/:imgTextId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/teletext_message/add_tw_mes.html',
	                    controller: "addTwMesController"
	                }
	            }
	        }).state("materialManagement.graphicDetails", {
	            url: "/graphicDetails/:imgTextId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/teletext_message/graphic_details.html',
	                    controller: "graphicDetailsController"
	                }
	            }
	        })
	        //文档库
	        .state("materialManagement.documentLibrary", {
	            url: "/documentLibrary",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/material_management/document_library/document_library.html',
	                    controller: "documentLibraryController"
	                }
	            }
	        })

	        //--------------------------------------------------------------------
	        //深度学习 deep_learning
	        .state("deepLearning", {
	            url: "/deepLearning",
	            templateUrl: 'static/deepLearning/deepLearning.html'
	        }).state("deepLearning.dataAcquisition", {
	            url: "/dataAcquisition",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/deepLearning/dataAcquisition.html',
	                    controller: "dataAcquisitionController"
	                }
	            }
	        }).state("deepLearning.acquisitionDetails", {
	            url: "/acquisitionDetails/:crawlRecordId",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/deepLearning/acquisitionDetails.html',
	                    controller: "acquisitionDetailsController"
	                }
	            }
	        }).state("deepLearning.similarityCalculation", {
	            url: "/similarityCalculation",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/deepLearning/similarityCalculation.html',
	                    controller: "similarityCalculationController"
	                }
	            }
	        }).state("deepLearning.deepLearningCon", {
	            url: "/deepLearningCon",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/deepLearning/deepLearningCon.html',
	                    controller: "deepLearningConController"
	                }
	            }
	        }).state("deepLearning.deeplearnConfig", {
	            url: "/deeplearnConfig",
	            views: {
	                'header': {
	                    templateUrl: 'static/index/home_page/nav.html',
	                    controller: "homePageNavController"
	                },
	                'content': {
	                    templateUrl: 'static/deepLearning/deeplearnConfig.html',
	                    controller: "deeplearnConfigController"
	                }
	            }
	        });
	    }]);
	};

/***/ })

})