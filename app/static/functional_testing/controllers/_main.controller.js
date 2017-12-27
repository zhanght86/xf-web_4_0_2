
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('SystemToolsController', [
    '$scope',"localStorageService","$state","FunctionServer","$timeout","$stateParams","ngDialog",
    ($scope,localStorageService,$state,FunctionServer, $timeout,$stateParams,ngDialog)=> {
        //$state.go("functionalTest.questionTest",{userPermission:$stateParams.userPermission});
        $scope.vm = {

        };


    }
])};