/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('conceptChatController', [
    '$scope',"$state","ngDialog", function ($scope,$state,ngDialog) {
        //alert()
        //$state.go("materialManagement.conceptChat");
        $scope.vm = {
            addKnow:addKnow,
            editKnow:editKnow
        };
        function addKnow(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/conceptChatDialog.html",
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
        function editKnow(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/conceptChatDialog2.html",
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