/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('chatPageConfigController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog", "$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog, $cookieStore,$timeout) {
        $scope.vm = {
            listData : "",   // table 数据
            listKnoData : "", //知识数据
            listDataTotal : "", //总数
            pageSize : 5,
            indexV :1,
            listKnoDataTotal : "", //聊天知识库知识总数
            knowledgeId : "",
            knowledgeTitle : "",
            userId: $cookieStore.get("userId"),
            applicationId: $cookieStore.get("applicationId"),
            paginationConf : "", //分页条件
            paginationConf1 : "",
            deleteIds : [],
            selectAllCheck : false,
            hotQuestionTitle : "",
            knowledge : "",
            listDataLength : "",
            selectAllCheckDialog : false,         
            seleceAddAll : [],
            //knowledge : [],
            //========================方法=========================
            getData : getData, //返回知识列表数据
            addHotIssues : addHotIssues,  //添加方法
            toTop : toTop, //知识置顶
            move : move, //知识上移
            down : down,  //知识下移
            deleteKnowledge : deleteKnowledge, //删除知识
            selectAll : selectAll,
            selectSingle : selectSingle,
            findHotQuestion : findHotQuestion,
            findKnowledge : findKnowledge,
            selectAllDialog : selectAllDialog,
            selectSingleDialog : selectSingleDialog,
            deleteDialog : deleteDialog,

            setFlag : false   // 设置手动设置开关
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
            console.log( $scope.vm.seleceAddAll);
        }
        function deleteDialog(item){
            $scope.vm.seleceAddAll.remove(item);
            $(".selectAllBtnDialog").prop("checked",false);
            $(".selectSingle").eq(item.index).attr("checked",false);
        }

        function selectSingleDialog(ev,id,name,index){
            var self = $(ev.target);
            var prop = self.prop("checked");
            console.log(prop);
            var obj = {};
            console.log(id , name) ;
            obj.chatKnowledgeId = id;
            obj.chatKnowledgeTopic = name;
            obj.index = index;
            if(!prop){
                    angular.forEach($scope.vm.seleceAddAll,function(item,index){
                        if(id==item.chatKnowledgeId){
                            $scope.vm.seleceAddAll.splice(index,1)
                        }
                    });
                //$scope.vm.seleceAddAll.remove(obj);
                $(".selectAllBtnDialog").prop("checked",false)
            }else{
                $(".selectAllBtnDialog").prop("checked",false);
                $scope.vm.seleceAddAll.push(obj)
            }
        }

        function selectAll(ev){
            //var self = $(ev.target);
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.hotQuestionId);
                });
            }else{
                $scope.vm.selectAllCheck = false
                $scope.vm.deleteIds = [];
            }
            console.log( $scope.vm.deleteIds)
        }
       function selectSingle(ev,id){
           var self = $(ev.target);
           if(self.attr('checked')){    
               self.attr('checked',false);
               $scope.vm.deleteIds.remove(id);
               $(".selectAllBtn").attr("checked",false)
           }else{
               $(".selectAllBtn").attr("checked",false)
               $scope.vm.deleteIds.push(id)
           }
           console.log( $scope.vm.deleteIds)
       }
        //加载列表
        getData(1);
        function getData(index){
            httpRequestPost("/api/application/hotQuestion/getHotQuestionList",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId,
                hotQuestionTitle: $scope.vm.hotQuestionTitle,
            },function(data){
                console.log(data);
                if(data.status == 10005){
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: 0, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                    $scope.$apply();
                    layer.msg("没有查询到记录!");
                }else{
                    $scope.vm.listData = data.data.hotQuestionList;
                    $scope.vm.listDataTotal = data.data.total;
                    $scope.vm.listDataLength = data.data.total;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                    $scope.$apply()
                }
            },function(){
                layer.msg("请求失败")
            })
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getData(current);
                }, 100)
            }
        },true);
        //从聊天知识库查询知识
        function findKnowledge(index){
            httpRequestPost("/api/ms/knowledgeManage/overView/findKnowledgeByApplicationId",{
                applicationId:$scope.vm.applicationId,
                knowledgeTitle : $scope.vm.knowledge,
                pageSize : $scope.vm.pageSize,
                index : (index - 1)*$scope.vm.pageSize,
            },function(data){
                    if( data.data.total == 0){
                        layer.msg("查询记录为空") ;
                        $scope.vm.knowledge = "";
                    }
                        console.log(index ,data) ;
                        $scope.vm.listKnoData = data.data.objs;
                        $scope.vm.listKnoDataTotal = data.data.total;
                        $scope.vm.paginationConf1 = {
                            currentPage: index,//当前页
                            totalItems:data.data.total, //总条数
                            pageSize: $scope.vm.pageSize,//第页条目数
                            pagesLength: 8,//分页框数量
                        };
                        $scope.$apply()

            },function(){
                layer.msg("请求失败")
            })
        }
        var timeout2 ;
        $scope.$watch('vm.paginationConf1.currentPage', function(current){
            if(current){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    findKnowledge(current);
                }, 100)
            }
        },true);

        //删除知识
        function deleteKnowledge(){
            if($scope.vm.deleteIds == 0){
                layer.msg("请选择要删除的知识！");
                return;
            }
            var dialog = ngDialog.openConfirm({
                template : "/know_index/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback : function(e){
                    if(e === 1){
                        httpRequestPost("/api/application/hotQuestion/deleteHotQuestionByIds",{
                            applicationId :  $scope.vm.applicationId,
                            ids :  $scope.vm.deleteIds
                        },function(data){
                            //$state.reload();
                            if(data.status == 10013){
                                $scope.vm.selectAllCheck = false;
                                $state.reload();
                                layer.msg("删除成功");
                            }else{
                                layer.msg("删除失败")
                            }
                        },function(){
                            layer.msg("请求失败")
                        });
                    }
                }
            });
        }

        //查找知识
        function findHotQuestion(){
            //为空查询分页
            if($scope.vm.hotQuestionTitle == '' || $scope.vm.hotQuestionTitle == null){
                getData(1)
            }else {
                httpRequestPost("/api/application/hotQuestion/findHotQuestion", {
                    hotQuestionTitle: $scope.vm.hotQuestionTitle,
                    applicationId: $scope.vm.applicationId,
                }, function (data) {
                    if (data.status == 10005) {
                        $scope.vm.listData = "";
                        $scope.vm.listDataTotal = 0;
                        $scope.$apply();
                        layer.msg("没有查询到记录!")  ;
                        $scope.vm.listData = [];
                        $scope.vm.listDataTotal = 0;
                         return
                    }
                    $scope.vm.listData = data.data.hotQuestionList;
                    $scope.vm.listDataTotal = data.data.total;
                    $scope.$apply()
                }, function () {
                    layer.msg("请求失败")
                })
            }
        }

        //知识置顶
        function toTop(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/top",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
                //$state.reload();
                getData(1);
            },function(){
                layer.msg("请求失败")
            })
        }
        //知识上移
        function move(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/moveUp",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
                //$state.reload();
                getData(1);
            },function(){
                layer.msg("请求失败")
            })
        }

        //知识下移
        function down(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/moveDown",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
                //$state.reload();
                getData(1);
            },function(){
                layer.msg("请求失败")
            })
        }
        //添加知识
        function addHotIssues(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/chatPageConfigDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.seleceAddAll);
                        httpRequestPost("/api/application/hotQuestion/batchAdd",{
                            applicationId : $scope.vm.applicationId,
                            userId :  $scope.vm.userId,
                            hotKnowledgeList : $scope.vm.seleceAddAll
                        },function(data){
                            //$state.reload();
                            getData(1);
                            if(data.status == 10012){
                                layer.msg("该知识已经存在,请重新添加!")
                            }
                        },function(){
                            layer.msg("请求失败")
                        })
                        //保存的同时清空数据
                        $scope.vm.selectAllCheck = false;
                        $scope.vm.selectAllCheckDialog = false;
                        $scope.vm.seleceAddAll = [];
                        $scope.vm.listKnoData = [];
                        $scope.vm.knowledge = "";
                        $scope.vm.listKnoDataTotal = 0,
                        $scope.vm.paginationConf1 = ''
                    }else{
                        //取消的同时清空数据
                        $scope.vm.selectAllCheckDialog = false;
                        $scope.vm.seleceAddAll = [];
                        $scope.vm.listKnoData = [];
                        $scope.vm.knowledge = "";
                        $scope.vm.listKnoDataTotal = 0,
                        $scope.vm.paginationConf1 = ''
                    }
                }
            });
        }
    }
]);