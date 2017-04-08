'use strict';
// Source: app/know/base/auth/auth_constant.js
/**
 * Created by Administrator on 2016/6/3.
 * know constant 模块
 * 依赖 ngResource 模块
 */
angular.module('know.auth').constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'

})
;
;
// Source: app/know/base/auth/auth_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.auth').factory('AuthService', ['$resource', '$rootScope', '$location', 'Session', 'AUTH_EVENTS','localStorageService', function ($resource, $rootScope, $location, Session, AUTH_EVENTS,localStorageService) {

    var authService = {};
    var loginSuccessFunction = function (fun, result) {
        var data = result.data;
        Session.create(data.id);
        localStorageService.set('SessionId',data.id);
        localStorageService.set('privileges',data.privileges);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        fun(data);
    }

    var logoutSuccessFunction = function (fun, result) {
        var data = result.data;
        Session.destroy(data.id);
        localStorageService.clearAll();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        fun(data);
    }

    var authFun = $resource('/back/system/user/:action', {}, {
        login: {
            method: 'POST',
            params: {
                action: 'login'
            },
            isArray: false,
            responseType: 'json'
        },
        checkLoginStatus: {
            method: 'GET',
            params: {
                action: 'loadUser'
            },
            isArray: false,
            responseType: 'json'
        },
        logout: {
            method: 'POST',
            params: {
                action: 'logout'
            },
            isArray: false,
            responseType: 'json'
        },
    });

    authService.login = function (credentials, successFunction,failedFunction) {
        //console.log(credentials)
        authFun.login({
                loginName: credentials.loginName,
                loginPwd: credentials.loginPwd,
                randCheckCode: credentials.randCheckCode,
                rember: credentials.rememberUser
            },
            function (result, b, c) {
                if (result.status == '200') {
                    loginSuccessFunction(successFunction, result)
                    $location.path('/index/home');
                }else{
                    failedFunction(result.err);
                }
            },
            function (a, b, c) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            })
    };

    authService.logout = function (successFunction,failedFunction) {
        authFun.logout({},
            function (result, b, c) {
                if (result.status == '200') {
                    logoutSuccessFunction(successFunction, result)
                    $location.path('/login');
                }else{
                    failedFunction(result.err);
                }
            },
            function (a, b, c) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            })
    };

    authService.checkLoginStatus = function (credentials, fun) {
        authFun.checkLoginStatus({}, function (result, b, c) {
            if (result.status == '200') {
                loginSuccessFunction(fun,result)
            }
        }, function (a, b, c) {
            Session.destroy(data.id);
            localStorageService.clearAll();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        })
    };

    // authService.isAuthenticated = function () {
    //     var isAuthenticated = false;
    //     if(Session.userId)
    //         isAuthenticated = true;
    //     else {
    //         var sessionId = localStorageService.get('SessionId');
    //         if(sessionId)
    //             isAuthenticated = true;
    //     }
    //     return  isAuthenticated;
    // };

    // authService.isAuthorized = function (privileges,name) {
    //     //把路由传进来进行校验
    //     var isAuthorized = true;
    //     if(name != "" && name != null && name.indexOf("index") == -1 && name.indexOf("help") == -1){
    //         if(privileges.indexOf(name) == -1){
    //             isAuthorized = false;
    //         }
    //         if(!authService.isAuthenticated()){
    //             isAuthorized = false;
    //         }
    //     }
    //     return isAuthorized;
    // };
    return authService;
}])

angular.module('know.auth').factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        },
        request: function (config) {
            // 成功的请求方法
            var ts = '?^=' + new Date().getTime();
            if (config.url.indexOf('?') > 0)
                config.url = config.url.replace('?', ts + '&');
            else
                config.url = config.url + ts;
            return config; // 或者 $q.when(config);
        },
    };
});
// Source: app/know/base/auth/session_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.auth').service('Session', function () {
    this.create = function (userId) {
        this.userId = userId;
    };
    this.destroy = function () {
        this.userId = null;
    };
    return this;
});
;
// Source: app/know/home/home_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.home').factory('HomeService',['$resource',function ($resource) {
    var homeService = {};
    homeService.queryknowitem = $resource('pre/homepage/queryknowitem', {}, {});
    homeService.queryTopic = $resource('pre/Topic/queryTopic', {}, {});
    homeService.createComment = $resource('pre/Comment/createComment', {}, {});
    //知识条目点赞收藏
    homeService.agree = $resource('back/repository/knowlog/addLogForKnow', {}, {});
    homeService.collect = $resource('back/repository/knowlog/addLogForKnow', {}, {});
    //我的栏目
    homeService.queryMyCollect = $resource('pre/homepage/querymycollect', {}, {});
    homeService.queryMyTopKnow = $resource('pre/homepage/queryMyTopKnow', {}, {});

    homeService.queryknowitemrank = $resource('pre/homepage/queryknowitemrank', {}, {});
    homeService.queryknowitemhot = $resource('pre/homepage/queryknowitemhot', {}, {});

    homeService.queryUserOrderByPart = $resource('back/system/user/queryUserOrderByPart', {}, {});

    /**
     * 后台首页的方法
     */

    homeService.queryMyTask = $resource('/back/Workflow/queryUserTask', {}, {});


    return homeService;
}]);
// Source: app/know/index/check_click_filter.js
/**
 * Created by Administrator on 2016/6/6.
 * 过滤器 用来过滤头按钮的显示状态， 根据浏览器的路径判断当前该加亮哪一个按钮
 */
angular.
module('know').
filter('checkclick',['$location', function($location) {
    return function(item) {
            item.classtype = $location.absUrl().indexOf(item.url.split('.')[1]) > 0 ? "cur_li1" : "";
            return item.classtype;
    };
}]);
;
;
// Source: app/know/index/index_service.js
/**
 * Created by Administrator on 2016/6/3.
 * index 的service
 */
angular.module('know.index').factory('IndexService', ['$resource', function ($resource) {

    return $resource('privilege/:action', {}, {
        queryTopButtons: {
            method: 'GET',
            params: {action: 'getMenu'},
            isArray: false
        }
    });
}]);
;
// Source: app/know/know_doc/doc_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.knowdoc').factory('KnowDocService',['$resource',function ($resource) {
    var knowDocService = {};
    knowDocService.queryKnowDocList = $resource('/api/knowledgeDocumentation/queryDocumentation', {}, {});
    knowDocService.queryDetailByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    knowDocService.deleteKnowDoc = $resource('/api/knowledgeDocumentation/deleteDocumentation', {}, {});
    //knowDocService.singleImport = $resource('/back/knowaccess/docimport/docmanager/singleImport', {}, {});
    // knowDocService.queryAnalyseTask = $resource('/back/knowaccess//AnalyseTask/queryAnalyseTask', {}, {});
    // knowDocService.queryAnalyseTaskCount = $resource('/back/knowaccess/AnalyseTask/queryAnalyseTaskCount', {}, {});

    return knowDocService;
}]);
;
;
// Source: app/know/knowledge_detail/detail_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.detail').factory('DetailService',['$resource',function ($resource) {
    var detailService = {};
    detailService.getKnowledgeDetail = $resource('pre/KnowledgeDetail/getKnowledgeDetail', {}, {});
    detailService.queryCommentByKnowItem = $resource('pre/Comment/queryComment', {}, {});
    detailService.queryRequireByComment = $resource('pre/Comment/queryComment', {}, {});
    detailService.queryVersionByIdentity = $resource('pre/KnowledgeDetail/queryVersionByIdentity', {}, {});
    detailService.queryCompareKnowItem = $resource('pre/KnowledgeDetail/queryCompareKnowItem', {}, {});
    detailService.queryKnowItemsByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    detailService.queryKnowDocByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
    detailService.queryLinkKnowItems = $resource('pre/KnowledgeDetail/queryLinkKnowItems', {}, {});
    //查询知识条目
    detailService.queryKnowItem = $resource('pre/KnowledgeDetail/getKnowledgeDetail', {}, {});
    detailService.updateKnowItem = $resource('pre/KnowledgeDetail/editKnowItem', {}, {});
    //删除回复
    detailService.deleteComment = $resource('pre/Comment/deleteComment', {}, {});
    //发起流程
    detailService.startWorkflow = $resource('/back/Workflow/startWorkflow', {}, {});
    //查看知识条目的流程状态
    detailService.getProcessInstanceId = $resource('/back/Workflow/getProcessInstanceId', {}, {});

    return detailService;
}]);
;
// Source: app/know/knowledge_search/search_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.search').factory('SearchService',['$resource',function ($resource) {
    var searchService = {};
    searchService.connKnowQueryHistoryCon = $resource('pre/knowsquery/searchhistory', {}, {});
    searchService.connKnowQueryHotCon = $resource('pre/knowsquery/queryknowitemhot', {}, {});
    searchService.connKnowQueryAdvancedCon = $resource('pre/knowsquery/seniorsearch', {}, {});
    searchService.connKnowQueryLeadSearchCon = $resource('pre/knowsquery/leadsearch', {}, {});
    searchService.connKnowQueryAllLibraryCon = $resource('pre/knowsquery/queryAllLibrary', {}, {});
    searchService.connKnowQueryKnowOntoCon = $resource('/back/repository/library/queryLibClassify', {}, {});
    searchService.connKnowSaveSearchSettingCon = $resource('pre/knowsquery/searchset', {}, {});
    searchService.connQueryNewCon = $resource('pre/knowsquery/queryNewKeyWord', {}, {});
    searchService.connQueryLibOecTreeCon = $resource('/back/repository/library/queryLibFirstOrderClassify', {}, {});//查询oec分类树
    return searchService;
}])

/**
 * select2 内置查询功能
 */
