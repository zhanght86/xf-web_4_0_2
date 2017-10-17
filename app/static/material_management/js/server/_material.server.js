/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
angular.module("materialManagement").service("MaterialServer",["$resource",function($resource){

                /******************************
                                  *聊天知识库*    API_MATERIAL = "/api/material",
                            ********************************/
//聊天知识库
    //查询
    this.searchKnow = $resource(API_MATERIAL+'/chatKnowledge/queryChatKnowledge',{},{});
    //请求列表
    this.getData    = $resource(API_MATERIAL+'/chatKnowledge/queryChatKnowledge',{},{});
    //删除知识
    this.delKnowledge = $resource(API_MATERIAL+"/chatKnowledge/deleteChatKnowledge", {}, {});
    //导出
    this.exportChat = API_MATERIAL+'/chatKnowledge/exportExcel';



//聊天知识库预览
    this.saveChatKnowledge = $resource(API_MATERIAL+'/chatKnowledge/updateChatKnowledge',{},{});

//faq 、概念 聊天新增
    //扩展问校验 （faq  概念）
    this.addExtension = $resource(API_MATERIAL+'/chatKnowledge/checkChatQuestion',{},{});
    //新增保存  （faq 概念）
    this.faqSave = $resource(API_MATERIAL+'/chatKnowledge/addChatKnowledge',{},{});


                        /********************************
                                    * 图片库
                                ***********************************/
    //获取列表
    this.getList = $resource(API_MATERIAL+'/picture/queryPicture',{},{});
    //删除图片
    this.deleteImg = $resource(API_MATERIAL+'/picture/batchDeletePicture',{},{});
    //updateImg
    this.updateImg = $resource(API_MATERIAL+'/picture/updatePicture',{},{});
    //图片导出
    this.exportImg =API_MATERIAL+'/picture/exportExcel' ;
                        /********************************
                                * 语音库
                                ***********************************/
    //获取列表  查询
    this.searchVoice = $resource(API_MATERIAL+'/voiceManage/queryVioce',{},{});
    //updateVoice
    this.updateVoice = $resource(API_MATERIAL+'/voiceManage/updateVoiceName',{},{});
    //批量删除
    this.batchDeleteVoice =$resource(API_MATERIAL+'/voiceManage/batchDeleteVoice',{},{});
    //语音导出
    this.exportVoice =API_MATERIAL+'/voiceManage/exportExcel' ;
                        /********************************
                                * 图文消息
                                ***********************************/
//图文消息首页
    //查询
    this.showImg = $resource(API_MATERIAL+'/graphicMessage/queryGraphicMessage',{},{});

    //删除
    this.removeImg = $resource(API_MATERIAL+'/graphicMessage/deleteGraphicMessage',{},{});
//图文详情页
    //getImgText
    this.getImgText = $resource(API_MATERIAL+'/graphicMessage/findOneGraphicMessage',{},{});
                                                
//添加图文消息
    //getIp
    this.getIp = $resource(API_MATERIAL+'/picture/getIP',{},{});
    //获取本地图片
    this.getPicList = $resource(API_MATERIAL+'/picture/queryPicture',{},{});
    //图文消息保存
    // 编辑
    this.editTwApi = $resource(API_MATERIAL+'/graphicMessage/update',{},{});
    //添加
    this.addTwApi = $resource(API_MATERIAL+'/graphicMessage/insert',{},{});




}]);
