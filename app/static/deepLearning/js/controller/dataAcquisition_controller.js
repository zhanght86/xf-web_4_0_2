/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('dataAcquisitionController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("deepLearning.dataAcquisition");

        $scope.vm = {
            newTask : newTask



        };
        function newTask(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/dataAcquisitionDialog.html",
                width:"500px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }




    }
]);