// angular.module('know.search').factory('select2Query', function ($timeout) {
//     return {
//         testAJAX: function () {
//             var config = {
//                 minimumInputLength: 1,
//                 ajax: {
//                     url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
//                     dataType: 'jsonp',
//                     data: function (term) {
//                         return {
//                             q: term,
//                             page_limit: 10,
//                             apikey: "ju6z9mjyajq2djue3gbvv26t"
//                         };
//                     },
//                     results: function (data, page) {
//                         return {results: data.movies};
//                     }
//                 },
//                 formatResult: function (data) {
//                     return data.title;
//                 },
//                 formatSelection: function (data) {
//                     return data.title;
//                 }
//             };
//
//             return config;
//         }
//     }
// });;
;
// Source: app/know/personal_center/person_center_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.center').factory('PersonalCenterService',['$resource',function ($resource) {
    var personalCenterService = {};
    personalCenterService.connGetUserInfoCon = $resource('/back/system/user/loadUser', {}, {});
    personalCenterService.connGetOriginPwdCon = $resource('/back/system/user/queryUserPwd', {}, {});
    personalCenterService.connTestUploadMeMberCon = $resource('/back/system/user/testUploadMember', {}, {});
    personalCenterService.connConfirmPwdCon = $resource('/back/system/user/updatePwd', {}, {});
    personalCenterService.connKnowCheckNoticeCon = $resource('pre/checkNotice/notice/getCheckNotice', {}, {});
    personalCenterService.connKnowUpdateNoticeCon = $resource('pre/checkNotice/notice/updataNoticeStatus', {}, {});
    personalCenterService.connSubmitUserInfoCon = $resource('/back/system/user/updateUserInfo', {}, {});
    personalCenterService.connUpdataNoticeStatusCon = $resource('pre/checkNotice/notice/updataNoticeStatus', {}, {});
    personalCenterService.connExamNoticeCon = $resource('/back/exam/liveexam/informationtest', {}, {});
    personalCenterService.connShowExamDetailCon = $resource('/back/exam/liveexam/randomtest', {}, {});
    personalCenterService.connSaveExamPaperCon = $resource('/back/exam/liveexam/savetesTestinformation', {}, {});
    personalCenterService.connMycollectCon = $resource('/back/repository/knowlog/queryMyCollect', {}, {});
    personalCenterService.conndelecollectCon = $resource('/back/repository/knowlog/removeMyCollect', {}, {});
    personalCenterService.connMyCommentCon = $resource('/back/repository/knowlog/queryMyComment', {}, {});
    personalCenterService.connCommentMeCon = $resource('/back/repository/knowlog/queryCommentForMe', {}, {});
    personalCenterService.connMyQuestionCon = $resource('/back/repository/knowlog/queryMyQuestion', {}, {});
    personalCenterService.connMyAnswerCon = $resource('/back/repository/knowlog/queryMyAnswer', {}, {});
    personalCenterService.connColumnManagerCon = $resource('/pre/Topic/queryTopic', {}, {});
    personalCenterService.connAddFirstPageCon = $resource('/pre/Topic/addTopicToPage', {}, {});
    personalCenterService.connCancelTopicPageCon = $resource('/pre/Topic/cancelTopicPage', {}, {});
    personalCenterService.connDeleColumnCon = $resource('/pre/Topic/deleteTopic', {}, {});
    personalCenterService.connCreateColumnCon = $resource('/pre/Topic/createTopic', {}, {});
    return personalCenterService;
}]);
;
// Source: app/know/template/template_service.js
/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.template').factory('TemplateService',['$resource',function ($resource) {
    var templateService = {};
    templateService.queryTemplate = $resource('/api/template/queryTemplate', {}, {});
    templateService.deleteTemplate = $resource('/api/template/deleteTemplate', {}, {});
    templateService.queryRules = $resource('/api/templateRule/queryAllRule', {}, {});
    templateService.queryTemplateById = $resource('/api/template/queryTemplate', {}, {});
    templateService.generateRule = $resource('/api/templateRule/getJuniorText', {}, {});
    templateService.getSimilarText = $resource('/api/templateRule/getSimilarText', {}, {});
    templateService.optimizeText = $resource('/api/templateRule/optimizeText', {}, {});
    templateService.queryTemplateContent = $resource('/api/template/previewKnowDoc', {}, {});
    templateService.addWordRule = $resource('/api/templateRule/addWordRule', {}, {});
    templateService.checkTemName = $resource('/api/template/searchByTemplateName', {}, {});
    templateService.deleteRule = $resource('/api/templateRule/deleteWordRule', {}, {});
    templateService.queryRuleById = $resource('/api/templateRule/queryRuleById', {}, {});

    return templateService;
}]);
// Source: app/know_background/back/js/controller/back_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('backModule').controller('backController', [
    '$scope', '$location', "$interval", "$timeout", "$state",
    "IndexService", "AuthService",
    function ($scope, $location, $interval, $timeout, $state,
              IndexService , AuthService) {
        $state.go("back.gateway");
        // var self = this;
        // $scope.active = function(path){
        //     var url = $location.absUrl();
        //     return new RegExp(path).test(url)?'current':"";
        // };
        //
        // // $scope.activeBase = function(path){
        // //     var url = $location.absUrl();
        // //     return new RegExp(path).test(url)?'current':"";
        // // };
        //
        // //存放权限集合
        // var permissionList =[];
        // //添加服务器请求 获取当前用户登录信息
        // AuthService.checkLoginStatus({}, function (data) {
        //     $scope.setCurrentUser(data);
        //     permissionList = data.privileges;
        // });
        // //权限验证
        // $scope.isAuth = function(privilege){
        //     var flag = false;
        //     if(permissionList != null && permissionList.length>0 ){
        //         if(permissionList.indexOf(privilege)!= -1) {
        //             flag = true;
        //         }
        //     }
        //     return flag;
        // }
        //
        // //按钮权限验证
        // $scope.buttonHas = function (buttonPri) {
        //     for(var i = 0;i< buttonPri.length; i++){
        //         var pri = buttonPri[i]
        //         if("back.gateway" == pri || "back.adapter" == pri){
        //             if(permissionList.indexOf('back.gateway')!= -1) {
        //                 $state.go('back.gateway','{isGo:true}');
        //                 break;
        //             }
        //             if(permissionList.indexOf('back.adapter')!= -1) {
        //                 $state.go('back.adapter','{isGo:true}');
        //                 break;
        //             }
        //         }else{
        //             if(permissionList.indexOf(pri)!= -1) {
        //                 $state.go(pri);
        //                 break;
        //             }
        //         }
        //
        //     }
        // }

      

    }
]);
;
// Source: app/know_background/home/js/controller/home_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('backHomeModule').controller('backHomeController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "HomeService","$sce",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              HomeService,$sce) {
       var self = this;

        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO(); 
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        
        self.getMyTask = function(){
            HomeService.queryMyTask.get({page:$scope.SearchPOJO.currentPage,pageSize:$scope.SearchPOJO.pageSize},function(resource){
                if(resource.status == 200 && resource.data!=null){
                    $scope.taskKnowItems = resource.data.taskList;
                    $scope.taskKnowItems.forEach(function(task){
                        var titleHtml = $sce.trustAsHtml(task.knowItemDto.title);
                        var contentHtml = $sce.trustAsHtml(task.knowItemDto.content);
                        task.knowItemDto.titleHtml = titleHtml;
                        task.knowItemDto.contentHtml = contentHtml
                    })
                    $scope.paginationConf.totalItems = resource.data.count;
                }
            })
        }

        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                self.getMyTask();
            }, 350)
        }, true)

        self.initSearch();
    }
]);
;
// Source: app/know_background/know_gateway/js/controller/adapter_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('adapterController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "AdapterService",'TipService','TemplateService',
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              AdapterService,TipService,TemplateService) {
        var self = this;
        $scope.targetId = '';
        
        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        /**
         * 初始化知识库列表
         */
        // self.queryLibList = function () {
        //     ManageBaseService.connQueryKnowBaseListByCon.get({
        //     },function(resource){
        //         if(resource.status == 200){
        //                 $scope.libList = resource.data.list
        //
        //         }
        //     })
        // }


        /**
         * 初始化模板列表
         */
        self.queryTemList = function () {
        }


        $scope.queryAdaptor = function(){
            AdapterService.queryAdaptor.get({
                pageNo:$scope.SearchPOJO.currentPage,
                pageSize:$scope.SearchPOJO.pageSize,
                name:$scope.SearchPOJO.name
            },function(resource){
                if(resource.status == 200){
                    $scope.adapters = resource.data.data
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        };

        $scope.TemSearchPOJO = {
            pageSize:5,
            currentPage:1
        };

        $scope.temPaginationConf = {
            currentPage: $scope.TemSearchPOJO.currentPage,//当前页
            totalItems: 0, //总条数
            pageSize: $scope.TemSearchPOJO.pageSize,//第页条目数
            pagesLength: 6,//分页框数量
            target:$scope.TemSearchPOJO
        };
        //
        // $scope.queryTemplate = function(){
        //     TemplateService.queryTemplate.get({
        //         pageNo:$scope.TemSearchPOJO.currentPage,
        //         pageSize:$scope.TemSearchPOJO.pageSize,
        //         name:$scope.TemSearchPOJO.name
        //     },function(resource){
        //         if(resource.status == 200){
        //             $scope.templates = resource.data.data
        //             $scope.temPaginationConf.totalItems = resource.data.total;
        //         }
        //     })
        // }

        $scope.getAdType = function(type){
            if(type == 1){
                return "DB";
            }else if(type == 2){
                return "Hadoop";
            }else if(type == 3){
                return "FTP";
            }else if(type == 4){
                return "DOC";
            }
        }

        $scope.getAdStatus = function(type){
            if(type == 1){
                return "开";
            }else if(type == 2){
                return "关";
            }
        }

        $scope.checkAdStatus = function(status){
            if(status == 2){
                return "on_off_active";
            }
        }

        $scope.updateAdStatus = function(id,status){
            if(status == 1){
                status = 2;
            }else if(status == 2){
                status = 1;
            }
            AdapterService.updateAdStatus.save({
                id:id,
                status:status
            },function(re){
                if(re.status == 200 && re.data.status == 200){
                    TipService.setMessage('更新成功!',"success");
                    $scope.queryAdaptor();
                }else if(re.data.err){
                    TipService.setMessage(re.data.err,"error");
                }
            })
        }

        $scope.setAdapter = function(adaptor){

            var synchronizingTime = adaptor.synchronizingTime/60000;
            $scope.AdapterPOJO = {
                name:adaptor.name,
                type:adaptor.type,
                synchronizingTime:synchronizingTime,
                dbtype:adaptor.dbType,
                url:adaptor.url,
                userName:adaptor.userName,
                password:adaptor.password,
                sql:adaptor.sqlStr,
                titleCol:adaptor.titleCol,
                contentCol:adaptor.contentCol,
                tagCol:adaptor.tagCol,
                id:adaptor.id

            };
        }

        $scope.addAdaptor = function(){
            if(!$scope.AdapterPOJO.name || $scope.AdapterPOJO.name ==''){
                alert("请输入适配器名称");
                return;
            }
            if($scope.CheckStr($scope.AdapterPOJO.name)){
                alert("名称包含非法字符!");
                return;
            }
            if(!$scope.AdapterPOJO.type || $scope.AdapterPOJO.type ==''){
                alert("请选择适配器类型");
                return;
            }

            if($scope.AdapterPOJO.type == 1){
                if(!$scope.AdapterPOJO.dbtype || $scope.AdapterPOJO.dbtype ==''){
                    alert("请选择数据库类型");
                    return;
                }
                if(!$scope.AdapterPOJO.url || $scope.AdapterPOJO.url ==''){
                    alert("请输入URL");
                    return;
                }
                if(!$scope.AdapterPOJO.userName || $scope.AdapterPOJO.userName ==''){
                    alert("请输入用户名");
                    return;
                }
                if(!$scope.AdapterPOJO.password || $scope.AdapterPOJO.password ==''){
                    alert("请输入密码");
                    return;
                }
                if(!$scope.AdapterPOJO.sql || $scope.AdapterPOJO.sql ==''){
                    alert("请输入SQL语句");
                    return;
                }
                if(!$scope.AdapterPOJO.titleCol || $scope.AdapterPOJO.titleCol ==''){
                    alert("请输入标题列");
                    return;
                }
                if(!$scope.AdapterPOJO.contentCol || $scope.AdapterPOJO.contentCol ==''){
                    alert("请输入内容列");
                    return;
                }
                if(!$scope.AdapterPOJO.tagCol || $scope.AdapterPOJO.tagCol ==''){
                    alert("请输入标记列");
                    return;
                }
                if(!$scope.AdapterPOJO.synchronizingTime ||  isNaN($scope.AdapterPOJO.synchronizingTime) || $scope.AdapterPOJO.synchronizingTime < 0){
                    alert("请输入正确的时间间隔");
                    return;
                }
            }else if($scope.AdapterPOJO.type == 4){
                if(!$scope.AdapterPOJO.synchronizingTime ||  isNaN($scope.AdapterPOJO.synchronizingTime) || $scope.AdapterPOJO.synchronizingTime < 0){
                    alert("请输入正确的时间间隔");
                    return;
                }

                if(!$scope.AdapterPOJO.docPath || $scope.AdapterPOJO.docPath ==''){
                    alert("请输入文档路径");
                    return;
                }
            }

            var synchronizingTime = $scope.AdapterPOJO.synchronizingTime*60*1000;
            var ob = {
                //通用
                name:$scope.AdapterPOJO.name,
                type:$scope.AdapterPOJO.type,
                synchronizingTime:synchronizingTime,
                status:2,
                //JDBC属性
                dbType:$scope.AdapterPOJO.type,
                url:$scope.AdapterPOJO.url,
                userName:$scope.AdapterPOJO.userName,
                password:$scope.AdapterPOJO.password,
                sqlStr:$scope.AdapterPOJO.sql,
                titleCol:$scope.AdapterPOJO.titleCol,
                contentCol:$scope.AdapterPOJO.contentCol,
                tagCol:$scope.AdapterPOJO.tagCol,
                remoteStatus:100,
                //文件夹属性
                docPath:$scope.AdapterPOJO.docPath,
                temId:$scope.temId,
                id:$scope.AdapterPOJO.id,
                libId:$scope.AdapterPOJO.libId
            };
            if(ob.id){
                AdapterService.updateAdStatus.save(ob,function(resource){
                    if(resource.status == 200 && resource.data.status == 200){
                        $scope.reset();
                        $scope.queryAdaptor();
                        $('.popup_wrap').hide();
                        TipService.setMessage('更新成功!',"success");
                    }else if(resource.data.err){
                        alert(resource.data.err);
                    }
                })
            }else{
                AdapterService.addAdaptor.save(ob,function(resource){
                    if(resource.status == 200 && resource.data.status == 200){
                        $scope.reset();
                        $scope.queryAdaptor();
                        $('.popup_wrap').hide();
                        TipService.setMessage('创建成功!',"success");
                    }else if(resource.data.err){
                        alert(resource.data.err);
                    }
                })
            }
        }
        $scope.reset = function(){
            $scope.AdapterPOJO = {};
            $scope.targetId = '';
        }

        $scope.convertSS2mm = function(time){
            return time/(60*1000);
        }
        
        $scope.deleteAdapter = function(id){
            AdapterService.deleteAdaptor.get({id:id},function(re){
                if(re.status == 200 && re.data.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryAdaptor();
                }else if(re.data.err){
                    TipService.setMessage(re.data.err,"error");
                }
            })
        }
        
        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                $scope.queryAdaptor();
            }, 350)
        }, true)

        // var timeout3;
        // $scope.$watch('TemSearchPOJO', function (SearchPOJO) {
        //     if (timeout3) {
        //         $timeout.cancel(timeout3)
        //     }
        //     timeout = $timeout(function () {
        //         $scope.queryTemplate();
        //     }, 350)
        // }, true)

        self.initSearch();
        //self.queryLibList();
        //self.queryTemList();

    }
]);
// Source: app/know_background/know_gateway/js/controller/analyse_task_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('analyseTaskController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "KnowDocService","SearchService","TemplateService","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              KnowDocService,SearchService,TemplateService,TipService) {
        var self = this;
        $scope.processMethod = true;

        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            console.log()
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6,//分页框数量

            };
        }

        $scope.TemSearchPOJO = {
            pageSize:5,
            currentPage:1
        };

        $scope.temPaginationConf = {
            currentPage: $scope.TemSearchPOJO.currentPage,//当前页
            totalItems: 0, //总条数
            pageSize: $scope.TemSearchPOJO.pageSize,//第页条目数
            pagesLength: 6,//分页框数量
            target:$scope.TemSearchPOJO
        };


        $scope.queryTemplate = function(){
            TemplateService.queryTemplate.save({
                "index": ($scope.TemSearchPOJO.currentPage-1)*$scope.TemSearchPOJO.pageSize,
                "pageSize": $scope.TemSearchPOJO.pageSize,
                "requestId": "string",
            },function(resource){
                if(resource.status == 200){
                    $scope.templates = resource.data.objs;
                    $scope.temPaginationConf.totalItems = resource.data.total;
                }
            })
        }


        $scope.getTaskStatus = function(taskStatus){
            if(taskStatus == 0){
                return "未开始"
            }else if(taskStatus == 1){
                return "解析中"
            }else if(taskStatus == 2){
                return "解析成功"
            }else if(taskStatus == 3){
                return "解析失败"
            }
        }

        $scope.getAnalyseType  = function(analyseType){
            if(analyseType == 0){
                return "全文解析"
            }else if(analyseType == 1){
                return "目录解析"
            }else if(analyseType == 2){
                return "模板解析"
            }else if(analyseType == 3){
                return "插件解析"
            }
        }

        $scope.resetUploadPOJO = function(){
            if($scope.libraryIds && $scope.libraryIds.length>0)
                $scope.uploadLibraryId = $scope.libraryIds[0].id;
            $scope.targetId ='';
            //$scope.processMethod = 'a';
        }

        // $scope.noFileSinUpload = function(){
        //     KnowDocService.singleImport.save({
        //         title:$scope.sinKnowItemTitle,
        //         content:$scope.sinKnowItemContent,
        //         libraryId:$scope.uploadLibraryId,
        //         ontologys:$scope.classifyId
        //     },function(resource){
        //         if(resource.status == 200){
        //             $('.popup_wrap').hide();
        //             $('.popup_span').hide();
        //             $(".import_from_txt").css('visibility','hidden');
        //             $(".add_single_popup").css('visibility','hidden');
        //             $scope.queryAnalyseTask();
        //             $('#sincontainer').html('');
        //             $scope.resetSinPOJO();
        //         }
        //     })
        // }

        $scope.queryKnowDocList = function(){
            //alert($scope.SearchPOJO.currentPage)
            KnowDocService.queryKnowDocList.save({
                "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                "pageSize": $scope.SearchPOJO.pageSize,
                "documentationName": $scope.SearchPOJO.docName,
                "documentationCreateTime":$scope.SearchPOJO.startTime,
                "documentationModifyTime": $scope.SearchPOJO.endTime,
                "documentationCreater": $scope.SearchPOJO.userName,
                "requestId": "string",
            },function(resource){
                if(resource.status == 200){
                    $scope.knowDocs = resource.data.objs
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        }

        $scope.resetKnowDocSearchPOJO = function(){
            $scope.SearchPOJO.currentPage =1;
            $scope.SearchPOJO.docName = "";
            $scope.SearchPOJO.startTime="";
            $scope.SearchPOJO.endTime="";
            $scope.SearchPOJO.libraryId ="";
            $scope.SearchPOJO.isRepeated ="";
            $scope.SearchPOJO.userName="";
        }

        $scope.deleteKnowDoc = function(knowDocId){
            KnowDocService.deleteKnowDoc.save({
                    "documentationId": knowDocId,
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryKnowDocList();
                }
            })
        }

        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                $scope.queryKnowDocList();
            }, 350)
        }, true)


        self.initSearch();




        var timeout3;
        $scope.$watch('TemSearchPOJO', function (SearchPOJO) {
            if (timeout3) {
                $timeout.cancel(timeout3)
            }
            timeout = $timeout(function () {
                $scope.queryTemplate();
            }, 350)
        }, true)

    }
]);
// Source: app/know_background/know_gateway/js/controller/create_tem_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowGatewayModule').controller('createTemController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","localStorageService","$state","TipService",
    function ($scope, $location, $stateParams, $interval, $timeout, ngDialog,
              TemplateService,localStorageService,$state,TipService) {
        var self = this;
        $scope.temName = "";
        $scope.temType = 'WORD';
        $scope.temNameChecked = false;
        $scope.fileName = "未选择文件";

        if($stateParams.isGo !=true && localStorageService.get($state.current.name)){
            $scope.temId = localStorageService.get($state.current.name);
        }else if($stateParams.temId){
            $scope.storeParams($stateParams.temId);
            $scope.temId = $stateParams.temId
        }

        $scope.queryTemplateById = function(){
            TemplateService.queryTemplateById.save({
                "index":0,
                "pageSize":1,
                "templateId":$scope.temId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    $scope.temName = resource.data.objs[0].templateName;
                    //$scope.rules = resource.data.rules;
                    var filePath = resource.data.objs[0].templateUrl;
                    var filename=filePath.substring(filePath.lastIndexOf("//")+2,filePath.length);
                    $scope.fileName = filename;
                }
                console.log();
            })
        }
        
        $scope.queryRules = function(){
            TemplateService.queryRules.save({
                //"index":0,
                //"pageSize":1,
                "templateId":$scope.temId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    //$scope.rules = resource.data.objs.rules;
                    $scope.rules = resource.data.objs;
                }
                console.log();
            })
        }

        
        $scope.addRule = function(){
            if($scope.rules){
                $scope.rules.push({
                    sort:$scope.rules.length+1});
                $('.proce_result ').trigger('click');
            }else{
                alert("请先上传模板或选定模板");
            }
        }

        $scope.deleteRule = function(ruleId){
            if(!ruleId){
                return;
            }
            TemplateService.deleteRule.save({
                "ruleId":ruleId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryTemplateById();
                }else{
                    TipService.setMessage('删除失败!',"err");
                }
            })
        }

        $scope.resetRule = function(index){
            var rule = $scope.rules[index];
            if(rule && !rule.id){
                $scope.rules.splice(index,1)
            }
        }

        $scope.backT = function(){
            history.back();
        };

        var timeout;
        $scope.$watch('temId', function (temId) {
            if(temId){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    $scope.queryTemplateById();
                    $scope.queryRules();
                }, 350)
            }
        }, true)

        var timeout2;
        $scope.$watch('temName', function (temName) {
            if(temName && temName != ""){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    TemplateService.checkTemName.save({
                        templateName: $scope.temName,
                    },function(resource){
                        if(resource.status == 200 && resource.data.objs.length == 0){
                            $scope.temNameChecked = true;
                        }else{
                            $scope.temNameChecked = false;
                        }
                    })
                }, 350)
            }
        }, true)
    }
]);
// Source: app/know_background/know_gateway/js/controller/doc_select_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('docSelectController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","localStorageService","$state","$sce",
    function ($scope, $location, $stateParams, $interval, $timeout, ngDialog,
              TemplateService,localStorageService,$state,$sce) {
        var self = this;

        $scope.checkedRule = {};
        $scope.temId = $stateParams.temId;
        $scope.level = $stateParams.level;
        $scope.roleId = $stateParams.roleId;
        $scope.showExtract = false;
        
        $scope.queryRole = function(){
            TemplateService.queryRuleById.save({
                ruleId: $scope.roleId
            },function(re){
                if(re.status == 200){
                    var data = re.data;
                    $scope.titleText = data.inputText
                    $scope.extractRegTxt = data.extractReg
                    $scope.checkModel = data.model
                    $scope.returnRole = data;
                    $scope.generateRule();
                }
            })
        }

        $scope.queryTemplateContent = function () {
            TemplateService.queryTemplateContent.save({
                "index": 0,
                "pageSize": 1,
               "templateId": $scope.temId
            },function(re){
                if(re.status == 200){
                    if($scope.notEmpty(re.data) && re.data.length > 0){
                       var  queryTemContent =  $sce.trustAsHtml(re.data);
                        $scope.queryTemContent = queryTemContent;
                    }
                }
            })
        }

        $scope.generateRule = function(){
            if(!$scope.titleText || $scope.titleText == ''){
                alert("请填写匹配标题");
                return;
            }
            TemplateService.generateRule.save({
                "templateId":$scope.temId,
                "level":$scope.level,
                "text":$scope.titleText
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.rules = re.data.objs;
                        for(var i=0;i<$scope.rules.length;i++){
                            var rule = $scope.rules[i]
                            if($scope.returnRole && $scope.returnRole.firstLineIndent==rule.firstLineIndent && $scope.returnRole.fontAlignment == rule.fontAlignment && $scope.returnRole.selectText == rule.lineWord){
                                $scope.checkedRuleIndex = i;
                            }
                        }
                        $scope.getSimilarText();
                    }
                }
            })
        }

        $scope.getSimilarText = function(){
            if($scope.rules != undefined && $scope.checkedRuleIndex != undefined && $scope.rules[$scope.checkedRuleIndex] != undefined){
                $scope.checkedRule = $scope.rules[$scope.checkedRuleIndex];
            }else{
                $scope.checkedRule = undefined;
            }

            if(!$scope.checkedRule || $scope.checkedRule == ''){
                alert("请选择匹配标题");
                return;
            }
            //console.log($scope.checkedRule)
            TemplateService.getSimilarText.save({
                "lineWord":$scope.checkedRule.lineWord,
                "firstLineIndent":$scope.checkedRule.firstLineIndent,
                "fontAlignment":$scope.checkedRule.fontAlignment,
                "level":$scope.checkedRule.level,
                "model":$scope.checkedRule.model,
                "numFmt":$scope.checkedRule.numFmt,
                "numLevelText":$scope.checkedRule.numLevelText,
                "style":$scope.checkedRule.style,
                "templateId":$scope.checkedRule.templateId
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.strs = re.data.objs;
                        if($scope.extractRegTxt != null && $scope.extractRegTxt != '')
                            $scope.optimizeText();
                    }else{
                        alert("未能抽取到匹配内容");
                    }
                }
            })
        }
        $scope.optimizeText = function(){
            if(!$scope.strs || $scope.strs.length <= 0){
                alert("没有匹配的标题");
                return;
            }
            if(!$scope.extractRegTxt || $scope.extractRegTxt == ''){
                alert("请输入正则表达式");
                return;
            }
            TemplateService.optimizeText.save({
                "regexRule":$scope.extractRegTxt,
                "texts":$scope.strs
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.extractStrs = re.data;
                    }else{
                        alert("未能匹配到相应正则结果");
                    }
                }
            })
        }

        $scope.addWordRule = function(){
            if($scope.rules != undefined && $scope.checkedRuleIndex != undefined && $scope.rules[$scope.checkedRuleIndex] != undefined){
                $scope.checkedRule = $scope.rules[$scope.checkedRuleIndex];
            }else{
                $scope.checkedRule = undefined;
            }

            if(!$scope.checkedRule){
                alert("请选择要保存的规则");
                return;
            }
            TemplateService.addWordRule.save({
                "lineWord":$scope.checkedRule.lineWord,
                "firstLineIndent":$scope.checkedRule.firstLineIndent,
                "fontAlignment":$scope.checkedRule.fontAlignment,
                "level":$scope.checkedRule.level,
                "model":$scope.checkModel,
                "numFmt":$scope.checkedRule.numFmt,
                "numLevelText":$scope.checkedRule.numLevelText,
                "style":$scope.checkedRule.style,
                "templateId":$scope.checkedRule.templateId,
                "extractReg":$scope.extractRegTxt,
                "inputText":$scope.titleText,
                "selectText":$scope.checkedRule.lineWord,
                "requestId":"String",
            },function(re){
                if(re.status == 200){
                    history.back();
                }
            })
        }

        // var timeout;
        // $scope.$watch('checkedRule', function (rule) {
        //     if(rule != {}){
        //         if (timeout) {
        //             $timeout.cancel(timeout)
        //         }
        //         timeout = $timeout(function () {
        //             $scope.extractRegTxt = '';
        //         }, 350)
        //     }
        // }, true)

        // $scope.showExtractReg = function(){
        //     $scope.showExtract = !$scope.showExtract;
        //     if(!$scope.showExtract){
        //         $scope.extractReg = '';
        //     }
        // }

        $scope.checkRule = function(rule){
            if($scope.returnRole && $scope.returnRole.firstLineIndent==rule.firstLineIndent && $scope.returnRole.fontAlignment == rule.fontAlignment && $scope.returnRole.selectText == rule.lineWord){
                return true;
            }else{
                return false;
            }
        }

        $scope.queryTemplateContent();
        if($scope.roleId != null && $scope.roleId != ""){
            $scope.queryRole();
        }
        
    }
]);
// Source: app/know_background/know_gateway/js/controller/tem_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('temController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              TemplateService,TipService) {
        var self = this;



        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }
        $scope.queryTemplate = function(){
            TemplateService.queryTemplate.save(
                {
                    "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                    "pageSize": $scope.SearchPOJO.pageSize,
                    "requestId": "string",
                    "templateName": $scope.SearchPOJO.name,
                }
               ,function(resource){
                if(resource.status == 200){
                    $scope.templates = resource.data.objs
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        }
        
        $scope.deleteTemplate = function(temId){
            TemplateService.deleteTemplate.save({
                "templateId":temId
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryTemplate();
                }
            })
        }
        
        $scope.temType = function(typeNum){
            if(typeNum == 1){
                return "WORD"
            }
        }

        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                $scope.queryTemplate();
            }, 350)
        }, true)
        self.initSearch();
    }
]);
// Source: app/know_background/know_gateway/js/directives/gateway_menu.js
/**
 * Created by Administrator on 2016/12/12.
 */

