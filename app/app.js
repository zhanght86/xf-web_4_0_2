'use strict';
/**
 * Main module of the application.
 */
var knowledge_static_web = angular.module('knowledge_static_web', [
    //公共模块
    //'ui.autocomplete',
    'ui.router',
    //"ui.bootstrap",
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

    'pagination',
    'knowDetailsModule',
    //上傳功能
    'angularFileUpload',
    //测试功能
    'functionalTestModule',
    //应用分析
    'applAnalysisModule',

    //后台模块
    'backModule',
    'knowGatewayModule'
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
        
        // var privileges =  localStorageService.get('privileges');
        // if (next.url != '/login') {
        //     localStorageService.set('targetUrl',next.name);
        //     if (!AuthService.isAuthorized(privileges,next.name)) {
        //
        //         event.preventDefault();
        //         if (AuthService.isAuthenticated()) {
        //             // user is not allowed
        //             $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,{fromState:fromState});
        //         } else {
        //             // user is not logged in
        //             $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        //         }
        //         //$location.path('/login');
        //     }else{
        //         var targetUrl = localStorageService.get('targetUrl');
        //         localStorageService.remove('targetUrl');
        //         // if(targetUrl && privileges.indexOf(targetUrl)!= -1){
        //         //     //$state.go(targetUrl);
        //         //     //$location.path(targetUrl);
        //         // }
        //         // else{
        //         //     $state.go($window.location.reload());
        //         //     //$window.location.reload();
        //         // }
        //     }
        // }
    });

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        // console.log(fromState)
        // to be used for back button //won't work when page is reloaded.
        //$rootScope.previousState_name = fromState.name;
        //$rootScope.previousState_params = fromParams;
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
                templateUrl: 'know_index/login/login.html',
                controller: "loginController"
            })
            // 首页路由
            .state("homePage", {
                    url: "/homePage",
                    templateUrl: 'know_index/home/homePage.html',
                    controller: "homePageController"
            })

            .state("homePage.define", {
                url: "/define",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/home/homePageContent.html',
                        controller: "homePageContentController"
                    }
                }
            })
            //业务建模---框架库
            .state("frameworkLibrary.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("frameworkLibrary", {
                url: "/frameworkLibrary",
                templateUrl: 'know_index/businessModeling/frameworkLibrary.html',
                controller:"frameworkLibraryController"
            })
            //业务建模---框架库--faq框架新增
            .state("faqNewFrame.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("faqNewFrame", {
                url: "/faqNewFrame",
                templateUrl: 'know_index/businessModeling/faqNewFrame.html',
                controller:"faqNewFrameController"
            })
            //业务建模---框架库--要素框架新增
            .state("factorNewFrame.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("factorNewFrame", {
                url: "/factorNewFrame",
                templateUrl: 'know_index/businessModeling/factorNewFrame.html',
                controller:"factorNewFrameController"
            })
            //业务建模---概念管理
            .state("conceptManage", {
                url: "/conceptManage",
                templateUrl: 'know_index/businessModeling/conceptManage.html',
                controller:"businessModelingController"
            })
            .state("conceptManage.synony", {
                url: "/synony",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/synony/synonyConceptManage.html',
                        controller: "synonyConceptManageController"
                    },
                }
            })
            .state("conceptManage.aggregate", {
                url: "/aggregate",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/aggregate/aggregateConceptManage.html',
                        controller: "aggregateConceptManageController"
                    },
                }
            })
            .state("conceptManage.business", {
                url: "/business",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/business/businessConceptManage.html',
                        controller: "businessConceptManageController"
                    },
                }
            })
            .state("conceptManage.sensitive", {
                url: "/sensitive",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/sensitive/sensitiveConceptManage.html',
                        controller: "sensitiveConceptManageController"
                    },
                }
            })
            .state("conceptManage.errorCorrection", {
                url: "/errorCorrection",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/errorCorrection/errorCorrectionConceptManage.html',
                        controller: "errorCorrectionConceptManageController"
                    },
                }
            })
            .state("conceptManage.disable", {
                url: "/disable",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/disable/disableConceptManage.html',
                        controller: "disableConceptManageController"
                    },
                }
            })
            .state("conceptManage.sentiment", {
                url: "/sentiment",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/sentiment/sentimentConceptManage.html',
                        controller: "sentimentConceptManageController"
                    },
                }
            })
            .state("conceptManage.intention", {
                url: "/intention",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/intention/intentionConceptManage.html',
                        controller: "intentionConceptManageController"
                    },
                }
            })
            .state("conceptManage.bot", {
                url: "/bot",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/bot/botConceptManage.html',
                        controller: "botConceptManageController"
                    },
                }
            })
            .state("conceptManage.semanticExpression", {
                url: "/semanticExpression",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/semanticExpression/semanticExpressionConceptManage.html',
                        controller: "semanticExpressionConceptManageController"
                    },
                }
            })
            // 我的应用myApplication
            .state("myApplication", {
                url: "/myApplication/:userPermission",
                templateUrl: 'know_index/myApplication/myApplication.html',
                controller: "myApplicationController"
            })

            .state("setting", {
                url: "/setting",
                templateUrl: 'know_index/myApplication/setting.html',
                controller:"myApplicationSettingController"
            })
            .state("setting.robot", {
                url: "/robot",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/settingContent.html',
                        controller: "robotSettingController"
                    },
                }
            })        
            .state("setting.parameter", {
                url: "/parameter",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/parameterSetting.html',
                        controller: "robotSettingController"
                    },
                }
            })
            .state("setting.chatPageConfig", {
                url: "/chatPageConfig",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/chatPageConfig.html',
                        controller: "chatPageConfigController"
                    },
                }
            })
            .state("setting.sceneManage", {
                url: "/sceneManage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/sceneManage.html',
                        controller: "sceneManageController"
                    },
                }
            })
            .state("setting.dimension", {
                url: "/dimension",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/dimensionManage.html',
                        controller: "dimensionManageController"
                    },
                }
            })
            .state("setting.channel", {
                url: "/channel",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/channelManage.html',
                        controller: "channelManageController"
                    },
                }
            })
            .state("setting.association", {
                url: "/association",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationConfig/AssociationManage.html',
                        controller: "AssociationManageController"
                    },
                }
            })
            //应用信息
            .state("setting.Infor", {
                url: "/Infor",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationInfor/applicationInfor.html',
                        controller: "applicationInforController"
                    },
                }
            })
            //应用开发-业务建模
            .state("relationalCatalog", {
                url: "/relationalCatalog",
                templateUrl: 'know_index/myApplication/applicationDevelopment/relationalCatalog.html',
                controller:"relationalCatalogController"
            })
            .state("relationalCatalog.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("botApply.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("botApply", {
                url: "/botApply",
                templateUrl: 'know_index/myApplication/applicationDevelopment/botApply.html',
                controller:"botApplyController"
            })
            //应用开发-知识管理-客服场景知识总览
            .state("custServScenaOverview", {
                url: "/custServScenaOverview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/custServScenaOverview.html',
                controller:"custServScenaOverviewController"
            })
            .state("custServScenaOverview.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    }
                }
            })
            //应用开发-知识管理-营销场景知识总览
            .state("markServScenaOverview", {
                url: "/markServScenaOverview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/markServScenaOverview.html',
                controller:"markServScenaOverviewController"
            })
            .state("markServScenaOverview.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            //应用开发-知识管理-营销知识预览
            .state("markKnowledgePreview", {
                url: "/markKnowledgePreview/:scanKnowledge",
                templateUrl: 'know_index/myApplication/applicationDevelopment/markKnowledgePreview.html',
                controller:"markKnowledgePreviewController"
            })
            .state("markKnowledgePreview.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })

            //应用开发-知识管理-客服知识预览
            .state("custKnowledgePreview", {
                url: "/custKnowledgePreview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/custKnowledgePreview.html',
                controller:"custKnowledgePreviewController"
            })
            .state("custKnowledgePreview.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })

            //应用发布
            .state("setting.releaseMan", {
                url: "/releaseMan",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationRelease/ReleaseManage.html',
                        controller: "serviceReleaseController"
                    },
                }
            })
            .state("setting.newService", {
                url: "/newService/:serviceId",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationRelease/NewServiceRelease.html',
                        controller: "newServiceReleaseController"
                    },
                }
            })
            .state("setting.nodeMan", {
                url: "/nodeMan",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/applicationRelease/NodeManage.html',
                        controller: "nodeManageController"
                    },
                }
            })

            //materialManagement
            .state("materialManagement", {
                url: "/materialManagement/:userPermission",
                templateUrl: 'know_index/materialManagement/materialManagement.html',
                controller: "adminController"
            })

            .state("materialManagement.chatKnowledgeBase", {
                url: "/chatKnowledgeBase/:userPermission",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/materialManagement/chatKnowledgeBase.html',
                        controller: "chatKnowledgeBaseController"
                    }
                }
            })
            .state("materialManagement.chatKnowledgeBasePreview", {
                url: "/chatKnowledgeBasePreview/:scanData/:id",
                //cache:'true',
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/materialManagement/chatKnowledgeBasePreview.html',
                        controller: "chatKnowledgeBasePreController"
                    }
                }
            })
            .state("materialManagement.faqChat", {
                url: "/faqChat/:scanDataList",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/materialManagement/faqChat.html',
                        controller: "faqChatController"
                    }
                }
            })
            .state("materialManagement.conceptChat", {
                url: "/conceptChat/:scanDataList",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/materialManagement/conceptChat.html',
                        controller: "conceptChatController"
                    }
                }
            })
            //知识管理knowledgeManagement
            .state("knowledgeManagement", {
                url: "/knowledgeManagement",
                templateUrl: 'know_index/knowledgeManagement/knowledgeManagement.html',
                controller: "knowledgeManagementController"

            })
            .state("knowledgeManagement.singleAddConcept", {
                url: "/singleAddConcept/:data",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/concept/knowledgeSingleAddConcept.html',
                        controller: "conceptController"
                    }
                }
            })
            //营销场景-概念新增
            .state("knowledgeManagement.conceptAdd", {
                url: "/ConceptAdd/:data",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/marking_concept/newConcept.html',
                        controller: "newConceptController"
                    }
                }
            })
            .state("knowledgeManagement.faqAdd", {
                url: "/faqAdd/:data",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/faq/knowManaFaq.html',
                        controller: "knowManaFaqController"
                    }
                }
            })
            .state("knowledgeManagement.listAdd", {
                url: "/listAdd/:data",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/list/knowManaList.html',
                        controller: "knowManaListController"
                    }
                }
            })
            .state("knowledgeManagement.factorAdd", {
                url: "/factorAdd/:data",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/factor/factor.html',
                        controller: "knowledgeEssentialController"
                    }
                }
            })
            // //批量知识新增
            .state("knowledgeManagement.knowBatchAdditions", {
                url: "/knowBatchAdditions",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/batchAdditions/knowBatchAdditions.html',
                        controller: "knowBatchAdditionsController"
                    }
                }
            })
            
            //知識預覽
            .state("knowledgeManagement.knowledgeScan", {
                url: "/knowledgeScan/:knowledgeScan",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/knowledgeScan.html',
                        controller: "knowledgeScanController"


                    }
                }
            })
            //    -------------------------
            //测试功能
            .state("functionalTest", {
                url: "/functionalTest",
                templateUrl: 'know_index/functionalTesting/functionalTest.html',
                controller: "functionalTestController"

            })
            .state("functionalTest.questionTest", {
                url: "/questionTest",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/functionalTesting/questionTest.html',
                        controller: "questionTestController"
                    }
                }
            })
            .state("functionalTest.sessionTest", {
                url: "/sessionTest",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/functionalTesting/sessionTest.html',
                        controller: "sessionTestController"
                    }
                }
            })
            .state("functionalTest.batchTest", {
                url: "/batchTest",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/functionalTesting/batchTest.html',
                        controller: "batchTestController"
                    }
                }
            })
            .state("functionalTest.testResult", {
                    url: "/testResult/:batchNumberId",
                    views: {
                        'header': {
                            templateUrl: 'know_index/home/homePageNav.html',
                            controller: "homePageNavController"
                        },
                        'content': {
                            templateUrl: 'know_index/functionalTesting/testResult.html',
                            controller: "testResultController"
                            }
                        }
            })
            .state("functionalTest.viewDetails", {
                url: "/viewDetails/:batchNumberId",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/functionalTesting/viewDetails.html',
                        controller: "viewDetailsController"
                    }
                }
            })
            //-----------------------
            //应用分析
            .state("applAnalysis", {
                url: "/applAnalysis",
                templateUrl: 'know_index/applicationAnalysis/applAnalysis.html',
                controller: "applAnalysisController"

            })
            .state("applAnalysis.sessionDetails", {
                url: "/sessionDetails",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/applicationAnalysis/sessionDetails.html',
                        controller: "sessionDetailsController"
                    }
                }
            })
            .state("applAnalysis.satisfactionDegree", {
                url: "/satisfactionDegree",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/applicationAnalysis/satisfactionDegree.html',
                        controller: "satisfactionDegreeController"
                    }
                }
            })

            //-----------------------

            //我的应用admin

            .state("admin", {
                url: "/admin",
                templateUrl: 'know_index/admin/admin.html',
                controller: "adminController"
            })
            .state("admin.manage", {
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/admin/adminContent.html',
                        controller: "adminContentController"
                    },
                    //'myApplicationSidebar': {
                    //    templateUrl: 'know_index/home/chatKnowledgeBase.html',
                    //    //controller: "homePageNavController"
                    //}
                }

            })
            //用户管理
            .state("admin.userManage", {
                url: "/userManage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/admin/userManage.html',
                        controller: "userManageController"
                    },
                }
            })

            //知识接入
            //任务分析
            .state("back", {
                url: "/back",
                templateUrl: 'know_background/back/main.html',
                controller: "backController"
            })
            .state("back.gateway", {
                url: "/gateway/:isGo/:knowDocId",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_container.html',
                        controller: "analyseTaskController"
                    }
                }
            })
            .state("back.doc_results_view", {
                url: "/doc_results_view/:isGo/:knowDocId/:knowDocCreateTime/:knowDocUserName",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/doc_results_view.html',
                        controller: "doc_results_viewController"
                    }
                }
            })
            //模板管理
            .state("back.template", {
                url: "/gateway/template",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_template_container.html',
                        controller: "temController"
                    }
                }
            })
            //创建模板
            .state("back.createTemplate", {
                url: "/gateway/create_template/:isGo/:temId",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_create_template_container.html',
                        controller: "createTemController"
                    }
                }
            })
            //规则抽取
            .state("back.docselect", {
                url: "/doc_select/:temId/:level/:roleId",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/doc_select.html',
                        controller: "docSelectController"
                    }
                }

                // templateUrl: 'know_background/know_gateway/doc_select.html',
                // controller: "docSelectController"
            })
            //适配器及接入
            .state("back.adapter", {
                url: "/gateway/adapter",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_adapter_container.html',
                        controller: "adapterController"
                    }
                }
            })
            //知识视图（后台）
            .state("back.know_view", {
                url: "/know_view/:knowDocId",
                views: {
                    'main_container': {
                        'header': {
                            templateUrl: 'know_index/home/homePageNav.html',
                            controller: "homePageNavController"
                        },
                        templateUrl: 'know_index/knowledge_details/main_know_view_container.html',
                        controller: "knowViewController"
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