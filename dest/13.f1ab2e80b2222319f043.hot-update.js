webpackHotUpdate(13,{

/***/ 70:
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

/***/ 110:
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

})