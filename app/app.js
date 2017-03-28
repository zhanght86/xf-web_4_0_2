'use strict';
/**
 * Main module of the application.
 */
var knowledge_static_web = angular.module('knowledge_static_web', [
    //公共模块
    'ui.router',
    //"ui.bootstrap",
    'ngDialog',
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

    //首页 模块
    'homePage',
    //素材管理
    "materialManagement",
    //我的应用
    "myApplicationModule",
    "myApplicationSettingModule",

    //知识管理
    "knowledgeManagementModule",

    'pagination',
    'knowDetailsModule',
    'angularFileUpload',
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
            $location.path('/homePage');
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
                        //controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/home/homePageContent.html',
                        //controller: "homePageNavController"
                    }
                }
            })
            // 我的应用myApplication
            .state("myApplication", {
                params:{"userPermission" : null},
                url: "/myApplication",
                templateUrl: 'know_index/myApplication/myApplication.html',
                controller: "myApplicationController"
            })

            .state("myApplication.manage", {
                params:{"userPermission" : null},
                url: "/manage",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        //controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/adminContent.html',
                        controller: "adminContentController"
                    }
                }
            })
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
                    },
                    'content': {
                        templateUrl: 'know_index/myApplication/settingContent.html',
                        //controller: "adminContentController"
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
                url: "/materialManagement/chatKnowledgeBase",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        //controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/materialManagement/chatKnowledgeBase.html',
                        controller: "chatKnowledgeBaseController"
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
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        //controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/knowledgeSingleAddConcept.html',
                        controller: "knowledgeSingleAddConceptController"
                    }
                }
            })            
            .state("knowledgeManagement.faqAdd", {
                url: "/faqAdd",
                views: {
                    'header': {
                        templateUrl: 'know_index/home/homePageNav.html',
                        //controller: "homePageNavController"
                    },
                    'content': {
                        templateUrl: 'know_index/knowledgeManagement/knowledgeManagementFaq.html',
                        controller: "knowledgeManagementFaqController"
                    }
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
                    isGo: null
                },
                views: {
                    'main_container': {
                        templateUrl: 'know_background/know_gateway/main_container.html',
                        controller: "analyseTaskController"
                    }
                }
            })
            //文档列表
            .state("back.doclist", {
                url: "/gateway/doclist",
                views: {
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