/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */ 
angular.module('materialManagement').controller('documentLibraryController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.documentLibrary");
        $scope.vm = {

            changeName:changeName,
        };


        //修改名称
        function changeName(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/materialManagement/documentLibrary/changeName.html",
                width:"400px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉

                }
            });
        }
    }
]);

