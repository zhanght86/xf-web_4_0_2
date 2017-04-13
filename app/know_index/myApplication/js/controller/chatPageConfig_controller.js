/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('chatPageConfigController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userId","368191545326702592");
        $scope.vm = {
            listData : "",   // table 数据
            listKnoData : "", //知识数据
            listDataTotal : "", //总数
            listKnoDataTotal : "", //聊天知识库知识总数
            chatKnowledgeId : "",
            chatKnowledgeTopic : "",
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "", //分页条件
            deleteIds : [],
            selectAllCheck : false,
            hotQuestionTitle : "",
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
                    var obj = {};
                    obj.chatKnowledgeId = item.chatKnowledgeId;
                    obj.chatKnowledgeTopic = item.chatKnowledgeTopic;
                    obj.index = index;
                    $scope.vm.seleceAddAll.push(obj);
                });
            }else{
                $scope.vm.selectAllCheckDialog = false
                $scope.vm.seleceAddAll = [];
            }
            console.log( $scope.vm.seleceAddAll)
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
        getData();
        function getData(){
            httpRequestPost("/api/application/hotQuestion/getHotQuestionList",{
                index:0,
                pageSize:10,
                applicationId:$scope.vm.applicationId
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.hotQuestionList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.vm.listDataLength = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: 0,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }
        //从聊天知识库查询知识
        function findKnowledge(){
            httpRequestPost("/api/chatKnowledge/findChatKnowledgeByApplicationId",{
                applicationId:$scope.vm.applicationId,
            },function(data){
                $scope.vm.listKnoData = data.data.objs;
                $scope.vm.listKnoDataTotal = data.data.total;
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }

        //删除知识
        function deleteKnowledge(){
            httpRequestPost("/api/application/hotQuestion/deleteHotQuestionByIds",{
                applicationId :  $scope.vm.applicationId,
                ids :  $scope.vm.deleteIds
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }

        //查找知识
        function findHotQuestion(){
            httpRequestPost("/api/application/hotQuestion/findHotQuestion",{
                hotQuestionTitle:$scope.vm.hotQuestionTitle,
                applicationId:$scope.vm.applicationId,
            },function(data){
                if(data.status == 10005){
                    $scope.vm.listData = "";
                    $scope.vm.listDataTotal = 0;
                    $scope.$apply()
                    layer.msg("没有查询到记录!")
                }
                $scope.vm.listData = data.data.hotQuestionList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }

        //知识置顶
        function toTop(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/top",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
             $state.reload();
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
                $state.reload();
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
                $state.reload();
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
                            console.log(data);
                            $state.reload();
                            if(data.status == 10012){
                                layer.msg("数据重复!")
                            }
                        },function(){
                            layer.msg("请求失败")
                        })
                    }else{
                        $scope.vm.listKnoData = [],
                        $scope.vm.listKnoDataTotal = 0
                    }
                }
            });
        }
    }
]);