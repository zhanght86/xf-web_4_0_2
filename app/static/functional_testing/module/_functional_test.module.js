
'use strict';

// Define the `phoneDetail` module
// angular.module('functionalTestModule', [
//     'know'
// ]);
module.exports = angular => {
    const functionalTestModule = angular.module('functionalTestModule', []);
    require('../controllers/_main.controller')(functionalTestModule);           //控制器
    require('../../index/controllers/home_page/_nav.controller')(functionalTestModule);   //导航
    //--------------------------------------------------
    //          directive
    //--------------------------------------------------
    //require('../../../components/page/page')(functionalTestModule);  // 分页
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------

    //----测试-----

    require('../controllers/test_tools/question_test/_question_test.controller')(functionalTestModule);
    require('../controllers/test_tools/session_test/_session_test.controller')(functionalTestModule);
    require('../controllers/test_tools/batch_test/_batch_test.controller')(functionalTestModule);
   //----分词-----

    require('../controllers/participle_tool/_participle.controller')(functionalTestModule);

    //----学习-----
    require('../controllers/division_knowledge/correction_learning/_correction_learning.controller')(functionalTestModule);
    require('../controllers/division_knowledge/reinforcement_learn/_reinforcement_learn.controller')(functionalTestModule);
    require('../controllers/division_knowledge/new_know_discovery_learn/_new_know_discovery_learn.controller')(functionalTestModule);

    //--------------------------------------------------
    //          server
    //--------------------------------------------------
    require('../server/_function.server')(functionalTestModule);


    //--------------------------------------------------
    //         directive
    //--------------------------------------------------
    require('../directives/_batch_test.directive')(functionalTestModule);
    require('../directives/_part_test.directive')(functionalTestModule);
    //--------------------------------------------------
    //         filters
    //--------------------------------------------------
    require('../filters/_float.filter')(functionalTestModule);
    require('../filters/_replace_code.filter')(functionalTestModule);




}



