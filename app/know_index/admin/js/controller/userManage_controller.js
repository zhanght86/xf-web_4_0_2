/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('userManageController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService, $state,$timeout,$stateParams,ngDialog) {

        $scope.vm = {
            addUser : addUser,
            editUser : editUser,
            deleteUser:deleteUser
        };
        function addUser(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog.html",
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
        function editUser(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog2.html",
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
        function deleteUser(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
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