webpackJsonp([13],Array(43).concat([
/* 43 */
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
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module : 知识管理
	 */
	module.exports = function (angular) {
	    var knowledgeManagementModule = angular.module('knowledgeManagementModule', []);

	    __webpack_require__(110)(knowledgeManagementModule); // 控制器
	    __webpack_require__(43)(knowledgeManagementModule); // 导航

	    //--------------------------------------------------
	    //         server
	    //--------------------------------------------------
	    __webpack_require__(71)(knowledgeManagementModule); // 服务
	    __webpack_require__(72)(knowledgeManagementModule); // 服务
	    //--------------------------------------------------
	    //         controller
	    //--------------------------------------------------
	    // ------    知识总览 -------//
	    __webpack_require__(73)(knowledgeManagementModule); // 总览
	    __webpack_require__(74)(knowledgeManagementModule); // 查看
	    __webpack_require__(75)(knowledgeManagementModule); // 预览
	    // ------    单条新增 编辑 -------//
	    __webpack_require__(76)(knowledgeManagementModule); // 概念新增
	    __webpack_require__(77)(knowledgeManagementModule); // 概念编辑
	    __webpack_require__(78)(knowledgeManagementModule); // faq新增
	    __webpack_require__(79)(knowledgeManagementModule); // faq编辑
	    __webpack_require__(80)(knowledgeManagementModule); // 列表新增
	    __webpack_require__(81)(knowledgeManagementModule); // 列表编辑
	    __webpack_require__(82)(knowledgeManagementModule); // 要素新增
	    __webpack_require__(83)(knowledgeManagementModule); // 要素编辑
	    __webpack_require__(84)(knowledgeManagementModule); // 富文本新增
	    __webpack_require__(85)(knowledgeManagementModule); // 富文本编辑
	    // ------    知识批量新增  -------//
	    __webpack_require__(86)(knowledgeManagementModule); // 批量新增
	    // ------    文档加工  ----------//
	    __webpack_require__(87)(knowledgeManagementModule); //
	    __webpack_require__(88)(knowledgeManagementModule); //
	    __webpack_require__(89)(knowledgeManagementModule); //
	    __webpack_require__(90)(knowledgeManagementModule); //
	    __webpack_require__(91)(knowledgeManagementModule); //
	    __webpack_require__(92)(knowledgeManagementModule); //
	    // ------    历史查看  ----------//
	    __webpack_require__(93)(knowledgeManagementModule); // 历史查看
	    //--------------------------------------------------
	    //         directive
	    //--------------------------------------------------
	    __webpack_require__(94)(knowledgeManagementModule);
	    __webpack_require__(95)(knowledgeManagementModule);
	    __webpack_require__(96)(knowledgeManagementModule);
	    __webpack_require__(97)(knowledgeManagementModule);
	    __webpack_require__(98)(knowledgeManagementModule);
	    __webpack_require__(99)(knowledgeManagementModule);
	    __webpack_require__(100)(knowledgeManagementModule);
	    __webpack_require__(101)(knowledgeManagementModule);
	    __webpack_require__(102)(knowledgeManagementModule);
	    //--------------------------------------------------
	    //         filter
	    //--------------------------------------------------
	    __webpack_require__(103)(knowledgeManagementModule);
	    __webpack_require__(104)(knowledgeManagementModule);
	    __webpack_require__(105)(knowledgeManagementModule);
	    __webpack_require__(106)(knowledgeManagementModule);
	    __webpack_require__(107)(knowledgeManagementModule);
	    __webpack_require__(108)(knowledgeManagementModule);

	    //--------------------------------------------------
	    //         页面缓存
	    //--------------------------------------------------
	    knowledgeManagementModule.run(function ($templateCache) {
	        // 知识内容配置
	        $templateCache.put("has-dialog", '<div ng-include="\'/static/knowledge_manage/components/know_content_has_dialog.html\'"></div>');
	        $templateCache.put("not-dialog", '<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
	        // bot 选择框
	        $templateCache.put("bot-class", '<div ng-include="\'/static/knowledge_manage/components/bot.html\'"></div>');
	        $templateCache.put("bot-class-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/bot_not_dialog.html\'"></div>');
	        //扩展问
	        $templateCache.put("ext", '<div ng-include="\'/static/knowledge_manage/components/ext.html\'"></div>');
	        $templateCache.put("ext-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/ext_not_dialog.html\'"></div>');
	        // 时间选择
	        $templateCache.put("select-start-end-time", '<div ng-include="\'/static/knowledge_manage/components/select_start_end_time.html\'"></div>');
	        $templateCache.put("select-start-end-time-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/select_start_end_time_not_dialog.html\'"></div>');
	    });
	};

	// Define the `phoneDetail` module
	angular.module('knowledgeManagementModule', ['know']).run(function ($templateCache) {
	    // 知识内容配置
	    $templateCache.put("has-dialog", '<div ng-include="\'/static/knowledge_manage/components/know_content_has_dialog.html\'"></div>');
	    $templateCache.put("not-dialog", '<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
	    // bot 选择框
	    $templateCache.put("bot-class", '<div ng-include="\'/static/knowledge_manage/components/bot.html\'"></div>');
	    $templateCache.put("bot-class-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/bot_not_dialog.html\'"></div>');
	    //扩展问
	    $templateCache.put("ext", '<div ng-include="\'/static/knowledge_manage/components/ext.html\'"></div>');
	    $templateCache.put("ext-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/ext_not_dialog.html\'"></div>');
	    // 时间选择
	    $templateCache.put("select-start-end-time", '<div ng-include="\'/static/knowledge_manage/components/select_start_end_time.html\'"></div>');
	    $templateCache.put("select-start-end-time-not-dialog", '<div ng-include="\'/static/knowledge_manage/components/select_start_end_time_not_dialog.html\'"></div>');
	});

/***/ }),
/* 71 */
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/12.
	 * @Module :  知识管理接口管理
	 */
	var KnowledgeService = function KnowledgeService($resource) {
	                _classCallCheck(this, KnowledgeService);

	                /******************************
	                 * 知识总览 *
	                 **********************************/
	                //   客服知识
	                //获取知识列表
	                this.queryCustKnowList = $resource(API_MS + "/knowledgeManage/overView/searchList", {}, {});
	                //知识导出
	                this.custKnowExport = API_MS + "/knowledgeManage/exportExcel";
	                //获取新增知识数量
	                this.queryCustNewNumber = $resource(API_MS + "/knowledgeManage/overView/searchTotalAndToday", {}, {});
	                //删除知识
	                this.removeCustKnow = $resource(API_MS + "/knowledgeManage/deleteKnowledge", {}, {});
	                //   知识预览 获取知识
	                //faq
	                this.queryFaqKnow = $resource(API_MS + "/faqKnowledge/getKnowledge", {}, {});
	                //概念
	                this.queryConceptKnow = $resource(API_MS + "/conceptKnowledge/getKnowledge", {}, {});
	                //富文本
	                this.queryRichTextKnow = $resource(API_MS + "/richtextKnowledge/getKnowledge", {}, {});
	                //列表
	                this.queryListKnow = $resource(API_MS + "/listKnowledge/getKnowledge", {}, {});
	                //要素
	                this.queryFactorKnow = $resource(API_MS + "/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId", {}, {});

	                /******************************
	                 * 知识单条新增 *
	                 **********************************/
	                //   bot
	                //获取bot全路径
	                this.getBotFullPath = $resource(API_MODELING + "/category/getcategoryfullname", {}, {});
	                //根据名字模糊搜索
	                this.seekBotByName = $resource(API_MODELING + "/category/searchbycategoryname", {}, {});
	                //获取bot子节点
	                this.queryChildNodes = $resource(API_MODELING + "/category/listbycategorypid", {}, {});
	                //   faq知识新增
	                // 获取相关问
	                this.queryFapRelatedQuestion = $resource(API_MS + "/conceptKnowledge/getKnowledgeTitle", {}, {});
	                // 检验扩展问
	                this.queryFaqExtension = $resource(API_MS + "/faqKnowledge/checkExtensionQuestion", {}, {});
	                // 保存
	                this.storeFaqKnow = $resource(API_MS + "/faqKnowledge/addFAQKnowledge", {}, {});
	                // 编辑
	                this.updateFaqKnow = $resource(API_MS + "/faqKnowledge/editFAQKnowledge", {}, {});
	                //   概念知识新增
	                // 获取相关问
	                this.queryConceptRelatedQuestion = $resource(API_MS + "/conceptKnowledge/getKnowledgeTitle", {}, {});
	                // 检验扩展问
	                this.queryConceptExtension = $resource(API_MS + "/conceptKnowledge/checkExtensionQuestion", {}, {});
	                // 保存
	                this.storeConceptKnow = $resource(API_MS + "/conceptKnowledge/addConceptKnowledge", {}, {});
	                // 编辑
	                this.updateConceptKnow = $resource(API_MS + "/conceptKnowledge/editKnowledge", {}, {});
	                //   列表知识新增
	                // 获取相关问
	                this.queryListRelatedQuestion = $resource(API_MS + "/listKnowledge/getKnowledgeTitle", {}, {});
	                // 检验扩展问
	                this.queryListExtension = $resource(API_MS + "/listKnowledge/checkExtensionQuestion", {}, {});
	                // 保存
	                this.storeListKnow = $resource(API_MS + "/listKnowledge/addListKnowledge", {}, {});
	                // 编辑
	                this.updateListKnow = $resource(API_MS + "/listKnowledge/editKnowledge", {}, {});
	                //   要素知识新增
	                // 获取相关问
	                this.queryFactorRelatedQuestion = $resource(API_MS + "/factorKnowledge/getKnowledgeTitle", {}, {});
	                // 检验扩展问
	                this.queryFactorExtension = $resource(API_MS + "/elementKnowledgeAdd/checkDistribute", {}, {});
	                // 保存
	                this.storeFactorKnow = $resource(API_MS + "/elementKnowledgeAdd/addElementKnowledge", {}, {});
	                // 编辑
	                this.updateFactorKnow = $resource(API_MS + "/elementKnowledgeAdd/editElementKnowledge", {}, {});
	                //   富文本知识新增
	                // 获取相关问
	                this.queryRichTextRelatedQuestion = $resource(API_MS + "/richtextKnowledge/getKnowledgeTitle", {}, {});
	                // 检验扩展问
	                this.queryRichTextExtension = $resource(API_MS + "/richtextKnowledge/checkExtensionQuestion", {}, {});
	                // 保存
	                this.storeRichTextKnow = $resource(API_MS + "/elementKnowledgeAdd/addElementKnowledge", {}, {});
	                // 编辑
	                this.updateRichTextKnow = $resource(API_MS + "/elementKnowledgeAdd/editElementKnowledge", {}, {});
	                // 根据id 获取图文封面图片 url ，title 方法     //pic
	                this.getMediaPicture = $resource(API_MS + "/picture/queryPictureUrl", {}, {});
	                // 根据id 获取图文封面图片 url ，title 方法     //voice
	                this.getMediaVoice = $resource(API_MS + "/voiceManage/queryVoiceUrl", {}, {});
	                // 根据id 获取图文封面图片 url ，title 方法     //pic
	                this.getMediaImgText = $resource(API_MS + "/graphicMessage/findOneGraphicMessage", {}, {});
	};

	;
	KnowledgeService.$inject = ['$resource'];
	module.exports = function (knowledgeManagementModule) {
	                knowledgeManagementModule.service("KnowledgeService", KnowledgeService);
	};

/***/ }),
/* 72 */
/***/ (function(module, exports) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/31.
	 * @Module :  文档加工
	 */
	var KnowDocService = function KnowDocService($resource) {
	    _classCallCheck(this, KnowDocService);

	    var knowDocService = {};
	    knowDocService.queryKnowDocList = $resource(API_MS + '/knowledgeDocumentation/queryDocumentationList', {}, {});
	    knowDocService.queryDetailByDocId = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationKnowledge', {}, {});
	    knowDocService.deleteKnowDoc = $resource(API_MS + '/knowledgeDocumentation/deleteDocumentation', {}, {});
	    return knowDocService;
	};

	var DetailService = function DetailService($resource) {
	    _classCallCheck(this, DetailService);

	    var detailService = {};
	    //知识文档
	    //查询文档知识详情
	    detailService.queryKnowDocByDocId = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationById', {}, {});
	    //查询文档知识点
	    detailService.queryDocKnowItems = $resource(API_MS + '/knowledgeDocumentation/selectDocumentationKnowledgeList', {}, {});
	    //忽略文档全部知识点
	    detailService.ignoreDocKnowAll = $resource(API_MS + '/knowledgeDocumentation/ignoreDocumentationKnowledgeAll', {}, {});
	    //忽略文档单个知识点
	    detailService.ignoreDocKnow = $resource(API_MS + '/knowledgeDocumentation/ignoreDocumentationKnowledge', {}, {});
	    return detailService;
	};

	var TemplateService = function TemplateService($resource) {
	    _classCallCheck(this, TemplateService);

	    var templateService = {};
	    templateService.queryTemplate = $resource(API_MS + '/template/queryTemplate', {}, {});
	    templateService.deleteTemplate = $resource(API_MS + '/template/deleteTemplate', {}, {});
	    templateService.queryRules = $resource(API_MS + '/templateRule/queryAllRule', {}, {});
	    templateService.queryTemplateById = $resource(API_MS + '/template/queryTemplate', {}, {});
	    templateService.generateRule = $resource(API_MS + '/templateRule/getJuniorText', {}, {});
	    templateService.getSimilarText = $resource(API_MS + '/templateRule/getSimilarText', {}, {});
	    templateService.optimizeText = $resource(API_MS + '/templateRule/optimizeText', {}, {});
	    templateService.queryTemplateContent = $resource(API_MS + '/template/previewKnowDoc', {}, {});
	    templateService.addWordRule = $resource(API_MS + '/templateRule/addWordRule', {}, {});
	    templateService.updateWordRule = $resource(API_MS + '/templateRule/updateWordRule', {}, {});
	    templateService.checkTemName = $resource(API_MS + '/template/searchByTemplateName', {}, {});
	    templateService.deleteRule = $resource(API_MS + '/templateRule/deleteWordRule', {}, {});
	    templateService.queryRuleById = $resource(API_MS + '/templateRule/queryRuleById', {}, {});
	    return templateService;
	};

	KnowDocService.$inject = ['$resource'];
	DetailService.$inject = ['$resource'];
	TemplateService.$inject = ['$resource'];
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.factory("KnowDocService", KnowDocService).factory("DetailService", DetailService).factory("TemplateService", TemplateService);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  客服 知识 总览
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('CustOverviewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "$stateParams", "ngDialog", "$timeout", "$cookieStore", "$window", "$rootScope", function ($scope, localStorageService, KnowledgeService, $state, $stateParams, ngDialog, $timeout, $cookieStore, $window, $rootScope) {
	        //******************************************** //
	        var n = 1; // 定義淚目數  類別
	        //********************************************//
	        $scope.vm = {
	            applicationName: APPLICATION_NAME,
	            creatBot: [],
	            frameCategoryId: "",
	            botRoot: null,
	            type: true,

	            listData: [], //知识列表
	            newNumber: null, //新增条数
	            paginationConf: { // 分页
	                pageSize: 5,
	                pagesLength: 10
	            },
	            //fn
	            exportExcel: exportExcel,
	            getData: getData, //数据获取
	            delData: delData, //删除

	            knowledgeIds: [], //刪除 id ，
	            addDelIds: addDelIds,
	            // params set
	            sceneIds: [],
	            "knowledgeTitle": null, //知识标题默认值null

	            keySearch: keySearch,
	            napSearch: napSearch,

	            heighSarch: false,

	            seekAdvanceParameter: {
	                "knowledgeType": "", //搜索知识类型
	                "searchExtension": "", //搜索的擴展問
	                "knowledgeTitle": null, //知识标题默认值null
	                "knowledgeContent": null, //知识内容默认值null
	                "knowledgeCreator": null, //作者默认值null
	                "knowledgeExpDateEnd": null, //知识有效期开始值默认值null
	                "knowledgeExpDateStart": null, //知识有效期结束值默认值null
	                "sourceType": 0, //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
	                "updateTimeType": 0 //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
	            },
	            newKnowledge: "false", // 新增知识选择下拉
	            jumpToNewKonwledge: jumpToNewKonwledge, // 添加知识跳转页面
	            isSelectAll: false, // 全选 删除
	            selectAll: selectAll, //選擇全部

	            selectedBot: [],
	            paramsReset: paramsReset //搜索重置参数
	        };
	        function jumpToNewKonwledge(id) {
	            var addUrl;
	            switch (id) {
	                case "100":
	                    addUrl = "knowledgeManagement.faqAdd";
	                    break;
	                case "101":
	                    addUrl = "knowledgeManagement.singleAddConcept";
	                    break;
	                case "102":
	                    addUrl = "knowledgeManagement.listAdd";
	                    break;
	                case "103":
	                    addUrl = "knowledgeManagement.factorAdd";
	                    break;
	                case "106":
	                    addUrl = "knowledgeManagement.markKnow";
	                    break;
	            }
	            $state.go(addUrl);
	        }
	        // 初始化 数据
	        napSearch(false);
	        //高级搜索 开关
	        $scope.$watch("vm.heighSarch", function (val) {
	            if (val) {
	                angular.element(".advanced_search").slideDown();
	            } else {
	                angular.element(".advanced_search").slideUp();
	            }
	        });
	        // 1 scenesIds
	        // 2 title
	        // 3 heighsearch

	        //是否清空 搜索内容  true  清空 false 不清空
	        //@1 分頁 false   @2初始化 true
	        function napSearch(type) {
	            getData(1);
	            getNewNumber();
	            if (type) {
	                $timeout(function () {
	                    $scope.vm.paramsReset();
	                }, 500);
	            }
	            $scope.vm.heighSarch = false;
	        }

	        /**
	         * 知识导出
	         * @param index
	         */
	        function exportExcel() {
	            var sceneIds = $scope.vm.sceneIds.length ? $scope.vm.sceneIds : null;
	            var urlParams = "?applicationId=" + APPLICATION_ID + "&sceneIds=" + sceneIds + "&knowledgeTitle=" + $scope.vm.knowledgeTitle + "&knowledgeContent=" + $scope.vm.knowledgeContent + "&knowledgeCreator=" + $scope.vm.knowledgeCreator + "&knowledgeExpDateEnd=" + $scope.vm.knowledgeExpDateEnd + "&knowledgeExpDateStart=" + $scope.vm.knowledgeExpDateStart + "&sourceType=" + $scope.vm.sourceType + "&updateTimeType=" + $scope.vm.updateTimeType;
	            var url = KnowledgeService.custKnowExport + urlParams; //请求的url
	            downLoadFiles(angular.element(".customer-over")[0], url);
	        }
	        function getData(index) {
	            var i = layer.msg('资源加载中...', { icon: 16, shade: [0.5, '#f5f5f5'], scrollbar: false, time: 100000 });
	            KnowledgeService.queryCustKnowList.save({
	                "applicationId": APPLICATION_ID,
	                "index": (index - 1) * $scope.vm.paginationConf.pageSize,
	                "pageSize": $scope.vm.paginationConf.pageSize,
	                "sceneIds": $scope.vm.sceneIds.length ? $scope.vm.sceneIds : null, //类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
	                "knowledgeTitle": $scope.vm.knowledgeTitle, //知识标题默认值null

	                "knowledgeContent": $scope.vm.seekAdvanceParameter.knowledgeContent, //知识内容默认值null
	                "knowledgeUpdate": $scope.vm.seekAdvanceParameter.knowledgeCreator, //作者默认值null
	                "knowledgeExpDateEnd": $scope.vm.seekAdvanceParameter.knowledgeExpDateEnd, //知识有效期开始值默认值null
	                "knowledgeExpDateStart": $scope.vm.seekAdvanceParameter.knowledgeExpDateStart, //知识有效期结束值默认值null
	                "knowledgeOrigin": $scope.vm.seekAdvanceParameter.sourceType, //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
	                "updateTimeType": $scope.vm.seekAdvanceParameter.updateTimeType, //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
	                "knowledgeType": $scope.vm.seekAdvanceParameter.knowledgeType, //
	                "knowledgeExtensionQuestion": $scope.vm.seekAdvanceParameter.searchExtension //扩展问
	            }, function (response) {
	                $scope.vm.isSelectAll = false;
	                $scope.vm.knowledgeIds = [];
	                layer.close(i);
	                if (response.data.total) {
	                    $scope.vm.listData = response.data.objs;
	                    $scope.vm.paginationConf.totalItems = response.data.total;
	                    $scope.vm.paginationConf.numberOfPages = response.data.total / $scope.vm.paginationConf.pageSize;
	                } else {
	                    layer.msg("未查询到数据");
	                    $scope.vm.listData = [];
	                    $scope.vm.paginationConf.totalItems = 0;
	                }
	            }, function (error) {
	                layer.close(i);
	                console.log(error);
	            });
	        }
	        var timeout;
	        $scope.$watch('vm.paginationConf.currentPage', function (current, old) {
	            if (current && old != undefined) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    getData(current);
	                });
	            }
	        }, true);
	        function keySearch(e) {
	            var srcObj = e.srcElement ? e.srcElement : e.target;
	            var keycode = window.e ? e.keyCode : e.which;
	            if (keycode == 13) {
	                srcObj.blur();
	                napSearch();
	                srcObj.blur();
	            }
	        }
	        function paramsReset() {
	            //重置 参数 问题
	            $scope.vm.sceneIds = [], //类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
	            $scope.vm.knowledgeTitle = null, //知识标题默认值null
	            $scope.vm.seekAdvanceParameter = {
	                "knowledgeType": "", //搜索知识类型
	                "searchExtension": "", //搜索的擴展問
	                "knowledgeTitle": null, //知识标题默认值null
	                "knowledgeContent": null, //知识内容默认值null
	                "knowledgeCreator": null, //作者默认值null
	                "knowledgeExpDateEnd": null, //知识有效期开始值默认值null
	                "knowledgeExpDateStart": null, //知识有效期结束值默认值null
	                "sourceType": 0, //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
	                "updateTimeType": 0 //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
	            };
	        }
	        function delData() {
	            if (!$scope.vm.knowledgeIds || $scope.vm.knowledgeIds.length === 0) {
	                layer.msg("请选择删除知识", { time: 800 });
	            } else {
	                layer.confirm('是否删除当前选中知识？', {
	                    btn: ['确定', '取消'] //按钮
	                }, function () {
	                    KnowledgeService.removeCustKnow.save({
	                        "knowledgeIds": $scope.vm.knowledgeIds
	                    }, function (response) {
	                        getData(1);
	                        getNewNumber();
	                        layer.msg("刪除成功");
	                    }, function (error) {
	                        console.log(error);
	                    });
	                });
	            }
	        }
	        function selectAll(items) {
	            if ($scope.vm.isSelectAll) {
	                $scope.vm.isSelectAll = false;
	                $scope.vm.knowledgeIds = [];
	            } else {
	                $scope.vm.isSelectAll = true;
	                $scope.vm.knowledgeIds = [];
	                angular.forEach(items, function (val) {
	                    $scope.vm.knowledgeIds.push(val.knowledgeId);
	                });
	            }
	        }
	        function addDelIds(id, arr) {
	            if (arr.inArray(id)) {
	                arr.remove(id);
	                $scope.vm.isSelectAll = false;
	            } else {
	                arr.push(id);
	            }
	            console.log(id, arr);
	        }
	        function getNewNumber() {
	            KnowledgeService.queryCustNewNumber.save({
	                "applicationId": APPLICATION_ID,
	                "sceneIds": $scope.vm.sceneIds.length ? $scope.vm.sceneIds : null, //类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
	                "knowledgeTitle": $scope.vm.knowledgeTitle, //知识标题默认值null
	                "knowledgeContent": $scope.vm.knowledgeContent, //知识内容默认值null
	                "knowledgeUpdate": $scope.vm.knowledgeCreator, //作者默认值null
	                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd, //知识有效期开始值默认值null
	                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart, //知识有效期结束值默认值null
	                "sourceType": $scope.vm.sourceType //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
	            }, function (data) {
	                $scope.vm.newNumber = data.data.total;
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        /////////////////////////////////////////          Bot      /////////////////////////////////////////////////////
	        $("body").on('click', function (e) {
	            e = event || window.event;
	            var srcObj = e.srcElement ? e.srcElement : e.target;
	            if ($(srcObj).closest(".aside-nav").hasClass("aside-nav")) {
	                e.stopPropagation();
	            } else {
	                $(".aside-nav").find(".type1").children("ul").slideUp();
	                $timeout(function () {
	                    $(".aside-nav").find(".type1").children("a").find(".icon-jj").css("backgroundPosition", "0% 0%");
	                }, 50);
	            }
	        });
	        //获取root 数据
	        void function () {
	            httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                "categoryApplicationId": APPLICATION_ID,
	                "categoryPid": "root"
	            }, function (data) {
	                $scope.vm.botRoot = data.data;
	                $scope.$apply();
	            }, function () {
	                console.log("getDate==failed");
	            });
	        }();
	        //点击更改bot value
	        //绑定点击空白隐藏（滚动条除外）

	        $(".aside-nav").on("click", "a", function (e) {
	            //初始化
	            $scope.vm.paramsReset();
	            var srcObj = e.srcElement ? e.srcElement : e.target;
	            if (srcObj.tagName == 'I') {
	                return;
	            } else if (!$(this).parent().hasClass('type1')) {
	                $(".botPathactiveMouse").removeClass("botPathactiveMouse");
	                $(".botPathactiveClick").removeClass("botPathactiveClick");
	                $(this).addClass("botPathactiveClick");
	            }

	            var id = angular.element(this).find("span").attr("data-option-id");
	            $scope.vm.sceneIds.push(id);
	            //获取bot全路径
	            httpRequestPost("/api/ms/modeling/category/getcategoryfullname", {
	                "categoryId": id
	            }, function (data) {
	                $scope.vm.selectedBot = data.categoryFullName.split("/");
	                console.log(data);
	            }, function () {});
	            // 获取知识数据
	            httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                "categoryApplicationId": APPLICATION_ID,
	                "categoryPid": id
	            }, function (data) {
	                angular.forEach(data.data, function (item) {
	                    $scope.vm.sceneIds.push(item.categoryId);
	                });
	                napSearch();
	            }, function () {});
	            $scope.$apply();
	        });
	        //点击下一级 bot 下拉数据填充以及下拉效果
	        $(".aside-nav").on("click", '.ngBotAdd', function () {
	            var id = $(this).attr("data-option-id");
	            var that = $(this);
	            var isEdg = that.hasClass('icon-ngJj');

	            // 侧边 只能有一个选项
	            //非侧边 可以存在多个
	            if (that.parent().hasClass('type1')) {
	                //root bot
	                return false;
	            } else if (!that.closest("ul").hasClass("pas-menu_1")) {
	                that.parent().parent().parent().siblings().each(function (index, item) {
	                    $(item).find("ul").hide();
	                });
	            }
	            if (!that.parent().siblings().length) {
	                // 新增
	                if (!isEdg) {
	                    //加号
	                    that.css("backgroundPosition", "0% 100%");
	                } else {
	                    //业务词
	                    that.closest("li").siblings().each(function (index, item) {
	                        //同级隐藏
	                        $(item).find("ul").hide().find(".icon-jj ").css("backgroundPosition", "0% 0%");
	                    });
	                    that.closest("ul.menu_1").parent().siblings().each(function (index, item) {
	                        //父级元素兄弟元素所有子集隐藏
	                        $(item).find("ul.pas-menu_1").hide();
	                    });
	                }
	                //请求BOT数据 组装DOM
	                httpRequestPost("/api/ms/modeling/category/listbycategorypid", {
	                    "categoryApplicationId": APPLICATION_ID,
	                    "categoryPid": id
	                }, function (data) {
	                    console.log(data);
	                    if (data.data) {
	                        var itemClassName = isEdg ? "pas-menu_1" : "menu_1";
	                        var leafClassName = isEdg ? "icon-jj" : "icon-ngJj";
	                        var html = '<ul class="' + itemClassName + '" style="overflow:visible;">';
	                        //已经移除 icon-ngJj  ngBotAdd 样式 所有的应用于选择
	                        angular.forEach(data.data, function (item) {
	                            var typeClass;
	                            // 叶子节点 node
	                            if (item.categoryLeaf == 0 && item.categoryAttributeName != "edge") {
	                                typeClass = "bot-noBg";
	                            } else if (item.categoryLeaf != 0 && item.categoryAttributeName == "edge") {
	                                typeClass = "bot-edge";
	                            } else if (item.categoryLeaf != 0 && item.categoryAttributeName == "node") {
	                                typeClass = "icon-jj";
	                            }
	                            var backImage;
	                            switch (item.categoryTypeId) {
	                                case 160:
	                                    backImage = " bot-divide";
	                                    break;
	                                case 161:
	                                    backImage = " bot-process";
	                                    break;
	                                case 162:
	                                    backImage = " bot-attr";
	                                    break;
	                                case 163:
	                                    backImage = " bot-default";
	                                    break;
	                            }
	                            //1  存在叶节点   >
	                            //if(item.categoryLeaf){
	                            //    html+= '<li data-option-id="'+item.categoryId+'" class="slide-a  bg50 bgE3">' +
	                            //    '<a class="ellipsis bg50" href="javascript:;">'+
	                            html += '<li data-option-id="' + item.categoryId + '" class="slide-a">' + '<a class="ellipsis bg50" href="javascript:;">' + '<i class="' + leafClassName + " " + backImage + " " + typeClass + ' ngBotAdd" data-option-id="' + item.categoryId + '"></i>' + '<span data-option-id="' + item.categoryId + '">' + item.categoryName + '</span>' + '</a>' + '</li>';
	                            //}else{
	                            //    //不存在叶节点
	                            //    html+= '<li class="bg50 bgE3" data-option-id="'+item.categoryId+'" class="slide-a  bg50 bgE3">' +
	                            //                ' <a class="ellipsis bg50" href="javascript:;">'+
	                            //                    '<i class="'+leafClassName+'" style="background:0" data-option-id="'+item.categoryId+'"></i>'+
	                            //                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
	                            //                '</a>' +
	                            //           '</li>'
	                            //}
	                        });
	                        html += "</ul>";
	                        $(html).appendTo(that.parent().parent());
	                        $timeout(function () {
	                            that.parents().next().slideDown();
	                        }, 50);
	                    }
	                }, function (err) {
	                    //console.log("getDate==failed");
	                });
	            } else {
	                //操作当前 DOM 隐藏显示
	                if (!isEdg) {
	                    //加号
	                    if (that.css("backgroundPosition") == "0% 0%") {
	                        that.css("backgroundPosition", "0% 100%");
	                        that.parent().next().slideDown();
	                    } else {
	                        that.css("backgroundPosition", "0% 0%");
	                        that.parent().next().slideUp();
	                    }
	                } else {
	                    //业务词
	                    that.parent().next().slideToggle(); //自身状态改变
	                    that.closest("li").siblings().each(function (index, item) {
	                        //同级隐藏
	                        $(item).find("ul").hide().find(".icon-jj ").css("backgroundPosition", "0% 0%");
	                    });
	                    that.closest("ul.menu_1").parent().siblings().each(function (index, item) {
	                        //父级元素兄弟元素所有子集隐藏
	                        $(item).find("ul.pas-menu_1").hide();
	                    });
	                }
	            }
	        });
	        $(".aside-nav").on("mouseenter", '.ellipsis', function () {
	            var self = $(this);
	            if (self.parent().hasClass('type1')) {
	                return false;
	            } else {
	                if (self.hasClass("botPathactiveClick")) {
	                    return;
	                } else {
	                    $(this).addClass("botPathactiveMouse");
	                }
	            }
	        });
	        $(".aside-nav").on("mouseout", '.ellipsis', function () {
	            var self = $(this);
	            if (self.parent().hasClass('type1')) {
	                return false;
	            } else {
	                if (self.hasClass("botPathactiveClick")) {
	                    return;
	                } else {
	                    self.removeClass("botPathactiveMouse");
	                }
	            }
	        });
	        //第二种  箭头添加 hover
	        //$(".aside-nav").on("mouseenter",'.leafHover',function(){
	        //    var id = $(this).attr("data-option-id");
	        //    $(this).addClass("");
	        //    //console.log(id)
	        //    var that = $(this);
	        //    if($(that).children().length==1){
	        //        httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
	        //            "categoryApplicationId":APPLICATION_ID,
	        //            "categoryPid": id
	        //        },function(data){
	        //            //console.log(data);
	        //            if(data.data){
	        //                //console.log(data);
	        //                    n+=1;
	        //                        var  html = '<ul class="pas-menu_1 leaf'+n+'">';
	        //                        angular.forEach(data.data,function(item){
	        //                            //1  存在叶节点
	        //                            if(item.categoryLeaf){
	        //                                html+= '<li data-option-id="'+item.categoryId+'">' +
	        //                                    '<div class="slide-a">'+
	        //                                    ' <a class="ellipsis" href="javascript:;">'+
	        //                                     '<i class="icon-ngJj ngBotAdd" data-option-id="'+item.categoryId+'"></i>'+
	        //                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span></i>'+
	        //                                    '</a>' +
	        //                                    '</div>' +
	        //                                    '</li>'
	        //                            }else{
	        //                                //不存在叶节点
	        //                                html+= '<li data-option-id="'+item.categoryId+'">' +
	        //                                    '<div class="slide-a">'+
	        //                                    ' <a class="ellipsis" href="javascript:;">'+
	        //                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
	        //                                    '</a>' +
	        //                                    '</div>' +
	        //                                    '</li>'
	        //                            }
	        //                        });
	        //                    }
	        //            html+="</ul>";
	        //            $(html).appendTo((that));
	        //            $(".leaf"+n).show();
	        //            //}
	        //        },function(err){
	        //            console.log("getDate==failed");
	        //        });
	        //
	        //}else{
	        //     $(that).children().eq(1).show()
	        //    }
	        //});
	        //$(".aside-nav").on("mouseleave",'.leafHover',function(){
	        //    var that = $(this);
	        //    if($(that).children().length==2){
	        //        $(that).children().eq(1).hide();
	        //    }
	        //});

	        ////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  客服知识查看
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('CustPreviewController', ['$scope', 'localStorageService', "$state", "$stateParams", "$cookieStore", "KnowledgeService", function ($scope, localStorageService, $state, $stateParams, $cookieStore, KnowledgeService) {
	        if (!$stateParams.knowledgeId || !$stateParams.knowledgeType) {
	            $state.go("knowledgeManagement.custOverview");
	        } else {
	            var edit = function edit() {
	                $state.go(editUrl, { data: angular.toJson($scope.vm.listData) });
	            };

	            $scope.vm = {
	                knowledgeId: $stateParams.knowledgeId, //del
	                knowledgeType: parseInt($stateParams.knowledgeType),
	                listData: null,
	                edit: edit
	            };
	            ////获取维度
	            //knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
	            //    function(data) {
	            //        if(data.data){
	            //            $scope.vm.channels = data.data
	            //        }
	            //    }, function(error) {
	            //    });
	            //修改
	            var editUrl, api;
	            switch ($scope.vm.knowledgeType) {
	                case 100:
	                    editUrl = "knowledgeManagement.faqAdd";
	                    api = "queryFaqKnow";
	                    break;
	                case 101:
	                    editUrl = "knowledgeManagement.singleAddConcept";
	                    api = "queryConceptKnow";
	                    break;
	                case 102:
	                    editUrl = "knowledgeManagement.listAdd";
	                    api = "queryListKnow";
	                    break;
	                case 103:
	                    editUrl = "knowledgeManagement.factorAdd";
	                    api = "queryFactorKnow";
	                    break;
	                case 106:
	                    editUrl = "knowledgeManagement.markKnow";
	                    api = "queryRichTextKnow";
	                    break;
	            }

	            void function () {
	                var i = layer.msg('资源加载中...', { icon: 16, shade: [0.5, '#f5f5f5'], scrollbar: false, time: 100000 });
	                KnowledgeService[api].save({
	                    "knowledgeId": $scope.vm.knowledgeId,
	                    "applicationId": APPLICATION_ID
	                }, function (response) {
	                    layer.close(i);
	                    if ($scope.vm.knowledgeType == 103) {
	                        var data = response.data;
	                        var table = data.knowledgeContents[0].knowledgeTable;
	                        data.knowledgeContents[0].knowledgeContent = table;
	                        delete data.knowledgeContents[0].knowledgeTable;
	                        $scope.vm.listData = data;
	                    } else {
	                        $scope.vm.listData = response.data;
	                    }
	                }, function (error) {
	                    console.log(error);
	                    layer.close(i);
	                });
	            }();
	        }
	    }]);
	};

/***/ }),
/* 75 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  知识预览
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('KnowledgeScanController', ['$scope', 'localStorageService', "$state", "$stateParams", "ngDialog", "$cookieStore", "$location", "$rootScope", "knowledgeAddServer", "$window", function ($scope, localStorageService, $state, $stateParams, ngDialog, $cookieStore, $location, $rootScope, knowledgeAddServer, $window) {
	        var knowledgeScan = $window.opener.knowledgeScan;
	        $scope.vm = {
	            knowledgeType: knowledgeScan.params.knowledgeType,
	            listData: null,
	            knowledgeData: knowledgeScan.params,
	            editUrl: knowledgeScan.editUrl,
	            save: save,
	            tableData: knowledgeScan.knowledgeType == 103 ? JSON.parse(knowledgeScan.params.knowledgeContents[0].knowledgeContent) : ""
	        };
	        console.log(knowledgeScan);
	        //保存方法  根据url  获取 保存路径
	        function save() {
	            httpRequestPost(knowledgeScan.api, $scope.vm.knowledgeData, function (data) {
	                console.log(data);
	                if (data.status == 200) {
	                    $state.go('knowledgeManagement.custOverview');
	                } else if (data.status == 10002) {
	                    layer.msg(" 添加知识标题重复,请返回修改 ");
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	    }]);
	};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/3/28.
	 * @Module : 客服场景 概念单单条知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('ConceptNewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "concept",
	            apiQueryRelatedQuestion: "queryConceptRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_concept_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "", //标题
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            creatSelectBot: [], //手选生成 bot
	            botFullPath: null,
	            frameCategoryId: "",
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            newTitle: "", //标题
	            channelIdList: [], //新添加的渠道
	            dimensionArr: [], //選擇的維度
	            question: 1, //显示相关问题
	            tip: 1, //相关提示
	            tail: 1, //小尾巴
	            knowledgeRelevantContentList: [], // 相关知识

	            enterEvent: enterEvent,
	            limitSave: false,
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引


	            //引导页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	        };
	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.scanContent.push({
	                    knowledgeContent: item.knowledgeContent, //渠道
	                    channelIdList: item.channelIdList,
	                    dimensionIdList: item.dimensionIdList, // 维度
	                    knowledgeRelatedQuestionOn: item.knowledgeRelatedQuestionOn, //显示相关问
	                    knowledgeBeRelatedOn: item.knowledgeBeRelatedOn, //在提示
	                    knowledgeCommonOn: item.knowledgeCommonOn, //弹出评价小尾巴
	                    knowledgeRelevantContentList: item.knowledgeRelevantContentList == null ? [] : item.knowledgeRelevantContentList //业务扩展问
	                });
	            });
	            //    文檔加工添加知識
	        } else if ($stateParams.data && angular.fromJson($stateParams.data).docmentation) {
	            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
	            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
	            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
	            $scope.vm.knowledgeOrigin = 122;
	            $timeout(function () {
	                openContentConfirm(function () {
	                    saveAddNew(0);
	                });
	            }, 0);
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var extensionQuestionList = [],
	                    //    frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        // 知识文档分类回调
	        function knowledgeClassifyCall() {
	            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify", {
	                knowledgeId: $scope.vm.docmentation.knowledgeId,
	                knowledgeStatus: 3
	            }, function (data) {
	                if (data && data.status == 200) {
	                    $state.go("back.doc_results_view", {
	                        knowDocId: $scope.vm.docmentation.documentationId,
	                        knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
	                        knowDocUserName: $scope.vm.docmentation.knowDocUserName
	                    });
	                }
	            });
	        }
	        //打开知识内容对话框
	        function openContentConfirm(callback, elseCall) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/public_html/knowledge_increase.html", "650px", function () {
	                callback();
	            }, "", function () {
	                $scope.$parent.knowCtr.setKnowParamHasDialog($scope);
	            });
	        }
	        //        function replace(id){
	        //                var replace = ngDialog.openConfirm({
	        //                    template:"/static/knowledgeManagement/faq/replace.html",
	        //                    scope: $scope,
	        //                    closeByDocument:false,
	        //                    closeByEscape: true,
	        //                    showClose : true,
	        //                    backdrop : 'static',
	        //                    preCloseCallback:function(e){     //关闭回掉
	        //                        if(e === 1){    //替换
	        //                            getExtensionByFrame( id ,1 )
	        //                        }else if(e === 0){
	        //                            // 添加不替换
	        //                            getExtensionByFrame( id ,0 )
	        //                        }
	        //                    }
	        //                });
	        //        }
	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                $scope.vm.isEditIndex = index;
	                $scope.vm.newTitle = data.knowledgeContent;
	                $scope.vm.channelIdList = data.channelIdList;
	                $scope.vm.dimensionArr = data.dimensionIdList;
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
	            }
	            openContentConfirm(function () {
	                saveAddNew(index);
	            });
	        }
	        // 主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeTitle": $scope.vm.title,
	                "knowledgeType": 101,
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": "", //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin, //知识来源
	                "knowledgeContents": $scope.vm.scanContent, // 知识内容
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame), // 扩展问
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot // bot
	            };
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!$scope.vm.limitSave) {
	                //layer.msg()
	            }
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams(); // 保存參數
	                    KnowledgeService[api].save(params, function (data) {
	                        if (data.status == 200) {
	                            if ($scope.vm.docmentation) {
	                                knowledgeClassifyCall();
	                            } else {
	                                $state.go('knowledgeManagement.custOverview');
	                            }
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.$apply(function () {
	                                $scope.vm.limitSave = false;
	                            });
	                        }
	                    }, function (error) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.singleAddConcept";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/conceptKnowledge/editKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/conceptKnowledge/addConceptKnowledge";
	                }
	                obj.params = params;
	                obj.knowledgeType = 101;
	                $window.knowledgeScan = obj;
	                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        /* *********************              弹框相关           **************************/ //
	        function saveAddNew(cur) {
	            $scope.vm.scanContent[cur] = {
	                knowledgeContent: $scope.vm.newTitle,
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr,
	                knowledgeRelatedQuestionOn: $scope.vm.question,
	                knowledgeBeRelatedOn: $scope.vm.tip,
	                knowledgeCommonOn: $scope.vm.tail,
	                knowledgeRelevantContentList: $scope.vm.knowledgeRelevantContentList
	            };
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            console.log(params);
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents.length) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("分类知识Bot不能为空");
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck() {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!$scope.vm.dimensionArr.length) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            }
	            if (!$scope.vm.newTitle && !$scope.vm.channelIdList.length) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if (!$scope.vm.newTitle) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!$scope.vm.channelIdList.length) {
	                layer.msg("请选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                ngDialog.closeAll(1);
	            }
	        }
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }
	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/3/28.
	 * @Module : 客服场景 概念单单条知识编辑
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('ConceptEditController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "concept",
	            apiQueryRelatedQuestion: "queryConceptRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_concept_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "", //标题
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            creatSelectBot: [], //手选生成 bot
	            botFullPath: null,
	            frameCategoryId: "",
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            newTitle: "", //标题
	            channelIdList: [], //新添加的渠道
	            dimensionArr: [], //選擇的維度
	            question: 1, //显示相关问题
	            tip: 1, //相关提示
	            tail: 1, //小尾巴
	            knowledgeRelevantContentList: [], // 相关知识

	            enterEvent: enterEvent,
	            limitSave: false,
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引


	            //引导页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	        };
	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.scanContent.push({
	                    knowledgeContent: item.knowledgeContent, //渠道
	                    channelIdList: item.channelIdList,
	                    dimensionIdList: item.dimensionIdList, // 维度
	                    knowledgeRelatedQuestionOn: item.knowledgeRelatedQuestionOn, //显示相关问
	                    knowledgeBeRelatedOn: item.knowledgeBeRelatedOn, //在提示
	                    knowledgeCommonOn: item.knowledgeCommonOn, //弹出评价小尾巴
	                    knowledgeRelevantContentList: item.knowledgeRelevantContentList == null ? [] : item.knowledgeRelevantContentList //业务扩展问
	                });
	            });
	            //    文檔加工添加知識
	        } else if ($stateParams.data && angular.fromJson($stateParams.data).docmentation) {
	            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
	            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
	            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
	            $scope.vm.knowledgeOrigin = 122;
	            $timeout(function () {
	                openContentConfirm(function () {
	                    saveAddNew(0);
	                });
	            }, 0);
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var extensionQuestionList = [],
	                    //    frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        // 知识文档分类回调
	        function knowledgeClassifyCall() {
	            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify", {
	                knowledgeId: $scope.vm.docmentation.knowledgeId,
	                knowledgeStatus: 3
	            }, function (data) {
	                if (data && data.status == 200) {
	                    $state.go("back.doc_results_view", {
	                        knowDocId: $scope.vm.docmentation.documentationId,
	                        knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
	                        knowDocUserName: $scope.vm.docmentation.knowDocUserName
	                    });
	                }
	            });
	        }
	        //打开知识内容对话框
	        function openContentConfirm(callback, elseCall) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/public_html/knowledge_increase.html", "650px", function () {
	                callback();
	            }, "", function () {
	                $scope.$parent.knowCtr.setKnowParamHasDialog($scope);
	            });
	        }
	        //        function replace(id){
	        //                var replace = ngDialog.openConfirm({
	        //                    template:"/static/knowledgeManagement/faq/replace.html",
	        //                    scope: $scope,
	        //                    closeByDocument:false,
	        //                    closeByEscape: true,
	        //                    showClose : true,
	        //                    backdrop : 'static',
	        //                    preCloseCallback:function(e){     //关闭回掉
	        //                        if(e === 1){    //替换
	        //                            getExtensionByFrame( id ,1 )
	        //                        }else if(e === 0){
	        //                            // 添加不替换
	        //                            getExtensionByFrame( id ,0 )
	        //                        }
	        //                    }
	        //                });
	        //        }
	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                $scope.vm.isEditIndex = index;
	                $scope.vm.newTitle = data.knowledgeContent;
	                $scope.vm.channelIdList = data.channelIdList;
	                $scope.vm.dimensionArr = data.dimensionIdList;
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
	            }
	            openContentConfirm(function () {
	                saveAddNew(index);
	            });
	        }
	        // 主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeTitle": $scope.vm.title,
	                "knowledgeType": 101,
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": "", //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin, //知识来源
	                "knowledgeContents": $scope.vm.scanContent, // 知识内容
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame), // 扩展问
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot // bot
	            };
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!$scope.vm.limitSave) {
	                //layer.msg()
	            }
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams(); // 保存參數
	                    KnowledgeService[api].save(params, function (data) {
	                        if (data.status == 200) {
	                            if ($scope.vm.docmentation) {
	                                knowledgeClassifyCall();
	                            } else {
	                                $state.go('knowledgeManagement.custOverview');
	                            }
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.$apply(function () {
	                                $scope.vm.limitSave = false;
	                            });
	                        }
	                    }, function (error) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.singleAddConcept";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/conceptKnowledge/editKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/conceptKnowledge/addConceptKnowledge";
	                }
	                obj.params = params;
	                obj.knowledgeType = 101;
	                $window.knowledgeScan = obj;
	                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        /* *********************              弹框相关           **************************/ //
	        function saveAddNew(cur) {
	            $scope.vm.scanContent[cur] = {
	                knowledgeContent: $scope.vm.newTitle,
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr,
	                knowledgeRelatedQuestionOn: $scope.vm.question,
	                knowledgeBeRelatedOn: $scope.vm.tip,
	                knowledgeCommonOn: $scope.vm.tail,
	                knowledgeRelevantContentList: $scope.vm.knowledgeRelevantContentList
	            };
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            console.log(params);
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents.length) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("分类知识Bot不能为空");
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck() {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!$scope.vm.dimensionArr.length) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            }
	            if (!$scope.vm.newTitle && !$scope.vm.channelIdList.length) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if (!$scope.vm.newTitle) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!$scope.vm.channelIdList.length) {
	                layer.msg("请选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                ngDialog.closeAll(1);
	            }
	        }
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }
	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  faq知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('FaqNewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "FileUploader", "$stateParams", "knowledgeAddServer", "$window", "$rootScope", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, FileUploader, $stateParams, knowledgeAddServer, $window, $rootScope, $filter) {
	        console.log($stateParams);
	        $scope.vm = {
	            ctrName: "faq",
	            apiQueryRelatedQuestion: "queryFapRelatedQuestion", // 相关文api
	            localNameOfExt: "cust_faq_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "",
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            creatSelectBot: [], //点击bot类目数生成
	            botRoot: "", //根节点
	            botFullPath: null,
	            frameCategoryId: "",
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            newTitle: "", //标题
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1,
	            tip: 1,
	            tail: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,
	            limitSave: false, //限制多次打标
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引
	            //引导页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };
	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        //組裝數據   擴展問   content
	        //BOT路径设置为 选择添加                  再次增加判断重复
	        //
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            if (data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd) {
	                $scope.vm.isTimeTable = true;
	            }
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            // bot 路径 s
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;

	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            //$scope.vm.scanContent = data.knowledgeContents ;
	            angular.forEach(data.knowledgeContents, function (item) {
	                var obj = {};
	                obj.knowledgeContent = item.knowledgeContent;
	                //維度，添加預覽效果   以name id 的 形式显示
	                obj.channelIdList = item.channelIdList;
	                obj.dimensionIdList = item.dimensionIdList;

	                obj.knowledgeRelatedQuestionOn = item.knowledgeRelatedQuestionOn; //显示相关问
	                obj.knowledgeBeRelatedOn = item.knowledgeBeRelatedOn; //在提示
	                obj.knowledgeCommonOn = item.knowledgeCommonOn; //弹出评价小尾巴
	                obj.knowledgeRelevantContentList = item.knowledgeRelevantContentList; //业务扩展问
	                $scope.vm.scanContent.push(obj);
	                console.log(obj);
	            });
	            //
	        } else if ($stateParams.data && angular.fromJson($stateParams.data).docmentation) {
	            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
	            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
	            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
	            $scope.vm.knowledgeOrigin = 122;
	            $timeout(function () {
	                $scope.vm.openContentConfirm(saveAddNew(0));
	            }, 0);
	            //知识内容弹出框
	        } else if ($stateParams.knowledgeTitle) {
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }
	        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10011,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                //layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                if ($scope.vm.extensionsByFrame.length) {
	                    var frame;
	                    angular.forEach($scope.vm.frames, function (item) {
	                        if (item.frameId == val) {
	                            frame = item.frameTitle;
	                            return true;
	                        }
	                    });
	                    //console.log(frame)  ;
	                    if (frame == $scope.vm.extensionsByFrame[0].source) {
	                        return false;
	                    } else {
	                        replace(val); //  替換條件
	                    }
	                } else {
	                    // 在未生成扩展问情況
	                    getExtensionByFrame(val);
	                }
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            //console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10011,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //console.log(data);
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item) {
	                            var isLocalHasExt = addLocalExtension(item.elementContent);
	                            if (isLocalHasExt) {
	                                if (type) {
	                                    $scope.vm.extensionsByFrame.pop();
	                                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                                } else {
	                                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                                }
	                                return;
	                            }
	                            var obj = {};
	                            obj.extensionQuestionTitle = item.elementContent;
	                            obj.extensionQuestionType = 60;
	                            obj.source = data.data[0].frameTitle;
	                            if (type) {
	                                $scope.vm.extensionsByFrame.pop();
	                                $scope.vm.extensionsByFrame.push(obj);
	                            } else {
	                                //if(){
	                                //    angular.forEach($scope.vm.extensionsByFrame,function(item){
	                                //
	                                //    })
	                                //}
	                                $scope.vm.extensionsByFrame.push(obj);
	                            }
	                        });
	                        //console.log($scope.vm.extensionsByFrame)
	                    }
	                    $scope.$apply();
	                }
	            }, function () {
	                //layer.msg("err or err")
	            });
	        }
	        function replace(id) {
	            var dia = angular.element(".ngdialog");
	            if (dia.length == 0) {
	                var replace = ngDialog.openConfirm({
	                    template: "/static/knowledge_manage/faq/replace.html",
	                    scope: $scope,
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        //关闭回掉
	                        if (e === 1) {
	                            //替换
	                            getExtensionByFrame(id, 1);
	                        } else if (e === 0) {
	                            // 添加不替换
	                            getExtensionByFrame(id, 0);
	                        }
	                    }
	                });
	            }
	        }
	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                $scope.vm.isEditIndex = index;
	                $scope.vm.newTitle = data.knowledgeContent;
	                $scope.vm.channelIdList = data.channelIdList;
	                $scope.vm.dimensionArr = data.dimensionIdList;
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
	            }
	            openContentConfirm(function () {
	                saveAddNew(index);
	            });
	        }
	        //打开知识内容对话框
	        function openContentConfirm(callback) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/public_html/knowledge_increase.html", "650px", function () {
	                callback();
	            }, "", function () {
	                $scope.$parent.knowCtr.setKnowParamHasDialog($scope);
	            });
	        }
	        //  主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : null, //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : null, //结束时间
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeType": 100, //知识类型
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin,
	                "knowledgeContents": $scope.vm.scanContent, // 知识内容
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame), // 扩展问
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot // bot
	            };
	        }
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    $scope.vm.data = getParams();
	                    KnowledgeService[api].save(params, function (data) {
	                        if (data.status == 200) {
	                            if ($scope.vm.docmentation) {
	                                //文档知识分类状态回掉
	                                knowledgeClassifyCall();
	                            } else {
	                                $state.go('knowledgeManagement.custOverview');
	                            }
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        // 知识文档分类回调
	        function knowledgeClassifyCall() {
	            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify", {
	                knowledgeId: $scope.vm.docmentation.knowledgeId,
	                knowledgeStatus: 2
	            }, function (data) {
	                if (data && data.status == 200) {
	                    $state.go("back.doc_results_view", {
	                        knowDocId: $scope.vm.docmentation.documentationId,
	                        knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
	                        knowDocUserName: $scope.vm.docmentation.knowDocUserName
	                    });
	                }
	            });
	        };
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.faqAdd";
	                obj.api = "/api/ms/faqKnowledge/addFAQKnowledge";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/faqKnowledge/editFAQKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/faqKnowledge/addFAQKnowledge";
	                }
	                obj.knowledgeType = 101;
	                obj.knowledgeId = $scope.vm.knowledgeId;
	                $window.knowledgeScan = obj;
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        function saveAddNew(cur) {
	            $scope.vm.scanContent[cur] = {
	                knowledgeContent: $scope.vm.newTitle,
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr,
	                knowledgeRelatedQuestionOn: $scope.vm.question,
	                knowledgeBeRelatedOn: $scope.vm.tip,
	                knowledgeCommonOn: $scope.vm.tail,
	                knowledgeRelevantContentList: $scope.vm.knowledgeRelevantContentList
	            };
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            if ($scope.vm.titleTip != "") {
	                layer.msg($scope.vm.titleTip);
	                return false;
	            }
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents.length) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck() {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!$scope.vm.dimensionArr.length) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            }
	            if (!$scope.vm.newTitle && !$scope.vm.channelIdList.length) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if (!$scope.vm.newTitle) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!$scope.vm.channelIdList.length) {
	                layer.msg("请选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                ngDialog.closeAll(1);
	            }
	        }

	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  faq知识编辑
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('FaqEditController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "FileUploader", "$stateParams", "knowledgeAddServer", "$window", "$rootScope", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, FileUploader, $stateParams, knowledgeAddServer, $window, $rootScope, $filter) {
	        console.log($stateParams);
	        $scope.vm = {
	            ctrName: "faq",
	            apiQueryRelatedQuestion: "queryFapRelatedQuestion", // 相关文api
	            localNameOfExt: "cust_faq_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "",
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            creatSelectBot: [], //点击bot类目数生成
	            botRoot: "", //根节点
	            botFullPath: null,
	            frameCategoryId: "",
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            newTitle: "", //标题
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1,
	            tip: 1,
	            tail: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,
	            limitSave: false, //限制多次打标
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引
	            //引导页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };
	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        //組裝數據   擴展問   content
	        //BOT路径设置为 选择添加                  再次增加判断重复
	        //
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            if (data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd) {
	                $scope.vm.isTimeTable = true;
	            }
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            // bot 路径 s
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;

	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            //$scope.vm.scanContent = data.knowledgeContents ;
	            angular.forEach(data.knowledgeContents, function (item) {
	                var obj = {};
	                obj.knowledgeContent = item.knowledgeContent;
	                //維度，添加預覽效果   以name id 的 形式显示
	                obj.channelIdList = item.channelIdList;
	                obj.dimensionIdList = item.dimensionIdList;

	                obj.knowledgeRelatedQuestionOn = item.knowledgeRelatedQuestionOn; //显示相关问
	                obj.knowledgeBeRelatedOn = item.knowledgeBeRelatedOn; //在提示
	                obj.knowledgeCommonOn = item.knowledgeCommonOn; //弹出评价小尾巴
	                obj.knowledgeRelevantContentList = item.knowledgeRelevantContentList; //业务扩展问
	                $scope.vm.scanContent.push(obj);
	                console.log(obj);
	            });
	            //
	        } else if ($stateParams.data && angular.fromJson($stateParams.data).docmentation) {
	            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
	            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
	            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
	            $scope.vm.knowledgeOrigin = 122;
	            $timeout(function () {
	                $scope.vm.openContentConfirm(saveAddNew(0));
	            }, 0);
	            //知识内容弹出框
	        } else if ($stateParams.knowledgeTitle) {
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }
	        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10011,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                //layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                if ($scope.vm.extensionsByFrame.length) {
	                    var frame;
	                    angular.forEach($scope.vm.frames, function (item) {
	                        if (item.frameId == val) {
	                            frame = item.frameTitle;
	                            return true;
	                        }
	                    });
	                    //console.log(frame)  ;
	                    if (frame == $scope.vm.extensionsByFrame[0].source) {
	                        return false;
	                    } else {
	                        replace(val); //  替換條件
	                    }
	                } else {
	                    // 在未生成扩展问情況
	                    getExtensionByFrame(val);
	                }
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            //console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10011,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //console.log(data);
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item) {
	                            var isLocalHasExt = addLocalExtension(item.elementContent);
	                            if (isLocalHasExt) {
	                                if (type) {
	                                    $scope.vm.extensionsByFrame.pop();
	                                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                                } else {
	                                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                                }
	                                return;
	                            }
	                            var obj = {};
	                            obj.extensionQuestionTitle = item.elementContent;
	                            obj.extensionQuestionType = 60;
	                            obj.source = data.data[0].frameTitle;
	                            if (type) {
	                                $scope.vm.extensionsByFrame.pop();
	                                $scope.vm.extensionsByFrame.push(obj);
	                            } else {
	                                //if(){
	                                //    angular.forEach($scope.vm.extensionsByFrame,function(item){
	                                //
	                                //    })
	                                //}
	                                $scope.vm.extensionsByFrame.push(obj);
	                            }
	                        });
	                        //console.log($scope.vm.extensionsByFrame)
	                    }
	                    $scope.$apply();
	                }
	            }, function () {
	                //layer.msg("err or err")
	            });
	        }
	        function replace(id) {
	            var dia = angular.element(".ngdialog");
	            if (dia.length == 0) {
	                var replace = ngDialog.openConfirm({
	                    template: "/static/knowledge_manage/faq/replace.html",
	                    scope: $scope,
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        //关闭回掉
	                        if (e === 1) {
	                            //替换
	                            getExtensionByFrame(id, 1);
	                        } else if (e === 0) {
	                            // 添加不替换
	                            getExtensionByFrame(id, 0);
	                        }
	                    }
	                });
	            }
	        }
	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                $scope.vm.isEditIndex = index;
	                $scope.vm.newTitle = data.knowledgeContent;
	                $scope.vm.channelIdList = data.channelIdList;
	                $scope.vm.dimensionArr = data.dimensionIdList;
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
	            }
	            openContentConfirm(function () {
	                saveAddNew(index);
	            });
	        }
	        //打开知识内容对话框
	        function openContentConfirm(callback) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/public_html/knowledge_increase.html", "650px", function () {
	                callback();
	            }, "", function () {
	                $scope.$parent.knowCtr.setKnowParamHasDialog($scope);
	            });
	        }
	        //  主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : null, //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : null, //结束时间
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeType": 100, //知识类型
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin,
	                "knowledgeContents": $scope.vm.scanContent, // 知识内容
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame), // 扩展问
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot // bot
	            };
	        }
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    $scope.vm.data = getParams();
	                    KnowledgeService[api].save(params, function (data) {
	                        if (data.status == 200) {
	                            if ($scope.vm.docmentation) {
	                                //文档知识分类状态回掉
	                                knowledgeClassifyCall();
	                            } else {
	                                $state.go('knowledgeManagement.custOverview');
	                            }
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        // 知识文档分类回调
	        function knowledgeClassifyCall() {
	            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify", {
	                knowledgeId: $scope.vm.docmentation.knowledgeId,
	                knowledgeStatus: 2
	            }, function (data) {
	                if (data && data.status == 200) {
	                    $state.go("back.doc_results_view", {
	                        knowDocId: $scope.vm.docmentation.documentationId,
	                        knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
	                        knowDocUserName: $scope.vm.docmentation.knowDocUserName
	                    });
	                }
	            });
	        };
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.faqAdd";
	                obj.api = "/api/ms/faqKnowledge/addFAQKnowledge";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/faqKnowledge/editFAQKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/faqKnowledge/addFAQKnowledge";
	                }
	                obj.knowledgeType = 101;
	                obj.knowledgeId = $scope.vm.knowledgeId;
	                $window.knowledgeScan = obj;
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        function saveAddNew(cur) {
	            $scope.vm.scanContent[cur] = {
	                knowledgeContent: $scope.vm.newTitle,
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr,
	                knowledgeRelatedQuestionOn: $scope.vm.question,
	                knowledgeBeRelatedOn: $scope.vm.tip,
	                knowledgeCommonOn: $scope.vm.tail,
	                knowledgeRelevantContentList: $scope.vm.knowledgeRelevantContentList
	            };
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            if ($scope.vm.titleTip != "") {
	                layer.msg($scope.vm.titleTip);
	                return false;
	            }
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents.length) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck() {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!$scope.vm.dimensionArr.length) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            }
	            if (!$scope.vm.newTitle && !$scope.vm.channelIdList.length) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if (!$scope.vm.newTitle) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!$scope.vm.channelIdList.length) {
	                layer.msg("请选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                ngDialog.closeAll(1);
	            }
	        }

	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  列表知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('ListNewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "list",
	            apiQueryRelatedQuestion: "queryListRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_list_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id

	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            title: "", //标题
	            titleTip: "",
	            //时间
	            timeStart: "", //起始时间
	            timeEnd: "",
	            isTimeTable: false, //时间表隐藏
	            //bot
	            creatSelectBot: [], //手选生成 bot

	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            save: save, //保存
	            scan: scan, //预览
	            //高级选项
	            newTitle: "", //标题
	            knowledgeContentNegative: "",
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1,
	            tip: 1,
	            tail: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,

	            limitSave: false, //限制多次打标
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };

	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        /*
	           */
	        //組裝數據   擴展問   content
	        //BOT路径设置为 选择添加                  再次增加判断重复
	        //
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //console.log($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.newTitle = item.knowledgeContent;
	                $scope.vm.knowledgeContentNegative = item.knowledgeContentNegative;
	                $scope.vm.channelIdList = item.channelIdList;
	                $scope.vm.dimensionArr = item.dimensionIdList;
	                $scope.vm.question = item.knowledgeRelatedQuestionOn; //显示相关问
	                $scope.vm.tip = item.knowledgeBeRelatedOn; //在提示
	                $scope.vm.tail = item.knowledgeCommonOn; //弹出评价小尾巴
	                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList == null ? [] : item.knowledgeRelevantContentList; //业务扩展问
	            });
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }

	        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件gruntwatch
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });
	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var  extensionQuestionList = [] ,
	                    //     frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            });
	        }
	        //生成扩展问校验
	        function checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, oldWord) {
	            //var title = oldWord.extensionQuestionTitle ;
	            var title = extensionQuestionList[0];
	            var weight = oldWord.extensionQuestionType;
	            var isLocalHasExt = addLocalExtension(title);
	            if (isLocalHasExt) {
	                $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                return;
	            }
	            httpRequestPost("/api/ms/listKnowledge/checkFrameTag", {
	                "applicationId": APPLICATION_ID,
	                "extensionQuestionList": extensionQuestionList,
	                "frameQuestionTagList": frameQuestionTagList
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	                        var result = $scope.MASTER.isExtensionTagRepeat(data.data, allExtension, title, weight);
	                        if (result != false) {
	                            $scope.vm.extensionTitle = "";
	                            $scope.vm.extensionsByFrame.push(result);
	                        }
	                    });
	                }
	            });
	        }

	        //  主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "knowledgeType": 102,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": "", //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin,
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame),
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot,
	                "knowledgeContents": new Array({
	                    knowledgeContent: $scope.vm.newTitle,
	                    knowledgeContentNegative: $scope.vm.knowledgeContentNegative,
	                    channelIdList: $scope.vm.channelIdList,
	                    dimensionIdList: $scope.vm.dimensionArr == [] ? $scope.$parent.$parent.MASTER.dimensionListIds : $scope.vm.dimensionArr,
	                    knowledgeRelatedQuestionOn: $scope.vm.question, //显示相关问
	                    knowledgeBeRelatedOn: $scope.vm.tip, //在提示
	                    knowledgeCommonOn: $scope.vm.tail, //弹出评价小尾巴
	                    knowledgeRelevantContentList: $scope.vm.appointRelativeGroup //业务扩展问
	                })
	            };
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams();
	                    KnowledgeService[api].save(params, function (response) {
	                        if (response.status == 200) {
	                            $state.go('knowledgeManagement.custOverview');
	                        } else if (response.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                        }
	                    }, function (error) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {
	                    params: getParams(),
	                    knowledgeType: 102,
	                    knowledgeId: $scope.vm.knowledgeId,
	                    api: api
	                };
	                obj.editUrl = "knowledgeManagement.listAdd";
	                $window.knowledgeScan = obj;
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents[0].knowledgeContent || !params.knowledgeContents[0].knowledgeContentNegative) {
	                layer.msg("知识内容信息不完整，请增填写完整");
	                return false;
	            } else if (!params.knowledgeContents[0].channelIdList.length) {
	                layer.msg("渠道不能为空");
	                return false;
	            } else {
	                return true;
	            }
	        }

	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  列表知识编辑
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('ListEditController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "list",
	            apiQueryRelatedQuestion: "queryListRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_list_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id

	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            title: "", //标题
	            titleTip: "",
	            //时间
	            timeStart: "", //起始时间
	            timeEnd: "",
	            isTimeTable: false, //时间表隐藏
	            //bot
	            creatSelectBot: [], //手选生成 bot

	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            save: save, //保存
	            scan: scan, //预览
	            //高级选项
	            newTitle: "", //标题
	            knowledgeContentNegative: "",
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1,
	            tip: 1,
	            tail: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,

	            limitSave: false, //限制多次打标
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };

	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        /*
	           */
	        //組裝數據   擴展問   content
	        //BOT路径设置为 选择添加                  再次增加判断重复
	        //
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //console.log($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.newTitle = item.knowledgeContent;
	                $scope.vm.knowledgeContentNegative = item.knowledgeContentNegative;
	                $scope.vm.channelIdList = item.channelIdList;
	                $scope.vm.dimensionArr = item.dimensionIdList;
	                $scope.vm.question = item.knowledgeRelatedQuestionOn; //显示相关问
	                $scope.vm.tip = item.knowledgeBeRelatedOn; //在提示
	                $scope.vm.tail = item.knowledgeCommonOn; //弹出评价小尾巴
	                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList == null ? [] : item.knowledgeRelevantContentList; //业务扩展问
	            });
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        }

	        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件gruntwatch
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });
	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var  extensionQuestionList = [] ,
	                    //     frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            });
	        }
	        //生成扩展问校验
	        function checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, oldWord) {
	            //var title = oldWord.extensionQuestionTitle ;
	            var title = extensionQuestionList[0];
	            var weight = oldWord.extensionQuestionType;
	            var isLocalHasExt = addLocalExtension(title);
	            if (isLocalHasExt) {
	                $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                return;
	            }
	            httpRequestPost("/api/ms/listKnowledge/checkFrameTag", {
	                "applicationId": APPLICATION_ID,
	                "extensionQuestionList": extensionQuestionList,
	                "frameQuestionTagList": frameQuestionTagList
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	                        var result = $scope.MASTER.isExtensionTagRepeat(data.data, allExtension, title, weight);
	                        if (result != false) {
	                            $scope.vm.extensionTitle = "";
	                            $scope.vm.extensionsByFrame.push(result);
	                        }
	                    });
	                }
	            });
	        }

	        //  主页保存 获取参数
	        function getParams() {
	            return {
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "knowledgeType": 102,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": "", //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin,
	                "extensionQuestions": $scope.vm.extensions.concat($scope.vm.extensionsByFrame),
	                "classificationAndKnowledgeList": $scope.vm.creatSelectBot,
	                "knowledgeContents": new Array({
	                    knowledgeContent: $scope.vm.newTitle,
	                    knowledgeContentNegative: $scope.vm.knowledgeContentNegative,
	                    channelIdList: $scope.vm.channelIdList,
	                    dimensionIdList: $scope.vm.dimensionArr == [] ? $scope.$parent.$parent.MASTER.dimensionListIds : $scope.vm.dimensionArr,
	                    knowledgeRelatedQuestionOn: $scope.vm.question, //显示相关问
	                    knowledgeBeRelatedOn: $scope.vm.tip, //在提示
	                    knowledgeCommonOn: $scope.vm.tail, //弹出评价小尾巴
	                    knowledgeRelevantContentList: $scope.vm.appointRelativeGroup //业务扩展问
	                })
	            };
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams();
	                    KnowledgeService[api].save(params, function (response) {
	                        if (response.status == 200) {
	                            $state.go('knowledgeManagement.custOverview');
	                        } else if (response.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                        }
	                    }, function (error) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {
	                    params: getParams(),
	                    knowledgeType: 102,
	                    knowledgeId: $scope.vm.knowledgeId,
	                    api: api
	                };
	                obj.editUrl = "knowledgeManagement.listAdd";
	                $window.knowledgeScan = obj;
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        }
	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents[0].knowledgeContent || !params.knowledgeContents[0].knowledgeContentNegative) {
	                layer.msg("知识内容信息不完整，请增填写完整");
	                return false;
	            } else if (!params.knowledgeContents[0].channelIdList.length) {
	                layer.msg("渠道不能为空");
	                return false;
	            } else {
	                return true;
	            }
	        }

	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  要素知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('FactorEditController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$rootScope", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, knowledgeAddServer, $window, $stateParams, $interval, $rootScope, $filter) {
	        $scope.vm = {
	            ctrName: "list",
	            apiQueryRelatedQuestion: "queryFactorRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_factor_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //时间
	            timeStart: "", //起始时间
	            timeEnd: "",
	            isTimeTable: false, //时间表隐藏
	            //扩展问
	            extensions: [], //手動生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览

	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            title: "", //标题
	            titleTip: "",
	            //bot
	            creatSelectBot: [], //手选生成 bot
	            botFullPath: "",
	            //高级选项内容
	            newTitle: "", //标题
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1, //相关问题
	            tip: 1, // 提示
	            tail: 1, //尾巴
	            appointRelativeGroup: [], //相关知识


	            replaceType: 0,
	            enterEvent: enterEvent, //鍵盤事件
	            //表格
	            addList: addList, //table 添加列
	            editList: editList, //编辑表格
	            tableRow: null, //行
	            tableColumn: null, //刪除用
	            tableChange: tableChange, //編輯
	            tableRemove: tableRemove, //删除行或列
	            addRow: addRow, //添加行
	            gorithm: ['NLP'], //语义挖掘
	            tableType: "字符串", //类型
	            factorName: null, //要素名称
	            reQuestion: null, //反问

	            tableList: "",
	            listTableType: "",
	            data: "",
	            column: "",
	            tableSaveCheck: tableSaveCheck, // 添加的行列是否符合要求

	            limitSave: false, //限制多次打标
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensions = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.tableList = {
	                    data: item.knowledgeContent
	                };
	                $scope.vm.channelIdList = item.channelIdList;
	                $scope.vm.dimensionArr = item.dimensionIdList;
	                $scope.vm.question = item.knowledgeRelatedQuestionOn; //显示相关问
	                $scope.vm.tip = item.knowledgeBeRelatedOn; //在提示
	                $scope.vm.tail = item.knowledgeCommonOn; //弹出评价小尾巴
	                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList != null ? item.knowledgeRelevantContentList : []; //业务扩展问
	            });
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        } else {
	            init();
	        }
	        function init() {
	            $scope.vm.tableList = {
	                "data": { "listTable": new Array(new Array("产品名称")) }
	            };
	            $scope.vm.listTableType = [];
	            var newType = {};
	            newType.elementName = "产品名称";
	            newType.elementType = "字符串";
	            newType.technology = null;
	            newType.elementAsk = "";
	            newType.relatedQuestions = null;
	            $scope.vm.listTableType.push(newType);
	            $scope.vm.tableList.data.listTableType = $scope.vm.listTableType;
	        }
	        function tableChange(row, col, val) {
	            $scope.vm.tableList.data.listTable[row][col] = val;
	        }
	        function tableRemove(type) {
	            switch (type) {
	                case 1:
	                    if ($scope.vm.tableRow == 0) {
	                        layer.msg("不可删除第一行");
	                    } else if ($scope.vm.tableRow == null) {
	                        layer.msg("请先选择要删除的行");
	                    } else {
	                        $scope.vm.tableList.data.listTable.splice($scope.vm.tableRow, 1);
	                        $scope.vm.tableRow = null;
	                    }
	                    break;
	                case 2:
	                    if ($scope.vm.tableColumn == 0) {
	                        layer.msg("不可删除第一列");
	                    } else if ($scope.vm.tableRow == null) {
	                        layer.msg("请先选择要删除的列");
	                    } else {
	                        angular.forEach($scope.vm.tableList.data.listTable, function (item, tableRow) {
	                            angular.forEach(item, function (val, index) {
	                                if (index == $scope.vm.tableColumn) {
	                                    $scope.vm.tableList.data.listTable[tableRow].splice(index, 1);
	                                }
	                            });
	                        });
	                        $scope.vm.tableList.data.listTableType.splice($scope.vm.tableColumn, 1);
	                        $scope.vm.tableColumn = null;
	                    }
	                    break;
	            }
	        }
	        function addRow() {
	            var len = $scope.vm.tableList.data.listTable[0].length;
	            var arr = new Array(len);
	            $scope.vm.tableList.data.listTable.push(arr);
	        }
	        //检验是否合理保存 ==> 检查要素名称以及反问
	        function tableSaveCheck(close) {
	            if (!$scope.vm.factorName) {
	                layer.msg("请填写要素名称后保存");
	            } else if (!$scope.vm.elementAsk) {
	                layer.msg("请填写反问后保存");
	            } else {
	                close(1);
	            }
	        }
	        function addList(row, column, data) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/factor/column.html", "695px", function () {
	                angular.forEach($scope.vm.tableList.data.listTable, function (item, index) {
	                    if (index == 0) {
	                        $scope.vm.tableList.data.listTable[index].push($scope.vm.factorName);
	                    } else {
	                        $scope.vm.tableList.data.listTable[index].push(null);
	                    }
	                });
	                var newType = {
	                    "elementName": $scope.vm.factorName,
	                    "elementType": $scope.vm.tableType,
	                    "technology": $scope.vm.gorithm,
	                    "elementAsk": $scope.vm.elementAsk,
	                    "relatedQuestions": null
	                };
	                $scope.vm.tableList.data.listTableType.push(newType);
	            }, "", function () {
	                setDialogNew();
	            });
	        }

	        function editList(row, column) {
	            $scope.vm.factorName = $scope.vm.tableList.data.listTableType[column].elementName;
	            $scope.vm.tableType = $scope.vm.tableList.data.listTableType[column].elementType;
	            $scope.vm.gorithm = $scope.vm.tableList.data.listTableType[column].technology;
	            $scope.vm.elementAsk = $scope.vm.tableList.data.listTableType[column].elementAsk;
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/factor/column.html", "695px", function () {
	                $scope.vm.tableList.data.listTableType[column].elementName = $scope.vm.factorName;
	                $scope.vm.tableList.data.listTableType[column].elementType = $scope.vm.tableType;
	                $scope.vm.tableList.data.listTableType[column].technology = $scope.vm.gorithm;
	                $scope.vm.tableList.data.listTableType[column].elementAsk = $scope.vm.elementAsk;
	                $scope.vm.tableList.data.listTable[0][column] = $scope.vm.factorName;
	            }, "", function () {
	                setDialogNew();
	            });
	        }
	        function getTableParams() {
	            if (!$scope.vm.tableList.data) {
	                console.log("请上传表格知识");
	                return false;
	            } else {
	                var tabelData = angular.copy($scope.vm.tableList.data);
	                var params = {};
	                var ask = [];
	                var items = [];
	                // 反问
	                angular.forEach(tabelData.listTableType, function (item, index) {
	                    if (index > 0) {
	                        var obj = {};
	                        obj.name = item.elementName;
	                        obj.value = item.elementAsk;
	                        ask.push(obj);
	                    }
	                });
	                angular.forEach(tabelData.listTable, function (item, icon) {
	                    if (icon > 0) {
	                        var row = {};
	                        row.name = item[0];
	                        row.slots = [];
	                        angular.forEach(tabelData.listTableType, function (val, cur) {
	                            if (cur > 0) {
	                                var slot = {};
	                                slot.name = val.elementName;
	                                slot.value = tabelData.listTable[icon][cur];
	                                slot.type = val.elementType;
	                                slot.algorithm = val.technology;
	                                row.slots.push(slot);
	                            }
	                        });
	                        items.push(row);
	                    }
	                });
	                params.asks = ask;
	                params.items = items;
	                return JSON.stringify(params);
	            }
	        }
	        function setDialogNew() {
	            $scope.vm.factorName = null;
	            $scope.vm.tableType = "字符串";
	            $scope.vm.gorithm = ['NLP'];
	            $scope.vm.elementAsk = null;
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10013,
	                "index": 0,
	                "pageSize": 32767
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                console.log("err or err");
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });

	        //replace()
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensions.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getTableListByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getTableListByFrame(id, type) {
	            //console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10013,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 32767
	            }, function (data) {
	                if (data.status == 10000) {
	                    if (data.data[0].elements) {
	                        $.each(data.data[0].elements, function (index, value) {
	                            console.log("====" + value.elementContent);
	                            var addFlag = true;
	                            for (var i = 0; i < $scope.vm.tableList.data.listTable[0].length; i++) {
	                                console.log("===" + $scope.vm.tableList.data.listTable[0][i]);
	                                if ($scope.vm.tableList.data.listTable[0][i] == value.elementContent) {
	                                    addFlag = false;
	                                }
	                            }
	                            if (addFlag == true) {
	                                $scope.vm.tableList.data.listTable[0].push(value.elementContent);
	                                var newType = {};
	                                newType.elementName = value.elementContent;
	                                newType.elementType = switchContentType(value.elementTypeId);
	                                var miningTypeArr = [];
	                                miningTypeArr.push(switchMiningType(value.elementMiningTypeId));
	                                newType.technology = miningTypeArr;
	                                newType.elementAsk = value.elementAskContent;
	                                newType.relatedQuestions = value.elementRelateConcept;
	                                $scope.vm.tableList.data.listTableType.push(newType);
	                                $scope.$apply();
	                            }
	                        });
	                    }
	                }
	            }, function () {
	                console.log("获取表格失败");
	            });
	        }

	        function switchMiningType(type) {
	            var returnStr = "NLP";
	            //var returnStr = "OEC";                   //nnf-6.21修改
	            // switch(type){
	            //     case 10017:
	            //         returnStr = "OEC";
	            //         break;
	            //     case 10018:
	            //         returnStr = "GATE";
	            //         break;
	            // }
	            return returnStr;
	        }

	        function switchContentType(type) {
	            var returnStr = "字符串";
	            switch (type) {
	                case 10014:
	                    returnStr = "字符串";
	                    break;
	                case 10015:
	                    returnStr = "日期";
	                    break;
	                case 10016:
	                    returnStr = "范围";
	                    break;
	            }
	            return returnStr;
	        }

	        ////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
	        function replace(id) {
	            var replace = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/faq/replace.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        //替换
	                        getTableListByFrame(id, 1);
	                    } else if (e === 0) {
	                        // 添加不替换
	                        getTableListByFrame(id, 0);
	                    }
	                }
	            });
	        }

	        //  主页保存 获取参数
	        function getParams() {
	            console.log(getTableParams());
	            var params = {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeType": 103,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : null, //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : null, //结束时间
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin
	            };
	            var obj = {
	                knowledgeContent: getTableParams(),
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr.length ? $scope.vm.dimensionArr : $scope.vm.dimensionsCopy.id,
	                knowledgeRelatedQuestionOn: $scope.vm.question, //显示相关问
	                knowledgeBeRelatedOn: $scope.vm.tip, //在提示
	                knowledgeCommonOn: $scope.vm.tail, //弹出评价小尾巴
	                knowledgeRelevantContentList: $scope.vm.appointRelativeGroup //业务扩展问
	            };
	            params.knowledgeContents = new Array(obj);
	            params.extensionQuestions = $scope.vm.extensions;
	            params.classificationAndKnowledgeList = $scope.vm.creatSelectBot;
	            return params;
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    KnowledgeService[api].save(getParams(), function (data) {
	                        if (data.status == 200) {
	                            $state.go('knowledgeManagement.custOverview');
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                            console.log($scope.vm.limitSave);
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                $window.knowledgeScan = {
	                    api: api,
	                    params: getParams(),
	                    editUrl: "knowledgeManagement.factorAdd",
	                    knowledgeType: 103
	                };
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        }
	        //        提交 检验参数
	        function checkSave() {
	            console.log(getParams());
	            var params = getParams();
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents[0].channelIdList.length) {
	                layer.msg("渠道不能为空");
	                return false;
	            } else if ($scope.vm.tableList.data.listTable[0].length <= 1 || $scope.vm.tableList.data.listTable.length <= 1) {
	                layer.msg("请完善表格知识");
	                return false;
	            } else {
	                return true;
	            }
	        }
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  要素知识编辑
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('FactorNewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$rootScope", "$filter", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, knowledgeAddServer, $window, $stateParams, $interval, $rootScope, $filter) {
	        $scope.vm = {
	            ctrName: "list",
	            apiQueryRelatedQuestion: "queryFactorRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_factor_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //时间
	            timeStart: "", //起始时间
	            timeEnd: "",
	            isTimeTable: false, //时间表隐藏
	            //扩展问
	            extensions: [], //手動生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览

	            frames: [], //业务框架
	            frameId: "",
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            title: "", //标题
	            titleTip: "",
	            //bot
	            creatSelectBot: [], //手选生成 bot
	            botFullPath: "",
	            //高级选项内容
	            newTitle: "", //标题
	            channelIdList: [], //新添加的 channel
	            dimensionArr: [], //選擇的維度
	            question: 1, //相关问题
	            tip: 1, // 提示
	            tail: 1, //尾巴
	            appointRelativeGroup: [], //相关知识


	            replaceType: 0,
	            enterEvent: enterEvent, //鍵盤事件
	            //表格
	            addList: addList, //table 添加列
	            editList: editList, //编辑表格
	            tableRow: null, //行
	            tableColumn: null, //刪除用
	            tableChange: tableChange, //編輯
	            tableRemove: tableRemove, //删除行或列
	            addRow: addRow, //添加行
	            gorithm: ['NLP'], //语义挖掘
	            tableType: "字符串", //类型
	            factorName: null, //要素名称
	            reQuestion: null, //反问

	            tableList: "",
	            listTableType: "",
	            data: "",
	            column: "",
	            tableSaveCheck: tableSaveCheck, // 添加的行列是否符合要求

	            limitSave: false, //限制多次打标
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };
	        //标题
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;
	            //扩展问
	            $scope.vm.extensions = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item) {
	                $scope.vm.tableList = {
	                    data: item.knowledgeContent
	                };
	                $scope.vm.channelIdList = item.channelIdList;
	                $scope.vm.dimensionArr = item.dimensionIdList;
	                $scope.vm.question = item.knowledgeRelatedQuestionOn; //显示相关问
	                $scope.vm.tip = item.knowledgeBeRelatedOn; //在提示
	                $scope.vm.tail = item.knowledgeCommonOn; //弹出评价小尾巴
	                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList != null ? item.knowledgeRelevantContentList : []; //业务扩展问
	            });
	        } else if ($stateParams.knowledgeTitle) {
	            console.log("======" + $stateParams.knowledgeTitle);
	            $scope.vm.title = $stateParams.knowledgeTitle;
	        } else {
	            init();
	        }
	        function init() {
	            $scope.vm.tableList = {
	                "data": { "listTable": new Array(new Array("产品名称")) }
	            };
	            $scope.vm.listTableType = [];
	            var newType = {};
	            newType.elementName = "产品名称";
	            newType.elementType = "字符串";
	            newType.technology = null;
	            newType.elementAsk = "";
	            newType.relatedQuestions = null;
	            $scope.vm.listTableType.push(newType);
	            $scope.vm.tableList.data.listTableType = $scope.vm.listTableType;
	        }
	        function tableChange(row, col, val) {
	            $scope.vm.tableList.data.listTable[row][col] = val;
	        }
	        function tableRemove(type) {
	            switch (type) {
	                case 1:
	                    if ($scope.vm.tableRow == 0) {
	                        layer.msg("不可删除第一行");
	                    } else if ($scope.vm.tableRow == null) {
	                        layer.msg("请先选择要删除的行");
	                    } else {
	                        $scope.vm.tableList.data.listTable.splice($scope.vm.tableRow, 1);
	                        $scope.vm.tableRow = null;
	                    }
	                    break;
	                case 2:
	                    if ($scope.vm.tableColumn == 0) {
	                        layer.msg("不可删除第一列");
	                    } else if ($scope.vm.tableRow == null) {
	                        layer.msg("请先选择要删除的列");
	                    } else {
	                        angular.forEach($scope.vm.tableList.data.listTable, function (item, tableRow) {
	                            angular.forEach(item, function (val, index) {
	                                if (index == $scope.vm.tableColumn) {
	                                    $scope.vm.tableList.data.listTable[tableRow].splice(index, 1);
	                                }
	                            });
	                        });
	                        $scope.vm.tableList.data.listTableType.splice($scope.vm.tableColumn, 1);
	                        $scope.vm.tableColumn = null;
	                    }
	                    break;
	            }
	        }
	        function addRow() {
	            var len = $scope.vm.tableList.data.listTable[0].length;
	            var arr = new Array(len);
	            $scope.vm.tableList.data.listTable.push(arr);
	        }
	        //检验是否合理保存 ==> 检查要素名称以及反问
	        function tableSaveCheck(close) {
	            if (!$scope.vm.factorName) {
	                layer.msg("请填写要素名称后保存");
	            } else if (!$scope.vm.elementAsk) {
	                layer.msg("请填写反问后保存");
	            } else {
	                close(1);
	            }
	        }
	        function addList(row, column, data) {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/factor/column.html", "695px", function () {
	                angular.forEach($scope.vm.tableList.data.listTable, function (item, index) {
	                    if (index == 0) {
	                        $scope.vm.tableList.data.listTable[index].push($scope.vm.factorName);
	                    } else {
	                        $scope.vm.tableList.data.listTable[index].push(null);
	                    }
	                });
	                var newType = {
	                    "elementName": $scope.vm.factorName,
	                    "elementType": $scope.vm.tableType,
	                    "technology": $scope.vm.gorithm,
	                    "elementAsk": $scope.vm.elementAsk,
	                    "relatedQuestions": null
	                };
	                $scope.vm.tableList.data.listTableType.push(newType);
	            }, "", function () {
	                setDialogNew();
	            });
	        }

	        function editList(row, column) {
	            $scope.vm.factorName = $scope.vm.tableList.data.listTableType[column].elementName;
	            $scope.vm.tableType = $scope.vm.tableList.data.listTableType[column].elementType;
	            $scope.vm.gorithm = $scope.vm.tableList.data.listTableType[column].technology;
	            $scope.vm.elementAsk = $scope.vm.tableList.data.listTableType[column].elementAsk;
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/factor/column.html", "695px", function () {
	                $scope.vm.tableList.data.listTableType[column].elementName = $scope.vm.factorName;
	                $scope.vm.tableList.data.listTableType[column].elementType = $scope.vm.tableType;
	                $scope.vm.tableList.data.listTableType[column].technology = $scope.vm.gorithm;
	                $scope.vm.tableList.data.listTableType[column].elementAsk = $scope.vm.elementAsk;
	                $scope.vm.tableList.data.listTable[0][column] = $scope.vm.factorName;
	            }, "", function () {
	                setDialogNew();
	            });
	        }
	        function getTableParams() {
	            if (!$scope.vm.tableList.data) {
	                console.log("请上传表格知识");
	                return false;
	            } else {
	                var tabelData = angular.copy($scope.vm.tableList.data);
	                var params = {};
	                var ask = [];
	                var items = [];
	                // 反问
	                angular.forEach(tabelData.listTableType, function (item, index) {
	                    if (index > 0) {
	                        var obj = {};
	                        obj.name = item.elementName;
	                        obj.value = item.elementAsk;
	                        ask.push(obj);
	                    }
	                });
	                angular.forEach(tabelData.listTable, function (item, icon) {
	                    if (icon > 0) {
	                        var row = {};
	                        row.name = item[0];
	                        row.slots = [];
	                        angular.forEach(tabelData.listTableType, function (val, cur) {
	                            if (cur > 0) {
	                                var slot = {};
	                                slot.name = val.elementName;
	                                slot.value = tabelData.listTable[icon][cur];
	                                slot.type = val.elementType;
	                                slot.algorithm = val.technology;
	                                row.slots.push(slot);
	                            }
	                        });
	                        items.push(row);
	                    }
	                });
	                params.asks = ask;
	                params.items = items;
	                return JSON.stringify(params);
	            }
	        }
	        function setDialogNew() {
	            $scope.vm.factorName = null;
	            $scope.vm.tableType = "字符串";
	            $scope.vm.gorithm = ['NLP'];
	            $scope.vm.elementAsk = null;
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10013,
	                "index": 0,
	                "pageSize": 32767
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (data.data.length) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                console.log("err or err");
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });

	        //replace()
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensions.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getTableListByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getTableListByFrame(id, type) {
	            //console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10013,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 32767
	            }, function (data) {
	                if (data.status == 10000) {
	                    if (data.data[0].elements) {
	                        $.each(data.data[0].elements, function (index, value) {
	                            console.log("====" + value.elementContent);
	                            var addFlag = true;
	                            for (var i = 0; i < $scope.vm.tableList.data.listTable[0].length; i++) {
	                                console.log("===" + $scope.vm.tableList.data.listTable[0][i]);
	                                if ($scope.vm.tableList.data.listTable[0][i] == value.elementContent) {
	                                    addFlag = false;
	                                }
	                            }
	                            if (addFlag == true) {
	                                $scope.vm.tableList.data.listTable[0].push(value.elementContent);
	                                var newType = {};
	                                newType.elementName = value.elementContent;
	                                newType.elementType = switchContentType(value.elementTypeId);
	                                var miningTypeArr = [];
	                                miningTypeArr.push(switchMiningType(value.elementMiningTypeId));
	                                newType.technology = miningTypeArr;
	                                newType.elementAsk = value.elementAskContent;
	                                newType.relatedQuestions = value.elementRelateConcept;
	                                $scope.vm.tableList.data.listTableType.push(newType);
	                                $scope.$apply();
	                            }
	                        });
	                    }
	                }
	            }, function () {
	                console.log("获取表格失败");
	            });
	        }

	        function switchMiningType(type) {
	            var returnStr = "NLP";
	            //var returnStr = "OEC";                   //nnf-6.21修改
	            // switch(type){
	            //     case 10017:
	            //         returnStr = "OEC";
	            //         break;
	            //     case 10018:
	            //         returnStr = "GATE";
	            //         break;
	            // }
	            return returnStr;
	        }

	        function switchContentType(type) {
	            var returnStr = "字符串";
	            switch (type) {
	                case 10014:
	                    returnStr = "字符串";
	                    break;
	                case 10015:
	                    returnStr = "日期";
	                    break;
	                case 10016:
	                    returnStr = "范围";
	                    break;
	            }
	            return returnStr;
	        }

	        ////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
	        function replace(id) {
	            var replace = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/faq/replace.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        //替换
	                        getTableListByFrame(id, 1);
	                    } else if (e === 0) {
	                        // 添加不替换
	                        getTableListByFrame(id, 0);
	                    }
	                }
	            });
	        }

	        //  主页保存 获取参数
	        function getParams() {
	            console.log(getTableParams());
	            var params = {
	                "applicationId": APPLICATION_ID,
	                "knowledgeId": $scope.vm.knowledgeId,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeType": 103,
	                "knowledgeTitle": $scope.vm.title, //知识标题
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : null, //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : null, //结束时间
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin
	            };
	            var obj = {
	                knowledgeContent: getTableParams(),
	                channelIdList: $scope.vm.channelIdList,
	                dimensionIdList: $scope.vm.dimensionArr.length ? $scope.vm.dimensionArr : $scope.vm.dimensionsCopy.id,
	                knowledgeRelatedQuestionOn: $scope.vm.question, //显示相关问
	                knowledgeBeRelatedOn: $scope.vm.tip, //在提示
	                knowledgeCommonOn: $scope.vm.tail, //弹出评价小尾巴
	                knowledgeRelevantContentList: $scope.vm.appointRelativeGroup //业务扩展问
	            };
	            params.knowledgeContents = new Array(obj);
	            params.extensionQuestions = $scope.vm.extensions;
	            params.classificationAndKnowledgeList = $scope.vm.creatSelectBot;
	            return params;
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    KnowledgeService[api].save(getParams(), function (data) {
	                        if (data.status == 200) {
	                            $state.go('knowledgeManagement.custOverview');
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.vm.limitSave = false;
	                            console.log($scope.vm.limitSave);
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.vm.limitSave = false;
	                    });
	                }
	            }
	        }
	        function scan(api) {
	            if (!checkSave()) {
	                return false;
	            } else {
	                $window.knowledgeScan = {
	                    api: api,
	                    params: getParams(),
	                    editUrl: "knowledgeManagement.factorAdd",
	                    knowledgeType: 103
	                };
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        }
	        //        提交 检验参数
	        function checkSave() {
	            console.log(getParams());
	            var params = getParams();
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!params.classificationAndKnowledgeList.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.knowledgeContents[0].channelIdList.length) {
	                layer.msg("渠道不能为空");
	                return false;
	            } else if ($scope.vm.tableList.data.listTable[0].length <= 1 || $scope.vm.tableList.data.listTable.length <= 1) {
	                layer.msg("请完善表格知识");
	                return false;
	            } else {
	                return true;
	            }
	        }
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }

	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  要素知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('RichTextNewController', ['$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "KnowledgeService", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, $state, ngDialog, $cookieStore, $timeout, $compile, KnowledgeService, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "concept",
	            apiQueryRelatedQuestion: "queryRichTextRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_rich_text_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "", //标题
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            creatSelectBot: [], //手选生成 bot
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            textContent: "",
	            newTitle: "", //标题
	            channelIdList: [], //渠道
	            dimensionArr: [], //维度
	            question: 1,
	            tail: 1,
	            tip: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,
	            limitSave: false,
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引
	            //*******************2017/7/14 BEGIN*******************//
	            contentType: 113, //新增内容类型
	            imgPaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            voicePaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            getPicList: getPicList, //获得所有图片
	            selectMultimedia: selectMultimedia, //图片，语音，图文选择弹出框
	            imageList: [], //所有图片文件
	            addMultimedia: addMultimedia, //选择图片
	            imgSelected: "", // 已选图片
	            //getEmotion : getEmotion ,
	            voiceList: "", //所有声音文件
	            getVoiceList: getVoiceList, //获取素有声音文件
	            voiceSelected: "", //以选择声音文件
	            qqFaceText: "",
	            //*******************2017/7/14 END *******************//

	            //*******************2017/8/24 图文 BEGIN *******************//
	            imgTextPaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            imgTextList: "",
	            imgTextSelected: "",
	            //*******************2017/8/24 图文  EDN *******************//

	            //*******************2017/8/9  添加链接 BEGIN *******************//
	            addLint: addLint,
	            isNewLinkAble: isNewLinkAble,
	            newLint: "",
	            //*******************2017/8/9  添加链接  END *******************//
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };

	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //console.log($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;

	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item, index) {
	                var content = {
	                    "knowledgeContentNegative": item.knowledgeContentNegative, //类型
	                    "knowledgeContent": item.knowledgeContent, // 多媒体信息
	                    "knowledgeContentDetail": {}, // 多媒体展示信息
	                    "channelIdList": item.channelIdList,
	                    "dimensionIdList": item.dimensionIdList,
	                    "knowledgeRelatedQuestionOn": item.knowledgeRelatedQuestionOn, //显示相关问
	                    "knowledgeBeRelatedOn": item.knowledgeBeRelatedOn, //在提示
	                    "knowledgeCommonOn": item.knowledgeCommonOn, //弹出评价小尾巴
	                    "knowledgeRelevantContentList": item.knowledgeRelevantContentList //业务扩展问
	                };
	                //根据返回内容查询详细信息 以name id url 的 形式显示
	                if (item.knowledgeContentNegative == 113) {
	                    //emotion
	                    content.knowledgeContent = $filter("emotion")(item.knowledgeContent);
	                } else if (item.knowledgeContentNegative == 111) {
	                    // pic
	                    KnowledgeService.getMediaPicture.save({
	                        pictureUrl: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.pictureName;
	                    });
	                } else if (item.knowledgeContentNegative == 112) {
	                    //voice
	                    KnowledgeService.getMediaPicture.save({
	                        voiceUrl: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.voiceName;
	                    });
	                } else if (item.knowledgeContentNegative == 114) {
	                    //img-text
	                    KnowledgeService.getMediaPicture.save({
	                        graphicMessageId: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.graphicMessageTitle;
	                        content.knowledgeContentDetail.url = response.pictureUrl;
	                    });
	                }
	                $scope.vm.scanContent.push(content);
	            });
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (nullCheck(data.data)) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var extensionQuestionList = [],
	                    //    frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        //y业务框架生成扩展问校验
	        function checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, oldWord) {
	            //var title = oldWord.extensionQuestionTitle ;
	            var title = extensionQuestionList[0];
	            var weight = oldWord.extensionQuestionType;
	            var isLocalHasExt = addLocalExtension(title);
	            if (isLocalHasExt) {
	                $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                return;
	            }
	            console.log(oldWord, title);
	            httpRequestPost("/api/ms/richtextKnowledge/checkFrameTag", {
	                "applicationId": APPLICATION_ID,
	                "extensionQuestionList": extensionQuestionList,
	                "frameQuestionTagList": frameQuestionTagList
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	                        var result = $scope.MASTER.isExtensionTagRepeat(data.data, allExtension, title, weight);
	                        if (result != false) {
	                            $scope.vm.extensionTitle = "";
	                            $scope.vm.extensionsByFrame.push(result);
	                        }
	                    });
	                }
	            }, function () {});
	        }

	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                /* **************** 2017/8/2   知识内容编辑  BEGIN     **************/ //
	                switch (data.knowledgeContentNegative) {
	                    case "111":
	                        //图片
	                        $scope.vm.imgSelected = {
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContent
	                        };
	                        break;
	                    case "112":
	                        //声音
	                        $scope.vm.voiceSelected = {
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContent
	                        };
	                        break;
	                    case "113":
	                        //表情
	                        $timeout(function () {
	                            $("#emotion-container").html(data.knowledgeContent);
	                        }, 100);
	                        break;
	                    case "114":
	                        // 图文
	                        $scope.vm.imgTextSelected = {
	                            "id": data.knowledgeContent,
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContentDetail.url
	                        };
	                        break;
	                }
	                $scope.vm.contentType = data.knowledgeContentNegative; //新增内容类型
	                /* **************** 2017/8/2   知识内容编辑 END   **************/ //
	                $scope.vm.isEditIndex = index;
	                $scope.vm.channelIdList = data.channelIdList;
	                angular.forEach($scope.vm.dimensions, function (item) {
	                    if (data.dimensionIdList.inArray(item.dimensionId)) {
	                        var obj = {
	                            "dimensionId": item.dimensionId,
	                            "dimensionName": item.dimensionName
	                        };
	                        $scope.vm.dimensionArr.push(obj);
	                    }
	                });
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList;
	            }
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/content.html", "650px", function () {
	                addNewOrEditKnow(index);
	            }, function () {
	                $scope.vm.isEditIndex = -1;
	            }, setDialog);
	        }
	        //  主页保存 获取参数
	        function getParams() {
	            var params = {
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeTitle": $scope.vm.title, //
	                "knowledgeType": 106,
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": $scope.vm.knowledgeTitleTag, //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin
	            };
	            //var knowledgeContent ;
	            var content = angular.copy($scope.vm.scanContent);
	            angular.forEach(content, function (item, index) {
	                if (item.knowledgeContentNegative == 113) {
	                    var html = angular.copy(item.knowledgeContent);
	                    content[index].knowledgeContent = $filter("faceToString")(html).replace(/<div>/, "\n").replace(/<div>/g, "").replace(/<\/div>/g, '\n').replace(/<br>/g, '\n');
	                }
	            });
	            params.knowledgeContents = content;
	            params.extensionQuestions = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
	            return params;
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams(); // 保存參數
	                    var api; // 返回編輯的 url
	                    if ($scope.vm.knowledgeId) {
	                        //编辑
	                        api = "/api/ms/richtextKnowledge/editKnowledge";
	                        params.knowledgeId = $scope.vm.knowledgeId;
	                    } else {
	                        //新增
	                        api = "/api/ms/richtextKnowledge/addKnowledge";
	                    }
	                    httpRequestPost(api, params, function (data) {
	                        console.log(getParams());
	                        if (data.status == 200) {
	                            //if ($scope.vm.docmentation) {
	                            //    $scope.vm.knowledgeClassifyCall();knowledgeAdd
	                            //}else{
	                            $state.go('knowledgeManagement.custOverview');
	                            //}
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.$apply(function () {
	                                $scope.vm.limitSave = false;
	                            });
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.$apply(function () {
	                            $scope.vm.limitSave = false;
	                        });
	                        console.log(err);
	                    });
	                }
	            }
	        }
	        function scan() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.markKnow";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/richtextKnowledge/editKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/richtextKnowledge/addKnowledge";
	                }
	                obj.params = params;
	                obj.knowledgeType = 106;
	                $window.knowledgeScan = obj;
	                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        //重置参数

	        function setDialog() {
	            /* **************** 2017/8/2   重置参数  BEGIN     **************/ //
	            $scope.vm.contentType = 113; //新增内容类型
	            $scope.vm.imgSelected = ""; // 已选图片
	            $scope.vm.voiceSelected = ""; //以选择声音文件
	            $scope.vm.imgTextSelected = ""; //以选择图文
	            /* **************** 2017/8/2   重置参数 END   **************/ //
	            $scope.vm.channelIdList = [];
	            $scope.vm.question = 1; //显示相关问
	            $scope.vm.tip = 1; //在提示
	            $scope.vm.tail = 1; //弹出评价小尾巴
	            $scope.vm.appointRelativeGroup = []; //业务扩展问
	            $scope.vm.appointRelative = "";
	            $scope.vm.dimensionArr = [];
	        }

	        function addNewOrEditKnow(index) {
	            if (isNewKnowledgeTitle()) {
	                var parameter = {
	                    "knowledgeContent": "",
	                    "channelIdList": $scope.vm.channelIdList,
	                    "knowledgeContentNegative": $scope.vm.contentType.toString(),
	                    "dimensionIdList": nullCheck($scope.vm.dimensionArr) ? $scope.vm.dimensionArr : $scope.$parent.$parent.MASTER.dimensionListIds,
	                    "knowledgeRelatedQuestionOn": $scope.vm.question, //显示相关问
	                    "knowledgeBeRelatedOn": $scope.vm.tip, //在提示
	                    "knowledgeCommonOn": $scope.vm.tail, //弹出评价小尾巴
	                    "knowledgeRelevantContentList": $scope.vm.appointRelativeGroup //业务扩展问
	                };
	                if ($scope.vm.contentType == 111) {
	                    parameter.knowledgeContent = $scope.vm.imgSelected.url;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.imgSelected.name
	                    };
	                } else if ($scope.vm.contentType == 112) {
	                    parameter.knowledgeContent = $scope.vm.voiceSelected.url;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.voiceSelected.name
	                    };
	                } else if ($scope.vm.contentType == 113) {
	                    //faceToString
	                    parameter.knowledgeContent = $scope.vm.emotionText;
	                    //console.log($("#emotion-container").html()) ;
	                    //var html = $("#emotion-container").html() ;
	                    //knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
	                } else if ($scope.vm.contentType == 114) {
	                    //faceToString
	                    parameter.knowledgeContent = $scope.vm.imgTextSelected.id;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.imgTextSelected.name,
	                        "url": $scope.vm.imgTextSelected.url
	                    };
	                }
	                $scope.vm.scanContent[index] = parameter;
	            }
	        }
	        function checkSave() {
	            var params = getParams();
	            console.log(params);
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!nullCheck(params.classificationAndKnowledgeList)) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!nullCheck(params.knowledgeContents)) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else if (!nullCheck(params.classificationAndKnowledgeList)) {
	                layer.msg("分类知识Bot不能为空");
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck(close) {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!nullCheck($scope.vm.dimensionArr)) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            };
	            if (!isNewKnowledgeTitle()) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!nullCheck($scope.vm.channelIdList)) {
	                console.log($scope.vm.channelIdList);
	                layer.msg("请选择渠道后保存");
	            } else if (!isNewKnowledgeTitle() && !nullCheck($scope.vm.channelIdList)) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                close(1);
	            }
	        }
	        //*******************       2017/7/14  BEGIN    *******************//
	        //弹出选择媒体对话框
	        function selectMultimedia() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/media.html", "450px", "", "", "", 2);
	        }
	        function addMultimedia(item) {
	            // 111 图片
	            if ($scope.vm.contentType == 111) {
	                $scope.vm.imgSelected = {
	                    "url": item.pictureUrl,
	                    "id": item.pictureId,
	                    "name": item.pictureName
	                };
	                //    声音
	            } else if ($scope.vm.contentType == 112) {
	                $scope.vm.voiceSelected = {
	                    "url": item.voiceUrl,
	                    "id": item.voiceId,
	                    "name": item.voiceName
	                };
	                //    图文
	            } else if ($scope.vm.contentType == 114) {
	                console.log(item);
	                $scope.vm.imgTextSelected = {
	                    "url": item.pictureUrl,
	                    "id": item.graphicMessageId,
	                    "name": item.graphicMessageTitle
	                };
	            }
	            ngDialog.close(ngDialog.latestID);
	        }
	        getPicList(1);
	        //获取所有图片
	        function getPicList(index) {
	            httpRequestPost("/api/ms/picture/queryPicture", {
	                "index": (index - 1) * $scope.vm.imgPaginationConf.pageSize,
	                "pageSize": $scope.vm.imgPaginationConf.pageSize,
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        $scope.vm.imageList = data.data.objs;
	                        $scope.vm.imgPaginationConf.currentPage = index;
	                        $scope.vm.imgPaginationConf.totalItems = data.data.total;
	                    });
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	        getVoiceList(1);
	        function getVoiceList(index) {
	            httpRequestPost("/api/ms/voiceManage/queryVioce ", {
	                "index": (index - 1) * $scope.vm.voicePaginationConf.pageSize,
	                "pageSize": $scope.vm.voicePaginationConf.pageSize,
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        $scope.vm.voiceList = data.data.objs;
	                        $scope.vm.voicePaginationConf.currentPage = index;
	                        $scope.vm.voicePaginationConf.totalItems = data.data.total;
	                        console.log($scope.vm.voicePaginationConf);
	                    });
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	        var picTimer;
	        $scope.$watch('vm.imgPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (picTimer) {
	                    $timeout.cancel(picTimer);
	                }
	                picTimer = $timeout(function () {
	                    getPicList(current);
	                }, 100);
	            }
	        }, true);
	        var voiceTimer;
	        $scope.$watch('vm.voicePaginationConf.currentPage', function (current) {
	            if (current) {
	                if (voiceTimer) {
	                    $timeout.cancel(voiceTimer);
	                }
	                voiceTimer = $timeout(function () {
	                    getVoiceList(current);
	                }, 100);
	            }
	        }, true);
	        function isNewKnowledgeTitle() {
	            var info = "",
	                isPass = false;
	            if (!($scope.vm.contentType == 111 && !$scope.vm.imgSelected.url || $scope.vm.contentType == 112 && !$scope.vm.voiceSelected.name || $scope.vm.contentType == 113 && !$("#emotion-container").html() || $scope.vm.contentType == 114 && !$scope.vm.imgTextSelected.id)) {
	                isPass = true;
	            }
	            return isPass;
	        }
	        //*******************2017/8/9  添加链接 BEGIN *******************//
	        function addLint() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/link.html", "450px", function () {
	                var aLink = "<a href='" + $scope.vm.newLink + "' target='_blank' style=' color: -webkit-link;cursor: auto;text-decoration: underline;'>" + $scope.vm.newLink + "</a>";
	                var html = $("#emotion-container").html() + aLink;

	                $("#emotion-container").html(html);
	                console.log($scope.vm.newLink);
	            }, "", function () {
	                $scope.vm.newLink = "";
	            }, 2);
	        }
	        function isNewLinkAble(val) {
	            var regex = /[^http(s)?:\/\/]?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
	            if (regex.test(val)) {
	                ngDialog.close(ngDialog.latestID, 1);
	            } else {
	                layer.msg("请输入正确的链接地址");
	            }
	        }
	        //*******************2017/8/9  添加链接  END *******************//

	        //*******************2017/8/24 @图文 根据图文id获取图片url @根据图片获取name  BEGIN  *******************//
	        queryImgText(1);
	        //查询
	        function queryImgText(index) {
	            httpRequestPost("/api/ms/graphicMessage/queryGraphicMessage", {
	                applicationId: APPLICATION_ID,
	                index: (index - 1) * $scope.vm.imgTextPaginationConf.pageSize,
	                pageSize: $scope.vm.imgTextPaginationConf.pageSize
	            }, function (data) {
	                if (data.status == 500) {
	                    layer.msg("请求失败", { time: 1000 });
	                } else if (data.status == 200) {
	                    console.log(data);
	                    $scope.$apply(function () {
	                        $scope.vm.imgTextList = data.data.objs;
	                        $scope.vm.imgTextPaginationConf.totalItems = data.data.total;
	                        $scope.vm.imgTextPaginationConf.numberOfPages = data.data.total / $scope.vm.imgTextPaginationConf.pageSize;
	                    });
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //分页定时器
	        var timeoutImgText;
	        $scope.$watch('vm.imgTextPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeoutImgText) {
	                    $timeout.cancel(timeoutImgText);
	                }
	                timeoutImgText = $timeout(function () {
	                    queryImgText(current);
	                }, 0);
	            }
	        }, true);
	        //*******************2017/8/24 图文 END  *******************//
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }
	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  富文本知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('RichTextEditController', ['$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "KnowledgeService", "knowledgeAddServer", "$window", "$stateParams", "$interval", "$filter", function ($scope, localStorageService, $state, ngDialog, $cookieStore, $timeout, $compile, KnowledgeService, knowledgeAddServer, $window, $stateParams, $interval, $filter) {
	        $scope.vm = {
	            ctrName: "concept",
	            apiQueryRelatedQuestion: "queryRichTextRelatedQuestion", // 相关问 api
	            localNameOfExt: "cust_rich_text_ext", // 本地存储字段 用于编辑扩展问二次添加
	            knowledgeOrigin: 120, //知识来源
	            knowledgeId: "", // 知识编辑 id
	            //标题
	            title: "", //标题
	            titleTip: "",
	            //时间
	            isTimeTable: false, //时间表隐藏
	            timeStart: "", //起始时间
	            timeEnd: "",
	            //bot
	            frames: [], //业务框架
	            frameId: "",
	            knowledgeAdd: knowledgeAdd, //新增点击事件
	            botRoot: "", //根节点
	            frameCategoryId: "",
	            creatSelectBot: [], //手选生成 bot
	            //扩展问
	            extensions: [], //手動生成
	            extensionsByFrame: [], //業務框架生成
	            //展示内容
	            scanContent: [],
	            save: save, //保存
	            scan: scan, //预览
	            increaseCheck: increaseCheck, //知识新增弹框保存按钮
	            //D 知识内容配置
	            textContent: "",
	            newTitle: "", //标题
	            channelIdList: [], //渠道
	            dimensionArr: [], //维度
	            question: 1,
	            tail: 1,
	            tip: 1,
	            appointRelativeGroup: [],

	            replaceType: 0,
	            enterEvent: enterEvent,
	            limitSave: false,
	            isEditIndex: -1, // 知识内容 弹框
	            // -1 为内容新增
	            // index 为知识的编辑索引
	            //*******************2017/7/14 BEGIN*******************//
	            contentType: 113, //新增内容类型
	            imgPaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            voicePaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            getPicList: getPicList, //获得所有图片
	            selectMultimedia: selectMultimedia, //图片，语音，图文选择弹出框
	            imageList: [], //所有图片文件
	            addMultimedia: addMultimedia, //选择图片
	            imgSelected: "", // 已选图片
	            //getEmotion : getEmotion ,
	            voiceList: "", //所有声音文件
	            getVoiceList: getVoiceList, //获取素有声音文件
	            voiceSelected: "", //以选择声音文件
	            qqFaceText: "",
	            //*******************2017/7/14 END *******************//

	            //*******************2017/8/24 图文 BEGIN *******************//
	            imgTextPaginationConf: {
	                pageSize: 8, //第页条目数
	                pagesLength: 10 //分页框数量
	            },
	            imgTextList: "",
	            imgTextSelected: "",
	            //*******************2017/8/24 图文  EDN *******************//

	            //*******************2017/8/9  添加链接 BEGIN *******************//
	            addLint: addLint,
	            isNewLinkAble: isNewLinkAble,
	            newLint: "",
	            //*******************2017/8/9  添加链接  END *******************//
	            //引到页
	            showTip: showTip,
	            hideTip: hideTip,
	            prevDiv: prevDiv,
	            nextDiv: nextDiv
	            //引到页end
	        };

	        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
	        if ($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase) {
	            var data = angular.fromJson($stateParams.data);
	            //console.log($stateParams.data);
	            //标题
	            $scope.vm.title = data.knowledgeBase.knowledgeTitle;
	            //knowledgeId
	            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId;
	            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin;

	            // 时间
	            $scope.vm.isTimeTable = data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd;
	            $scope.vm.timeStart = $filter("date")(data.knowledgeBase.knowledgeExpDateStart, "yyyy-MM-dd");
	            $scope.vm.timeEnd = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd, "yyyy-MM-dd");
	            //bot路径
	            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList;
	            //扩展问
	            $scope.vm.extensionsByFrame = data.extensionQuestions;
	            //内容
	            angular.forEach(data.knowledgeContents, function (item, index) {
	                var content = {
	                    "knowledgeContentNegative": item.knowledgeContentNegative, //类型
	                    "knowledgeContent": item.knowledgeContent, // 多媒体信息
	                    "knowledgeContentDetail": {}, // 多媒体展示信息
	                    "channelIdList": item.channelIdList,
	                    "dimensionIdList": item.dimensionIdList,
	                    "knowledgeRelatedQuestionOn": item.knowledgeRelatedQuestionOn, //显示相关问
	                    "knowledgeBeRelatedOn": item.knowledgeBeRelatedOn, //在提示
	                    "knowledgeCommonOn": item.knowledgeCommonOn, //弹出评价小尾巴
	                    "knowledgeRelevantContentList": item.knowledgeRelevantContentList //业务扩展问
	                };
	                //根据返回内容查询详细信息 以name id url 的 形式显示
	                if (item.knowledgeContentNegative == 113) {
	                    //emotion
	                    content.knowledgeContent = $filter("emotion")(item.knowledgeContent);
	                } else if (item.knowledgeContentNegative == 111) {
	                    // pic
	                    KnowledgeService.getMediaPicture.save({
	                        pictureUrl: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.pictureName;
	                    });
	                } else if (item.knowledgeContentNegative == 112) {
	                    //voice
	                    KnowledgeService.getMediaPicture.save({
	                        voiceUrl: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.voiceName;
	                    });
	                } else if (item.knowledgeContentNegative == 114) {
	                    //img-text
	                    KnowledgeService.getMediaPicture.save({
	                        graphicMessageId: item.knowledgeContent
	                    }, function (response) {
	                        content.knowledgeContentDetail.name = response.graphicMessageTitle;
	                        content.knowledgeContentDetail.url = response.pictureUrl;
	                    });
	                }
	                $scope.vm.scanContent.push(content);
	            });
	        }
	        // 通过类目id 获取框架
	        function getFrame(id) {
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameCategoryId": id,
	                "frameEnableStatusId": 1,
	                "frameTypeId": 10012,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                //console.log(data);
	                if (data.status != 10005) {
	                    if (nullCheck(data.data)) {
	                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
	                        $scope.$apply();
	                    }
	                }
	            }, function () {
	                // layer.msg("err or err")
	            });
	        }
	        $scope.$watch("vm.frameCategoryId", function (val, old) {
	            if (val && val != old) {
	                getFrame(val);
	            }
	        });
	        //  根據框架添加擴展問  --》 替換原來的條件
	        $scope.$watch("vm.frameId", function (val, old) {
	            if (val && val != old) {
	                //if($scope.vm.extensionsByFrame.length){
	                //    //  替換條件
	                //    replace(val);
	                //}else{
	                // 在未生成扩展问情況
	                getExtensionByFrame(val);
	                //}
	            }
	        });

	        // 通过frame 获取扩展问
	        function getExtensionByFrame(id, type) {
	            console.log(id);
	            httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                "frameTypeId": 10012,
	                "frameId": id,
	                "index": 0,
	                "pageSize": 999999
	            }, function (data) {
	                if (data.status == 10000) {
	                    //var extensionQuestionList = [],
	                    //    frameQuestionTagList = [];
	                    var obj = {};
	                    if (data.data[0].elements) {
	                        angular.forEach(data.data[0].elements, function (item, index) {
	                            var extensionQuestionList = [],
	                                frameQuestionTagList = [];
	                            obj = {
	                                "extensionQuestionType": 60, //61
	                                "extensionQuestionTitle": data.data[0].frameTitle
	                            };
	                            extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                            checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                        });
	                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
	                    }
	                    $scope.$apply();
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        //y业务框架生成扩展问校验
	        function checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, oldWord) {
	            //var title = oldWord.extensionQuestionTitle ;
	            var title = extensionQuestionList[0];
	            var weight = oldWord.extensionQuestionType;
	            var isLocalHasExt = addLocalExtension(title);
	            if (isLocalHasExt) {
	                $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                return;
	            }
	            console.log(oldWord, title);
	            httpRequestPost("/api/ms/richtextKnowledge/checkFrameTag", {
	                "applicationId": APPLICATION_ID,
	                "extensionQuestionList": extensionQuestionList,
	                "frameQuestionTagList": frameQuestionTagList
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	                        var result = $scope.MASTER.isExtensionTagRepeat(data.data, allExtension, title, weight);
	                        if (result != false) {
	                            $scope.vm.extensionTitle = "";
	                            $scope.vm.extensionsByFrame.push(result);
	                        }
	                    });
	                }
	            }, function () {});
	        }

	        function knowledgeAdd(data, index) {
	            if (data) {
	                //增加
	                /* **************** 2017/8/2   知识内容编辑  BEGIN     **************/ //
	                switch (data.knowledgeContentNegative) {
	                    case "111":
	                        //图片
	                        $scope.vm.imgSelected = {
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContent
	                        };
	                        break;
	                    case "112":
	                        //声音
	                        $scope.vm.voiceSelected = {
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContent
	                        };
	                        break;
	                    case "113":
	                        //表情
	                        $timeout(function () {
	                            $("#emotion-container").html(data.knowledgeContent);
	                        }, 100);
	                        break;
	                    case "114":
	                        // 图文
	                        $scope.vm.imgTextSelected = {
	                            "id": data.knowledgeContent,
	                            "name": data.knowledgeContentDetail.name,
	                            "url": data.knowledgeContentDetail.url
	                        };
	                        break;
	                }
	                $scope.vm.contentType = data.knowledgeContentNegative; //新增内容类型
	                /* **************** 2017/8/2   知识内容编辑 END   **************/ //
	                $scope.vm.isEditIndex = index;
	                $scope.vm.channelIdList = data.channelIdList;
	                angular.forEach($scope.vm.dimensions, function (item) {
	                    if (data.dimensionIdList.inArray(item.dimensionId)) {
	                        var obj = {
	                            "dimensionId": item.dimensionId,
	                            "dimensionName": item.dimensionName
	                        };
	                        $scope.vm.dimensionArr.push(obj);
	                    }
	                });
	                $scope.vm.tip = data.knowledgeBeRelatedOn; //在提示
	                $scope.vm.question = data.knowledgeRelatedQuestionOn;
	                $scope.vm.tail = data.knowledgeCommonOn;
	                $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList;
	            }
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/content.html", "650px", function () {
	                addNewOrEditKnow(index);
	            }, function () {
	                $scope.vm.isEditIndex = -1;
	            }, setDialog);
	        }
	        //  主页保存 获取参数
	        function getParams() {
	            var params = {
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID,
	                "sceneId": SCENE_ID,
	                "knowledgeTitle": $scope.vm.title, //
	                "knowledgeType": 106,
	                "knowledgeExpDateStart": $scope.vm.isTimeTable ? $scope.vm.timeStart : "", //开始时间
	                "knowledgeExpDateEnd": $scope.vm.isTimeTable ? $scope.vm.timeEnd : "", //结束时间
	                "knowledgeTitleTag": $scope.vm.knowledgeTitleTag, //标题打标生成的name
	                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
	                "knowledgeCreator": USER_LOGIN_NAME, //操作人
	                "knowledgeOrigin": $scope.vm.knowledgeOrigin
	            };
	            //var knowledgeContent ;
	            var content = angular.copy($scope.vm.scanContent);
	            angular.forEach(content, function (item, index) {
	                if (item.knowledgeContentNegative == 113) {
	                    var html = angular.copy(item.knowledgeContent);
	                    content[index].knowledgeContent = $filter("faceToString")(html).replace(/<div>/, "\n").replace(/<div>/g, "").replace(/<\/div>/g, '\n').replace(/<br>/g, '\n');
	                }
	            });
	            params.knowledgeContents = content;
	            params.extensionQuestions = $scope.vm.extensions.concat($scope.vm.extensionsByFrame, $scope.vm.extensionByTitleTag);
	            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
	            return params;
	        }
	        //限制一个知识多次保存
	        var limitTimer;
	        function save() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                if (!$scope.vm.limitSave) {
	                    $timeout.cancel(limitTimer);
	                    $scope.vm.limitSave = true;
	                    limitTimer = $timeout(function () {
	                        $scope.vm.limitSave = false;
	                    }, 180000);
	                    var params = getParams(); // 保存參數
	                    var api; // 返回編輯的 url
	                    if ($scope.vm.knowledgeId) {
	                        //编辑
	                        api = "/api/ms/richtextKnowledge/editKnowledge";
	                        params.knowledgeId = $scope.vm.knowledgeId;
	                    } else {
	                        //新增
	                        api = "/api/ms/richtextKnowledge/addKnowledge";
	                    }
	                    httpRequestPost(api, params, function (data) {
	                        console.log(getParams());
	                        if (data.status == 200) {
	                            //if ($scope.vm.docmentation) {
	                            //    $scope.vm.knowledgeClassifyCall();knowledgeAdd
	                            //}else{
	                            $state.go('knowledgeManagement.custOverview');
	                            //}
	                        } else if (data.status == 500) {
	                            layer.msg("知识保存失败");
	                            $timeout.cancel(limitTimer);
	                            $scope.$apply(function () {
	                                $scope.vm.limitSave = false;
	                            });
	                        }
	                    }, function (err) {
	                        $timeout.cancel(limitTimer);
	                        $scope.$apply(function () {
	                            $scope.vm.limitSave = false;
	                        });
	                        console.log(err);
	                    });
	                }
	            }
	        }
	        function scan() {
	            if (!checkSave()) {
	                return false;
	            } else {
	                var obj = {};
	                var params = getParams();
	                console.log(params);
	                obj.params = params;
	                obj.editUrl = "knowledgeManagement.markKnow";
	                if ($scope.vm.knowledgeId) {
	                    //编辑
	                    obj.api = "/api/ms/richtextKnowledge/editKnowledge";
	                    params.knowledgeId = $scope.vm.knowledgeId;
	                } else {
	                    //新增
	                    obj.api = "/api/ms/richtextKnowledge/addKnowledge";
	                }
	                obj.params = params;
	                obj.knowledgeType = 106;
	                $window.knowledgeScan = obj;
	                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
	                var url = $state.href('knowledgeManagement.knowledgeScan');
	                $window.open(url, '_blank');
	            }
	        };
	        //重置参数

	        function setDialog() {
	            /* **************** 2017/8/2   重置参数  BEGIN     **************/ //
	            $scope.vm.contentType = 113; //新增内容类型
	            $scope.vm.imgSelected = ""; // 已选图片
	            $scope.vm.voiceSelected = ""; //以选择声音文件
	            $scope.vm.imgTextSelected = ""; //以选择图文
	            /* **************** 2017/8/2   重置参数 END   **************/ //
	            $scope.vm.channelIdList = [];
	            $scope.vm.question = 1; //显示相关问
	            $scope.vm.tip = 1; //在提示
	            $scope.vm.tail = 1; //弹出评价小尾巴
	            $scope.vm.appointRelativeGroup = []; //业务扩展问
	            $scope.vm.appointRelative = "";
	            $scope.vm.dimensionArr = [];
	        }

	        function addNewOrEditKnow(index) {
	            if (isNewKnowledgeTitle()) {
	                var parameter = {
	                    "knowledgeContent": "",
	                    "channelIdList": $scope.vm.channelIdList,
	                    "knowledgeContentNegative": $scope.vm.contentType.toString(),
	                    "dimensionIdList": nullCheck($scope.vm.dimensionArr) ? $scope.vm.dimensionArr : $scope.$parent.$parent.MASTER.dimensionListIds,
	                    "knowledgeRelatedQuestionOn": $scope.vm.question, //显示相关问
	                    "knowledgeBeRelatedOn": $scope.vm.tip, //在提示
	                    "knowledgeCommonOn": $scope.vm.tail, //弹出评价小尾巴
	                    "knowledgeRelevantContentList": $scope.vm.appointRelativeGroup //业务扩展问
	                };
	                if ($scope.vm.contentType == 111) {
	                    parameter.knowledgeContent = $scope.vm.imgSelected.url;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.imgSelected.name
	                    };
	                } else if ($scope.vm.contentType == 112) {
	                    parameter.knowledgeContent = $scope.vm.voiceSelected.url;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.voiceSelected.name
	                    };
	                } else if ($scope.vm.contentType == 113) {
	                    //faceToString
	                    parameter.knowledgeContent = $scope.vm.emotionText;
	                    //console.log($("#emotion-container").html()) ;
	                    //var html = $("#emotion-container").html() ;
	                    //knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
	                } else if ($scope.vm.contentType == 114) {
	                    //faceToString
	                    parameter.knowledgeContent = $scope.vm.imgTextSelected.id;
	                    parameter.knowledgeContentDetail = {
	                        "name": $scope.vm.imgTextSelected.name,
	                        "url": $scope.vm.imgTextSelected.url
	                    };
	                }
	                $scope.vm.scanContent[index] = parameter;
	            }
	        }
	        function checkSave() {
	            var params = getParams();
	            console.log(params);
	            if (!params.knowledgeTitle) {
	                layer.msg("知识标题不能为空，请填写");
	                return false;
	            } else if (!nullCheck(params.classificationAndKnowledgeList)) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!nullCheck(params.knowledgeContents)) {
	                layer.msg("知识内容不能为空，请点击新增填写");
	                return false;
	            } else if (!nullCheck(params.classificationAndKnowledgeList)) {
	                layer.msg("分类知识Bot不能为空");
	            } else {
	                return true;
	            }
	        }
	        //***************************    save check channel dimension  **********************************************
	        function increaseCheck(close) {
	            //判斷维度是否为空 0 不变 1 全维度
	            if (!nullCheck($scope.vm.dimensionArr)) {
	                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds);
	            };
	            if (!isNewKnowledgeTitle()) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!nullCheck($scope.vm.channelIdList)) {
	                console.log($scope.vm.channelIdList);
	                layer.msg("请选择渠道后保存");
	            } else if (!isNewKnowledgeTitle() && !nullCheck($scope.vm.channelIdList)) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if ($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent, $scope.vm.isEditIndex, $scope.vm.channelIdList, $scope.vm.dimensionArr)) {
	                //存在重复条件
	            } else {
	                close(1);
	            }
	        }
	        //*******************       2017/7/14  BEGIN    *******************//
	        //弹出选择媒体对话框
	        function selectMultimedia() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/media.html", "450px", "", "", "", 2);
	        }
	        function addMultimedia(item) {
	            // 111 图片
	            if ($scope.vm.contentType == 111) {
	                $scope.vm.imgSelected = {
	                    "url": item.pictureUrl,
	                    "id": item.pictureId,
	                    "name": item.pictureName
	                };
	                //    声音
	            } else if ($scope.vm.contentType == 112) {
	                $scope.vm.voiceSelected = {
	                    "url": item.voiceUrl,
	                    "id": item.voiceId,
	                    "name": item.voiceName
	                };
	                //    图文
	            } else if ($scope.vm.contentType == 114) {
	                console.log(item);
	                $scope.vm.imgTextSelected = {
	                    "url": item.pictureUrl,
	                    "id": item.graphicMessageId,
	                    "name": item.graphicMessageTitle
	                };
	            }
	            ngDialog.close(ngDialog.latestID);
	        }
	        getPicList(1);
	        //获取所有图片
	        function getPicList(index) {
	            httpRequestPost("/api/ms/picture/queryPicture", {
	                "index": (index - 1) * $scope.vm.imgPaginationConf.pageSize,
	                "pageSize": $scope.vm.imgPaginationConf.pageSize,
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        $scope.vm.imageList = data.data.objs;
	                        $scope.vm.imgPaginationConf.currentPage = index;
	                        $scope.vm.imgPaginationConf.totalItems = data.data.total;
	                    });
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	        getVoiceList(1);
	        function getVoiceList(index) {
	            httpRequestPost("/api/ms/voiceManage/queryVioce ", {
	                "index": (index - 1) * $scope.vm.voicePaginationConf.pageSize,
	                "pageSize": $scope.vm.voicePaginationConf.pageSize,
	                "applicationId": APPLICATION_ID
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.$apply(function () {
	                        $scope.vm.voiceList = data.data.objs;
	                        $scope.vm.voicePaginationConf.currentPage = index;
	                        $scope.vm.voicePaginationConf.totalItems = data.data.total;
	                        console.log($scope.vm.voicePaginationConf);
	                    });
	                }
	            }, function (err) {
	                console.log(err);
	            });
	        }
	        var picTimer;
	        $scope.$watch('vm.imgPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (picTimer) {
	                    $timeout.cancel(picTimer);
	                }
	                picTimer = $timeout(function () {
	                    getPicList(current);
	                }, 100);
	            }
	        }, true);
	        var voiceTimer;
	        $scope.$watch('vm.voicePaginationConf.currentPage', function (current) {
	            if (current) {
	                if (voiceTimer) {
	                    $timeout.cancel(voiceTimer);
	                }
	                voiceTimer = $timeout(function () {
	                    getVoiceList(current);
	                }, 100);
	            }
	        }, true);
	        function isNewKnowledgeTitle() {
	            var info = "",
	                isPass = false;
	            if (!($scope.vm.contentType == 111 && !$scope.vm.imgSelected.url || $scope.vm.contentType == 112 && !$scope.vm.voiceSelected.name || $scope.vm.contentType == 113 && !$("#emotion-container").html() || $scope.vm.contentType == 114 && !$scope.vm.imgTextSelected.id)) {
	                isPass = true;
	            }
	            return isPass;
	        }
	        //*******************2017/8/9  添加链接 BEGIN *******************//
	        function addLint() {
	            $scope.$parent.$parent.MASTER.openNgDialog($scope, "/static/knowledge_manage/single_add/rich_text/link.html", "450px", function () {
	                var aLink = "<a href='" + $scope.vm.newLink + "' target='_blank' style=' color: -webkit-link;cursor: auto;text-decoration: underline;'>" + $scope.vm.newLink + "</a>";
	                var html = $("#emotion-container").html() + aLink;

	                $("#emotion-container").html(html);
	                console.log($scope.vm.newLink);
	            }, "", function () {
	                $scope.vm.newLink = "";
	            }, 2);
	        }
	        function isNewLinkAble(val) {
	            var regex = /[^http(s)?:\/\/]?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
	            if (regex.test(val)) {
	                ngDialog.close(ngDialog.latestID, 1);
	            } else {
	                layer.msg("请输入正确的链接地址");
	            }
	        }
	        //*******************2017/8/9  添加链接  END *******************//

	        //*******************2017/8/24 @图文 根据图文id获取图片url @根据图片获取name  BEGIN  *******************//
	        queryImgText(1);
	        //查询
	        function queryImgText(index) {
	            httpRequestPost("/api/ms/graphicMessage/queryGraphicMessage", {
	                applicationId: APPLICATION_ID,
	                index: (index - 1) * $scope.vm.imgTextPaginationConf.pageSize,
	                pageSize: $scope.vm.imgTextPaginationConf.pageSize
	            }, function (data) {
	                if (data.status == 500) {
	                    layer.msg("请求失败", { time: 1000 });
	                } else if (data.status == 200) {
	                    console.log(data);
	                    $scope.$apply(function () {
	                        $scope.vm.imgTextList = data.data.objs;
	                        $scope.vm.imgTextPaginationConf.totalItems = data.data.total;
	                        $scope.vm.imgTextPaginationConf.numberOfPages = data.data.total / $scope.vm.imgTextPaginationConf.pageSize;
	                    });
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }
	        //分页定时器
	        var timeoutImgText;
	        $scope.$watch('vm.imgTextPaginationConf.currentPage', function (current) {
	            if (current) {
	                if (timeoutImgText) {
	                    $timeout.cancel(timeoutImgText);
	                }
	                timeoutImgText = $timeout(function () {
	                    queryImgText(current);
	                }, 0);
	            }
	        }, true);
	        //*******************2017/8/24 图文 END  *******************//
	        //引导页方法
	        function showTip() {
	            $('.shadow_div').show();
	            $('.step_div').show();
	            $('#step_one').show().siblings().hide();
	        }
	        function hideTip() {
	            $('.shadow_div').hide();
	            $('.step_div').hide();
	        }
	        //上一个
	        function prevDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().prev()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().prev().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().prev().offset().top - 20
	                }, 500);
	            } else {
	                // $(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //下一个
	        function nextDiv(e) {
	            var obj = e.srcElement ? e.srcElement : e.target;
	            if ($(obj).parent().parent().parent().next()) {
	                $(obj).parent().parent().parent().hide();
	                $(obj).parent().parent().parent().next().show();
	                $('html, body').animate({
	                    scrollTop: $(obj).parent().parent().parent().next().offset().top - 20
	                }, 500);
	            } else {
	                //$(obj).attr('disabled',true);
	                return;
	            }
	        }
	        //引导页方法end
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  知识批量新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('KnowBatchAdditionsController'[('$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$stateParams", "$window", "$rootScope", "$filter", function ($scope, localStorageService, $state, ngDialog, $cookieStore, $stateParams, $window, $rootScope, $filter) {
	        //console.log($stateParams);
	        $scope.vm = {
	            downTemplate: downTemplate, //新增点击事件
	            upload: upload,
	            fileName: '',
	            templateType: 190 //添加默认值
	        };
	        //$.getScript('/js/common/config.js',function(e){
	        //console.log(e)
	        //    //newFun('"Checking new script"');//这个函数是在new.js里面的，当点击click后运行这个函数
	        //});
	        //上传
	        function upload(callback) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/batchAdditions/uploadDialog.html",
	                width: "450px",
	                scope: $scope,
	                closeByNavigation: false,
	                overlay: true,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {} else {}
	                }
	            });
	        }
	        //打开下载模板
	        function downTemplate(callback) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/batchAdditions/downTemplateDialog.html",
	                width: "450px",
	                scope: $scope,
	                closeByNavigation: false,
	                overlay: true,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {} else {}
	                }
	            });
	        }
	    })]);
	};