knowledge_static_web.directive("gatewayMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                $('.popup_span').show();
                if (attrs.gatewayMenu == 'file')
                    $(".import_from_txt").css('visibility', 'visible');
                else if (attrs.gatewayMenu == 'single')
                    $(".add_single_popup").css('visibility', 'visible');
                else if (attrs.gatewayMenu == 'adapter')
                    $(".jr_Agent").show();
            })
        }
    }
});

knowledge_static_web.directive('plupload', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {
            var uploader = new plupload.Uploader({
                runtimes: 'html4,html5,flash,silverlight',
                browse_button: 'pickfiles',
                url: 'noturl',
                //container: document.getElementById('filelist'),
                //container: $('#filelist'),
                multi_selection: true,
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{
                        title: "Know File",
                        extensions: "doc,docx,txt,pdf,xls,xlsx,html,ppt,pptx"
                    }]
                },
                flash_swf_url: '/plupload/Moxie.swf',
                silverlight_xap_url: '/plupload/Moxie.xap',
                init: {
                    PostInit: function () {
                        //document.getElementById('uploadfiles').onclick = function() {
                        $('#uploadfiles').click(function () {
                            var params = {
                                //这里设置上传参数
                                //ontologys: $scope.classifyId,
                                //fregStyle: 2, //碎片化加工
                                templateId:$scope.targetId,
                                requestId:"String",
                                //设置用户信息
                                userId:"testuser"

                            };
                            if ($scope.processMethod == true) {
                                if (!$scope.targetId || $scope.targetId == null) {
                                    alert("请选择加工模板");
                                    return;
                                }
                                //params.targetId = $scope.targetId;
                            }
                            uploader.setOption('multipart_params', params);
                            uploader.setOption('url', '/api/knowledgeDocumentation/createDocumentation');
                            uploader.start();
                            return false;
                        });

                        $('#reset').click(function () {
                            if (uploader.files.length > 0) {
                                for (var i = uploader.files.length; i > 0; i--) {
                                    uploader.removeFile(uploader.files[i - 1]);
                                }
                            }
                            $scope.$apply($scope.resetUploadPOJO());
                        })
                    },

                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            //document.getElementById('file_container').innerHTML += '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> (' + plupload.formatSize(file.size) + ') </span></div>';
                            $('#file_container').append('<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> (' + plupload.formatSize(file.size) + ') </span></div>');
                        });
                    },

                    FilesRemoved: function (up, files) {
                        plupload.each(files, function (file) {
                            if (up.files.length <= 0) {
                                //document.getElementById('file_container').innerHTML = '';
                                $('#file_container').html('');
                            }
                        });
                    },

                    UploadProgress: function (up, file) {
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
                    },

                    Error: function (up, err) {
                        console.log("Error #" + err.code + ": " + err.message);
                    },

                    UploadComplete: function (uploader, files) {

                    },

                    FileUploaded: function (uploader, files, res) {
                        $scope.queryKnowDocList();
                        $('#file_container').html('');
                        $scope.resetUploadPOJO();
                        $('.template_inpt').val("");
                        if (res.status == 200){
                            $('.popup_wrap').hide();
                            $('.popup_span').hide();
                            $(".import_from_txt").css('visibility', 'hidden');
                            $(".add_single_popup").css('visibility', 'hidden');
                        }
                    }
                }
            });
            uploader.init();
        }
    };
}]);

knowledge_static_web.directive('tempPlupload', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {
            var uploader = new plupload.Uploader({
                runtimes: 'html4,html5,flash,silverlight',
                browse_button: 'tempickfile',
                url:'/template/createTemplate',
                //container: 'temcontainer',
                max_file_count: 1,
                multi_selection: false,
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{
                        title: "Know File",
                        extensions: "doc,docx"
                    }]
                },
                flash_swf_url: '/plupload/Moxie.swf',
                silverlight_xap_url: '/plupload/Moxie.xap',
                init: {
                    PostInit: function () {
                        $('#temupload').click(function () {
                            if ($scope.temName == null || $scope.temName == '' || !$scope.temName) {
                                alert("请输入模板名称");
                                return;
                            }
                            if ($scope.temName.length > 50) {
                                alert("模板名称不能大于50字");
                                return;
                            }
                            if (!$scope.temNameChecked) {
                                alert("模板名校验失败");
                                return;
                            }
                            if (uploader.files.length <= 0) {
                                alert("请选择上传文件");
                                return;
                            }
                            uploader.setOption('multipart_params', {
                                type: $scope.temType,
                                "templateName": $scope.temName,
                                "requestId":"String",
                                //此处设置上传用户信息
                                "userId":"testUser"
                            });
                            uploader.start();
                            return false;
                        });

                        //document.getElementById('temreset').onclick = function(){
                        $('#temreset').click(function () {
                            if (uploader.files.length > 0) {
                                for (var i = uploader.files.length; i > 0; i--) {
                                    uploader.removeFile(uploader.files[i - 1]);
                                }
                            }
                        })
                    },

                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            //document.getElementById('temcontainer').innerHTML = '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></div>';
                            $('#temcontainer').html('<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></div>');
                            if (up.files.length <= 1) {
                                return;
                            }
                            up.removeFile(file);
                        });
                    },

                    FilesRemoved: function (up, files) {
                        plupload.each(files, function (file) {
                            if (up.files.length <= 0) {
                                //document.getElementById('temcontainer').innerHTML = '未选择文件';
                                $('#temcontainer').html('未选择文件');
                            }
                        });
                    },

                    UploadProgress: function (up, file) {
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
                    },

                    Error: function (up, err) {
                        console.log("Error #" + err.code + ": " + err.message);
                    },

                    UploadComplete: function (uploader, files) {

                    },

                    FileUploaded: function (uploader, files, res) {
                        if (res.status == 200) {
                            //var res = res.replace(/<.*?>/ig,"")
                            var response = JSON.parse(res.response.replace(/<.*?>/ig,""));
                            if (response.status == 200) {
                                alert("模板文件上传成功，请添加规则");
                                $scope.$apply(function () {
                                    $scope.temId = response.data.templateId;
                                    $scope.storeParams($scope.temId);
                                })
                            } else {
                                alert("模板文件上传失败");
                            }
                        }
                    }
                }
            });
            uploader.init();
        }
    };
}]);

// knowledge_static_web.directive('sinPlupload', ['$timeout', function ($timeout) {
//     return {
//         restrict: 'A',
//         link: function ($scope, iElm, iAttrs, controller) {
//             var uploader = new plupload.Uploader({
//                 runtimes: 'html4,html5,flash,silverlight',
//                 browse_button: 'sinpickfile',
//                 url: '/back/knowaccess/docimport/docmanager/singleImport',
//                 // container: 'test',
//                 max_file_count: 1,
//                 multi_selection: false,
//                 filters: {
//                     max_file_size: '10mb',
//                     mime_types: [{
//                         title: "Know File",
//                         extensions: "doc,docx"
//                     }]
//                 },
//                 // flash_swf_url: '/plupload/Moxie.swf',
//                 // silverlight_xap_url: '/plupload/Moxie.xap',
//                 init: {
//                     PostInit: function () {
//                         //document.getElementById('sinupload').onclick = function() {
//                         $('#sinupload').click(function () {
//                             if (!$scope.sinKnowItemTitle || $scope.sinKnowItemTitle == '' || $scope.sinKnowItemTitle == null) {
//                                 alert("知识条目标题不能为空");
//                                 return;
//                             }
//                             if (!$scope.sinKnowItemContent || $scope.sinKnowItemContent == '' || $scope.sinKnowItemContent == null) {
//                                 alert("知识条目内容不能为空");
//                                 return;
//                             }
//                             uploader.setOption('multipart_params', {
//                                 title: $scope.sinKnowItemTitle,
//                                 content: $scope.sinKnowItemContent,
//                                 libraryId: $scope.uploadLibraryId,
//                                 ontologys: $scope.classifyId
//                             });
//                             if (uploader.files.length > 0) {
//                                 uploader.start();
//                             } else {
//                                 $scope.noFileSinUpload();
//                             }
//                             return false;
//                         });
//
//                         //document.getElementById('sinreset').onclick = function(){
//                         $('#sinreset').click(function () {
//                             if (uploader.files.length > 0) {
//                                 for (var i = uploader.files.length; i > 0; i--) {
//                                     uploader.removeFile(uploader.files[i - 1]);
//                                 }
//                             }
//                             $scope.$apply($scope.resetSinPOJO());
//                         })
//                     },
//
//                     FilesAdded: function (up, files) {
//                         plupload.each(files, function (file) {
//                             //document.getElementById('sincontainer').innerHTML = '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></div>';
//                             $('#sincontainer').html('<span class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></span>');
//                             if (up.files.length <= 1) {
//                                 return;
//                             }
//                             up.removeFile(file);
//                         });
//                     },
//
//                     FilesRemoved: function (up, files) {
//                         plupload.each(files, function (file) {
//                             if (up.files.length <= 0) {
//                                 //document.getElementById('sincontainer').innerHTML = '';
//                                 $('#sincontainer').html('');
//                             }
//                         });
//                     },
//
//                     UploadProgress: function (up, file) {
//                         //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//                         $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
//                     },
//
//                     Error: function (up, err) {
//                         console.log("Error #" + err.code + ": " + err.message);
//                     },
//
//                     UploadComplete: function (uploader, files) {
//
//                     },
//
//                     FileUploaded: function (uploader, files, res) {
//                         if (res.status == 200) {
//                             $('.popup_wrap').hide();
//                             $('.popup_span').hide();
//                             $(".import_from_txt").css('visibility', 'hidden');
//                             $(".add_single_popup").css('visibility', 'hidden');
//
//                             $scope.queryKnowDocList();
//                             //document.getElementById('sincontainer').innerHTML = '';
//                             $('#sincontainer').html('');
//                             $scope.resetSinPOJO();
//                         }
//                     }
//                 }
//             });
//             uploader.init();
//         }
//     };
// }]);

knowledge_static_web.directive("advanceMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var e = e || window.event;
                e.stopPropagation();
                if ($('.advan_search_div').is(':hidden')) {
                    $('.advan_search_div').show();
                    $('.advan_search').addClass('on');
                } else {
                    $('.advan_search_div').hide();
                    $('.advan_search').removeClass('on');
                }
            });
        }
    }
});

knowledge_static_web.directive("advansearchdiv", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var e = e || window.event;

                $(this).show();
                e.stopPropagation();
            });
            $(document).click(function () {
                elem.hide();
            })
        }
    }
});

knowledge_static_web.directive("processMethodMenu", function () {
    return {
        restrict: "AE",
        link: function ($scope, elem, attrs) {
            var pFun = attrs.processMethodMenu;
            elem.click(function () {
                if ($scope.processMethod == false) {
                    $('#modelSelect').show();
                    $('#modelAdd').show();
                    $scope.queryTemplate();
                } else {
                    $('#modelSelect').hide();
                    $('#modelAdd').hide();
                }
            })
        }
    }
});

knowledge_static_web.directive("templateInput", function () {
    return {
        restrict: "AE",
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var ev = e || window.event;
                $('.template_con').show();
                ev.stopPropagation();
            })

            $(document).click(function () {
                $('.template_con').hide();
            })
        }
    }
});

knowledge_static_web.directive("templateCon", function () {
    return {
        restrict: "AE",
        // scope:{
        //     targetId:"=targetId"
        // },
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var ev = e || window.event;
                ev.stopPropagation();
            })

            $scope.$on('onRenderFinish', function (event) {
                $('.template_con tbody tr').click(function () {
                    var value = $(this).find('td').eq(1).html();
                    var id = $(this).find('td').eq(3).html();
                    $('.template_inpt').val(value);
                    $scope.$parent.targetId = $scope.targetId = id;
                    $(this).parents('.template_con').hide();
                })
            });

        }
    }
});


knowledge_static_web.directive("mouldShowMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.change(function () {
                if ($(this).val() == "模板加工") {
                    $(this).next().show();
                }
            })
        }
    }
});

knowledge_static_web.directive("closeMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                $('.popup_wrap').hide();
                $('.popup_span').hide();
                $(".import_from_txt").css('visibility', 'hidden');
                $(".add_single_popup").css('visibility', 'hidden');
            });
        }
    }
});

knowledge_static_web.directive("onOff", function () {
    return {
        restrict: "AE",
        scope: {
            updateAdStatus: '&upfunction'
        },
        link: function ($scope, elem, attrs) {
            // var att = attrs.onOff.split(",");
            // var status = att[0];
            // var id = att[1]

            elem.click(function () {
                if ($(this).hasClass('on_off_active')) {
                    $(this).removeClass("on_off_active")
                } else {
                    $(this).addClass("on_off_active")
                }
                $scope.updateAdStatus();

            })
        }
    }
});


/**
 * ztree下拉树控件,文档上传，单条添加
 */
knowledge_static_web.directive("dropDownMenuByZtree", function () {
    return {
        restrict: "AE",
        scope: {
            // updoctype:'='
        },
        link: function ($scope, elem, attrs) {
            var setting = {
                check: {
                    enable: true,
                    chkboxType: {"Y": "", "N": ""}
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck
                }
            };

            // alert(attrs.dropDownMenuByZtree);
            var split = attrs.dropDownMenuByZtree;
            var arr = split.split(",");
            var citySel = arr[0];
            var menuContent = arr[1];
            var treeDemo = arr[2];

            function beforeClick(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo);
                zTree.checkNode(treeNode, !treeNode.checked, null, true);
                return false;
            }

            function onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo);
                var nodes = zTree.getCheckedNodes(true);
                var selectLocation = '';
                //获取父节点-------------------------------------
                if (nodes != null && nodes != undefined && nodes.length > 0) {
                    for (var m = 0; m < nodes.length; m++) {
                        var curLocation = "";//当前位置
                        var allNode = nodes[m]['name'];//获取当前选中节点
                        var node = nodes[m].getParentNode();
                        getParentNodes(node, allNode);

                        var location = "";
                        var nodeArrs = curLocation.split("->");
                        for (var i = nodeArrs.length - 1; i >= 0; i--) {
                            location += nodeArrs[i] + "->";
                        }
                        location = location.substring(0, location.lastIndexOf("->"));
                        // alert(location);
                        selectLocation += location + ",";
                    }

                } else {
                    selectLocation = '';
                    $scope.$parent.classifyId = '';
                }

                function getParentNodes(node, allNode) {
                    if (node != null) {
                        allNode += "->" + node['name'];
                        var curNode = node.getParentNode();
                        getParentNodes(curNode, allNode);
                    } else {
                        //根节点
                        curLocation = allNode;
                    }
                };

                if (selectLocation.length > 0) selectLocation = selectLocation.substring(0, selectLocation.length - 1);

                if ($.trim(selectLocation) != '' && selectLocation != null) {
                    $scope.$parent.classifyId = selectLocation;
                }
                // console.log($scope.$parent.classifyId);
                //---------------------------------------

                var v = "";
                // var nodeId = "";
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ",";
                    // nodeId += nodes[i].id + ",";
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                // if (nodeId.length > 0 ) nodeId= nodeId.substring(0, nodeId.length-1);//节点id（oec的分类id）
                //文档导入
                var cityObj = $("#" + citySel);
                cityObj.attr("value", v);
                // if(nodeId.length > 0){
                //     $scope.$parent.classifyId = nodeId;
                //     console.log($scope.$parent.classifyId);
                // }

            }

            //展开节点(暂未使用）
            function expandNode(e) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo),
                    type = e.data.type,
                    nodes = zTree.getSelectedNodes();
                if (type.indexOf("All") < 0 && nodes.length == 0) {
                    alert("请先选择一个父节点");
                }

                if (type == "expandAll") {
                    zTree.expandAll(true);
                } else if (type == "collapseAll") {
                    zTree.expandAll(false);
                } else {
                    var callbackFlag = $("#callbackTrigger").attr("checked");
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        zTree.setting.view.fontCss = {};
                        if (type == "expand") {
                            zTree.expandNode(nodes[i], true, null, null, callbackFlag);
                        } else if (type == "collapse") {
                            zTree.expandNode(nodes[i], false, null, null, callbackFlag);
                        } else if (type == "toggle") {
                            zTree.expandNode(nodes[i], null, null, null, callbackFlag);
                        } else if (type == "expandSon") {
                            zTree.expandNode(nodes[i], true, true, null, callbackFlag);
                        } else if (type == "collapseSon") {
                            zTree.expandNode(nodes[i], false, true, null, callbackFlag);
                        }
                    }
                }
            }

            elem.click(function () {
                // var cityObj = $("#"+citySel);
                // var cityOffset = $("#"+citySel).offset();
                $("#" + menuContent).css({left: "130px", top: "143px"}).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            });

            function hideMenu() {
                $("#" + menuContent).fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == citySel || event.target.id == menuContent || $(event.target).parents("#" + menuContent).length > 0)) {
                    hideMenu();
                }

            }

            // $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            //向控制器发送消息，进行菜单数据的获取
            $scope.$emit("menu", attrs["value"]);//此处attrs["value"]为ul中的value值，此处作为标记使用
            //接受控制器返回的菜单的消息
            $scope.$on("menuData", function (event, data) {
                $.fn.zTree.init($("#" + treeDemo), setting, data);//进行初始化树形菜单
                // $.fn.zTree.init($("#treeDemo2"), setting, data);//进行初始化树形菜单
                // $("#treeDemo_1_switch").bind("click", {type:"toggle"}, expandNode);
                // $("#collapseBtn").bind("click", {type:"collapse"}, expandNode);
            });


        }


    }
});


