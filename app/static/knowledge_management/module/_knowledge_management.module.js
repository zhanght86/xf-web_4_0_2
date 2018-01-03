/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 知识管理
 */
module.exports = angular => {
    const knowledgeManagementModule = angular.module('knowledgeManagementModule', []);

    require('../controllers/_main.controller')(knowledgeManagementModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(knowledgeManagementModule);  // 导航

    //--------------------------------------------------
    //         server
    //--------------------------------------------------
    require('../server/_knowledge.service')(knowledgeManagementModule);  // 服务
    require('../server/_doc.server')(knowledgeManagementModule);         // 服务
    //--------------------------------------------------
    //         controller
    //--------------------------------------------------
    // ------    知识总览 -------//
    require('../controllers/overview/_cust_overview.controller')(knowledgeManagementModule);          // 总览
    require('../controllers/overview/_cust_preview.controller')(knowledgeManagementModule);           // 查看
    require('../controllers/overview/_scan.controller')(knowledgeManagementModule);                   // 预览
    // ------    单条新增 编辑 -------//
    require('../controllers/single/_concept_new.controller')(knowledgeManagementModule);              // 概念新增
    require('../controllers/single/_concept_edit.controller')(knowledgeManagementModule);             // 概念编辑
    require('../controllers/single/_faq_new.controller')(knowledgeManagementModule);                  // faq新增
    require('../controllers/single/_faq_edit.controller')(knowledgeManagementModule);                 // faq编辑
    require('../controllers/single/_list_new.controller')(knowledgeManagementModule);                 // 列表新增
    require('../controllers/single/_list_edit.controller')(knowledgeManagementModule);                // 列表编辑
    require('../controllers/single/_factor_new.controller')(knowledgeManagementModule);               // 要素新增
    require('../controllers/single/_factor_edit.controller')(knowledgeManagementModule);              // 要素编辑
    require('../controllers/single/_rich_text_new.controller')(knowledgeManagementModule);            // 富文本新增
    require('../controllers/single/_rich_text_edit.controller')(knowledgeManagementModule);           // 富文本编辑
    require('../controllers/single/_dialogue_new.controller')(knowledgeManagementModule);             // 对话新增
    require('../controllers/single/_dialogue_edit.controller')(knowledgeManagementModule);            // 对话编辑
    // ------    知识批量新增  -------//
    require('../controllers/batch/_batch.controller')(knowledgeManagementModule);                     // 批量新增
    // ------    文档加工  ----------//
    require('../controllers/document/_analyse_task.controller')(knowledgeManagementModule);           //
    require('../controllers/document/_back.controller')(knowledgeManagementModule);                   //
    require('../controllers/document/_create_tem.controller')(knowledgeManagementModule);             //
    require('../controllers/document/_doc_results_view.controller')(knowledgeManagementModule);       //
    require('../controllers/document/_doc_select.controller')(knowledgeManagementModule);             //
    require('../controllers/document/_tem.controller')(knowledgeManagementModule);                    //
    // ------    历史查看  ----------//
    require('../controllers/history/_history_view.controller')(knowledgeManagementModule);            // 历史查看
    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
    require('../directives/_bot.directive')(knowledgeManagementModule);
    // require('../directives/_business_frame.directive')(knowledgeManagementModule);
    // require('../directives/_contenteditable.directive')(knowledgeManagementModule);
    require('../directives/_date.directive')(knowledgeManagementModule);
    require('../directives/_emotion.directive')(knowledgeManagementModule);
    require('../directives/_ext_add.directive')(knowledgeManagementModule);
    require('../directives/_gateway_menu.directive')(knowledgeManagementModule);
    require('../directives/_know_content_configuration.directive')(knowledgeManagementModule);
    require('../directives/_upload')(knowledgeManagementModule);
    //--------------------------------------------------
    //         filter
    //--------------------------------------------------
    require('../filters/_channel.filter')(knowledgeManagementModule);
    require('../filters/_class_type.filter')(knowledgeManagementModule);
    require('../filters/_emotion')(knowledgeManagementModule);
    require('../filters/_img_name.filter')(knowledgeManagementModule);
    require('../filters/_number_to_word.filter')(knowledgeManagementModule);
    require('../filters/_voice_name.filter')(knowledgeManagementModule);

    //--------------------------------------------------
    //         页面缓存
    //--------------------------------------------------
    knowledgeManagementModule
        .run(function($templateCache){
        // 知识内容配置
        $templateCache.put("has-dialog",require("../views/components/know_content_has_dialog.html"));
        $templateCache.put("not-dialog",require("../views/components/know_content_not_dialog.html"));
        // bot 选择框
        $templateCache.put("bot-class",require("../views/components/bot.html"));

        $templateCache.put("bot-class-not-dialog",require("../views/components/bot_not_dialog.html"));
        //扩展问
        $templateCache.put("ext",require("../views/components/ext.html"));
        $templateCache.put("ext-not-dialog",require("../views/components/ext_not_dialog.html"));
        // 时间选择
        $templateCache.put("select-start-end-time",require("../views/components/select_start_end_time.html"));
        $templateCache.put("select-start-end-time-not-dialog",require("../views/components/select_start_end_time.html"));
    });
};


