/**
 * @Author : niunf .
 * @Create : 2017/9/12.
 * @Module : 素材管理
 */
//"use strict";
class SystemServer {
    constructor($resource) {
                        /******************************
                            *操作日志*   API_ANALYSIS = "/api/analysis" ;
                         ********************************/
        //表格列表
        this.getOpeData = $resource(API_ANALYSIS+'/operation/log/search',{},{});
                    /******************************
                        *资源监控*   API_ANALYSIS = "/api/analysis" ;
                     ********************************/
        this.getData = $resource(API_ANALYSIS+'/monitoringServer/monitoring',{},{});

                    /******************************
                        *服务监控*   API_ANALYSIS = "/api/analysis" ;
                     ********************************/
        this.getServiceDate = $resource(API_ANALYSIS+'/serviceMonitoring/monitoring',{},{});
        
        //根据id查询-聊天知识库
        this.searchById = $resource(API_MATERIAL+'/chat/knowledge/get/by/id',{},{});
        //根据id查询-faq
        this.searchByIdFaq = $resource(API_MS+'/knowledge/FAQ/get/:knowledgeId',{},{});
        //根据id查询-概念
        this.searchByIdCon = $resource(API_MS+'/knowledge/concept/get/:knowledgeId',{},{});
        //根据id查询-列表
        this.searchByIdList = $resource(API_MS+'/knowledge/list/get/:knowledgeId',{},{});
        //根据id查询-任务
        this.searchByIdTask = $resource(API_MS+'/knowledge/task/get/:knowledgeId',{},{});
        //根据id查询-对话
        this.searchByIdDialogue = $resource(API_MS+'/knowledge/dialogue/get/:knowledgeId',{},{});





    }
}
SystemServer.$inject = ['$resource'];
module.exports = systemMonitoringModule =>{
    systemMonitoringModule.
    service("SystemServer",SystemServer)
} ;


