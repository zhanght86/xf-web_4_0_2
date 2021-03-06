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
            reductionBtn:reductionBtn,
            backList   : [ 
                {
                    "name" : "业务建模",
                    "id"   : 2
                },{
                    "name" : "素材管理",
                    "id"   : 3
                },{
                    "name" : "知识管理",
                    "id"   : 1
                },{
                    "name" : "系统管理",
                    "id"   : 4
                }
               
            ],
            backupIds:[],
            restoreList :"",
            selectAll:selectAll,    //全选
            selectSingle:selectSingle, //单选

        };
        
        //备份模块赛选
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
        //系统备份
        function backup() {
            if(!nullCheck($scope.vm.selectList)){
                return layer.msg("请先选择要备份的模块");
            }
            ApplicationServer.backup.save({
                list : $scope.vm.selectList
            },function (response) {
                if(response.status == 200 ){
                    var fileName=response.data;
                  downLoadFiles(null,API_MATERIAL+"/backuprestore/download?fileName="+fileName+"")
                }
            })
        }
        function restore() {
            $scope.vm.restoreList="";
            initBatchTest();
            $scope.$parent.$parent.MASTER.openNgDialog($scope,restoreHtml,"700px",function(){

            },"",function(){

            });
        }
      // 系统还原
       function reductionBtn(){
        if($scope.vm.restoreList==""){
            layer.msg("请上传文件")
            return
        }
        if($scope.vm.backupIds.length==0){
           layer.msg("请先选择要还原的模块")
           return
        }
         ApplicationServer.restore.save({
            "list":$scope.vm.backupIds,
            "fileName":$scope.vm.restoreList.fileName,
            "workspace":$scope.vm.restoreList.workspace,
         },(data)=>{
            console.log(data)
            console.log($scope.vm.file)
            if(data.status==200){
                layer.msg(data.info)
                 ngDialog.closeAll(1) ;
            }else{
                layer.msg(data.info)
            }

         })
       }
         
         //全选
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.backupIds = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.backupIds=[];
                angular.forEach($scope.vm.restoreList.list,function (val) {
                    $scope.vm.backupIds.push(val);
                })
            }
            console.log($scope.vm.backupIds);
        }
        //单选
        function selectSingle(id){
            if($scope.vm.backupIds.inArray(id)){
                $scope.vm.backupIds.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.backupIds.push(id);

            }
            if($scope.vm.backupIds.length==$scope.vm.restoreList.list.length){
                $scope.vm.isSelectAll = true;
            }else{
                $scope.vm.isSelectAll = false;
            }
            if(!($scope.vm.backupIds.inArray("2") && $scope.vm.backupIds.inArray("3")) && $scope.vm.backupIds.inArray("1")){
               $scope.vm.backupIds.remove("1")
            }
            }

            //全选清空
            function initBatchTest(){
                $scope.vm.isSelectAll=false;
                $scope.vm.backupIds=[];
            }
}])};