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

	    var map = {
	        name: "xf_map",
	        nodes: [{
	            describe: "登录",
	            permissionId: "",
	            name: "login",
	            url: "/login",
	            children: ""
	        }]
	    };
	    return [
	    //--------------------------------------------------
	    //           ##登录页面##
	    //--------------------------------------------------
	    {
	        name: "login",
	        url: "/login",
	        data: {
	            roles: []
	        },
	        title: "登录",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(6, function () {
	                var template = __webpack_require__(24);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        controller: "LoginController",
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(7, function () {
	                    var loginModule = __webpack_require__(36)(angular); //动态加载Module
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
	    //          ##首页##
	    //--------------------------------------------------
	    {
	        name: "HP",
	        url: "/HP",
	        data: {
	            roles: []
	        },
	        title: "首页容器加载依赖",
	        template: __webpack_require__(21),
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(8, function () {
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
	        name: "HP.define",
	        url: "/define",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(22),
	                controller: "HomePageContentController"
	            }
	        }
	    },
	    // 应用 管理
	    {
	        name: "HP.management",
	        url: "/management",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "应用管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(35),
	                controller: "homePageContentController"
	            }
	        }
	    },
	    // 权限管理
	    {
	        name: "HP.permission",
	        url: "/permission",
	        data: {
	            roles: []
	        },
	        parent: "HP",
	        title: "默认首页",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(23),
	                controller: "PermissionController"
	            }
	        }
	    },
	    //--------------------------------------------------
	    //          ##应用管理MP##
	    //--------------------------------------------------
	    {
	        name: "AM",
	        url: "/AM",
	        data: {
	            roles: []
	        },
	        title: "应用管理",
	        templateProvider: ["$q", function ($q) {
	            var deferred = $q.defer();
	            __webpack_require__.e/* nsure */(9, function () {
	                var template = __webpack_require__(38);
	                deferred.resolve(template);
	            });
	            return deferred.promise;
	        }],
	        resolve: {
	            loadDep: ["$q", "$ocLazyLoad", function ($q, $ocLazyLoad) {
	                var defer = $q.defer();
	                __webpack_require__.e/* nsure */(10, function () {
	                    var applicationManagementModule = __webpack_require__(39)(angular);
	                    $ocLazyLoad.load({
	                        name: "applicationManagementModule"
	                    });
	                    defer.resolve(applicationManagementModule);
	                });
	                return defer.promise;
	            }]
	        }
	    },
	    // --------------------应用信息-------------------- //
	    // 应用信息
	    {
	        name: "AM.info",
	        url: "/info",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "应用信息",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(55),
	                controller: "ApplicationInfoController"
	            }
	        }
	    },
	    // 备份还原
	    {
	        name: "AM.restore",
	        url: "/restore",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "备份还原",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(56),
	                controller: "BackupRestoreController"
	            }
	        }
	    },
	    // --------------------应用配置-------------------- //
	    // 机器人设置
	    {
	        name: "AM.robot",
	        url: "/robot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "机器人设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(57),
	                controller: "RobotSetupController"
	            }
	        }
	    },
	    // 参数设置
	    {
	        name: "AM.parameter",
	        url: "/parameter",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "参数设置",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(58),
	                controller: "ParameterSetupController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 授权管理
	    {
	        name: "AM.authorization",
	        url: "/authorization",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "授权管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "AuthorizationManagementController"
	            }
	        }
	    },
	    // 热点知识配置
	    {
	        name: "AM.hot",
	        url: "/hot",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(60),
	                controller: "HotKnowledgeSetupController"
	            }
	        }
	    },
	    // 转人工
	    {
	        name: "AM.manual",
	        url: "/manual",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "转人工",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(59),
	                controller: "ManualSettingController"
	            }
	        }
	    },
	    // 场景管理
	    {
	        name: "AM.scene",
	        url: "/scene",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "场景管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(61),
	                controller: "SceneManageController"
	            }
	        }
	    },
	    // 渠道管理
	    {
	        name: "AM.channel",
	        url: "/channel",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "渠道管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(62),
	                controller: "ChannelManageController"
	            }
	        }
	    },
	    // --------------------应用发布-------------------- //
	    // 发布管理
	    {
	        name: "AM.release",
	        url: "/release",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "渠道管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(63),
	                controller: "ReleaseManageController"
	            }
	        }
	    },
	    // 节点管理
	    {
	        name: "AM.node",
	        url: "/node",
	        data: {
	            roles: []
	        },
	        parent: "AM",
	        title: "节点管理",
	        views: {
	            "header": {
	                template: nav,
	                controller: "NavController"
	            },
	            "content": {
	                template: __webpack_require__(64),
	                controller: "NodeManageController"
	            }
	        }
	    }];
	};

/***/ }),