/***/ }),
/* 87 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  文档加工 -- 任务分析
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('AnalyseTaskController', ['$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog", "KnowDocService", "TemplateService", "TipService", "$state", function ($scope, $location, $routeParams, $interval, $timeout, ngDialog, KnowDocService, TemplateService, TipService, $state) {
	        $scope.vm = {
	            searchName: "", //搜索条件 templateName
	            templates: "", //模板列表
	            knowDocs: "", //文档列表
	            queryKnowDocList: queryKnowDocList, //獲取列表
	            queryTemplate: queryTemplate, // 获取所有模板
	            deleteKnowDoc: deleteKnowDoc, //删除文档
	            templateId: "" //模板id
	        };
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        //任务模板
	        $scope.paginationConf = {
	            currentPage: 1, //当前页
	            totalItems: 0, //总条数
	            pageSize: 10, //第页条目数
	            pagesLength: 6, //分页框数量
	            searchName: "", //搜索文档名称
	            startTime: "", //开始时间
	            endTime: "", //结束时间
	            userName: "" //创建人
	        };
	        //模板分页
	        $scope.temPaginationConf = {
	            currentPage: 1, //当前页
	            totalItems: 0, //总条数
	            pageSize: 5, //第页条目数
	            pagesLength: 6 //分页框数量
	        };
	        //获取模板
	        function queryTemplate() {
	            TemplateService.queryTemplate.save({
	                "index": ($scope.temPaginationConf.currentPage - 1) * $scope.temPaginationConf.pageSize,
	                "pageSize": $scope.temPaginationConf.pageSize,
	                "requestId": "string"
	            }, function (resource) {
	                if (resource.status == 200) {
	                    $scope.vm.templates = resource.data.objs;
	                    $scope.temPaginationConf.totalItems = resource.data.total;
	                }
	            });
	        }
	        //获取文档列表
	        function queryKnowDocList() {
	            KnowDocService.queryKnowDocList.save({
	                "index": ($scope.paginationConf.currentPage - 1) * $scope.paginationConf.pageSize,
	                "pageSize": $scope.paginationConf.pageSize,
	                "documentationName": $scope.paginationConf.searchName,
	                "documentationCreateTime": $scope.paginationConf.startTime,
	                "documentationModifyTime": $scope.paginationConf.endTime,
	                "documentationCreater": $scope.paginationConf.userName,
	                "requestId": "string"
	            }, function (resource) {
	                if (resource.status == 200) {
	                    $scope.vm.knowDocs = resource.data.objs;
	                    $scope.paginationConf.totalItems = resource.data.total;
	                    console.log($scope.paginationConf.totalItems);
	                }
	            });
	        };
	        //刪除
	        function deleteKnowDoc(knowDocId) {
	            KnowDocService.deleteKnowDoc.save({
	                "documentationId": knowDocId
	            }, function (resource) {
	                if (resource.status == 200) {
	                    TipService.setMessage('删除成功!', "success");
	                    $state.reload();
	                }
	            });
	        };

	        var timeout;
	        $scope.$watch('paginationConf', function () {
	            if (timeout) {
	                $timeout.cancel(timeout);
	            }

	            timeout = $timeout(function () {
	                //$scope.storeParams(paginationConf);
	                queryKnowDocList();
	            }, 350);
	        }, true);

	        var timeout3;
	        $scope.$watch('temPaginationConf', function (SearchPOJO) {
	            if (timeout3) {
	                $timeout.cancel(timeout3);
	            }
	            timeout = $timeout(function () {
	                queryTemplate();
	            }, 350);
	        }, true);
	    }]);
	};

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  文档加工
	 */
	module.exports = function (knowledgeManagementModule) {
	  knowledgeManagementModule.controller('BackController', ['$scope', '$location', "$interval", "$timeout", "$state", function ($scope, $location, $interval, $timeout, $state) {
	    $state.go("back.gateway");
	  }]);
	};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  文档加工 -- 模板配置
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('CreateTemController', ['$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog", "TemplateService", "localStorageService", "$state", "TipService", function ($scope, $location, $stateParams, $interval, $timeout, ngDialog, TemplateService, localStorageService, $state, TipService) {
	        $scope.vm = {
	            "temName": "", //模板名称
	            "temType": "WORD", //模板类型
	            "temNameChecked": false, //模板名称校验
	            "fileName": "未选择文件", //上传文件名称
	            "isTempUpToolsShow": $stateParams.temId ? false : true, //上传 按钮显示
	            "progress": 0, // 上传进度
	            "templateId": $stateParams.temId ? $stateParams.temId : "", //模板id
	            "rules": "", //所有规则
	            "addRule": addRule, //添加规则
	            "deleteRule": deleteRule, //删除已添加规则
	            "resetRule": resetRule //取消添加的规则

	        };
	        //通过id 获取模板
	        function queryTemplateById() {
	            TemplateService.queryTemplateById.save({
	                "index": 0,
	                "pageSize": 1,
	                "templateId": $scope.vm.templateId
	            }, function (resource) {
	                if (resource.status == 200 && resource.data) {
	                    $scope.vm.temName = resource.data.objs[0].templateName;
	                    //$scope.rules = resource.data.rules;
	                    var filePath = resource.data.objs[0].templateUrl;
	                    var filename = filePath.substring(filePath.lastIndexOf("//") + 2, filePath.length);
	                    $scope.vm.fileName = filename;
	                }
	            });
	        }
	        //获取规则
	        function queryRules() {
	            TemplateService.queryRules.save({
	                "templateId": $scope.vm.templateId
	            }, function (resource) {
	                if (resource.status == 200 && resource.data) {
	                    $scope.vm.rules = resource.data.objs;
	                }
	            });
	        };
	        //添加规则
	        function addRule() {
	            if ($scope.vm.rules) {
	                if ($scope.vm.rules.length == 0) //判断是否存在模板规则
	                    {
	                        $scope.vm.rules.push({
	                            level: 0
	                        });
	                    } else {
	                    $scope.vm.rules.push({
	                        level: $scope.vm.rules[$scope.vm.rules.length - 1].level + 1
	                    });
	                }
	                $('.proce_result ').trigger('click');
	            } else {
	                layer.msg("请先上传模板或选定模板");
	            }
	        };
	        //删除已添加规则
	        function deleteRule(ruleId) {
	            if (!ruleId) {
	                return;
	            }
	            TemplateService.deleteRule.save({
	                "ruleId": ruleId
	            }, function (resource) {
	                if (resource.status == 200) {
	                    TipService.setMessage('删除成功!', "success");
	                    queryRules(); //重新查询规则
	                } else {
	                    TipService.setMessage('删除失败!', "err");
	                }
	            });
	        };
	        // 取消添加的规则
	        function resetRule(index) {
	            var rule = $scope.vm.rules[index];
	            if (rule && !rule.id) {
	                $scope.vm.rules.splice(index, 1);
	            }
	        }
	        // 监听templateId
	        //For  创建模板 OR  模板添加规则
	        var timeout;
	        $scope.$watch('vm.templateId', function (temId) {
	            if (temId) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    $scope.vm.isTempUpToolsShow = false; //隐藏保持相关按钮
	                    queryTemplateById();
	                    queryRules();
	                }, 350);
	            }
	        }, true);
	        // templateName
	        //For  监测模板名字 是否 符合
	        var timeout2;
	        $scope.$watch('vm.temName', function (temName) {
	            if (temName && temName != "") {
	                if (timeout2) {
	                    $timeout.cancel(timeout2);
	                }
	                timeout2 = $timeout(function () {
	                    TemplateService.checkTemName.save({
	                        templateName: $scope.vm.temName
	                    }, function (resource) {
	                        if (resource.status == 200 && resource.data.objs.length == 0) {
	                            $scope.vm.temNameChecked = true;
	                        } else {
	                            $scope.vm.temNameChecked = false;
	                        }
	                    });
	                }, 350);
	            }
	        }, true);
	        //修改保存
	        $scope.backT = function () {
	            history.back();
	        };
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  知识文档分析结果控制器
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('DocResultsViewController', ['$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "FileUploader", "knowledgeAddServer", "$window", "$stateParams", "DetailService", "$filter", function ($scope, localStorageService, $state, ngDialog, $cookieStore, $timeout, $compile, FileUploader, knowledgeAddServer, $window, $stateParams, DetailService, $filter) {
	        var self = undefined;
	        if ($stateParams.knowDocId != null) $state.go("back.doc_results_view");
	        $scope.knowDocId = $stateParams.knowDocId;
	        $scope.knowDocCreateTime = $stateParams.knowDocCreateTime;
	        $scope.knowDocUserName = $stateParams.knowDocUserName;

	        $scope.vm = {
	            applicationId: $cookieStore.get("applicationId"),
	            modifier: $cookieStore.get("userId"),
	            knowIgnoreAllConfirm: knowIgnoreAllConfirm, //忽略全部
	            knowAddAll: knowAddAll, //添加全部
	            knowIgnoreConfirm: knowIgnoreConfirm, //忽略单条知识
	            addKnowClass: addKnowClass, //添加知识点分类
	            refreshFn: refreshFn,
	            botRoot: "", //根节点
	            knowledgeBotVal: "", //bot 内容
	            botSelectAdd: botSelectAdd,
	            botClassfy: [], //类目
	            creatSelectBot: [], //手选生成 bot
	            stateUrlVal: "knowledgeManagement.faqAdd",
	            stateUrl: [{ value: "knowledgeManagement.faqAdd", name: "FAQ知识" }, { value: "knowledgeManagement.singleAddConcept", name: "概念型知识" }],
	            stateVal: 2,
	            state: [{ value: 2, name: "FAQ知识" }, { value: 3, name: "概念型知识" }],
	            botTreeOperate: botTreeOperate,
	            searchBotAutoTag: searchBotAutoTag,
	            slideToggle: slideToggle

	        };

	        //点击bot分类的 加号
	        function botSelectAdd() {
	            if ($scope.vm.botFullPath) {
	                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
	                $scope.vm.botFullPath = "";
	                $scope.vm.knowledgeBotVal = "";
	            }
	        }

	        //滑动
	        function slideToggle(el, callBack) {
	            $timeout(function () {
	                angular.element(el).slideToggle();
	            }, 50);
	            if (callBack) {
	                callBack();
	            }
	        }

	        //BOT搜索自动补全
	        function searchBotAutoTag(el, url, callback) {
	            $(el).autocomplete({
	                serviceUrl: url,
	                type: 'POST',
	                params: {
	                    "categoryName": $(el).val(),
	                    "categoryAttributeName": "node",
	                    "categoryApplicationId": APPLICATION_ID
	                },
	                paramName: 'categoryName',
	                dataType: 'json',
	                transformResult: function transformResult(data) {
	                    var result = {
	                        suggestions: []
	                    };
	                    if (data.data) {
	                        angular.forEach(data.data, function (item) {
	                            result.suggestions.push({
	                                data: item.categoryId,
	                                value: item.categoryName,
	                                type: item.categoryTypeId
	                            });
	                        });
	                    }
	                    return result;
	                },
	                onSelect: function onSelect(suggestion) {
	                    console.log(suggestion);
	                    callback(suggestion);
	                }
	            });
	        }

	        /*bot*/
	        function botTreeOperate(self1, initUrl, getNodeUrl, selectCall) {
	            console.log("=====coming=====");
	            var tree = {
	                init: function init() {
	                    httpRequestPost(initUrl, {
	                        "categoryApplicationId": APPLICATION_ID,
	                        "categoryPid": "root"
	                    }, function (data) {
	                        self1.vm.botRoot = data.data;
	                    }, function (error) {
	                        console.log(error);
	                    });
	                },
	                getChildNode: getChildNode,
	                selectNode: selectNode
	            };
	            function getChildNode() {
	                $(".aside-navs").on("click", 'i', function () {
	                    var id = $(this).attr("data-option");
	                    var that = $(this);
	                    if (!that.parent().parent().siblings().length) {
	                        that.css("backgroundPosition", "0% 100%");
	                        httpRequestPost(getNodeUrl, {
	                            "categoryApplicationId": APPLICATION_ID,
	                            "categoryPid": id
	                        }, function (data) {
	                            console.log(data);
	                            if (data.data) {
	                                var html = '<ul class="menus">';
	                                for (var i = 0; i < data.data.length; i++) {
	                                    var typeClass;
	                                    // 叶子节点 node
	                                    if (data.data[i].categoryLeaf == 0) {
	                                        typeClass = "bot-leaf";
	                                    } else if (data.data[i].categoryLeaf != 0 && data.data[i].categoryAttributeName == "edge") {
	                                        typeClass = "bot-edge";
	                                    } else if (data.data[i].categoryLeaf != 0 && data.data[i].categoryAttributeName == "node") {
	                                        typeClass = "icon-jj";
	                                    }
	                                    var backImage;
	                                    switch (data.data[i].categoryTypeId) {
	                                        case 160:
	                                            backImage = " bot-divide";
	                                            break;
	                                        case 161:
	                                            backImage = " bot-process";
	                                            break;
	                                        case 162:
	                                            backImage = " bot-attr";
	                                            break;
	                                        case 163:
	                                            backImage = " bot-default";
	                                            break;
	                                    }
	                                    html += '<li>' + '<div class="slide-a">' + ' <a class="ellipsis" href="javascript:;">';

	                                    html += '<i class="' + typeClass + backImage + '" data-option="' + data.data[i].categoryId + '"></i>';

	                                    html += '<span>' + data.data[i].categoryName + '</span>' + '</a>' + '</div>' + '</li>';
	                                }
	                                html += "</ul>";
	                                $(html).appendTo(that.parent().parent().parent());
	                                that.parent().parent().next().slideDown();
	                            }
	                        }, function (err) {
	                            //layer.msg(err)
	                        });
	                    } else {
	                        if (that.css("backgroundPosition") == "0% 0%") {
	                            that.css("backgroundPosition", "0% 100%");
	                            that.parent().parent().next().slideDown();
	                        } else {
	                            that.css("backgroundPosition", "0% 0%");
	                            that.parent().parent().next().slideUp();
	                        }
	                    }
	                });
	            }
	            function selectNode() {
	                $(".aside-navs").on("click", "span", function () {
	                    //类型节点
	                    var pre = $(this).prev();
	                    angular.element(".icon-jj").css("backgroundPosition", "0% 0%");
	                    var id = pre.attr("data-option");
	                    selectCall(id); //添加bot分類
	                    angular.element(".rootClassfy,.menus").slideToggle();
	                    //$scope.$apply();
	                    //}
	                });
	            }
	            tree.init();
	            tree.getChildNode();
	            tree.selectNode();
	            //return tree ;
	        }

	        // 获取Bot全路径
	        function getBotFullPath(id) {
	            httpRequestPost("/api/ms/modeling/category/getcategoryfullname", {
	                categoryId: id
	            }, function (data) {
	                if (data.status = 10000) {
	                    var allBot = angular.copy($scope.vm.creatSelectBot.concat($scope.vm.botClassfy)),
	                        botResult = $scope.MASTER.isBotRepeat(id, data.categoryFullName.split("/"), "", allBot);
	                    $scope.$apply(function () {
	                        console.log(data);
	                        $scope.vm.knowledgeBotVal = data.categoryFullName;
	                        if (botResult != false) {
	                            //$scope.vm.knowledgeBotVal = data.categoryFullName.split("/");
	                            $scope.vm.botFullPath = botResult;
	                        }
	                    });
	                }
	            }, function (error) {
	                console.log(error);
	            });
	        }

	        //  主页保存 获取参数
	        function getParams() {
	            var categoryIds = [];
	            $.each($scope.vm.creatSelectBot, function (index, value) {
	                console.log($(value).classificationId);
	                console.log(value.classificationId);
	                categoryIds.push(value.classificationId);
	            });
	            var params = {
	                "applicationId": APPLICATION_ID,
	                "userId": USER_ID,
	                "categoryIds": categoryIds,
	                "documentationId": $scope.knowDocId,
	                "knowledgeStatus": $scope.vm.stateVal
	            };
	            return params;
	        }

	        //        提交 检验参数
	        function checkSave() {
	            var params = getParams();
	            console.log(params);
	            if (!params.categoryIds.length) {
	                layer.msg("知识类目不能为空，请选择分类");
	                return false;
	            } else if (!params.documentationId) {
	                return false;
	            } else {
	                return true;
	            }
	        }

	        /**
	         * 刷新列表
	         */
	        function refreshFn() {
	            $scope.queryDocKnowItems();
	        }
	        function knowIgnoreAllConfirm() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/document_know_process/doc_results_viewDialog.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        $scope.ignoreDocKnowAll();
	                    }
	                }
	            });
	        }
	        /**
	         * 添加全部
	         */
	        function knowAddAll() {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/document_know_process/doc_results_viewDialog_add_all.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                width: '775px',
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        if (checkSave()) {
	                            httpRequestPost("/api/ms/knowledgeDocumentation/batchAddKnowledge", getParams(), function (data) {
	                                if (data.status == 200) {
	                                    layer.msg("添加成功");
	                                }
	                                console.log(data);
	                            }, function (error) {
	                                console.log(error);
	                            });
	                        }
	                    }
	                }
	            });
	            if (dialog) {
	                $timeout(function () {
	                    botTreeOperate($scope, "/api/ms/modeling/category/listbycategorypid", "/api/ms/modeling/category/listbycategorypid", getBotFullPath);
	                    //BOT搜索自动补全
	                    searchBotAutoTag(".botTagAuto", "/api/ms/modeling/category/searchbycategoryname", function (suggestion) {
	                        $scope.$apply(function () {
	                            var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)),
	                                botResult = $scope.MASTER.isBotRepeat(suggestion.data, suggestion.value.split("/"), suggestion.type, allBot);
	                            $scope.vm.knowledgeBotVal = suggestion.value;
	                            if (botResult != false) {
	                                $scope.vm.botFullPath = botResult;
	                            }
	                        });
	                    });
	                }, 100);
	            }
	        }
	        function knowIgnoreConfirm(knowledgeId) {
	            var dialog = ngDialog.openConfirm({
	                template: "/static/knowledgeManagement/document_know_process/doc_results_viewDialog2.html",
	                scope: $scope,
	                closeByDocument: false,
	                closeByEscape: true,
	                showClose: true,
	                backdrop: 'static',
	                preCloseCallback: function preCloseCallback(e) {
	                    //关闭回掉
	                    if (e === 1) {
	                        console.info(knowledgeId);
	                        $scope.ignoreDocKnow(knowledgeId);
	                    }
	                }
	            });
	        }
	        function addKnowClass(knowledgeId, knowledgeTitle, knowledgeContent) {
	            if ($cookieStore.get("sceneId") == 2) {
	                //营销场景直接跳转到营销知识新增
	                $state.go("knowledgeManagement.conceptAdd", {
	                    data: angular.toJson({
	                        'docmentation': {
	                            'documentationId': $scope.knowDocId,
	                            'knowDocCreateTime': $scope.knowDocCreateTime,
	                            'knowDocUserName': $scope.knowDocUserName,
	                            'knowledgeId': knowledgeId,
	                            'documentationTitle': knowledgeTitle,
	                            'documentationContext': knowledgeContent
	                        }
	                    })
	                });
	            } else {
	                var dialog = ngDialog.openConfirm({
	                    template: "/static/knowledgeManagement/document_know_process/doc_results_viewDialog_add.html",
	                    scope: $scope,
	                    closeByDocument: false,
	                    closeByEscape: true,
	                    showClose: true,
	                    backdrop: 'static',
	                    preCloseCallback: function preCloseCallback(e) {
	                        //关闭回掉
	                        if (e === 1) {
	                            $state.go($scope.vm.stateUrlVal, {
	                                data: angular.toJson({
	                                    'docmentation': {
	                                        'documentationId': $scope.knowDocId,
	                                        'knowDocCreateTime': $scope.knowDocCreateTime,
	                                        'knowDocUserName': $scope.knowDocUserName,
	                                        'knowledgeId': knowledgeId,
	                                        'documentationTitle': knowledgeTitle,
	                                        'documentationContext': knowledgeContent
	                                    }
	                                })
	                            });
	                        }
	                    }
	                });
	            }
	        }
	        /**
	         *  忽略知识点
	         * @param knowledgeId
	         */
	        $scope.ignoreDocKnow = function (knowledgeId) {
	            DetailService.ignoreDocKnow.save({
	                "knowledgeId": knowledgeId,
	                "requestId": "string"
	            }, function (resource) {
	                if (resource.status == 200) {
	                    $scope.vm.refreshFn();
	                }
	            }, function () {
	                console.info("文档详情查询失败");
	            });
	        };

	        /**
	         *  忽略全部知识点
	         * @param knowledgeId
	         */
	        $scope.ignoreDocKnowAll = function () {
	            DetailService.ignoreDocKnowAll.save({
	                "documentationId": $scope.knowDocId,
	                "requestId": "string"
	            }, function (resource) {
	                if (resource.status == 200) {
	                    $scope.vm.refreshFn();
	                }
	            }, function () {
	                console.info("文档详情查询失败");
	            });
	        };
	        self.initSearch = function (column) {
	            if (!$scope.SearchPOJO) {
	                $scope.SearchPOJO = $scope.initSearchPOJO();
	            }
	            /**
	             * 加载分页条
	             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	             */
	            console.log();
	            $scope.paginationConf = {
	                currentPage: $scope.SearchPOJO.currentPage, //当前页
	                totalItems: 0, //总条数
	                pageSize: $scope.SearchPOJO.pageSize, //第页条目数
	                pagesLength: 6 //分页框数量

	            };
	        };
	        self.initSearch();

	        //根据知识文档id查询相关知识条目
	        $scope.queryDocKnowItems = function () {
	            if (!$scope.knowDocId) return;
	            DetailService.queryDocKnowItems.save({
	                "documentationId": $scope.knowDocId,
	                "knowledgeStatus": 0, //未分类
	                "index": ($scope.SearchPOJO.currentPage - 1) * $scope.SearchPOJO.pageSize,
	                "pageSize": $scope.SearchPOJO.pageSize,
	                "requestId": "string"
	            }, function (resource) {
	                //分页数据没有状态
	                if (resource.status == 200) {
	                    $scope.paginationConf.totalItems = resource.data.total;
	                    $scope.knowItems = resource.data.objs;
	                }
	            }, function () {
	                console.info("文档详情查询失败");
	            });
	        };

	        //监听分页菜单的变化
	        var timeout3;
	        $scope.$watch('SearchPOJO', function (SearchPOJO) {
	            if (timeout3) {
	                $timeout.cancel(timeout3);
	            }
	            timeout3 = $timeout(function () {
	                $scope.queryDocKnowItems();
	            }, 350);
	        }, true);
	    }]);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 91 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  文档选择
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('DocSelectController', ['$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog", "TemplateService", "localStorageService", "$state", "$sce", function ($scope, $location, $stateParams, $interval, $timeout, ngDialog, TemplateService, localStorageService, $state, $sce) {
	        $scope.vm = {
	            "roleId": $stateParams.roleId, //规则ID
	            "temId": $stateParams.temId, //模板ID
	            "level": $stateParams.level, //目录等级

	            "checkModel": 1, //

	            "checkedRule": {}, //

	            "queryRole": queryRole, //获取规则
	            "queryTemplateContent": queryTemplateContent, //获取模板样例
	            "queryTemContent": "", // 模板样例

	            "titleText": "",
	            "returnRole": "",
	            "extractRegTxt": "", //*remove*正则描述
	            "checkedRuleIndex": 0,

	            "getSimilarText": getSimilarText, // 根据标题获取相关规则
	            "strs": "", //获取的相关内容
	            "saveWordRule": saveWordRule, // 保存规则
	            "rules": "",
	            "generateRule": generateRule //标题测试
	        };
	        //获取规则
	        function queryRole() {
	            TemplateService.queryRuleById.save({
	                ruleId: $scope.vm.roleId
	            }, function (re) {
	                if (re.status == 200) {
	                    var data = re.data;
	                    $scope.vm.titleText = data.inputText;
	                    $scope.vm.extractRegTxt = data.extractReg;
	                    $scope.vm.checkModel = data.model;
	                    $scope.vm.returnRole = data;
	                    generateRule();
	                }
	            });
	        }
	        //获取模板样例
	        function queryTemplateContent() {
	            TemplateService.queryTemplateContent.save({
	                "index": 0,
	                "pageSize": 1,
	                "templateId": $scope.vm.temId
	            }, function (re) {
	                if (re.status == 200) {
	                    if ($scope.notEmpty(re.data) && re.data.length > 0) {
	                        $scope.vm.queryTemContent = $sce.trustAsHtml(re.data);
	                    }
	                }
	            });
	        }

	        function generateRule() {
	            console.log($scope.vm.titleText);
	            if (!$scope.vm.titleText || $scope.vm.titleText == '') {
	                layer.msg("请填写匹配标题");
	                return;
	            }
	            TemplateService.generateRule.save({
	                "templateId": $scope.vm.temId,
	                "level": $scope.vm.level,
	                "text": $scope.vm.titleText
	            }, function (re) {
	                if (re.status == 200) {
	                    if (re.data.objs.length > 0) {
	                        $scope.vm.rules = re.data.objs;
	                        for (var i = 0; i < $scope.vm.rules.length; i++) {
	                            var rule = $scope.vm.rules[i];
	                            if ($scope.vm.returnRole && $scope.vm.returnRole.firstLineIndent == rule.firstLineIndent && $scope.vm.returnRole.fontAlignment == rule.fontAlignment && $scope.vm.returnRole.selectText == rule.lineWord) {
	                                $scope.vm.checkedRuleIndex = i;
	                            }
	                        }
	                        getSimilarText();
	                    }
	                }
	            });
	        }
	        //根据标题获取相关规则
	        function getSimilarText() {
	            console.log();
	            if ($scope.vm.rules != undefined && $scope.vm.checkedRuleIndex != undefined && $scope.vm.rules[$scope.vm.checkedRuleIndex] != undefined) {
	                $scope.vm.checkedRule = $scope.vm.rules[$scope.vm.checkedRuleIndex];
	            } else {
	                $scope.vm.checkedRule = undefined;
	            }

	            if (!$scope.vm.checkedRule || $scope.vm.checkedRule == '') {
	                layer.msg("请选择匹配标题");
	                return;
	            }
	            TemplateService.getSimilarText.save({
	                "lineWord": $scope.vm.checkedRule.lineWord,
	                "firstLineIndent": $scope.vm.checkedRule.firstLineIndent,
	                "fontAlignment": $scope.vm.checkedRule.fontAlignment,
	                "level": $scope.vm.checkedRule.level,
	                "model": $scope.vm.checkedRule.model,
	                "numFmt": $scope.vm.checkedRule.numFmt,
	                "numLevelText": $scope.vm.checkedRule.numLevelText,
	                "style": $scope.vm.checkedRule.style,
	                "templateId": $scope.vm.checkedRule.templateId
	            }, function (re) {
	                if (re.status == 200) {
	                    if (re.data.objs.length > 0) {
	                        $scope.vm.strs = re.data.objs;
	                        //if($scope.vm.extractRegTxt != null && $scope.vm.extractRegTxt != '')
	                        //    $scope.optimizeText();
	                    } else {
	                        layer.msg("未能抽取到匹配内容");
	                    }
	                }
	            });
	        };
	        function saveWordRule() {
	            if ($scope.vm.rules != undefined && $scope.vm.checkedRuleIndex != undefined && $scope.vm.rules[$scope.vm.checkedRuleIndex] != undefined) {
	                $scope.vm.checkedRule = $scope.vm.rules[$scope.vm.checkedRuleIndex];
	            } else {
	                $scope.vm.checkedRule = undefined;
	            }

	            if (!$scope.vm.checkedRule) {
	                layer.msg("请选择要保存的规则");
	                return;
	            }
	            var params = {
	                "lineWord": $scope.vm.checkedRule.lineWord,
	                "firstLineIndent": $scope.vm.checkedRule.firstLineIndent,
	                "fontAlignment": $scope.vm.checkedRule.fontAlignment,
	                "level": $scope.vm.checkedRule.level,
	                "model": $scope.vm.checkModel,
	                "numFmt": $scope.vm.checkedRule.numFmt,
	                "numLevelText": $scope.vm.checkedRule.numLevelText,
	                "style": $scope.vm.checkedRule.style,
	                "templateId": $scope.vm.checkedRule.templateId,
	                "extractReg": $scope.vm.extractRegTxt,
	                "inputText": $scope.vm.titleText,
	                "selectText": $scope.vm.checkedRule.lineWord,
	                "ruleId": $scope.vm.roleId,
	                "templateCreater": USER_NAME,
	                "templateUpdater": USER_NAME,
	                "requestId": "String"
	            };
	            if ($scope.vm.roleId && $scope.vm.roleId != null && $scope.vm.roleId != "") TemplateService.updateWordRule.save(params, function (re) {
	                if (re.status == 200) {
	                    $state.go("back.createTemplate", { "isGo": true, "temId": $scope.vm.temId });
	                }
	            });else {
	                TemplateService.addWordRule.save(params, function (re) {
	                    if (re.status == 200) {
	                        $state.go("back.createTemplate", { "isGo": true, "temId": $scope.vm.temId });
	                        //history.back();
	                    }
	                });
	            }
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
	        queryTemplateContent();
	        if ($scope.vm.roleId != null && $scope.vm.roleId != "") {
	            queryRole();
	        }

	        /*
	        *  文档加工正则相关
	        *
	        *  功能删除
	        * */
	        //$scope.optimizeText = function(){
	        //    if(!$scope.vm.strs || $scope.vm.strs.length <= 0){
	        //        layer.msg("没有匹配的标题");
	        //        return;
	        //    }
	        //    if(!$scope.vm.extractRegTxt || $scope.vm.extractRegTxt == ''){
	        //        layer.msg("请输入正则表达式");
	        //        return;
	        //    }
	        //    TemplateService.optimizeText.save({
	        //        "regexRule":$scope.vm.extractRegTxt,
	        //        "texts":$scope.vm.strs
	        //    },function(re){
	        //        if(re.status == 200){
	        //            if(re.data.objs.length > 0){
	        //                $scope.extractStrs = re.data;
	        //            }else{
	        //                layer.msg("未能匹配到相应正则结果");
	        //            }
	        //        }
	        //    })
	        //} ;
	    }]);
	};

