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
    //前台模块
    'loginModule',
    'indexModule',
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
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("frameworkLibrary", {
                //params:{"userPermission" : null},
                url: "/frameworkLibrary",
                templateUrl: 'know_index/businessModeling/frameworkLibrary.html',
                controller:"frameworkLibraryController"
            })
            //业务建模---框架库--faq框架新增
            .state("faqNewFrame.manage", {
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("faqNewFrame", {
                //params:{"userPermission" : null},
                url: "/faqNewFrame",
                templateUrl: 'know_index/businessModeling/faqNewFrame.html',
                controller:"faqNewFrameController"
            })
            //业务建模---框架库--要素框架新增
            .state("factorNewFrame.manage", {
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("factorNewFrame", {
                //params:{"userPermission" : null},
                url: "/factorNewFrame",
                templateUrl: 'know_index/businessModeling/factorNewFrame.html',
                controller:"factorNewFrameController"
            })

            //业务建模---概念管理
            .state("conceptManage", {
                //params:{"userPermission" : null},
                url: "/conceptManage",
                templateUrl: 'know_index/businessModeling/conceptManage.html',
                controller:"businessModelingController"
            })
            .state("conceptManage.synony", {
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
            .state("conceptManage.emotion", {
                //params:{"userPermission" : null},
                url: "/emotion",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/businessModeling/emotion/emotionConceptManage.html',
                        controller: "emotionConceptManageController"
                    },
                }
            })
            .state("conceptManage.intention", {
                //params:{"userPermission" : null},
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
            // 我的应用myApplication
            .state("myApplication", {
                params:{"userPermission" : null},
                url: "/myApplication",
                templateUrl: 'know_index/myApplication/myApplication.html',
                controller: "myApplicationController"
            })

            //.state("myApplication.manage", {
            //    params:{"userPermission" : null},
            //    url: "/manage",
            //    views: {
            //        'header': {
            //            templateUrl: 'know_index/home/homePageNav.html',
            //            controller: "homePageNavController"
            //        },
            //        'content': {
            //            templateUrl: 'know_index/myApplication/adminContent.html',
            //            controller: "adminContentController"
            //        }
            //    }
            //})
            .state("setting", {
                //params:{"userPermission" : null},
                url: "/setting",
                templateUrl: 'know_index/myApplication/setting.html',
                controller:"myApplicationSettingController"
            })
            .state("setting.robot", {
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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
                //params:{"userPermission" : null},
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

            .state("relationalCatalog.manage", {
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("relationalCatalog", {
                //params:{"userPermission" : null},
                url: "/relationalCatalog",
                templateUrl: 'know_index/myApplication/applicationDevelopment/relationalCatalog.html',
                controller:"relationalCatalogController"
            })
            
            .state("botApply.manage", {
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            .state("botApply", {
                //params:{"userPermission" : null},
                url: "/botApply",
                templateUrl: 'know_index/myApplication/applicationDevelopment/botApply.html',
                controller:"botApplyController"
            })
            //应用开发-知识管理-客服场景知识总览
            .state("custServScenaOverview", {
                //params:{"userPermission" : null},
                url: "/custServScenaOverview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/custServScenaOverview.html',
                controller:"custServScenaOverviewController"
            })
            .state("custServScenaOverview.manage", {
                //params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                }
            })
            //应用开发-知识管理-营销场景知识总览
            .state("markServScenaOverview", {
                //params:{"userPermission" : null},
                url: "/markServScenaOverview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/markServScenaOverview.html',
                controller:"markServScenaOverviewController"
            })
            .state("markServScenaOverview.manage", {
                //params:{"userPermission" : null},
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
                params:{"scanKnowledge" : null},
                url: "/markKnowledgePreview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/markKnowledgePreview.html',
                controller:"markKnowledgePreviewController"
            })
            .state("markKnowledgePreview.manage", {
                params:{"scanKnowledge" : null},
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
                params:{"scanKnowledge" : null},
                url: "/custKnowledgePreview",
                templateUrl: 'know_index/myApplication/applicationDevelopment/custKnowledgePreview.html',
                controller:"custKnowledgePreviewController"
            })
            .state("custKnowledgePreview.manage", {
                params:{"scanKnowledge" : null},
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
                //params:{"userPermission" : null},
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
                params:{"serviceId" : null},
                url: "/newService",
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
                //params:{"userPermission" : null},
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
                params:{"userPermission" : null},
                url: "/materialManagement",
                templateUrl: 'know_index/materialManagement/materialManagement.html',
                controller: "adminController"
            })

            .state("materialManagement.chatKnowledgeBase", {
                params:{"userPermission" : null},
                url: "/chatKnowledgeBase",
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
            //.state("materialManagement.chatKnowledgeScan", {
            //    params:{"chatKnowledgeId" : null},
            //    url: "/chatKnowledgeScan",
            //    views: {
            //        'header': {
            //            templateUrl: 'know_index/home/homePageNav.html',
            //            controller: "homePageNavController"
            //        },
            //        'content': {
            //            templateUrl: 'know_index/materialManagement/chatKnowledgeScan.html',
            //            controller: "chatKnowledgeScanController"
            //        }
            //    }
            //})
            .state("materialManagement.chatKnowledgeBasePreview", {
                params:{"scanData" : null,"id":null},
                url: "/chatKnowledgeBasePreview",
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
                params:{"scanDataList" : null},
                url: "/faqChat",
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
                params:{"scanDataList" : null},
                url: "/conceptChat",
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
                url: "/singleAddConcept",
                params : {data : null},
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
                url: "/ConceptAdd",
                params : {data : null},
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
            ////客服場景
            //.state("knowledgeManagement.customKnowledge", {
            //    url: "/customKnowledge",
            //    params : {data : null},
            //    views: {
            //        'header': {
            //            templateUrl: 'know_index/home/homePageNav.html',
            //            controller: "homePageNavController"
            //        },
            //        'content': {
            //            templateUrl: 'know_index/knowledgeManagement/customKnowledge/customKnowledge.html',
            //            controller: "customKnowledge"
            //        }
            //    }
            //})
            .state("knowledgeManagement.faqAdd", {
                url: "/faqAdd",
                params : {data : null},
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
                url: "/listAdd",
                params : {data : null},
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
                url: "/factorAdd",
                params : {data : null},
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
            //知識預覽
            .state("knowledgeManagement.knowledgeScan", {
                url: "/knowledgeScan",
                params : {knowledgeScan : null},
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

            //我的应用myApplication

            //.state("myApplication", {
            //    url: "/myApplication",
            //    templateUrl: 'know_index/myApplication/myApplication.html',
            //    controller: "myApplicationController"
            //})
            //.state("myApplication.robot", {
            //    url: "/robot",
            //    views: {
            //        'myApplicationHeader': {
            //            templateUrl: 'know_index/myApplication/myApplicationHeader.html',
            //            //controller: "myApplicationController"
            //        },
            //        'myApplicationContent': {
            //            templateUrl: 'know_index/home/chatKnowledgeBase.html',
            //            //controller: "homePageNavController"
            //        },
            //        //'myApplicationSidebar': {
            //        //    templateUrl: 'know_index/home/chatKnowledgeBase.html',
            //        //    //controller: "homePageNavController"
            //        //}
            //    }
            //
            //})




            //初始页
            .state("index", {
                url: "/index",
                templateUrl: 'know_index/index/main.html',
                controller: "indexController"
            })

            //知识接入
            //任务分析
            .state("back", {
                url: "/back",
                templateUrl: 'know_background/back/main.html',
                controller: "backController"
            })
            .state("back.gateway", {
                url: "/gateway",
                params: {
                    isGo: null,
                    knowDocId: null
                },
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
                url: "/doc_results_view",
                params: {
                    isGo: null,
                    knowDocId: null,
                    knowDocCreateTime: null,
                    knowDocUserName: null
                },
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
            //文档列表
            .state("back.doclist", {
                url: "/gateway/doclist",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        controller: "homePageNavController"
                    },
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_doclist_container.html',
                        controller: "knowGatewayController"
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
                url: "/gateway/create_template",
                params: {
                    isGo: null,
                    temId : null
                },
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
    //不起作用
    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    // Override $http service's default transformRequest
    // $httpProvider.defaults.transformRequest = [function (data) {
    //     /**
    //      * The workhorse; converts an object to x-www-form-urlencoded serialization.
    //      * @param {Object} obj
    //      * @return {String}
    //      */
    //     var param = function (obj) {
    //         var query = '';
    //         var name, value, fullSubName, subName, subValue, innerObj, i;
    //
    //         for (name in obj) {
    //             value = obj[name];
    //             // if (isNaN(value) && (!value || value == null)){
    //             //     break;
    //             // }
    //             if (value instanceof Array) {
    //                 for (i = 0; i < value.length; ++i) {
    //                     subValue = value[i];
    //                     fullSubName = name + '[' + i + ']';
    //                     innerObj = {};
    //                     innerObj[fullSubName] = subValue;
    //                     query += param(innerObj) + '&';
    //                 }
    //             } else if (value instanceof Object) {
    //                 for (subName in value) {
    //                     subValue = value[subName];
    //                     fullSubName = name + '[' + subName + ']';
    //                     innerObj = {};
    //                     innerObj[fullSubName] = subValue;
    //                     query += param(innerObj) + '&';
    //                 }
    //             } else if (value !== undefined && value !== null) {
    //                 query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    //             }
    //         }
    //         return query.length ? query.substr(0, query.length - 1) : query;
    //     };
    //     return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    // }];

    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);

    
});