/***/ 62:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>渠道管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <!--<div class=\"pr con_box_serl bd mr10\" style=\"margin:0 auto 20px;\">-->\r\n            <!--<input type=\"text\" class=\"txt L\" placeholder=\"请输入维度名称\"  style=\"width:257px;\">-->\r\n            <!--<input type=\"button\" class=\"btn1\" value=\"查找\" >-->\r\n            <!--</div>-->\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<!--<span class=\"L\">-->\r\n                            <!--&lt;!&ndash;<button class=\"L btn1 btn_delete mr-10\" >删除渠道</button>&ndash;&gt;-->\r\n                        \t<!--<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vm.addChannel()\">添加渠道</button>-->\r\n                        <!--</span>-->\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vm.channelDataTotal}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"6%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"14%\">ID</th>\r\n                            <th class=\"bold\" width=\"15%\">渠道名称</th>\r\n                            <th class=\"bold\" width=\"19%\">创建时间</th>\r\n                            <th class=\"bold\" width=\"15%\">状态</th>\r\n                            <th class=\"bold\" width=\"19%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.channelData\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.channelId}}</td>\r\n                            <td>{{item.channelName}}</td>\r\n                            <td>{{item.channelUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>\r\n                                <span ng-if=\"item.statusId==50001\" class=\"btn1 btn_green2\">未启用</span>\r\n                                <span ng-if=\"item.statusId==50002\" class=\"btn1 btn_green2\">已启用</span>\r\n                            </td>\r\n                            <td>\r\n                                <a ng-if=\"item.statusId==50001\"\r\n                                   class=\"c-error \" ng-click=\"vm.changeChannel(item.channelId,item.statusId)\">启用</a>\r\n                                <a ng-if=\"item.statusId==50002\"\r\n                                   class=\"c-error \" ng-click=\"vm.changeChannel(item.channelId,item.statusId)\">禁用</a>\r\n                                <!--<a href=\"javascript:;\" class=\"c-primary mr-10\" ng-click=\"vm.editChannel(item)\">编辑</a>-->\r\n                                <!--<a href=\"javascript:;\" class=\"c-error\" ng-click=\"vm.delChannel(item.channelId)\">删除</a>-->\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"r-cont-hd\">\r\n        <span>黑名单管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                            <button class=\"L btn1 btn_delete mr-10\" ng-click=\"vmo.removeBlacklist(vmo.selectedList)\">批量移除黑名单</button>\r\n                        \t<button class=\"L btn1 btn1_blue mr-10\" ng-click=\"vmo.addBlacklist()\">添加黑名单</button>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vmo.blackListDataTotal}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab  Blacklist_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <th class=\"bold\" width=\"6%\">\r\n                                <input  type=\"checkbox\" ng-click=\"vmo.selectAll()\" ng-checked=\"vmo.isSelectedAll\"/>\r\n                            </th>\r\n                            <th class=\"bold\" width=\"19%\">ID</th>\r\n                            <th class=\"bold\" width=\"15%\">标识</th>\r\n                            <th class=\"bold\" width=\"19%\">加入黑名单时间</th>\r\n                            <th class=\"bold\" width=\"27%\">备注</th>\r\n                            <th class=\"bold\" width=\"14%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vmo.blackListData\">\r\n                            <td>\r\n                                <input  type=\"checkbox\" name=\"selected\" ng-checked=\"vmo.selectedList.inArray(item.blackListId)\"\r\n                                        ng-click=\"vmo.selectSingle(item.blackListId)\"/>\r\n                            </td>\r\n                            <td>{{item.blackListId}}</td>\r\n                            <td>{{item.blackListIdentify}}</td>\r\n                            <td>{{item.blackListUpdateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td>{{item.blackListRemark}}</td>\r\n                            <td>\r\n                                <a class=\"c-error\" ng-click=\"vmo.removeBlacklist([item.blackListId])\">移除</a>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vmo.paginationConf.totalItems && vmo.paginationConf.totalItems>0\" conf=\"vmo.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>发布管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh  ReleaseManage\">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    \t<span class=\"L\">\r\n                        \t<!--<a ui-sref=\"setting.newService\"  >-->\r\n                            <!--<a ng-click=\"$state.go('setting.newService');\">-->\r\n                            <a href=\"javascript:;\" ng-click=\"vm.addOrEditService()\">\r\n                                <button class=\"L btn1 btn1_blue \">发布新服务</button>\r\n                            </a>\r\n                        </span>\r\n                        <span class=\"R\">\r\n                            <span>共有数据：<b >{{vm.paginationConf.totalItems}}</b> 条</span>\r\n                        </span>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"5%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"25%\">名称</th>\r\n                            <th class=\"bold\" width=\"20%\">服务类型</th>\r\n                            <th class=\"bold\" width=\"20%\">发布时间</th>\r\n                            <th class=\"bold\" width=\"15%\">状态</th>\r\n                            <th class=\"bold\" width=\"20%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.serviceList\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.serviceName}}</td>\r\n                            <td ng-if=\"item.serviceType==10\">生产服务</td>\r\n                            <td ng-if=\"item.serviceType==11\">测试服务</td>\r\n                            <td>{{item.serviceCreateTime | date : 'yyyy-MM-dd HH:mm:ss'}}</td>\r\n                            <td ng-if=\"item.serviceStatus==30001\">未发布</td>\r\n                            <td ng-if=\"item.serviceStatus==30002\">已发布</td>\r\n                            <td ng-if=\"item.serviceStatus==30003\">已下线</td>\r\n                            <td ng-if=\"item.serviceStatus!=30001 && item.serviceStatus!=30002 && item.serviceStatus!=30003\">&nbsp;</td>\r\n                            <td>\r\n                                <a ng-if=\"item.serviceStatus==30001\"\r\n                                   ng-click=\"vm.publishService(item.serviceId)\" class=\"mr-10 c-orange\">发布</a>\r\n                                <a ng-if=\"item.serviceStatus==30002\"\r\n                                   ng-click=\"vm.stopService(item.serviceId)\" class=\"mr-10 c-orange\">下线</a>\r\n                                <a ng-if=\"item.serviceStatus==30003\"\r\n                                   ng-click=\"vm.startService(item.serviceId)\" class=\"mr-10 c-orange\">上线</a>\r\n                                <a ng-if=\"item.serviceStatus==30002\"\r\n                                   ng-click=\"vm.restartService(item.serviceId)\" class=\"mr-10 c-orange\">重启</a>\r\n                                <a ng-click=\"vm.addOrEditService(item.serviceId)\" class=\"c-primary mr-10\" >编辑</a>\r\n                                <a ng-click=\"vm.deleteService(item.serviceId)\" class=\"c-error\">删除</a>\r\n                            </td>\r\n                        </tr>\r\n\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n\r\n</style>"

