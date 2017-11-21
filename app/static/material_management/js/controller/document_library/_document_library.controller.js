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
        function changeName(item){
            //$scope.vm.pictureName=item.name;
            //$scope.vm.pictureId=item.id;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/document_library/change_name.html','400px',function(){
                //updateImg();
            },function(){

            });
        }

    }
]);

