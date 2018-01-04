/**
 * Created by mileS on 2017/3/23
 * For  批量测试
 */
module.exports=functionalTestModule => {
    functionalTestModule
    .controller('ParticipleController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","FunctionServer","$location",
    ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,FunctionServer,$location)=> {
        $scope.vm = {
            paginationConf : {             //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: getPartList ,
                location:true
            },
            selectAllCheck :false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            deleteIds:[],
            getPartList : getPartList,
            selectInput :'',
            searchType :0,
            listData :[],



        };

        /**
         ** 获取列表
         **/
        getPartList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function getPartList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage=1;
                $location.search('currentPage',1);
            }
            var i = layer.msg('资源加载中',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:1000});
            FunctionServer.getPartList.save({
                fileName : $scope.vm.selectInput,
                index:(index-1)*pageSize,
                pageSize:pageSize,
                status : $scope.vm.searchType
            },function (data) {
                layer.close(i);
                if(data.status==200){
                    console.log(data);
                    $scope.vm.listData = data.data.data;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }
                if(data.status==500){
                    layer.msg(data.info,{time:10000});
                }
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }

        /**
         ** 全选
         **/
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.id);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.deleteIds = [];
            }
        }
        /**
         ** 单选
         **/
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

        /**
         *** 清空
         ***/
        function initBatchTest(){
            $scope.vm.deleteIds = [] ;
            $scope.vm.selectAllCheck = false;
        }
    }
    ])};