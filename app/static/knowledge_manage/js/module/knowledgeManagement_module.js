/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('knowledgeManagementModule', [
    'know'
]).run(function($templateCache){
    // 知识内容配置
    $templateCache.put("has-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_has_dialog.html\'"></div>');
    $templateCache.put("not-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
    // bot 选择框
    $templateCache.put("bot-class",'<div ng-include="\'/static/knowledge_manage/components/bot.html\'"></div>');
    $templateCache.put("bot-class-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/bot_not_dialog.html\'"></div>');
    //扩展问
    $templateCache.put("ext",'<div ng-include="\'/static/knowledge_manage/components/ext.html\'"></div>');
    $templateCache.put("ext-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/ext_not_dialog.html\'"></div>');
    // 时间选择
    $templateCache.put("select-start-end-time",'<div ng-include="\'/static/knowledge_manage/components/select_start_end_time.html\'"></div>');
    $templateCache.put("select-start-end-time-not-dialog",'<div ng-include="\'/static/knowledge_manage/components/select_start_end_time_not_dialog.html\'"></div>');
});