;
;
// Source: app/know_index/ApplicationController.js
/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */

knowledge_static_web.controller('ApplicationController',
    ['$scope', '$location', '$anchorScroll', 'AuthService', 'TipService','AUTH_EVENTS','$state','localStorageService','$stateParams','$sce','$window',"HomeService", "PersonalCenterService","KnowDocService",
        function ($scope, $location, $anchorScroll, AuthService, TipService,AUTH_EVENTS,$state,localStorageService,$stateParams,$sce,$window,HomeService,PersonalCenterService,KnowDocService) {
            $scope.currentUser = null;
            $scope.isAuthorized = AuthService.isAuthorized;
            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.tipService = TipService;

            $scope.backTage = $location.url().indexOf("index")>0?false:true;

            $scope.setCurrentUser = function (data) {
                $scope.currentUser = {
                    id: data.id,
                    userName: data.name,
                    realName: data.realName,
                    sex: data.sex,
                    email: data.email,             
                    protarit: data.protarit,
                    phone: data.phone,
                    identity: data.identity,
                    birthday: data.birthday,
                    status: data.status,
                    role: data.role,
                    lastLoginTime: data.lastLoginTime,
                    privileges:data.privileges
                };
            };

            $scope.getCurrentUserPrivileges = function () {
                if($scope.currentUser.privileges)  {
                    return $scope.currentUser.privileges
                }else if(localStorageService.get("privileges")){
                    return localStorageService.get("privileges")
                }else{
                    return null;
                }
            };

            $scope.getCurrentUserId = function () {
                if($scope.currentUser && $scope.currentUser.id)  {
                    return $scope.currentUser.id;
                }else if(localStorageService.get("SessionId")){
                    return localStorageService.get("SessionId");
                }else{
                    return null;
                }
            };

            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll();
            };

            /**
             * 处理一些共有方法
             * @returns {{currentPage: *, pageSize: *}}
             */
            $scope.initSearchPOJO = function () {
                if($stateParams.isGo || !localStorageService.get($state.current.name)){
                    //页面正常跳转 或 localStore中没有存储参数  默认初始化即可
                    return {
                        currentPage: $scope.currentPage,
                        pageSize: $scope.pageSize
                    };
                }else{
                    //否则 用localStore中的参数去初始化
                    return localStorageService.get($state.current.name);
                }
            };

            /**
             * 非空判断
             */
            $scope.notEmpty = function (param) {
               if(param!=null && param!=undefined && $.trim(param)!=''){
                   return true;
               }
               return false;
            };

            /**
             * 转化成html
             */
            $scope.sceConvertHtml = function (objectList) {
                if($scope.notEmpty(objectList) &&objectList.length>0){
                    objectList.forEach(function (item) {
                        var title = $sce.trustAsHtml(item.title);
                        var content = $sce.trustAsHtml(item.content);
                        item.titleHtml = title;
                        item.contentHtml = content;
                    })
                }
                return objectList;
            };

            //校验特殊字符
            $scope.CheckStr = function (str) {
                var myReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}\"%'+-/_【】‘；：”“'。，、？]");
                if(myReg.test(str)) return true;
                return false;
            };

            //添加评论的方法
            $scope.addComment = function(scope,knowItemId,index,userId,successFun){
                var comment = scope.comments[index];
                var flag = false;
                if(comment == null){
                    alert("评论不能为空！")
                }

                if(comment.length>500){
                    alert("评论不能超过500个字！");
                    return;
                }
                if(comment != null){
                    flag = true;
                }
                if(flag) {
                    HomeService.createComment.save({
                        commType: 0,
                        content: comment,
                        knowItemId: knowItemId,
                        targetId:userId
                    }, function () {
                        scope.comments[index] = "";
                        successFun();
                    });
                }
            };

            /**
             * 格式化时间
             */
            // 格式化时间
            $scope.format = function(time, format){
                var t = new Date(time);
                var tf = function(i){return (i < 10 ? '0' : '') + i};
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                    switch(a){
                        case 'yyyy':
                            return tf(t.getFullYear());
                            break;
                        case 'MM':
                             return tf(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return tf(t.getMinutes());
                            break;
                        case 'dd':
                            return tf(t.getDate());
                            break;
                        case 'HH':
                            return tf(t.getHours());
                            break;
                        case 'ss':
                            return tf(t.getSeconds());
                            break;
                    }
                })
            };

            $scope.changeURLArg = function(url,arg,arg_val){
                var pattern=arg+'=([^&]*)';
                var replaceText=arg+'='+arg_val;
                if(url.match(pattern)){
                    var tmp='/('+ arg+'=)([^&]*)/gi';
                    tmp=url.replace(eval(tmp),replaceText);
                    return tmp;
                }else{
                    if(url.match('[\?]')){
                        return url+'&'+replaceText;
                    }else{
                        return url+'?'+replaceText;
                    }
                }
            };

            $scope.storeParams = function(value){
                var key = $state.current.name;
                //var key = $stateParams.current.name;
                localStorageService.set(key,value);
            };

            $scope.goHistory = function(){
                $window.history.back();
            };

            //定义退出登录的方法
            $scope.logout = function () {
                AuthService.logout(function (data) {

                }, function (errMsg) {
                    $scope.errMsg = errMsg;
                });
            };

            $scope.initKnowCheckNoticeView = function(){
                PersonalCenterService.connKnowCheckNoticeCon.get(
                    {
                        flag:1/*,
                     pageNo:$scope.SearchPOJO.currentPage,
                     pageSize:5*/
                    },function(resource){
                        var resultData = resource.data;
                        // $("#knowCheckNotice").css("display","block");
                        $scope.resultCheckNoticeList = resultData.data;
                        $scope.resultCheckNoticeTotal = resultData.total;
                        // console.log($scope.resultCheckNoticeTotal);
                    })
            };
            $scope.initNoCheckTaskView = function(){
                HomeService.queryMyTask.get({page:1,pageSize:10},function(resource){
                    if(resource.status == 200){
                        $scope.taskCount = resource.data.count;
                        // console.log("带蛇和-->>”"+$scope.taskCount);
                    }
                })
            };

            $scope.initAnalyseTaskCount = function(){
                KnowDocService.queryAnalyseTaskCount.get({
                    getCount:true,
                    taskStatus:0
                },function(resource){
                    if(resource.status == 200){
                        $scope.analyseTaskCount = resource.data.data.total;
                    }
                })
            };



            // alert(format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'))
            // $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
            //     $state.go('login');
            // });
            $scope.$on(AUTH_EVENTS.notAuthorized, function (event,data) {
                if(data.fromState.name != null && data.fromState.name!='')
                    //$state.go(data.fromState.name);
                    $state.go($window.location.reload());
            });

            $scope.$on(AUTH_EVENTS.logoutSuccess, function (event,data) {
                $scope.currentUser = null;
            });

            $scope.$on(AUTH_EVENTS.loginSuccess, function (event,data) {
                $scope.initKnowCheckNoticeView();
                $scope.initNoCheckTaskView();
                $scope.initAnalyseTaskCount();
            });

        }]);;
// Source: app/know_index/admin/js/controller/adminContent_controller.js
/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('adminContentController', [
    '$scope',"$state","$timeout","$stateParams","ngDialog",
    function ($scope,  $state,$timeout,$stateParams,ngDialog) {


        //"applicationId": "string",


        setCookie("userName","mf");
        getCookie("userName");

        //setCookie("userId","359873057331875840");
        //$stateParams.userPermission = ['超级管理员','初级管理员'];
                $scope.vm = {
                    userName : getCookie("userName"),
                    userPermission : $stateParams.userPermission,
                    addApplicationWindow : addApplicationWindow,
                    myApplication : "",
                    selectLicence : "",

                    newApplicationName : "",
                    newScene : "",
                    newLicence : "",
                    newDescribe : ""
                };
        myApplication();
        selectLicence();

        //获取当前 应用场景
        function myApplication(){
            //console.log(getCookie("userId"));
            var sel = $scope;
            httpRequestPost("/api/application/application/listApplicationByUserId",{
                "userId":getCookie("userId")
            },function(data){
                sel.vm.myApplication = data.data;
                $scope.$apply()
            },function(err){
                //console.log(err)

            });

        }

        //var timeout = $timeout(function () {
        //     $scope.vm.selectLicence = ["d","a","b"]
        //},3000);
        //获取 scene
       function selectLicence(){
           httpRequestPost("/api/application/scene/listAllScene",{

                                    },function(data){
                                        $scope.vm.selectLicence = data.data;
                                        $scope.$apply();
                                        return data.data
                                    },function(err){

                                        console.log(err)
                                 });
       }

        //打开添加窗口
        function addApplicationWindow() {
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/addAdmin.html",
                scope:$scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addApplication()
                    }
                }

            });
        }
        //添加
        function addApplication(){
            console.log(getCookie("userId"),$scope.vm.newApplicationName,$scope.vm.newScene,$scope.vm.newLicence,$scope.vm.newDescribe);
            httpRequestPost("/api/application/application/addApplication",{
                "userId":getCookie("userId"),
                "applicationName": $scope.vm.newApplicationName,
                "sceneId": $scope.vm.newScene,
                "applicationLisence": $scope.vm.newLicence,
                "applicationDescription": $scope.vm.newDescribe
            },function(data){
                console.log(data)
            },function(err){
                console.log(err)
            });
        }


    }
]);;
// Source: app/know_index/admin/js/controller/admin_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */    

angular.module('adminModule').controller('adminController', [
    '$scope',  "$state", "$stateParams",
    function ($scope,  $state ,$stateParams) {
                //console.log("state"+$stateParams.userPermission);  
        $state.go("admin.manage",{userPermission:$stateParams.userPermission});              
    }                       
]);;
// Source: app/know_index/admin/js/controller/userManage_controller.js
/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('userManageController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",

    function ($scope,localStorageService, $state,$timeout,$stateParams,ngDialog) {
        $state.go("admin.userManage");
        setCookie("userId","1");
        $scope.vm = {
            listData : "",   // table 数据
            getData : getData,
            paginationConf : "", //分页条件
            addUser : addUser,
            editUser : editUser,
            deleteUser:deleteUser,
            stop:stop,
            userId:getCookie("userId"),

            //添加用户所需要数据
            userName : "",
            userLonginName :  "",
            userPassword :  "",
            userPhoneNumber  :  "",
            userEmail :"",
            remark:"",
            //查询当前所有应用
            listApplication : "",
            //查询当前所有角色
            listRole:"",
            roleId :"",
            prop :[],
            savaProp : savaProp,
            filter : filter
        };

        getData();
        //查询列表
        function getData(){
            httpRequestPost("/api/user/listUser",{
                index:0,
                pageSize:10,
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.userManageList;
                $scope.vm.paginationConf = {
                    currentPage: 0,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }
        //添加用户
        function addUser(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/user/addUser",{
                            userId:$scope.vm.userId,
                            userName:$scope.vm.userName,
                            userLoginName:$scope.vm.userLoginName,
                            userPassword:$scope.vm.userPassword,
                            userPhoneNumber:$scope.vm.userPhoneNumber,
                            userEmail:$scope.vm.userEmail,
                            roleId:$scope.vm.roleId,
                            applicationIds:$scope.vm.prop,
                            remark:$scope.vm.remark
                        },function(data){
                            //刷新页面
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //编辑用户
        function editUser(data){

                //userName : "",
            //    userLonginName :  "",
            //    userPassword :  "",
            //    userPhoneNumber  :  "",
            //    userEmail :"",
            //    remark:"",
            $scope.vm.userId = data.userId;
            $scope.vm.userName = data.userName;
            $scope.vm.userLoginName = data.userLoginName;
            $scope.vm.userPassword = data.userPassword;
            $scope.vm.userPhoneNumber = data.userPhoneNumber;
            $scope.vm.userEmail = data.userEmail;
            $scope.vm.remark = data.remark;
            $scope.vm.roleId = data.roleId;
            $scope.vm.prop = data.applicationName;
            console.log(data);
            //$scope.$apply()

            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog2.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/user/updateUserById",{
                            userId:data.userId,
                            userName:$scope.vm.userName,
                            userLoginName:$scope.vm.userLoginName,
                            userPassword:$scope.vm.userPassword,
                            userPhoneNumber:$scope.vm.userPhoneNumber,
                            userEmail:$scope.vm.userEmail,
                            roleId:$scope.vm.roleId,
                            applicationIds:$scope.vm.prop,
                            remark:$scope.vm.remark
                        },function(data){
                            //刷新页面
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //删除用户
        function deleteUser(userId){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/user/deleteUser",{
                            userId:userId,
                        },function(data){
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //改变用户状态
        function stop(userId,statusId){
            httpRequestPost("/api/user/updateStatus",{
                userId:userId,
                statusId:statusId
            },function(data){
                $state.reload()
            },function(){
                layer.msg("请求失败")
            })
        }

        getApplication();
        //得到应用列表
        function getApplication(){
            httpRequestPost("/api/application/application/listAllApplication",{
            },function(data){
                $scope.vm.listApplication = data.data
            },function(){
                layer.msg("请求失败")
            })
        }

        //得到角色列表
        getRole();
        function getRole(){
            httpRequestPost("/api/user/queryRoleList",{
            },function(data){
                $scope.vm.listRole = data.data
            },function(){
                layer.msg("请求失败")
            })
        }
        function savaProp(ev,id){

            if($(ev.target).prop("checked")){
                $scope.vm.prop.push(id)
            }else{
                $scope.vm.prop.remove(id)
            }
        }
        function filter(val,arr) {
            var len = arr.length;
            for (var i = 0; i < arr.length; i++) {
                if (val != arr[i]) {
                    len -= 1
                }
            }
            if(len == 0){
                return false
            }else{
                return true
            }
        }
            //angular.forEach(arr,function(item){
            //    if(val == item){
            //        console.log(val+"ddddddddddd");
            //        return true;
            //    }else{
            //        return false;
            //    }
            //})

    }
]);;
;
// Source: app/know_index/applicationAnalysis/js/controller/applAnalysis_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
          
angular.module('applAnalysisModule').controller('applAnalysisController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("functionalTest.questionTest",{userPermission:$stateParams.userPermission});
        $scope.vm = {


        };


    }
]);;
// Source: app/know_index/applicationAnalysis/js/controller/satisfactionDegree_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('applAnalysisModule').controller('satisfactionDegreeController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
           // addLook:addLook,

        };
        

        
    }
]);;
// Source: app/know_index/applicationAnalysis/js/controller/sessionDetails_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('applAnalysisModule').controller('sessionDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            addLook:addLook,

        };
        function addLook(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/sessionDetailsDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }

        
    }
]);;
;
// Source: app/know_index/base/edit/edit.js
;
// Source: app/know_index/base/edit/edit_service.js
;
// Source: app/know_index/base/knowledge_item/directives/knowledge_item.js
knowledge_static_web
    .directive('knowledgeitem',[ 'KnowledgePortalService','ngDialog', function (KnowledgePortalService) {
        return {
            templateUrl: 'know_index/base/knowledge_item/directives/knowledge_item.html',
            restrict: 'E',
            replace: true,
            //scope:{},
            link: function (scope, element) {
                scope.focusKnowItem = function (knowItem) {
                    KnowledgePortalService.focus(knowItem)
                }

                scope.toShareKnowItem = function (selectedKnowItem) {
                    KnowledgePortalService.toShareKnowItem(selectedKnowItem)
                };

                scope.showCommentContainer = function (knowItemId) {
                    if($('#commentContent'+knowItemId).is(":hidden")){
                        $('#commentContent'+knowItemId).attr('class','show');
                        scope.comment = "";
                    }else{
                        $('#commentContent'+knowItemId).attr('class','hide');
                    }
                };

                scope.submitComment = function(knowItemId){
                    var comment = $('#commentContent'+knowItemId).find('textarea').val();
                    if(comment ==null ||  $.trim(comment)=='')
                        return;
                    KnowledgePortalService.replyKnowItem(knowItemId,comment);
                }
            }
        }
    }]);


;
// Source: app/know_index/base/page/page.js
/**
 * Created by Administrator on 2016/6/13.
 */
angular.module('pagination',[]).directive('pagination',[function(){
    return {
        restrict : 'EA',
        templateUrl: 'know_index/base/page/template.html',
        replace:true,
        scope:{
            conf:'='
        },
        link: function(scope,element,attrs){
            //改变当前页
            scope.changeCurrentPage = function(item){
                if(item == '...'){
                    return;
                }else{
                    scope.conf.currentPage = item;
                    $(window).scrollTop(0);

                }
            };

            function getPagination(newValve, oldValue){
                //console.log(newValve);
                //当前页
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;

                //总条数
                scope.conf.totalItems = parseInt(scope.conf.totalItems) ? parseInt(scope.conf.totalItems) : 0;

                //每页条目数(default:15)
                scope.conf.pageSize = parseInt(scope.conf.pageSize) ? parseInt(scope.conf.pageSize) : 15;

                //总页数
                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.pageSize);

                if(scope.conf.currentPage < 1){
                    scope.conf.currentPage = 1;
                }

                //页数上限限制
                if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }

                //跳转页数
                scope.jumpPageNum = scope.conf.currentPage;

                scope.pageList = [];
                if(scope.conf.numberOfPages <= scope.conf.pagesLength){
                    //总页数如果小于等于分页的长度，则直接显示
                    for(var i = 1; i <= scope.conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = scope.conf.pagesLength % 2 == 0 ?  scope.conf.pagesLength / 2 : (scope.conf.pagesLength - 1 ) / 2;
                    if(scope.conf.currentPage <= offset){
                        //左边没有‘...’
                        for(var i = 1; i <= offset+1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset; i >= 1; i--){
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else{
                        //两边都有‘...’
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(var i = Math.ceil(offset/2)-1; i >=1; i--){
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);

                        for(var i = 1; i <= (offset/2); i++){
                            scope.pageList.push(scope.conf.currentPage + i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }
                if(scope.conf.onClick){
                    // 防止初始化两次请求问题
                    if(!(oldValue != newValve && oldValue[0] == 0)) {
                        scope.conf.onClick(scope.conf);
                    }
                }
                //scope.$parent.paginationConf = scope.conf;
                //console.log("执行一次");
                if(scope.conf.target){
                    scope.conf.target.currentPage = scope.conf.currentPage;
                }else if(scope.$parent.SearchPOJO){
                    scope.$parent.SearchPOJO.currentPage = scope.conf.currentPage;
                }else if(scope.conf.methodFn){
                	scope.conf.methodFn(scope.conf);
                }
            }
            
            //上一页
            scope.prevPage = function(){
                if(scope.conf.currentPage > 1){
                    scope.conf.currentPage -= 1;
                }
            }
            //下一页
            scope.nextPage = function(){
                if(scope.conf.currentPage < scope.conf.numberOfPages){
                    scope.conf.currentPage += 1;
                }
            }
            //检查输入
            scope.checkInput=function(){
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
            }
            // 跳转页
            scope.jumpToPage = function (e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    if(scope.jumpPageNum !== ''){
                        scope.conf.currentPage = scope.jumpPageNum;
                    }
                }
            }
            scope.$watch(function(){
                return scope.conf.totalItems +' '+scope.conf.currentPage +' '+scope.conf.pageSize;
            },getPagination);
        }
    }
}]);
;
// Source: app/know_index/base/repalace/replace.js
/**
* Created by 41212 on 2017/3/31.
*/
angular.module('knowledge_static_web').filter('strReplace', function () {
    return function (value) {
        return value.replace(/；/g,'，') ;
    };
});
//angular.module('knowledge_static_web').filter('strReplace', function () {
//    return function (value) {
//        return value.replace(/，/g,'；') ;
//    };
//});;
// Source: app/know_index/base/repeat_finished/repeat_finished.js
knowledge_static_web
    .directive('onRenderFinish', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                if (scope.$last === true) {    //判断是否是最后一条数据
                    scope.$emit('onRenderFinish'); //向父级scope传送ngRepeatFinished命令
                    console.log("onRenderFinish");
                }
            }
        };
    }]);


