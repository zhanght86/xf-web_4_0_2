/**
 * Created by 41212 on 2017/3/23.
 */

angular.module('functionalTestModule').controller('batchTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,knowledgeAddServer) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            deleteQuestion : deleteQuestion,
            uploadQuestion : uploadQuestion,
            startUp : startUp,
            start : start ,
            stopTest : stopTest ,
            batchNumberId : "" ,
            jumpD:jumpD,
            pageSize : 5,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
          //  listDataLength : '',
            paginationConf : '',     //分页条件
            showData : showData,
            selectAllCheck : false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            deleteIds:[],
            searchFile : searchFile,
            searchType : 0,
            selectInput :'',
            upload : false,  // 上传命令
            //-----------------------------渠道   服务
            listService:[],
            serviceId : "" ,
            channel:"",
            channelList : [] ,
            getService : getService,
            //------------------------------渠道   服务end

        };
        //获取渠道
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channelList = data.data;
                }
            }, function(error) {
                console.log(error);
                //layer.msg("获取渠道失败，请刷新页面");
            });
        //页面初始化加载已发布服务
        getService();
        function getService(){
            httpRequestPost("/api/application/service/listServiceByApplicationId",{
                applicationId:$scope.vm.applicationId,
            },function(data){
                if(data.status == 10000){
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].serviceId ;
                    $scope.$apply();
                }else if(data.status == 10005) {
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试");
                }
            },function(){
                //layer.msg("请求失败");
                console.log('请求失败');
            })
        }

        showData(1);
        //加载表格
        function showData(index){
            //console.log(applicationId);
            httpRequestPost("/api/application/batchTest/getBatchFile",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId
            },function(data){
                console.log(data);
                if(data.status == 10005){
                    layer.msg("查询到记录为空");
                    return;
                }else{
                    $scope.vm.listData = data.data.batchTestList;
                    $scope.vm.listDataTotal = data.data.total;
                    // $scope.vm.listDataLength = data.data.total;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                    $scope.$apply();
                }
            },function(){
                //layer.msg("请求失败");
                console.log('请求失败');
            })  ;
        }
        //查询
        function searchFile(index){
            httpRequestPost("/api/application/batchTest/findByValue",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId,
                batchStatusId :$scope.vm.searchType,
                batchName: $scope.vm.selectInput,
                channel: $scope.vm.selectInput,
                batchOperator: $scope.vm.selectInput,

            },function(data){
                console.log(data);
                if(data.status == 10005){
                   layer.msg("查询到记录为空");
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    //return;
                }else{
                    $scope.vm.listData = data.data.batchTestList;
                    $scope.vm.listDataTotal = data.data.total;
                    // $scope.vm.listDataLength = data.data.total;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                }
                $scope.$apply();
            },function(){
               // layer.msg("请求失败");
                console.log('请求失败');
            })  ;
        }

        function jumpD(url,id){
            $state.go(url,{batchNumberId:id});
        }

        //分页定时器
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    showData(current);
                }, 0);
            }
        },true);

        //批量上传
        function uploadQuestion(callback){

            //var timer = $timeout(function(){
            //    var dialog = ngDialog.openConfirm({
            //        template: "/know_index/functionalTesting/batchUploadDialog.html",
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
        //删除
        function deleteQuestion(callback){
            if($scope.vm.deleteIds == 0){
                layer.msg("请选择要删除的文件！");
                return;
            }
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/batchTestDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/batchTest/batchDeleteByIds",{
                            applicationId :  $scope.vm.applicationId,
                            ids :  $scope.vm.deleteIds
                        },function(data){
                            //$state.reload();
                            if(data.status == 10013){
                                $scope.vm.selectAllCheck = false;
                                $state.reload();
                                layer.msg("删除成功");
                            }else{
                                //layer.msg("删除失败");
                                console.log('删除失败');
                            }
                        },function(){
                            //layer.msg("请求失败");
                            console.log('请求失败');
                        });
                    }
                }
            });
        }
        //启动
        function startUp(id){
            if($scope.vm.serviceId) {
                $scope.vm.batchNumberId = id ;
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/functionalTesting/startUpDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                          $scope.vm.channel = "" ;
                          //$scope.vm.serviceId = vm.listService[0].serviceId ;
                    }
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
                httpRequestPost("/api/application/batchTest/getChannelAndUserName", {
                    batchNumberId:  id,
                    userId: $scope.vm.userId,
                    //channel:$scope.vm.channel,
                    channelName : name,
                    channel:channelId,
                    applicationId:$scope.vm.applicationId,
                    serviceId:$scope.vm.serviceId,
                }, function (data) {
                    console.log(data);
                    //$state.reload();
                    if(data.status == 20002){
                        layer.msg(data.data);
                    }
                    if(data.status == 10018){
                        showData($scope.vm.paginationConf.currentPage);
                        startTest(id,name,channelId);
                    }
                }, function () {
                    layer.msg("请求失败");
                },"","",60000);
                ngDialog.closeAll() ;
            }
        }

        function stopTest(id){
            httpRequestPost("/api/application/batchTest/startTest", {
                batchNumberId: id,
                batchStatusId : 21007
            }, function (data) {
                console.log(data);
                if(data.status=10000){
                    showData($scope.vm.paginationConf.currentPage) ;
                }
            }, function () {
                //layer.msg("请求失败");
            });
        }

        function startTest(id,name,channelId){
            httpRequestPost("/api/application/batchTest/startTest", {
                batchNumberId: id,
                userId: $scope.vm.userId,
                channelName : name ,
                channel:channelId,
                applicationId:$scope.vm.applicationId,
                serviceId:$scope.vm.serviceId,
                //serviceId:22
            }, function (data) {
                console.log(data);
                if(data.status=10000){
                    showData($scope.vm.paginationConf.currentPage) ;
                }
            }, function () {
                //layer.msg("请求失败");
            },"","",3600000);
        }

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
            //console.log( $scope.vm.deleteIds);
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
            //console.log( $scope.vm.deleteIds);
        }
    }
]);