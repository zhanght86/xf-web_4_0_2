/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
angular.module("materialManagement").service("MaterialServer",["$resource",function($resource){

                /******************************
                                  *聊天知识库*    API_MATERIAL = "/api/ms",
                            ********************************/
//聊天知识库
    //删除知识
    this.delKnowledge = $resource(API_MATERIAL+"/chatKnowledge/deleteConceCptChatKnowledge", {}, {});
    //查询
    this.searchKnow = $resource(API_MATERIAL+'/chatKnowledge/queryChatKnowledge',{},{});
    //请求列表
    this.getData = $resource(API_MATERIAL+'/chatKnowledge/queryChatKnowledge',{},{});

//聊天知识库预览
    //保存          
                                                         
    this.addFAQChatKnowledge = $resource(API_MATERIAL+'/chatKnowledge/addFAQChatKnowledge',{},{}); //faq 新增保存
    this.addConceCptChatKnowledge = $resource(API_MATERIAL+'/chatKnowledge/addConceCptChatKnowledge',{},{});   //概念保存；
                                                             
//faq 聊天新增
    //扩展问
    this.addExtension = $resource(API_MATERIAL+'/chatKnowledge/checkFAQChatQuestion',{},{});
    this.addContent = $resource(API_MATERIAL+'/chatKnowledge/checkChatKnowledgeContent',{},{});  //概念新增
                                                

//概念聊天新增
    //扩展问
    this.addExtension2 = $resource(API_MATERIAL+'/chatKnowledge/checkConceCptChatQuestion',{},{});
                        /********************************
                                    * 图片库
                                ***********************************/
    //获取列表
    this.getList = $resource(API_MATERIAL+'/picture/queryPicture',{},{});
    //删除图片
    this.deleteImg = $resource(API_MATERIAL+'/picture/batchDeletePicture',{},{});
    //updateImg
    this.updateImg = $resource(API_MATERIAL+'/picture/updatePicture',{},{});
                        /********************************
                                * 语音库
                                ***********************************/
    //获取列表
    this.getVoiceList = $resource(API_MATERIAL+'/voiceManage/queryVioce',{},{});
    //查询
    this.searchVoice = $resource(API_MATERIAL+'/voiceManage/queryVioce',{},{});
    //updateVoice
    this.updateVoice = $resource(API_MATERIAL+'/voiceManage/updateVoiceName',{},{});
    //批量删除
    this.batchDeleteVoice =$resource(API_MATERIAL+'/voiceManage/batchDeleteVoice',{},{});
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
    //编辑
    



}]);
