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
            selectList : [] ,
            addToList  : addToList ,
            backup     :backup ,
            restore    : restore ,
            backList   : [
                {
                    "name" : "知识库",
                    "id"   : 1
                },
                {
                    "name" : "业务建模",
                    "id"   : 2
                },
                {
                    "name" : "素材管理",
                    "id"   : 3
                },
                {
                    "name" : "系统管理",
                    "id"   : 4
                }
            ],
            restoreList : []
        };
        let restoreHtml = require("../../views/configuration/backup_restore/dialog_restore.html");
        function addToList(id){
            if($scope.vm.selectList.inArray(id)){
                $scope.vm.selectList.remove(id) ;
            }else{
                $scope.vm.selectList.push(id) ;
            }
           if(!($scope.vm.selectList.inArray(2) && $scope.vm.selectList.inArray(3)) && $scope.vm.selectList.inArray(1)){
               $scope.vm.selectList.remove(1)
           }
        }
        function backup() {
            if(!nullCheck($scope.vm.selectList)){
                return layer.msg("请先选择要备份的模块");
            }
            ApplicationServer.backup.save({
                list : $scope.vm.selectList
            },function (response) {
                if(response.status == 200 ){
                    downLoadFiles("",API_MATERIAL+"/backuprestore/download")
                }
            })
        }
        function restore() {
            $scope.$parent.$parent.MASTER.openNgDialog($scope,restoreHtml,"",function(){

            })
        }
}])};