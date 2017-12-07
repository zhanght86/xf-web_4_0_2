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
	    // knowledgeManagementModule
	    //     .run(function($templateCache){
	    //     // 知识内容配置
	    //     $templateCache.put("has-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_has_dialog.html\'"></div>');
	    //     $templateCache.put("not-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
	    //     // bot 选择框
	    //     $templateCache.put("bot-class",'<div ng-include="\'/static/knowledge_manage/components/bot.html\'"></div>');
	    //     $templateCache.put("bot-class-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/bot_not_dialog.html\'"></div>');
	    //     //扩展问
	    //     $templateCache.put("ext",'<div ng-include="\'/static/knowledge_manage/components/ext.html\'"></div>');
	    //     $templateCache.put("ext-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/ext_not_dialog.html\'"></div>');
	    //     // 时间选择
	    //     $templateCache.put("select-start-end-time",'<div ng-include="\'/static/knowledge_manage/components/select_start_end_time.html\'"></div>');
	    //     $templateCache.put("select-start-end-time-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/select_start_end_time_not_dialog.html\'"></div>');
	    // });
	};

/***/ })

})