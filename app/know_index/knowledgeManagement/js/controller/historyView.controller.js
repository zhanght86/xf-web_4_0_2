/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('historyViewController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader",
    "knowledgeAddServer","$window","$stateParams","$interval","$filter","$animate",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,
              knowledgeAddServer,$window,$stateParams,$interval,$filter,$animate) {
        $scope.vm = {
            pageSize : 5,            //每页条数；
            paginationConf : '',     //分页条件


        };
        //分页定时器
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    //showData(current);
                }, 100);
            }
        },true);



    }
]);