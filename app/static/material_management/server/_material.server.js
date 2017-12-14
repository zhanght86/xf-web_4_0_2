/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
class MaterialServer {
    constructor($resource) {

                /******************************
                                  *聊天知识库*    API_MATERIAL = "/api/material",
                            ********************************/
//聊天知识库
    //查询
    this.searchKnow = $resource(API_MATERIAL+'/chat/knowledge/query/chat/knowledge',{},{});
    //删除知识
    this.delKnowledge = $resource(API_MATERIAL+"/chat/knowledge/delete", {}, {});
    //导出
    this.exportChat = API_MATERIAL+'/chat/knowledge/export';
                        /******************************
                                            *新增*    API_MATERIAL = "/api/material",
                         ********************************/

    //新增保存
    this.faqSave = $resource(API_MATERIAL+'/chat/knowledge/add',{},{});
    //标题校验
    this.checkKnowTitle = $resource(API_MATERIAL+'/chat/knowledge/check/topic',{},{});
    //扩展问校验
    this.addExtension = $resource(API_MATERIAL+'/chat/knowledge/check/question',{},{});



//  编辑保存
    this.saveChatKnowledge = $resource(API_MATERIAL+'/chat/knowledge/update',{},{});






                        /********************************
                                    * 图片库
                                ***********************************/
    //获取列表
    this.getList = $resource(API_MATERIAL+'/picture/query',{},{});
    //删除图片
    this.deleteImg = $resource(API_MATERIAL+'/picture/batch/delete',{},{});
    //updateImg
    this.updateImg = $resource(API_MATERIAL+'/picture/update',{},{});
    //图片导出
    this.exportImg =API_MATERIAL+'/picture/export' ;
    //修改名称校验
    this.checkName = $resource(API_MATERIAL+'/picture/check/name',{},{});
                        /********************************
                                * 语音库    API_MATERIAL = "api/material"
                                ***********************************/
    //获取列表  查询
    this.searchVoice = $resource(API_MATERIAL+'/voice/query',{},{});
    //updateVoice
    this.updateVoice = $resource(API_MATERIAL+'/voice/update',{},{});
    //批量删除
    this.batchDeleteVoice =$resource(API_MATERIAL+'/voice/batch/delete',{},{});
    //语音导出
    this.exportVoice =API_MATERIAL+'/voice/export' ;
    //语音名称校验
    this.checkVoice = $resource(API_MATERIAL+'/voice/check/name',{},{}) ;

    
                        /********************************
                                * 图文消息
                                ***********************************/
//图文消息首页
    //查询
    this.showImg = $resource(API_MATERIAL+'/graphic/message/query',{},{});
    
    //删除
    this.removeImg = $resource(API_MATERIAL+'/graphic/message/batch/delete',{},{});
                                                                
//图文详情页
    //getImgText
    this.getImgText = $resource(API_MATERIAL+'/graphic/message/find/graphic/by/id',{},{});
                                                
//添加图文消息
    //获取本地图片
    this.getPicList = $resource(API_MATERIAL+'/picture/query',{},{});
    //getIp
    //this.getIp = $resource(API_MATERIAL+'/picture/getIP',{},{});
    //图文消息保存
    // 编辑
    this.editTwApi = $resource(API_MATERIAL+'/graphic/message/update',{},{});
    //添加
    this.addTwApi = $resource(API_MATERIAL+'/graphic/message/insert',{},{});
    //图文名称校验
    this.checkTitle = $resource(API_MATERIAL+'/graphic/message/check/title',{},{});

                        /********************************
                                    * 文档库
                         ***********************************/
    //查询
    this.searchDoc = $resource(API_MATERIAL+'/document/query',{},{});
    //导出
    this.exportDoc = API_MATERIAL+'/document/export';
    //删除
    this.deleteDoc = $resource(API_MATERIAL+'/document/batch/delete',{},{});
    //文档更新
    //this.updateDoc = $resource(API_MATERIAL+'/document/update',{},{});
    //校验名称
    //this.checkDocName = $resource(API_MATERIAL+'/document/check/name',{},{});

    }
}
MaterialServer.$inject = ['$resource'];
module.exports = materialModule =>{
    materialModule.
    service("MaterialServer",MaterialServer)} ;
