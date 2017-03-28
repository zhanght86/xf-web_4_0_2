/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationModule').controller('myApplicationController', [
    '$scope',  "$state", "$stateParams",
    function ($scope,  $state ,$stateParams) {

                //console.log("state"+$stateParams.userPermission);
        $state.go("myApplication.manage",{userPermission:$stateParams.userPermission});

    }
]);