;
// Source: app/know_index/base/tip/directives/tip.js
knowledge_static_web
    .directive('alertBar', [function () {

        return {
            restrict: 'EA',
            templateUrl: 'know_index/base/tip/directives/tip.html',
            scope : {
                message : "=",
                type : "="
            },
            link: function(scope, element, attrs){

                scope.hideAlert = function() {
                    scope.message = null;
                    scope.type = null;
                };

            }
        };
        //
        // return {
        //     restrict: 'EA',
        //     templateUrl: 'know_index/base/tip/directives/tip.html',
        //     //template: "<h3 ng-transclude>Hello, Directive,</h3>",
        //     scope: {
        //         message: "=",
        //         type: "="
        //     },
        //     // replace:false,
        //     // transclude: true,
        //     link: function (scope, element, attrs) {
        //         element.click(function(){
        //             $('.popup_info_tip').show();
        //         })
        //         scope.confirm = function () {
        //             scope.flag = true;
        //             scope.$parent.flag = true;
        //             scope.$parent.$parent.flag = true;
        //
        //         };
        //
        //         scope.hideAlert = function () {
        //             scope.message = null;
        //             scope.type = null;
        //         };
        //
        //     }
        // };
    }]);

;
// Source: app/know_index/base/tip/directives/tip_service.js
/**
 * Created by Administrator on 2016/7/8.
 */
knowledge_static_web
    .factory('TipService', ['$timeout', function($timeout) {
        var tipService = {
            message : null,
            type : null,
            setMessage : function(msg,type){
                this.message = msg;
                this.type = type;

                //提示框显示最多3秒消失
                var _self = this;
                $timeout(function(){
                    //console.log("after 3 s doing")
                    _self.clear();
                },3000);
            },
            clear : function(){
                this.message = null;
                this.type = null;
            }
        };

        return tipService;
    }]);;
// Source: app/know_index/base/weightFilter/weightFilter.js
/**
* Created by 41212 on 2017/3/31.
*/
angular.module('knowledge_static_web').filter('weightFilter', function () {
    return function (value) {
        switch (value){
            case 1 : return "极不重要";
                break;
            case 2 : return "不重要";
                break;
            case 3 : return "一般";
                break;
            case 4 : return "重要";
                break;
            case 5 : return "极重要";
                break;
        }
    };
});
//angular.module('knowledge_static_web').filter('strReplace', function () {
//    return function (value) {
//        return value.replace(/，/g,'；') ;
//    };
//});;
// Source: app/know_index/base/window_template/knowItem_delete/knowItem_delete_controller.js
/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */
knowledge_static_web.controller('knowItemDeleteController',
    ['$scope', 'KnowledgeManagementService','TipService','KnowledgePortalService',
        function ($scope, KnowledgeManagementService,TipService,KnowledgePortalService) {



    $scope.knowItemDelete = function(){
        var knowItemId = $scope.ngDialogData.selectedKnowItem.id;
        if(knowItemId ==null || knowItemId ==''){
            TipService.setMessage('知识条目ID不能为空', 'warning ');
            return;
        }
        KnowledgePortalService.deleteKnowItem(knowItemId);

    }
}]);
// Source: app/know_index/base/window_template/knowItem_share/knowItem_share_controller.js
/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */
knowledge_static_web.controller('knowItemShareController',
    ['$scope', 'KnowledgeManagementService','TipService','KnowledgePortalService',
        function ($scope, KnowledgeManagementService,TipService,KnowledgePortalService) {

    
    KnowledgeManagementService.get({}, function (result) {
        if (result.status == 200 && result.data.list.length > 0) {
            $scope.knowLibraries = result.data.list;
        }
    })
            
    $scope.knowItemShare = function(){
        var knowItemId = $scope.ngDialogData.selectedKnowItem.id;
        if($scope.selectedKnowLibrary ==null || $scope.selectedKnowLibrary ==''){
            TipService.setMessage('请选定知识库', 'warning ');
            return;
        }
        if(knowItemId ==null && $knowItemId == ''){
            TipService.setMessage('请选定知识条目', 'warning ');
            return;
        }
        KnowledgePortalService.share(knowItemId,$scope.selectedKnowLibrary);

    }
}]);
// Source: app/know_index/businessModeling/js/controller/aggregateConceptManage_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('aggregateConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addCollective : addCollective,
            editCollective : editCollective,
            deleteCollective:deleteCollective,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "collectiveConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
                    "collectiveConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editCollective(item){
            $scope.vm.dialogTitle="编辑集合概念";
            $scope.vm.key = item.collectiveConceptKey;
            $scope.vm.term =  item.collectiveConceptTerm;
            $scope.vm.weight =  item.collectiveConceptWeight;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "collectiveConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/collective/listByModifier",{
                "collectiveConceptModifier":$scope.vm.searchVal,
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "collectiveConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "collectiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "collectiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/collective/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var  key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addCollective(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/collective/repeatCheck",{
                            "collectiveConceptApplicationId": $scope.vm.applicationId,
                            "collectiveConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
                                    "collectiveConceptApplicationId": $scope.vm.applicationId,
                                    "collectiveConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改集合概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].collectiveConceptKey;
                                    $scope.vm.term =  data.data[0].collectiveConceptTerm;
                                    $scope.vm.weight =  data.data[0].collectiveConceptWeight;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加集合概念";
                                $scope.vm.term="";
                                $scope.vm.weight="1" ;   //默認權重
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog2.html",
                scope: $scope,
                Returns : {a:1},
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCollective(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/collective/update",{
                "collectiveConceptId":item.collectiveConceptId,
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "collectiveConceptKey": $scope.vm.key,
                "collectiveConceptModifier": item.collectiveConceptModifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                console.log(item);
                console.log(item.collectiveConceptId,$scope.vm.applicationId,$scope.vm.key,typeof $scope.vm.modifier,$scope.vm.term, $scope.vm.weight);
                console.log(data);
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/collective/add",{
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "collectiveConceptKey":  $scope.vm.key,
                "collectiveConceptModifier": $scope.vm.modifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                //console.log(data);
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/collective/delete",{
                "collectiveConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload();
            },function(){
                layer.msg("刪除失敗")
            });
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);

;
// Source: app/know_index/businessModeling/js/controller/businessConceptManage_controller.js

/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('businessConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addBusiness : addBusiness,
            editBusiness : editBusiness,
            deleteBusiness:deleteBusiness,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "businessConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        init(1);
        //请求列表
        function init(index){
            httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败");
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editBusiness(item){
            $scope.vm.dialogTitle="编辑业务概念";
            $scope.vm.key = item.businessConceptKey;
            $scope.vm.term =  item.businessConceptTerm;
            console.log($scope.vm.term);
            $scope.vm.weight =  item.businessConceptWeight;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "businessConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            httpRequestPost("/api/modeling/concept/business/listByModifier",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                $scope.vm.listData = data.data;
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "businessConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                     key: $scope.vm.searchVal,
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( "time"+$scope.vm.timeStart,$scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/business/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
       var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addBusiness(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/business/repeatCheck",{
                            "businessConceptApplicationId": $scope.vm.applicationId,
                            "businessConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                                    "businessConceptApplicationId": $scope.vm.applicationId,
                                    "businessConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改业务概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].businessConceptKey;
                                    $scope.vm.term =  data.data[0].businessConceptTerm;
                                    $scope.vm.weight =  data.data[0].businessConceptWeight;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加业务概念";
                                $scope.vm.term="";
                                $scope.vm.weight="3" ;   //默認權重
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item);
                    }else{
                         $scope.vm.key = "";
                         $scope.vm.term = "";
                         $scope.vm.weight =  1;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteBusiness(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/business/update",{
                "businessConceptId":item.businessConceptId,
                "businessConceptApplicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": item.businessConceptModifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                if (data) {
                    console.log(data);
                }
                layer.msg("编辑成功");
                $state.reload();
            },function(){
                layer.msg("编辑失败");
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/business/add",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": $scope.vm.modifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                if (data) {
                    console.log(data);
                }
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/business/delete",{
                "businessConceptId":id
            },function(data){
                if (data) {
                    console.log(data);
                }
               layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);;
// Source: app/know_index/businessModeling/js/controller/businessModeling_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('businessModelingController', [
    '$scope', "$state", "$stateParams",
    function ($scope,$state, $stateParams) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        //$scope.vm = {
        //    isSlide : isSlide,
        //};
        //function isSlide(event){
        //    var self=event.target;
        //    if($(self).hasClass("slideActive")){
        //        $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
        //    }else{
        //        $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
        //    }
        //}
    }
]);;
// Source: app/know_index/businessModeling/js/controller/disableConceptManage_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('disableConceptManageController', [
'$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            list :[{stopConceptKey:'eidtcart',stopConceptTerm:'重要',stopConceptModifier:'admin'}],
            applicationId : getCookie("applicationId"),
            addStop : addStop,
            editStop : editStop,
            deleteStop:deleteStop,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "stopConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/stop/listByAttribute",{
                "stopConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/stop/listByAttribute",{
                    "stopConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editStop(item){
            $scope.vm.dialogTitle="编辑停用概念";
            $scope.vm.key = item.stopConceptKey;
            $scope.vm.term =  item.stopConceptTerm;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "stopConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/stop/listByModifier",{
                "stopConceptModifier":$scope.vm.searchVal,
                "stopConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "stopConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "stopConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "stopConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/stop/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var  key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addStop(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/disable/disableConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/stop/repeatCheck",{
                            "stopConceptApplicationId": $scope.vm.applicationId,
                            "stopConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/stop/listByAttribute",{
                                    "stopConceptApplicationId": $scope.vm.applicationId,
                                    "stopConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改停用概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].stopConceptKey;
                                    $scope.vm.term =  data.data[0].stopConceptTerm;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加停用概念";
                                $scope.vm.term="";
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/disable/disableConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteStop(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/stop/update",{
                "stopConceptId":item.stopConceptId,
                "stopConceptApplicationId": $scope.vm.applicationId,
                "stopConceptKey":  $scope.vm.key,
                "stopConceptModifier": item.stopConceptModifier,
                "stopConceptTerm": $scope.vm.term,
            },function(data){
                console.log(item);
                console.log(item.stopConceptId,$scope.vm.applicationId,$scope.vm.key,typeof $scope.vm.modifier,$scope.vm.term);
                console.log(data);
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/stop/add",{
                "stopConceptApplicationId": $scope.vm.applicationId,
                "stopConceptKey":  $scope.vm.key,
                "stopConceptModifier": $scope.vm.modifier,
                "stopConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/stop/delete",{
                "stopConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);
;
// Source: app/know_index/businessModeling/js/controller/errorCorrectionConceptManage_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('errorCorrectionConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            list :[{correctionConceptKey:'eidtcart',correctionConceptTerm:'重要',correctionConceptModifier:'admin'}],
            applicationId : getCookie("applicationId"),
            addCorrection : addCorrection,
            editCorrection : editCorrection,
            deleteCorrection:deleteCorrection,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "correctionConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/correction/listByAttribute",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/correction/listByAttribute",{
                    "correctionConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editCorrection(item){
            $scope.vm.dialogTitle="编辑纠错概念";
            $scope.vm.key = item.correctionConceptKey;
            $scope.vm.term =  item.correctionConceptTerm;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "correctionConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/correction/listByModifier",{
                "correctionConceptModifier":$scope.vm.searchVal,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "correctionConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "correctionConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "correctionConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/correction/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addCorrection(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/correction/repeatCheck",{
                            "correctionConceptApplicationId": $scope.vm.applicationId,
                            "correctionConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/correction/listByAttribute",{
                                    "correctionConceptApplicationId": $scope.vm.applicationId,
                                    "correctionConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改纠错概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].correctionConceptKey;
                                    $scope.vm.term =  data.data[0].correctionConceptTerm;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加纠错概念";
                                $scope.vm.term="";
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCorrection(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/correction/update",{
                "correctionConceptId":item.correctionConceptId,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": item.correctionConceptModifier,
                "correctionConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/correction/add",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": $scope.vm.modifier,
                "correctionConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/correction/delete",{
                "correctionConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);;
// Source: app/know_index/businessModeling/js/controller/factorNewFrame_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('factorNewFrameController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
        
        $state.go("factorNewFrame.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            

        };

        


    }
]);;
// Source: app/know_index/businessModeling/js/controller/faqNewFrame_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('faqNewFrameController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
        
        $state.go("faqNewFrame.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            

        };

        


    }
]);;
// Source: app/know_index/businessModeling/js/controller/frameworkLibrary_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('businessModelingModule').controller('frameworkLibraryController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
        $state.go("frameworkLibrary.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            addFramework: addFramework,
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal:""  //bot 内容
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        //加载业务树
        initBot();
        //点击 root 的下拉效果
        function knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function initBot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                console.log("err or err")
            });
        }
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            console.log($scope.vm.botSelectValue);
            //加载对应类目下的框架库
            loadFrameLibrary();
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            appendTree(this);
        });
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId": categoryApplicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span ng-click="vm.botValChange('+data.data[i].categoryName+')" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown();
                    }
                },function(err){
                    console.log(err);
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%")
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        }

        //加载对应类目下的框架库
        function loadFrameLibrary(){
            httpRequestPost("/api/modeling/frame/listbyattribute",{
                "frameCategoryId": $scope.vm.botSelectValue,
                "frameEnableStatusId": 1,
                "index": 0,
                "pageSize": 10
            },function(data){
                $("#frame-library").empty();
                if(data.data){
                    var html = "";
                    for(var i=0;i<data.data.length;i++){
                        if(i%2==0){
                            html += '<div class="libraryRthCnt" data-option="'+data.data[i].frameId+'">';
                        }else{
                            html += '<div class="libraryRthCnt even" data-option="'+data.data[i].frameId+'">';
                        }
                        html += '   <img src="../../images/images/libTxt_22.png"/>'+
                                '   <p>银行邻域业务框架</p>'+
                                '   <div>' +
                                '      <a href="javascript:;">'+data.data[i].frameTitle+'</a>' +
                                '   </div>'+
                                '</div>';
                    }
                    $("#frame-library").append(html);
                }
            },function(err){
                console.log(err);
            });
        }
        function addFramework(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/frameworkLibraryDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        


    }
]);;
// Source: app/know_index/businessModeling/js/controller/intentionConceptManage_controller.js
/**
* Created by 41212 on 2017/3/23.
*/
/**
* Created by Administrator on 2016/6/3.
* 控制器
*/

