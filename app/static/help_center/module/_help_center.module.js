/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

module.exports = angular =>{
    const helpCenterModule = angular.module('helpCenterModule',[]);
    require('../controllers/_main.controller')(helpCenterModule);           //控制器
    require('../../index/controllers/home_page/_nav.controller')(helpCenterModule);   //导航
    //--------------------------------------------------
    //          directive
    //--------------------------------------------------
    require('../../../components/page/page')(helpCenterModule);  // 分页
    //--------------------------------------------------
    //          controller
    //--------------------------------------------------
    require('../controllers/common_problem/_common_problem.controller')(helpCenterModule);

    //--------------------------------------------------
    //          server
    //--------------------------------------------------



    //--------------------------------------------------
    //         directive
    //--------------------------------------------------


}

