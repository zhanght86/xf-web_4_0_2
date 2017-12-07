webpackJsonp([7],{

/***/ 53:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/20.
	 * @Module :  公用导航
	 */
	module.exports = function (homePageModule) {
	    homePageModule.controller('NavController', ['$scope', '$location', 'localStorageService', 'ngDialog', "$timeout", "$cookieStore", "$state", function ($scope, $location, localStorageService, ngDialog, $timeout, $cookieStore, $state) {
	        $scope.url = $location.url();
	        $scope.urls = $state.current.name;
	        $scope.map = []; // 定义导航
	        $scope.vm = {
	            applicationId: APPLICATION_ID,
	            sceneId: SCENE_ID,
	            loginout: loginout,
	            // userName : USER_NAME,
	            userName: "miles",
	            logApplication: logApplication,
	            jump: jump,
	            openServiceConfirm: openServiceConfirm,
	            queryServiceList: queryServiceList,
	            serviceUrl: "",
	            serviceUrlList: ""
	        };
	        if ($scope.url == "/HP/define") {
	            document.getElementsByTagName("body")[0].style.cssText = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/index-bg.jpg',sizingMethod='scale');background: url(../../images/images/index-bg.jpg) no-repeat;background-size:100%";
	            //document.getElementsByClassName("bodyBg")[0].src = "../../images/images/index-bg.jpg";
	        } else if ($scope.url == "/login") {
	            document.getElementsByTagName("body")[0].style.cssText = "background: url(../../images/images/log-bg.jpg) no-repeat;background-size:100%;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/log-bg.jpg',sizingMethod='scale');";
	        } else {
	            document.getElementsByTagName("body")[0].style.cssText = "background: #f8f8f8";
	        }
	        //if(!$cookieStore.get('userId')){
	        //    $state.go("login")
	        //}
	        function logApplication() {
	            // if($scope.vm.sceneId){
	            $state.go("AM.info");
	            // }else{
	            //     return false
	            // }
	        }
	        function loginout() {
	            $cookieStore.remove('applicationId');
	            $cookieStore.remove('sceneId');
	            $cookieStore.remove('userId');
	            $cookieStore.remove('userName');
	            $cookieStore.remove('userLoginName');
	            localStorage.removeItem('history');
	            httpRequestPost("/api/user/userOut", {
	                "userId": USER_ID,
	                "userLoginName": USER_LOGIN_NAME
	            }, function () {});
	            self.location = "index.html";
	        }
	        //初始化分页配置
	        self.initSearch = function (column) {
	            if (!$scope.SearchPOJO) {
	                $scope.SearchPOJO = $scope.initSearchPOJO();
	            }
	            /**
	             * 加载分页条
	             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	             */
	            $scope.paginationConf = {
	                currentPage: $scope.SearchPOJO.currentPage, //当前页
	                totalItems: 0, //总条数
	                pageSize: $scope.SearchPOJO.pageSize, //第页条目数
	                pagesLength: 6 //分页框数量

	            };
	        };
	        self.initSearch();

	        function queryServiceList() {
	            //服务列表请求
	            httpRequestPost("/api/application/service/listServiceByPage", {
	                "applicationId": $scope.vm.applicationId,
	                "index": ($scope.SearchPOJO.currentPage - 1) * $scope.SearchPOJO.pageSize,
	                "pageSize": $scope.SearchPOJO.pageSize
	            }, function (resource) {
	                if (resource.status == 200 && resource.data != null && resource.data.length > 0) {
	                    $scope.paginationConf.totalItems = resource.total;
	                    $scope.vm.serviceArray = resource.data;
	                    $scope.vm.serviceUrl = resource.data[0].nodeAccessIp; //设置默认选择
	                    $scope.vm.openServiceConfirm();
	                } else {
	                    layer.msg("无应用服务", { time: 1000 });
	                }
	            }, function () {
	                layer.msg("无法加载服务列表", { time: 1000 });
	            });
	        }
	        //引擎跳转方法
	        function openServiceConfirm() {
	            //对话框打开方法
	            var dialog = ngDialog.openConfirm({
	                template: "/static/index/home_page/qa_system.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        $scope.vm.jump($scope.vm.serviceUrl);
	                    }
	                }
	            });
	        }
	        //打开引擎访问界面
	        function jump(url) {
	            window.open('http://' + url + '/index.html');
	        }
	        $scope.checkShowCrumbs = function () {
	            if (!$scope.url.toString().indexOf("/homePage/define") > 0 || !$scope.url.toString().indexOf("/admin/manage") > 0 || !$scope.url.toString().indexOf("/admin/userManage") > 0) {
	                return false;
	            } else {
	                return true;
	            }
	        };
	        $scope.checkShowClose = function (url) {
	            if (url == 'homePage.define') {
	                return true;
	            }
	        };

	        function ObjStory(url, name) {
	            this.url = url;
	            this.name = name;
	        }
	        $scope.getParamList = function () {
	            if (localStorage.history) {
	                var aa = JSON.parse(window.localStorage.history);
	                if (aa.use.length >= 8) {
	                    aa.use.splice(1, 1);
	                }
	                for (var i = 0; i < aa.use.length; i++) {
	                    if (aa.use[i].name == $scope.getUrlName($scope.urls)) {
	                        aa.use.splice(i, 1);
	                    }
	                }
	                if ($scope.getUrlName($scope.urls) != '0') {
	                    aa.use.push(new ObjStory($scope.urls, $scope.getUrlName($scope.urls)));
	                }
	                window.localStorage.history = JSON.stringify(aa);
	                // $scope.crumbs=aa.use.slice(0,-1);
	                $scope.crumbs = aa.use;
	            } else {
	                var obj = {
	                    use: [{ "url": "homePage.define", "name": "首页" }]
	                };
	                window.localStorage.history = JSON.stringify(obj);
	            }
	        };
	        $scope.getUrlName = function (url) {
	            switch (url) {
	                /*case 'homePage.define':
	                    return 0;*/
	                case 'relationalCatalog.manage':
	                    return 'BOT';
	                case 'frameworkLibrary.manage':
	                    return '框架库';
	                case (url.match(/^conceptManage/) || {}).input:
	                    return '概念管理';
	                case (url.match(/^setting/) || {}).input:
	                    return '我的应用';
	                case (url.match(/^custServScenaOverview/) || {}).input:
	                    return '知识管理';
	                case 'functionalTest.questionTest':
	                    return '问法测试';
	                case 'functionalTest.sessionTest':
	                    return '会话测试';
	                case 'functionalTest.batchTest':
	                    return '批量测试';
	                case 'functionalTest.participle':
	                    return '分词应用';
	                case 'functionalTest.participleResult':
	                    return '分词测试结果';
	                case 'knowledgeManagement.custOverview':
	                    return '知识总览';
	                case 'knowledgeManagement.markOverview':
	                    return '知识总览';
	                case 'knowledgeManagement.conceptAdd':
	                    return '营销知识新增';
	                case 'knowledgeManagement.faqAdd':
	                    return 'FAQ知识新增';
	                case 'knowledgeManagement.singleAddConcept':
	                    return '概念知识新增';
	                case 'knowledgeManagement.listAdd':
	                    return '列表知识新增';
	                case 'knowledgeManagement.factorAdd':
	                    return '要素知识新增';
	                case 'knowledgeManagement.markKnow':
	                    return '营销知识新增';
	                case 'knowledgeManagement.knowBatchAdditions':
	                    return '知识批量新增';
	                // case (url.match(/^gateway/) || {}).input:
	                case 'back.gateway':
	                    return '文档加工新增';
	                case 'knowledgeManagement.historyView':
	                    return '历史查看';
	                case 'applAnalysis.accessStatistics':
	                    return '访问统计';
	                case 'applAnalysis.knowledgeRanking':
	                    return '知识点排名统计';
	                case 'applAnalysis.sessionDetails':
	                    return '会话明细统计';
	                case 'applAnalysis.satisfactionDegree':
	                    return '会话满意度统计';
	                case 'applAnalysis.resolutionStatistics':
	                    return '问答解决率统计';
	                case 'applAnalysis.reinforcementLearn':
	                    return '智能学习';
	                case 'applAnalysis.newKnowledgeDiscoveryLearn':
	                    return '未匹配问题聚类';
	                case 'applAnalysis.operationLog':
	                    return '操作日志';
	                case 'applAnalysis.sessionLog':
	                    return '会话日志';
	                case 'materialManagement.chatKnowledgeBase':
	                    return '聊天知识库';
	                case 'materialManagement.pictureLibrary':
	                    return '图片库';
	                case 'materialManagement.speechLibrary':
	                    return '语音库';
	                case 'materialManagement.documentLibrary':
	                    return '文档库';
	                case 'materialManagement.teletextMessage':
	                    return '图文消息库';
	                case 'deepLearning.deeplearnConfig':
	                    return '模型构建';
	                case 'deepLearning.deepLearningCon':
	                    return '模型训练';
	                case 'deepLearning.similarityCalculation':
	                    return '模型测试';
	                case 'deepLearning.dataAcquisition':
	                    return '自动导入更新';
	                case 'admin.manage':
	                    return '应用切换';
	                default:
	                    return 0;
	            }
	        };
	        $scope.getParamList();
	        $scope.closeCrumb = function (index) {
	            $scope.crumbs.splice(index, 1);
	            if ($scope.crumbs.length != 0) {
	                var obj = {
	                    use: $scope.crumbs
	                };
	                window.localStorage.history = JSON.stringify(obj);
	            } else {
	                localStorage.removeItem('history');
	            }
	        };
	        window.onbeforeunload = function () {
	            localStorage.removeItem('history');
	        };
	    }]);
	};

/***/ }),

/***/ 60:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module : 开关按钮
	 */
	module.exports = function (module) {
	    module.directive('switch', function () {
	        return {
	            restrict: 'EA',
	            scope: {
	                title: '=expanderTitle',
	                value: '=' // 1  true   0  false
	            },

	            template: '<div class="b_box" ng-click="toggle()" ng-class="value?\'open1\':\'close1\'" style="float:left;margin-right:10px;">' + '<div class="s_box"  ng-class="value?\'open2\':\'close2\'"></div>' + '</div>',
	            link: function link(scope, element, attrs) {
	                //scope.$apply(function () {
	                scope.toggle = function toggle() {
	                    scope.value = scope.value ? 0 : 1;
	                };
	                //});
	            }
	        };
	    });
	};

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module :  业务建模  ， 加载依赖
	 */
	module.exports = function (angular) {
	    var businessModelingModule = angular.module('businessModelingModule', []);
	    __webpack_require__(77)(businessModelingModule); // 控制器
	    __webpack_require__(53)(businessModelingModule); // 导航
	    //--------------------------------------------------
	    //          directive
	    //--------------------------------------------------
	    __webpack_require__(60)(businessModelingModule); // 开关
	    //--------------------------------------------------
	    //          controller
	    //--------------------------------------------------
	    // BOT
	    __webpack_require__(78)(businessModelingModule); // bot
	    __webpack_require__(79)(businessModelingModule); // bot套用

	    // 框架库
	    __webpack_require__(80)(businessModelingModule); // 同义
	    __webpack_require__(81)(businessModelingModule); // 集合
	    __webpack_require__(82)(businessModelingModule); // 业务
	    __webpack_require__(83)(businessModelingModule); // 敏感
	    __webpack_require__(84)(businessModelingModule); // 停用
	    __webpack_require__(85)(businessModelingModule); // 强制分词
	    __webpack_require__(82)(businessModelingModule); // bot

	    // 概念库
	    __webpack_require__(86)(businessModelingModule); // 节点管理

	    //--------------------------------------------------
	    //          server
	    //--------------------------------------------------
	    __webpack_require__(87)(businessModelingModule);
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	};

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module :  业务建模  ， 控制器
	 */
	module.exports = function (businessModelingModule) {
	    businessModelingModule.controller('BusinessModelingController', ['$scope', "$state", function ($scope, $state) {}]);
	};

