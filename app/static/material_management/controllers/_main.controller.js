/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */


module.exports=materialModule => {
    materialModule
	.controller('MaterialController',
		['$scope',"$state","MaterialServer","$log", "$cookieStore","$timeout","$window","$location",
    ($scope,$state,MaterialServer,$log,$cookieStore,$timeout,$window,$location) => {
        //$state.go("");
        $scope.vm = {

        };
    }
])};