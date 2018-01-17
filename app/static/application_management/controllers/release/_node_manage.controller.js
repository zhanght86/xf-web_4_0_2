/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  节点管理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
     .controller('NodeManageController',
     ['$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog", "$cookieStore","$timeout","$location",
     ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$cookieStore,$timeout,$location) =>{
        $scope.vm = {
            nodeData : "",   // 节点列表数据
             paginationConf :{   // 分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : listNodeData,
                location : true
            }  ,//分页条件
           
        }; 
        //请求节点列表
        listNodeData($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);    
        function listNodeData(index,pageSize){
            ApplicationServer.queryNodeList.save({
                "index" : (index-1)*pageSize,
                "pageSize": pageSize
            },function(response){
                $scope.vm.nodeData = response.data.data;
                $scope.vm.paginationConf.totalItems = response.data.total ;
                $scope.vm.paginationConf.numberOfPages = response.total/pageSize ;
            },function(error){console.log(error);})
        }
    }

])};