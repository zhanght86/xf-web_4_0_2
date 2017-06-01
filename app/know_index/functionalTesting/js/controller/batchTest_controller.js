/**
 * Created by 41212 on 2017/3/23.
 */

angular.module('functionalTestModule').controller('batchTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            deleteQuestion : deleteQuestion,
            uploadQuestion : uploadQuestion,
            startUp : startUp,
            
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


        };

        function selectAllDialog(ev){
            //var self = $(ev.target);
            if(!$scope.vm.selectAllCheckDialog){
                $scope.vm.selectAllCheckDialog = true;
                $scope.vm.seleceAddAll = [];
                angular.forEach($scope.vm.listKnoData,function(item,index){
                    //console.log(item)
                    var obj = {};
                    obj.chatKnowledgeId = item.knowledgeId;
                    obj.chatKnowledgeTopic = item.knowledgeTitle;
                    obj.index = index;
                    $scope.vm.seleceAddAll.push(obj);
                    console.log(obj);
                });
            }else{
                $scope.vm.selectAllCheckDialog = false ;
                $scope.vm.seleceAddAll = [];
            }
            console.log( $scope.vm.seleceAddAll)
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
                //if(data.status == 10005){
                //    layer.msg("查询到记录为空");
                //    return;
                //}
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
            },function(){
                layer.msg("请求失败");
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
                   return;
                }
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
            },function(){
                layer.msg("请求失败");
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
                }, 0);
            }
        },true);

        //批量上传
        function uploadQuestion(callback){
            var timer = $timeout(function(){
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/functionalTesting/batchUploadDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            
                        } else {

                        }
                    }
                });
            },350)

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
                                layer.msg("删除失败");
                            }
                        },function(){
                            layer.msg("请求失败");
                        });
                    }
                }
            });
        }
        //启动
        function startUp(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/startUpDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }

        //批量删除
        // function deleteDialog(item){
        //     $scope.vm.seleceAddAll.remove(item);
        //     $(".selectAllBtnDialog").prop("checked",false);
        //     $(".selectSingle").eq(item.index).attr("checked",false);
        // }

        // function selectSingleDialog(ev,id,name,index){
        //     var self = $(ev.target);
        //     var prop = self.prop("checked");
        //     console.log(prop);
        //     var obj = {};
        //     console.log(id , name) ;
        //     obj.chatKnowledgeId = id;
        //     obj.chatKnowledgeTopic = name;
        //     obj.index = index;
        //     if(!prop){
        //         angular.forEach($scope.vm.seleceAddAll,function(item,index){
        //             if(id==item.chatKnowledgeId){
        //                 $scope.vm.seleceAddAll.splice(index,1)
        //             }
        //         });
        //         //$scope.vm.seleceAddAll.remove(obj);
        //         $(".selectAllBtnDialog").prop("checked",false)
        //     }else{
        //         $(".selectAllBtnDialog").prop("checked",false);
        //         $scope.vm.seleceAddAll.push(obj)
        //     }
        // }

        function selectAll(ev){
            //var self = $(ev.target);
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
            console.log( $scope.vm.deleteIds);
        }
        function selectSingle(ev,id){
            var self = $(ev.target);
            if(self.attr('checked')){
                self.attr('checked',false);
                $scope.vm.deleteIds.remove(id);
                $(".selectAllBtn").attr("checked",false);
            }else{
                $(".selectAllBtn").attr("checked",false);
                $scope.vm.deleteIds.push(id);
            }
            console.log( $scope.vm.deleteIds);
        }
        
    }
]);