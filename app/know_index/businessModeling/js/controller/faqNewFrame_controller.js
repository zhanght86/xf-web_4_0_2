/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('faqNewFrameController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
        
        $state.go("faqNewFrame.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            

        };

        


    }
]);