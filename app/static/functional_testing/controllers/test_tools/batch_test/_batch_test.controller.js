/**
 * Created by mileS on 2017/3/23
 * For  批量测试
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('BatchTestController', [
    '$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore",
    ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore)=> {
        $scope.vm = {
            userId : $cookieStore.get("userId"),
            deleteQuestion : deleteQuestion,
            uploadQuestion : uploadQuestion,
            startUp : startUp,
            start : start ,
            stopTest : stopTest ,
            batchNumberId : "" ,
            jumpD:jumpD,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
          //  listDataLength : '',
            paginationConf : {        //分页条件
                pageSize : 5,
                pagesLength : 10
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
            getService : getService
            //------------------------------渠道   服务end


        };

        /*****************
         * 页面初始化加载已发布服务，页面加载
         * *****************/
        getService();
        searchFile(1) ;
        /*****************
         * //已发布服务
         * *****************/
        function getService(){
            FunctionServer.getService.save({
                applicationId:APPLICATION_ID
            },function(data){
                if(data.status == 10000){
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].serviceId;
                }else if(data.status == 10005){
                    layer.msg('当前应用下没有发布服务，请发布服务后进行测试');
                }
            },function(err){
                $log.log(err);
            });

        }

        /*****************
         * //获取列表  、查询
         * *****************/
        function searchFile(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.BatchsearchFile.save({
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                applicationId:APPLICATION_ID,
                batchStatusId :$scope.vm.searchType,
                batchName: $scope.vm.selectInput,
                channel: $scope.vm.selectInput,
                batchOperator: $scope.vm.selectInput
            },function(data){
                layer.close(i);
                if(data.status == 10005){
                    layer.msg("查询到记录为空",{time:1000});
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf.totalItems = 0;
                }else{
                    console.log(data);
                    //alert(typeof data.data.batchTestList[0].batchNumberId);
                    $scope.vm.listData = data.data.batchTestList;
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
         * //查看页面跳转
         * *****************/
        function jumpD(url,id){
            $state.go(url,{batchNumberId:id});
        }

        /*****************
         * //分页定时器
         * *****************/
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined ){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    initBatchTest();
                    searchFile(current);
                }, 0);
            }
        },true);

        /*****************
         * //批量上传
         * *****************/
        function uploadQuestion(callback){
            //var timer = $timeout(function(){
            //    var dialog = ngDialog.openConfirm({
            //        template: "/static/functional_testing/batch_test/batch_test/batch_upload_dialog.html",
            //        scope: $scope,
            //        closeByDocument: false,
            //        closeByEscape: true,
            //        showClose: true,
            //        backdrop: 'static',
            //        preCloseCallback: function (e) {    //关闭回掉
            //            if (e === 1) {
            //                $scope.vm.upload = true
            //            } else {
            //
            //            }
            //        }
            //    });
            //},350)
        }

        /*****************
         * //删除
         * *****************/
        function deleteQuestion(callback){
            if($scope.vm.deleteIds.length == 0){
                layer.msg("请选择要删除的文件！",{time:1000});
                return;
            }            
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/batch_test_dialog.html','400px',function(){

                FunctionServer.batchDelete.save({
                    applicationId :  APPLICATION_ID,
                    ids :  $scope.vm.deleteIds
                },function(data){
                    if(data.status == 10013){
                        initBatchTest();
                        //$scope.vm.selectAllCheck = false;
                        layer.msg("删除成功",{time:100000});
                        $state.reload();
                    }else{
                        layer.msg("删除失败");
                    }
                },function(err){
                    $log.log(err);
                });
            },function(){

            });
        }
        /*****************
         * //启动
         * *****************/
        function startUp(id){
            if($scope.vm.serviceId) {
                $scope.vm.batchNumberId = id ;                
                $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/batch_test/start_up_dialog.html','450px',function(){

                },function(){

                },function(){
                    $scope.vm.channel = "" ;
                    //$scope.vm.serviceId = vm.listService[0].serviceId ;
                });

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

        function stopTest(id){
            FunctionServer.stopTest.save({
                batchNumberId: id,
                batchStatusId : 21007
            },function(data){
                console.log(data);
                if(data.status=10000){
                    searchFile($scope.vm.paginationConf.currentPage) ;
                }
            },function(){

            });
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

        /*****************
         * //全选
         * *****************/
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