/***/ }),
/* 92 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  知识文档分析结果控制器
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('TemController', ['$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog", "TemplateService", "TipService", "$state", function ($scope, $location, $routeParams, $interval, $timeout, ngDialog, TemplateService, TipService, $state) {
	        $scope.vm = {
	            searchName: "", //搜索条件 templateName
	            deleteTemplate: deleteTemplate, //删除模板
	            queryTemplate: queryTemplate // 获取所有模板
	        };
	        //(function initSearch(column) {
	        //    if (!$scope.SearchPOJO) {
	        //        $scope.SearchPOJO = $scope.initSearchPOJO();
	        //    }
	        /**
	         * 加载分页条
	         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
	         */
	        $scope.paginationConf = {
	            currentPage: 1, //当前页
	            totalItems: 0, //总条数
	            pageSize: 10, //第页条目数
	            pagesLength: 6, //分页框数量
	            searchName: ""
	        };
	        //})() ;
	        //获取模板
	        function queryTemplate() {
	            TemplateService.queryTemplate.save({
	                "index": ($scope.paginationConf.currentPage - 1) * $scope.paginationConf.pageSize,
	                "pageSize": $scope.paginationConf.pageSize,
	                "requestId": "string",
	                "templateName": $scope.paginationConf.searchName
	            }, function (resource) {
	                if (resource.status == 200) {
	                    $scope.templates = resource.data.objs;
	                    $scope.paginationConf.totalItems = resource.data.total;
	                }
	            });
	        };
	        //删除模板
	        function deleteTemplate(temId) {
	            TemplateService.deleteTemplate.save({
	                "templateId": temId
	            }, function (resource) {
	                if (resource.status == 200) {
	                    TipService.setMessage('删除成功!', "success");
	                    queryTemplate();
	                }
	            });
	        }
	        ////获取文档类型
	        //$scope.temType = function(typeNum){
	        //    if(typeNum == 1){
	        //        return "WORD"
	        //    }
	        //} ;
	        var timeout;
	        $scope.$watch('paginationConf', function () {
	            if (timeout) {
	                $timeout.cancel(timeout);
	            }
	            timeout = $timeout(function () {
	                queryTemplate();
	            }, 350);
	        }, true);
	    }]);
	};

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  历史查看
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('HistoryViewController', ['$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "FileUploader", "knowledgeAddServer", "$window", function ($scope, localStorageService, $state, ngDialog, $cookieStore, $timeout, $compile, FileUploader, knowledgeAddServer, $window) {
	        $scope.vm = {
	            findUploadRecord: '/api/ms/uploadRecord/findUploadRecordList',
	            downRecord: '/api/ms/uploadRecord/downFile',
	            deleteRecord: '/api/ms/uploadRecord/deleteRecord',
	            uploadRecordList: null,
	            uploadName: null,
	            uploadType: null,
	            uploadTimeMin: null,
	            uploadTimeMax: null,
	            finishTimeMin: null,
	            finishTimeMax: null

	        };
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
	                pagesLength: 5 //分页框数量

	            };
	        };
	        self.initSearch();
	        //分页定时器
	        var timeout;
	        $scope.$watch('SearchPOJO', function (current) {
	            if (current) {
	                if (timeout) {
	                    $timeout.cancel(timeout);
	                }
	                timeout = $timeout(function () {
	                    $scope.findUploadRecord();
	                }, 350);
	            }
	        }, true);

	        //查询上传历史记录
	        $scope.findUploadRecord = function () {
	            httpRequestPost($scope.vm.findUploadRecord, {
	                "requestId": "string",
	                "applicationId": APPLICATION_ID,
	                "index": ($scope.SearchPOJO.currentPage - 1) * $scope.SearchPOJO.pageSize,
	                "pageSize": $scope.SearchPOJO.pageSize
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.vm.uploadRecordList = data.data;
	                    $scope.$apply();
	                } else {}
	                console.log(data);
	            }, function (err) {});
	        };

	        /**
	         * 下载记录文件
	         * @param uploadId 历史ID
	         */
	        $scope.downRecordFile = function (uploadName) {
	            var urlParams = "?applicationId=" + APPLICATION_ID + "&uploadName=" + uploadName;
	            var url = $scope.vm.downRecord + urlParams; //请求的url
	            $window.open(url, "_blank");
	        };

	        $scope.deleteRecord = function (uploadId) {
	            httpRequestPostParam($scope.vm.deleteRecord, {
	                "requestId": "string",
	                "uploadId": uploadId
	            }, function (data) {
	                if (data.status == 200) {
	                    $scope.findUploadRecord();
	                } else {}
	                console.log(data);
	            }, function (err) {});
	        };
	    }]);
	};

