/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('materialManagement').controller('pictureLibraryController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("materialManagement.pictureLibrary");
        //$state.go("materialManagement.faqChat");
        //var paraData = $stateParams.scanDataList?angular.fromJson($stateParams.scanDataList):"" ;
        $scope.vm = {



        };


      


    }
]);

