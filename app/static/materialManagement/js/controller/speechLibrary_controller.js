/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('materialManagement').controller('speechLibraryController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("materialManagement.speechLibrary");
        //$state.go("materialManagement.faqChat");
        //var paraData = $stateParams.scanDataList?angular.fromJson($stateParams.scanDataList):"" ;
        $scope.vm = {
            uploadSpeech :uploadSpeech,
            showUl :true

        };
        // $scope.$watch("$scope.vm.showUl",function(val){
        //     if(val){
        //         angular.element(".voice_classific_ul").slideDown();
        //     }else{
        //         angular.element(".voice_classific_ul").slideUp();
        //     }
        // });

        function uploadSpeech(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/materialManagement/speechLibrary/speechLibraryDialog.html",
                width:"900px",
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