/***/ }),

/***/ 64:
/***/ (function(module, exports) {

	module.exports = "<div class=\"r-cont pd30\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>节点管理</span>\r\n    </div>\r\n    <div class=\"r-cont-bd oh \">\r\n        <div class=\"con_box  mb25\">\r\n            <div class=\"mb10 bd p20 cl\" style=\"background:#fcfdfd;border-color:#f2f4f7;\">\r\n                <div class=\"cl mb-20\">\r\n                    <button  class=\" btn1 btn1_blue \" ng-click=\"vm.addNode()\" >添加节点</button>\r\n                </div>\r\n                <div>\r\n                    <table class=\"stop_word_tab\" >\r\n                        <thead>\r\n                        <tr>\r\n                            <!--<th class=\"bold\" width=\"5%\"><input  type=\"checkbox\" /></th>-->\r\n                            <th class=\"bold\" width=\"10%\">节点编号</th>\r\n                            <th class=\"bold\" width=\"30%\">访问地址</th>\r\n                            <th class=\"bold\" width=\"12%\">节点类型</th>\r\n                            <th class=\"bold\" width=\"12%\">使用状态</th>\r\n                            <th class=\"bold\" width=\"12%\">运行状态</th>\r\n                            <th class=\"bold\" width=\"20%\">操作</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in vm.nodeData\">\r\n                            <!--<td><input  type=\"checkbox\" /></td>-->\r\n                            <td>{{item.nodeId}}</td>\r\n                            <td>{{item.nodeAccessIp}}</td>\r\n                            <td ng-if=\"item.nodeType==200\" ng-bind=\"item.nodeType==200?'单个节点':'集群节点'\"></td>\r\n                            <!--<td ng-if=\"item.nodeType==201\">集群节点</td>-->\r\n                            <td ng-if=\"item.statusId==60001\">未使用</td>\r\n                            <td ng-if=\"item.statusId==60002\">已使用</td>\r\n                            <td ng-if=\"item.statusId==60003\">已禁用</td>\r\n                            <td ng-if=\"item.nodeRunningId==70001\" ng-bind=\"item.nodeRunningId==70001?'运行正常':'运行异常'\"></td>\r\n                            <!--<td ng-if=\"item.nodeRunningId==70002\"></td>-->\r\n                            <td>\r\n                                <a ng-if=\"item.statusId==60001\"\r\n                                   ng-click=\"vm.disabledAndEnabledNode(item.nodeCode,'禁用')\" class=\"mr-10 c-orange\">禁用</a>\r\n                                <a ng-if=\"item.statusId==60003\"\r\n                                   ng-click=\"vm.disabledAndEnabledNode(item.nodeCode,'启用')\" class=\"mr-10 c-orange\">启用</a>\r\n                                <a ng-click=\"vm.editNode(item.nodeCode)\" class=\"c-primary mr-10\" >编辑</a>\r\n                                <a ng-if=\"item.statusId!=60002\" ng-click=\"vm.deleteNode(item.nodeCode)\" class=\"c-error\">删除</a>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n                <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ })

})