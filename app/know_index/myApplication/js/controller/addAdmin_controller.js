/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('myApplicationModule').controller('addAdminController', [
    '$scope', "$state", "$stateParams",
    function ($scope,$state, $stateParams) {
        $state.go("admin.manage",{userPermission:$stateParams.userPermission});

    }
]);