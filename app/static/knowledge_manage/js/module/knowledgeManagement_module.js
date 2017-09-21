/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('knowledgeManagementModule', [
    'know'
]).run(function($templateCache){
    $templateCache.put("has-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_has_dialog.html\'"></div>');
    $templateCache.put("not-dialog",'<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
    $templateCache.put("bot-class",'<div ng-include="\'/static/knowledge_manage/components/know_content_not_dialog.html\'"></div>');
});


