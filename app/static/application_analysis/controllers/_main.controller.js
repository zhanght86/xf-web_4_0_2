/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */


module.exports=applAnalysisModule => {
	applAnalysisModule
	.controller('applAnalysisController', 
		['$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",
    ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog) => {
        //$state.go("functionalTest.questionTest",{userPermission:$stateParams.userPermission});
        $scope.vm = {
        };
}])};