/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('batchTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            deleteQuestion : deleteQuestion,
            uploadQuestion : uploadQuestion,
            startUp : startUp,
        };
        //批量上传
        function uploadQuestion(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/batchUploadDialog.html",
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
        //删除
        function deleteQuestion(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/batchTestDialog.html",
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
        //启动
        function startUp(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/startUpDialog.html",
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