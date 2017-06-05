/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('viewDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            pageSize:5,
            batchNumberId:"",
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            listData:[],
            listDataTotal:0,
            possibleKnowledge:"",
            knowledgeTitle:"",
            allowSubmit:1, //是否允许提交
            //-----------------------------------------方法
            getData:getData,
            addKnow : addKnow,
            editKnow : editKnow,
            deleteKnow:deleteKnow,
            verifyRelease:verifyRelease, // 校验方法

        };

        getData(1);
        function getData(index){
            httpRequestPost("/api/application/detail/getDetailList",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId,
                batchNumberId:$stateParams.batchNumberId,
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.detailList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败");
            })  ;
        }

        function verifyRelease(){
            if($scope.vm.possibleKnowledge == null || $scope.vm.possibleKnowledge == ""){
                layer.msg("测试问法不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.knowledgeTitle == null || $scope.vm.knowledgeTitle == ""){
                layer.msg("知识标题不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var b = /^[\w+\u4e00-\u9fa5]+$/;     //限制特殊字符正则表达式
            if(!b.test($scope.vm.possibleKnowledge)){
                layer.msg("测试问法不能包含特殊字符!");
                return 0;
            };
            if(!b.test($scope.vm.knowledgeTitle)){
                layer.msg("知识标题不能包含特殊字符!");
                return 0;
            }
            if($scope.vm.possibleKnowledge.length > 50){
                layer.msg("测试问法长度不能超过50个字符!");
                return 0;
            }
            if($scope.vm.knowledgeTitle.length > 50){
                layer.msg("知识标题长度不能超过50个字符!",{icon:2,time:2000});
                return 0;
            }
            return 1;
        }

        function addKnow(){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        if($scope.vm.allowSubmit){
                            httpRequestPost("/api/application/detail/addKnowledge", {
                                applicationId: $scope.vm.applicationId,
                                batchNumberId: $stateParams.batchNumberId,
                                possibleKnowledge: $scope.vm.possibleKnowledge,
                                knowledgeTitle: $scope.vm.knowledgeTitle,
                            }, function (data) {
                                //刷新页面
                                $state.reload();
                                if (data.status == 10012) {
                                    layer.msg("该测试问法已经存在，请重新添加!")
                                } else if (data.status == 10011) {
                                    layer.msg("添加成功!");
                                } else {
                                    layer.msg("添加失败!");
                                }
                            }, function () {
                                layer.msg("请求失败")
                            })
                        }
                        $scope.vm.possibleKnowledge = "",
                            $scope.vm.knowledgeTitle = ""
                    } else {
                        $scope.vm.possibleKnowledge = "",
                            $scope.vm.knowledgeTitle = ""
                    }
                }
            });
        }
        function editKnow(data){
            $scope.vm.detailId = data.detailId
            $scope.vm.possibleKnowledge = data.possibleKnowledge
            $scope.vm.knowledgeTitle = data.knowledgeTitle
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsEditDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        if($scope.vm.allowSubmit){
                            httpRequestPost("/api/application/detail/updateKnowledge", {
                                possibleKnowledge: $scope.vm.possibleKnowledge,
                                knowledgeTitle: $scope.vm.knowledgeTitle,
                                detailId:$scope.vm.detailId
                            }, function (data) {
                                //刷新页面
                                $state.reload();
                                if (data.status == 10012) {
                                    layer.msg("该测试问法已经存在，请重新添加!")
                                } else if (data.status == 10018) {
                                    layer.msg("修改成功!");
                                } else {
                                    layer.msg("修改失败!");
                                }
                            }, function () {
                                layer.msg("请求失败")
                            })
                        }
                    } else {
                        $scope.vm.possibleKnowledge = "";
                        $scope.vm.knowledgeTitle = "";
                    }
                }
            });
        }

        function deleteKnow(){

        }



        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
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