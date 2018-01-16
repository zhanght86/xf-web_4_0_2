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
            deletePart : deletePart,                    //删除
            startTestPart : startTestPart ,              //启动
           // exportPart : exportPart


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
         *   启动
         **/
        function startTestPart(id){
            FunctionServer.startTestPart.save({
                "id":id
            },function(data){
                if(data.status==500){
                    layer.msg(data.info,{time:1000});
                    //console.log(data.info);
                }
                if(data.status==200){
                    //$state.reload();
                    getPartList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    start(id);
                }

            },function(err){
                console.log(err);
            });
        }
        function start(id){
            FunctionServer.startPart.save({
                "id":id
            },function(data){
                if(data.status==500){
                    layer.msg(data.info,{time:1000});
                    //console.log(data.info);
                }
                if(data.status==200){
                   //$state.reload();
                    getPartList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                }
            },function(err){
                console.log(err);
            });
        }

        /**
         ** 导出    (get方法)
         **/
        // function exportPart(id){
        //     var urlParams = "/"+id;
        //     var url = FunctionServer.exportPart + urlParams;
        //     downLoadFiles($('.participle')[0],url);
        //
        // }

        /**
         ** 删除
         ***/
        function deletePart(deleteIds){
            if(!deleteIds.length){
                layer.msg("请选择要删除的文件")
            }else{
                layer.confirm('确认删除文件？',{
                    btn:['确认','取消']
                },function(){
                    FunctionServer.deletePart.save({
                        "ids":deleteIds
                    },function(data){
                        if(data.status == 200){
                            initBatchTest();
                            layer.msg("文件删除成功") ;
                            layer.closeAll();
                            $state.reload();
                        }else if(data.status == 500){
                            layer.msg("文件删除失败") ;
                        }
                    },function(err){
                        console.log(err);
                    });
                },function(error){
                    console.log(error);
                });
            }

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