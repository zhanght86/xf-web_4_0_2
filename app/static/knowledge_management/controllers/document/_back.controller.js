/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  文档加工
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('BackController',
    ['$scope', '$location', "$interval", "$timeout", "$state",
   ($scope, $location, $interval, $timeout, $state)=> {
        $state.go("back.gateway");
    }
])};