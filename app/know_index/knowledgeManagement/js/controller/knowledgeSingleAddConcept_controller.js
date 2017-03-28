/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowledgeSingleAddConceptController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            KnowledgeAdd: KnowledgeAdd,
            knowledgeBot:knowledgeBot,
            password: '',
            isTimeTable : false,
            timeFlag : "启用",
        };
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
            });
        function knowledgeBot(ev,lev){
            var ele = ev.target;
            if(lev == 0){
                $(ele).next().show().children().show().slideDown()
            }else{
                $(ele).parent().parent().next().show().slideDown()
            }
        }
       function KnowledgeAdd(){
           var dialog = ngDialog.openConfirm({
               template:"/know_index/knowledgeManagement/knowledgeAddSingleConceptDialog.html",
               //controller:function($scope){
               //    $scope.show = function(){
               //
               //        console.log(6688688);
               //        $scope.closeThisDialog(); //关闭弹窗
               //    }},
               scope: $scope,
               closeByDocument:false,
               closeByEscape: true,
               showClose : true,
               backdrop : 'static',
               preCloseCallback:function(e){    //关闭回掉
                   if(e === 1){
                   }
               }
           });
       }


    }
]);