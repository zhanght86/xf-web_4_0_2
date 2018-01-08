
/**
 * @Author : George .
 * @Create : 2017/12/12.
 * @Module : 统计分析
 */

 module.exports = angular => {
    const applAnalysisModule = angular.module('applAnalysisModule', []);
 	 require('../controllers/_main.controller')(applAnalysisModule);  // 控制器
     require('../../index/controllers/home_page/_nav.controller')(applAnalysisModule);  // 导航
    //--------------------------------------------------
    //         server
    //--------------------------------------------------
    require('../server/_application_analysis.server')(applAnalysisModule);  // 服务
    
    //--------------------------------------------------
    //         controller
    //--------------------------------------------------
    // ------    访问统计 -------//
    require('../controllers/access_statistics/_access_statistics.controller')(applAnalysisModule);       // 访问统计
    
    require('../controllers/knowledge_ranking/_knowledge_ranking.controller')(applAnalysisModule);       // 知识点排名统计

    require('../controllers/session_details/_session_details.controller')(applAnalysisModule);       // 会话明细统计
   
    require('../controllers/satisfaction_degree/_satisfaction_degree.controller')(applAnalysisModule);       // 会话满意度统计

    require('../controllers/resolution_statistics/_resolution_statistics.controller')(applAnalysisModule);       // 问答解决率统计
   
    require('../controllers/reinforcement_learn/_reinforcement_learn.controller')(applAnalysisModule);       // 智能学习
    
    require('../controllers/new_know_discovery_learn/_new_know_discovery_learn.controller')(applAnalysisModule);       // 为匹配问题统计


   
    require('../controllers/session_log/_session_log.controller')(applAnalysisModule);       // 会话日志

 }