angular.module('businessModelingModule').controller('intentionConceptManageController', [
'$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            list :[{forceSegmentConceptKey:'eidtcart',forceSegmentConceptTerm:'重要',forceSegmentConceptModifier:'admin'}],
            applicationId : getCookie("applicationId"),
            addForceSegment : addForceSegment,
            editForceSegment : editForceSegment,
            deleteForceSegment:deleteForceSegment,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "forceSegmentConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/forceSegment/listByAttribute",{
                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/forceSegment/listByAttribute",{
                    "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(){
                    getAggre(current);
                },function(){
                })
            }
        });
        //编辑
        function editForceSegment(item){
            $scope.vm.dialogTitle="编辑强制分词概念";
            $scope.vm.key = item.forceSegmentConceptKey;
            $scope.vm.term =  item.forceSegmentConceptTerm;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "forceSegmentConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/forceSegment/listByModifier",{
                "forceSegmentConceptModifier":$scope.vm.searchVal,
                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "forceSegmentConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/forceSegment/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addForceSegment(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/intention/intentionConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/forceSegment/repeatCheck",{
                            "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                            "forceSegmentConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/forceSegment/listByAttribute",{
                                    "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                                    "forceSegmentConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改强制分词概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].forceSegmentConceptKey;
                                    $scope.vm.term =  data.data[0].forceSegmentConceptTerm;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加强制分词概念";
                                $scope.vm.term="";
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/intention/intentionConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteForceSegment(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/forceSegment/update",{
                "forceSegmentConceptId":item.forceSegmentConceptId,
                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                "forceSegmentConceptKey":  $scope.vm.key,
                "forceSegmentConceptModifier": item.forceSegmentConceptModifier,
                "forceSegmentConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/forceSegment/add",{
                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
                "forceSegmentConceptKey":  $scope.vm.key,
                "forceSegmentConceptModifier": $scope.vm.modifier,
                "forceSegmentConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/forceSegment/delete",{
                "forceSegmentConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);

;
// Source: app/know_index/businessModeling/js/controller/sensitiveConceptManage_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('sensitiveConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addSensitive : addSensitive,
            editSensitive : editSensitive,
            deleteSensitive:deleteSensitive,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "sensitiveConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editSensitive(item){
            $scope.vm.dialogTitle="编辑敏感概念";
            $scope.vm.key = item.sensitiveConceptKey;
            $scope.vm.term =  item.sensitiveConceptTerm;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "sensitiveConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/sensitive/listByModifier",{
                "sensitiveConceptModifier":$scope.vm.searchVal,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "sensitiveConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addSensitive(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/sensitive/sensitiveConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/sensitive/repeatCheck",{
                            "sensitiveConceptApplicationId": $scope.vm.applicationId,
                            "sensitiveConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                                    "sensitiveConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改敏感概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].sensitiveConceptKey;
                                    $scope.vm.term =  data.data[0].sensitiveConceptTerm;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加敏感概念";
                                $scope.vm.term="";
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/sensitive/sensitiveConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSensitive(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id);
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/sensitive/update",{
                "sensitiveConceptId":item.sensitiveConceptId,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": item.sensitiveConceptModifier,
                "sensitiveConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("编辑成功");
                $state.reload();
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/sensitive/add",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": $scope.vm.modifier,
                "sensitiveConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload();
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/sensitive/delete",{
                "sensitiveConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload();
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);;
// Source: app/know_index/businessModeling/js/controller/synonyConceptManage_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('synonyConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addSynonym : addSynonym,
            editSynonym : editSynonym,
            deleteSynonym:deleteSynonym,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "synonymConceptKey",
            timeStart : "",
            timeEnd : "",
            //searchTypeList : [{name:"synonymConceptKey",value:"概念类名"},{name:"synonymConceptWeight",value:"概念类权重"},{name:"synonymConceptTerm",value:"同义词"},{name:"synonymConceptModifier",value:"创建人"},{name:"synonymConceptModifyTime",value:"上传日期"}],
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/synonym/listByAttribute",{
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/synonym/listByAttribute",{
                    "synonymConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editSynonym(item){
            $scope.vm.dialogTitle="编辑同义概念";
            $scope.vm.key = item.synonymConceptKey;
            $scope.vm.term =  item.synonymConceptTerm;
            $scope.vm.weight =  item.synonymConceptWeight;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "synonymConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            httpRequestPost("/api/modeling/concept/synonym/listByModifier",{
                "synonymConceptModifier":$scope.vm.searchVal,
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "synonymConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "synonymConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "synonymConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/synonym/listByModifier",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addSynonym(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/synonymModeling/synony/synonyConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/synonym/repeatCheck",{
                            "synonymConceptApplicationId": $scope.vm.applicationId,
                            "synonymConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/synonym/listByAttribute",{
                                    "synonymConceptApplicationId": $scope.vm.applicationId,
                                    "synonymConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改同义概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].synonymConceptKey;
                                    $scope.vm.term =  data.data[0].synonymConceptTerm;
                                    $scope.vm.weight =  data.data[0].synonymConceptWeight;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加同义概念";
                                $scope.vm.term="";
                                $scope.vm.weight="1" ;   //默認權重
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/synonymModeling/synony/synonyConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSynonym(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/synonymModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/synonym/update",{
                "synonymConceptId":item.synonymConceptId,
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "synonymConceptKey":  $scope.vm.key,
                "synonymConceptModifier": item.synonymConceptModifier,
                "synonymConceptTerm": $scope.vm.term,
                "synonymConceptWeight": $scope.vm.weight
            },function(data){
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/synonym/add",{
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "synonymConceptKey":  $scope.vm.key,
                "synonymConceptModifier": $scope.vm.modifier,
                "synonymConceptTerm": $scope.vm.term,
                "synonymConceptWeight": $scope.vm.weight
            },function(data){
                console.log(data);
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/synonym/delete",{
                "synonymConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
    }
]);;
// Source: app/know_index/businessModeling/js/filter/weight.js
/**
 * Created by 41212 on 2017/4/6.
 */
angular.module('knowledge_static_web').filter('faqWeight', function () {
    return function (val) {
        var result;
        if(val == 60){
            result = "普通"
        }else{
            result = "否定"
        }
        return result
    };
});;
;
// Source: app/know_index/functionalTesting/js/controller/functionalTest_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

          
angular.module('functionalTestModule').controller('functionalTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("functionalTest.questionTest",{userPermission:$stateParams.userPermission});
        $scope.vm = {

        };


    }
]);;
// Source: app/know_index/functionalTesting/js/controller/questionTest_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('questionTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {

        };

        
    }
]);;
// Source: app/know_index/functionalTesting/js/controller/sessionTest_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('sessionTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {

        };

        
    }
]);;
;
// Source: app/know_index/home/js/controller/homePageNav_controller.js
/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('homePage').controller('homePageNavController', [

    '$scope', '$location', 'localStorageService', 'AuthService',"$timeout", function ($scope, $location, localStorageService, AuthService,$timeout) {
            $scope.vm = {
                applicatioinId : true
            };
        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
]);
// Source: app/know_index/home/js/controller/honePage_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('homePage').controller('homePageController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$state", function ($scope, $location, localStorageService, AuthService,$state) {
        //默认跳转到
        $state.go("homePage.define")
    }
]);
;
// Source: app/know_index/index/js/controller/index_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('indexModule').controller('indexController', [
    '$scope', '$location', "$interval", "$timeout", "$state",
    "IndexService", "AuthService","PersonalCenterService",
    function ($scope, $location, $interval, $timeout, $state,
              IndexService , AuthService,PersonalCenterService) {

        var self = this;

        // //页面跳转
        // self.goUrl = function(menu,menuClick){
        //     if(!$location.absUrl().split('/index/')[1] || menuClick){
        //         $state.go(menu.url);
        //     }
        // }
        $scope.active = function(path){
            var url = $location.absUrl();
            return new RegExp(path).test(url)?'active':"";
        };
        //加载左侧树
        // self.loadLeftTree = function(topMenu,menuClick){
        //     IndexService.queryTopButtons({menuId: topMenu.id}, function (result) {
        //         $scope.treeButtons = result.data;
        //         if (result.data.length > 0) {
        //             self.goUrl(result.data[0],menuClick);
        //         }else{
        //             self.goUrl(topMenu,menuClick);
        //         }
        //     });
        // }

        //头菜单的点击事件
        // $scope.changeTopMenu = function(item){
        //     var currentState = $state.$current.name;
        //     if(currentState != item.url)
        //         self.loadLeftTree(item,true);
        // }

        //定义退出登录的方法
        $scope.logout = function () {
            AuthService.logout(function (data) {
                
            }, function (errMsg) {
                $scope.errMsg = errMsg;
            });
        };

        //添加服务器请求 获取当前用户登录信息
        AuthService.checkLoginStatus({}, function (data) {
            $scope.setCurrentUser(data);
        });


        //存放权限集合
        var permissionList =[];
        //添加服务器请求 获取当前用户登录信息
        AuthService.checkLoginStatus({}, function (data) {
            $scope.setCurrentUser(data);
            permissionList = data.privileges;
        });

        //跳转
        $scope.toBack = function () {
            if(permissionList.indexOf('back.gateway')!= -1) {
                $state.go('back.gateway')
                return;
            }
            if(permissionList.indexOf('back.task')!= -1) {
                $state.go('back.task')
                return;
            }
            if(permissionList.indexOf('back.manageBase')!= -1) {
                $state.go('back.manageBase')
                return;
            }
            if(permissionList.indexOf('back.application')!= -1) {
                $state.go('back.application')
                return;
            }
            if(permissionList.indexOf('back.system')!= -1) {
                $state.go('back.system')
                return;
            }
        }

        //加载头菜单
        // IndexService.queryTopButtons({menuId: 0}, function (result) {
        //     if (result.data.length > 0) {
        //         $scope.topButtons = result.data;
        //         for(var i=0;i<result.data.length;i++){
        //             var menu = result.data[i];
        //             if($location.absUrl().indexOf(menu.url.split('.')[1])>0){
        //                 self.loadLeftTree(menu);
        //                 return;
        //             }
        //         }
        //         self.loadLeftTree(result.data[0]);
        //     }
        // });
        //加载主页时钟
        // $interval(function () {
        //     $scope.now = new Date();
        // }, 1000);

        // $scope.initKnowCheckNoticeView = function(){
        //     PersonalCenterService.connKnowCheckNoticeCon.get(
        //         {
        //             flag:1,
        //             pageNo:$scope.SearchPOJO.currentPage,
        //             pageSize:5
        //         },function(resource){
        //             var resultData = resource.data;
        //             // $("#knowCheckNotice").css("display","block");
        //             $scope.resultCheckNoticeList = resultData.data;
        //             $scope.resultCheckNoticeTotal = resultData.total;
        //             // console.log($scope.resultCheckNoticeTotal);
        //         })
        // }
        // $scope.initKnowCheckNoticeView();

    }
]);
;
// Source: app/know_index/knowledgeManagement/js/controller/NewFactorKnow_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('NewFactorKnowController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
          fagAdd : factorAdd
        };
        function listAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/knowledgeManagementFaqDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/knowledgeManagement/js/controller/concept_controller.js
/**
 * Created by 41212 on 2017/3/28.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('knowledgeSingleAddConceptController', [
    '$scope', 'localStorageService' ,'$timeout',"$state" ,"ngDialog","$cookieStore","FileUploader",
    function ($scope,localStorageService,$timeout, $state,ngDialog,$cookieStore,FileUploader) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            framework : ['信用卡办理','金葵花卡办理流程','黑金卡办理流程'],      //业务框架
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            botSelectValue:"",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,            
            knowledgeTitle : "",   //标题
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            titleGroup : "", //点击标题添加内容
            channels : "",     //渠道
            dimensions : ""    //维度
        };

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
      //{
    //    "categoryApplicationId": "360619411498860544",
    //    "categoryPid": "root"
      //}
        getBotRoot();
    //    getDimensions();
    //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
                $timeout(function(){
                    $(ele).next().slideToggle();
                },50)
        }        

       //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": $scope.vm.applicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                alert("err or err")
            });
        }
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
       $(".aside-navs").on("click",'.icon-jj',function(){
           var id = $(this).attr("data-option");
           var that = $(this);
           if(!that.parent().parent().siblings().length){
               that.css("backgroundPosition","0% 100%")
               httpRequestPost("/api/modeling/category/listbycategorypid",{
                   "categoryApplicationId": $scope.vm.applicationId,
                   "categoryPid": id
               },function(data){
                   if(data.data){
                       var  html = '<ul class="menus">';
                       for(var i=0;i<data.data.length;i++){
                           html+= '<li>' +
                               '<div class="slide-a">'+
                               ' <a class="ellipsis" href="javascript:;">'+
                               '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                               '<span>'+data.data[i].categoryName+'</span>'+
                               '</a>' +
                               '</div>' +
                               '</li>'
                       }
                       html+="</ul>";
                       $(html).appendTo((that.parent().parent().parent()));
                       that.parent().parent().next().slideDown()
                   }
               },function(err){
                        alert(err)
               });
           }else{
               if(that.css("backgroundPosition")=="0% 0%"){
                   that.css("backgroundPosition","0% 100%");
                   that.parent().parent().next().slideDown()
               }else{
                   that.css("backgroundPosition","0% 0%");
                   that.parent().parent().next().slideUp()
               }
           }
       });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////

        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
        });

       function KnowledgeAdd(){
           var dialog = ngDialog.openConfirm({
               template:"/know_index/knowledgeManagement/concept/knowledgeAddSingleConceptDialog.html",
               //controller:function($scope){
               //    $scope.show = function(){
               //
               //        console.log(6688688);
               //        $scope.closeThisDialog(); //关闭弹窗
               //    }},
               scope: $scope,
               closeByDocument:false,
               closeByEscape: true,
               showClose : true,
               backdrop : 'static',
               preCloseCallback:function(e){    //关闭回掉
                   if(e === 1){
                   }
               }
           });
       }


        //
        //{
        //    "accessToken": "string",
        //    "applicationDescription": "string",
        //    "applicationId": "string",
        //    "applicationLisence": "string",
        //    "applicationName": "string",
        //    "requestId": "string",
        //    "sceneId": "string",
        //    "statusId": 0,
        //    "userId": "string"
        //}
        //維度
        //getDimensions();
        function  getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data
                }
                console.log(data)
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });
        }
        //渠道
        getChannel();
        function  getChannel(){
            //console.log($scope.vm.applicationId);
            //
            //httpRequestPost("/api/elementKnowledgeAdd/loadChannel",{
            //    "applicationId" :"360619411498860540"
            //},function(data){
            //    console.log(data);
            //},function(err){
            //    layer.msg("连接网路失败")
            //}) /api/applicationannelstChannels
            httpRequestPost("/api/application/channel/dimension/list",{
                //"applicationId": "360619411498860544"
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data
                }
                 console.log(data)
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }





    }
]);;
// Source: app/know_index/knowledgeManagement/js/controller/factor_controller.js
/**
 * Created by 41212 on 2017/3/28.
 */


/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('knowledgeEssentialController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            aa : {list:["s","a","z"]},
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,
            knowledgeTitle : "",   //标题
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            titleGroup : "", //点击标题添加内容
            channels : "",
            a : function(){
                alert("ddddd")
            }

        };
        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
        });
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        //获取bot
        function getKnowledgeBot(){
            httpRequestPost("/api/user/userLogin",{

            },function(data){

            },function(err){

            });
        }
        //点击bot 下拉
        function knowledgeBot(ev,lev){
            var ele = ev.target;
            if(lev == 0){
                $(ele).next().slideToggle()
            }else{
                $(ele).css({backgroundPosition:"left bottom"}).parent().parent().next().slideToggle()
            }
        }
        //点击更改bot value
        function botValChange(val,id){
            $scope.vm.knowledgeBotVal = val;
        }
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
        function KnowledgeAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/essential/essentialDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        //維度
        function  getDimensions(){
            httpRequestPost("",{

            },function(data){

            },function(err){

            });
        }
        getChannel();
        //渠道
        function  getChannel(){
            httpRequestPost("/api/elementKnowledgeAdd/loadChannel",{
                "applicationId":"360619411498860544"
            },function(data){
                $scope.vm.channels = data.data;
                $scope.$apply();
                console.log(data)
            },function(err){

            });
        }


    }
]);;
// Source: app/know_index/knowledgeManagement/js/controller/knowManaFaq_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowManaFaqController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            faqAdd : faqAdd,
            faqEdit: faqEdit
        };
        function faqAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/faq/knowManaFaqDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        function faqEdit(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/faq/knowManaFaqDialog2.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/knowledgeManagement/js/controller/knowManaList_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 *
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowManaListController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
          fagAdd : listAdd
        };
        function listAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/knowledgeManagementFaqDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false     ,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/knowledgeManagement/js/controller/knowledgeManagement_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowledgeManagementController', [
    '$scope', 'localStorageService' ,"$state" ,function ($scope,localStorageService, $state) {
        $scope.vm = {
            userName: '',
            password: '',
        };

    }
]);;
// Source: app/know_index/knowledgeManagement/js/directive/logininput.js

