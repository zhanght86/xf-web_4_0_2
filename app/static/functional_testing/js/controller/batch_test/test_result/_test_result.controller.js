/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('testResultController', [
    '$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore, knowledgeAddServer) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        //console.log($stateParams) ;
        $scope.vm = {
            editQuestion : editQuestion,
            paginationConf : {        //分页条件
                pageSize : 5,            //每页条数；
                pagesLength :10          //分页框数量

            },
            paginationConf1 : {         //分页条件
                pageSize : 5,            //每页条数；
                pagesLength :10          //分页框数量
            },
            batchNumberId:$stateParams.batchNumberId,
            showData : showData,
            listData :[],           //table 数据
            listDataTotal : 0 ,      //共几条
            searchFile : searchFile,
            selectInput :'',
            matchCondition :'0',
            answerCondition :'0',
            selectAllCheck : false,   //checkbox默认状态；
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
        
        showData(1);

        /*****************
         * //加载表格
         * *****************/
        function showData(index){
            var i = layer.msg('资源加载中',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.showData.save({
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                // batchNumberId:"389249262623391744"
                batchNumberId:$scope.vm.batchNumberId
            },function(data){
                console.log(data);
                layer.close(i);
                if(data.status == 10005){
                    layer.msg("查询到记录为空",{time:1000});
                    $scope.vm.listData=[];
                    $scope.vm.paginationConf.totalItems=0;
                    return;
                }else{
                    $scope.vm.listData = data.data.testResultList;
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
         * //分页定时器
         * *****************/
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

        /*****************
         * //验证
         * *****************/
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

        /*****************
         * //修改
         * *****************/
        function editQuestion(params){
            console.log(params)
            $scope.vm.editTitle = params.possibleKnowledge;
            $scope.vm.editKnow = params.knowledgeTitle;
            $scope.vm.editChannel=params.channel;                 //130;
            
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/test_result/test_result_dialog.html','450px',function(){
                if($scope.vm.allowSubmit) {
                    var channelName;
                    angular.forEach($scope.vm.channelList, function (item) {
                        if (item.channelCode == $scope.vm.editChannel) {
                            channelName = item.channelName;
                        }
                    });
                    console.log(channelName);
                    FunctionServer.editQuestion.save({
                        possibleKnowledge: $scope.vm.editTitle,
                        knowledgeTitle: $scope.vm.editKnow,
                        channel: $scope.vm.editChannel,
                        testResultId: params.testResultId,
                        batchNumberId:$scope.vm.batchNumberId,
                        channelName: channelName
                    },function(data){
                        console.log(data);
                        if(data.status == 10002){
                            layer.msg("该测试问法已经存在，请重新添加!",{time:1000})
                        }else if (data.status == 10000) {
                            $state.reload();
                            layer.msg("修改成功",{time:1000});
                            //showData(1);
                        }else if(data.status == 10004){
                            //layer.msg("修改失败");
                            console.log("修改失败");
                        }
                    },function(err){
                        $log.log(err);
                    });
                }
                //$state.reload();
            },function () {
                
            });
        }
        /*****************
         * //查询
         * *****************/
        function searchFile(index){
            var i = layer.msg('查询中',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            $scope.vm.paginationConf.totalItems= 0;
            FunctionServer.searchFile.save({
                index:(index - 1)*$scope.vm.paginationConf1.pageSize,
                pageSize:$scope.vm.paginationConf1.pageSize,
                applicationId:APPLICATION_ID,
                batchNumberId : $scope.vm.batchNumberId,             //当前文件id
                answerType : $scope.vm.matchCondition,
                answerCondition : $scope.vm.answerCondition,
                possibleKnowledge : $scope.vm.selectInput,
                knowledgeTitle : $scope.vm.selectInput
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status == 10014){
                    $scope.vm.listData = data.data.testResultList;
                    $scope.vm.listDataTotal = data.data.total;
                    $scope.vm.paginationConf1.currentPage =index ;
                    $scope.vm.paginationConf1.totalItems =data.data.total ;
                    $scope.vm.paginationConf1.numberOfPages = data.data.total/$scope.vm.paginationConf1.pageSize ;
                    console.log($scope.vm.paginationConf1);
                }else if(data.status == 10005){
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf1.totalItems=0;
                    layer.msg("没有查询到记录!",{time:1000});
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /*****************
         * //导出功能
         * *****************/
        function exportExcel(){
            var i = layer.msg('导出中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            FunctionServer.exportExcel.save({
                batchNumberId:$stateParams.batchNumberId
            },function (data) {
                layer.close(i);
                console.log(data)
                if(data.status==500){
                    //layer.msg("导出失败")
                    console.log("导出失败");
                }else{
                    //window.open("/api/application/detail/downloadExcel?fileName="+ data.data);
                    var url = FunctionServer.downloadExcel + data.data;
                    downLoadFiles(angular.element('.test_result')[0] ,url);
                }
                
            },function(err){
                layer.close(i);
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
                    $scope.vm.deleteIds.push(item.testResultId);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.deleteIds = [];
            }
            //console.log( $scope.vm.deleteIds);
        }
        /*****************
         * //单选
         * *****************/
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
        /*****************
         * //批量测试
         * *****************/
        function batchTest(){
            if($scope.vm.serviceId) {

                FunctionServer.batchTest.save({
                    applicationId :  APPLICATION_ID,
                    userId :  USER_ID,
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
                },function(err){
                    $log.log(err);
                });
            }else{
                layer.msg("当前应用下没有发布服务，请发布服务后进行测试",{time:1000});
            }


        }
        /*****************
         * //测试弹窗
         * *****************/
        function testDialog(){
            if($scope.vm.deleteIds.length == 0){
                layer.msg("请选择要测试的知识！",{time:1000});
                return;
            }

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/test_result/test_dialog.html','450px',function(){
                batchTest();
            },function(){

            });

        }
        /*****************
         * //页面初始化加载已发布服务
         * *****************/
        getService();
        function getService(){
            FunctionServer.getService.save({
                applicationId:APPLICATION_ID,
            },function(data){
                if(data.status == 10000){
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].serviceId ;
                }else if(data.status == 10005) {
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试");
                }
            },function(err){
                $log.log(err);
            });
        }
    }
]);