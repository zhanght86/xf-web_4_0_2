/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  业务建模  ， 加载依赖
 */
module.exports = angular => {
    const businessModelingModule = angular.module('businessModelingModule', []);
    require('../controllers/_main.controller')(businessModelingModule);  // 控制器
    require('../../index/controllers/home_page/_nav.controller')(businessModelingModule);  // 导航
    require('../../../components/page/page')(businessModelingModule);  // 分页
    //--------------------------------------------------
    //          filters
    //--------------------------------------------------
    require('../filters/_type_filter.filter')(businessModelingModule);  // 服务
    require('../filters/_weight')(businessModelingModule);  // 服务
    //--------------------------------------------------
    //          directive
    //--------------------------------------------------
    require('../../../components/switch_turn/_switch_turn.directive')(businessModelingModule);  // 开关

    require('../../../components/WeightFilter/WeightFilter')(businessModelingModule);  // 开关

    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    // BOT
    require('../controllers/bot/_bot.controller')(businessModelingModule);           // bot
    require('../controllers/bot/_bot_apply.controller')(businessModelingModule);           // bot套用

    // 框架库
    require('../controllers/concept/_aggregate.controller')(businessModelingModule);            // 同义
    require('../controllers/concept/_synonym.controller')(businessModelingModule);               // 集合
    require('../controllers/concept/_business.controller')(businessModelingModule);                  // 业务
    require('../controllers/concept/_sensitive.controller')(businessModelingModule);            // 敏感
    require('../controllers/concept/_disable.controller')(businessModelingModule);              // 停用
    require('../controllers/concept/_enforcement.controller')(businessModelingModule);          // 强制分词
    require('../controllers/concept/_bot.controller')(businessModelingModule);                  // bot

    // 概念库
    require('../controllers/frame/_framework_library.controller')(businessModelingModule);             // 框架库

    //--------------------------------------------------
    //          server
    //--------------------------------------------------
    require('../server/_business_modeling.server')(businessModelingModule);
    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
  
} ;