knowledge_static_web.directive("loginInput", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {
            
           elem.on("focus",function(e){
                $(this).parents(".login-fItem").addClass("focus");
            }).on("blur",function(){
                $(this).parents(".login-fItem").removeClass("focus");
            });
        }
    }
});;
;
// Source: app/know_index/knowledge_details/js/controller/know_compare_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowCompareController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "DetailService","HomeService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              DetailService,HomeService) {
        /**
         * 初始化当前页参数
         */
        var self = this;

        $scope.knowItemIds = $stateParams.knowItemIds;
        
        self.queryCompareKnowItem = function(){
            DetailService.queryCompareKnowItem.get({knowItemIds:$scope.knowItemIds},function(resource){
                if (resource.status == 200 && resource.data.status == 200 && resource.data.data.totalCount ==2) {
                    $scope.knowItem1 = resource.data.data.knowledgeList[0];
                    $scope.knowItem2 = resource.data.data.knowledgeList[1];
                    var result = eq({ value1: $scope.knowItem1.content , value2: $scope.knowItem2.content })
                    
                    $scope.content1 = $sce.trustAsHtml(result.value1+"\r\n")
                    $scope.content2 = $sce.trustAsHtml(result.value2+"\r\n");

                }
            },function(){
                
            })
        }


        self.queryCompareKnowItem();
    }
])
;
// Source: app/know_index/knowledge_details/js/controller/know_details_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowDetailsController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams",
    "DetailService","HomeService","$sce","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,
              DetailService,HomeService,$sce,TipService ) {
        /**
         * 初始化当前页参数
         */
        var self = this;

        $scope.knowItemId = $stateParams.knowItemId;
        $scope.queryKey = $stateParams.queryKey;

        self.initSearch = function () {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            $scope.SearchPOJO.pageSize =3;
            $scope.SearchPOJO.queryPage = true;
            $scope.SearchPOJO.knowItemId = $stateParams.knowItemId;

            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };

            $scope.paginationConf1 = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        /**
         * 方法定义
         */
        //字数限制
        $scope.checkText = function (type,index) {
            if(type == 1){
                if ($scope.comment.length > 500) {
                    //alert("内容过长");
                    $scope.comment = $scope.comment.substr(0, 500);
                }
            }else if (type == 2){
                if ($scope.require[index].length > 500) {
                    //alert("内容过长");
                    $scope.require[index] = $scope.require[index].substr(0, 500);
                }
            }
        };
        
        //查询知识条目详情
        self.getKnowItemById = function(){
            DetailService.getKnowledgeDetail.get({
                id:$scope.knowItemId,
                queryKey:$scope.queryKey
            },function(resource){
                if(resource.status == 200){
                    $scope.knowItem = resource.data;
                    var know =  $scope.knowItem;
                    var title = $sce.trustAsHtml(know.title);
                    var content = $sce.trustAsHtml(know.content);
                    know.titleHtml = title;
                    know.contentHtml = content;
                }
            })
        }


        //查询关联的知识条目
        self.queryLinkKnowItems = function(){
            DetailService.queryLinkKnowItems.get({id:$scope.knowItemId},function(resource){
                if(resource.status == 200){
                    $scope.linkKnowItems = resource.data;
                }
            })
        }


        //查询该知识条目下的评论列表
        self.queryCommentByKnowItem = function(){
            DetailService.queryCommentByKnowItem.get({
                //type:0,
                knowItemId:$scope.SearchPOJO.knowItemId ,
                pageNo:$scope.SearchPOJO.currentPage ,
                pageSize:$scope.SearchPOJO.pageSize ,
                queryPage: $scope.SearchPOJO.queryPage
            },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.comments = resource.data.data.data;
                    $scope.paginationConf.totalItems = resource.data.data.total;

                }
            })
        }

        //查询该知识评论回复列表
        $scope.queryRequireByComment = function(userId){
            DetailService.queryRequireByComment.get({
                type:1,
                userId:userId ,
                knowItemId:$scope.SearchPOJO.knowItemId ,
                // pageNo:$scope.SearchPOJO.currentPage ,
                // pageSize:$scope.SearchPOJO.pageSize ,
                queryPage: $scope.SearchPOJO.queryPage
            },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.requires = resource.data.data.data;
                    //$scope.paginationConfRequire.total = resource.data.data.total;
                }
            })

        }


        //添加评论回复的方法
        $scope.require = [];
        $scope.addAnswer = function(knowItemId,targetId,index){
            var require = $scope.require[index];
            var flag = false;
            if(require == null){
                alert("回复不能为空！")
                return;
            }
            if(require != null){
                flag = true;
            }
            if(flag) {
                HomeService.createComment.save({
                    content: require,
                    knowItemId: knowItemId,
                    targetId: targetId,
                    type: 1
                }, function (resource) {
                    if (resource.status == 200) {
                        $scope.result = resource.data;
                        if ($scope.result) {
                            TipService.setMessage('回复成功!',"success");
                            //$scope.require[index] =null;
                            //$scope.queryRequireByComment();
                        } else {
                            TipService.setMessage('回复失败!',"error");
                        }
                    } else {
                        TipService.setMessage('回复失败!',"error");
                    }
                    $scope.SearchPOJO.currentPage = 1;
                    self.queryCommentByKnowItem();
                });
            }

        };

        
        //添加评论的方法
        $scope.addComment = function(){
            var comment = $scope.comment;
            var flag = false;
            if(comment == null || comment == ''){
                alert("评论不能为空！")
                return;
            }
            if(comment != null){
                flag = true;
            }
            if(flag) {
                HomeService.createComment.save({
                    content: comment,
                    knowItemId: $scope.knowItemId,
                    type:0,
                    targetId:$scope.knowItem.userId
                }, function (resource) {
                    if (resource.status == 200) {
                        $scope.comment = "";
                        TipService.setMessage('评论成功!',"success");
                    } else {
                        TipService.setMessage('评论失败!',"error");
                    }
                    $scope.SearchPOJO.currentPage = 1;
                    self.queryCommentByKnowItem();
                });
            }
        };


        //取消评论
        $scope.cancelComment = function(){
            $scope.comment = "";
        }

        //知识条目点赞
        $scope.likeKnowItem = function(status,knowItemId,libraryId,libName){
            // HomeService.agree.save({
            //     knowId:knowItemId,
            //     optType:3,
            //     libraryId:libraryId,
            //     libraryName:libName
            // },function (resource) {
            //     if(resource.status==500){
            //         $scope.result = resource.err;
            //         if($scope.result == "您已点赞！"){
            //             TipService.setMessage('已点赞!',"error");
            //         }
            //     }
            // });

            if(!status){
                HomeService.agree.save({
                    knowId:knowItemId,
                    optType:3,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('点赞成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }else if(status){
                HomeService.agree.save({
                    knowId:knowItemId,
                    optType:3,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('取消点赞成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }
        };

        //收藏知识条目
        $scope.collectKnowItem = function(status,knowItemId,libraryId,libName){
            if(!status){
                HomeService.collect.save({
                    knowId:knowItemId,
                    optType:4,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('收藏成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }else if(status){
                HomeService.collect.save({
                    knowId:knowItemId,
                    optType:4,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('取消收藏成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }

        };
        //判断是否可点赞
        $scope.canAgree = function(agreeStatus){
            if(agreeStatus){
                return "icon icoimg dz_s";
            }else{
                return "icon icoimg dz";
            }

        }
        //判断是否可收藏
        $scope.canCollect = function(collectStatus){
            if(collectStatus){
                return "icon icoimg sc_s";
            }else{
                return "icon icoimg sc";
            }
        }
        //删除回复
        $scope.deleteComment = function (commentId) {
            DetailService.deleteComment.save({
                commentId:commentId
            },function (resource) {
                if(resource.status==200){
                    TipService.setMessage('操作成功!',"success");
                    self.queryCommentByKnowItem();
                }else{
                    TipService.setMessage('操作失败!',"error");
                }
            });
        }

        self.initSearch();
        self.getKnowItemById();

        $scope.$watch('SearchPOJO',self.queryCommentByKnowItem,true)

    }
])
;
// Source: app/know_index/knowledge_details/js/controller/know_doc_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowDocController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "KnowDocService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              KnowDocService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.knowDocId = $stateParams.knowDocId;
        //alert($scope.knowDocId)

        self.getKnowDocInfo = function(){
            KnowDocService.queryDetailByDocId.save({
                    documentationId:$scope.knowDocId},
                function(resource){
                    if(resource.status == 200){
                        $scope.knowDoc = resource.data;
                    }

            },function(){
                
            })
        }

       



        self.getKnowDocInfo();
    }
])
;
// Source: app/know_index/knowledge_details/js/controller/know_edit_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowEditController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state","$sce",
    "DetailService",'TipService',
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,$sce,
              DetailService,TipService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.knowItemId = $stateParams.knowItemId;
        $scope.processInstanceId = $stateParams.processInstanceId;
        $scope.editFlg = false;
        $scope.pIdFlg = false;

        self.queryKnowItem = function(){
            DetailService.queryKnowItem.get({
                id:$scope.knowItemId
            },function(resource){
                if(resource.status == 200){
                    $scope.knowItem = resource.data
                    var know = $scope.knowItem;
                    var content = $sce.trustAsHtml(know.content);
                    $scope.knowItem.contentHtml = content
                }
            })
        }

        self.getProcessInstanceId  = function(){
            DetailService.getProcessInstanceId.get({
                businessKey:$scope.knowItemId
            },function(resource){
                if(resource.status == 200){
                   if(resource.data == null){
                       $scope.pIdFlg = true;
                   }
                }
            })
        }
        self.queryKnowItem();
        if($scope.processInstanceId == null){
            self.getProcessInstanceId();
        }else{
            $scope.pIdFlg = false;
        }


        //审核知识编辑
        $scope.updateKnowItem = function () {
            DetailService.updateKnowItem.save({
                knowid:$scope.knowItemId,
                title:$scope.knowItem.title,
                content:$scope.knowItem.content
            },function(resource){
                if (resource.status == 200)
                {
                    TipService.setMessage('操作成功!',"success");
                    $scope.editFlg = true;
                }else{
                    TipService.setMessage('操作失败!',"error");
                }
            }
            )
        }

        $scope.startWorkflow = function(){
            DetailService.startWorkflow.save({
                knowItemId:$scope.knowItemId,
                },function(resource){
                    if (resource.status == 200)
                    {
                        TipService.setMessage('流程已发起!',"success");
                    }else{
                        TipService.setMessage('操作失败!',"error");
                    }
                }
            )
        }

        $scope.content = "这是测试的编辑内容";

        $scope.ready = function(editor){
            alert(editor.getContent());
        }

    }
])
;
// Source: app/know_index/knowledge_details/js/controller/know_version_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowVersionController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams","$state",
    "DetailService","HomeService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,$state,
              DetailService,HomeService) {
        /**
         * 初始化当前页参数
         */
        var self = this;
        $scope.compareKnowItemIds = [];
        $scope.knowItemId = $stateParams.knowItemId;

        self.queryVersionByIdentity = function(){
            DetailService.queryVersionByIdentity.get({knowItemId:$scope.knowItemId},function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.knowItemList = resource.data.data.knowledgeList
                }
            },function(){

            })
        }

        $scope.toCompare = function(knowItemId){
            if($.inArray(knowItemId,  $scope.compareKnowItemIds) == -1){
                $scope.compareKnowItemIds.push(knowItemId)
            }else{
                $scope.compareKnowItemIds.splice(jQuery.inArray(knowItemId,$scope.compareKnowItemIds),1); ;
            }
        }

        $scope.exitCompare = function(){
            if($scope.compareKnowItemIds.length == 2){
                $state.go("index.version_compare",{knowItemIds:$scope.compareKnowItemIds});
            }else{
                alert("请选择两个需要比较的知识条目");
            }
        }

        self.queryVersionByIdentity();
    }
])
;
// Source: app/know_index/knowledge_details/js/controller/know_view_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowViewController', [
    '$scope', '$location','$anchorScroll', "$interval",  "$timeout", "ngDialog","$stateParams","$state",
    "DetailService","$sce","KnowDocService",
    function ($scope, $location,$anchorScroll, $interval, $timeout, ngDialog,$stateParams,$state,
              DetailService,$sce,KnowDocService) {
        var self = this;
        $scope.knowDocId = $stateParams.knowDocId;

        //根据知识文档id查询相关知识条目
        self.queryKnowItemsByDocId = function(){
            DetailService.queryKnowItemsByDocId.save(
                {
                    "documentationId": $scope.knowDocId,
                },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.docItems = resource.data.objs;
                    $scope.docItems.forEach(function(know){
                        var titleHtml = $sce.trustAsHtml(know.title);
                        var contentHtml = $sce.trustAsHtml(know.content);
                        know.titleHtml = titleHtml;
                        know.contentHtml = contentHtml
                    })
                }
            },function(){

            })
        }

        // self.queryKnowDocByDocId = function(){
        //     KnowDocService.queryDetailByDocId.save({
        //         "index": 0,
        //         "knowledgeDocumentation": {
        //             "documentationId": $scope.knowDocId,
        //     },
        //         "pageSize": 0,
        //         "requestId": "string",
        //     },function(resource){
        //             if(resource.status == 200){
        //                 $scope.knowDoc = resource.data;
        //             }
        //         },function(){
        //         })
        // }

        $scope.checkShow = function () {
            var url = $location.url();
            if(!url.toString().indexOf("/index/") > 0){
                return false;
            }else{
                return true;
            }
        }

        self.queryKnowItemsByDocId();
        //self.queryKnowDocByDocId();

        $scope.jumper = function (key) {
            $location.hash(key);
            $anchorScroll();
        }
    }
])



    .directive("contentMore",function(){
        return{
            restrict: "AE",
            link: function(scope, elem, attrs) {
                //回答
                elem.on("click",function(e){
                    e.stopPropagation();
                    $(this).parent().siblings('.dd').css('max-height','inherit').siblings('.dn').show();
                    $(this).hide().siblings('.less').show();
                });
            }
        }
    })
    .directive("contentLess",function(){
        return{
            restrict: "AE",
            link: function(scope, elem, attrs) {
                //回答
                elem.on("click",function(e){
                    e.stopPropagation();
                    $(this).parent().siblings('.dd').css('max-height','130px').siblings('.dn').hide();
                    $(this).hide().siblings('.edit_more').show();
                });
            }
        }
    });
;
// Source: app/know_index/knowledge_details/js/directives/detail_menu.js

/**
 * 打开回复框
 */
angular.module('knowDetailsModule').directive("answer", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {
            //回答
            elem.on("click",function(e){
                e.stopPropagation();
                $(this).parents("li").addClass("bg").find(".act-comment").show();
            });
        }
    }
});

/**
 * 取消回复
 */
angular.module('knowDetailsModule').directive("cancelAnswer", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {
            elem.on("click",function(e){
                $(this).parents(".act-comment").hide();
                $(this).parents("li").removeClass("bg");
            });
        }
    }
});

knowledge_static_web.directive("docView", function(RecursionHelper,PortalService) {
    return {
        restrict: "E",
        replace: true,
        template:'<div id="swfMain" style="height:600px;"></div>',
        link:function(scope, elem, attrs){
            $('#swfMain').FlexPaperViewer(
                { config : {
                    SwfFile: escape("/back/knowaccess/docimport/docmanager/viewKnowDoc/"+scope.knowDocId),
                    jsDirectory:'swf/print/FlexPaperViewer',
                    Scale : 0.6,
                    ZoomTransition : 'easeOut',
                    key: "@1bb10db124f45f30fb1$a98113c5cbb8921df84",
                    ZoomTime : 0.5,
                    ZoomInterval : 0.2,
                    FitPageOnLoad : false,
                    FitWidthOnLoad : true,
                    FullScreenAsMaxWindow : false,
                    ProgressiveLoading : false,
                    MinZoomSize : 0.2,
                    MaxZoomSize : 5,
                    SearchMatchAll : false,
                    InitViewMode : 'Portrait',
                    PrintPaperAsBitmap: false,
                    RenderingOrder : 'flash',
                    StartAtPage : '',
                    ViewModeToolsVisible : true,
                    ZoomToolsVisible : true,
                    NavToolsVisible : true,
                    CursorToolsVisible : true,
                    SearchToolsVisible : true,
                    localeChain: 'zh_CN'
                }}
            );
        }
    }
});






;
// Source: app/know_index/knowledge_details/js/directives/version_compare.js
/**
 * Created by Administrator on 2016/12/12.
 */

knowledge_static_web.directive("versionCompareRow", function() {
    return {
        restrict: "A",
        scope:{},
        link: function($scope, elem, attrs) {
            elem.on("click",function(e){
                if($(this).parents("tr").hasClass("on")){
                    $(this).parents("tr").removeClass("on");
                }else{
                    $(this).parents("tr").addClass("on");
                }
            });
        }
    }
});

knowledge_static_web.directive("versionCompareCombo", function() {
    return {
        restrict: "A",
        scope:{},
        link: function($scope, elem, attrs) {
            var evTimeStamp = 0;
            elem.click(function(e){
                var now = +new Date();
                if (now - evTimeStamp < 100) {
                    return;
                }
                evTimeStamp = now;
                console.log(2);
                if($(this).hasClass('my-checkbox-on')==true){
                    $(this).removeClass('my-checkbox-on');
                }
                else {
                    $(this).addClass('my-checkbox-on');
                }
            });
        }
    }
});

knowledge_static_web.directive("versionCompareRow", function() {
    return {
        restrict: "E",
        scope:{},
        link: function($scope, elem, attrs) {
            elem.on("click",function(e){
                if($(this).parents("tr").hasClass("on")){
                    $(this).parents("tr").removeClass("on");
                }else{
                    $(this).parents("tr").addClass("on");
                }
            });
        }
    }
});


