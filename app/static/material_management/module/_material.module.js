/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

module.exports = angular =>{
    const materialModule = angular.module("materialModule",[]);
    require('../controllers/_main.controller')(materialModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(materialModule);  // 导航

    require('../../index/controllers/home_page/_nav.controller')(materialModule);  // 导航
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    //聊天知识库
    require('../controllers/chat/knowledge_base/_knowledge_base.controller')(materialModule);
    require('../controllers/chat/know_add/_know_add.controller')(materialModule);

    //图片库
    require('../controllers/picture_library/_picture_library.controller')(materialModule);
    //语音库
    require('../controllers/voice_library/_voice_library.controller.js')(materialModule);
    //文档库
    require('../controllers/document_library/_document_library.controller')(materialModule);
    //图文消息
    require('../controllers/teletext_message/_teletext_message.controller')(materialModule);
    require('../controllers/teletext_message/_add_tw_mes.controller')(materialModule);
    require('../controllers/teletext_message/_graphic_details.controller')(materialModule);


    //--------------------------------------------------
    //          server
    //--------------------------------------------------
    require('../server/_material.server')(materialModule);
    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
    require('../directives/_doc_upload.directive')(materialModule);                //文档
    require('../directives/_img_upload.directive')(materialModule);                //图片
    require('../directives/_teletext_upload.directive')(materialModule);            //图文
    require('../directives/_uploader.directive')(materialModule);                   //聊天知识库
    require('../directives/_voice_upload.directive')(materialModule);               //语音




}

