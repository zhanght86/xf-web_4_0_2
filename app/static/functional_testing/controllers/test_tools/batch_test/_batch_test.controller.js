/**
 * Created by mileS on 2017/3/23
 * For  批量测试
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('BatchTestController', [
    '$scope',"localStorageService","$state","$log","FunctionServer","$location","$timeout","$stateParams","ngDialog","$cookieStore",
    ($scope,localStorageService,$state,$log,FunctionServer,$location, $timeout,$stateParams,ngDialog,$cookieStore)=> {
        $scope.vm = {
            //userId : $cookieStore.get("userId"),
            deleteQuestion : deleteQuestion,
            startUp : startUp,
            start : start ,
            batchNumberId : "" ,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
            paginationConf : {        //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchFile ,
                location:true
            },
            selectAllCheck : false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            deleteIds : [],
            searchFile : searchFile,
            searchType : 0,
            selectInput :'',
            upload : false,  // 上传命令
            //-----------------------------渠道   服务
            listService:[],
            serviceId : "" ,
            channel:"",
            channelList : [] ,
            //getService : getService,
            //------------------------------渠道   服务end
            addRemarks : addRemarks                //备注


        };

        /*****************
         * 页面初始化加载已发布服务，页面加载
         * *****************/
        //getService();
        searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
        /*****************
         * //已发布服务
         * *****************/
        // function getService(){
        //     FunctionServer.getService.save({
        //         applicationId:APPLICATION_ID
        //     },function(data){
        //         if(data.status == 10000){
        //             $scope.vm.listService = data.data;
        //             $scope.vm.serviceId = data.data[0].serviceId;
        //         }else if(data.status == 10005){
        //             layer.msg('当前应用下没有发布服务，请发布服务后进行测试');
        //         }
        //     },function(err){
        //         $log.log(err);
        //     });
        //
        // }

        /*****************
         * //获取列表  、查询
         * *****************/
        function searchFile(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.BatchsearchFile.save({
               // applicationId:APPLICATION_ID,
                batchName: $scope.vm.selectInput,
                batchStatusId :$scope.vm.searchType,
                index:(index - 1)*pageSize,
                pageSize: pageSize,
                //channel: $scope.vm.selectInput,
                //batchOperator: $scope.vm.selectInput
            },function(data){
                layer.close(i);
                if(data.status == 500){
                    layer.msg("查询到记录为空",{time:1000});
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf.totalItems = 0;
                }else if(data.status==200){
                    console.log(data);
                    //alert(typeof data.data.batchTestList[0].batchNumberId);
                    $scope.vm.listData = data.data.list;
                    $scope.vm.listDataTotal = data.data.total;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }


        /*****************
         * //删除
         * *****************/
        function deleteQuestion(batchIds){
            if(!batchIds.length){
                layer.msg("请选择要删除的文件！",{time:1000});
                //return;
            }else{
                layer.confirm("确定要删除吗",{
                    btn:['确定','取消']
                },function(){
                    FunctionServer.batchDelete.save({
                        ids :  $scope.vm.deleteIds
                    },function(data){
                        if(data.status == 10010){
                            initBatchTest();
                            layer.msg("删除成功",{time:1000});
                            layer.closeAll('dialog');
                            $state.reload();
                        }else if(data.status == 500){
                            layer.msg("删除失败");
                        }
                    },function(err){
                        $log.log(err);
                    });
                });

            }

        }
        /*****************
         * //启动
         * *****************/
        function startUp(id){
            if($scope.vm.serviceId) {
                $scope.vm.batchNumberId = id ;

                let test_html = require("../../../views/test_tools/batch_test/start_up_dialog.html") ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope,test_html,"400px",function(){

                },"",function(){
                    $scope.vm.channel = "" ;
                });

                // $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/batch_test/start_up_dialog.html','450px',function(){
                //
                // },function(){
                //
                // },function(){
                //     $scope.vm.channel = "" ;
                //     //$scope.vm.serviceId = vm.listService[0].serviceId ;
                // });

            }else{
                layer.msg("当前应用下没有发布服务，请发布服务后进行测试");
            }

        }
        function start(){
            var id = $scope.vm.batchNumberId ;
            var channelId = angular.copy($scope.vm.channel) ;
            if(!$scope.vm.channel){
                layer.msg("选择渠道")
            }else{
                var name ;
                angular.forEach($scope.vm.channelList,function(item){
                    if(item.channelCode == $scope.vm.channel){
                        return name = item.channelName  ;
                    }
                }) ;

                FunctionServer.start.save({
                    batchNumberId:  id,
                    userId : USER_ID,
                    //channel:$scope.vm.channel,
                    channelName : name,
                    channel:channelId,
                    applicationId:APPLICATION_ID,
                    serviceId:$scope.vm.serviceId,
                },function (data) {
                    if(data.status == 20002){
                        layer.msg(data.data,{time:1000});
                    }
                    if(data.status == 10018){
                        searchFile($scope.vm.paginationConf.currentPage);
                        startTest(id,name,channelId);
                    }
                },function(err){
                    $log.log(err);
                });
                ngDialog.closeAll() ;
            }
        }

        function startTest(id,name,channelId){
            FunctionServer.startTest.save({
                batchNumberId: id,
                //userId: $scope.vm.userId,
                userId : USER_ID,
                channelName : name ,
                channel:channelId,
                applicationId:APPLICATION_ID,
                serviceId:$scope.vm.serviceId,
                //serviceId:22
            },function(data){
                console.log(data);
                if(data.status=10000){
                    searchFile($scope.vm.paginationConf.currentPage) ;
                }
            },function(err){
                $log.log(err);
            });
        }
        //添加备注
        function addRemarks(){
            let remarks_html = require("../../../views/test_tools/batch_test/remarks_dialog.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,remarks_html,"400px",function(){

            },"",function(){

            });
        }

        /*****************
         * //全选
         * *****************/
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
        /*****************
         * //单选
         * *****************/
        function selectSingle(id){
            //alert($scope.vm.deleteIds);
            if($scope.vm.deleteIds.inArray(id)){
                $scope.vm.deleteIds.remove(id);
                $scope.vm.selectAllCheck = false;
            }else{
                $scope.vm.deleteIds.push(id);
            }
            if($scope.vm.deleteIds.length == $scope.vm.listData.length){
                $scope.vm.selectAllCheck = true;
            }
            console.log( $scope.vm.deleteIds);
        }

        /*****************
         * //清空 删除全选
         * *****************/
        function initBatchTest(){
            $scope.vm.deleteIds = [] ;
            $scope.vm.selectAllCheck = false;
        }
    }
    ])}