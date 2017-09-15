/**
 * Created by mileS on 2017/3/23
 * For  批量测试
 */
angular.module('functionalTestModule').controller('participleController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,knowledgeAddServer) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),

            pageSize : 5,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
          //  listDataLength : '',
            paginationConf : '',     //分页条件
            selectAllCheck : false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            deleteIds:[],




        };



        //分页定时器
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    initBatchTest();
                }, 100);
            }
        },true);




        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.batchNumberId);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.deleteIds = [];
            }
        }
        function selectSingle(id){
            if($scope.vm.deleteIds.inArray(id)){
                $scope.vm.deleteIds.remove(id);
                $scope.vm.selectAllCheck = false;
            }else{
                $scope.vm.deleteIds.push(id);

            }
            if($scope.vm.deleteIds.length==$scope.vm.listData.length){
                $scope.vm.selectAllCheck = true;
            }
            console.log( $scope.vm.deleteIds);
        }

        //
        function initBatchTest(){
            $scope.vm.deleteIds = [] ;
            $scope.vm.selectAllCheck = false;
        }
    }
]);