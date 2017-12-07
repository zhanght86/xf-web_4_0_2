webpackHotUpdate(13,{

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/12/6.
	 * @Module :  faq知识新增
	 */
	module.exports = function (knowledgeManagementModule) {
	    knowledgeManagementModule.controller('FaqNewController', ['$scope', 'localStorageService', "KnowledgeService", "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "$stateParams", "$window", "$rootScope", "$filter", "$location", function ($scope, localStorageService, KnowledgeService, $state, ngDialog, $cookieStore, $timeout, $compile, $stateParams, $window, $rootScope, $filter, $location) {
	        console.log($stateParams);
	        $timeout(function () {
	            // $location.path("/KM/faq/edit")
	            $state.go("KM.faq.edit");
	        }, 1000);
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
	            if (!$scope.vm.newTitle && !$scope.vm.channelIdList.length) {
	                layer.msg("请填写知识内容,并选择渠道后保存");
	            } else if (!$scope.vm.newTitle) {
	                layer.msg("请填写知识内容后保存");
	            } else if (!$scope.vm.channelIdList.length) {
	                layer.msg("请选择渠道后保存");
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

/***/ })

})