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
	            __webpack_require__.e/* nsure */(2, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: 'LoginController',
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(3, function () {
	                    var loginModule = __webpack_require__(25)(angular); //动态加载Module
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
	        template: __webpack_require__(21),
	        resolve: {
	            loadDep: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(4, function () {
	                    var homePageModule = __webpack_require__(27)(angular); //动态加载Module
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
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(22),
	                controller: "HomePageContentController"
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
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(35),
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
	                controller: "NavController"
	            },
	            'content': {
	                template: __webpack_require__(23),
	                controller: "PermissionController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

	module.exports = "<div class=\"wrap\" >\r\n    <div class=\"p20\" style=\"background:#fff;\">\r\n        <div class=\"text-c mb-20\">\r\n            <input type=\"text\" placeholder=\"用户姓名\" ng-model=\"vm.searchName\" style=\"width:250px\" class=\"input-text\">\r\n            <button class=\"btn1 btn1_blue\" type=\"button\"  ng-click=\"vm.search(1)\">搜用户</button>\r\n        </div>\r\n        <div class=\"bd p20\" style=\"background:#fcfdfd;\">\r\n            <div class=\"mb-10 cl\">\r\n            \t<span class=\"L\">\r\n                \t<button  class=\"btn1 btn1_blue\" ng-click=\"vm.addUser()\"> 添加用户</button>\r\n                </span>\r\n                <span class=\"R\">\r\n                \t<!--<button  class=\"btn1 btn_delete\"> 批量删除</button>-->\r\n                    <button  class=\"btn1 btn_delete\" ng-click=\"vm.deleteUsers()\"> 批量删除</button>\r\n                </span>\r\n            </div>\r\n            <div class=\"cl\">\r\n                <div class=\"r\">\r\n                    <!--<span class=\"c-999 pl-10\">共有数据：<strong id=\"user_total\">3</strong> 条 </span>-->\r\n                    <span class=\"c-999 pl-10\">共有数据：<b >{{vm.userDataTotal}}</b> 条</span>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"mt-20\">\r\n                <table class=\"stop_word_tab\" id=\"user_table\">\r\n                    <thead>\r\n                    <tr>\r\n                        <th class=\"bold\" width=\"3%\"><input class=\"selectAllBtn\" type=\"checkbox\" ng-click=\"vm.selectAll($event)\" ng-checked=\"vm.selectAllCheck || (vm.deleteIds.length == vm.listData.length)\"/></th>\r\n                        <th class=\"bold\" width=\"8%\">姓名</th>\r\n                        <th class=\"bold\" width=\"8%\">登录名</th>\r\n                        <th class=\"bold\" width=\"11%\">手机</th>\r\n                        <th class=\"bold\" width=\"13%\">邮箱</th>\r\n                        <th class=\"bold\" width=\"8%\">角色</th>\r\n                        <th class=\"bold\" width=\"15%\">更新时间</th>\r\n                        <th class=\"bold\" width=\"10%\">应用范围</th>\r\n                        <th class=\"bold\" width=\"9%\">状态</th>\r\n                        <th class=\"bold\" width=\"15%\">操作</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr ng-repeat=\"item in vm.listData\">\r\n                        <!--<td>    {{item}}</td>-->\r\n                        <td><input type=\"checkbox\" ng-checked=\"vm.selectAllCheck || vm.deleteIds.inArray(id)\" ng-click=\"vm.selectSingle($event,item.userId)\"/></td>\r\n                        <td>{{item.userName}}</td>\r\n                        <td>{{item.userLoginName}}</td>\r\n                        <td>{{item.userPhoneNumber}}</td>\r\n                        <td>{{item.userEmail}}</td>\r\n                        <td>{{item.roleName}}</td>\r\n                        <td>{{item.createTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                        <td><span ng-repeat=\"val in item.applicationName[0].data\">{{val.applicationName}}<i ng-if=\"$index!=item.applicationName[0].data.length-1\">,</i></span></td>\r\n                        <td>\r\n                            <span class=\"btn1 btn_green2\" ng-if=\"item.statusId==10001\">已启用</span>\r\n                            <span class=\"btn1 btn_red\" ng-if=\"item.statusId==10002\">未启用</span>\r\n                        </td>\r\n                        <td>\r\n                            <span ng-if=\"item.statusId==10001\"><a href=\"javascript:;\" title=\"停用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">停用</a></span>\r\n                            <span ng-if=\"item.statusId==10002\"><a href=\"javascript:;\" title=\"启用\" class=\"mr-10 c-primary\" ng-click=\"vm.stop(item.userId,item.statusId)\">启用</a></span>\r\n\r\n                            <a href=\"javascript:;\" title=\"编辑\" class=\"mr-10 c-orange\" ng-click=\"vm.editUser(item)\">编辑</a>\r\n                            <a href=\"javascript:;\" title=\"删除\" class=\"mr-10 c-red\" ng-click=\"vm.deleteUser(item.userId)\">删除</a>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n            <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<style>\r\n\r\n\r\n</style>\r\n\r\n\r\n\r\n"

/***/ })

})