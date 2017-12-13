/**
 * @Author : MILES .
 * @Create : 2017/10/26.
 * @Module :
 */
"use strict";
module.exports = ngModule => {
    /*  定义常量 统一为constantMethod方法
     *   使用为注入方式
     * */
    ngModule
        .constant('constantMethod', {
            "LAZY_LOAD_DEP": lazyLoadDep,    // js
            "LAZY_LOAD_TEMPLATE": lazyLoadTemplate,  // html
            "Modules_Config": [
                {
                    name: 'treeControl',
                    serie: true,
                    files: []
                }
            ] ,
            "NG_DIALOG" : ngDialog
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
                console.log(next, toParams, fromState, fromParams)
            });

            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                console.log(toState, toParams, fromState, fromParams)
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
                event.preventDefault()
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
            $rootScope.back = function () {//实现返回的函数
                $state.go($rootScope.previousState_name, $rootScope.previousState_params);
            };
        });
} ;
    //oclzayload 封装
    let lazyLoadTemplate = (tpls, ...base)=> {
        if (base) {
            angular.forEach(tpls, (item, index) =>{
                tpls[index] = base + item
            });
        }
        return ['$q', ($q)=> {
            let deferred = $q.defer();
            require.ensure([], ()=> {
                let template = require(tpls);
                deferred.resolve(template);
            });
            return deferred.promise;
        }]
    } ;
    let lazyLoadDep = (tpls,...angular)=> ({
            loadTemplate: ['$q','$ocLazyLoad',($q,$ocLazyLoad)=> {
                let defer = $q.defer();
                require.ensure([], ()=> {
                    /**
                     *let module = LoginModule(angular);
                     *注意import导入LoginModule方法与require('./login.module')直接引用LoginModule方法是有区别的，
                     *import导入LoginModule方法不能分离js
                     */
                    let Module = require(tpls)(angular);   //动态加载Module
                    $ocLazyLoad.load({
                        name: Module.name                                              //name就是你module的名称
                    });
                    defer.resolve(Module);
                });
                return defer.promise;
            }]
    });
    let ngDialog = function(){

        // constant: invokeLater('ngDialog')
        //
        // function invokeLater(provider, method, insertMethod, queue) {
        //     if (!queue) queue = invokeQueue;
        //     // 还是利用柯里化将多个参数的函数转换为少数参数的函数
        //     return function() {
        //         // arguments才是我们在声明constant时实际传入的参数
        //         queue[insertMethod || 'push']([provider, method, arguments]);
        //         return moduleInstance;
        //     };
        // }
        // invokeQueue['unshift'](['$provide', 'constant', arguments]);
        // return moduleInstance;
    }