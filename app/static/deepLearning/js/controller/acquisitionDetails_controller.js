/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('acquisitionDetailsController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("deepLearning.acquisitionDetails");

        $scope.vm = {
            edit : edit



        };
        function edit(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/acquisitionDetailsDialog.html",
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