/***/ }),
/* 94 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/20.
	 * @Module : bot
	 */
	angular.module("knowledgeManagementModule").directive("botClassTree", ["KnowledgeService", "$templateCache", "$timeout", "$sce", function (KnowledgeService, $templateCache, $timeout, $sce) {
	    return {
	        restrict: "A",
	        template: function template(scope, attr) {
	            if (attr.botClassTree == "dialog") {
	                return $templateCache.get("bot-class");
	            } else {
	                return $templateCache.get("bot-class-not-dialog");
	            }
	        },
	        link: function link(scope, attr, el, ctr) {
	            scope.dirBot = {
	                botSelectAdd: botSelectAdd,
	                knowledgeBotVal: "" //bot 内容
	            };
	            function getBotFullPath(id) {
	                KnowledgeService.getBotFullPath.save({
	                    categoryId: id
	                }, function (data) {
	                    if (data.status = 10000) {
	                        var allBot = angular.copy(scope.vm.creatSelectBot),
	                            botResult = scope.$parent.knowCtr.isBotRepeat(id, data.categoryFullName.split("/"), "", allBot);
	                        //scope.$apply(function(){
	                        console.log(data);
	                        scope.dirBot.knowledgeBotVal = data.categoryFullName;
	                        if (botResult != false) {
	                            scope.vm.botFullPath = botResult;
	                        }
	                        //});
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            }
	            scope.MASTER.botTreeOperate(scope, "/api/ms/modeling/category/listbycategorypid", "/api/ms/modeling/category/listbycategorypid", getBotFullPath
	            //"/api/ms/modeling/category/searchbycategoryname"
	            );
	            //BOT搜索自动补全
	            scope.MASTER.searchBotAutoTag(".botTagAuto", "/api/ms/modeling/category/searchbycategoryname", function (suggestion) {
	                scope.$apply(function () {
	                    var allBot = angular.copy(scope.vm.creatSelectBot),
	                        botResult = scope.$parent.knowCtr.isBotRepeat(suggestion.data, suggestion.value.split("/"), suggestion.type, allBot);
	                    scope.dirBot.knowledgeBotVal = suggestion.value;
	                    if (botResult != false) {
	                        scope.vm.botFullPath = botResult;
	                    }
	                });
	            });
	            //点击bot分类的 加号
	            function botSelectAdd() {
	                if (scope.vm.botFullPath) {
	                    console.log(scope.vm.botFullPath);
	                    scope.vm.creatSelectBot.push(scope.vm.botFullPath);
	                    scope.vm.frameCategoryId = scope.vm.botFullPath.classificationId;
	                    scope.vm.botFullPath = "";
	                    scope.dirBot.knowledgeBotVal = "";
	                }
	            }
	        }
	    };
	}]);

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/19.
	 * @Module :  业务框架
	 */
	angular.module("knowledgeManagementModule").directive("businessFrame", [function () {
	    return {
	        restrict: "E",
	        template: "",
	        link: function link(scope, attr, el, ctr) {}
	    };
	}]);

/***/ }),
/* 96 */
/***/ (function(module, exports) {

	///**
	// * @Author : MILES .
	// * @Create : 2017/10/16.
	// * @Module :
	// */
	////自定义ngModel的属性
	//angular.module("knowledgeManagementModule").directive('contenteditable', ['$window', function() {
	//    return {
	//        restrict: 'A',
	//        require: '?ngModel', // 此指令所代替的函数
	//        link: function(scope, element, attrs, ngModel) {
	//            if (!ngModel) {
	//                return;
	//            } // do nothing if no ng-model
	//            // Specify how UI should be updated
	//            ngModel.$render = function() {
	//                element.html(ngModel.$viewValue || '');
	//            };
	//            // Listen for change events to enable binding
	//            element.on('blur keyup change', function() {
	//                scope.$apply(readViewText);
	//            });
	//            // No need to initialize, AngularJS will initialize the text based on ng-model attribute
	//            // Write data to the model
	//            function readViewText() {
	//                var html = element.html();
	//                // When we clear the content editable the browser leaves a <br> behind
	//                // If strip-br attribute is provided then we strip this out
	//                if (attrs.stripBr && html === '<br>') {
	//                    html = '';
	//                }
	//                ngModel.$setViewValue(html);
	//            }
	//        }
	//    }
	//}])
	"use strict";

/***/ }),
/* 97 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/21.
	 * @Module :  时间
	 */
	angular.module("knowledgeManagementModule").directive("selectStartEndTime", ["$templateCache", "KnowledgeService", function ($templateCache, KnowledgeService) {
	    return {
	        restrict: "A",
	        template: function template(scope, attr) {
	            if (attr.selectStartEndTime == "dialog") {
	                return $templateCache.get("select-start-end-time");
	            } else {
	                return $templateCache.get("select-start-end-time-not-dialog");
	            }
	        },
	        link: function link(scope, attr, el, ctr) {}
	    };
	}]);

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * Created by 41212 on 2017/7/15.
	 */
	knowledge_static_web.directive('emotion', ["$timeout", function ($timeout) {
	    return {
	        restrict: 'EA',
	        link: function link(scope, element, attrs) {
	            $timeout(function () {
	                $('.emotion').qqFace({
	                    id: 'facebox',
	                    wrapper: "block",
	                    assign: 'emotion-container', //赋值对象
	                    path: '/libs/qqFace/arclist/' //表情存放的路径
	                });
	            }, 100);
	        }
	    };
	}]).directive('emotionFormat', ["$timeout", "$filter", function ($timeout, $filter) {
	    return {
	        restrict: 'A',
	        require: "ngModel",
	        link: function link(scope, $element, attrs, modelCtrl) {
	            console.log($element);
	            var reg = /\[em_([0-9]*)\]/g;
	            $element.bind("DOMNodeInserted input", function (va, va2, va3) {
	                var pristine = $element.html(),
	                    html = pristine;
	                if (reg.test(pristine)) {
	                    html = $filter('emotion')(pristine);
	                    $element.html(html);
	                }
	                scope.$apply(function () {
	                    scope.vm.emotionText = html;
	                });
	            });
	        }
	    };
	}]);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 99 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/19.
	 * @Module : 概念扩展
	 */
	angular.module("knowledgeManagementModule").directive("conceptExtension", ["KnowledgeService", "$templateCache", "$timeout", "$sce", "localStorageService", function (KnowledgeService, $templateCache, $timeout, $sce, localStorageService) {
	    return {
	        restrict: "A",
	        template: function template(scope, attr) {
	            if (attr.conceptExt == "dialog") {
	                return $templateCache.get("ext");
	            } else {
	                return $templateCache.get("ext-not-dialog");
	            }
	        },
	        link: function link(scope, el, attr, ctr) {
	            scope.dirExtHasTag = {
	                title: "",
	                type: 60,
	                getExtensionByFrame: getExtensionByFrame,
	                getExtension: getExtension,
	                rmeoveExtHasTagToLocal: rmeoveExtHasTagToLocal
	            };
	            /**
	             * 删除页面扩展问，并添加到local中
	             * @params ｛isEdit｝       knowledgeId（是否是编辑）；判断是否调用本地local假删除
	             * @params ｛item｝         删除的扩展问
	             * */
	            function rmeoveExtHasTagToLocal(isEdit, item) {
	                if (isEdit) {
	                    //localStorageService.clearAll() ;
	                    var local = localStorageService.get("cust_concept_ext");
	                    if (local) {
	                        local.push(item);
	                        localStorageService.set("cust_concept_ext", local);
	                    } else {
	                        localStorageService.set("cust_concept_ext", new array(item));
	                    }
	                    console.log(localStorageService.get("cust_concept_ext"));
	                }
	            }
	            /**
	             * 获取扩展问
	             * @params ｛isEdit｝       knowledgeId（是否是编辑）；判断是否调用本地local假删除
	             * @params ｛localName｝    localStorage name
	             * @params ｛title｝        扩展问标题
	             * @params ｛type｝         扩展问类型
	             * @params ｛allExt｝       页面所有扩展问，比较时候重复复
	             * */
	            function getExtension(isEdit, localName, title, type, allExt) {
	                // 标题是否重复
	                var usable = isTitleUsable(title, type, allExt);
	                var local = localStorageService.get(localName);
	                if (!title) {
	                    layer.msg("扩展问不能为空");
	                    return;
	                } else if (usable == false) {
	                    layer.msg("生成扩展问重复,已阻止添加");
	                    return false;
	                }
	                if (isEdit) {
	                    if (local != null) {
	                        var result = false;
	                        angular.forEach(local, function (item, index) {
	                            if (item.extensionQuestionTitle == title && item.extensionQuestionType == type) {
	                                scope.vm.extensions.push(item);
	                                local.splice(index, 1);
	                                localStorageService.set(localName, local);
	                                result = true;
	                            }
	                        });
	                        if (result) {
	                            return;
	                        }
	                    }
	                }
	                var parameter = { "applicationId": APPLICATION_ID },
	                    call; // 参数以及成功回调
	                if (attr.tag == 'true') {
	                    // 需要打标签的 （非faq）
	                    parameter.extendQuestionList = new Array(title); // 公用应用id
	                    call = function call(res) {
	                        if (res.status == 500) {
	                            layer.msg(res.data);
	                        } else if (res.status == 10026) {
	                            layer.msg("扩展问添加重复，请重新添加");
	                        } else if (res.status == 200) {
	                            var result = scope.$parent.knowCtr.isExtensionTagRepeat(res.data, allExt, title, type);
	                            if (result != false) {
	                                scope.dirExtHasTag.type = 60;
	                                scope.dirExtHasTag.title = "";
	                                scope.vm.extensions.push(result);
	                            }
	                        }
	                    };
	                } else {
	                    // faq
	                    parameter.title = title;
	                    call = function call(res) {
	                        if (res.status == 500) {
	                            layer.msg('根据"' + title + '"生成扩展问题重复');
	                        } else if (res.status == 200) {
	                            scope.vm.extensions.push(usable);
	                        }
	                    };
	                }
	                KnowledgeService[attr.api].save(parameter, call, function (error) {
	                    //status == 500
	                    //layer.msg("概念扩展打标失败，请检查服务，重新打标");
	                    console.log(error);
	                });
	            }
	            /**
	            * 是否与页面扩展问有冲突
	            * 重复：false ；
	            * 不重复：{
	                         extensionQuestionTitle : title ,
	                         extensionQuestionType : type
	                      }
	            * */
	            function isTitleUsable(title, type, allExt) {
	                var result = {
	                    extensionQuestionTitle: title,
	                    extensionQuestionType: type
	                };
	                //所有标题以及手动打标生成的扩展问
	                if (allExt.length) {
	                    var len = allExt.length;
	                    angular.forEach(allExt, function (val) {
	                        if (val.extensionQuestionTitle == title && val.extensionQuestionType == type) {
	                            len -= 1;
	                            result = false;
	                        }
	                    });
	                }
	                return result;
	            }
	            function getExtensionByFrame(id, type) {
	                console.log(id);
	                httpRequestPost("/api/ms/modeling/frame/listbyattribute", {
	                    "frameTypeId": 10012,
	                    "frameId": id,
	                    "index": 0,
	                    "pageSize": 999999
	                }, function (data) {
	                    if (data.status == 10000) {
	                        //var extensionQuestionList = [],
	                        //    frameQuestionTagList = [];
	                        var obj = {};
	                        if (data.data[0].elements) {
	                            angular.forEach(data.data[0].elements, function (item, index) {
	                                var extensionQuestionList = [],
	                                    frameQuestionTagList = [];
	                                obj = {
	                                    "extensionQuestionType": 60, //61
	                                    "extensionQuestionTitle": data.data[0].frameTitle
	                                };
	                                extensionQuestionList.push(item.elementContent.substring(0, item.elementContent.indexOf('#')));
	                                frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#') + 1).split('；'));
	                                checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, obj);
	                            });
	                        }
	                        scope.$apply();
	                    }
	                }, function (error) {
	                    console.log(error);
	                });
	            }
	            //y业务框架生成扩展问校验
	            function checkExtensionByFrame(extensionQuestionList, frameQuestionTagList, oldWord) {
	                var title = extensionQuestionList[0];
	                var weight = oldWord.extensionQuestionType;
	                console.log(oldWord, title);
	                var isLocalHasExt = addLocalExtension(title);
	                if (isLocalHasExt) {
	                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
	                    return;
	                }
	                httpRequestPost("/api/ms/conceptKnowledge/checkFrameTag", {
	                    "applicationId": APPLICATION_ID,
	                    "extensionQuestionList": extensionQuestionList,
	                    "frameQuestionTagList": frameQuestionTagList
	                }, function (data) {
	                    if (data.status == 200) {
	                        $scope.$apply(function () {
	                            var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame);
	                            var result = $scope.$parent.knowCtr.isExtensionTagRepeat(data.data, allExtension, title, weight);
	                            if (result != false) {
	                                $scope.vm.extensionTitle = "";
	                                $scope.vm.extensionsByFrame.push(result);
	                            }
	                        });
	                    }
	                }, function () {});
	            }
	        }
	    };
	}]);

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	/**
	 * Created by mileS on 2017/4/12.
	 */

	knowledge_static_web.directive("gatewayMenu", function () {
	    return {
	        restrict: "AE",
	        scope: {},
	        link: function link($scope, elem, attrs) {
	            elem.click(function () {
	                $('.popup_span').show();
	                if (attrs.gatewayMenu == 'file') $(".import_from_txt").css('visibility', 'visible');else if (attrs.gatewayMenu == 'single') $(".add_single_popup").css('visibility', 'visible');else if (attrs.gatewayMenu == 'adapter') $(".jr_Agent").show();
	            });
	        }
	    };
	});

	knowledge_static_web.directive('plupload', ['$timeout', "$cookieStore", "$state", function ($timeout, $cookieStore, $state) {
	    return {
	        restrict: 'A',
	        link: function link($scope, iElm, iAttrs, controller) {
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
	                        extensions: "docx"
	                    }]
	                },
	                flash_swf_url: '/plupload/Moxie.swf',
	                silverlight_xap_url: '/plupload/Moxie.xap',
	                init: {
	                    PostInit: function PostInit() {
	                        $('#uploadfiles').click(function () {
	                            var params = {
	                                //这里设置上传参数
	                                templateId: $scope.targetId,
	                                requestId: "String",
	                                //设置用户信息
	                                userName: USER_LOGIN_NAME
	                            };
	                            if ($scope.processMethod == true) {
	                                if (!$scope.targetId || $scope.targetId == null) {
	                                    layer.msg("请选择加工模板");
	                                    return;
	                                }
	                            }
	                            uploader.setOption('multipart_params', params);
	                            uploader.setOption('url', '/api/ms/knowledgeDocumentation/createDocumentation');
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
	                        });
	                    },

	                    FilesAdded: function FilesAdded(up, files) {
	                        plupload.each(files, function (file) {

	                            if (file.name.length > 20) {
	                                layer.msg("文件名称过长,请返回修改");
	                                up.removeFile(file);
	                            } else {
	                                //$scope.$apply(function(){
	                                $('#file_container').append('<div class="file_con" id="' + file.id + '"style="overflow:hidden;padding: 0px;">' + '<span  class="name">' + file.name + '</span>' + '<b class="progress" style="font-size: 14px;line-height: 33px;margin-left: 15px; height: inherit; width: 40px;">0%</b>' + '<span class="size"> (' + plupload.formatSize(file.size) + ') </span>' + '</div>');
	                                //}) ;
	                                //if (up.files.length > 1) {
	                                //    up.removeFile(file);
	                                //}
	                            }
	                            //document.getElementById('file_container').innerHTML += '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> (' + plupload.formatSize(file.size) + ') </span></div>';
	                        });
	                    },
	                    FilesRemoved: function FilesRemoved(up, files) {
	                        plupload.each(files, function (file) {
	                            if (up.files.length <= 0) {
	                                //document.getElementById('file_container').innerHTML = '';
	                                $('#file_container').html('');
	                            }
	                        });
	                    },

	                    UploadProgress: function UploadProgress(up, file) {
	                        //alert(up) ;
	                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
	                        $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
	                    },

	                    Error: function Error(up, err) {
	                        console.log("Error #" + err.code + ": " + err.message);
	                    },

	                    UploadComplete: function UploadComplete(uploader, files) {
	                        //alert("success")
	                    },

	                    FileUploaded: function FileUploaded(uploader, files, res) {
	                        $state.reload();
	                        //$scope.vm.queryKnowDocList();
	                        $('#file_container').html('');
	                        //$scope.vm.resetUploadPOJO();
	                        $('.template_inpt').val("");
	                        if (res.status == 200) {
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

	knowledge_static_web.directive('tempPlupload', ['$timeout', "$location", "$state", function ($timeout, $location, $state) {
	    return {
	        restrict: 'A',
	        //template : '<span></span>'  ,
	        link: function link($scope, iElm, iAttrs, controller) {
	            var uploader = new plupload.Uploader({
	                runtimes: 'html4,html5,flash,silverlight',
	                browse_button: 'tempickfile',
	                url: '/api/ms/template/createTemplate',
	                //container: 'temcontainer',
	                max_file_count: 10,
	                multi_selection: false,
	                filters: {
	                    max_file_size: '10mb',
	                    mime_types: [{
	                        title: "Know File",
	                        extensions: "docx"
	                    }]
	                },
	                flash_swf_url: '/plupload/Moxie.swf',
	                silverlight_xap_url: '/plupload/Moxie.xap',
	                init: {
	                    PostInit: function PostInit() {
	                        $('#temupload').on("click", function () {
	                            if ($scope.vm.temName == null || $scope.vm.temName == '' || !$scope.vm.temName) {
	                                layer.msg("请输入模板名称");
	                                return;
	                            }
	                            if ($scope.vm.temName.length > 20) {
	                                layer.msg("模板名称不能大于20字");
	                                return;
	                            }
	                            if (!$scope.vm.temNameChecked) {
	                                layer.msg("模板名校验失败");
	                                return;
	                            }
	                            if (uploader.files.length <= 0) {
	                                layer.msg("请选择上传文件");
	                                return;
	                            }
	                            uploader.setOption('multipart_params', {
	                                "type": $scope.vm.temType,
	                                "templateName": $scope.vm.temName,
	                                "requestId": "String",
	                                //此处设置上传用户信息
	                                "userId": USER_LOGIN_NAME
	                            });
	                            uploader.start();
	                            return false;
	                        });
	                        $('#temreset').on("click", function () {
	                            if (uploader.files.length > 0) {
	                                for (var i = uploader.files.length; i > 0; i--) {
	                                    uploader.removeFile(uploader.files[i - 1]);
	                                }
	                            }
	                        });
	                    },
	                    FilesAdded: function FilesAdded(up, files) {
	                        plupload.each(files, function (file) {
	                            if (file.name.length >= 24) {
	                                layer.msg("文件名称过长,请返回修改");
	                                up.removeFile(file);
	                            } else {
	                                $scope.$apply(function () {
	                                    $scope.vm.fileName = file.name;
	                                });
	                                if (up.files.length > 1) {
	                                    up.removeFile(file);
	                                }
	                            }
	                        });
	                    },

	                    FilesRemoved: function FilesRemoved(up, files) {
	                        plupload.each(files, function (file) {
	                            if (up.files.length <= 0) {
	                                $scope.$apply(function () {
	                                    $scope.vm.fileName = '未选择文件';
	                                });
	                            }
	                        });
	                    },
	                    UploadProgress: function UploadProgress(up, file) {
	                        $scope.$apply(function () {
	                            $scope.vm.progress = file.percent;
	                        });
	                    },
	                    Error: function Error(up, err) {
	                        $scope.$apply(function () {
	                            $scope.vm.progress = 0;
	                        });
	                        uploader.init();
	                    },

	                    UploadComplete: function UploadComplete(uploader, files) {},
	                    FileUploaded: function FileUploaded(uploader, files, res) {
	                        if (res.status == 200) {
	                            //var res = res.replace(/<.*?>/ig,"")
	                            var response = JSON.parse(res.response.replace(/<.*?>/ig, ""));
	                            if (response.status == 200) {
	                                layer.msg("模板文件上传成功，请添加规则");
	                                $location.$$absUrl = $location.$$absUrl + response.data.templateId;
	                                $scope.$apply(function () {
	                                    $scope.vm.isTempUpToolsShow = false; //隐藏保持相关按钮
	                                    $scope.vm.templateId = response.data.templateId;
	                                    $scope.storeParams($scope.temId);
	                                });
	                            } else {
	                                $scope.$apply(function () {
	                                    $scope.vm.progress = 0;
	                                });
	                                uploader.removeFile(uploader.files[0]);
	                                layer.msg("模板文件上传失败,请重新选择文件");
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
	//                                  layer.msg("知识条目标题不能为空");
	//                                 return;
	//                             }
	//                             if (!$scope.sinKnowItemContent || $scope.sinKnowItemContent == '' || $scope.sinKnowItemContent == null) {
	//                                  layer.msg("知识条目内容不能为空");
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
	        link: function link($scope, elem, attrs) {
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
	    };
	});

	knowledge_static_web.directive("advansearchdiv", function () {
	    return {
	        restrict: "AE",
	        scope: {},
	        link: function link($scope, elem, attrs) {
	            elem.click(function (e) {
	                var e = e || window.event;

	                $(this).show();
	                e.stopPropagation();
	            });
	            $(document).click(function () {
	                elem.hide();
	            });
	        }
	    };
	});

	// src \app\static\knowledgeManagement\document_know_process\main_container.html
	// For 选择模板名称
	knowledge_static_web.directive("templateInput", function () {
	    return {
	        restrict: "AE",
	        link: function link($scope, elem, attrs) {
	            elem.click(function (e) {
	                var ev = e || window.event;
	                $('.template_con').show();
	                ev.stopPropagation();
	            });
	            $(document).click(function () {
	                $('.template_con').hide();
	            });
	        }
	    };
	});
	//模板选择 存储id
	knowledge_static_web.directive("templateCon", function () {
	    return {
	        restrict: "AE",
	        link: function link($scope, elem, attrs) {
	            elem.click(function (e) {
	                var ev = e || window.event;
	                ev.stopPropagation();
	            });
	            $scope.$on('onRenderFinish', function (event) {
	                $('.template_con tbody tr').click(function () {
	                    var value = $(this).find('td').eq(1).html();
	                    var id = $(this).find('td').eq(3).html();
	                    $('.template_inpt').val(value);
	                    $scope.$parent.targetId = $scope.targetId = id;
	                    $(this).parents('.template_con').hide();
	                });
	            });
	        }
	    };
	});

	//模板选择 关闭按钮
	knowledge_static_web.directive("closeMenu", function () {
	    return {
	        restrict: "AE",
	        scope: {},
	        link: function link($scope, elem, attrs) {
	            elem.click(function () {
	                $('.popup_wrap').hide();
	                $('.popup_span').hide();
	                $(".import_from_txt").css('visibility', 'hidden');
	                $(".add_single_popup").css('visibility', 'hidden');
	            });
	        }
	    };
	});

	//================================================================================= no-use ==========================================================//
	knowledge_static_web.directive("processMethodMenu", function () {
	    return {
	        restrict: "AE",
	        link: function link($scope, elem, attrs) {
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
	            });
	        }
	    };
	});
	knowledge_static_web.directive("mouldShowMenu", function () {
	    return {
	        restrict: "AE",
	        scope: {},
	        link: function link($scope, elem, attrs) {
	            elem.change(function () {
	                if ($(this).val() == "模板加工") {
	                    $(this).next().show();
	                }
	            });
	        }
	    };
	});
	knowledge_static_web.directive("onOff", function () {
	    return {
	        restrict: "AE",
	        scope: {
	            updateAdStatus: '&upfunction'
	        },
	        link: function link($scope, elem, attrs) {
	            // var att = attrs.onOff.split(",");
	            // var status = att[0];
	            // var id = att[1]

	            elem.click(function () {
	                if ($(this).hasClass('on_off_active')) {
	                    $(this).removeClass("on_off_active");
	                } else {
	                    $(this).addClass("on_off_active");
	                }
	                $scope.updateAdStatus();
	            });
	        }
	    };
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
	        link: function link($scope, elem, attrs) {
	            var setting = {
	                check: {
	                    enable: true,
	                    chkboxType: { "Y": "", "N": "" }
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

	            //  layer.msg(attrs.dropDownMenuByZtree);
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
	                        var curLocation = ""; //当前位置
	                        var allNode = nodes[m]['name']; //获取当前选中节点
	                        var node = nodes[m].getParentNode();
	                        getParentNodes(node, allNode);

	                        var location = "";
	                        var nodeArrs = curLocation.split("->");
	                        for (var i = nodeArrs.length - 1; i >= 0; i--) {
	                            location += nodeArrs[i] + "->";
	                        }
	                        location = location.substring(0, location.lastIndexOf("->"));
	                        //  layer.msg(location);
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
	                    layer.msg("请先选择一个父节点");
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
	                $("#" + menuContent).css({ left: "130px", top: "143px" }).slideDown("fast");
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
	            $scope.$emit("menu", attrs["value"]); //此处attrs["value"]为ul中的value值，此处作为标记使用
	            //接受控制器返回的菜单的消息
	            $scope.$on("menuData", function (event, data) {
	                $.fn.zTree.init($("#" + treeDemo), setting, data); //进行初始化树形菜单
	                // $.fn.zTree.init($("#treeDemo2"), setting, data);//进行初始化树形菜单
	                // $("#treeDemo_1_switch").bind("click", {type:"toggle"}, expandNode);
	                // $("#collapseBtn").bind("click", {type:"collapse"}, expandNode);
	            });
	        }
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/15.
	 * @Module :  list factor 知识内容 组件
	 */
	angular.module("knowledgeManagementModule").directive("knowContentConfiguration", ["KnowledgeService", "$templateCache", "$timeout", "$sce", function (KnowledgeService, $templateCache, $timeout, $sce) {
	    // 要素 列表
	    return {
	        restrict: 'A',
	        template: function template(scope, attr) {
	            var result;
	            if (attr["templateType"] == "true") {
	                //如果解析不了，默认的无弹框
	                result = $templateCache.get("has-dialog");
	            } else {
	                result = $templateCache.get("not-dialog");
	            }
	            return result;
	        },
	        link: function link(scope, el, attr, ctr) {
	            scope.dirCont = {
	                search: false,
	                empty: false,
	                appointRelative: "",
	                appointRelativeList: "",
	                addAppoint: addAppoint,
	                leaveAppointEnter: leaveAppointEnter,
	                slideDown: slideDown
	            };
	            scope.$watch("dirCont.appointRelative", function (val, old) {
	                if (val) {
	                    var timer;
	                    if (timer) {
	                        $timeout.cancel(timer);
	                    } else {
	                        timer = $timeout(function () {
	                            scope.dirCont.empty = false;
	                            scope.dirCont.search = true;
	                            KnowledgeService[attr.knowContentConfiguration].save({
	                                "title": val
	                            }, function (response) {
	                                if (response.status == 200) {
	                                    scope.dirCont.search = false;
	                                    if (response.data.length == 0) {
	                                        scope.dirCont.empty = true;
	                                        scope.dirCont.appointRelativeList = [];
	                                    } else {
	                                        scope.dirCont.appointRelativeList = response.data;
	                                        scope.dirCont.empty = false;
	                                    }
	                                } else {}
	                            });
	                        }, 300);
	                    }
	                } else {
	                    scope.dirCont.srearch = false;
	                    scope.dirCont.empty = false;
	                }
	            });
	            //点击添加相关问
	            function addAppoint(item, arr) {
	                console.log(scope.vm.knowledgeRelevantContentList);
	                if (arr.indexOf(item) == -1) {
	                    arr.push(item);
	                }
	                console.log(arr);
	                console.log(scope.vm.knowledgeRelevantContentList);
	            }
	            // 光标移开
	            function leaveAppointEnter() {
	                $timeout(function () {
	                    scope.dirCont.appointRelativeList = []; //清除 列表
	                }, 200);
	                scope.dirCont.empty = false;
	                scope.dirCont.search = false;
	            }
	            function slideDown() {
	                scope.dirCont.slideFlag = !scope.dirCont.slideFlag;
	                $(".senior_div").slideToggle();
	                if (scope.dirCont.slideFlag) {
	                    $(".senior_div").css('overflow', 'visible');
	                }
	            }
	        }
	    };
	}]);
	// 相关问题 键盘选择
	//function selectEvent(e){
	//        var  srcObj = e.srcElement ? e.srcElement : e.target;
	//        var keycode = window.event?e.keyCode:e.which;
	//    switch(keycode){
	//        case 13 :
	//            if(arr.indexOf(item)==-1){
	//                arr.push(item)
	//            }
	//            $scope.vm.appointRelative = null;  //清楚title
	//            $scope.vm.appointRelativeList = [];  //清除 列表
	//            break ;
	//        case 40 :
	//            if(arr.indexOf(item)==-1){
	//                arr.push(item)
	//            }
	//            $scope.vm.appointRelative = null;  //清楚title
	//            $scope.vm.appointRelativeList = [];  //清除 列表
	//            break ;
	//    }
	//}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	/**
	 * Created by miles on 2017/5/27.
	 *
	 * webuploader  ====》》  指令
	 */

	knowledge_static_web.directive("uploaderFactor", ["$parse", function ($parse) {
	    return {
	        restrict: 'EA',
	        scope: {
	            accept: '=',
	            server: '=', //url
	            //item  : '@'
	            type: "=", //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
	            isAuto: "=",
	            selectBtn: "=",
	            "tableList": "="
	        },
	        template: '<span  id="picker" style="float:left">上传线下编辑场景知识</span><span class="f-14 pl-10" style="float:left;margin-top: 5px;">请先<a href="/api/ms/elementKnowledgeAdd/download?fileName=factor_template.xlsx"  class="c-primary">下载模板</a>进行填写</span>',

	        link: function link(scope, element, attrs) {
	            //var $list = angular.element("#thelist");
	            var server = angular.copy(scope.server);
	            var uploader = WebUploader.create({
	                auto: true, // 选完文件后，是否自动上传
	                // swf文件路径
	                swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
	                server: "/api/ms/elementKnowledgeAdd/upload",
	                //accept: {
	                //    title: 'file',
	                //    extensions: 'xls,xlsx',
	                //    mimeTypes: 'file/*'
	                //},
	                // 选择文件的按钮。可选。
	                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	                pick: '#picker'
	                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	                //resize: false,
	                //chunked: true,  // 分片上传大文件
	                //chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
	                //thread: 100,// 最大上传并发数
	                //// 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
	                //disableGlobalDnd: true,
	                //
	                //fileNumLimit: 1,
	                //fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
	                //fileSingleSizeLimit: 5 * 1024 * 1024    // 50 M   single
	            });
	            uploader.on('fileQueued', function (file) {
	                console.log(file + "file  add success");
	            });
	            uploader.on('uploadProgress', function (file, percentage) {
	                var $li = $('#' + file.id),
	                    $percent = $li.find('.progress .progress-bar');
	                // 避免重复创建
	                if (!$percent.length) {
	                    $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' + '<div class="progress-bar" role="progressbar" style="width: 0%">' + '</div> ' + '</div>').appendTo($li).find('.progress-bar');
	                }
	                $li.find('p.state').text('上传中');
	                $percent.css('width', percentage * 100 + '%');
	                console.log(percentage);
	            });
	            uploader.on('uploadError', function (file) {
	                console.log("上传失败");
	            });
	            uploader.on('uploadSuccess', function (file, response) {
	                if (response.status == 500) {
	                    layer.msg("模板错误");
	                } else {
	                    scope.tableList = response;
	                    scope.$apply();
	                }
	                console.log(response);
	            });
	        }
	    };
	}]).directive("knowBatchUp", ["$parse", "ngDialog", "$cookieStore", "$state", "$timeout", "$interval", function ($parse, ngDialog, $cookieStore, $state, $timeout, $interval) {
	    return {
	        scope: {
	            accept: '=',
	            server: '@', //url
	            //item  : '@'
	            type: "=", //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
	            isAuto: "=",
	            templateType: "=",
	            fileName: "="
	        },
	        template: '<div style="overflow: hidden">' + '<span style="float: left" id="picker">选择文件</span>' + '<span style=" margin-left: 10px; float: left; color:#fff;line-height: 22px;" class="btn1 btn_green"  ng-click="upload()">上传</span>' + '</div>',

	        link: function link(scope, element, attrs) {
	            $timeout(function () {
	                var uploader = WebUploader.create({
	                    auto: false, // 选完文件后，是否自动上传
	                    // swf文件路径
	                    swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
	                    formData: {
	                        "userId": USER_ID,
	                        "applicationId": APPLICATION_ID
	                        //"templateType": scope.templateType
	                    }, // 上传参数
	                    // 文件接收服务端。
	                    server: scope.server,
	                    accept: {
	                        title: 'file',
	                        extensions: 'xls,xlsx',
	                        mimeTypes: 'file/*'
	                    },
	                    // 选择文件的按钮。可选。
	                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	                    pick: {
	                        id: '#picker',
	                        //label : '点击选择图片'
	                        //innerHTML: '点击选择'
	                        multiple: false
	                    },
	                    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	                    resize: false,
	                    chunked: true, // 分片上传大文件
	                    chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
	                    thread: 100, // 最大上传并发数
	                    // 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
	                    disableGlobalDnd: true,
	                    fileNumLimit: 2,
	                    fileSizeLimit: 200 * 1024 * 1024, // 200 M    all
	                    fileSingleSizeLimit: 5 * 1024 * 1024 // 50 M   single
	                });
	                scope.upload = function () {
	                    uploader.options.formData.templateType = scope.templateType;
	                    uploader.upload();
	                };
	                uploader.on('beforeFileQueued', function (file) {
	                    uploader.reset();
	                });
	                uploader.on('fileQueued', function (file) {
	                    //uploader.reset();
	                    //console.log(uploader.getfiles())
	                    scope.$apply(function () {
	                        scope.fileName = file.name;
	                    });
	                });
	                //当validate不通过时，会以派送错误事件的形式通知
	                uploader.on('error', function (type) {
	                    switch (type) {
	                        case 'Q_EXCEED_NUM_LIMIT':
	                            layer.msg("错误：上传文件数量过多！");
	                            break;
	                        case 'Q_EXCEED_SIZE_LIMIT':
	                            layer.msg("错误：文件总大小超出限制！");
	                            break;
	                        case 'F_EXCEED_SIZE':
	                            layer.msg("错误：文件大小超出限制！");
	                            break;
	                        case 'Q_TYPE_DENIED':
	                            layer.msg("错误：禁止上传该类型文件！");
	                            break;
	                        case 'F_DUPLICATE':
	                            layer.msg("错误：请勿重复上传该文件！");
	                            break;
	                        default:
	                            layer.msg('错误代码：' + type);
	                            break;
	                    }
	                });
	                uploader.on('uploadProgress', function (file, percentage) {
	                    //var $li = $('#' + file.id),
	                    //    $percent = $li.find('.progress .progress-bar');
	                    //// 避免重复创建
	                    //if (!$percent.length) {
	                    //    $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
	                    //        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
	                    //        '</div> ' +
	                    //        '</div>').appendTo($li).find('.progress-bar');
	                    //}
	                    //$li.find('p.state').text('上传中');
	                    //$percent.css('width', percentage * 100 + '%');
	                    //console.log(percentage);
	                });
	                uploader.on('uploadError', function (file, reason) {
	                    console.log("上传失败");
	                    layer.msg('请检查' + reason);
	                    console.log(reason); //失败原因;
	                });
	                //uploader.on('all', function (type) {
	                //    if (type === 'startUpload') {
	                //        state = 'uploading';
	                //    } else if (type === 'stopUpload') {
	                //        state = 'paused';
	                //    } else if (type === 'uploadFinished') {
	                //        state = 'done';
	                //    }
	                //
	                //    if (state === 'uploading') {
	                //        $btn.text('暂停上传');
	                //    } else {
	                //        $btn.text('开始上传');
	                //    }
	                //});
	                //
	                //$btn.on('click', function () {
	                //    if (state === 'uploading') {
	                //        uploader.stop();
	                //    } else {
	                //        uploader.upload();
	                //    }
	                //});
	                //        单个文件上传成功 之后 刷新数据列表
	                uploader.on('uploadSuccess', function (file, response) {
	                    console.log(response);
	                    if (response.status == 500) {
	                        layer.msg("模板错误");
	                    } else if (response.status == 10001) {
	                        layer.msg("导入失败");
	                    } else {
	                        layer.msg("导入成功");
	                    }
	                });
	                //console.log(scope.templateType)
	                //scope.$watch("templateType",function(type){
	                //    console.log(uploader) ;
	                //    uploader.options.formData.templateType = type ;
	                //})
	            }, 0);
	        }
	    };
	}]);
	// .directive("uploaderHandle2", ["$parse", function($parse) {
	//     return {
	//         restrict:'EA',
	//         scope:{
	//             accept:'=',
	//             server : '='   , //url
	//             //item  : '@'
	//             type : "="   ,   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
	//             isAuto : "=",
	//             selectBtn : "="
	//         },
	//         template:'<div id="uploader" class="wu-example upWrapper">'+
	//             //<!--用来存放文件信息-->
	//         '<div id="thelist" class="uploader-list upList"></div>'+
	//         '<div class="btns">'+
	//         '<div id="picker">上传线下编辑场景知识</div>' +
	//         '<button id="ctlBtn" clas="btn btn-default">开始上传</button>'+
	//         '</div>'+
	//         '</div>'
	//         ,
	//         link:function(scope,element,attrs){
	//             console.log(scope.selectBtn);
	//             var $list = angular.element("#thelist");
	//             var uploader = WebUploader.create({
	//                 auto: true, // 选完文件后，是否自动上传
	//                 // swf文件路径
	//                 swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
	//                 formData : {title:"is Image  ====   uploader"}  ,   // 上传参数
	//                 // 文件接收服务端。
	//                 server: "/api/application/application/uploadHead",
	//                 accept: {
	//                     title: 'file',
	//                     extensions: 'xls,xlsx',
	//                     mimeTypes: 'file/*'
	//                 },
	//                 // 选择文件的按钮。可选。
	//                 // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	//                 pick: '#picker',
	//                 // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	//                 resize: false,
	//                 chunked: true,  // 分片上传大文件
	//                 chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
	//                 thread: 100,// 最大上传并发数
	//                 // 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
	//                 disableGlobalDnd: true,
	//
	//                 fileNumLimit: 300,
	//                 fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
	//                 fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M   single
	//             });
	//             //// 当有文件被添加进队列的时候
	//             //uploader.on( 'fileQueued', function( file ) {
	//             //    $list.append( '<div id="' + file.id + '" class="item">' +
	//             //        '<h4 class="info">' + file.name + '</h4>' +
	//             //        '<p class="state">等待上传...</p>' +
	//             //        '</div>' );
	//             //});
	//             //// 文件上传过程中创建进度条实时显示。
	//             //uploader.on( 'uploadProgress', function( file, percentage ) {
	//             //    var $li = $( '#'+file.id ),
	//             //        $percent = $li.find('.progress .progress-bar');
	//             //    // 避免重复创建
	//             //    if ( !$percent.length ) {
	//             //        $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
	//             //            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
	//             //            '</div>' +
	//             //            '</div>').appendTo( $li ).find('.progress-bar');
	//             //    }
	//             //    $li.find('p.state').text('上传中');
	//             //    $percent.css( 'width', percentage * 100 + '%' );
	//             //    console.log(percentage);
	//             //});
	//             ////文件上传成功
	//             //uploader.on('uploadSuccess', function (file) {
	//             //    $('#' + file.id).find('p.state').text('已上传');
	//             //});
	//             ////文件上传失败
	//             //uploader.on('uploadError', function (file) {
	//             //    $('#' + file.id).find('p.state').text('上传失败');
	//             //});
	//             ////文件上传完成
	//             //uploader.on('uploadComplete', function (file) {
	//             //    $('#' + file.id).find('.progress').fadeOut();
	//             //    //$("#editModal").fadeOut(2000, window.location.reload());
	//             //});
	//             //
	//             //$('#btnSave').bind('click', function () {
	//             //    var  name = $("#txtName").val();
	//             //    var  id = $("#txtId").val();
	//             //
	//             //    if (!name || name.length == 0) {
	//             //        alert("请填写名称");
	//             //        return false;
	//             //    }
	//             //    var obj = new Object();
	//             //    obj.name = name;
	//             //    obj.id = id;
	//             //    uploader.options.formData = obj;
	//             //    //  uploader.options.formData = { "name": name, "id": id, };
	//             //    if (state === 'uploading') {
	//             //        uploader.stop();
	//             //    } else {
	//             //        uploader.upload();
	//             //    }
	//             //});
	//         }
	//     }
	// }])


	// knowledge_static_web.directive("uploaderHandle3", ["$parse",  "$cookieStore" ,
	//     function($parse,$cookieStore) {
	//         return {
	//             restrict:'EA',
	//             scope:{
	//                 accept:'=',
	//                 server : '='   , //url
	//                 //item  : '@'
	//                 type : "="   ,   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
	//                 isAuto : "=",
	//                 selectBtn : "=",
	//                 "tableList" : "=" ,
	//                 userId : "=" ,
	//                 applicationId : "="
	//             },
	//             template:
	//                 '<button  id="picker">选择文件</button>'
	//             ,
	//             link:function(scope,element,attrs){
	//                 var userId = scope.userId ,
	//                     applicationId = scope.applicationId ;
	//                 //var $list = angular.element("#thelist");
	//                 var server = angular.copy(scope.server) ;
	//                 var uploader = WebUploader.create({
	//                     auto: true, // 选完文件后，是否自动上传
	//                     // swf文件路径
	//                     swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
	//                     formData : {"userId":userId,"applicationId":applicationId,"userName":$cookieStore.get("userName")}  ,   // 上传参数
	//                     // 文件接收服务端。
	//                     //server: "/api/application/application/uploadHead",
	//
	//                     server: "/api/ms/chatKnowledge/upload",
	//                     //accept: {
	//                     //    title: 'file',
	//                     //    extensions: 'xls,xlsx',
	//                     //    mimeTypes: 'file/*'
	//                     //},
	//                     // 选择文件的按钮。可选。
	//                     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	//                     pick: '#picker',
	//                     // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	//                     //resize: false,
	//                     //chunked: true,  // 分片上传大文件
	//                     //chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
	//                     //thread: 100,// 最大上传并发数
	//                     //// 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
	//                     //disableGlobalDnd: true,
	//                     //
	//                     //fileNumLimit: 1,
	//                     //fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
	//                     //fileSingleSizeLimit: 5 * 1024 * 1024    // 50 M   single
	//                 });
	//                 uploader.on( 'fileQueued', function( file ) {
	//                     console.log(file + "file  add success");
	//                 });
	//                 uploader.on( 'uploadProgress', function( file, percentage ) {
	//                     var $li = $( '#'+file.id ),
	//                         $percent = $li.find('.progress .progress-bar');
	//                     // 避免重复创建
	//                     if ( !$percent.length ) {
	//                         $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
	//                             '<div class="progress-bar" role="progressbar" style="width: 0%">' +
	//                             '</div> ' +
	//                             '</div>').appendTo( $li ).find('.progress-bar');
	//                     }
	//                     $li.find('p.state').text('上传中');
	//                     $percent.css( 'width', percentage * 100 + '%' );
	//                     console.log(percentage);
	//                 });
	//                 uploader.on('uploadError', function (file) {
	//                     console.log("上传失败")
	//                 });
	//                 uploader.on('uploadSuccess', function (file,response) {
	//                     console.log(response) ;
	//                     if(response.status == 500){
	//                         layer.msg("模板错误")
	//                     }else if(response.status==10001){
	//                         layer.msg("导入失败")
	//                     }else {
	//                         layer.msg("导入成功")
	//                     }
	//
	//
	//                 });
	//
	//             }
	//         }
	//     }])

	/*
	 $scope.accept = {
	 //图片
	 image: {
	 title : 'Images',//标题
	 extensions : 'gif,jpg,jpeg,bmp,png,ico',//允许上传文件的后缀
	 mimeTypes : 'image/*'//允许的mimetype
	 },
	 //音视频
	 video: {
	 title : 'Videos',
	 extensions : 'wmv,asf,asx,rm,rmvb,ram,avi,mpg,dat,mp4,mpeg,divx,m4v,mov,qt,flv,f4v,mp3,wav,aac,m4a,wma,ra,3gp,3g2,dv,vob,mkv,ts',
	 mimeTypes : 'video/*,audio/*'
	 },
	 //flash
	 flash: {
	 title : 'Flashs',
	 extensions : 'swf,fla',
	 mimeTypes : 'application/x-shockwave-flash'
	 },
	 //办公文档，压缩文件等等
	 file: {
	 title : 'Files',
	 extensions : 'zip,rar,ppt,pptx,doc,docx,xls,xlsx,pdf',
	 mimeTypes : 'application/zip,application/x-rar-compressed,application/vnd.ms-powerpoint,application/vnd.openxmlformats-             officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-   excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf'
	 }
	 };
	 */
	// 实例化
	//var uploader = WebUploader.create({
	//    //指定选择文件的按钮容器
	//    //multiple是否开启多文件上传，默认为true
	//    pick : {
	//        id : '#filePicker',
	//        //label : '点击选择图片'
	//        innerHTML: '点击选择' + $scope.selectType[items.type],
	//        multiple: true
	//    },
	//    //指定拖拽的容器
	//    dnd : '#uploader .queueList',
	//    //启用通过截屏来粘贴图片
	//    paste : document.body,
	//    //指定接受哪些类型的文件
	//    accept : items.accept[items.type],
	//
	//    // swf文件路径
	//    swf : 'Uploader.swf',
	//
	//    disableGlobalDnd : true,
	//    //是否分片
	//    chunked : true,
	//    //chunkSize: 700000,  //每个分片的大小，默认为5M
	//    // server: 'http://webuploader.duapp.com/server/fileupload.php',
	//    server : '../demo',
	//    //文件最大数量
	//    fileNumLimit : 30,
	//    //验证文件总大小是否超出限制
	//    fileSizeLimit : 5 * 1024 * 1024, // 200 M
	//    //验证单个文件大小是否超出限制
	//    fileSingleSizeLimit : 1 * 1024 * 1024
	//    // 50 M
	//});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 103 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module : 过滤渠道名称
	 */
	module.exports = function (module) {
	    module.filter('channel', function () {
	        return function (value, params) {
	            var result;
	            angular.forEach(params, function (item) {
	                if (value == item.channelCode) {
	                    result = item.channelName;
	                }
	            });
	            return result;
	        };
	    });
	};

/***/ }),
/* 104 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module : 敏感词名称过滤
	 */
	module.exports = function (module) {
	    module
	    //SensitiveConcept(40, "敏感概念"),
	    //    StopConcept(41, "停用概念"),
	    //    ErrorCorrectionConcept(42, "纠错概念"),
	    //    ThesaurusConcept(43, "同义概念"),
	    //    CollectiveConcept(44, "集合概念"),
	    //    BusinessConcept(45, "业务概念"),
	    //    ForceSegmentConcept(46, "强制分词概念"),
	    //    SemanticExpressionConcept(47, "语义表达式概念"),
	    .filter('classType', function () {
	        return function (value) {
	            switch (value) {
	                case 40:
	                    return "敏感概念";
	                    break;
	                case 41:
	                    return "停用概念";
	                    break;
	                case 42:
	                    return "纠错概念";
	                    break;
	                case 43:
	                    return "同义概念";
	                    break;
	                case 44:
	                    return "集合概念";
	                    break;
	                case 45:
	                    return "业务概念";
	                    break;
	                case 46:
	                    return "强制分词概念";
	                    break;
	                case 47:
	                    return "语义表达式概念";
	                    break;
	            }
	        };
	    });
	};

/***/ }),
/* 105 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module : 表情 字符串 转化
	 */
	module.exports = function (module) {
	    module.filter('emotion', function () {
	        return function (str) {
	            //str = str.replace(/\</g,'&lt;');
	            //
	            //str = str.replace(/\>/g,'&gt;');

	            //str = str.replace(/\n/g,'<br/>');

	            str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/libs/qqFace/arclist/$1.gif" border="0" />');

	            return str;
	        };
	    }).filter('faceToString', function () {
	        return function (face) {
	            var regex = new RegExp('<img src="/libs/qqFace/arclist/([0-9]*).gif" border="0">', "g");
	            face = face.replace(regex, "[em_$1]");
	            //console.log(face)
	            return face;
	        };
	    }).filter('toHtml', ["$sce", function ($sce) {
	        return function (text) {
	            return $sce.trustAsHtml(text);
	        };
	    }]);
	};

/***/ }),
/* 106 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/25.
	 * @Module : 过滤图片名称
	 */
	module.exports = function (module) {
	    module.filter("imgNameFiler", [function () {
	        return function (val, fiterVal) {
	            return val.replace(/(\S+)\.(png|jpg|bmp|gif)/g, "$1");
	        };
	    }]);
	};

/***/ }),
/* 107 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module : 数字标号转化
	 */
	module.exports = function (module) {
	    module.filter('numberToWord', function () {
	        return function (number) {
	            var array = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
	            var result = null;
	            if (number != '') {
	                angular.forEach(array, function (item, index) {
	                    if (index == number - 1) {
	                        result = item;
	                    }
	                });
	            }
	            return result;
	        };
	    });
	};

/***/ }),
/* 108 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * @Author : MILES .
	 * @Create : 2017/8/25.
	 * @Module : 过滤声音文件名称
	 */
	module.exports = function (module) {
	    module.filter("voiceNameFilter", [function () {
	        return function (val) {
	            return val.replace(/(\S+)(\.\S+)$/g, "$1");
	        };
	    }]);
	};

/***/ }),
/* 109 */,
/* 110 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  知识管理总控制器
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('KnowledgeManagementController', ['$scope', 'localStorageService', "$state", "$filter", function ($scope, localStorageService, $state, $filter) {
	        $scope.knowCtr = {
	            selectChannel: selectChannel, //选择渠道
	            checkChannelDimension: checkChannelDimension, // 校验渠道维度保存
	            isExtensionTagRepeat: isExtensionTagRepeat, // 检测扩展问标签是否重复    营销 概念 列表 富文本知识新增
	            rmeoveExtToLocal: rmeoveExtToLocal, //删除扩展问并添加到localStorage , 应用于所有知识编辑
	            setKnowParamHasDialog: setKnowParamHasDialog, //弹框重置参数  应用于概念，faq
	            isBotRepeat: isBotRepeat // 验证Bot 是否重复      For 知识新增bot添加
	        };
	        function selectChannel(self, channelId) {
	            if (self.vm.channelIdList.inArray(channelId)) {
	                self.vm.channelIdList.remove(channelId);
	            } else {
	                self.vm.channelIdList.push(channelId);
	            }
	        }
	        function checkChannelDimension(allcontent, cur, channel, dimension) {
	            var isRepeat = false;
	            //    新增的 channel = []  dimension = [] ,
	            //   页面以添加 scanContent.dimensions   scanContent.channels
	            angular.forEach(allcontent, function (item, contentIndex) {
	                if (cur != contentIndex) {
	                    angular.forEach(item.channelIdList, function (v) {
	                        angular.forEach(channel, function (val) {
	                            if (val == v) {
	                                angular.forEach(item.dimensionIdList, function (value) {
	                                    angular.forEach(dimension, function (key) {
	                                        if (key == value) {
	                                            var channelTip = $filter("channel")(v, $scope.$parent.MASTER.channelList),
	                                                dimensionTip = $filter("dimension")(key, $scope.$parent.MASTER.dimensionList);
	                                            layer.closeAll();
	                                            layer.msg("重复添加" + "渠道 " + channelTip + " 维度 " + dimensionTip);
	                                            isRepeat = true;
	                                        }
	                                    });
	                                });
	                            }
	                        });
	                    });
	                }
	            });
	            return isRepeat;
	        }
	        /**
	         * 检测扩展问标签是否重复
	         * false   return   ；  true  return ext
	         * */
	        function isExtensionTagRepeat(current, allExtension, title, weight) {
	            console.log(allExtension);
	            var isRepeat = true;
	            var tag = [];
	            angular.forEach(current, function (tagList) {
	                angular.forEach(tagList.extensionQuestionTagList, function (item) {
	                    if (item.exist) {
	                        //标签存在情况下
	                        tag.push(item.tagName);
	                    }
	                });
	            });
	            angular.forEach(allExtension, function (extension) {
	                var tagLen = 0;
	                var itemTag = [];
	                angular.forEach(extension.extensionQuestionTagList, function (item) {
	                    if (item.exist) {
	                        //存在标签
	                        itemTag.push(item.tagName);
	                    }
	                    if (tag.inArray(item.tagName) && item.exist) {
	                        //标签重复数量
	                        tagLen += 1;
	                    }
	                });
	                if (tagLen == itemTag.length && tag.length == itemTag.length && weight == extension.extensionQuestionType) {
	                    layer.msg('根据"' + title + '"生成扩展问重复,已阻止添加');
	                    return isRepeat = false;
	                }
	            });
	            //判断是否是重复
	            if (isRepeat != false) {
	                var extension = {
	                    "extensionQuestionTitle": title,
	                    "extensionQuestionType": weight,
	                    "extensionQuestionTagList": []
	                };
	                angular.forEach(current, function (tagList) {
	                    angular.forEach(tagList.extensionQuestionTagList, function (item) {
	                        var tagTem = {
	                            "exist": item.exist,
	                            "tagClass": item.tagClass,
	                            "tagName": item.tagName,
	                            "tagType": item.tagType
	                        };
	                        extension.extensionQuestionTagList.push(tagTem);
	                    });
	                });
	                isRepeat = extension;
	            }
	            return isRepeat;
	        }
	        /**
	         *  知识编辑 删除扩展问 本地备份
	         *  isEdit  在编辑情况下使用
	         *  概念 ： cust_concept_ext   ； faq ： cust_faq_ext
	         *  列表 ： cust_list_ext      ；要素 ： cust_factor_ext
	         *  富文本 ： cust_rich_text_ext
	         * */
	        function rmeoveExtToLocal(isEdit, localName, item) {
	            //
	            if (isEdit) {
	                //localStorageService.clearAll() ;
	                var local = localStorageService.get(localName);
	                if (local) {
	                    local.push(item);
	                    localStorageService.set(localName, local);
	                } else {
	                    localStorageService.set(localName, new Array(item));
	                }
	                console.log(localStorageService.get(localName));
	            }
	        }
	        function setKnowParamHasDialog(self) {
	            self.vm.newTitle = "";
	            self.vm.channelIdList = [];
	            self.vm.question = 1; //显示相关问
	            self.vm.tip = 1; //在提示
	            self.vm.tail = 1; //弹出评价小尾巴
	            self.vm.knowledgeRelevantContentList = []; //业务扩展问
	            self.vm.dimensionArr = [];
	        }
	        function isBotRepeat(id, path, type, allBot) {
	            //className  classificationId  classificationType(不推送)
	            //重复 提示   不重复返回bot对象
	            // 校验对象  className
	            var result = { //定义bot对象
	                "className": path,
	                "classificationId": id,
	                "classificationType": type ? type : 67
	            }; //返回對象
	            var len = allBot.length; //所有bot 長度
	            // 集合转为string 便于比较  并不改变原数组
	            var backUpPath = angular.copy(path).join("/");
	            if (len) {
	                //需要验证
	                angular.forEach(allBot, function (item) {
	                    console.log(item.className.join("/"), backUpPath);
	                    if (item.className.join("/") == backUpPath) {
	                        result = false;
	                        return layer.msg("添加分类重复，已阻止添加");
	                    }
	                });
	            }
	            return result;
	        }
	    }]);
	};

/***/ })
]));