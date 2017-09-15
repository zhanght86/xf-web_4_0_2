/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('testResultController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore, knowledgeAddServer) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        //console.log($stateParams) ;
        $scope.vm = {
            editQuestion : editQuestion,
            pageSize : 5,            //每页条数；
            paginationConf : '',     //分页条件
            paginationConf1 : '',     //分页条件
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            batchNumberId:$stateParams.batchNumberId,
            showData : showData,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
            searchFile : searchFile,
            selectInput :'',
            matchCondition :'0',
            answerCondition :'0',
            selectAllCheck : false,   //checkbox默认你状态；
            selectAll : selectAll,
            selectSingle : selectSingle,
            batchTest : batchTest,
            deleteIds :[],
			testDialog :testDialog,
            listService:[],
            serviceId : "" ,
            getService : getService,
            exportExcel:exportExcel,
            allowSubmit : 1, //是否允许提交
            verifyRelease:verifyRelease, // 校验方法
        //  弹框 参数
            editTitle : "" ,
            editKnow :  "",
            editChannel : '',
            channelList : ""  //所有渠道
        };
        //获取维度
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channelList = data.data
                }
            }, function(error) {
                console.log(error);
                //layer.msg("获取渠道失败，请刷新页面")
            });
        // 389249262623391744
        showData(1);
        //加载表格
        function showData(index){
            //console.log(applicationId);
            httpRequestPost("/api/application/testResult/listBatchFileByPage",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,  
               // batchNumberId:"389249262623391744"
                 batchNumberId:$scope.vm.batchNumberId
            },function(data){
                console.log(data);
                if(data.status == 10005){
                    layer.msg("查询到记录为空",{time:1000});
                    return;
                }else{

                    $scope.vm.listData = data.data.testResultList;
                    $scope.vm.listDataTotal = data.data.total;
                    // $scope.vm.listDataLength = data.data.total;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8//分页框数量
                    };
                    $scope.$apply();
                }
            },function(){
                //layer.msg("请求失败");
                console.log('请求失败');
            })  ;
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
                    searchFile(current);
                }, 0);
            }
        },true);

        var timeout ;
        $scope.$watch('vm.paginationConf1.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    searchFile(current);
                }, 0);
            }
        },true);

        //验证
        function verifyRelease(){
            if($scope.vm.editTitle == null || $scope.vm.editTitle == ""){
                layer.msg("测试问法不能为空",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.editKnow == null || $scope.vm.editKnow == ""){
                layer.msg("知识标题不能为空",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.editTitle.length > 50){
                layer.msg("测试问法长度不能超过50个字符",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.editKnow.length > 50){
                layer.msg("知识标题长度不能超过50个字符",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var b = /^[\w+\u4e00-\u9fa5]+$/;     //限制特殊字符正则表达式
            if(!b.test($scope.vm.editTitle)){
                layer.msg("测试问法不能包含特殊字符!",{time:1000});
                return 0;
            };
            if(!b.test($scope.vm.editKnow)){
                layer.msg("知识标题不能包含特殊字符!",{time:1000});
                return 0;
            }
            return 1;
        }

        //修改
        function editQuestion(params){
            console.log(params)
            $scope.vm.editTitle = params.possibleKnowledge;
            $scope.vm.editKnow = params.knowledgeTitle;
            $scope.vm.editChannel=params.channel;                 //130;
            var dialog = ngDialog.openConfirm({
                template: "/static/functional_testing/batch_test/test_result/test_result_dialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        if($scope.vm.allowSubmit) {
                            var channelName;
                            angular.forEach($scope.vm.channelList, function (item) {
                                if (item.channelCode == $scope.vm.editChannel) {
                                    channelName = item.channelName;
                                }
                            });
                            console.log(channelName);
                            httpRequestPost("/api/application/testResult/updateKnowledge", {
                                possibleKnowledge: $scope.vm.editTitle,
                                knowledgeTitle: $scope.vm.editKnow,
                                channel: $scope.vm.editChannel,
                                testResultId: params.testResultId,
                                batchNumberId:$scope.vm.batchNumberId,
                                channelName: channelName
                            }, function (data) {
                                console.log(data);
                                if(data.status == 10002){
                                    layer.msg("该测试问法已经存在，请重新添加!",{time:1000})
                                }else if (data.status == 10000) {
                                    layer.msg("修改成功",{time:1000});
                                    showData(1);
                                }else if(data.status == 10004){
                                    //layer.msg("修改失败");
                                    console.log("修改失败");
                                }
                                $scope.$apply();
                            }, function () {
                                //layer.msg("修改失败");
                                console.log("修改失败");
                            });
                        }
                        //$state.reload();
                    } else {

                    }
                }
            });
        }
        //查询
        function searchFile(index){
            $scope.vm.paginationConf.totalItems= 0
            //alert(1);
            httpRequestPost("/api/application/testResult/searchKnowledge",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId,
                batchNumberId : $scope.vm.batchNumberId,             //当前文件id
                answerType : $scope.vm.matchCondition,
                answerCondition : $scope.vm.answerCondition,
                possibleKnowledge : $scope.vm.selectInput,
                knowledgeTitle : $scope.vm.selectInput
            },function(data){
                console.log(data);
                if(data.status == 10014){
                    $scope.vm.listData = data.data.testResultList;
                    $scope.vm.listDataTotal = data.data.total;
                    // $scope.vm.listDataLength = data.data.total;

                    $scope.vm.paginationConf1 = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8//分页框数量
                    };
                }else if(data.status == 10005){
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    layer.msg("没有查询到记录!",{time:1000})
                    $scope.vm.paginationConf1 = {
                        currentPage: index,//当前页
                        totalItems: 0, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8//分页框数量
                    };
                }
                $scope.$apply();
            },function(){
               // layer.msg("请求失败");
                console.log("修改失败");
            })  ;
        }

        //导出功能
        function exportExcel(){
            httpRequestPost("/api/application/testResult/export",{
                batchNumberId:$stateParams.batchNumberId
            },function(data){
                console.log(data)
                if(data.status==500){
                    //layer.msg("导出失败")
                    console.log("导出失败");
                }else{
                    window.open("/api/application/detail/downloadExcel?fileName="+ data.data);
                }
                console.log()

            },function(err){})
        }

        //全选
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.testResultId);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.deleteIds = [];
            }
            //console.log( $scope.vm.deleteIds);
        }
        //单选
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
        //批量测试
        function batchTest(){
            if($scope.vm.serviceId) {
                //$scope.vm.batchNumberId = id;
                httpRequestPost("/api/application/testResult/batchTest",{
                    applicationId :  $scope.vm.applicationId,
                    userId :  $scope.vm.userId,
                    ids :  $scope.vm.deleteIds,
                    serviceId : $scope.vm.serviceId,            //服务id,每条都一样；
                    //serviceId : 22
                    batchNumberId : $scope.vm.batchNumberId
                },function(data){
                    console.log( $scope.vm.deleteIds);
                    if(data.status == 20009){
                        $scope.vm.selectAllCheck = false;
                        $state.reload();
                        layer.msg("测试成功",{time:1000});
                    }else{
                        //layer.msg("测试失败");
                        console.log("测试失败");
                    }
                },function(){
                   // layer.msg("请求失败");
                    console.log("测试失败");
                });
            }else{
                layer.msg("当前应用下没有发布服务，请发布服务后进行测试",{time:1000});
            }


        }
        //测试弹窗
        function testDialog(){
            if($scope.vm.deleteIds.length == 0){
                layer.msg("请选择要测试的知识！",{time:1000});
                return;
            }
            var dialog = ngDialog.openConfirm({
                template: "/static/functional_testing/batch_test/test_result/test_dialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                   if(e == 1){
                       batchTest();
                   }
                    //$scope.vm.serviceId = vm.listService[0].serviceId ;
                }
            });

        }
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
               // layer.msg("请求失败");
                console.log('请求失败');
            })
        }
    }
]);