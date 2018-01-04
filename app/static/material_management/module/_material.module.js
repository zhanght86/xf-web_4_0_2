/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

module.exports = angular =>{
    require("../../../assets/libs/angular-ueditor/dist/angular-ueditor") ;
    const materialModule = angular.module("materialModule",["ng.ueditor"]);
    require('../controllers/_main.controller')(materialModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(materialModule);  // 导航
    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
   // require('../../../components/page/page')(materialModule);  // 分页
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    //聊天知识库
    require('../controllers/chat/knowledge_base/_knowledge_base.controller')(materialModule);
    require('../controllers/chat/know_add/_know_add.controller')(materialModule);
    require('../controllers/chat/know_edit/_know_edit.controller')(materialModule);

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
    require('../directives/_voice_upload.directive')(materialModule);               //语音
    require('../directives/_teletext_upload.directive')(materialModule);            //图文
    require('../directives/_uploader.directive')(materialModule);                   //聊天知识库
   // require('../directives/_searchinput.directive')(materialModule);
   // require('../directives/_enternextline.directive')(materialModule);

  // 富文本编辑器
    

}

