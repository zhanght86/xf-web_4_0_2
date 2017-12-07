webpackHotUpdate(0,{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/26.
	 * @Module :
	 */
	"use strict";

	module.exports = function (ngModule) {
	    /*  定义常量 统一为constantMethod方法
	     *   使用为注入方式
	     * */
	    ngModule.constant('constantMethod', {
	        "LAZY_LOAD_DEP": lazyLoadDep, // js
	        "LAZY_LOAD_TEMPLATE": lazyLoadTemplate, // html
	        "Modules_Config": [{
	            name: 'treeControl',
	            serie: true,
	            files: []
	        }]
	    })
	    /**
	     * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
	     * 这里的run方法只会在angular启动的时候运行一次。
	     * @param  {[type]} $rootScope
	     * @param  {[type]} $state
	     * @param  {[type]} $stateParams
	     * @return {[type]}
	     */
	    .run(function ($rootScope, $state, $stateParams, $location, localStorageService, $window) {
	        $rootScope.$state = $state;
	        $rootScope.$stateParams = $stateParams;

	        //监听路由的变化，一旦发生变化校验用户登录情况
	        $rootScope.$on("$stateChangeStart", function (event, next, toParams, fromState, fromParams) {
	            console.log(next, toParams, fromState, fromParams);
	        });

	        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
	            console.log(toState, toParams, fromState, fromParams);
	        });
	        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
	            console.log('没有找到对应的状态');
	            /*unfoundState包含了三个属性:*/
	            /*1.to:前往的状态名(也就是没有找到的这个状态名)
	             * 2.toParams:前往的状态的参数(在使用ui-sref或者$state.go()的时候可以传入,这个例子里就是{a:1,b:2})
	             * 3.options:使用$state.go()的时候传入的第三个参数.
	             * */
	            /*最后两个参数同上*/
	            console.log(unfoundState);
	            //如果不写这句,那么接下来就会报错,卡住js进程了.
	            event.preventDefault();
	        });
	        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
	            console.log('----切换状态出错----');
	            /*error是一个包含了错误信息的对象*/
	            console.info(error);
	        });
	        //视图事件
	        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
	            console.log('----视图开始加载----');
	        });
	        $rootScope.$on('$viewContentLoaded', function (event) {
	            console.log('----视图渲染完毕----');
	        });
	        //back button function called from back button"s ng-click="back()"
	        $rootScope.back = function () {
	            //实现返回的函数
	            $state.go($rootScope.previousState_name, $rootScope.previousState_params);
	        };
	    });
	};
	//oclzayload 封装
	var lazyLoadTemplate = function lazyLoadTemplate(tpls) {
	    for (var _len = arguments.length, base = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        base[_key - 1] = arguments[_key];
	    }

	    if (base) {
	        angular.forEach(tpls, function (item, index) {
	            tpls[index] = base + item;
	        });
	    }
	    return ['$q', function ($q) {
	        var deferred = $q.defer();
	        !/* require.ensure */(function () {
	            var template = __webpack_require__(17)(tpls);
	            deferred.resolve(template);
	        }(__webpack_require__));
	        return deferred.promise;
	    }];
	};
	var lazyLoadDep = function lazyLoadDep(tpls) {
	    for (var _len2 = arguments.length, angular = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        angular[_key2 - 1] = arguments[_key2];
	    }

	    return {
	        loadTemplate: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	            var defer = $q.defer();
	            !/* require.ensure */(function () {
	                /**
	                 *let module = LoginModule(angular);
	                 *注意import导入LoginModule方法与require('./login.module')直接引用LoginModule方法是有区别的，
	                 *import导入LoginModule方法不能分离js
	                 */
	                var Module = __webpack_require__(17)(tpls)(angular); //动态加载Module
	                $ocLazyLoad.load({
	                    name: Module.name //name就是你module的名称
	                });
	                defer.resolve(Module);
	            }(__webpack_require__));
	            return defer.promise;
	        }]
	    };
	};

/***/ }),

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

	    // 定义basePath ;
	    loginPath = "..\/static\/login",
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
	    console.log(loginPath);
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
	                var template = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: 'loginController',
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(8, function () {
	                    var loginModule = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())(angular); //动态加载Module
	                    $ocLazyLoad.load({
	                        name: "loginModule" //name就是你module的名称
	                    }, login);
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
	        template: nav,
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__(17).ensure([homePath + '/module/_home_page.module.js'], function () {
	                    var homePageModule = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())(angular); //动态加载Module
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
	                template: "sdfsdf",
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
	                template: "sdfsdf",
	                controller: "homePageContentController"
	            }
	        }
	    }];
	};

/***/ })

})