;
;
// Source: app/know_index/login/js/controller/login_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('loginModule').controller('loginController', [
    '$scope', '$location', 'localStorageService' ,"$state" ,function ($scope, $location, localStorageService, $state) {

        $scope.vm = {
            userName: '',
            password: '',
            randomNumber: randomNumber(4),
            randomNumberValue: "",
            randomNumberChange : randomNumberChange,
            login: login,
            keyLogin : keyLogin
        };
       function keyLogin($event){
            if($event.keyCode==13){//回车
                login();
            }
        }
        //改变验证码
        function randomNumberChange(){
            $scope.vm.randomNumber = randomNumber(4)
        }
         //登陆
        function login(){
            //$state.go("materialManagement.chatKnowledgeBase",{userPermission : "['超级管理员','初级管理员']"});
            if($scope.vm.randomNumberValue.length==0){
                console.log($scope.vm.randomNumberValue);
                layer.msg("验证码不能为空")
            }else if($scope.vm.randomNumberValue!=$scope.vm.randomNumber){
                layer.msg("验证码错误");
            }else{
                //console.log($scope.vm.userName);
                httpRequestPost("/api/user/userLogin",{
                    "userName":$scope.vm.userName,
                    "userPassword":$scope.vm.password
                },function(data){
                    console.log(data);
                    // cookie   userName  userId
                    setCookie("userName" , $scope.vm.userName);
                    setCookie("userId" , data.data.userId);
                    $state.go("admin",{userPermission : data.data.roleList});
                    //console.dir(data.data.roleList)
                },function(err){
                    layer.msg("登陆失败");
                    //console.log(err)
                });
            }
        }

        //  随机产生四位验证码
        function randomNumber(number){
            var rnd="";
            for(var i=0;i<number;i++)
                rnd+=Math.floor(Math.random()*10);
            return rnd
        }

      //$scope.loginFailed = false;
      //
      //  $scope.login = function () {
      //      //校验表单数据
      //      var credentials = $scope.credentials;
      //      // console.log(credentials)
      //      if(!credentials.loginName){
      //          loginControllerScope.errMsg = '用户名不能为空';
      //          return;
      //      }
      //      if(!credentials.loginPwd){
      //          loginControllerScope.errMsg = '密码不能为空';
      //          return;
      //      }
      //      if(!credentials.randCheckCode){
      //          loginControllerScope.errMsg = '验证码不能为空';
      //          return;
      //      }
      //      AuthService.login($scope.credentials, function (data) {
      //          // console.log(data);
      //          loginControllerScope.setCurrentUser(data);
      //      }, function (errMsg) {
      //          loginControllerScope.loginFailed = true;
      //          loginControllerScope.errMsg = errMsg;
      //          credentials.randCheckCode='';
      //          $scope.reloadRandCheckCode();
      //      });
      //  }
      //
      //  $scope.reloadRandCheckCode = function () {
      //      document.getElementById("CreateCheckCode").src = document.getElementById("CreateCheckCode").src + "?nocache=" + new Date().getTime();
      //  }
      //
      //  $scope.reloadRandCheckCode();
      //
      //  $scope.enterEvent = function(e){
      //      loginControllerScope.errMsg = '';
      //      var keycode = window.event?e.keyCode:e.which;
      //      if(keycode==13){
      //          $scope.login();
      //      }
      //  }
    }
]);
;
// Source: app/know_index/materialManagement/js/controller/conceptChat_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('materialManagement').controller('conceptChatController', [
    '$scope',"$state","ngDialog","$stateParams", function ($scope,$state,ngDialog,$stateParams) {
        $state.go("materialManagement.conceptChat");
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        console.log("d",$stateParams.scanDataList);
        $scope.vm = {
            userName : getCookie("userName"),
            applicationId : getCookie("applicationId"),
            standardQuestion :  $stateParams.scanDataList?$stateParams.scanDataList.standardQuestion:null,   //标准问
            extendedQuestion : "",    //扩展问
            extendedQuestionArr : $stateParams.scanDataList?$stateParams.scanDataList.extendedQuestionArr:[],  //扩展问数组
            remove : remove ,
            weight : "60" ,         //  权重
            addExtension : addExtension ,  //添加扩展

            contentVal : "",
            contentArr : $stateParams.scanDataList?$stateParams.scanDataList.contentArr:[] ,
            addContentDialog : addContentDialog,// 添加知识内容
            save : save ,
            scan : scan,
            scanData : $stateParams.scanData
        };
        //擴展問
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.extendedQuestion , $scope.vm.extendedQuestionArr ,"chatQuestionContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkConceCptChatQuestion",{
                    "chatQuestionContent" : $scope.vm.extendedQuestion
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion);
                        obj.chatQuestionType = angular.copy($scope.vm.weight);
                        $scope.vm.extendedQuestionArr.push(obj);
                        $scope.vm.extendedQuestion = "";
                        $scope.$apply();
                        console.log($scope.vm.extendedQuestionArr)
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })
            }
        }
        function addContentDialog(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/faq/addContentDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addContent()
                    }
                }
            });
        }
        function addContent(){
            console.log();
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.contentVal , $scope.vm.contentArr ,"chatKnowledgeContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkChatKnowledgeContent",{
                    "chatKnowledgeContent" : $scope.vm.contentVal
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                        $scope.vm.contentArr.push(obj);
                        $scope.vm.contentVal = "";
                        $scope.$apply();
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })
            }

        }
        //刪除
        function remove(item,arr){
            arr.remove(item);
        }
        function saveScan(params){
            httpRequestPost("/api/chatKnowledge/addConceCptChatKnowledge",{
                "applicationId": params.applicationId,
                "chatKnowledgeModifier": params.chatKnowledgeModifier,
                "chatKnowledgeTopic": params.standardQuestion,
                "chatQuestionList" : params.extendedQuestionArr,
                "chatKnowledgeContentList" : params.contentArr
            },function(data){
                if(data.data==10004){
                    layer.msg("标准问重复")
                }else{
                    $state.go("materialManagement.chatKnowledgeBase");
                }
            },function(err){
            })
        };
        //预览
        function scan(){
            //if(check()){
            var params = {
                standardQuestion : $scope.vm.standardQuestion,
                extendedQuestionArr : $scope.vm.extendedQuestionArr,
                contentArr : $scope.vm.contentArr,
                applicationId: $scope.vm.applicationId,
                chatKnowledgeModifier : $scope.vm.userName,
                save : saveScan,
                editUrl : "materialManagement.faqChat",
            };
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:params});
        }
        //保存  0 无验证   1  需要验证

        function save(){
            if(check()){
                httpRequestPost("/api/chatKnowledge/addConceCptChatKnowledge",{
                    "applicationId": $scope.vm.applicationId,
                    "chatKnowledgeModifier": $scope.vm.userName,
                    "chatKnowledgeTopic": $scope.vm.standardQuestion,
                    "chatQuestionList" : $scope.vm.extendedQuestionArr,
                    "chatKnowledgeContentList" : $scope.vm.contentArr
                },function(data){
                    if(data.data==10004){
                        layer.msg("标准问重复")
                    }else{
                        $state.go("materialManagement.chatKnowledgeBase");
                    }
                },function(err){

                })
            }
        }
        //    判断重复
        function checkRepeat(val , arr ,prop){
            var result;
            if(arr.length==0){
                result = 0;
            }else{
                angular.forEach(arr,function(item){
                    if(item[prop]==val){
                        result = 1
                    }else{
                        result = 0
                    }
                })
            }
            return result
        }
        //验证 所有数据是否合格
        function check(){
            if($scope.vm.standardQuestion==""){
                layer.msg("标准问不能为空");
                return false
            }else if($scope.vm.extendedQuestionArr.length==0){
                layer.msg("扩展问不能为空");
                return false;
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空");
                return false
            }else{
                return true
            }
        }
    }
]);;
// Source: app/know_index/materialManagement/js/controller/faqChat_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('faqChatController', [
    '$scope',"$state","ngDialog", "$stateParams",function ($scope,$state,ngDialog,$stateParams) {
        $state.go("materialManagement.faqChat");
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        console.log("d",$stateParams.scanDataList);
        $scope.vm = {
            userName : getCookie("userName"),
            applicationId : getCookie("applicationId"),
            standardQuestion :  $stateParams.scanDataList?$stateParams.scanDataList.standardQuestion:null,   //标准问
            extendedQuestion : "",    //扩展问
            extendedQuestionArr : $stateParams.scanDataList?$stateParams.scanDataList.extendedQuestionArr:[],  //扩展问数组
            remove : remove ,
            weight : "60" ,         //  权重
            addExtension : addExtension ,  //添加扩展

            contentVal : "",
            contentArr : $stateParams.scanDataList?$stateParams.scanDataList.contentArr:[] ,
            addContentDialog : addContentDialog,// 添加知识内容
            save : save ,
            scan : scan,
            scanData : $stateParams.scanData
        };
        //擴展問
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.extendedQuestion , $scope.vm.extendedQuestionArr ,"chatQuestionContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkFAQChatQuestion",{
                    "chatQuestionContent" : $scope.vm.extendedQuestion
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion);
                        obj.chatQuestionType = angular.copy($scope.vm.weight);
                        $scope.vm.extendedQuestionArr.push(obj);
                        $scope.vm.extendedQuestion = "";
                        $scope.$apply();
                        console.log($scope.vm.extendedQuestionArr)
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })




            }
        }
        function addContentDialog(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/faq/addContentDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addContent()
                    }
                }
            });
        }
        function addContent(){
            console.log();
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.contentVal , $scope.vm.contentArr ,"chatKnowledgeContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkChatKnowledgeContent",{
                    "chatKnowledgeContent" : $scope.vm.contentVal
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                        $scope.vm.contentArr.push(obj);
                        $scope.vm.contentVal = "";
                        $scope.$apply();
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })
            }

        }
       //刪除
        function remove(item,arr){
            arr.remove(item);
        }
        function saveScan(params){
            httpRequestPost("/api/chatKnowledge/addFAQChatKnowledge",{
                "applicationId": params.applicationId,
                "chatKnowledgeModifier": params.chatKnowledgeModifier,
                "chatKnowledgeTopic": params.standardQuestion,
                "chatQuestionList" : params.extendedQuestionArr,
                "chatKnowledgeContentList" : params.contentArr
            },function(data){
                if(data.data==10004){
                    layer.msg("标准问重复")
                }else{
                    $state.go("materialManagement.chatKnowledgeBase");
                }
            },function(err){
            })
        };
        //预览
        function scan(){
            //if(check()){
                var params = {
                    standardQuestion : $scope.vm.standardQuestion,
                    extendedQuestionArr : $scope.vm.extendedQuestionArr,
                    contentArr : $scope.vm.contentArr,
                    applicationId: $scope.vm.applicationId,
                    chatKnowledgeModifier : $scope.vm.userName,
                    save : saveScan,
                    editUrl : "materialManagement.faqChat",
                };
                $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:params});
            //}
        }
        //保存  0 无验证   1  需要验证

        function save(){
                if(check()){
                    httpRequestPost("/api/chatKnowledge/addFAQChatKnowledge",{
                        "applicationId": $scope.vm.applicationId,
                        "chatKnowledgeModifier": $scope.vm.userName,
                        "chatKnowledgeTopic": $scope.vm.standardQuestion,
                        "chatQuestionList" : $scope.vm.extendedQuestionArr,
                        "chatKnowledgeContentList" : $scope.vm.contentArr
                    },function(data){
                        if(data.data==10004){
                            layer.msg("标准问重复")
                        }else{
                            $state.go("materialManagement.chatKnowledgeBase");
                        }
                    },function(err){

                    })
                }
            }


        //    判断重复
        function checkRepeat(val , arr ,prop){
            var result;
            if(arr.length==0){
                result = 0;
            }else{
                angular.forEach(arr,function(item){
                    if(item[prop]==val){
                        result = 1
                    }else{
                        result = 0
                    }
                })
            }
            return result
        }
        //验证 所有数据是否合格
        function check(){
            if($scope.vm.standardQuestion==""){
                layer.msg("标准问不能为空");
                return false
            }else if($scope.vm.extendedQuestionArr.length==0){
                layer.msg("扩展问不能为空");
                return false;
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空");
                return false
            }else{
                return true
            }
        }
    }
]);

;
// Source: app/know_index/materialManagement/js/controller/materialManagementPre_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBasePreController', [
    '$scope',"$state","$stateParams", function ($scope,$state,$stateParams) {
        console.log($stateParams.scanData);
        //$state.go("materialManagement.chatKnowledgeBasePreview");
        $scope.vm = {
            scanData : $stateParams.scanData,
            save : save ,
            edit : edit ,
        };
        function save(){
            $stateParams.scanData.save($stateParams.scanData)
        }
        function edit(){
            console.log($stateParams.scanData);
            $state.go($stateParams.scanData.editUrl,{scanDataList: $stateParams.scanData});

        }

    }
]);;
// Source: app/know_index/materialManagement/js/controller/materialManagement_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", function ($scope,$state) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            searchList : "",   //查询数据结果
            paginationConf : "",
        };
        //$scope.vm.paginationConf = {
        //    currentPage: index,//当前页
        //    totalItems: Math.ceil(data.total/5), //总条数
        //    pageSize: 1,//第页条目数
        //    pagesLength: 8,//分页框数量
        //};

        //$scope.$watch('vm.paginationConf.currentPage', function(current){
        //    if(current){
        //        //console.log(current,$scope.vm.pageSize);
        //        httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
        //            "collectiveConceptApplicationId": $scope.vm.applicationId,
        //            "index" :current*$scope.vm.pageSize,
        //            "pageSize": $scope.vm.pageSize
        //        },function(){
        //            getAggre(current);
        //        },function(){
        //        })
        //    }
        //});

        //$scope.$apply();
        function search(){
            httpRequestPost("",{

            },function(data){

            },function(err){})
        }

    }
]);;
;
// Source: app/know_index/myApplication/js/controller/NewServiceRelease_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('NewServiceReleaseController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            newService : newService
        };
        function newService(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NewServiceReleaseDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/myApplication/js/controller/NodeManage_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('NodeManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            addNode : addNode
        };
        function addNode(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NodeManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/myApplication/js/controller/addAdmin_controller.js
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationModule').controller('addAdminController', [
    '$scope', "$state", "$stateParams",
    function ($scope,$state, $stateParams) {
        $state.go("admin.manage",{userPermission:$stateParams.userPermission});

    }
]);;
// Source: app/know_index/myApplication/js/controller/adminContent_controller.js
/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationModule').controller('adminContentController', [
    '$scope',"$state","$timeout","$stateParams","ngDialog",
    function ($scope,  $state,$timeout,$stateParams,ngDialog) {
        setCookie("userName","mf");
        getCookie("userName");
        //setCookie("userId","359873057331875840");
        //$stateParams.userPermission = ['超级管理员','初级管理员'];
                $scope.vm = {
                    userName : getCookie("userName"),
                    userPermission : $stateParams.userPermission,
                    addApplicationWindow : addApplicationWindow,
                    myApplication : "",
                    selectLicence : "",

                    newApplicationName : "",
                    newScene : "",
                    newLicence : "",
                    newDescribe : ""
                };
        myApplication();
        selectLicence();

        //获取当前 应用场景
        function myApplication(){
            //console.log(getCookie("userId"));
            var sel = $scope;
            httpRequestPost("/api/application/application/listApplicationByUserId",{
                "userId":getCookie("userId")
            },function(data){
                sel.vm.myApplication = data.data;
                $scope.$apply()
            },function(err){
                //console.log(err)

            });

        }

        //var timeout = $timeout(function () {
        //     $scope.vm.selectLicence = ["d","a","b"]
        //},3000);
        //获取 scene
       function selectLicence(){
           httpRequestPost("/api/application/scene/listAllScene",{

                                    },function(data){
                                        $scope.vm.selectLicence = data.data;
                                        $scope.$apply();
                                        return data.data
                                    },function(err){

                                        console.log(err)
                                 });
       }

        //打开添加窗口
        function addApplicationWindow() {
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/addAdmin.html",
                scope:$scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addApplication()
                    }
                }

            });
        }
        //添加
        function addApplication(){
            console.log(getCookie("userId"),$scope.vm.newApplicationName,$scope.vm.newScene,$scope.vm.newLicence,$scope.vm.newDescribe);
            httpRequestPost("/api/application/application/addApplication",{
                "userId":getCookie("userId"),
                "applicationName": $scope.vm.newApplicationName,
                "sceneId": $scope.vm.newScene,
                "applicationLisence": $scope.vm.newLicence,
                "applicationDescription": $scope.vm.newDescribe
            },function(data){
                console.log(data)
            },function(err){
                console.log(err)
            });
        }


    }
]);;
// Source: app/know_index/myApplication/js/controller/admin_controller.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationModule').controller('myApplicationController', [
    '$scope',  "$state", "$stateParams",
    function ($scope,  $state ,$stateParams) {

                //console.log("state"+$stateParams.userPermission);
        $state.go("myApplication.manage",{userPermission:$stateParams.userPermission});

    }
]);;
// Source: app/know_index/myApplication/js/controller/applicationInfor_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('applicationInforController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            editName : editName,
            deleteName: deleteName

        };
        function editName(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        function deleteName(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationInfor/applicationInforDialog2.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/myApplication/js/controller/botApply.js
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('botApplyController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("relationalCatalog.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName
            botSelectValue:"",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,
        };
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////

        //{
        //    "categoryApplicationId": "360619411498860544",
        //        "categoryPid": "root"
        //}
        getBotRoot();
        //    getDimensions();
        //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": "360619411498860544",
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                alert("err or err")
            });
        }
        // $scope.vm.botRoot = [{categoryName:'dd'},{categoryName:'dddddddddddd'}]
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%")
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId": categoryApplicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var  html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li>' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span>'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>'
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown()
                    }
                },function(err){
                    alert(err)
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%")
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////


      

    }
]);;
// Source: app/know_index/myApplication/js/controller/channelManage_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('channelManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            addChannel : addChannel,
            addBlacklist: addBlacklist
        };
        function addChannel(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/channelManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        function addBlacklist(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/blacklistManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }

      

    }
]);;
// Source: app/know_index/myApplication/js/controller/chatPageConfig_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('chatPageConfigController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            addHotIssues : addHotIssues
        };
        function addHotIssues(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/chatPageConfigDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);;
// Source: app/know_index/myApplication/js/controller/custKnowledgePreview_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custKnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("custKnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName

        };


      

    }
]);;
// Source: app/know_index/myApplication/js/controller/custServScenaOverview_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        $state.go("custServScenaOverview.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName

        };


      

    }
]);;
// Source: app/know_index/myApplication/js/controller/dimensionManage_controller.js
/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('dimensionManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval) {
        setCookie("applicationId","1");
        setCookie("userId","1");
        $scope.vm = {
            addDimension : addDimension,
            listData : "",   // table 数据
            listDataTotal : "",
            getData : getData,
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "" //分页条件
        };

        getData();
        function getData(){
            httpRequestPost("/api/application/api/dimension/listDimension",{
                index:0,
                pageSize:10,
                dimensionParentId:0, //页面只展示父级维度，给定父级id
                userId:$scope.vm.userId,
                applicationId:$scope.vm.applicationId
            },function(data){
              console.log(data);
                $scope.vm.listData = data.data.dimensionList;
                $scope.vm.paginationConf = {
                    currentPage: 0,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }


        function addDimension(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/dimensionManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){

                    }
                }
            });
        }

      

    }
]);;
// Source: app/know_index/myApplication/js/controller/markKnowledgePreview_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('KnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("KnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName

        };


      

    }
]);;
// Source: app/know_index/myApplication/js/controller/markServScenaOverview_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('markServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("markServScenaOverview.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName

        };


      

    }
]);;
// Source: app/know_index/myApplication/js/controller/relationalCatalog_controller.js

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('relationalCatalogController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("relationalCatalog.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal:"",  //bot 内容
            addBot:addBot //添加点击时间
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        //加载业务树
        initBot();
        //点击 root 的下拉效果
        function knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function initBot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                console.log("err or err")
            });
        }
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            console.log($scope.vm.botSelectValue);
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            appendTree(this);
        });
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId": categoryApplicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span ng-click="vm.botValChange('+data.data[i].categoryName+')" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown();
                    }
                },function(err){
                    console.log(err);
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%")
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        }
        //类目新增
        function addBot(){
            //数据校验
            if($scope.vm.botSelectValue==""){
                return;
            }
            httpRequestPost("/api/modeling/category/add",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": $scope.vm.botSelectValue,
                "categoryAttributeName": $("#category-attribute-name").val(),
                "categoryName": $("#category-name").val(),
                "categoryTypeId": $("#category-type").val(),
                "categoryModifierId": categoryModifierId,
                "categorySceneId": categorySceneId,
                "categoryLeaf": 0,
            },function(data){
                if(responseView(data)==true){
                    //清空指定pid下所有子分类 重新加载
                    reloadBot(data,0);
                }
            },function(err){
                console.log(err);
            });
        }
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBot(data,type){
            if(type!=0){
                $.each($(".aside-navs").find("li"),function(index,value){
                    console.log($(value).child().child().attr("data-option"));
                    if($(value).child().child().attr("data-option")==$scope.vm.botSelectValue){
                        //移除指定元素
                        $(".aside-navs").find("li").remove(index);
                    }
                });
            }

            if(type==1){
                return;
            }

            if($scope.vm.botSelectValue=="root"){
                initBot();
            }else{
                $.each($(".aside-navs").find("i"),function(index,value){
                    console.log($(value).attr("data-option"));
                    if($(value).attr("data-option")==$scope.vm.botSelectValue){
                        var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                            '<div class="slide-a">'+
                            ' <a class="ellipsis" href="javascript:;">'+
                            '<i class="icon-jj" data-option="'+data.data[0].categoryId+'"></i>'+
                            '<span ng-click="vm.botValChange('+data.data[0].categoryName+')" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                            '</a>' +
                            '</div>' +
                            '</li>';
                        //按照修改时间排序 把数据添加到前面
                        $(value).parent().parent().next().prepend(html);
                        //$(value).css("backgroundPosition","0% 100%");
                        //httpRequestPost("/api/modeling/category/listbycategorypid",{
                        //    "categoryApplicationId": categoryApplicationId,
                        //    "categoryPid": $(value).attr("data-option")
                        //},function(data){
                        //    if(data.data){
                        //        var html = '';
                        //        for(var i=0;i<data.data.length;i++){
                        //            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        //                '<div class="slide-a">'+
                        //                ' <a class="ellipsis" href="javascript:;">'+
                        //                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                        //                '<span ng-click="vm.botValChange('+data.data[i].categoryName+')" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        //                '</a>' +
                        //                '</div>' +
                        //                '</li>';
                        //        }
                        //        $(html).appendTo(($(value).parent().parent().next()));
                        //        $(value).parent().parent().next().slideDown();
                        //    }
                        //},function(err){
                        //    console.log(err);
                        //});
                    }
                });
            }
        }
        //返回状态显示
        function responseView(data){
            if(data==null){
                return false;
            }
            layer.msg(data.info);
            if(data.status==$scope.vm.success){
                return true;
            }
            return false;
        }
    }
]);;
// Source: app/know_index/myApplication/js/controller/sceneManage_controller.js
/**
 * Description:场景管理控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/5 15:39
 */
angular.module('knowledgeManagementModule').controller('sceneManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            keyword: "",  //检索条件
            knowledgeTypeData: "", //知识类型列表
            exchangeModeData: "",  //交互方式列表
            listKnowledgeType: listKnowledgeType, //查询知识类型
            listExchangeMode: listExchangeMode,  //查询交互方式

        };

        //加载知识类型
        listKnowledgeType();
        //加载交互方式
        listExchangeMode();
        //请求知识类型列表
        function listKnowledgeType(){
            httpRequestPost("/api/application/scene/listKnowledgeTypeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "keyword": $scope.vm.keyword
            },function(data){
                $scope.vm.knowledgeTypeData = data.data;
                //console.log(data)
                $scope.$apply();
            },function(err){
                console.log(err);
                layer.msg("请求失败")
            })
        }
        //请求交互方式列表
        function listExchangeMode(){
            httpRequestPost("/api/application/scene/listExchangeModeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "keyword": $scope.vm.keyword
            },function(data){
                $scope.vm.exchangeModeData = data.data;
                //console.log(data)
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }

    }
]);;
// Source: app/know_index/myApplication/js/controller/setting_cotroller.js
/**
 * Created by 41212 on 2017/3/27.
 */
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationSettingModule').controller('myApplicationSettingController', [
    '$scope', "$state", "$stateParams",
    function ($scope,$state, $stateParams) {
       // alert();
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
        };

        function isSlide(event){
            var self=event.target;
            if($(self).hasClass("slideActive")){
                $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
            }

        }
    }
]);;
;