/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module : 类目库
	 */
	module.exports = function (businessModelingModule) {
	    businessModelingModule.controller('BotController', ['$scope', 'localStorageService', '$timeout', '$state', '$stateParams', 'ngDialog', '$cookieStore', '$interval', function ($scope, localStorageService, $timeout, $state, $stateParams, ngDialog, $cookieStore, $interval) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            botSelectValue: "root",
	            categoryNode: "node",
	            categoryEdge: "edge",
	            botRoot: "", //根节点
	            knowledgeBotVal: "", //bot 内容
	            botInfo: null, //bot信息
	            addBot: addBot, //添加点击时间
	            editBot: editBot,
	            deleteBot: deleteBot,
	            categoryId: "",
	            categoryTypeId: 163,
	            botSelectType: 163,
	            categorySceneId: 0,
	            categoryAttributeName: "edge",
	            categoryName: "",
	            categoryPid: "",
	            categoryApplicationId: "",
	            categoryLeaf: 1,
	            botInfoToCategoryAttribute: botInfoToCategoryAttribute,
	            clearColor: clearColor,
	            repeatCheck: repeatCheck,
	            categoryNameNullOrBeyondLimit: "类目名称为空或超过长度限制50",
	            notContainHtmlLabel: "不能包含HTML标签",
	            categoryDescribeBeyondLimit: "描述内容超过长度限制2000",
	            searchNode: searchNode,
	            recursion: recursion,
	            location: location,
	            autoHeight: autoHeight,
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            categoryDescribe: "",
	            suggestionValue: "",
	            suggestionData: "",
	            winHeight: 0
	        };
	        // var categoryApplicationId = $cookieStore.get("applicationId");
	        // var categoryModifierId = $cookieStore.get("userId");
	        // var categorySceneId = $cookieStore.get("sceneId");
	        var categoryApplicationId = APPLICATION_ID;
	        var categoryModifierId = USER_ID;
	        var categorySceneId = SCENE_ID;

	        autoHeight();

	        function autoHeight() {
	            var $win = $(window);
	            var winHeight = $win.height() * 0.75;
	            $scope.vm.winHeight = winHeight + 5;
	            $(".libraryFt").attr("style", "width: 450px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: left;");
	            $(".libraryRth").attr("style", "width: 720px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: right;padding: 30px;");
	        }

	        var params = {
	            "categoryName": $("#category-autocomplete").val().trim(),
	            "categoryAttributeName": "node",
	            "categoryApplicationId": categoryApplicationId
	        };
	        //类目查找自动补全
	        $('#category-autocomplete').autocomplete({
	            serviceUrl: "/api/ms/modeling/category/searchbycategoryname",
	            type: 'POST',
	            params: params,
	            paramName: 'categoryName',
	            dataType: 'json',
	            transformResult: function transformResult(data) {
	                var result = new Object();
	                var array = [];
	                if (data.data) {
	                    for (var i = 0; i < data.data.length; i++) {
	                        array[i] = {
	                            data: data.data[i].categoryId,
	                            value: data.data[i].categoryName
	                        };
	                    }
	                }
	                result.suggestions = array;
	                return result;
	            },
	            onSelect: function onSelect(suggestion) {
	                searchNode(suggestion);
	                $scope.vm.suggestionValue = suggestion.value;
	                $scope.vm.suggestionData = suggestion.data;
	            }
	        });
	        $interval(function () {
	            if (nullCheck($scope.vm.suggestionData) == true) {
	                var suggestion = new Object();
	                suggestion.value = $scope.vm.suggestionValue;
	                suggestion.data = $scope.vm.suggestionData;
	                if (locationFlag(suggestion)) {
	                    location(suggestion);
	                    $scope.vm.suggestionValue = "";
	                    $scope.vm.suggestionData = "";
	                }
	            }
	        }, 2000);
	        //搜寻节点
	        function searchNode(suggestion) {
	            var currentNodeId = suggestion.data;
	            var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
	            if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                appendTree(firstNode);
	            } else if ($(firstNode).parent().parent().next() == null) {
	                appendTree(firstNode);
	            }
	            if ($(firstNode).attr("data-option") == currentNodeId) {
	                clearColor();
	                $scope.vm.knowledgeBotVal = $(firstNode).next().html();
	                $scope.vm.botSelectValue = $(firstNode).next().attr("data-option");
	                $scope.vm.botSelectType = $(firstNode).next().attr("type-option");
	                $scope.vm.categoryAttributeName = $(firstNode).next().attr("node-option");
	                $(firstNode).next().attr("style", "color:black;font-weight:bold;");
	                updateCreateMethod($scope.vm.knowledgeBotVal, $scope.vm.categoryAttributeName);
	                disableAttributeType();
	                $scope.$apply();
	            } else {
	                recursion(suggestion, firstNode);
	            }
	        }
	        function recursion(suggestion, node) {
	            var list = $(".aside-navs").find("li");
	            var flag = false;
	            $.each(list, function (index, value) {
	                if ($(value).attr("data-option") == $(node).attr("data-option")) {
	                    var currNode = $(value).find("i").filter(":eq(0)");
	                    if ($(currNode).attr("data-option") == suggestion.data) {
	                        clearColor();
	                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
	                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
	                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
	                        $scope.vm.categoryAttributeName = $(currNode).next().attr("node-option");
	                        $(currNode).next().attr("style", "color:black;font-weight:bold;");
	                        updateCreateMethod($scope.vm.knowledgeBotVal, $scope.vm.categoryAttributeName);
	                        disableAttributeType();
	                        $scope.$apply();
	                        flag = true;
	                        //跳出
	                        return false;
	                    } else {
	                        //展开
	                        if ($(currNode).css("backgroundPosition") == "0% 0%") {
	                            appendTree(currNode);
	                        } else if ($(currNode).parent().parent().next() == null) {
	                            appendTree(currNode);
	                        }
	                        if (flag == true) {
	                            return false;
	                        }
	                        //递归
	                        recursion(suggestion, currNode);
	                    }
	                }
	            });
	        }
	        //定位
	        function location(suggestion) {
	            var currentNodeId = suggestion.data;
	            var initHeight = 0;
	            var sum = $(".aside-navs").find("i").length;
	            $.each($(".aside-navs").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    var offset = 0;
	                    if (scrollHeight - 100 > 0) {
	                        offset = (initHeight + 1) / sum * (scrollHeight - 100);
	                    }
	                    $(".libraryFt").animate({
	                        scrollTop: offset + "px"
	                    }, 800);
	                    return false;
	                } else {
	                    initHeight++;
	                }
	            });
	        }
	        function locationFlag(suggestion) {
	            var currentNodeId = suggestion.data;
	            var flag = false;
	            var sum = $(".aside-navs").find("i").length;
	            $.each($(".aside-navs").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    if (sum >= 10 && scrollHeight >= $scope.vm.winHeight) {
	                        flag = true;
	                    } else if (sum < 10) {
	                        flag = true;
	                    }
	                    return false;
	                }
	            });
	            return flag;
	        }
	        //加载业务树
	        initBot();

	        //获取root 数据
	        function initBot() {
	            $(".aside-navs").empty();
	            httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                "categoryApplicationId": categoryApplicationId,
	                "categoryPid": "root"
	            }, function (data) {
	                var html = '<ul class="menus show">';
	                for (var i = 0; data.data != null && i < data.data.length; i++) {
	                    html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' node-option="' + data.data[i].categoryAttributeName + '" type-option="' + data.data[i].categoryTypeId + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[i]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                }
	                html += '</ul>';
	                $(".aside-navs").append(html);
	                var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
	                if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                    appendTree(firstNode);
	                } else if ($(firstNode).parent().parent().next() == null) {
	                    appendTree(firstNode);
	                }
	            }, function () {});
	        }
	        $(".aside-navs").on("click", "span", function () {
	            clearColor();
	            $scope.vm.knowledgeBotVal = $(this).html();
	            $scope.vm.botSelectValue = $(this).attr("data-option");
	            $scope.vm.botSelectType = $(this).attr("type-option");
	            $scope.vm.categoryAttributeName = $(this).attr("node-option");
	            if ($scope.vm.categoryAttributeName == "node") {
	                $(this).attr("style", "color:black;font-weight:bold;");
	            } else if ($scope.vm.categoryAttributeName == "edge") {
	                $(this).attr("style", "color:#ED7D31;font-weight:bold;");
	            }
	            updateCreateMethod($scope.vm.knowledgeBotVal, $scope.vm.categoryAttributeName);
	            disableAttributeType();
	            $scope.$apply();
	        });
	        //更新新建方法
	        function updateCreateMethod(knowledgeBotVal, categoryAttributeName) {
	            if (categoryAttributeName == "node") {
	                $("#createMethod").html("新建关系到" + knowledgeBotVal + "下面");
	            } else if (categoryAttributeName == "edge") {
	                $("#createMethod").html("新建节点到" + knowledgeBotVal + "下面");
	            }
	        }
	        $(".aside-navs").on("click", ".edit", function () {
	            $scope.vm.botInfo = $(this).parent().attr("bot-info");
	            botInfoToCategoryAttribute();
	            editBot();
	        });
	        function editBot() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/edit_category.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (lengthCheck($("#categoryName").val(), 0, 50) == false) {
	                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                            return false;
	                        }
	                        if (repeatCheck("#editErrorView", 1) == false) {
	                            return false;
	                        }
	                        if (isHtmlLabel($("#categoryName").val())) {
	                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
	                            return false;
	                        }
	                        if (nullCheck($("#categoryDescribe").val()) == true) {
	                            if (lengthCheck($("#categoryDescribe").val(), 0, 2000) == false) {
	                                $("#categoryDescribeError").html($scope.vm.categoryDescribeBeyondLimit);
	                                return false;
	                            } else if (isHtmlLabel($("#categoryDescribe").val())) {
	                                $("#categoryDescribeError").html($scope.vm.notContainHtmlLabel);
	                                return false;
	                            } else {
	                                $scope.vm.categoryDescribe = $("#categoryDescribe").val().trim();
	                            }
	                        }
	                        httpRequestPost("/api/ms/modeling/category/updatebycategoryid", {
	                            "categoryId": $scope.vm.categoryId,
	                            "categoryApplicationId": $scope.vm.categoryApplicationId,
	                            "applicationId": categoryApplicationId,
	                            "categoryPid": $scope.vm.categoryPid,
	                            "categoryAttributeName": $scope.vm.categoryAttributeName,
	                            "categoryName": $("#categoryName").val().trim(),
	                            "categoryTypeId": $("#categoryTypeId").val(),
	                            "categoryModifierId": categoryModifierId,
	                            "categoryDescribe": $scope.vm.categoryDescribe,
	                            "categorySceneId": categorySceneId,
	                            "categoryLeaf": $scope.vm.categoryLeaf
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBot(data, 2);
	                            }
	                        }, function (err) {});
	                    } else {}
	                    //还原类目属性类型
	                    $scope.vm.categoryDescribe = "";
	                    $scope.vm.categoryAttributeName = "edge";
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    $("#categoryName").blur(function () {
	                        if (lengthCheck($("#categoryName").val(), 0, 50) == false) {
	                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                        } else {
	                            $("#editErrorView").html('');
	                            repeatCheck("#editErrorView", 1);
	                        }
	                    });
	                    $.each($("#categoryTypeId").find("option"), function (index, value) {
	                        if ($scope.vm.categoryAttributeName == "edge") {
	                            $(value).attr("disabled", null);
	                            $(value).attr("style", "");
	                        } else {
	                            if (($(value).val() == $scope.vm.categoryTypeId) > 0) {
	                                $("#categoryTypeId").val($scope.vm.categoryTypeId);
	                                $(value).attr("disabled", null);
	                                $(value).attr("style", "");
	                            } else {
	                                $(value).attr("disabled", "disabled");
	                                $(value).attr("style", "background-color: lightgrey");
	                            }
	                        }
	                    });
	                }, 100);
	            }
	        }
	        $(".aside-navs").on("click", ".delete", function () {
	            $scope.vm.botInfo = $(this).parent().attr("bot-info");
	            botInfoToCategoryAttribute();
	            deleteBot();
	        });
	        function deleteBot() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/delete_category.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        httpRequestPost("/api/ms/modeling/category/deletebycategoryid", {
	                            "categoryId": $scope.vm.categoryId,
	                            "categoryApplicationId": $scope.vm.categoryApplicationId,
	                            "categoryPid": $scope.vm.categoryPid,
	                            "categoryLeaf": $scope.vm.categoryLeaf
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBot(data, 1);
	                            }
	                        }, function (err) {});
	                    } else {}
	                    //还原类目属性类型
	                    $scope.vm.categoryAttributeName = "edge";
	                }
	            });
	        }
	        //点击下一级 bot 下拉数据填充以及下拉效果
	        $(".aside-navs").on("click", 'i', function () {
	            appendTree(this);
	        });
	        //加载子树
	        function appendTree(obj) {
	            var id = $(obj).attr("data-option");
	            var that = $(obj);
	            if (!that.parent().parent().siblings().length) {
	                that.css("backgroundPosition", "0% 100%");
	                httpRequestPostAsync("/api/ms/modeling/category/listbycategorypid", {
	                    "categoryApplicationId": categoryApplicationId,
	                    "categoryPid": id
	                }, function (data) {
	                    if (data.data) {
	                        var html = '<ul class="menus">';
	                        for (var i = 0; i < data.data.length; i++) {
	                            html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' node-option="' + data.data[i].categoryAttributeName + '" type-option="' + data.data[i].categoryTypeId + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[i]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                        }
	                        html += "</ul>";
	                        $(html).appendTo(that.parent().parent().parent());
	                        that.parent().parent().next().slideDown();
	                    }
	                }, function (err) {});
	            } else {
	                if (that.css("backgroundPosition") == "0% 0%") {
	                    that.css("backgroundPosition", "0% 100%");
	                    that.parent().parent().next().slideDown();
	                } else {
	                    that.css("backgroundPosition", "0% 0%");
	                    that.parent().parent().next().slideUp();
	                }
	            }
	        }
	        //类目新增
	        function addBot() {
	            //数据校验
	            if ($scope.vm.botSelectValue == "") {
	                return;
	            }
	            if (lengthCheck($("#category-name").val(), 0, 50) == false) {
	                $("#category-name-error").html($scope.vm.categoryNameNullOrBeyondLimit);
	                return;
	            }
	            if (isHtmlLabel($("#category-name").val())) {
	                $("#category-name-error").html($scope.vm.notContainHtmlLabel);
	                return;
	            }
	            if (repeatCheck("#category-name-error", 0) == false) {
	                return;
	            }
	            if (nullCheck($("#category-describe").val()) == true) {
	                if (lengthCheck($("#category-describe").val(), 0, 2000) == false) {
	                    $("#category-describe-error").html($scope.vm.categoryDescribeBeyondLimit);
	                    return;
	                } else if (isHtmlLabel($("#category-describe").val())) {
	                    $("#category-describe-error").html($scope.vm.notContainHtmlLabel);
	                    return;
	                } else {
	                    $scope.vm.categoryDescribe = $("#category-describe").val().trim();
	                }
	            }
	            httpRequestPost("/api/ms/modeling/category/add", {
	                "categoryApplicationId": categoryApplicationId,
	                "applicationId": categoryApplicationId,
	                "categoryPid": $scope.vm.botSelectValue,
	                "categoryAttributeName": $scope.vm.categoryAttributeName,
	                "categoryName": $("#category-name").val().trim(),
	                "categoryTypeId": $("#category-type").val(),
	                "categoryModifierId": categoryModifierId,
	                "categorySceneId": categorySceneId,
	                "categoryDescribe": $scope.vm.categoryDescribe,
	                "categoryLeaf": 0
	            }, function (data) {
	                if (responseView(data) == true) {
	                    //重新加载
	                    $("#category-name").val('');
	                    reloadBot(data, 0);
	                }
	                $("#category-describe").val('');
	            }, function (err) {});
	            $scope.vm.categoryDescribe = "";
	        }

	        /**
	         * 类目名称城府判断  0:添加时的重复判断 1:修改时的重复判断
	         * @param type
	         * @returns {boolean}
	         */
	        function repeatCheck(selector, type) {
	            var flag = false;
	            var request = new Object();
	            if (type == 1) {
	                request.categoryId = $scope.vm.categoryId;
	                request.categoryApplicationId = $scope.vm.categoryApplicationId;
	                request.categoryPid = $scope.vm.categoryPid;
	                request.categoryAttributeName = $scope.vm.categoryAttributeName;
	                request.categoryName = $("#categoryName").val().trim();
	                request.categorySceneId = categorySceneId;
	            } else {
	                request.categoryApplicationId = categoryApplicationId;
	                request.categoryPid = $scope.vm.botSelectValue;
	                request.categoryAttributeName = $scope.vm.categoryAttributeName;
	                request.categoryName = $("#category-name").val().trim();
	                request.categorySceneId = categorySceneId;
	            }
	            httpRequestPostAsync("/api/ms/modeling/category/repeatcheck", request, function (data) {
	                if (responseWithoutView(data) == false) {
	                    if (data) {
	                        $(selector).html(data.info);
	                    }
	                } else {
	                    flag = true;
	                }
	            }, function (err) {});
	            return flag;
	        }
	        //局部加载 type:0->添加 1:删除 2:修改
	        function reloadBot(data, type) {
	            if (type != 0) {
	                $.each($(".aside-navs").find("li"), function (index, value) {
	                    if ($(value).find("i").attr("data-option") == $scope.vm.categoryId) {
	                        var length = $(value).parent().find("li").length - 1;
	                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
	                        if (length == 0 && type == 1) {
	                            $(value).parent().prev().find("i").attr("style", "display:none");
	                        }
	                        //移除指定元素
	                        $(value).remove();
	                    }
	                });
	            }

	            if (type == 1) {
	                return;
	            }

	            if ($scope.vm.botSelectValue == "root") {
	                initBot();
	            } else {
	                var count = 0;
	                $.each($(".aside-navs").find("i"), function (index, value) {
	                    if (type == 2) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '" title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            $(value).parent().parent().next().append(html);
	                        }
	                    } else if (type == 0) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '" title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            var obj = $(value).parent().parent().next();
	                            var nodeType = "edge";
	                            if (data.data[0].categoryAttributeName == "node") {
	                                nodeType = "edge";
	                            } else if (data.data[0].categoryAttributeName == "edge") {
	                                nodeType = "node";
	                            }
	                            var sty = styleSwitch(data.data[0].categoryTypeId, 1, nodeType);
	                            sty = sty.substring(7, sty.length - 1);
	                            if ($(value).parent().parent().next() != null) {
	                                var len = $(value).parent().parent().next().find("li").length;
	                                if (len > 0) {
	                                    $(value).parent().parent().next().append(html);
	                                } else {
	                                    $(value).parent().parent().next().append(html);
	                                    $(value).attr("style", sty);
	                                }
	                            } else {
	                                var htmlAppend = '<ul class="menus show">' + html + '</ul>';
	                                $(value).parent().parent().parent().append(htmlAppend);
	                                //加上子节点之后 把开关按钮显示
	                                $(value).attr("style", sty);
	                            }
	                        }
	                    }
	                });
	                if (count == 0) {
	                    initBot();
	                }
	            }
	        }
	        //返回状态显示
	        function responseView(data) {
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //返回状态显示
	        function responseWithoutView(data) {
	            if (data == null) {
	                return false;
	            }
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //属性填充
	        function botInfoToCategoryAttribute() {
	            if ($scope.vm.botInfo) {
	                var category = JSON.parse($scope.vm.botInfo);
	                $scope.vm.botSelectValue = category.categoryId;
	                $scope.vm.categoryId = category.categoryId;
	                $scope.vm.categoryTypeId = category.categoryTypeId;
	                categorySceneId = category.categorySceneId;
	                $scope.vm.categoryName = category.categoryName;
	                $scope.vm.categoryAttributeName = category.categoryAttributeName;
	                $scope.vm.categoryPid = category.categoryPid;
	                $scope.vm.categoryApplicationId = category.categoryApplicationId;
	                if (nullCheck(category.categoryDescribe) == true) {
	                    $scope.vm.categoryDescribe = underlineToWhiteSpace(category.categoryDescribe);
	                }
	                $scope.vm.categoryLeaf = category.categoryLeaf;
	            }
	        }
	        //禁用指定属性类型
	        function disableAttributeType() {
	            $.each($("#category-type").find("option"), function (index, value) {
	                if ($scope.vm.categoryAttributeName == "node") {
	                    $(value).attr("disabled", null);
	                    $(value).attr("style", "");
	                } else {
	                    if (($(value).val() == $scope.vm.botSelectType) > 0) {
	                        $("#category-type").val($scope.vm.botSelectType);
	                        $(value).attr("disabled", null);
	                        $(value).attr("style", "");
	                    } else {
	                        $(value).attr("disabled", "disabled");
	                        $(value).attr("style", "background-color: lightgrey");
	                    }
	                }
	            });
	        }
	        //清除已选颜色
	        function clearColor() {
	            $.each($(".aside-navs").find("span"), function (index, value) {
	                if ($(this).attr("node-option") == "node") {
	                    $(this).attr("style", "");
	                } else if ($(this).attr("node-option") == "edge") {
	                    $(this).attr("style", "color:#ED7D31;");
	                }
	            });
	        }
	        //自动转换图标类型
	        function styleSwitch(type, leaf, attrType) {
	            var styleHidden = "display: inline-block;";
	            if (leaf == 0) {
	                styleHidden = "display:none;";
	            }
	            if (attrType == "node") {
	                return "style='" + styleHidden + "position: relative;top: -1px;margin-right: 2px;width: 15px;height: 15px;vertical-align: middle;background-position: left top;background-repeat: no-repeat;background-image: url(../../images/images/aside-nav-icon.png);'";
	            }
	            var style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
	            switch (type) {
	                case 161:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
	                case 160:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
	                case 162:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
	            }
	            return style;
	        }
	        //节点样式转换
	        function nodeStyleSwitch(attrType) {
	            if (attrType == "edge") {
	                return "style='color:#ED7D31;'";
	            } else {
	                return "";
	            }
	        }
	        //显示节点描述
	        function categoryDescribeView(describeStr) {
	            if (nullCheck(describeStr) == true) {
	                return "title='" + describeStr + "'";
	            }
	            return "";
	        }
	        $("#category-name").blur(function () {
	            if (lengthCheck($("#category-name").val(), 0, 50) == false) {
	                $("#category-name-error").html($scope.vm.categoryNameNullOrBeyondLimit);
	            } else {
	                $("#category-name-error").html('');
	                repeatCheck("#category-name-error", 0);
	            }
	        });
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "business_ontology_tree_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/category/export", {
	                "categoryApplicationId": categoryApplicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    if (data.exportFileNameList.length > 0) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	        function batchUpload() {
	            var pid = 'root';
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/batch_upload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    initBot();
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/category/batchAdd?applicationId=' + categoryApplicationId + '&modifierId=' + categoryModifierId + '&sceneId=' + categorySceneId + '&pid=' + pid);
	                }, 100);
	            }
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/5.
	 * @Module : 类目库套用
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('BotApplyController', ['$scope', 'localStorageService', '$timeout', "$state", "$stateParams", "ngDialog", "$cookieStore", '$interval', function ($scope, localStorageService, $timeout, $state, $stateParams, ngDialog, $cookieStore, $interval) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            botSelectValue: "root",
	            categoryNode: "node",
	            categoryEdge: "edge",
	            botRoot: "", //根节点
	            knowledgeBotVal: "", //bot 内容
	            botLibrarySelectValue: "root",
	            botLibraryRoot: "", //根节点
	            knowledgeBotLibraryVal: "", //bot 内容
	            clearColor: clearColor,
	            clearColorLibrary: clearColorLibrary,
	            applyCategory: applyCategory,
	            botInfo: null, //bot信息
	            deleteBot: deleteBot,
	            categoryId: "",
	            categoryTypeId: 163,
	            botSelectType: 163,
	            categorySceneId: 0,
	            categoryAttributeName: "edge",
	            categoryName: "",
	            categoryPid: "",
	            categoryApplicationId: "",
	            categoryLeaf: 1,
	            botLibraryInfo: null, //bot信息
	            addBotLibrary: addBotLibrary, //添加点击时间
	            editBotLibrary: editBotLibrary,
	            deleteBotLibrary: deleteBotLibrary,
	            categoryLibraryId: "",
	            categoryLibraryTypeId: 163,
	            botLibrarySelectType: 163,
	            categoryLibrarySceneId: 0,
	            categoryLibraryAttributeName: "edge",
	            categoryLibraryName: "",
	            categoryLibraryPid: "",
	            categoryLibraryDescribe: "",
	            categoryLibraryLeaf: 1,
	            reloadBotLibrary: reloadBotLibrary,
	            reloadBot: reloadBot,
	            disableAttributeTypeForApply: disableAttributeTypeForApply,
	            repeatCheckForCategory: repeatCheckForCategory,
	            categoryNameNullOrBeyondLimit: "类目名称为空或超过长度限制50",
	            notContainHtmlLabel: "不能包含HTML标签",
	            categoryDescribeBeyondLimit: "描述超过长度限制2000",
	            responseView: responseView,
	            searchNodeForBot: searchNodeForBot,
	            recursionForBot: recursionForBot,
	            autoHeightForBot: autoHeightForBot,
	            locationForBot: locationForBot,
	            suggestionValue: "",
	            suggestionData: "",
	            winHeight: 0
	        };

	        // var categoryApplicationId = $cookieStore.get("applicationId");
	        // var categoryModifierId = $cookieStore.get("userId");
	        // var categorySceneId = $cookieStore.get("sceneId");
	        var categoryApplicationId = APPLICATION_ID;
	        var categoryModifierId = USER_ID;
	        var categorySceneId = SCENE_ID;

	        autoHeightForBot();

	        function autoHeightForBot() {
	            var $win = $(window);
	            var winHeight = $win.height() * 0.75;
	            $scope.vm.winHeight = winHeight + 5;
	            $(".libraryFt").attr("style", "width: 450px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: left;");
	            $(".library_mid").attr("style", "width: 200px;height: " + winHeight + "px;background: #fff;padding: 50px 20px;");
	            $(".libraryRth").attr("style", "width: 670px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: right;padding: 30px;");
	        }

	        var params = {
	            "categoryName": $("#category-autocomplete").val().trim(),
	            "categoryAttributeName": "node",
	            "categorySceneId": categorySceneId
	        };
	        //类目查找自动补全
	        $('#category-autocomplete').autocomplete({
	            serviceUrl: "/api/ms/modeling/categorylibrary/searchbycategoryname",
	            type: 'POST',
	            params: params,
	            paramName: 'categoryName',
	            dataType: 'json',
	            transformResult: function transformResult(data) {
	                var result = new Object();
	                var array = [];
	                if (data.data) {
	                    for (var i = 0; i < data.data.length; i++) {
	                        array[i] = {
	                            data: data.data[i].categoryId,
	                            value: data.data[i].categoryName
	                        };
	                    }
	                }
	                result.suggestions = array;
	                return result;
	            },
	            onSelect: function onSelect(suggestion) {
	                searchNodeForBot(suggestion);
	                $scope.vm.suggestionValue = suggestion.value;
	                $scope.vm.suggestionData = suggestion.data;
	            }
	        });
	        $interval(function () {
	            if (nullCheck($scope.vm.suggestionData) == true) {
	                var suggestion = new Object();
	                suggestion.value = $scope.vm.suggestionValue;
	                suggestion.data = $scope.vm.suggestionData;
	                if (locationForBotFlag(suggestion)) {
	                    locationForBot(suggestion);
	                    $scope.vm.suggestionValue = "";
	                    $scope.vm.suggestionData = "";
	                }
	            }
	        }, 2000);
	        function locationForBot(suggestion) {
	            var currentNodeId = suggestion.data;
	            var initHeight = 0;
	            var sum = $("#library").find("i").length;
	            $.each($("#library").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    var offset = 0;
	                    if (scrollHeight - 100 > 0) {
	                        offset = (initHeight + 1) / sum * (scrollHeight - 100);
	                    }
	                    $(".libraryFt").animate({
	                        scrollTop: offset + "px"
	                    }, 800);
	                    return false;
	                } else {
	                    initHeight++;
	                }
	            });
	        }
	        function locationForBot(suggestion) {
	            var currentNodeId = suggestion.data;
	            var initHeight = 0;
	            var sum = $("#library").find("i").length;
	            $.each($("#library").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    var offset = 0;
	                    if (scrollHeight - 100 > 0) {
	                        offset = (initHeight + 1) / sum * (scrollHeight - 100);
	                    }
	                    $(".libraryFt").animate({
	                        scrollTop: offset + "px"
	                    }, 800);
	                    return false;
	                } else {
	                    initHeight++;
	                }
	            });
	        }
	        function locationForBotFlag(suggestion) {
	            var currentNodeId = suggestion.data;
	            var flag = false;
	            var sum = $("#library").find("i").length;
	            $.each($("#library").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    if (sum >= 10 && scrollHeight >= $scope.vm.winHeight) {
	                        flag = true;
	                    } else if (sum < 10) {
	                        flag = true;
	                    }
	                    return false;
	                }
	            });
	            return flag;
	        }
	        //搜寻节点
	        function searchNodeForBot(suggestion) {
	            var currentNodeId = suggestion.data;
	            var firstNode = $("#library").find("i").filter(":eq(0)");
	            if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                appendLibraryTree(firstNode);
	            } else if ($(firstNode).parent().parent().next() == null) {
	                appendLibraryTree(firstNode);
	            }
	            if ($(firstNode).attr("data-option") == currentNodeId) {
	                clearColorLibrary();
	                $scope.vm.knowledgeBotLibraryVal = $(firstNode).next().html();
	                $scope.vm.botLibrarySelectValue = $(firstNode).next().attr("data-option");
	                $scope.vm.botSelectType = $(firstNode).next().attr("type-option");
	                $scope.vm.categoryLibraryAttributeName = $(firstNode).next().attr("node-option");
	                $(firstNode).next().attr("style", "color:black;font-weight:bold;");
	                $scope.$apply();
	            } else {
	                recursionForBot(suggestion, firstNode);
	            }
	        }
	        function recursionForBot(suggestion, node) {
	            var list = $("#library").find("li");
	            var flag = false;
	            $.each(list, function (index, value) {
	                if ($(value).attr("data-option") == $(node).attr("data-option")) {
	                    var currNode = $(value).find("i").filter(":eq(0)");
	                    if ($(currNode).attr("data-option") == suggestion.data) {
	                        clearColorLibrary();
	                        $scope.vm.knowledgeBotLibraryVal = $(currNode).next().html();
	                        $scope.vm.botLibrarySelectValue = $(currNode).next().attr("data-option");
	                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
	                        $scope.vm.categoryLibraryAttributeName = $(currNode).next().attr("node-option");
	                        $(currNode).next().attr("style", "color:black;font-weight:bold;");
	                        $scope.$apply();
	                        flag = true;
	                        //跳出
	                        return true;
	                    } else {
	                        if (flag == true) {
	                            return true;
	                        }
	                        //展开
	                        if ($(currNode).css("backgroundPosition") == "0% 0%") {
	                            appendLibraryTree(currNode);
	                        } else if ($(currNode).parent().parent().next() == null) {
	                            appendLibraryTree(currNode);
	                        }
	                        //递归
	                        recursionForBot(suggestion, currNode);
	                    }
	                }
	            });
	        }
	        //加载业务树
	        initBot();
	        initBotLibrary();
	        //获取root 数据
	        function initBot() {
	            $("#category").empty();
	            httpRequestPostAsync("/api/ms/modeling/category/listbycategorypid", {
	                "categoryApplicationId": categoryApplicationId,
	                "categoryPid": "root"
	            }, function (data) {
	                var html = '<ul class="menus show">';
	                for (var i = 0; data.data != null && i < data.data.length; i++) {
	                    html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' type-option="' + data.data[i].categoryTypeId + '" node-option="' + data.data[i].categoryAttributeName + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[i]) + '><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                }
	                html += '</ul>';
	                $("#category").append(html);
	                var firstNode = $("#category").find("i").filter(":eq(0)");
	                if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                    appendTree(firstNode);
	                } else if ($(firstNode).parent().parent().next() == null) {
	                    appendTree(firstNode);
	                }
	            }, function () {});
	        }
	        function initBotLibrary() {
	            $("#library").empty();
	            httpRequestPost("/api/ms/modeling/categorylibrary/listbycategorypid", {
	                "categoryPid": "root",
	                "categorySceneId": categorySceneId
	            }, function (data) {
	                var html = '<ul class="menus show">';
	                for (var i = 0; data.data != null && i < data.data.length; i++) {
	                    html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' node-option="' + data.data[i].categoryAttributeName + '" type-option="' + data.data[i].categoryTypeId + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryLibraryString(data.data[i]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                }
	                html += '</ul>';
	                $("#library").append(html);
	                var firstNode = $("#library").find("i").filter(":eq(0)");
	                if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                    appendLibraryTree(firstNode);
	                } else if ($(firstNode).parent().parent().next() == null) {
	                    appendLibraryTree(firstNode);
	                }
	            }, function () {});
	        }
	        //节点样式转换
	        function nodeStyleSwitch(attrType) {
	            if (attrType == "edge") {
	                return "style='color:#ED7D31;'";
	            } else {
	                return "";
	            }
	        }
	        //显示节点描述
	        function categoryDescribeView(describeStr) {
	            if (nullCheck(describeStr) == true) {
	                return "title='" + describeStr + "'";
	            }
	            return "";
	        }
	        $("#category").on("click", "span", function () {
	            clearColor();
	            $scope.vm.knowledgeBotVal = $(this).html();
	            $scope.vm.botSelectValue = $(this).attr("data-option");
	            $scope.vm.categoryAttributeName = $(this).attr("node-option");
	            if ($scope.vm.categoryAttributeName == "node") {
	                $(this).attr("style", "color:black;font-weight:bold;");
	            } else if ($scope.vm.categoryAttributeName == "edge") {
	                $(this).attr("style", "color:#ED7D31;font-weight:bold;");
	            }
	            $scope.$apply();
	        });
	        $("#library").on("click", "span", function () {
	            clearColorLibrary();
	            $scope.vm.knowledgeBotLibraryVal = $(this).html();
	            $scope.vm.botLibrarySelectValue = $(this).attr("data-option");
	            $scope.vm.botSelectType = $(this).attr("type-option");
	            $scope.vm.categoryLibraryAttributeName = $(this).attr("node-option");
	            if ($scope.vm.categoryLibraryAttributeName == "node") {
	                $(this).attr("style", "color:black;font-weight:bold;");
	            } else if ($scope.vm.categoryLibraryAttributeName == "edge") {
	                $(this).attr("style", "color:#ED7D31;font-weight:bold;");
	            }
	            $scope.$apply();
	        });
	        //点击下一级 bot 下拉数据填充以及下拉效果
	        $("#category").on("click", 'i', function () {
	            appendTree(this);
	        });
	        $("#library").on("click", 'i', function () {
	            appendLibraryTree(this);
	        });
	        //加载子树
	        function appendTree(obj) {
	            var id = $(obj).attr("data-option");
	            var that = $(obj);
	            if (!that.parent().parent().siblings().length) {
	                that.css("backgroundPosition", "0% 100%");
	                httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                    "categoryApplicationId": categoryApplicationId,
	                    "categoryPid": id
	                }, function (data) {
	                    if (data.data) {
	                        var html = '<ul class="menus">';
	                        for (var i = 0; i < data.data.length; i++) {
	                            html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' type-option="' + data.data[i].categoryTypeId + '" node-option="' + data.data[i].categoryAttributeName + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[i]) + '><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                        }
	                        html += "</ul>";
	                        $(html).appendTo(that.parent().parent().parent());
	                        that.parent().parent().next().slideDown();
	                    }
	                }, function (err) {});
	            } else {
	                if (that.css("backgroundPosition") == "0% 0%") {
	                    that.css("backgroundPosition", "0% 100%");
	                    that.parent().parent().next().slideDown();
	                } else {
	                    that.css("backgroundPosition", "0% 0%");
	                    that.parent().parent().next().slideUp();
	                }
	            }
	        }
	        function appendLibraryTree(obj) {
	            var id = $(obj).attr("data-option");
	            var that = $(obj);
	            if (!that.parent().parent().siblings().length) {
	                that.css("backgroundPosition", "0% 100%");
	                httpRequestPostAsync("/api/ms/modeling/categorylibrary/listbycategorypid", {
	                    "categoryPid": id
	                }, function (data) {
	                    if (data.data) {
	                        var html = '<ul class="menus">';
	                        for (var i = 0; i < data.data.length; i++) {
	                            html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' node-option="' + data.data[i].categoryAttributeName + '" type-option="' + data.data[i].categoryTypeId + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryLibraryString(data.data[i]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                        }
	                        html += "</ul>";
	                        $(html).appendTo(that.parent().parent().parent());
	                        that.parent().parent().next().slideDown();
	                    }
	                }, function (err) {});
	            } else {
	                if (that.css("backgroundPosition") == "0% 0%") {
	                    that.css("backgroundPosition", "0% 100%");
	                    that.parent().parent().next().slideDown();
	                } else {
	                    that.css("backgroundPosition", "0% 0%");
	                    that.parent().parent().next().slideUp();
	                }
	            }
	        }
	        //清除已选颜色
	        function clearColorLibrary() {
	            $.each($("#library").find("span"), function (index, value) {
	                if ($(this).attr("node-option") == "node") {
	                    $(this).attr("style", "");
	                } else if ($(this).attr("node-option") == "edge") {
	                    $(this).attr("style", "color:#ED7D31;");
	                }
	            });
	        }
	        //清除已选颜色
	        function clearColor() {
	            $.each($("#category").find("span"), function (index, value) {
	                if ($(this).attr("node-option") == "node") {
	                    $(this).attr("style", "");
	                } else if ($(this).attr("node-option") == "edge") {
	                    $(this).attr("style", "color:#ED7D31;");
	                }
	            });
	        }
	        //自动转换图标类型
	        function styleSwitch(type, leaf, attrType) {
	            var styleHidden = "display: inline-block;";
	            if (leaf == 0) {
	                styleHidden = "display:none;";
	            }
	            if (attrType == "node") {
	                return "style='" + styleHidden + "position: relative;top: -1px;margin-right: 2px;width: 15px;height: 15px;vertical-align: middle;background-position: left top;background-repeat: no-repeat;background-image: url(../../images/images/aside-nav-icon.png);'";
	            }
	            var style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
	            switch (type) {
	                case 161:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
	                case 160:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
	                case 162:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
	            }
	            return style;
	        }
	        //套用
	        function applyCategory() {
	            if (applyValid() == false) {
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/categorylibrary/applycategorybyid", {
	                "categoryId": $scope.vm.botLibrarySelectValue,
	                "categoryPid": $scope.vm.botSelectValue,
	                "categoryApplicationId": categoryApplicationId,
	                "categoryModifierId": categoryModifierId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    initBot();
	                }
	            }, function (err) {});
	        }
	        //套用验证
	        function applyValid() {
	            //rule edge->node
	            if ($scope.vm.botLibrarySelectValue == "root") {
	                layer.msg("请选择要套用的bot节点");
	                return false;
	            }
	            if ($scope.vm.categoryAttributeName == $scope.vm.categoryLibraryAttributeName) {
	                if ($scope.vm.categoryAttributeName == "edge") {
	                    layer.msg("关系以下必须添加节点");
	                } else {
	                    layer.msg("节点以下必须添加关系");
	                }
	                return false;
	            }
	            return true;
	        }
	        $("#category").on("click", ".delete", function () {
	            $scope.vm.botInfo = $(this).parent().attr("bot-info");
	            botInfoToCategoryAttribute();
	            deleteBot();
	        });
	        $("#library").on("click", ".edit", function () {
	            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
	            botLibraryInfoToCategoryAttribute();
	            editBotLibrary();
	        });
	        $("#library").on("click", ".delete", function () {
	            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
	            botLibraryInfoToCategoryAttribute();
	            deleteBotLibrary();
	        });
	        function deleteBot() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/delete_category.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        httpRequestPost("/api/ms/modeling/category/deletebycategoryid", {
	                            "categoryId": $scope.vm.categoryId,
	                            "categoryApplicationId": $scope.vm.categoryApplicationId,
	                            "categoryPid": $scope.vm.categoryPid,
	                            "categoryLeaf": $scope.vm.categoryLeaf
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBot(data, 1);
	                            }
	                        }, function (err) {});
	                    } else {}
	                }
	            });
	        }
	        //属性填充
	        function botInfoToCategoryAttribute() {
	            if ($scope.vm.botInfo) {
	                var category = JSON.parse($scope.vm.botInfo);
	                $scope.vm.botSelectValue = category.categoryId;
	                $scope.vm.categoryId = category.categoryId;
	                $scope.vm.categoryTypeId = category.categoryTypeId;
	                $scope.vm.categorySceneId = category.categorySceneId;
	                $scope.vm.categoryAttributeName = category.categoryAttributeName;
	                $scope.vm.categoryName = category.categoryName;
	                $scope.vm.categoryPid = category.categoryPid;
	                $scope.vm.categoryApplicationId = category.categoryApplicationId;
	                $scope.vm.categoryLeaf = category.categoryLeaf;
	            }
	        }
	        //属性填充
	        function botLibraryInfoToCategoryAttribute() {
	            if ($scope.vm.botLibraryInfo) {
	                var category = JSON.parse($scope.vm.botLibraryInfo);
	                $scope.vm.botLibrarySelectValue = category.categoryId;
	                $scope.vm.categoryLibraryId = category.categoryId;
	                $scope.vm.categoryLibraryTypeId = category.categoryTypeId;
	                $scope.vm.categoryLibrarySceneId = category.categorySceneId;
	                $scope.vm.categoryLibraryAttributeName = category.categoryAttributeName;
	                $scope.vm.categoryLibraryName = category.categoryName;
	                $scope.vm.categoryLibraryPid = category.categoryPid;
	                if (nullCheck(category.categoryDescribe) == true) {
	                    $scope.vm.categoryLibraryDescribe = underlineToWhiteSpace(category.categoryDescribe);
	                }
	                $scope.vm.categoryLibraryLeaf = category.categoryLeaf;
	            }
	        }
	        //局部加载 type:0->添加 1:删除 2:修改
	        function reloadBot(data, type) {
	            if (type != 0) {
	                $.each($(".aside-navs").find("li"), function (index, value) {
	                    if ($(value).find("i").attr("data-option") == $scope.vm.categoryId) {
	                        var currPid = $(value).attr("data-option");
	                        var length = $(value).parent().find("li").length - 1;
	                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
	                        if (length == 0 && type == 1) {
	                            $(value).parent().prev().find("i").attr("style", "display:none");
	                        }
	                        //移除指定元素
	                        $(value).remove();
	                    }
	                });
	            }

	            if (type == 1) {
	                return;
	            }

	            if ($scope.vm.botSelectValue == "root") {
	                initBot();
	            } else {
	                var count = 0;
	                $.each($(".aside-navs").find("i"), function (index, value) {
	                    if (type == 2) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '" title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            $(value).parent().parent().next().append(html);
	                        }
	                    } else if (type == 0) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '" title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            var obj = $(value).parent().parent().next();
	                            var sty = styleSwitch(data.data[0].categoryTypeId, 1, data.data[0].categoryAttributeName);
	                            sty = sty.substring(7, sty.length - 1);
	                            if ($(value).parent().parent().next() != null) {
	                                var len = $(value).parent().parent().next().find("li").length;
	                                if (len > 0) {
	                                    $(value).parent().parent().next().append(html);
	                                } else {
	                                    $(value).parent().parent().next().append(html);
	                                    $(value).attr("style", sty);
	                                }
	                            } else {
	                                var htmlAppend = '<ul class="menus show">' + html + '</ul>';
	                                $(value).parent().parent().parent().append(htmlAppend);
	                                //加上子节点之后 把开关按钮显示
	                                $(value).attr("style", sty);
	                            }
	                        }
	                    }
	                });
	                if (count == 0) {
	                    initBot();
	                }
	            }
	        }
	        function addBotLibrary() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/add_category_library.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (lengthCheck($("#categoryLibraryNameAdd").val(), 0, 50) == false) {
	                            $("#addErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                            return false;
	                        }
	                        if (isHtmlLabel($("#categoryLibraryNameAdd").val())) {
	                            $("#addErrorView").html($scope.vm.notContainHtmlLabel);
	                            return false;
	                        }
	                        if (repeatCheckForCategory("#addErrorView", 0) == false) {
	                            return false;
	                        }
	                        if (nullCheck($("#categoryLibraryDescribe").val()) == true) {
	                            if (lengthCheck($("#categoryLibraryDescribe").val(), 0, 2000) == false) {
	                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
	                                return false;
	                            } else if (isHtmlLabel($("#categoryLibraryDescribe").val())) {
	                                $("#describeErrorView").html($scope.vm.notContainHtmlLabel);
	                                return false;
	                            } else {
	                                $scope.vm.categoryLibraryDescribe = $("#categoryLibraryDescribe").val().trim();
	                            }
	                        }
	                        httpRequestPost("/api/ms/modeling/categorylibrary/add", {
	                            "categoryPid": $scope.vm.botLibrarySelectValue,
	                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
	                            "categoryName": $("#categoryLibraryNameAdd").val().trim(),
	                            "categoryTypeId": $("#categoryLibraryTypeIdAdd").val(),
	                            "categoryModifierId": categoryModifierId,
	                            "categoryDescribe": $scope.vm.categoryLibraryDescribe,
	                            "categorySceneId": categorySceneId,
	                            "categoryLeaf": 0
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBotLibrary(data, 0);
	                            }
	                            $("#categoryLibraryDescribe").val('');
	                        }, function (err) {});
	                    } else {}
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    disableAttributeTypeForApply();
	                    $("#categoryLibraryNameAdd").blur(function () {
	                        if (lengthCheck($("#categoryLibraryNameAdd").val(), 0, 50) == false) {
	                            $("#addErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                        } else if (isHtmlLabel($("#categoryLibraryNameAdd").val())) {
	                            $("#addErrorView").html($scope.vm.notContainHtmlLabel);
	                        } else {
	                            $("#addErrorView").html('');
	                            repeatCheckForCategory("#addErrorView", 0);
	                        }
	                    });
	                }, 100);
	            }
	        }
	        /**
	         * 类目名称城府判断  0:添加时的重复判断 1:修改时的重复判断
	         * @param type
	         * @returns {boolean}
	         */
	        function repeatCheckForCategory(selector, type) {
	            var flag = false;
	            var request = new Object();
	            if (type == 1) {
	                request.categoryId = $scope.vm.categoryLibraryId;
	                request.categoryPid = $scope.vm.categoryLibraryPid;
	                request.categoryAttributeName = $("#categoryLibraryName").val().trim();
	                request.categoryName = $("#categoryLibraryName").val().trim();
	                request.categorySceneId = categorySceneId;
	            } else {
	                request.categoryPid = $scope.vm.botLibrarySelectValue;
	                request.categoryAttributeName = $("#categoryLibraryNameAdd").val().trim();
	                request.categoryName = $("#categoryLibraryNameAdd").val();
	                request.categorySceneId = categorySceneId;
	            }
	            httpRequestPostAsync("/api/ms/modeling/categorylibrary/repeatcheck", request, function (data) {
	                if (responseWithoutView(data) == false) {
	                    if (data) {
	                        $(selector).html(data.info);
	                    }
	                } else {
	                    flag = true;
	                }
	            }, function (err) {});
	            return flag;
	        }
	        function editBotLibrary() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/edit_category_library.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (lengthCheck($("#categoryLibraryName").val(), 0, 50) == false) {
	                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                            return false;
	                        }
	                        if (isHtmlLabel($("#categoryLibraryName").val())) {
	                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
	                            return false;
	                        }
	                        if (repeatCheckForCategory("#editErrorView", 1) == false) {
	                            return false;
	                        }
	                        if (nullCheck($("#categoryLibraryDescribe").val()) == true) {
	                            if (lengthCheck($("#categoryLibraryDescribe").val(), 0, 2000) == false) {
	                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
	                                return false;
	                            } else if (isHtmlLabel($("#categoryLibraryDescribe").val())) {
	                                $("#describeErrorView").html($scope.vm.notContainHtmlLabel);
	                                return false;
	                            } else {
	                                $scope.vm.categoryLibraryDescribe = $("#categoryLibraryDescribe").val().trim();
	                            }
	                        }
	                        httpRequestPost("/api/ms/modeling/categorylibrary/updatebycategoryid", {
	                            "categoryId": $scope.vm.categoryLibraryId,
	                            "categoryPid": $scope.vm.categoryLibraryPid,
	                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
	                            "categoryName": $("#categoryLibraryName").val().trim(),
	                            "categoryTypeId": $("#categoryLibraryTypeId").val(),
	                            "categoryModifierId": categoryModifierId,
	                            "categoryDescribe": $scope.vm.categoryLibraryDescribe,
	                            "categorySceneId": categorySceneId,
	                            "categoryLeaf": $scope.vm.categoryLibraryLeaf
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBotLibrary(data, 2);
	                            }
	                            $("#categoryLibraryDescribe").val('');
	                        }, function (err) {});
	                    } else {}
	                    //初始节点类型
	                    //$scope.vm.categoryLibraryAttributeName="edge";
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    $("#categoryLibraryName").blur(function () {
	                        if (lengthCheck($("#categoryLibraryName").val(), 0, 50) == false) {
	                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
	                        } else if (isHtmlLabel($("#categoryLibraryName").val())) {
	                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
	                        } else {
	                            $("#editErrorView").html('');
	                            repeatCheckForCategory("#editErrorView", 1);
	                        }
	                    });
	                    $("#categoryLibraryTypeId").empty();
	                    var attrArr = [];
	                    attrArr[0] = { name: "默认", value: 163 };
	                    attrArr[1] = { name: "流程", value: 161 };
	                    attrArr[2] = { name: "划分", value: 160 };
	                    attrArr[3] = { name: "属性", value: 162 };
	                    for (var index = 0; index < attrArr.length; index++) {
	                        if ($scope.vm.categoryLibraryAttributeName == "edge") {
	                            $("#categoryLibraryTypeId").append('<option value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                        } else {
	                            if ((attrArr[index].value == $scope.vm.botSelectType) > 0) {
	                                $("#categoryLibraryTypeId").append('<option value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                            } else {
	                                $("#categoryLibraryTypeId").append('<option disabled="disabled" style="background-color: lightgrey;" value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                            }
	                        }
	                    }
	                    $("#categoryLibraryTypeId").val($scope.vm.botSelectType);
	                }, 100);
	            }
	        }
	        function deleteBotLibrary() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/bot/delete_category.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        httpRequestPost("/api/ms/modeling/categorylibrary/deletebycategoryid", {
	                            "categoryId": $scope.vm.categoryLibraryId,
	                            "categoryPid": $scope.vm.categoryLibraryPid,
	                            "categoryLeaf": $scope.vm.categoryLibraryLeaf
	                        }, function (data) {
	                            if (responseView(data) == true) {
	                                //重新加载
	                                reloadBotLibrary(data, 1);
	                            }
	                        }, function (err) {});
	                    } else {}
	                    //初始节点类型
	                    $scope.vm.categoryLibraryAttributeName = "edge";
	                }
	            });
	        }
	        //返回状态显示
	        function responseView(data) {
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //返回状态显示
	        function responseWithoutView(data) {
	            if (data == null) {
	                return false;
	            }
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //局部加载 type:0->添加 1:删除 2:修改
	        function reloadBotLibrary(data, type) {
	            if (type != 0) {
	                $.each($("#library").find("li"), function (index, value) {
	                    if ($(value).find("i").attr("data-option") == $scope.vm.botLibrarySelectValue) {
	                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
	                        if (length == 0 && type == 1) {
	                            $(value).parent().prev().find("i").attr("style", "display:none");
	                        }
	                        //移除指定元素
	                        $(value).remove();
	                    }
	                });
	            }

	            if (type == 1) {
	                return;
	            }

	            if ($scope.vm.botLibrarySelectValue == "root") {
	                initBotLibrary();
	            } else {
	                var count = 0;
	                $.each($("#library").find("i"), function (index, value) {
	                    if (type == 2) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '"title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryLibraryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            $(value).parent().parent().next().append(html);
	                        }
	                    } else if (type == 0) {
	                        if ($(value).attr("data-option") == data.data[0].categoryPid) {
	                            count++;
	                            var html = '<li data-option="' + data.data[0].categoryPid + '">' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[0].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[0].categoryTypeId, data.data[0].categoryLeaf, data.data[0].categoryAttributeName) + ' data-option="' + data.data[0].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[0].categoryAttributeName) + ' node-option="' + data.data[0].categoryAttributeName + '" type-option="' + data.data[0].categoryTypeId + '" data-option="' + data.data[0].categoryId + '"title="' + data.data[0].categoryName + '">' + subStringWithTail(data.data[0].categoryName, 10, "...") + '</span>' + '&nbsp;<p class="treeEdit" bot-info=' + toCategoryLibraryString(data.data[0]) + '><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>' + '</a>' + '</div>' + '</li>';
	                            //按照修改时间排序 把数据添加到前面
	                            var obj = $(value).parent().parent().next();
	                            var nodeType = "edge";
	                            if (data.data[0].categoryAttributeName == "node") {
	                                nodeType = "edge";
	                            } else if (data.data[0].categoryAttributeName == "edge") {
	                                nodeType = "node";
	                            }
	                            var sty = styleSwitch(data.data[0].categoryTypeId, 1, nodeType);
	                            sty = sty.substring(7, sty.length - 1);
	                            if ($(value).parent().parent().next() != null) {
	                                var len = $(value).parent().parent().next().find("li").length;
	                                if (len > 0) {
	                                    $(value).parent().parent().next().append(html);
	                                } else {
	                                    $(value).parent().parent().next().append(html);
	                                    $(value).attr("style", sty);
	                                }
	                            } else {
	                                var htmlAppend = '<ul class="menus show">' + html + '</ul>';
	                                $(value).parent().parent().parent().append(htmlAppend);
	                                $(value).attr("style", sty);
	                            }
	                        }
	                    }
	                });
	                if (count == 0) {
	                    initBotLibrary();
	                }
	            }
	        }
	        //禁用指定属性类型
	        function disableAttributeTypeForApply() {
	            $("#categoryLibraryTypeIdAdd").empty();
	            var attrArr = [];
	            attrArr[0] = { name: "默认", value: 163 };
	            attrArr[1] = { name: "流程", value: 161 };
	            attrArr[2] = { name: "划分", value: 160 };
	            attrArr[3] = { name: "属性", value: 162 };
	            for (var index = 0; index < attrArr.length; index++) {
	                if ($scope.vm.categoryLibraryAttributeName == "node") {
	                    $("#categoryLibraryTypeIdAdd").append('<option value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                } else {
	                    if ((attrArr[index].value == $scope.vm.botSelectType) > 0) {
	                        $("#categoryLibraryTypeIdAdd").append('<option value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                    } else {
	                        $("#categoryLibraryTypeIdAdd").append('<option disabled="disabled" style="background-color: lightgrey;" value=' + attrArr[index].value + '>' + attrArr[index].name + '</option>');
	                    }
	                }
	            }
	            $("#categoryLibraryTypeIdAdd").val($scope.vm.botSelectType);
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 集合概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('AggregateConceptManageController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addCollective: addCollective,
	            editCollective: editCollective,
	            deleteCollective: deleteCollective,
	            listData: "", // table 数据
	            singleDelCollectiveConcept: singleDelCollectiveConcept, //單條刪除
	            singleAddCollectiveConcept: singleAddCollectiveConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchCollectiveConcept: searchCollectiveConcept,
	            searchVal: "",
	            searchType: "collectiveConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            weight: "33", //默認權重
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000",
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete
	        };

	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadCollectiveConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute", {
	                "collectiveConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadCollectiveConcept(current, data);
	            }, function () {
	                // layer.msg("请求失败")
	                console.log('请求失败');
	            });
	        }

	        function loadCollectiveConcept(current, data) {
	            clearSelectAll();
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($("#collectiveConceptWeight").val()) == true || nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchCollectiveConcept(current);
	                    } else {
	                        loadCollectiveConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            console.log("=====clearSelectAll=====");
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！", { time: 1000 });
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.ids = id_array;
	                httpRequestPost("/api/ms/modeling/concept/collective/batchDelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
	                    }
	                });
	            });
	        }
	        //编辑
	        function editCollective(item) {
	            $scope.vm.dialogTitle = "编辑集合概念";
	            $scope.vm.key = item.collectiveConceptKey;
	            $scope.vm.term = item.collectiveConceptTerm;
	            $scope.vm.weight = item.collectiveConceptWeight;
	            addCollectiveConceptDialog(singleEditCollectiveConcept, item);
	        }
	        function searchCollectiveConcept(current) {
	            if ($scope.vm.searchType == "collectiveConceptModifier") {
	                searchCollectiveConceptByUser(current);
	            } else {
	                searchCollectiveConceptByType(current);
	            }
	        }
	        //查询
	        function searchCollectiveConceptByUser(current) {
	            httpRequestPost("/api/ms/modeling/concept/collective/listByModifier", {
	                "collectiveConceptModifier": $scope.vm.searchVal,
	                "collectiveConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadCollectiveConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息", { time: 1000 });
	            });
	        }
	        function searchCollectiveConceptByType(current) {
	            var request = new Object();
	            request.collectiveConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "collectiveConceptModifyTime") {
	                request = switchCollectiveConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段", { time: 1000 });
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute", request, function (data) {
	                loadCollectiveConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchCollectiveConceptSearchType(request, value) {
	            if ($("#searchType").val() == "collectiveConceptKey") {
	                request.collectiveConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "collectiveConceptWeight") {
	                request.collectiveConceptWeight = $("#collectiveConceptWeight").val();
	            } else if ($("#searchType").val() == "collectiveConceptTerm") {
	                request.collectiveConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }

	        //添加 窗口
	        function addCollective() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/aggregate/aggregate_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/collective/repeatCheck", {
	                            "collectiveConceptApplicationId": $scope.vm.applicationId,
	                            "collectiveConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute", {
	                                        "collectiveConceptApplicationId": $scope.vm.applicationId,
	                                        "collectiveConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑集合概念";
	                                        console.log(data);
	                                        addCollectiveConceptDialog(singleEditCollectiveConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].collectiveConceptKey;
	                                        $scope.vm.term = data.data[0].collectiveConceptTerm;
	                                        $scope.vm.weight = data.data[0].collectiveConceptWeight;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加集合概念";
	                                $scope.vm.term = "";
	                                $scope.vm.weight = "33"; //默認權重
	                                addCollectiveConceptDialog(singleAddCollectiveConcept);
	                            }
	                        }, function () {
	                            //layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#collectiveKey").blur(function () {
	                        if (lengthCheck($("#collectiveKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addCollectiveConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/aggregate/aggregate_concept_manage_dialog2.html",
	                scope: $scope,
	                Returns: { a: 1 },
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }

	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#colectiveKeyTwo").blur(function () {
	                        if (lengthCheck($("#colectiveKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteCollective(id) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/delete.html",
	                scope: $scope,
	                width: '260px',
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        singleDelCollectiveConcept(id);
	                    }
	                }
	            });
	        }
	        //批量导入
	        function batchUpload() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/businessModeling/batchUpload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/concept/collective/batchAdd?applicationId=' + $scope.vm.applicationId + '&modifierId=' + $scope.vm.modifier);
	                }, 100);
	            }
	        }
	        //編輯事件
	        function singleEditCollectiveConcept(item) {
	            assembleCollectiveConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/collective/update", {
	                "collectiveConceptId": item.collectiveConceptId,
	                "collectiveConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "collectiveConceptKey": $scope.vm.key,
	                "collectiveConceptModifier": $scope.vm.modifier,
	                "collectiveConceptTerm": $scope.vm.term,
	                "collectiveConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddCollectiveConcept() {
	            assembleCollectiveConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/collective/add", {
	                "collectiveConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "collectiveConceptKey": $scope.vm.key,
	                "collectiveConceptModifier": $scope.vm.modifier,
	                "collectiveConceptTerm": $scope.vm.term,
	                "collectiveConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelCollectiveConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/collective/delete", {
	                "collectiveConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleCollectiveConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            $scope.vm.key = "";
	            $scope.vm.term = "";
	            $scope.vm.weight = 33;
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "concept_with_weight_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/concept/collective/export", {
	                "collectiveConceptApplicationId": $scope.vm.applicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    for (var i = 0; i < data.exportFileNameList.length; i++) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 同一概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('SynonymConceptController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addSynonym: addSynonym,
	            editSynonym: editSynonym,
	            deleteSynonym: deleteSynonym,
	            listData: "", // table 数据
	            singleDelSynonymConcept: singleDelSynonymConcept, //單條刪除
	            singleAddSynonymConcept: singleAddSynonymConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchSynonymConcept: searchSynonymConcept,
	            searchVal: "",
	            searchType: "synonymConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            oldKey: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            weight: "33", //默認權重
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000",
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete
	        };

	        /**
	         * 加载分页条
	         * @type
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadSynonymConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/synonym/listByAttribute", {
	                "synonymConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadSynonymConcept(current, data);
	            }, function () {
	                //layer.msg("请求失败")
	                console.log('请求失败');
	            });
	        }
	        function loadSynonymConcept(current, data) {
	            clearSelectAll();
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($("#synonymConceptWeight").val()) == true || nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchSynonymConcept(current);
	                    } else {
	                        loadSynonymConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            console.log("=====clearSelectAll=====");
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            var key_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                    key_array.push($(ids[i]).attr("synonymkey"));
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！");
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.synonymConceptModifier = $scope.vm.modifier;
	                request.synonymConceptApplicationId = $scope.vm.applicationId;
	                request.ids = id_array;
	                request.keyArray = key_array;
	                httpRequestPost("/api/ms/modeling/concept/synonym/batchDelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadSynonymConceptTable($scope.vm.paginationConf.currentPage);
	                    }
	                });
	            });
	        }
	        function editSynonym(item) {
	            $scope.vm.dialogTitle = "编辑同义概念";
	            $scope.vm.key = item.synonymConceptKey;
	            $scope.vm.oldKey = item.synonymConceptKey;
	            $scope.vm.term = item.synonymConceptTerm;
	            $scope.vm.weight = item.synonymConceptWeight;
	            addSynonymConceptDialog(singleEditSynonymConcept, item);
	        }
	        function searchSynonymConcept(current) {
	            //进行条件查询的时候 更新当前页数
	            if ($scope.vm.searchType == "synonymConceptModifier") {
	                searchSynonymConceptByUser(current);
	            } else {
	                searchSynonymConceptByType(current);
	            }
	        }
	        //查询
	        function searchSynonymConceptByUser(current) {
	            httpRequestPost("/api/ms/modeling/concept/synonym/listByModifier", {
	                "synonymConceptModifier": $scope.vm.searchVal,
	                "synonymConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadSynonymConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        function searchSynonymConceptByType(current) {
	            var request = new Object();
	            request.synonymConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "synonymConceptModifyTime") {
	                request = switchSynonymConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段");
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/synonym/listByAttribute", request, function (data) {
	                loadSynonymConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchSynonymConceptSearchType(request, value) {
	            if ($("#searchType").val() == "synonymConceptKey") {
	                request.synonymConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "synonymConceptWeight") {
	                request.synonymConceptWeight = $("#synonymConceptWeight").val();
	            } else if ($("#searchType").val() == "synonymConceptTerm") {
	                request.synonymConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }
	        //添加 窗口
	        function addSynonym() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/synony/synony_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/synonym/repeatCheck", {
	                            "synonymConceptApplicationId": $scope.vm.applicationId,
	                            "synonymConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/synonym/listByAttribute", {
	                                        "synonymConceptApplicationId": $scope.vm.applicationId,
	                                        "synonymConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑同义概念";
	                                        console.log(data);
	                                        addSynonymConceptDialog(singleEditSynonymConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].synonymConceptKey;
	                                        $scope.vm.term = data.data[0].synonymConceptTerm;
	                                        $scope.vm.weight = data.data[0].synonymConceptWeight;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加同义概念";
	                                $scope.vm.term = "";
	                                $scope.vm.weight = "33"; //默認權重
	                                addSynonymConceptDialog(singleAddSynonymConcept);
	                            }
	                        }, function () {
	                            //layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.oldKey = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#synonymKey").blur(function () {
	                        if (lengthCheck($("#synonymKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addSynonymConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/synony/synony_concept_manage_dialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.oldKey = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#synonymKeyTwo").blur(function () {
	                        if (lengthCheck($("#synonymKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteSynonym(id) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/delete.html",
	                scope: $scope,
	                width: '260px',
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        singleDelSynonymConcept(id);
	                    }
	                }
	            });
	        }
	        //批量导入
	        function batchUpload() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/businessModeling/batchUpload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadSynonymConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/concept/synonym/batchAdd?applicationId=' + $scope.vm.applicationId + '&modifierId=' + $scope.vm.modifier);
	                }, 100);
	            }
	        }
	        //編輯事件
	        function singleEditSynonymConcept(item) {
	            assembleSynonymConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/synonym/update", {
	                "synonymConceptId": item.synonymConceptId,
	                "synonymConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "synonymConceptKey": $scope.vm.key,
	                "synonymConceptOldKey": $scope.vm.oldKey,
	                "synonymConceptModifier": $scope.vm.modifier,
	                "synonymConceptTerm": $scope.vm.term,
	                "synonymConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSynonymConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddSynonymConcept() {
	            assembleSynonymConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/synonym/add", {
	                "synonymConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "synonymConceptKey": $scope.vm.key,
	                "synonymConceptModifier": $scope.vm.modifier,
	                "synonymConceptTerm": $scope.vm.term,
	                "synonymConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSynonymConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelSynonymConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/synonym/delete", {
	                "synonymConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSynonymConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleSynonymConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            $scope.vm.key = "";
	            $scope.vm.oldKey = "";
	            $scope.vm.term = "";
	            $scope.vm.weight = 33;
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "concept_with_weight_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/concept/synonym/export", {
	                "synonymConceptApplicationId": $scope.vm.applicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    for (var i = 0; i < data.exportFileNameList.length; i++) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : bot概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('BotConceptController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addBot: addBot,
	            editBot: editBot,
	            deleteBot: deleteBot,
	            listData: "", // table 数据
	            singleDelBotConcept: singleDelBotConcept, //單條刪除
	            singleAddBotConcept: singleAddBotConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchBotConcept: searchBotConcept,
	            searchVal: "",
	            searchType: "botConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            weight: "33", //默認權重
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000"
	        };

	        /**
	         * 加载分页条
	         * @type
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadBotConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute", {
	                "botConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadBotConcept(current, data);
	            }, function () {
	                //layer.msg("请求失败")
	                console.log('请求失败');
	            });
	        }
	        function loadBotConcept(current, data) {
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($("#botConceptWeight").val()) == true || nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchBotConcept(current);
	                    } else {
	                        loadBotConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);

	        //编辑
	        function editBot(item) {
	            $scope.vm.dialogTitle = "编辑BOT概念";
	            $scope.vm.key = item.botConceptKey;
	            $scope.vm.term = item.botConceptTerm;
	            $scope.vm.weight = item.botConceptWeight;
	            addBotConceptDialog(singleEditBotConcept, item);
	        }
	        function searchBotConcept(current) {
	            if ($scope.vm.searchType == "botConceptModifier") {
	                searchBotConceptByUser(current);
	            } else {
	                searchBotConceptByType(current);
	            }
	        }
	        //查询
	        function searchBotConceptByUser(current) {
	            httpRequestPost("/api/ms/modeling/concept/bot/listByModifier", {
	                "botConceptModifier": $scope.vm.searchVal,
	                "botConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadBotConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        function searchBotConceptByType(current) {
	            var request = new Object();
	            request.botConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "botConceptModifyTime") {
	                request = switchBotConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段");
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute", request, function (data) {
	                loadBotConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchBotConceptSearchType(request, value) {
	            if ($("#searchType").val() == "botConceptKey") {
	                request.botConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "botConceptWeight") {
	                request.botConceptWeight = $("#botConceptWeight").val();
	            } else if ($("#searchType").val() == "botConceptTerm") {
	                request.botConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }
	        //添加 窗口
	        function addBot() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/bot/bot_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/bot/repeatCheck", {
	                            "botConceptApplicationId": $scope.vm.applicationId,
	                            "botConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute", {
	                                        "botConceptApplicationId": $scope.vm.applicationId,
	                                        "botConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑BOT概念";
	                                        console.log(data);
	                                        addBotConceptDialog(singleEditBotConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].botConceptKey;
	                                        $scope.vm.term = data.data[0].botConceptTerm;
	                                        $scope.vm.weight = data.data[0].botConceptWeight;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加BOT概念";
	                                $scope.vm.term = "";
	                                $scope.vm.weight = "33"; //默認權重
	                                addBotConceptDialog(singleAddBotConcept);
	                            }
	                        }, function () {
	                            //layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#botKey").blur(function () {
	                        if (lengthCheck($("#botKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addBotConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/bot/bot_concept_manage_dialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                        $scope.vm.weight = 33;
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#botKeyTwo").blur(function () {
	                        if (lengthCheck($("#botKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteBot(id) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/delete.html",
	                scope: $scope,
	                width: '260px',
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        singleDelBotConcept(id);
	                    }
	                }
	            });
	        }
	        //編輯事件
	        function singleEditBotConcept(item) {
	            assembleBotConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/bot/update", {
	                "botConceptId": item.botConceptId,
	                "botConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "botConceptKey": $scope.vm.key,
	                "botConceptModifier": $scope.vm.modifier,
	                "botConceptTerm": $scope.vm.term,
	                "botConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddBotConcept() {
	            assembleBotConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/bot/add", {
	                "botConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "botConceptKey": $scope.vm.key,
	                "botConceptModifier": $scope.vm.modifier,
	                "botConceptTerm": $scope.vm.term,
	                "botConceptWeight": $scope.vm.weight
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelBotConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/bot/delete", {
	                "botConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleBotConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 敏感词概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('SensitiveConceptManageController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addSensitive: addSensitive,
	            editSensitive: editSensitive,
	            deleteSensitive: deleteSensitive,
	            listData: "", // table 数据
	            singleDelSensitiveConcept: singleDelSensitiveConcept, //單條刪除
	            singleAddSensitiveConcept: singleAddSensitiveConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchSensitiveConcept: searchSensitiveConcept,
	            searchVal: "",
	            searchType: "sensitiveConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000",
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete
	        };

	        /**
	         * 加载分页条
	         * @type
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadSensitiveConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/sensitive/listByAttribute", {
	                "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadSensitiveConcept(current, data);
	            }, function () {
	                //layer.msg("请求失败");
	                console.log('请求失败');
	            });
	        }
	        function loadSensitiveConcept(current, data) {
	            clearSelectAll();
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchSensitiveConcept(current);
	                    } else {
	                        loadSensitiveConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            console.log("=====clearSelectAll=====");
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！");
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.ids = id_array;
	                httpRequestPost("/api/ms/modeling/concept/sensitive/batchDelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadSensitiveConceptTable($scope.vm.paginationConf.currentPage);
	                    }
	                });
	            });
	        }
	        //编辑
	        function editSensitive(item) {
	            $scope.vm.dialogTitle = "编辑敏感概念";
	            $scope.vm.key = item.sensitiveConceptKey;
	            $scope.vm.term = item.sensitiveConceptTerm;
	            addSensitiveConceptDialog(singleEditSensitiveConcept, item);
	        }
	        function searchSensitiveConcept(current) {
	            if ($scope.vm.searchType == "sensitiveConceptModifier") {
	                searchSensitiveConceptByUser(current);
	            } else {
	                searchSensitiveConceptByType(current);
	            }
	        }
	        //查询
	        function searchSensitiveConceptByUser(current) {
	            httpRequestPost("/api/ms/modeling/concept/sensitive/listByModifier", {
	                "sensitiveConceptModifier": $scope.vm.searchVal,
	                "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadSensitiveConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        function searchSensitiveConceptByType(current) {
	            var request = new Object();
	            request.sensitiveConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "sensitiveConceptModifyTime") {
	                request = switchSensitiveConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段");
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/sensitive/listByAttribute", request, function (data) {
	                loadSensitiveConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }

	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchSensitiveConceptSearchType(request, value) {
	            if ($("#searchType").val() == "sensitiveConceptKey") {
	                request.sensitiveConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "sensitiveConceptTerm") {
	                request.sensitiveConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }

	        //添加 窗口
	        function addSensitive() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/sensitive/sensitive_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/sensitive/repeatCheck", {
	                            "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                            "sensitiveConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/sensitive/listByAttribute", {
	                                        "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                                        "sensitiveConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑敏感概念";
	                                        console.log(data);
	                                        addSensitiveConceptDialog(singleEditSensitiveConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].sensitiveConceptKey;
	                                        $scope.vm.term = data.data[0].sensitiveConceptTerm;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加敏感概念";
	                                $scope.vm.term = "";
	                                addSensitiveConceptDialog(singleAddSensitiveConcept);
	                            }
	                        }, function () {
	                            // layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#sensitiveKey").blur(function () {
	                        if (lengthCheck($("#sensitiveKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addSensitiveConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/sensitive/sensitive_concept_manage_dialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#sensitiveKeyTwo").blur(function () {
	                        if (lengthCheck($("#sensitiveKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteSensitive(id) {
	            var dia = angular.element(".ngdialog ");
	            if (dia.length == 0) {
	                var dialog = ngDialog.openConfirm({
	                    template: "/static/business_modeling/concept_library/delete.html",
	                    scope: $scope,
	                    width: '260px',
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        //关闭回掉
	                        if (e === 1) {
	                            singleDelSensitiveConcept(id);
	                        }
	                    }
	                });
	            }
	        }
	        //批量导入
	        function batchUpload() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/businessModeling/batchUpload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadSensitiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/concept/sensitive/batchAdd?applicationId=' + $scope.vm.applicationId + '&modifierId=' + $scope.vm.modifier);
	                }, 100);
	            }
	        }
	        //編輯事件
	        function singleEditSensitiveConcept(item) {
	            assembleSensitiveConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/sensitive/update", {
	                "sensitiveConceptId": item.sensitiveConceptId,
	                "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "sensitiveConceptKey": $scope.vm.key,
	                "sensitiveConceptModifier": $scope.vm.modifier,
	                "sensitiveConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSensitiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddSensitiveConcept() {
	            assembleSensitiveConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/sensitive/add", {
	                "sensitiveConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "sensitiveConceptKey": $scope.vm.key,
	                "sensitiveConceptModifier": $scope.vm.modifier,
	                "sensitiveConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSensitiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelSensitiveConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/sensitive/delete", {
	                "sensitiveConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadSensitiveConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleSensitiveConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            $scope.vm.key = "";
	            $scope.vm.term = "";
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "concept_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/concept/sensitive/export", {
	                "sensitiveConceptApplicationId": $scope.vm.applicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    for (var i = 0; i < data.exportFileNameList.length; i++) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 停用概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('disableConceptManageController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addStop: addStop,
	            editStop: editStop,
	            deleteStop: deleteStop,
	            listData: "", // table 数据
	            singleDelStopConcept: singleDelStopConcept, //單條刪除
	            singleAddStopConcept: singleAddStopConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchStopConcept: searchStopConcept,
	            searchVal: "",
	            searchType: "stopConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000",
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete
	        };

	        /**
	         * 加载分页条
	         * @type
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadStopConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/stop/listByAttribute", {
	                "stopConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadStopConcept(current, data);
	            }, function () {
	                //layer.msg("请求失败");
	                console.log('请求失败');
	            });
	        }
	        function loadStopConcept(current, data) {
	            clearSelectAll();
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchStopConcept(current);
	                    } else {
	                        loadStopConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            console.log("=====clearSelectAll=====");
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！");
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.ids = id_array;
	                httpRequestPost("/api/ms/modeling/concept/stop/batchDelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadStopConceptTable($scope.vm.paginationConf.currentPage);
	                    }
	                });
	            });
	        }
	        //编辑
	        function editStop(item) {
	            $scope.vm.dialogTitle = "编辑停用概念";
	            $scope.vm.key = item.stopConceptKey;
	            $scope.vm.term = item.stopConceptTerm;
	            addStopConceptDialog(singleEditStopConcept, item);
	        }
	        function searchStopConcept(current) {
	            if ($scope.vm.searchType == "stopConceptModifier") {
	                searchStopConceptByUser(current);
	            } else {
	                searchStopConceptByType(current);
	            }
	        }
	        //查询
	        function searchStopConceptByUser(current) {
	            console.log($scope.vm.searchVal);
	            httpRequestPost("/api/ms/modeling/concept/stop/listByModifier", {
	                "stopConceptModifier": $scope.vm.searchVal,
	                "stopConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadStopConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        function searchStopConceptByType(current) {
	            var request = new Object();
	            request.stopConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "stopConceptModifyTime") {
	                request = switchStopConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段");
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/stop/listByAttribute", request, function (data) {
	                loadStopConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }

	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchStopConceptSearchType(request, value) {
	            if ($("#searchType").val() == "stopConceptKey") {
	                request.stopConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "stopConceptTerm") {
	                request.stopConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }

	        //添加 窗口
	        function addStop() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/disable/disable_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/stop/repeatCheck", {
	                            "stopConceptApplicationId": $scope.vm.applicationId,
	                            "stopConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/stop/listByAttribute", {
	                                        "stopConceptApplicationId": $scope.vm.applicationId,
	                                        "stopConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑停用概念";
	                                        console.log(data);
	                                        addStopConceptDialog(singleEditStopConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].stopConceptKey;
	                                        $scope.vm.term = data.data[0].stopConceptTerm;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加停用概念";
	                                $scope.vm.term = "";
	                                addStopConceptDialog(singleAddStopConcept);
	                            }
	                        }, function () {
	                            //layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#stopKey").blur(function () {
	                        if (lengthCheck($("#stopKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addStopConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/disable/disable_concept_manage_dialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#stopKeyTwo").blur(function () {
	                        if (lengthCheck($("#stopKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteStop(id) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/delete.html",
	                scope: $scope,
	                width: '260px',
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        singleDelStopConcept(id);
	                    }
	                }
	            });
	        }
	        //批量导入
	        function batchUpload() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/businessModeling/batchUpload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadStopConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/concept/stop/batchAdd?applicationId=' + $scope.vm.applicationId + '&modifierId=' + $scope.vm.modifier);
	                }, 100);
	            }
	        }
	        //編輯事件
	        function singleEditStopConcept(item) {
	            assembleStopConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/stop/update", {
	                "stopConceptId": item.stopConceptId,
	                "stopConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "stopConceptKey": $scope.vm.key,
	                "stopConceptModifier": $scope.vm.modifier,
	                "stopConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadStopConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddStopConcept() {
	            assembleStopConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/stop/add", {
	                "stopConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "stopConceptKey": $scope.vm.key,
	                "stopConceptModifier": $scope.vm.modifier,
	                "stopConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadStopConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelStopConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/stop/delete", {
	                "stopConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadStopConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleStopConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            $scope.vm.key = "";
	            $scope.vm.term = "";
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "concept_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/concept/stop/export", {
	                "stopConceptApplicationId": $scope.vm.applicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    for (var i = 0; i < data.exportFileNameList.length; i++) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 强制分词概念管理
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.controller('EnforcementConceptController', ['$scope', 'localStorageService', "$state", "ngDialog", "$timeout", function ($scope, localStorageService, $state, ngDialog, $timeout) {
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            // applicationId : $cookieStore.get("applicationId"),
	            applicationId: APPLICATION_ID,
	            addForceSegment: addForceSegment,
	            editForceSegment: editForceSegment,
	            deleteForceSegment: deleteForceSegment,
	            listData: "", // table 数据
	            singleDelForceSegmentConcept: singleDelForceSegmentConcept, //單條刪除
	            singleAddForceSegmentConcept: singleAddForceSegmentConcept,
	            paginationConf: "", //分页条件
	            pageSize: 5, //默认每页数量
	            //查詢
	            searchForceSegmentConcept: searchForceSegmentConcept,
	            searchVal: "",
	            searchType: "forceSegmentConceptKey",
	            timeStart: "",
	            timeEnd: "",
	            //新增
	            key: "",
	            // modifier: $cookieStore.get("userId"),
	            modifier: USER_ID,
	            term: "",
	            dialogTitle: "",
	            inputSelect: [],
	            inputVal: "",
	            termSpliter: "；",
	            percent: "%",
	            keyNullOrBeyondLimit: "概念类名不能为空或超过长度限制50",
	            termNullOrBeyondLimit: "概念集合不能为空或超过长度限制5000",
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete
	        };

	        /**
	         * 加载分页条
	         * @type
	         */
	        init();

	        function init() {
	            $scope.vm.paginationConf = {
	                currentPage: 1,
	                totalItems: 0,
	                pageSize: 0,
	                pagesLength: 8
	            };
	        }
	        //请求列表
	        function loadForceSegmentConceptTable(current) {
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/listByAttribute", {
	                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadForceSegmentConcept(current, data);
	            }, function () {
	                // layer.msg("请求失败");
	                console.log('请求失败');
	            });
	        }
	        function loadForceSegmentConcept(current, data) {
	            clearSelectAll();
	            $scope.vm.listData = data.data;
	            $scope.vm.paginationConf = {
	                currentPage: current, //当前页
	                totalItems: data.total, //总条数
	                pageSize: $scope.vm.pageSize, //第页条目数
	                pagesLength: 8 //分页框数量
	            };
	            $scope.$apply();
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    if (nullCheck($scope.vm.searchVal) == true || nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                        searchForceSegmentConcept(current);
	                    } else {
	                        loadForceSegmentConceptTable(current);
	                    }
	                }, 100);
	            }
	        }, true);
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            console.log("=====clearSelectAll=====");
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！");
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.ids = id_array;
	                httpRequestPost("/api/ms/modeling/concept/forceSegment/batchDelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadForceSegmentConceptTable($scope.vm.paginationConf.currentPage);
	                    }
	                });
	            });
	        }
	        //编辑
	        function editForceSegment(item) {
	            $scope.vm.dialogTitle = "编辑强制分词概念";
	            $scope.vm.key = item.forceSegmentConceptKey;
	            $scope.vm.term = item.forceSegmentConceptTerm;
	            addForceSegmentConceptDialog(singleEditForceSegmentConcept, item);
	        }
	        function searchForceSegmentConcept(current) {
	            if ($scope.vm.searchType == "forceSegmentConceptModifier") {
	                searchForceSegmentConceptByUser(current);
	            } else {
	                searchForceSegmentConceptByType(current);
	            }
	        }
	        //查询
	        function searchForceSegmentConceptByUser(current) {
	            console.log($scope.vm.searchVal);
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/listByModifier", {
	                "forceSegmentConceptModifier": $scope.vm.searchVal,
	                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                loadForceSegmentConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }
	        function searchForceSegmentConceptByType(current) {
	            var request = new Object();
	            request.forceSegmentConceptApplicationId = $scope.vm.applicationId;
	            request.index = (current - 1) * $scope.vm.pageSize;
	            request.pageSize = $scope.vm.pageSize;
	            if ($scope.vm.searchType != "forceSegmentConceptModifyTime") {
	                request = switchForceSegmentConceptSearchType(request, $scope.vm.searchVal);
	            } else if (nullCheck($scope.vm.timeStart) == true && nullCheck($scope.vm.timeEnd) == true) {
	                request.startTimeRequest = $scope.vm.timeStart;
	                request.endTimeRequest = $scope.vm.timeEnd;
	            } else {
	                layer.msg("请选择时间段");
	                return;
	            }
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/listByAttribute", request, function (data) {
	                loadForceSegmentConcept(current, data);
	            }, function () {
	                layer.msg("查询没有对应信息");
	            });
	        }

	        /**
	         * 转换查询类型
	         * @param request
	         * @param value
	         * @returns {*}
	         */
	        function switchForceSegmentConceptSearchType(request, value) {
	            if ($("#searchType").val() == "forceSegmentConceptKey") {
	                request.forceSegmentConceptKey = $scope.vm.percent + value + $scope.vm.percent;
	            } else if ($("#searchType").val() == "forceSegmentConceptTerm") {
	                request.forceSegmentConceptTerm = $scope.vm.percent + value + $scope.vm.percent;
	            }
	            return request;
	        }

	        //添加 窗口
	        function addForceSegment() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/intention/intention_concept_manage_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        httpRequestPost("/api/ms/modeling/concept/forceSegment/repeatCheck", {
	                            "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                            "forceSegmentConceptKey": $scope.vm.key
	                        }, function (data) {
	                            //类名重複
	                            if (data.status === 10002) {
	                                layer.confirm("您添加的概念类已经在，是否前往编辑？", {
	                                    btn: ['前往', '取消'],
	                                    shade: false
	                                }, function (index) {
	                                    layer.close(index);
	                                    httpRequestPost("/api/ms/modeling/concept/forceSegment/listByAttribute", {
	                                        "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                                        "forceSegmentConceptKey": $scope.vm.key,
	                                        "index": 0,
	                                        "pageSize": 1
	                                    }, function (data) {
	                                        $scope.vm.dialogTitle = "编辑强制分词概念";
	                                        console.log(data);
	                                        addForceSegmentConceptDialog(singleEditForceSegmentConcept, data.data[0]);
	                                        $scope.vm.key = data.data[0].forceSegmentConceptKey;
	                                        $scope.vm.term = data.data[0].forceSegmentConceptTerm;
	                                    }, function () {
	                                        console.log("cancel");
	                                    });
	                                }, function () {
	                                    console.log("cancel");
	                                });
	                            } else {
	                                //类名无冲突
	                                $scope.vm.dialogTitle = "增加强制分词概念";
	                                $scope.vm.term = "";
	                                addForceSegmentConceptDialog(singleAddForceSegmentConcept);
	                            }
	                        }, function () {
	                            //layer.msg("添加失败")
	                            console.log('添加失败');
	                        });
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#forceSegmentKey").blur(function () {
	                        if (lengthCheck($("#forceSegmentKey").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }

	        //編輯彈框   添加公用
	        function addForceSegmentConceptDialog(callback, item) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/concept_library/intention/intention_concept_manage_dialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (lengthCheck($scope.vm.key, 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                            return false;
	                        }
	                        var obj = $("#term").next();
	                        var term = "";
	                        var length = obj.find("li").length;
	                        if (length <= 0) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        $.each(obj.find("li"), function (index, value) {
	                            if (index > 0) {
	                                $.each($(value).find("div"), function (index1, value1) {
	                                    if (index1 == 1) {
	                                        term += $(value1).html() + $scope.vm.termSpliter;
	                                    }
	                                });
	                            }
	                        });
	                        term = term.substring(0, term.length - 1);
	                        $scope.vm.term = term;
	                        if (lengthCheck(term, 0, 500) == false) {
	                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
	                            return false;
	                        } else {
	                            $("#termAddError").html('');
	                        }
	                        callback(item);
	                    } else {
	                        $scope.vm.key = "";
	                        $scope.vm.term = "";
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    termSpliterTagEditor();
	                    $("#forceSegmentKeyTwo").blur(function () {
	                        if (lengthCheck($("#forceSegmentKeyTwo").val(), 0, 50) == false) {
	                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
	                        } else {
	                            $("#keyAddError").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //   刪除 彈框
	        function deleteForceSegment(id) {
	            var dia = angular.element(".ngdialog ");
	            if (dia.length == 0) {
	                var dialog = ngDialog.openConfirm({
	                    template: "/static/business_modeling/concept_library/delete.html",
	                    scope: $scope,
	                    width: '260px',
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        //关闭回掉
	                        if (e === 1) {
	                            singleDelForceSegmentConcept(id);
	                        }
	                    }
	                });
	            }
	        }
	        //批量导入
	        function batchUpload() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/businessModeling/batchUpload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadForceSegmentConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/concept/forceSegment/batchAdd?applicationId=' + $scope.vm.applicationId + '&modifierId=' + $scope.vm.modifier);
	                }, 100);
	            }
	        }
	        //編輯事件
	        function singleEditForceSegmentConcept(item) {
	            assembleForceSegmentConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/update", {
	                "forceSegmentConceptId": item.forceSegmentConceptId,
	                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "forceSegmentConceptKey": $scope.vm.key,
	                "forceSegmentConceptModifier": $scope.vm.modifier,
	                "forceSegmentConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadForceSegmentConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条新增
	        function singleAddForceSegmentConcept() {
	            assembleForceSegmentConceptTerm();
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/add", {
	                "forceSegmentConceptApplicationId": $scope.vm.applicationId,
	                "applicationId": $scope.vm.applicationId,
	                "forceSegmentConceptKey": $scope.vm.key,
	                "forceSegmentConceptModifier": $scope.vm.modifier,
	                "forceSegmentConceptTerm": $scope.vm.term
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadForceSegmentConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //单条刪除
	        function singleDelForceSegmentConcept(id) {
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/delete", {
	                "forceSegmentConceptId": id
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadForceSegmentConceptTable($scope.vm.paginationConf.currentPage);
	                }
	            });
	        }
	        //初始化tagEditor插件
	        function termSpliterTagEditor() {
	            var term = $scope.vm.term;
	            if (term == "") {
	                $("#term").tagEditor({
	                    forceLowercase: false
	                });
	            } else {
	                var terms = term.split($scope.vm.termSpliter);
	                console.log(terms);
	                $("#term").tagEditor({
	                    initialTags: terms,
	                    autocomplete: { delay: 0, position: { collision: 'flip' }, source: terms },
	                    forceLowercase: false
	                });
	            }
	        }
	        //组装term数据
	        function assembleForceSegmentConceptTerm() {
	            var obj = $("#term").next();
	            var term = "";
	            $.each(obj.find("li"), function (index, value) {
	                if (index > 0) {
	                    $.each($(value).find("div"), function (index1, value1) {
	                        if (index1 == 1) {
	                            term += $(value1).html() + $scope.vm.termSpliter;
	                        }
	                    });
	                }
	            });
	            term = term.substring(0, term.length - 1);
	            $scope.vm.term = term;
	        }
	        //返回状态显示
	        function responseView(data) {
	            $scope.vm.key = "";
	            $scope.vm.term = "";
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                console.log("===success===");
	                return true;
	            }
	            return false;
	        }
	        function downloadTemplate() {
	            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", "concept_template.xlsx");
	        }
	        function exportAll() {
	            httpRequestPost("/api/ms/modeling/concept/forceSegment/export", {
	                "forceSegmentConceptApplicationId": $scope.vm.applicationId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    for (var i = 0; i < data.exportFileNameList.length; i++) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            });
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 框架库
	 */
	module.exports = function (businessModelingModule) {
	    businessModelingModule.controller('FrameLibraryController', ['$scope', '$timeout', "$state", "$stateParams", "$compile", "ngDialog", "$cookieStore", "$interval", function ($scope, $timeout, $state, $stateParams, $compile, ngDialog, $cookieStore, $interval) {
	        // $state.go("frameworkLibrary.manage",{userPermission:$stateParams.userPermission});
	        $scope.vm = {
	            success: 10000,
	            illegal: 10003,
	            failed: 10004,
	            empty: 10005,
	            botSelectValue: "root",
	            botRoot: "", //根节点
	            knowledgeBotVal: "", //bot 内容
	            botInfo: null, //bot信息
	            clearColor: clearColor,
	            loadFrameLibrary: loadFrameLibrary,
	            addFrame: addFrame,
	            paginationConf: {
	                currentPage: 1, //当前页
	                totalItems: 0, //总页数
	                pageSize: 1, //第页条目数
	                pagesLength: 8 //分页框数量
	            },
	            pageSize: 6,
	            frameInfo: null,
	            addFaq: addFaq,
	            addConcept: addConcept,
	            addElement: addElement,
	            updateFaq: updateFaq,
	            updateConcept: updateConcept,
	            updateElement: updateElement,
	            frameTitle: "",
	            frameTypeId: 0,
	            elementAskContentArray: [],
	            elementAttributeIdArray: [],
	            elementContentArray: [],
	            elementFrameIdArray: [],
	            elementMiningTypeIdArray: [],
	            elementRelateConceptArray: [],
	            elementTypeIdArray: [],
	            frameCategoryId: "",
	            frameEnableStatusId: 1,
	            frameModifierId: "",
	            defaultString: "null",
	            textAndTagSplit: "#",
	            conceptSplit: "；",
	            defaultInt: 0,
	            responseView: responseView,
	            turnOn: turnOn,
	            elementIdArray: [],
	            concept_marking: concept_marking,
	            addEle: addEle,
	            delEle: delEle,
	            relateConcept: null,
	            frameTitleNullErrorInfo: "框架标题为空或超过长度限制50",
	            notContainHtmlLabel: "不能包含HTML标签",
	            frameTitleRepeatCheck: frameTitleRepeatCheck,
	            searchNodeForFrame: searchNodeForFrame,
	            recursionForFrame: recursionForFrame,
	            autoHeightForFrame: autoHeightForFrame,
	            locationForFrame: locationForFrame,
	            listData: "",
	            editFrame: editFrame,
	            deleteFrame: deleteFrame,
	            searchByFrameTitle: searchByFrameTitle,
	            downloadTemplate: downloadTemplate,
	            exportAll: exportAll,
	            batchUpload: batchUpload,
	            batchDelete: batchDelete,
	            suggestionValue: "",
	            suggestionData: "",
	            winHeight: 0
	        };
	        $scope.categoryAttributeName;

	        // var categoryApplicationId = $cookieStore.get("applicationId");
	        // var categoryModifierId = $cookieStore.get("userId");
	        var categoryApplicationId = APPLICATION_ID;
	        var categoryModifierId = USER_ID;

	        autoHeightForFrame();

	        function autoHeightForFrame() {
	            var $win = $(window);
	            var winHeight = $win.height() * 0.75;
	            $scope.vm.winHeight = winHeight + 5;
	            $(".libraryFt").attr("style", "width: 450px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: left;box-sizing:border-box;");
	            $(".libraryRth").attr("style", "width: 710px;height: " + winHeight + "px;overflow-y: auto;background: #fff;float: right;padding: 30px;box-sizing:border-box;");
	        }

	        var params = {
	            "categoryName": $("#category-autocomplete").val().trim(),
	            "categoryAttributeName": "node",
	            "categoryApplicationId": categoryApplicationId
	        };
	        //类目查找自动补全
	        $('#category-autocomplete').autocomplete({
	            serviceUrl: "/api/ms/modeling/category/searchbycategoryname",
	            type: 'POST',
	            params: params,
	            paramName: 'categoryName',
	            dataType: 'json',
	            transformResult: function transformResult(data) {
	                var result = new Object();
	                var array = [];
	                if (data.data) {
	                    for (var i = 0; i < data.data.length; i++) {
	                        array[i] = {
	                            data: data.data[i].categoryId,
	                            value: data.data[i].categoryName
	                        };
	                    }
	                }
	                result.suggestions = array;
	                return result;
	            },
	            onSelect: function onSelect(suggestion) {
	                searchNodeForFrame(suggestion);
	                $scope.vm.suggestionValue = suggestion.value;
	                $scope.vm.suggestionData = suggestion.data;
	            }
	        });
	        $interval(function () {
	            if (nullCheck($scope.vm.suggestionData) == true) {
	                var suggestion = new Object();
	                suggestion.value = $scope.vm.suggestionValue;
	                suggestion.data = $scope.vm.suggestionData;
	                if (locationForFrameFlag(suggestion)) {
	                    locationForFrame(suggestion);
	                    $scope.vm.suggestionValue = "";
	                    $scope.vm.suggestionData = "";
	                }
	            }
	        }, 2000);
	        //定位
	        function locationForFrame(suggestion) {
	            var currentNodeId = suggestion.data;
	            var initHeight = 0;
	            var sum = $(".aside-navs").find("i").length;
	            $.each($(".aside-navs").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    var offset = 0;
	                    if (scrollHeight - 100 > 0) {
	                        offset = (initHeight + 1) / sum * (scrollHeight - 100);
	                    }
	                    $(".libraryFt").animate({
	                        scrollTop: offset + "px"
	                    }, 800);
	                    return false;
	                } else {
	                    initHeight++;
	                }
	            });
	        }
	        function locationForFrameFlag(suggestion) {
	            var currentNodeId = suggestion.data;
	            var flag = false;
	            var sum = $(".aside-navs").find("i").length;
	            $.each($(".aside-navs").find("i"), function (index, value) {
	                if ($(value).attr("data-option") == currentNodeId) {
	                    var lib = $(".libraryFt");
	                    var scrollHeight = 0;
	                    if (lib.length > 0) {
	                        scrollHeight = lib[0].scrollHeight;
	                    }
	                    if (sum >= 10 && scrollHeight >= $scope.vm.winHeight) {
	                        flag = true;
	                    } else if (sum < 10) {
	                        flag = true;
	                    }
	                    return false;
	                }
	            });
	            return flag;
	        }
	        //搜寻节点
	        function searchNodeForFrame(suggestion) {
	            var currentNodeId = suggestion.data;
	            var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
	            if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                appendTree(firstNode);
	            } else if ($(firstNode).parent().parent().next() == null) {
	                appendTree(firstNode);
	            }
	            if ($(firstNode).attr("data-option") == currentNodeId) {
	                clearColor();
	                $scope.vm.knowledgeBotVal = $(firstNode).next().html();
	                $scope.vm.botSelectValue = $(firstNode).next().attr("data-option");
	                $scope.vm.botSelectType = $(firstNode).next().attr("type-option");
	                $(firstNode).next().attr("style", "color:black;font-weight:bold;");
	                loadFrameLibrary(1, 0);
	                $scope.$apply();
	            } else {
	                recursionForFrame(suggestion, firstNode);
	            }
	        }
	        function recursionForFrame(suggestion, node) {
	            var list = $(".aside-navs").find("li");
	            var flag = false;
	            $.each(list, function (index, value) {
	                if ($(value).attr("data-option") == $(node).attr("data-option")) {
	                    var currNode = $(value).find("i").filter(":eq(0)");
	                    if ($(currNode).attr("data-option") == suggestion.data) {
	                        clearColor();
	                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
	                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
	                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
	                        $(currNode).next().attr("style", "color:black;font-weight:bold;");
	                        loadFrameLibrary(1, 0);
	                        $scope.$apply();
	                        flag = true;
	                        //跳出
	                        return false;
	                    } else {
	                        if (flag == true) {
	                            return false;
	                        }
	                        //展开
	                        if ($(currNode).css("backgroundPosition") == "0% 0%") {
	                            appendTree(currNode);
	                        } else if ($(currNode).parent().parent().next() == null) {
	                            appendTree(currNode);
	                        }
	                        //递归
	                        recursionForFrame(suggestion, currNode);
	                    }
	                }
	            });
	        }
	        //加载业务树
	        initBot();

	        //获取root 数据
	        function initBot() {
	            $(".aside-navs").empty();
	            httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                "categoryApplicationId": categoryApplicationId,
	                "categoryPid": "root"
	            }, function (data) {
	                var html = '<ul class="menus show">';
	                for (var i = 0; i < data.data.length; i++) {
	                    html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' type-option="' + data.data[i].categoryTypeId + '"attribute-option="' + data.data[i].categoryAttributeName + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '</a>' + '</div>' + '</li>';
	                }
	                html += '</ul>';
	                $(".aside-navs").append(html);
	                var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
	                if ($(firstNode).css("backgroundPosition") == "0% 0%") {
	                    appendTree(firstNode);
	                } else if ($(firstNode).parent().parent().next() == null) {
	                    appendTree(firstNode);
	                }
	            }, function () {});
	        }
	        $(".aside-navs").on("click", "span", function () {
	            clearColor();
	            $scope.vm.knowledgeBotVal = $(this).html();
	            $scope.vm.botSelectValue = $(this).attr("data-option");
	            $scope.vm.botSelectType = $(this).attr("type-option");
	            var categoryAttributeName = $(this).attr("attribute-option");
	            if (categoryAttributeName == "node") {
	                $(this).attr("style", "color:black;font-weight:bold;");
	            } else if (categoryAttributeName == "edge") {
	                $(this).attr("style", "color:#ED7D31;font-weight:bold;");
	            }
	            loadFrameLibrary(1, 0);
	            $scope.$apply();
	        });

	        //节点样式转换
	        function nodeStyleSwitch(attrType) {
	            if (attrType == "edge") {
	                return "style='color:#ED7D31;'";
	            } else {
	                return "";
	            }
	        }
	        //显示节点描述
	        function categoryDescribeView(describeStr) {
	            if (nullCheck(describeStr) == true) {
	                return "title='" + describeStr + "'";
	            }
	            return "";
	        }
	        //点击下一级 bot 下拉数据填充以及下拉效果
	        $(".aside-navs").on("click", 'i', function () {
	            appendTree(this);
	        });
	        //全选
	        $("#selectAll").on("click", function () {
	            var ids = document.getElementsByName("sid");
	            var flag = false;
	            if (this.checked) {
	                flag = true;
	            }
	            $.each(ids, function (index, value) {
	                if (flag) {
	                    $(value).attr("checked", true);
	                    $(value).prop("checked", true);
	                } else {
	                    $(value).attr("checked", false);
	                    $(value).prop("checked", false);
	                }
	            });
	        });
	        //清空全选
	        function clearSelectAll() {
	            $("#selectAll").attr("checked", false);
	            $("#selectAll").prop("checked", false);
	        }
	        //批量删除
	        function batchDelete() {
	            var ids = document.getElementsByName("sid");
	            var id_array = [];
	            for (var i = 0; i < ids.length; i++) {
	                if (ids[i].checked) {
	                    id_array.push(ids[i].value);
	                }
	            }
	            if (id_array.length == 0) {
	                layer.msg("请选择要删除的记录！");
	                return;
	            }
	            layer.confirm('确认要删除吗？', function (index) {
	                layer.close(index);
	                var request = new Object();
	                request.ids = id_array;
	                httpRequestPost("/api/ms/modeling/frame/batchdelete", request, function (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                });
	            });
	        }
	        //重设请求数组
	        function requestArrayReset() {
	            $scope.vm.elementAskContentArray = [];
	            $scope.vm.elementAttributeIdArray = [];
	            $scope.vm.elementContentArray = [];
	            $scope.vm.elementFrameIdArray = [];
	            $scope.vm.elementMiningTypeIdArray = [];
	            $scope.vm.elementRelateConceptArray = [];
	            $scope.vm.elementTypeIdArray = [];
	            $scope.vm.elementIdArray = [];
	        }
	        //加载子树
	        function appendTree(obj) {
	            var id = $(obj).attr("data-option");
	            var that = $(obj);
	            if (!that.parent().parent().siblings().length) {
	                that.css("backgroundPosition", "0% 100%");
	                httpRequestPostAsync("/api/ms/modeling/category/listbycategorypid", {
	                    "categoryApplicationId": categoryApplicationId,
	                    "categoryPid": id
	                }, function (data) {
	                    if (data.data) {
	                        var html = '<ul class="menus">';
	                        for (var i = 0; i < data.data.length; i++) {
	                            html += '<li data-option="' + data.data[i].categoryPid + '">' + '<div class="slide-a">' + '<a class="ellipsis" href="javascript:;" ' + categoryDescribeView(data.data[i].categoryDescribe) + '>' + '<i ' + styleSwitch(data.data[i].categoryTypeId, data.data[i].categoryLeaf, data.data[i].categoryAttributeName) + ' data-option="' + data.data[i].categoryId + '"></i>' + '<span ' + nodeStyleSwitch(data.data[i].categoryAttributeName) + ' attribute-option="' + data.data[i].categoryAttributeName + '" type-option="' + data.data[i].categoryTypeId + '" data-option="' + data.data[i].categoryId + '" title="' + data.data[i].categoryName + '">' + subStringWithTail(data.data[i].categoryName, 10, "...") + '</span>' + '</a>' + '</div>' + '</li>';
	                        }
	                        html += "</ul>";
	                        $(html).appendTo(that.parent().parent().parent());
	                        that.parent().parent().next().slideDown();
	                    }
	                }, function (err) {});
	            } else {
	                if (that.css("backgroundPosition") == "0% 0%") {
	                    that.css("backgroundPosition", "0% 100%");
	                    that.parent().parent().next().slideDown();
	                } else {
	                    that.css("backgroundPosition", "0% 0%");
	                    that.parent().parent().next().slideUp();
	                }
	            }
	        }
	        //清除已选颜色
	        function clearColor() {
	            $.each($(".aside-navs").find("span"), function (index, value) {
	                if ($(this).attr("attribute-option") == "node") {
	                    $(this).attr("style", "");
	                } else if ($(this).attr("attribute-option") == "edge") {
	                    $(this).attr("style", "color:#ED7D31;");
	                }
	            });
	        }
	        //自动转换图标类型
	        function styleSwitch(type, leaf, attrType) {
	            var styleHidden = "display: inline-block;";
	            if (leaf == 0) {
	                styleHidden = "display:none;";
	            }
	            if (attrType == "node") {
	                return "style='" + styleHidden + "position: relative;top: -1px;margin-right: 2px;width: 15px;height: 15px;vertical-align: middle;background-position: left top;background-repeat: no-repeat;background-image: url(../../images/images/aside-nav-icon.png);'";
	            }
	            var style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
	            switch (type) {
	                case 161:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
	                case 160:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
	                case 162:
	                    style = 'style="' + styleHidden + 'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
	            }
	            return style;
	        }
	        //加载对应类目下的框架库
	        function loadFrameLibrary(current, type) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "index": (current - 1) * $scope.vm.pageSize,
	                "pageSize": $scope.vm.pageSize
	            }, function (data) {
	                if (data.data) {
	                    clearSelectAll();
	                    $scope.vm.listData = data.data;
	                    $scope.vm.paginationConf = {
	                        currentPage: current, //当前页
	                        totalItems: data.total, //总页数
	                        pageSize: $scope.vm.pageSize, //第页条目数
	                        pagesLength: 8 //分页框数量
	                    };
	                } else {
	                    $scope.vm.listData = "";
	                }
	                $scope.$apply();
	            }, function (err) {});
	        }
	        //修改框架
	        function editFrame(item) {
	            $scope.vm.frameTypeId = item.frameTypeId;
	            $scope.vm.frameInfo = JSON.stringify(item);
	            var frameInfo = eval('(' + $scope.vm.frameInfo + ')');
	            //赋值
	            assembleFrame();

	            if ($scope.vm.frameTypeId == 10011) {
	                updateFaq();
	            }
	            if ($scope.vm.frameTypeId == 10012) {
	                updateConcept();
	            }
	            if ($scope.vm.frameTypeId == 10013) {
	                updateElement();
	            }
	        }
	        //删除框架
	        function deleteFrame(item) {
	            var frameId = item.frameId;
	            layer.confirm('确认删除？', {
	                btn: ['确认', '取消'], //按钮
	                shade: 0.3 //不显示遮罩
	            }, function () {
	                httpRequestPost("/api/ms/modeling/frame/delete", {
	                    "frameId": frameId
	                }, function (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }, function (err) {});
	            }, function () {});
	        }

	        //批量导入
	        function batchUpload() {
	            var frameType = 10011;
	            if ($scope.vm.botSelectValue == "root") {
	                layer.msg("请选择类目");
	                return;
	            }
	            var dialog1 = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/frame_select_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e == 10011) {
	                        frameType = 10011;
	                        batchUploadFrame(frameType);
	                    } else if (e == 10012) {
	                        frameType = 10012;
	                        batchUploadFrame(frameType);
	                    } else if (e == 10013) {
	                        frameType = 10013;
	                        batchUploadFrame(frameType);
	                    }
	                }
	            });
	        }

	        function batchUploadFrame(frameType) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/batch_upload.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    //refresh
	                    loadFrameLibrary(1, 0);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    initUpload('/api/ms/modeling/frame/batchAdd?applicationId=' + categoryApplicationId + '&modifierId=' + categoryModifierId + '&categoryId=' + $scope.vm.botSelectValue + '&frameTypeId=' + frameType);
	                }, 100);
	            }
	        }

	        function downloadTemplate() {
	            var frameTemplate = "frame_faq_template.xlsx";
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/frame_select_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e == 10011) {
	                        frameTemplate = "frame_faq_template.xlsx";
	                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", frameTemplate);
	                    } else if (e == 10012) {
	                        frameTemplate = "frame_concept_template.xlsx";
	                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", frameTemplate);
	                    } else if (e == 10013) {
	                        frameTemplate = "frame_element_template.xlsx";
	                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate", "", frameTemplate);
	                    }
	                }
	            });
	        }

	        function exportAll() {
	            var frameType = 10011;
	            if ($scope.vm.botSelectValue == "root") {
	                layer.msg("请选择类目");
	                return;
	            }
	            var dialog1 = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/frame_select_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e == 10011) {
	                        frameType = 10011;
	                        exportAllDialog(frameType);
	                    } else if (e == 10012) {
	                        frameType = 10012;
	                        exportAllDialog(frameType);
	                    } else if (e == 10013) {
	                        frameType = 10013;
	                        exportAllDialog(frameType);
	                    }
	                }
	            });
	        }

	        function exportAllDialog(frameType) {
	            httpRequestPost("/api/ms/modeling/frame/export", {
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameTypeId": frameType
	            }, function (data) {
	                if (responseView(data) == true) {
	                    if (data.exportFileNameList.length > 0) {
	                        downloadFile("/api/ms/modeling/downloadWithPath", data.filePath, data.exportFileNameList[0]);
	                    }
	                }
	            }, function (err) {});
	        }

	        function searchByFrameTitle(current, type) {
	            if (nullCheck($("#keyWords").val()) == true) {
	                httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                    "frameCategoryId": $scope.vm.botSelectValue,
	                    "frameTitle": "%" + $("#keyWords").val().trim() + "%",
	                    "index": (current - 1) * $scope.vm.pageSize,
	                    "pageSize": $scope.vm.pageSize
	                }, function (data) {
	                    if (data.data) {
	                        clearSelectAll();
	                        $scope.vm.listData = data.data;
	                        $scope.vm.paginationConf = {
	                            currentPage: current, //当前页
	                            totalItems: data.total, //总页数
	                            pageSize: $scope.vm.pageSize, //第页条目数
	                            pagesLength: 8 //分页框数量
	                        };
	                    } else {
	                        $scope.vm.listData = "";
	                    }
	                    $scope.$apply();
	                }, function (err) {});
	            }
	        }

	        $scope.$watch('vm.paginationConf.currentPage', function (current) {
	            if (current) {
	                if (nullCheck($("#keyWords").val()) == true) {
	                    searchByFrameTitle(current, 0);
	                } else {
	                    loadFrameLibrary(current, 0);
	                }
	            }
	        });
	        //添加框架
	        function addFrame() {
	            if ($scope.vm.botSelectValue == "root") {
	                layer.msg("请选择类目");
	                return;
	            }
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/framework_library_dialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        $scope.vm.frameTypeId = $("#frameTypeId").val();
	                        $scope.vm.frameTitle = $("#frameTitle").val().trim();
	                        if (lengthCheck($("#frameTitle").val(), 0, 50) == false) {
	                            $("#frameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return false;
	                        }
	                        if (isHtmlLabel($("#frameTitle").val())) {
	                            $("#frameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return false;
	                        }
	                        if (frameTitleRepeatCheck(0, "#frameAddErrorObj") == false) {
	                            return false;
	                        }
	                        if ($scope.vm.frameTypeId == 10011) {
	                            addFaq();
	                        }
	                        if ($scope.vm.frameTypeId == 10012) {
	                            addConcept();
	                        }
	                        if ($scope.vm.frameTypeId == 10013) {
	                            addElement();
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    $("#frameTitle").blur(function () {
	                        $scope.vm.frameTypeId = $("#frameTypeId").val();
	                        $scope.vm.frameTitle = $("#frameTitle").val().trim();
	                        if (lengthCheck($("#frameTitle").val(), 0, 50) == false) {
	                            $("#frameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                        } else if (isHtmlLabel($("#frameTitle").val())) {
	                            $("#frameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                        } else {
	                            $("#frameAddErrorObj").html('');
	                            frameTitleRepeatCheck(0, "#frameAddErrorObj");
	                        }
	                    });
	                }, 100);
	            }
	        }

	        /**
	         * 框架标题重复判断
	         * @param type 0:添加时 1:修改时
	         * @param selector
	         * @returns {boolean}
	         */
	        function frameTitleRepeatCheck(type, selector) {
	            var flag = false;
	            var request = new Object();
	            request.frameTitle = $scope.vm.frameTitle;
	            request.frameTypeId = $scope.vm.frameTypeId;
	            request.frameCategoryId = $scope.vm.botSelectValue;
	            if (type == 1) {
	                request.frameId = $scope.vm.frameId;
	            }
	            httpRequestPostAsync("/api/ms/modeling/frame/repeatcheck", request, function (data) {
	                if (data) {
	                    if (responseWithoutView(data) == true) {
	                        $(selector).html('');
	                        flag = true;
	                    } else {
	                        if (data) {
	                            $(selector).html(data.info);
	                        }
	                    }
	                }
	            }, function (err) {});
	            return flag;
	        }
	        //添加表达式
	        function addFaq() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/faq_new_frame.html",
	                width: "500px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (faqValidata(0) == true) {
	                            faqAssemble(0);
	                            faqRequestAdd();
	                        } else {
	                            return false;
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    $("#faqFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#faqFrameTitle").val();
	                        if (lengthCheck($("#faqFrameTitle").val(), 0, 50) == false) {
	                            $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#faqFrameTitle").val())) {
	                            $("#faqFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(0, "#faqFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //修改表达式
	        function updateFaq() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/update_faq_frame.html",
	                width: "625px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (faqValidata(1) == true) {
	                            faqAssemble(1);
	                            faqRequestUpdate();
	                        } else {
	                            return false;
	                        }
	                    }
	                    loadFrameLibrary(1, 0);
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    fillFaqUpdatePage();
	                    $("#faqFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#faqFrameTitle").val();
	                        if (lengthCheck($("#faqFrameTitle").val(), 0, 50) == false) {
	                            $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#faqFrameTitle").val())) {
	                            $("#faqFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(1, "#faqFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                    //单个删除元素
	                    $("#faq_extension").on("click", '.del', function () {
	                        if ($(this).attr("element-id") == null) {
	                            return;
	                        }
	                        var obj = $(this).parent().parent();
	                        var elementId = $(this).attr("element-id");
	                        layer.confirm("删除以后不能恢复，确认删除？", {
	                            btn: ['确认', '取消'],
	                            shade: false
	                        }, function (index) {
	                            layer.close(index);
	                            httpRequestPostAsync("/api/ms/modeling/frame/deleteelementbyid", {
	                                "elementId": elementId
	                            }, function (data) {
	                                if (responseView(data) == true) {
	                                    $(obj).remove();
	                                }
	                            }, function (err) {});
	                        }, function () {});
	                    });
	                }, 100);
	            }
	        }
	        function fillFaqUpdatePage() {
	            for (var i = 0; i < $scope.vm.elementIdArray.length; i++) {
	                var html = '<div class="framework mb-10"><span class="framework_s text-r">扩展问题：</span><div class=""><input type="text" class="L input-text mr-10" element-id="' + $scope.vm.elementIdArray[i] + '" value="' + $scope.vm.elementContentArray[i] + '" style="width:300px;" disabled="disabled"><a element-id="' + $scope.vm.elementIdArray[i] + '" href="javascript:;" class="del"><img src="../../images/images/delete_img.png"></a></div></div>';
	                $(".exten_problem").append(html);
	            }
	        }
	        function fillConceptUpdatePage() {
	            for (var i = 0; i < $scope.vm.elementIdArray.length; i++) {
	                if ($scope.vm.elementAttributeIdArray[i] == 10025) {
	                    $("#concept_title").val($scope.vm.elementContentArray[i]);
	                    $("#concept_title").attr("element-id", $scope.vm.elementIdArray[i]);
	                } else {
	                    var originStr = $scope.vm.elementContentArray[i];
	                    var idx1 = originStr.indexOf($scope.vm.textAndTagSplit);
	                    if (idx1 <= 0) {
	                        return;
	                    }
	                    var originalText = originStr.substring(0, idx1);
	                    var tagStr = originStr.substring(idx1 + 1, originStr.length);
	                    var tagArr = tagStr.split($scope.vm.conceptSplit);
	                    var tagHtml = '<div class="tag_box">';
	                    for (var j = 0; j < tagArr.length; j++) {
	                        tagHtml += '<span class="tag_s">' + tagArr[j] + '</span>';
	                    }
	                    tagHtml += '</div>';
	                    var html = '<div class="framework mb-10" element-id="' + $scope.vm.elementIdArray[i] + '">' + '   <span class="framework_s text-r mt-7">概念扩展：</span>' + '   <div class="formControlsForConcept" element-id="' + $scope.vm.elementIdArray[i] + '">' + '       <input type="hidden" value="' + originalText + '"/>' + tagHtml + '       <a href="javascript:;" element-id="' + $scope.vm.elementIdArray[i] + '" class="del del-button">' + '           <img src="../../images/images/delete_img.png">' + '       </a>' + '   </div>' + '</div>';
	                    $("#concept_extension").append(html);
	                }
	            }
	        }
	        //表达式类型数据组装 0:新增 1:修改
	        function faqAssemble(type) {
	            requestArrayReset();
	            $.each($(".exten_problem").find("input").filter(":gt(0)"), function (index, value) {
	                $scope.vm.elementAskContentArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementAttributeIdArray[index] = 10026;
	                $scope.vm.elementContentArray[index] = $(value).val();
	                $scope.vm.elementFrameIdArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementMiningTypeIdArray[index] = $scope.vm.defaultInt;
	                $scope.vm.elementRelateConceptArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementTypeIdArray[index] = $scope.vm.defaultInt;
	                if (type == 1) {
	                    if ($(value).attr("element-id")) {
	                        $scope.vm.elementIdArray[index] = $(value).attr("element-id");
	                    } else {
	                        $scope.vm.elementIdArray[index] = $scope.vm.defaultString;
	                    }
	                }
	            });
	        }
	        //组装框架数据
	        function assembleFrame() {
	            requestArrayReset();
	            var frameInfo = eval('(' + $scope.vm.frameInfo + ')');
	            $scope.vm.frameId = frameInfo.frameId;
	            $scope.vm.frameTypeId = frameInfo.frameTypeId;
	            $scope.vm.frameTitle = frameInfo.frameTitle;
	            $scope.vm.frameModifierId = frameInfo.frameModifierId;
	            $scope.vm.frameCategoryId = frameInfo.frameCategoryId;
	            $scope.vm.frameEnableStatusId = frameInfo.frameEnableStatusId;
	            for (var i = 0; i < frameInfo.elements.length; i++) {
	                $scope.vm.elementAskContentArray[i] = frameInfo.elements[i].elementAskContent;
	                $scope.vm.elementAttributeIdArray[i] = frameInfo.elements[i].elementAttributeId;
	                $scope.vm.elementContentArray[i] = frameInfo.elements[i].elementContent;
	                $scope.vm.elementFrameIdArray[i] = frameInfo.elements[i].elementFrameId;
	                $scope.vm.elementMiningTypeIdArray[i] = frameInfo.elements[i].elementMiningTypeId;
	                $scope.vm.elementRelateConceptArray[i] = frameInfo.elements[i].elementRelateConcept;
	                $scope.vm.elementTypeIdArray[i] = frameInfo.elements[i].elementTypeId;
	                $scope.vm.elementIdArray[i] = frameInfo.elements[i].elementId;
	            }
	        }
	        //表达式类型数据校验
	        function faqValidata(type) {
	            //框架标题校验
	            if (lengthCheck($scope.vm.frameTitle, 0, 50) == false) {
	                $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                return false;
	            }
	            if (isHtmlLabel($scope.vm.frameTitle)) {
	                $("#faqFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                return false;
	            }
	            if (frameTitleRepeatCheck(type, "#faqFrameAddErrorObj") == false) {
	                return false;
	            }
	            //扩展问题校验
	            var length = $(".exten_problem").find("input").filter(":gt(0)").length;
	            if (length == 0) {
	                $("#faqExtendQuestionErrorObj").html("至少应该有一个扩展问题");
	                return false;
	            }
	            return true;
	        }
	        function faqRequestAdd() {
	            httpRequestPost("/api/ms/modeling/frame/add", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId
	            }, function (data) {
	                if (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }
	            }, function (err) {});
	        }
	        function faqRequestUpdate() {
	            httpRequestPost("/api/ms/modeling/frame/update", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "elementIdArray": $scope.vm.elementIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId,
	                "frameId": $scope.vm.frameId
	            }, function (data) {
	                if (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }
	            }, function (err) {});
	        }
	        //添加概念表达式
	        function addConcept() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/concept_new_frame.html",
	                width: "625px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (conceptValidate(0) == true) {
	                            conceptAssemble(0);
	                            conceptRequestAdd();
	                        } else {
	                            return false;
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    $("#conceptFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#conceptFrameTitle").val();
	                        if (lengthCheck($("#conceptFrameTitle").val(), 0, 50) == false) {
	                            $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#conceptFrameTitle").val())) {
	                            $("#conceptFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(0, "#conceptFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                    $("#concept_title").blur(function () {
	                        if (lengthCheck($("#concept_title").val(), 0, 50) == false) {
	                            $("#conceptTitleErrorObj").html("概念标题为空或超过长度限制50");
	                        } else if (isHtmlLabel($("#concept_title").val())) {
	                            $("#conceptTitleErrorObj").html($scope.vm.notContainHtmlLabel);
	                        } else {
	                            $("#conceptTitleErrorObj").html('');
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //概念框架验证 0:添加 1:修改
	        function conceptValidate(type) {
	            //框架标题校验
	            if (lengthCheck($scope.vm.frameTitle, 0, 50) == false) {
	                $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                return false;
	            }
	            if (isHtmlLabel($scope.vm.frameTitle)) {
	                $("#conceptFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                return false;
	            }
	            if (frameTitleRepeatCheck(type, "#conceptFrameAddErrorObj") == false) {
	                return false;
	            }
	            //扩展问题校验
	            var length = $(".exten_problem").find("input").filter(":gt(0)").length;
	            if (length == 0) {
	                $("#conceptExtendQuestionErrorObj").html("至少应该有一个概念扩展");
	                return false;
	            }
	            return true;
	        }
	        //组装概念数据 0:添加 1:修改
	        function conceptAssemble(type) {
	            requestArrayReset();
	            $.each($("#concept_extension").find(".formControlsForConcept").filter(":gt(0)"), function (index, value) {
	                var contentInfo = $(value).find("input").val() + $scope.vm.textAndTagSplit;
	                $.each($(value).find("span"), function (index1, value1) {
	                    contentInfo += $(value1).html() + $scope.vm.conceptSplit;
	                });
	                if (contentInfo.indexOf($scope.vm.conceptSplit) > 0) {
	                    contentInfo = contentInfo.substring(0, contentInfo.length - 1);
	                }
	                $scope.vm.elementAskContentArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementAttributeIdArray[index] = 10026;
	                $scope.vm.elementContentArray[index] = contentInfo;
	                $scope.vm.elementFrameIdArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementMiningTypeIdArray[index] = $scope.vm.defaultInt;
	                $scope.vm.elementRelateConceptArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementTypeIdArray[index] = $scope.vm.defaultInt;
	                if (type == 1) {
	                    if ($(value).attr("element-id")) {
	                        $scope.vm.elementIdArray[index] = $(value).attr("element-id");
	                    } else {
	                        $scope.vm.elementIdArray[index] = $scope.vm.defaultString;
	                    }
	                }
	            });
	        }
	        //概念添加请求
	        function conceptRequestAdd() {
	            httpRequestPost("/api/ms/modeling/frame/add", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId
	            }, function (data) {
	                if (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }
	            }, function (err) {});
	        }
	        //修改概念表达式
	        function updateConcept() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/update_concept_frame.html",
	                width: "625px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (conceptValidate(1) == true) {
	                            conceptAssemble(1);
	                            conceptRequestUpdate();
	                        } else {
	                            return false;
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    fillConceptUpdatePage();
	                    $("#conceptFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#conceptFrameTitle").val();
	                        if (lengthCheck($("#conceptFrameTitle").val(), 0, 50) == false) {
	                            $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#conceptFrameTitle").val())) {
	                            $("#conceptFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(1, "#conceptFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                    $("#concept_title").blur(function () {
	                        if (lengthCheck($("#concept_title").val(), 0, 50) == false) {
	                            $("#conceptTitleErrorObj").html("概念标题为空或超过长度限制50");
	                        } else if (isHtmlLabel($("#concept_title").val())) {
	                            $("#conceptTitleErrorObj").html($scope.vm.notContainHtmlLabel);
	                        } else {
	                            $("#conceptTitleErrorObj").html('');
	                        }
	                    });
	                    //单个删除元素
	                    $("#concept_extension").on("click", '.del', function () {
	                        if ($(this).attr("element-id") == null) {
	                            return;
	                        }
	                        var obj = $(this).parent().parent();
	                        var elementId = $(this).attr("element-id");
	                        layer.confirm("删除以后不能恢复，确认删除？", {
	                            btn: ['确认', '取消'],
	                            shade: false
	                        }, function () {
	                            httpRequestPost("/api/ms/modeling/frame/deleteelementbyid", {
	                                "elementId": elementId
	                            }, function (data) {
	                                if (responseView(data) == true) {
	                                    $(obj).remove();
	                                }
	                            }, function (err) {});
	                        }, function () {});
	                    });
	                }, 100);
	            }
	        }
	        //概念添加请求
	        function conceptRequestUpdate() {
	            httpRequestPost("/api/ms/modeling/frame/update", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "elementIdArray": $scope.vm.elementIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId,
	                "frameId": $scope.vm.frameId
	            }, function (data) {
	                if (responseView(data) == true) {
	                    loadFrameLibrary(1, 0);
	                }
	            }, function (err) {});
	        }
	        //添加要素
	        function addElement() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/factor_new_frame.html",
	                width: "860px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (elementValidate(0) == true) {
	                            elementAssemble(0);
	                            elementRequestAdd();
	                        } else {
	                            return false;
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    //选择全部
	                    $("#selectAll").click(function () {
	                        if ($(this).prop("checked") == true) {
	                            $.each($("#add-item").find(".sid"), function (index, value) {
	                                $(value).prop("checked", true);
	                            });
	                        } else {
	                            $.each($("#add-item").find(".sid"), function (index, value) {
	                                $(value).prop("checked", false);
	                            });
	                        }
	                    });
	                    $("#elementFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#elementFrameTitle").val();
	                        if (lengthCheck($("#elementFrameTitle").val(), 0, 50) == false) {
	                            $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#elementFrameTitle").val())) {
	                            $("#elementFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(0, "#elementFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                    $("#ele-name-tr").mouseenter(function () {
	                        $("#ele-name-error").attr("style", "display:none;");
	                        $("#ele-name-error").html('');
	                    });
	                    $("#ele-asked-tr").mouseenter(function () {
	                        $("#ele-asked-error").attr("style", "display:none;");
	                        $("#ele-asked-error").html('');
	                    });
	                    $("#ele-concept-tr").mouseenter(function () {
	                        $("#ele-concept-error").attr("style", "display:none;");
	                        $("#ele-concept-error").html('');
	                    });
	                    $(".ele-name").blur(function () {
	                        if (lengthCheck($(".ele-name").val(), 0, 50) == false) {
	                            $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
	                            $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index:9999");
	                            return;
	                        } else if (isHtmlLabel($(".ele-name").val())) {
	                            $("#ele-name-error").html($scope.vm.notContainHtmlLabel);
	                            $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index;");
	                            return;
	                        } else {
	                            $("#ele-name-error").html('');
	                            $("#ele-name-error").attr("style", "display:none;");
	                        }
	                        $.each($("#add-item").find("tr"), function (index, value) {
	                            if ($(".ele-name").val() == $(value).find(".ele-name-add").val()) {
	                                $("#ele-name-error").html('要素名称不能与已有要素名称重复');
	                                $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                                return true;
	                            } else {
	                                $("#ele-name-error").html('');
	                                $("#ele-name-error").attr("style", "display:none;");
	                            }
	                        });
	                    });
	                    $(".ele-asked").blur(function () {
	                        if (lengthCheck($(".ele-asked").val(), 0, 255) == false) {
	                            $("#ele-asked-error").html('反问不能为空或超过长度限制255');
	                            $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                            return;
	                        } else if (isHtmlLabel($(".ele-asked").val())) {
	                            $("#ele-asked-error").html($scope.vm.notContainHtmlLabel);
	                            $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                            return;
	                        } else {
	                            $("#ele-asked-error").html('');
	                            $("#ele-asked-error").attr("style", "display:none;");
	                        }
	                        $.each($("#add-item").find("tr"), function (index, value) {
	                            if ($(".ele-asked").val() == $(value).find(".ele-asked-add").val()) {
	                                $("#ele-asked-error").html('反问不能与已有反问重复');
	                                $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                                return true;
	                            } else {
	                                $("#ele-asked-error").html('');
	                                $("#ele-asked-error").attr("style", "display:none;");
	                            }
	                        });
	                    });
	                    $(".ele-concept").blur(function () {
	                        var relateConceptIds = $(".ele-concept").attr("data-option");
	                        var relateConceptVals = $(".ele-concept").val();
	                        relateConceptVals = relateConceptVals.substring(0, relateConceptVals.length - 1);
	                        var sumConceptStr = relateConceptIds + $scope.vm.textAndTagSplit + relateConceptVals;
	                        if (lengthCheck(sumConceptStr, 0, 255) == false) {
	                            $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
	                            $("#ele-concept-error").attr("style", "display:inline-block;left: 10px;");
	                            return;
	                        } else {
	                            $("#ele-concept-error").html('');
	                            $("#ele-concept-error").attr("style", "display:none;");
	                        }
	                        if (relateConceptVals == null) {
	                            return;
	                        }
	                        if (relateConceptVals == "") {
	                            return;
	                        }
	                        if (relateConceptIds == null) {
	                            return;
	                        }
	                        if (relateConceptIds == "") {
	                            return;
	                        }
	                    });
	                    var keyword = "";
	                    var keywordarr = $("#ele-concept-autocomplete").val().split(",");
	                    keyword = keywordarr[keywordarr.length];
	                    var conceptParams = {
	                        "conceptKeyword": keyword,
	                        "applicationId": categoryApplicationId
	                    };
	                    $scope.vm.relateConcept = new HashMap();
	                    $("#ele-concept-autocomplete").on("keydown", function (event) {
	                        if (event.keyCode === 9 && $(this).autocomplete("instance").menu.active) {
	                            event.preventDefault();
	                        }
	                    }).autocomplete({
	                        serviceUrl: "/api/ms/modeling/frame/searchconceptbykeyword",
	                        type: 'POST',
	                        params: conceptParams,
	                        paramName: 'conceptKeyword',
	                        dataType: 'json',
	                        delimiter: ",",
	                        transformResult: function transformResult(data) {
	                            var result = new Object();
	                            var array = [];
	                            if (data.data) {
	                                for (var i = 0; i < data.data.length; i++) {
	                                    array[i] = {
	                                        data: data.data[i].id,
	                                        value: data.data[i].name
	                                    };
	                                }
	                            }
	                            result.suggestions = array;
	                            return result;
	                        },
	                        onSelect: function onSelect(suggestion) {
	                            $scope.vm.relateConcept.put(suggestion.value, suggestion.data);
	                            var selectConceptValue = "";
	                            if ($("#ele-concept-autocomplete").val() != suggestion.value) {
	                                var terms = splitAuto($("#ele-concept-autocomplete").val());
	                                for (var i = 0; i < terms.length; i++) {
	                                    if (terms[i] == suggestion.value) {
	                                        //如果重复不添加
	                                        continue;
	                                    } else {
	                                        selectConceptValue += terms[i] + ",";
	                                    }
	                                }
	                            }
	                            if (selectConceptValue == "") {
	                                $("#ele-concept-autocomplete").val(suggestion.value + ",");
	                            } else {
	                                $("#ele-concept-autocomplete").val(selectConceptValue + suggestion.value + ",");
	                            }
	                            var selectConceptId = "";
	                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
	                            for (var i = 0; i < selectedTerms.length; i++) {
	                                if ($scope.vm.relateConcept.get(selectedTerms[i]) != null) {
	                                    selectConceptId += $scope.vm.relateConcept.get(selectedTerms[i]) + $scope.vm.conceptSplit;
	                                }
	                            }
	                            selectConceptId = selectConceptId.substring(0, selectConceptId.length - 1);
	                            $("#ele-concept-autocomplete").attr("data-option", selectConceptId);
	                        },
	                        onSearchStart: function onSearchStart() {
	                            var selectConceptId = "";
	                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
	                            for (var i = 0; i < selectedTerms.length; i++) {
	                                if ($scope.vm.relateConcept.get(selectedTerms[i]) != null) {
	                                    selectConceptId += $scope.vm.relateConcept.get(selectedTerms[i]) + $scope.vm.conceptSplit;
	                                }
	                            }
	                            selectConceptId = selectConceptId.substring(0, selectConceptId.length - 1);
	                            $("#ele-concept-autocomplete").attr("data-option", selectConceptId);
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //元素类型验证
	        function elementValidate(type) {
	            $scope.vm.frameTitle = $("#elementFrameTitle").val();
	            if (lengthCheck($("#elementFrameTitle").val(), 0, 50) == false) {
	                $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                return false;
	            }
	            if (isHtmlLabel($("#elementFrameTitle").val())) {
	                $("#elementFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                return false;
	            }
	            if (frameTitleRepeatCheck(type, "#elementFrameAddErrorObj") == false) {
	                return false;
	            }
	            var length = $("#add-item").find("tr").length;
	            if (length == 0) {
	                $("#elementNumberErr").html("至少应该有一个要素");
	                return false;
	            } else {
	                $("#elementNumberErr").html('');
	            }
	            return true;
	        }
	        //元素类型数据组装
	        function elementAssemble(type) {
	            requestArrayReset();
	            $.each($("#add-item").find("tr"), function (index, value) {
	                $scope.vm.elementAskContentArray[index] = $(value).find(".ele-asked-add").val();
	                $scope.vm.elementAttributeIdArray[index] = $scope.vm.defaultInt;
	                $scope.vm.elementContentArray[index] = $(value).find(".ele-name-add").val();
	                $scope.vm.elementFrameIdArray[index] = $scope.vm.defaultString;
	                $scope.vm.elementMiningTypeIdArray[index] = $(value).find(".mining-type-add").val();
	                if ($(value).find(".ele-concept-add").attr("data-option") == "") {
	                    $scope.vm.elementRelateConceptArray[index] = $scope.vm.defaultString;
	                } else {
	                    $scope.vm.elementRelateConceptArray[index] = $(value).find(".ele-concept-add").attr("data-option");
	                }
	                $scope.vm.elementTypeIdArray[index] = $(value).find(".ele-type-add").val();
	                if (type == 1) {
	                    if ($(value).attr("element-id")) {
	                        $scope.vm.elementIdArray[index] = $(value).attr("element-id");
	                    } else {
	                        $scope.vm.elementIdArray[index] = $scope.vm.defaultString;
	                    }
	                }
	            });
	        }
	        //元素类型添加请求
	        function elementRequestAdd() {
	            httpRequestPost("/api/ms/modeling/frame/add", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId
	            }, function (data) {
	                if (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }
	            }, function (err) {});
	        }
	        //元素类型修改请求
	        function elementRequestUpdate() {
	            httpRequestPost("/api/ms/modeling/frame/update", {
	                "elementAskContentArray": $scope.vm.elementAskContentArray,
	                "elementAttributeIdArray": $scope.vm.elementAttributeIdArray,
	                "elementContentArray": $scope.vm.elementContentArray,
	                "elementFrameIdArray": $scope.vm.elementFrameIdArray,
	                "elementMiningTypeIdArray": $scope.vm.elementMiningTypeIdArray,
	                "elementRelateConceptArray": $scope.vm.elementRelateConceptArray,
	                "elementTypeIdArray": $scope.vm.elementTypeIdArray,
	                "elementIdArray": $scope.vm.elementIdArray,
	                "frameCategoryId": $scope.vm.botSelectValue,
	                "frameEnableStatusId": $scope.vm.frameEnableStatusId,
	                "frameModifierId": categoryModifierId,
	                "frameTitle": $scope.vm.frameTitle,
	                "frameTypeId": $scope.vm.frameTypeId,
	                "frameId": $scope.vm.frameId
	            }, function (data) {
	                if (data) {
	                    if (responseView(data) == true) {
	                        loadFrameLibrary(1, 0);
	                    }
	                }
	            }, function (err) {});
	        }
	        //修改要素
	        function updateElement() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/business_modeling/frame_database/update_factor_frame.html",
	                width: "840px",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回调
	                    if (e === 1) {
	                        if (elementValidate(1) == true) {
	                            elementAssemble(1);
	                            elementRequestUpdate();
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    fillElementUpdatePage();
	                    //选择全部
	                    $("#selectAll").click(function () {
	                        if ($(this).prop("checked") == true) {
	                            $.each($("#add-item").find(".sid"), function (index, value) {
	                                $(value).prop("checked", true);
	                            });
	                        } else {
	                            $.each($("#add-item").find(".sid"), function (index, value) {
	                                $(value).prop("checked", false);
	                            });
	                        }
	                    });
	                    $("#elementFrameTitle").blur(function () {
	                        $scope.vm.frameTitle = $("#elementFrameTitle").val();
	                        if (lengthCheck($("#elementFrameTitle").val(), 0, 50) == false) {
	                            $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
	                            return;
	                        }
	                        if (isHtmlLabel($("#elementFrameTitle").val())) {
	                            $("#elementFrameAddErrorObj").html($scope.vm.notContainHtmlLabel);
	                            return;
	                        }
	                        if (frameTitleRepeatCheck(1, "#elementFrameAddErrorObj") == false) {
	                            return;
	                        }
	                    });
	                    $("#ele-name-tr").mouseenter(function () {
	                        $("#ele-name-error").attr("style", "display:none;");
	                        $("#ele-name-error").html('');
	                    });
	                    $("#ele-asked-tr").mouseenter(function () {
	                        $("#ele-asked-error").attr("style", "display:none;");
	                        $("#ele-asked-error").html('');
	                    });
	                    $("#ele-concept-tr").mouseenter(function () {
	                        $("#ele-concept-error").attr("style", "display:none;");
	                        $("#ele-concept-error").html('');
	                    });
	                    $(".ele-name").blur(function () {
	                        if (lengthCheck($(".ele-name").val(), 0, 50) == false) {
	                            $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
	                            $("#ele-name-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999;");
	                            return;
	                        } else if (isHtmlLabel($(".ele-name").val())) {
	                            $("#ele-name-error").html($scope.vm.notContainHtmlLabel);
	                            $("#ele-name-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999;");
	                            return;
	                        } else {
	                            $("#ele-name-error").html('');
	                            $("#ele-name-error").attr("style", "display:none;");
	                        }
	                        $.each($("#add-item").find("tr"), function (index, value) {
	                            if ($(".ele-name").val() == $(value).find(".ele-name-add").val()) {
	                                $("#ele-name-error").html('要素名称不能与已有要素名称重复');
	                                $("#ele-name-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999;");
	                                return true;
	                            } else {
	                                $("#ele-name-error").html('');
	                                $("#ele-name-error").attr("style", "display:none;");
	                            }
	                        });
	                    });
	                    $(".ele-asked").blur(function () {
	                        if (lengthCheck($(".ele-asked").val(), 0, 255) == false) {
	                            $("#ele-asked-error").html('反问不能为空或超过长度限制255');
	                            $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999");
	                            return;
	                        } else if (isHtmlLabel($(".ele-asked").val())) {
	                            $("#ele-asked-error").html($scope.vm.notContainHtmlLabel);
	                            $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999");
	                            return;
	                        } else {
	                            $("#ele-asked-error").html('');
	                            $("#ele-asked-error").attr("style", "display:none;");
	                        }
	                        $.each($("#add-item").find("tr"), function (index, value) {
	                            if ($(".ele-asked").val() == $(value).find(".ele-asked-add").val()) {
	                                $("#ele-asked-error").html('反问不能与已有反问重复');
	                                $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;top:30px;z-index:9999;");
	                                return true;
	                            } else {
	                                $("#ele-asked-error").html('');
	                                $("#ele-asked-error").attr("style", "display:none;");
	                            }
	                        });
	                    });
	                    $(".ele-concept").blur(function () {
	                        var relateConceptIds = $(".ele-concept").attr("data-option");
	                        var relateConceptVals = $(".ele-concept").val();
	                        relateConceptVals = relateConceptVals.substring(0, relateConceptVals.length - 1);
	                        var sumConceptStr = relateConceptIds + $scope.vm.textAndTagSplit + relateConceptVals;
	                        if (lengthCheck(sumConceptStr, 0, 255) == false) {
	                            $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
	                            $("#ele-concept-error").attr("style", "display:inline-block;left: 710px;");
	                            return;
	                        } else {
	                            $("#ele-concept-error").html('');
	                            $("#ele-concept-error").attr("style", "display:none;");
	                        }
	                        if (relateConceptVals == null) {
	                            return;
	                        }
	                        if (relateConceptVals == "") {
	                            return;
	                        }
	                        if (relateConceptIds == null) {
	                            return;
	                        }
	                        if (relateConceptIds == "") {
	                            return;
	                        }
	                    });
	                    var keyword = "";
	                    var keywordarr = $("#ele-concept-autocomplete").val().split(",");
	                    keyword = keywordarr[keywordarr.length];
	                    var conceptParams = {
	                        "conceptKeyword": keyword,
	                        "applicationId": categoryApplicationId
	                    };
	                    $scope.vm.relateConcept = new HashMap();
	                    $("#ele-concept-autocomplete").on("keydown", function (event) {
	                        if (event.keyCode === 9 && $(this).autocomplete("instance").menu.active) {
	                            event.preventDefault();
	                        }
	                    }).autocomplete({
	                        serviceUrl: "/api/ms/modeling/frame/searchconceptbykeyword",
	                        type: 'POST',
	                        params: conceptParams,
	                        paramName: 'conceptKeyword',
	                        dataType: 'json',
	                        delimiter: ",",
	                        transformResult: function transformResult(data) {
	                            var result = new Object();
	                            var array = [];
	                            if (data.data) {
	                                for (var i = 0; i < data.data.length; i++) {
	                                    array[i] = {
	                                        data: data.data[i].id,
	                                        value: data.data[i].name
	                                    };
	                                }
	                            }
	                            result.suggestions = array;
	                            return result;
	                        },
	                        onSelect: function onSelect(suggestion) {
	                            $scope.vm.relateConcept.put(suggestion.value, suggestion.data);
	                            var selectConceptValue = "";
	                            if ($("#ele-concept-autocomplete").val() != suggestion.value) {
	                                var terms = splitAuto($("#ele-concept-autocomplete").val());
	                                for (var i = 0; i < terms.length; i++) {
	                                    if (terms[i] == suggestion.value) {
	                                        //如果重复不添加
	                                        continue;
	                                    } else {
	                                        selectConceptValue += terms[i] + ",";
	                                    }
	                                }
	                            }
	                            if (selectConceptValue == "") {
	                                $("#ele-concept-autocomplete").val(suggestion.value + ",");
	                            } else {
	                                $("#ele-concept-autocomplete").val(selectConceptValue + suggestion.value + ",");
	                            }
	                            var selectConceptId = "";
	                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
	                            for (var i = 0; i < selectedTerms.length; i++) {
	                                if ($scope.vm.relateConcept.get(selectedTerms[i]) != null) {
	                                    selectConceptId += $scope.vm.relateConcept.get(selectedTerms[i]) + $scope.vm.conceptSplit;
	                                }
	                            }
	                            selectConceptId = selectConceptId.substring(0, selectConceptId.length - 1);
	                            $("#ele-concept-autocomplete").attr("data-option", selectConceptId);
	                        },
	                        onSearchStart: function onSearchStart() {
	                            var selectConceptId = "";
	                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
	                            for (var i = 0; i < selectedTerms.length; i++) {
	                                if ($scope.vm.relateConcept.get(selectedTerms[i]) != null) {
	                                    selectConceptId += $scope.vm.relateConcept.get(selectedTerms[i]) + $scope.vm.conceptSplit;
	                                }
	                            }
	                            selectConceptId = selectConceptId.substring(0, selectConceptId.length - 1);
	                            $("#ele-concept-autocomplete").attr("data-option", selectConceptId);
	                        }
	                    });
	                }, 100);
	            }
	        }
	        //填充元素修改页面
	        function fillElementUpdatePage() {
	            for (var i = 0; i < $scope.vm.elementIdArray.length; i++) {
	                var originStr = $scope.vm.elementRelateConceptArray[i];
	                var conceptValue = "";
	                var idx1 = originStr.indexOf($scope.vm.textAndTagSplit);
	                if (idx1 >= 0) {
	                    var conceptValueArr = originStr.split($scope.vm.conceptSplit);

	                    for (var j = 0; j < conceptValueArr.length; j++) {
	                        httpRequestPostAsync("/api/ms/modeling/frame/searchconceptbyid", {
	                            "conceptId": conceptValueArr[j]
	                        }, function (data) {
	                            if (data.status == 10000) {
	                                conceptValue += data.conceptWithWeight.name + ",";
	                            }
	                        }, function (err) {});
	                    }
	                    conceptValue = conceptValue.substring(0, conceptValue.length - 1);
	                }

	                var html = '<tr element-id="' + $scope.vm.elementIdArray[i] + '">' + '   <td><input type="checkbox" class="sid"/></td>' + '   <td><input type="text" style="width: 200px;" class="input_text ele-name-add" disabled="disabled" value="' + $scope.vm.elementContentArray[i] + '"/></td>' + '   <td>' + '       <select class="ele-type-add bd">' + '           <option value=10014>字符串</option>' + '           <option value=10015>数字</option>' + '           <option value=10016>范围</option>' + '       </select>' + '   </td>' + '   <td>' + '       <select class="mining-type-add bd" disabled="disabled">' + '           <option value=10017>NLP</option>' +
	                /*'           <option value=10017>OEC</option>'+
	                 '           <option value=10018>GATE</option>'+*/
	                '       </select>' + '   </td>' + '   <td><input style="width: 200px;" type="text" class="input_text ele-asked-add" value="' + $scope.vm.elementAskContentArray[i] + '" disabled="disabled"/></td>' + '   <td><input style="width: 180px;" type="text" class="input_text ele-concept-add" placeholder="从概念库中选择" value="' + conceptValue + '" data-option="' + originStr + '" disabled="disabled"/></td>' + '</tr>';
	                $("#add-item").append(html);

	                $("#add-item").find("tr").filter(":eq(" + i + ")").find(".ele-type-add").val($scope.vm.elementTypeIdArray[i]);
	                $("#add-item").find("tr").filter(":eq(" + i + ")").find(".mining-type-add").val($scope.vm.elementMiningTypeIdArray[i]);
	            }
	        }
	        //返回状态显示
	        function responseView(data) {
	            clearSelectAll();
	            if (data == null) {
	                return false;
	            }
	            layer.msg(data.info);
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //返回状态显示
	        function responseWithoutView(data) {
	            if (data == null) {
	                return false;
	            }
	            if (data.status == $scope.vm.success) {
	                return true;
	            }
	            return false;
	        }
	        //开关
	        function turnOn(targetValue, targetName) {
	            $scope.vm[targetName] = targetValue ? 0 : 1;
	        }
	        //概念打标
	        function concept_marking() {
	            $.each($(".exten_problem").find("input").filter(":eq(0)"), function (index, value) {
	                if (lengthCheck($(value).val(), 0, 255) == false) {
	                    $("#conceptExtendQuestionErrorObj").html("概念扩展不能为空或长度超过255");
	                    return true;
	                }
	                if (isHtmlLabel($(value).val())) {
	                    $("#conceptExtendQuestionErrorObj").html($scope.vm.notContainHtmlLabel);
	                    return true;
	                }
	                if ($(value).val() == $("#concept_title").val()) {
	                    $("#conceptExtendQuestionErrorObj").html("概念标题不能与概念扩展重复");
	                    return true;
	                }
	                var flag = false;
	                $.each($(".exten_problem").find("input").filter(":gt(0)"), function (index1, value1) {
	                    if ($(value).val() == $(value1).val()) {
	                        $("#conceptExtendQuestionErrorObj").html("不能与已有概念扩展重复");
	                        flag = true;
	                        return true;
	                    }
	                });
	                if (flag) {
	                    return true;
	                }
	                $("#conceptExtendQuestionErrorObj").html('');
	                var arr = [];
	                arr[0] = $(value).val();
	                httpRequestPost("/api/ms/modeling/frame/batchtag", {
	                    "extendQuestionList": arr,
	                    "applicationId": categoryApplicationId
	                }, function (data) {
	                    if (data) {
	                        if (data.status == 200) {
	                            if (data.data.length > 0) {
	                                if (data.data[0] != null) {
	                                    appendTag(data.data[0], $(value).val());
	                                }
	                            }
	                        }
	                    }
	                    $.each($(".exten_problem").find("input").filter(":eq(0)"), function (index, value) {
	                        $(value).val('');
	                    });
	                }, function (err) {
	                    $("#conceptExtendQuestionErrorObj").html("打标失败，请正确发布节点后再进行打标操作!");
	                });
	            });
	        }
	        function appendTag(data, originStr) {
	            var tagHtml = '<div class="tag_box">';
	            for (var i = 0; i < data.length; i++) {
	                for (var j = 0; j < data[i].tagList.length; j++) {
	                    tagHtml += '<span class="tag_s">' + data[i].tagList[j] + '</span>';
	                }
	            }
	            tagHtml += '</div>';
	            var html = '<div class="framework mb-10">' + '   <span class="framework_s mt-7">概念扩展：</span>' + '   <div class="formControlsForConcept">' + '       <input type="hidden" value="' + originStr + '"/>' + tagHtml + '       <a href="javascript:;" class="del-button" onclick="rem_ques(this);">' + '           <img src="../../images/images/delete_img.png">' + '       </a>' + '   </div>' + '</div>';
	            $("#concept_extension").append(html);
	            $('.extended_query_txt').val(''); //2017 nnf 添加；
	        }
	        //添加表格子元素
	        function addEle() {
	            var eleName = $(".ele-name").val();
	            if (lengthCheck(eleName, 0, 50) == false) {
	                $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
	                $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                return;
	            } else if (isHtmlLabel(eleName)) {
	                $("#ele-name-error").html($scope.vm.notContainHtmlLabel);
	                $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                return;
	            } else {
	                $("#ele-name-error").html('');
	                $("#ele-name-error").attr("style", "display:none;");
	            }
	            var flag1 = false;
	            $.each($("#add-item").find("tr"), function (index, value) {
	                if (eleName == $(value).find(".ele-name-add").val()) {
	                    $("#ele-name-error").html('要素名称不能与已有要素名称重复');
	                    $("#ele-name-error").attr("style", "display:inline-block;left: 10px;z-index:9999");
	                    flag1 = true;
	                }
	            });
	            if (flag1 == true) {
	                return;
	            }
	            $("#ele-name-error").html('');
	            $("#ele-name-error").attr("style", "display:none;");
	            var eleType = $(".ele-type").val();
	            var miningType = $(".mining-type").val();
	            var eleAsked = $(".ele-asked").val();
	            if (lengthCheck(eleAsked, 0, 255) == false) {
	                $("#ele-asked-error").html('反问不能为空或超过长度限制255');
	                $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                return;
	            } else if (isHtmlLabel(eleAsked)) {
	                $("#ele-asked-error").html($scope.vm.notContainHtmlLabel);
	                $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                return;
	            } else {
	                $("#ele-asked-error").html('');
	                $("#ele-asked-error").attr("style", "display:none;");
	            }
	            var flag2 = false;
	            $.each($("#add-item").find("tr"), function (index, value) {
	                if (eleAsked == $(value).find(".ele-asked-add").val()) {
	                    $("#ele-asked-error").html('反问不能与已有反问重复');
	                    $("#ele-asked-error").attr("style", "display:inline-block;left: 10px;z-index:9999;");
	                    flag2 = true;
	                }
	            });
	            if (flag2 == true) {
	                return;
	            }
	            $("#ele-asked-error").html('');
	            $("#ele-asked-error").attr("style", "display:none;");
	            var relateConceptIds = "";
	            var relateConceptVals = "";
	            if ($(".ele-concept").attr("data-option") == undefined || $(".ele-concept").attr("data-option") == "") {} else {
	                relateConceptIds = $(".ele-concept").attr("data-option");
	                relateConceptVals = $(".ele-concept").val();
	                relateConceptVals = relateConceptVals.substring(0, relateConceptVals.length - 1);
	                var sumConceptStr = relateConceptIds + $scope.vm.textAndTagSplit + relateConceptVals;
	                if (lengthCheck(sumConceptStr, 0, 255) == false) {
	                    $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
	                    $("#ele-concept-error").attr("style", "display:inline-block;left: 10px;");
	                    return;
	                } else {
	                    $("#ele-concept-error").html('');
	                    $("#ele-concept-error").attr("style", "display:none;");
	                }
	                if (relateConceptVals == null) {
	                    return;
	                }
	                if (relateConceptVals == "") {
	                    return;
	                }
	                if (relateConceptIds == null) {
	                    return;
	                }
	                if (relateConceptIds == "") {
	                    return;
	                }
	            }

	            var html = '<tr>' + '   <td><input type="checkbox" class="sid"/></td>' + '   <td class="pr"><input type="text" style="width: 200px;" class="input_text ele-name-add" placeholder="地区" value="' + eleName + '" disabled="disabled"/></td>' + '   <td>' + '       <select class="ele-type-add bd">' + '           <option value=10014>字符串</option>' + '           <option value=10015>数字</option>' + '           <option value=10016>范围</option>' + '       </select>' + '   </td>' + '   <td>' + '       <select class="mining-type-add bd" disabled="disabled">' + '           <option value=10017>NLP</option>' +
	            /*'           <option value=10017>OEC</option>'+
	             '           <option value=10018>GATE</option>'+*/
	            '       </select>' + '   </td>' + '   <td class="pr"><input type="text" style="width: 200px;" class="input_text ele-asked-add" placeholder="" value="' + eleAsked + '" disabled="disabled"/></td>' + '   <td class="pr"><input type="text" style="width: 180px;" class="input_text ele-concept-add" placeholder="从概念库中选择" value="' + relateConceptVals + '" data-option="' + relateConceptIds + '" disabled="disabled"/></td>' + '</tr>';
	            $("#add-item").prepend(html);

	            $("#add-item").find("tr").filter(":eq(0)").find(".ele-type-add").val(eleType);
	            $("#add-item").find("tr").filter(":eq(0)").find(".mining-type-add").val(miningType);
	            //clear
	            $(".ele-name").val("");
	            $(".ele-type").val(10014);
	            $(".mining-type").val(10017);
	            $(".ele-asked").val("");
	            $(".ele-concept").attr("data-option", "");
	            $(".ele-concept").val("");
	        }
	        //删除表格子元素
	        function delEle() {
	            layer.confirm("确认删除？", {
	                btn: ['确认', '取消'],
	                shade: false
	            }, function (index) {
	                layer.close(index);
	                $.each($("#add-item").find(".sid"), function (index, value) {
	                    if ($(value).prop("checked") == true) {
	                        if ($(value).parent().parent().attr("element-id") != null) {
	                            httpRequestPostAsync("/api/ms/modeling/frame/deleteelementbyid", {
	                                "elementId": $(value).parent().parent().attr("element-id")
	                            }, function (data) {
	                                if (responseView(data) == true) {
	                                    loadFrameLibrary(1, 0);
	                                }
	                            }, function (err) {});
	                        }
	                        $(value).parent().parent().remove();
	                    }
	                });
	            }, function () {});
	        }
	        function splitAuto(val) {
	            return val.split(",");
	        }
	        function HashMap() {
	            //定义长度
	            var length = 0;
	            //创建一个对象
	            var obj = new Object();

	            /**
	             * 判断Map是否为空
	             */
	            this.isEmpty = function () {
	                return length == 0;
	            };

	            /**
	             * 判断对象中是否包含给定Key
	             */
	            this.containsKey = function (key) {
	                return key in obj;
	            };

	            /**
	             * 判断对象中是否包含给定的Value
	             */
	            this.containsValue = function (value) {
	                for (var key in obj) {
	                    if (obj[key] == value) {
	                        return true;
	                    }
	                }
	                return false;
	            };

	            /**
	             *向map中添加数据
	             */
	            this.put = function (key, value) {
	                if (!this.containsKey(key)) {
	                    length++;
	                }
	                obj[key] = value;
	            };

	            /**
	             * 根据给定的Key获得Value
	             */
	            this.get = function (key) {
	                return this.containsKey(key) ? obj[key] : null;
	            };

	            /**
	             * 根据给定的Key删除一个值
	             */
	            this.remove = function (key) {
	                if (this.containsKey(key) && delete obj[key]) {
	                    length--;
	                }
	            };

	            /**
	             * 获得Map中的所有Value
	             */
	            this.values = function () {
	                var _values = new Array();
	                for (var key in obj) {
	                    _values.push(obj[key]);
	                }
	                return _values;
	            };

	            /**
	             * 获得Map中的所有Key
	             */
	            this.keySet = function () {
	                var _keys = new Array();
	                for (var key in obj) {
	                    _keys.push(key);
	                }
	                return _keys;
	            };

	            /**
	             * 获得Map的长度
	             */
	            this.size = function () {
	                return length;
	            };

	            /**
	             * 清空Map
	             */
	            this.clear = function () {
	                length = 0;
	                obj = new Object();
	            };
	        }
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),

/***/ 87:
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/7.
	 * @Module : 业务建模 api
	 */
	var BusinessModelingServer = function BusinessModelingServer($resource) {
	    _classCallCheck(this, BusinessModelingServer);
	};

	BusinessModelingServer.$inject = ['$resource'];
	module.exports = function (businessModelingModule) {
	    businessModelingModule.service("BusinessModelingServer", BusinessModelingServer);
	};

/***/ })

});