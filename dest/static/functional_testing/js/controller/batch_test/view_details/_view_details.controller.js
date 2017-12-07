/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('viewDetailsController', [
    '$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore) {
        console.log($stateParams)
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            paginationConf : {                 //分页条件
                pageSize : 5  , //默认每页数量
                pagesLength: 10//分页框数量
            }  ,
            batchNumberId:$stateParams.batchNumberId,
            listData:[],
            listDataTotal:0,
            possibleKnowledge:"",
            knowledgeTitle:"",
            value:"",
            allowSubmit:1, //是否允许提交
            //-----------------------------------------方法
            getData:getData,
            addKnow : addKnow,
            editKnow : editKnow,
            deleteKnow:deleteKnow,
            verifyRelease:verifyRelease, // 校验方法
            search:search,
            exportExcel:exportExcel
        };
        /**
         * 获取数据
         */
        getData(1);
        function getData(index){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            FunctionServer.DetailgetData.save({
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                applicationId:APPLICATION_ID,
                batchNumberId:$stateParams.batchNumberId
            },function(data){
                layer.close(i);
                console.log(data);
                $scope.vm.listData = data.data.detailList;
                $scope.vm.listDataTotal = data.data.total;

                $scope.vm.paginationConf.currentPage =index ;
                $scope.vm.paginationConf.totalItems =data.data.total ;
                $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                console.log($scope.vm.paginationConf);
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }
        /**
         * 校验
         */
        function verifyRelease(){
            if($scope.vm.possibleKnowledge == null || $scope.vm.possibleKnowledge == ""){
                layer.msg("测试问法不能为空!",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.knowledgeTitle == null || $scope.vm.knowledgeTitle == ""){
                layer.msg("知识标题不能为空!",{time:1000});
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var b = /^[\w+\u4e00-\u9fa5]+$/;     //限制特殊字符正则表达式
            if(!b.test($scope.vm.possibleKnowledge)){
                layer.msg("测试问法不能包含特殊字符!",{time:1000});
                return 0;
            };
            if(!b.test($scope.vm.knowledgeTitle)){
                layer.msg("知识标题不能包含特殊字符!",{time:1000});
                return 0;
            }
            if($scope.vm.possibleKnowledge.length > 50){
                layer.msg("测试问法长度不能超过50个字符!",{time:1000});
                return 0;
            }
            if($scope.vm.knowledgeTitle.length > 50){
                layer.msg("知识标题长度不能超过50个字符!",{icon:2,time:1000});
                return 0;
            }
            return 1;
        }
        /**
         * 添加
         */
        function addKnow(){

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/view_details/view_details_dialog.html','500px',function(){
                if($scope.vm.allowSubmit){
                    
                    FunctionServer.addKnow.save({
                        applicationId: APPLICATION_ID,
                        batchNumberId: $stateParams.batchNumberId,
                        possibleKnowledge: $scope.vm.possibleKnowledge,
                        knowledgeTitle: $scope.vm.knowledgeTitle
                    },function(data){
                        //刷新页面
                        $state.reload();
                        if (data.status == 10012) {
                            layer.msg("该测试问法已经存在，请重新添加!",{time:1000})
                        } else if (data.status == 10011) {
                            layer.msg("添加成功!",{time:1000});
                        } else {
                            //layer.msg("添加失败!");
                            console.log("添加失败!");
                        }
                    },function(err){
                        $log.log(err);
                    });
                }
                $scope.vm.possibleKnowledge = "";
                $scope.vm.knowledgeTitle = ""
            },function(){
                $scope.vm.possibleKnowledge = "";
                $scope.vm.knowledgeTitle = ""
            });

        }
        /**
         * 编辑
         */
        function editKnow(data){
            $scope.vm.detailId = data.detailId;
            $scope.vm.possibleKnowledge = data.possibleKnowledge;
            $scope.vm.knowledgeTitle = data.knowledgeTitle;

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/view_details/view_details_edit_dialog.html','500px',function(){
                if($scope.vm.allowSubmit){

                    FunctionServer.editKnow.save({
                        possibleKnowledge: $scope.vm.possibleKnowledge,
                        knowledgeTitle: $scope.vm.knowledgeTitle,
                        detailId:$scope.vm.detailId,
                        batchNumberId: $stateParams.batchNumberId,
                    },function(data){
                        //刷新页面
                        if (data.status == 10002) {
                            layer.msg("该测试问法已经存在，请重新添加!",{time:1000})
                        } else if (data.status == 10018) {
                            $state.reload();
                            layer.msg("修改成功!",{time:1000});
                        } else {
                            //layer.msg("修改失败!");
                            console.log("修改失败!");
                        }
                    },function(err){
                        $log.log(err);
                    });
                }
            },function(){
                $scope.vm.possibleKnowledge = "";
                $scope.vm.knowledgeTitle = "";
            });
        }
        /**
         * 删除
         */
        function deleteKnow(detailId){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/functional_testing/batch_test/batch_test_dialog.html','400px',function(){

                FunctionServer.deleteKnow.save({
                    detailId:detailId
                },function(data){
                    //刷新页面
                    $state.reload();
                    if (data.status == 10013) {
                        layer.msg("删除成功!",{time:1000})
                    } else if (data.status == 10014) {
                        //layer.msg("删除失败!");
                        console.log("删除失败!");
                    }
                },function(err){
                    $log.log(err);
                });
            },function(){

            });
        }
        /**
         * 查询
         */
        function search(index){
            var i = layer.msg('查询中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            FunctionServer.search.save({
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                applicationId:APPLICATION_ID,
                batchNumberId:$stateParams.batchNumberId,
                possibleKnowledge:$scope.vm.value,
                knowledgeTitle:$scope.vm.value
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status == 10005){
                    layer.msg("查询到记录为空",{time:1000});
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf.totalItems = 0;
                }
                $scope.vm.listData = data.data.detailList;
                $scope.vm.listDataTotal = data.data.total;

                $scope.vm.paginationConf.currentPage =index ;
                $scope.vm.paginationConf.totalItems =data.data.total ;
                $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                console.log($scope.vm.paginationConf);
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 知识导出
         */
        function exportExcel(){
            var i = layer.msg('导出中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            FunctionServer.exportExcel.save({
                batchNumberId:$stateParams.batchNumberId
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status==500){
                    console.log("导出失败");
                }else{
                  //  window.open("/api/application/detail/downloadExcel?fileName="+ data.data);
                    var url = FunctionServer.downloadExcel + data.data;
                    downLoadFiles(angular.element('.chat_test_wrap')[0] ,url);
                }

            },function(err){
                layer.close(i);
                $log.log(err);
            });

        }

        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    getData(current);
                }, 0);
            }
        },true);
        
    }
]);