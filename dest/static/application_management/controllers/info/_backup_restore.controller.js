/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  备份还原
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('BackupRestoreController',
    ['$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog","$cookieStore","$rootScope","$timeout","$log",
    ($scope,localStorageService,ApplicationServer , $state, ngDialog,$cookieStore,$rootScope,$timeout,$log) =>{
        $scope.vm = {

        };

    }
])};