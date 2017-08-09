'use strict';
/**
 * Main module of the application.
 */
var knowledge_static_web = angular.module('knowledge_static_web', [
    //公共模块
    'ui.router',
    'ngDialog',
    'ngCookies',
    'ngTextTruncate',
    'monospaced.elastic',
    'LocalStorageModule',
    'know',
    'ngRoute',
    'RecursionHelper',
    'ng.ueditor',
    'ngConfirm',
    'ng.shims.placeholder',
    'pagination',
    //上傳功能
    'angularFileUpload',
    //先行
    'loginModule',
    //'indexModule',
    "adminModule",

    //首页 模块
    'homePage',
    //素材管理
    "materialManagement",
    //我的应用
    "myApplicationModule",
    "myApplicationSettingModule",
    //业务建模
    "businessModelingModule",
    //知识管理
    "knowledgeManagementModule",
    //测试功能
    'functionalTestModule',
    //应用分析
    'applAnalysisModule',
    //深度学习
    'deepLearning'
]);

/**
 * 配置 localStorageServiceProvider
 */
knowledge_static_web.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('know');
    localStorageServiceProvider.setNotify(true, true);
});

/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
knowledge_static_web.run(function ($rootScope, $state, $stateParams, $location, AuthService, AUTH_EVENTS,localStorageService,$window) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //监听路由的变化，一旦发生变化校验用户登录情况
    $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams) {

    });

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {

    });
    //back button function called from back button's ng-click="back()"
    $rootScope.back = function () {//实现返回的函数
        $state.go($rootScope.previousState_name, $rootScope.previousState_params);
    };
});

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由，为了实现路由的多层嵌套
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
knowledge_static_web
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise(function($injector, $location){
            $location.path('/login');
        });
        $stateProvider
        //登录路由
            .state("login", {
                url: "/login",
                templateUrl: 'static/login/login.html',
                controller: "loginController"
            })
            // 首页路由
            .state("homePage", {
                    url: "/homePage",
                    templateUrl: 'static/home/homePage.html',
                    controller: "homePageController"
            })

            .state("homePage.define", {
                url: "/define",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/home/homePageContent.html',
                        controller: "homePageContentController"
                    }
                }
            })
            //业务建模---框架库
            .state("frameworkLibrary.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("frameworkLibrary", {
                url: "/frameworkLibrary",
                templateUrl: 'static/businessModeling/frameworkLibrary.html',
                controller:"frameworkLibraryController"
            })
            //业务建模---框架库--faq框架新增
            .state("faqNewFrame.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("faqNewFrame", {
                url: "/faqNewFrame",
                templateUrl: 'static/businessModeling/faqNewFrame.html',
                controller:"faqNewFrameController"
            })
            //业务建模---框架库--要素框架新增
            .state("factorNewFrame.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("factorNewFrame", {
                url: "/factorNewFrame",
                templateUrl: 'static/businessModeling/factorNewFrame.html',
                controller:"factorNewFrameController"
            })
            //业务建模---概念管理
            .state("conceptManage", {
                url: "/conceptManage",
                templateUrl: 'static/businessModeling/conceptManage.html',
                controller:"businessModelingController"
            })
            .state("conceptManage.synony", {
                url: "/synony",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/synony/synonyConceptManage.html',
                        controller: "synonyConceptManageController"
                    },
                }
            })
            .state("conceptManage.aggregate", {
                url: "/aggregate",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/aggregate/aggregateConceptManage.html',
                        controller: "aggregateConceptManageController"
                    },
                }
            })
            .state("conceptManage.business", {
                url: "/business",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/business/businessConceptManage.html',
                        controller: "businessConceptManageController"
                    },
                }
            })
            .state("conceptManage.sensitive", {
                url: "/sensitive",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/sensitive/sensitiveConceptManage.html',
                        controller: "sensitiveConceptManageController"
                    },
                }
            })
            .state("conceptManage.errorCorrection", {
                url: "/errorCorrection",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/errorCorrection/errorCorrectionConceptManage.html',
                        controller: "errorCorrectionConceptManageController"
                    },
                }
            })
            .state("conceptManage.disable", {
                url: "/disable",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/disable/disableConceptManage.html',
                        controller: "disableConceptManageController"
                    },
                }
            })
            .state("conceptManage.sentiment", {
                url: "/sentiment",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/sentiment/sentimentConceptManage.html',
                        controller: "sentimentConceptManageController"
                    },
                }
            })
            .state("conceptManage.intention", {
                url: "/intention",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/intention/intentionConceptManage.html',
                        controller: "intentionConceptManageController"
                    },
                }
            })
            .state("conceptManage.bot", {
                url: "/bot",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/bot/botConceptManage.html',
                        controller: "botConceptManageController"
                    },
                }
            })
            .state("conceptManage.semanticExpression", {
                url: "/semanticExpression",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/businessModeling/semanticExpression/semanticExpressionConceptManage.html',
                        controller: "semanticExpressionConceptManageController"
                    },
                }
            })
            // 我的应用myApplication
            .state("myApplication", {
                url: "/myApplication/:userPermission",
                templateUrl: 'static/myApplication/myApplication.html',
                controller: "myApplicationController"
            })

            .state("setting", {
                url: "/setting",
                templateUrl: 'static/myApplication/setting.html',
                controller:"myApplicationSettingController"
            })
            .state("setting.robot", {
                url: "/robot",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/settingContent.html',
                        controller: "robotSettingController"
                    },
                }
            })
            .state("setting.parameter", {
                url: "/parameter",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/parameterSetting.html',
                        controller: "robotSettingController"
                    },
                }
            })
            .state("setting.chatPageConfig", {
                url: "/chatPageConfig",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/chatPageConfig.html',
                        controller: "chatPageConfigController"
                    },
                }
            })
            .state("setting.sceneManage", {
                url: "/sceneManage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/sceneManage.html',
                        controller: "sceneManageController"
                    },
                }
            })
            .state("setting.dimension", {
                url: "/dimension",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/dimensionManage.html',
                        controller: "dimensionManageController"
                    },
                }
            })
            .state("setting.channel", {
                url: "/channel",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/channelManage.html',
                        controller: "channelManageController"
                    },
                }
            })
            .state("setting.association", {
                url: "/association",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationConfig/AssociationManage.html',
                        controller: "AssociationManageController"
                    },
                }
            })
            //应用信息
            .state("setting.Infor", {
                url: "/Infor",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationInfor/applicationInfor.html',
                        controller: "applicationInforController"
                    },
                }
            })
            //应用开发-业务建模
            .state("relationalCatalog", {
                url: "/relationalCatalog",
                templateUrl: 'static/myApplication/applicationDevelopment/relationalCatalog.html',
                controller:"relationalCatalogController"
            })
            .state("relationalCatalog.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("botApply.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("botApply", {
                url: "/botApply",
                templateUrl: 'static/myApplication/applicationDevelopment/botApply.html',
                controller:"botApplyController"
            })

            //应用发布
            .state("setting.releaseMan", {
                url: "/releaseMan",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationRelease/ReleaseManage.html',
                        controller: "serviceReleaseController"
                    },
                }
            })
            .state("setting.newService", {
                url: "/newService/:serviceId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationRelease/NewServiceRelease.html',
                        controller: "newServiceReleaseController"
                    },
                }
            })
            .state("setting.nodeMan", {
                url: "/nodeMan",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/myApplication/applicationRelease/NodeManage.html',
                        controller: "nodeManageController"
                    },
                }
            })
            //深度学习
            .state("deepLearning", {
                url: "/deepLearning",
                templateUrl: 'static/deepLearning/deepLearning.html',
            })
            .state("deepLearning.dataAcquisition", {
                url: "/dataAcquisition",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/deepLearning/dataAcquisition.html',
                        controller: "dataAcquisitionController"
                    }
                }
            })
            .state("deepLearning.acquisitionDetails", {
                url: "/acquisitionDetails/:crawlRecordId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/deepLearning/acquisitionDetails.html',
                        controller: "acquisitionDetailsController"
                    }
                }
            })
            .state("deepLearning.similarityCalculation", {
                url: "/similarityCalculation",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/deepLearning/similarityCalculation.html',
                        controller: "similarityCalculationController"
                    }
                }
            })
            .state("deepLearning.deepLearningCon", {
                url: "/deepLearningCon",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/deepLearning/deepLearningCon.html',
                        controller: "deepLearningConController"
                    }
                }
            })
            .state("deepLearning.deeplearnConfig", {
                url: "/deeplearnConfig",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/deepLearning/deeplearnConfig.html',
                        controller: "deeplearnConfigController"
                    }
                }
            })
            //深度学习end
            //materialManagement
            .state("materialManagement", {
                url: "/materialManagement/:userPermission",
                templateUrl: 'static/materialManagement/materialManagement.html',
                controller: "adminController"
            })

            .state("materialManagement.chatKnowledgeBase", {
                url: "/chatKnowledgeBase/:userPermission",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/chatKnowledgeBase.html',
                        controller: "chatKnowledgeBaseController"
                    }
                }
            })
            .state("materialManagement.chatKnowledgeBasePreview", {
                url: "/chatKnowledgeBasePreview/:scanData/:id",
                //cache:'true',
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/chatKnowledgeBasePreview.html',
                        controller: "chatKnowledgeBasePreController"
                    }
                }
            })
            .state("materialManagement.faqChat", {
                url: "/faqChat/:scanDataList",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/faqChat.html',
                        controller: "faqChatController"
                    }
                }
            })
            .state("materialManagement.conceptChat", {
                url: "/conceptChat/:scanDataList",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/conceptChat.html',
                        controller: "conceptChatController"
                    }
                }
            })
            //语音库
            .state("materialManagement.speechLibrary", {
                url: "/speechLibrary",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/speechLibrary/speechLibrary.html',
                        controller: "speechLibraryController"
                    }
                }
            })
            //图片库
            .state("materialManagement.pictureLibrary", {
                url: "/pictureLibrary",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/materialManagement/pictureLibrary/pictureLibrary.html',
                        controller: "pictureLibraryController"
                    }
                }
            })
            //知识管理knowledgeManagement
            .state("knowledgeManagement", {
                url: "/knowledgeManagement",
                templateUrl: 'static/knowledgeManagement/knowledgeManagement.html',
                controller: "knowledgeManagementController"

            })

            //客服知識總覽
            .state("knowledgeManagement.custOverview", {
                url: "/custOverview",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/knowOverview/custOverview.html',
                        controller: "custOverviewController"
                    }
                }
            })
            //客服知識預覽
            .state("knowledgeManagement.custPreview", {
                url: "/custPreview/:knowledgeId/:knowledgeType",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/knowOverview/custPreview.html',
                        controller: "custPreviewController"
                    }
                }
            })
            //營銷知識總覽
            .state("knowledgeManagement.markOverview", {
                url: "/markOverview",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/knowOverview/markOverview.html',
                        controller: "markOverviewController"
                    }
                }
            })
            //營銷知識預覽
            .state("knowledgeManagement.markPreview", {
                url: "/markPreview/:knowledgeId/:knowledgeType",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/knowOverview/markPreview.html',
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
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/concept/knowledgeSingleAddConcept.html',
                        controller: "conceptController"
                    }
                }
            })
            //营销场景-概念新增
            .state("knowledgeManagement.conceptAdd", {
                url: "/ConceptAdd/:data/:knowledgeTitle",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/marking_concept/newConcept.html',
                        controller: "newConceptController"
                    }
                }
            })
            .state("knowledgeManagement.faqAdd", {
                url: "/faqAdd/:data/:knowledgeTitle",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/faq/knowManaFaq.html',
                        controller: "knowManaFaqController"
                    }
                }
            })
            .state("knowledgeManagement.listAdd", {
                url: "/listAdd/:data/:knowledgeTitle",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/list/knowManaList.html',
                        controller: "knowManaListController"
                    }
                }
            })
            .state("knowledgeManagement.factorAdd", {
                url: "/factorAdd/:data/:knowledgeTitle",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/factor/factor.html',
                        controller: "knowledgeEssentialController"
                    }
                }
            })
            .state("knowledgeManagement.markKnow", {
                url: "/markKnow/:data/:knowledgeTitle",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/markKnow/markKnow.html',
                        controller: "markKnowController"
                    }
                }
            })
            // //批量知识新增
            .state("knowledgeManagement.knowBatchAdditions", {
                url: "/knowBatchAdditions",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/batchAdditions/knowBatchAdditions.html',
                        controller: "knowBatchAdditionsController"
                    }
                }
            })
            // 历史查看
            .state("knowledgeManagement.historyView", {
                url: "/historyView",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/historyView/historyView.html',
                        controller: "historyViewController"
                    }
                }
            })

            //知識預覽
            .state("knowledgeManagement.knowledgeScan", {
                url: "/knowledgeScan/:knowledgeScan",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/knowledgeManagement/public-html/knowledgeScan.html',
                        controller: "knowledgeScanController"
                    }
                }
            })
            //    -------------------------
            //测试功能
            .state("functionalTest", {
                url: "/functionalTest",
                templateUrl: 'static/functionalTesting/functionalTest.html',
                controller: "functionalTestController"

            })
            .state("functionalTest.questionTest", {
                url: "/questionTest",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/functionalTesting/questionTest.html',
                        controller: "questionTestController"
                    }
                }
            })
            .state("functionalTest.sessionTest", {
                url: "/sessionTest",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/functionalTesting/sessionTest.html',
                        controller: "sessionTestController"
                    }
                }
            })
            .state("functionalTest.batchTest", {
                url: "/batchTest",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/functionalTesting/batchTest.html',
                        controller: "batchTestController"
                    }
                }
            })
            .state("functionalTest.testResult", {
                    url: "/testResult/:batchNumberId",
                    views: {
                        'header': {
                            templateUrl: 'static/home/homePageNav.html',
                            controller: "homePageNavController"
                        },
                        'content': {
                            templateUrl: 'static/functionalTesting/testResult.html',
                            controller: "testResultController"
                            }
                        }
            })
            .state("functionalTest.viewDetails", {
                url: "/viewDetails/:batchNumberId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/functionalTesting/viewDetails.html',
                        controller: "viewDetailsController"
                    }
                }
            })
            //-----------------------
            //应用分析
            .state("applAnalysis", {
                url: "/applAnalysis",
                templateUrl: 'static/applicationAnalysis/applAnalysis.html',
                controller: "applAnalysisController"

            })
            .state("applAnalysis.sessionDetails", {
                url: "/sessionDetails",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/sessionDetails.html',
                        controller: "sessionDetailsController"
                    }
                }
            })
            .state("applAnalysis.satisfactionDegree", {
                url: "/satisfactionDegree",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/satisfactionDegree.html',
                        controller: "satisfactionDegreeController"
                    }
                }
            })
            //7.11-add
            .state("applAnalysis.accessStatistics", {
                url: "/accessStatistics",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/accessStatistics.html',
                        controller: "accessStatisticsController"
                    }
                }
            })
            .state("applAnalysis.knowledgeRanking", {
                url: "/knowledgeRanking",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/knowledgeRanking.html',
                        controller: "knowledgeRankingController"
                    }
                }
            })
            .state("applAnalysis.resolutionStatistics", {
                url: "/resolutionStatistics",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/resolutionStatistics.html',
                        controller: "resolutionStatisticsController"
                    }
                }
            })
            .state("applAnalysis.reinforcementLearn", {
                url: "/reinforcementLearn",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/applicationAnalysis/reinforcementLearn.html',
                        controller: "reinforcementLearnController"
                    }
                }
            })
            .state("applAnalysis.newKnowledgeDiscoveryLearn", {
                url: "/newKnowledgeDiscoveryLearn",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/applicationAnalysis/newKnowledgeDiscoveryLearn.html',
                        controller: "newKnowledgeDiscoveryLearnController"
                    }
                }
            })
            .state("applAnalysis.operationLog", {
                url: "/operationLog",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/operationLog.html',
                        controller: "operationLogController"
                    }
                }
            })
            .state("applAnalysis.sessionLog", {
                url: "/sessionLog",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/applicationAnalysis/sessionLog.html',
                        controller: "sessionLogController"
                    }
                }
            })
            //-----------------------

            //我的应用admin

            .state("admin", {
                url: "/admin",
                templateUrl: 'static/admin/admin.html',
                controller: "adminController"
            })
            .state("admin.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/admin/adminContent.html',
                        controller: "adminContentController"
                    },
                }

            })
            //用户管理
            .state("admin.userManage", {
                url: "/userManage",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'static/admin/userManage.html',
                        controller: "userManageController"
                    },
                }
            })

            //知识接入
            //任务分析
            .state("back", {
                url: "/back",
                templateUrl: 'static/knowledgeManagement/document_know_process/main.html',
                controller: "backController"
            })
            .state("back.gateway", {
                url: "/gateway/:isGo/:knowDocId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {

                        templateUrl: 'static/knowledgeManagement/document_know_process/main_container.html',
                        controller: "analyseTaskController"
                    }
                }
            })
            .state("back.doc_results_view", {
                url: "/doc_results_view/:isGo/:knowDocId/:knowDocCreateTime/:knowDocUserName",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'static/knowledgeManagement/document_know_process/doc_results_view.html',
                        controller: "doc_results_viewController"
                    }
                }
            })
            //模板管理
            .state("back.template", {
                url: "/gateway/template",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'static/knowledgeManagement/document_know_process/main_template_container.html',
                        controller: "temController"
                    }
                }
            })
            //创建模板
            .state("back.createTemplate", {
                url: "/gateway/create_template/:isGo/:temId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'static/knowledgeManagement/document_know_process/main_create_template_container.html',
                        controller: "createTemController"
                    }
                }
            })
            //规则抽取
            .state("back.docselect", {
                url: "/doc_select/:temId/:level/:roleId",
                views: {
                    'header': {
                        templateUrl: 'static/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'static/knowledgeManagement/document_know_process/doc_select.html',
                        controller: "docSelectController"
                    }
                }
            })

    }]);
    knowledge_static_web.config(function ($httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });