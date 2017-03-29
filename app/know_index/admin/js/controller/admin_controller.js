/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('adminController', [
    '$scope',  "$state", "$stateParams",
    function ($scope,  $state ,$stateParams) {
                //console.log("state"+$stateParams.userPermission);
        $state.go("admin.manage",{userPermission:$stateParams.userPermission});

    }
]);