
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('relationalCatalogController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        $state.go("relationalCatalog.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            //editName : editName

        };


      

    }
]);