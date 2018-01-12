/**
 * Created by mileS on 2017/3/23
 * For  批量测试
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('BatchTestController', [
    '$scope',"localStorageService","$state","$log","FunctionServer","$location","$timeout","$stateParams","ngDialog","$window","$cookieStore",
    ($scope,localStorageService,$state,$log,FunctionServer,$location, $timeout,$stateParams,ngDialog,$window,$cookieStore)=> {
        $scope.vm = {
            deleteQuestion : deleteQuestion,
            startUp : startUp,
            start : start ,
            batchNumberId : "" ,
            listData :[],           //table 数据
           // listDataTotal : 0 ,      //共几条
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

            channel:'',
            selectChannel : selectChannel,
            getService : getService,
            //------------------------------渠道   服务end
            addRemarks : addRemarks,                //备注
            remarks : remarks,
            remark : '',
            remarkOne:'',
            remark2 : '',                     //重测备注
            startUpagain :startUpagain,
            start2:start2,
            batchName :'',
            idNew : '',


        };
        /**
         * 选择渠道
         */
        function selectChannel(channelCode){
            $scope.vm.channel=channelCode;
        }
        /*****************
         * 页面初始化加载已发布服务，页面加载
         * *****************/
        getService();

        function getService(){
            FunctionServer.getService.save({
                //applicationId:APPLICATION_ID,
            },function(data){
                if(data.status == 200){
                    console.log(data);
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].id;
                }else if(data.status==500){
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
                }
            },function(err){
                $log.log('请求请求失败');
            });

        }

        /*****************
         * //获取列表  、查询
         * *****************/
        searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;

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
                    //$scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf.totalItems = 0;
                }else if(data.status==200){
                    console.log(data);
                    //alert(typeof data.data.batchTestList[0].batchNumberId);
                    $scope.vm.listData = data.data.list;
                   // $scope.vm.listDataTotal = data.data.total;
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
                layer.msg("请选择要删除的文件")
            }else{
                layer.confirm('确认删除文件？', {
                    btn: ['确定','取消']                     //按钮
                }, function(){
                    FunctionServer.batchDelete.save({},{
                        "ids": batchIds
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

                }, function(error){
                    console.log(error);
                });
            }

        }
        /*****************
         * //启动
         * *****************/
        function startUp(id,remark){
            if($scope.vm.serviceId) {
                $scope.vm.batchNumberId = id ;
                $scope.vm.remarkOne = remark;
                let test_html = require("../../../views/test_tools/batch_test/start_up_dialog.html") ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope,test_html,"400px",function(){

                },"",function(){
                    $scope.vm.channel = "" ;
                });

            }else{
                layer.msg("当前应用下没有发布服务，请发布服务后进行测试");
            }

        }
        function start(){
            var id = $scope.vm.batchNumberId ;
            var remark = $scope.vm.remarkOne;
            var channelId = angular.copy($scope.vm.channel) ;
            if(!$scope.vm.channel){
                layer.msg("选择渠道")
            }else{
                FunctionServer.start.save({
                    batchNumberId:id,
                    channel:channelId,
                    serviceId:$scope.vm.serviceId,
                    remark:remark

                },function (data) {
                    if(data.status == 500){
                        layer.msg(data.data,{time:1000});
                    }
                    if(data.status == 200){
                        //$state.reload();
                        searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                        startTest(id,channelId);
                    }
                },function(err){
                    $log.log(err);
                });
                ngDialog.closeAll() ;
            }
        }

        function startTest(id,channelId){
            var i = layer.msg('测试中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.startTest.save({
                batchNumberId: id,
                channel:channelId,
                serviceId:$scope.vm.serviceId,
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status=200){
                    //$state.reload();
                    searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                }
                if(data.status==500){
                    layer.msg(data.data,{time:10000});
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /*****************
         * 重测
         * *****************/
        function startUpagain(id,name){
            if($scope.vm.serviceId) {
                $scope.vm.batchNumberId = id ;
                $scope.vm.batchName = name;
                let test_html = require("../../../views/test_tools/batch_test/start_up_dialog2.html") ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope,test_html,"400px",function(){

                },"",function(){
                    $scope.vm.channel = "" ;
                });

            }else{
                layer.msg("当前应用下没有发布服务，请发布服务后进行测试");
            }

        }
        function start2(){
            var id = $scope.vm.batchNumberId ;
            var name = $scope.vm.batchName;
            var channelId = angular.copy($scope.vm.channel) ;
            if(!$scope.vm.channel){
                layer.msg("选择渠道")
            }else{
                FunctionServer.retest.save({
                    batchNumberId:id,
                    channel:channelId,
                    serviceId:$scope.vm.serviceId,
                    remark : $scope.vm.remark2,
                    batchName :name
                },function (data) {
                    if(data.status == 500){
                        // layer.msg(data.info,{time:10000});
                        console.log(data.info);
                    }
                    if(data.status == 200){
                        //$state.reload();
                        $scope.vm.idNew = data.data;
                        searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                        startTest2(channelId);
                    }
                },function(err){
                    $log.log(err);
                });
                ngDialog.closeAll() ;
            }
        }

        function startTest2(channelId){
            var i = layer.msg('测试中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.startTest.save({
                batchNumberId: $scope.vm.idNew ,
                channel:channelId,
                serviceId:$scope.vm.serviceId,
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status=200){
                    //$state.reload();
                    searchFile($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                }
                if(data.status==500){
                   // layer.msg(data.info,{time:10000});
                    console.log(data.info);
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }



        //添加备注
        function addRemarks(id){
            $scope.vm.batchNumberId = id;
            //alert(id);
            let remarks_html = require("../../../views/test_tools/batch_test/remarks_dialog.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,remarks_html,"400px",function(){
                remarks(id);
            },"",function(){

            });
        }

        function remarks(id){
            FunctionServer.remark.save({
                "batchNumberId": id,
                "remark": $scope.vm.remark
            },function(data){
                if(data.status==200){
                    layer.msg("标注成功");
                    $state.reload();
                }
                if(data.status==500){
                    layer.msg("标注失败");
                }
            },function(err){
                console.log(err);
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