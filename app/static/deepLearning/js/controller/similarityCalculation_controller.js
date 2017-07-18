/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('similarityCalculationController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("deepLearning.similarityCalculation");

        $scope.vm = {




        };
       




    }
]);

