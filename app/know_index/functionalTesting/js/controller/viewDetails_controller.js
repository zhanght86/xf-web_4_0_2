/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('viewDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            addQuestion : addQuestion,
            editQuestion : editQuestion,

        };
        function addQuestion(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }
        function editQuestion(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsEditDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }
        
    }
]);