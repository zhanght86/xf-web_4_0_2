/**
 * Created by mileS on 2017/6/13
 * 控制器
 */
angular.module('adminModule').controller('adminController', [
    '$scope',  "$state", "$stateParams",
    function ($scope,  $state ,$stateParams) {
        $state.go("admin.manage",{userPermission:$stateParams.userPermission});              
    }                       
]);