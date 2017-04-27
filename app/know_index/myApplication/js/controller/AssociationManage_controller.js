/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationSettingModule').controller('AssociationManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {

        $scope.vm = {
            addAssocia : addAssocia,
            cancelAssocia : cancelAssocia

        };
        function addAssocia(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/AssociationManageDialog.html",
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
        function cancelAssocia(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/AssociationManageDialog2.html",
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