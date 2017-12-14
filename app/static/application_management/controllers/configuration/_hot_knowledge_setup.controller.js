/**
 * Created by mileS on 2017/3/28.
 * Describe ： 热点知识设置
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('HotKnowledgeSetupController',
    [ '$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog", "$cookieStore","$timeout",
    ($scope,localStorageService,ApplicationServer, $state,ngDialog, $cookieStore,$timeout) =>{
        $scope.vm = {
    //热点知识
            hotKnowList : "",       // 热点知识 数据
            hotQuestionTitle : "",  // 热点知识搜索标题
            simpleOperateTitle : "确定删除选中的热点知识" , // 删除热点知识弹框标题
            hotPaginationConf : {   // 热点知识分页
                pageSize: 5,        //第页条目数
                pagesLength: 10     //分页框数量
            },
            hotKnowDelIds : [] ,     //要删除热点知识的 id 集合
            isAllHotKnowSelected : false , //热点知识是否全选
            addHotHotKnow : addHotHotKnow,  //添加方法
            queryHotKnowledgeList : queryHotKnowledgeList , //获取热点知识列表
            setFlag : false ,   // 设置手动设置开关
            toTop : toTop, //知识置顶
            move : move, //知识上移
            down : down,  //知识下移
            selectSingleHotKnow : selectSingleHotKnow,           // 单独选择热点知识
            selectAllHotKnow : selectAllHotKnow,   //热点知识全选
            removeHotKnowledge : removeHotKnowledge, //删除知识
    //所有知识
            knowledgeList : "",     //知识数据
            knowledgeTitle : "",    //知识搜索标题
            knowPaginationConf : {  //添加弹框知识分页
                pageSize : 5 ,
                pagesLength : 8
            },
            isAllKnowSelected : false,  //是否全选
            selectedKnow : [] ,
            queryKnowledgeList : queryKnowledgeList,  // 知识列表弹框
            selectAllKnow : selectAllKnow ,       // 全选
            selectSingleKnow : selectSingleKnow  // 单独添加
        };
        function selectAllKnow(ev){
            //var self = $(ev.target);
            if(!$scope.vm.isAllHotKnowSelectedDialog){
                $scope.vm.isAllHotKnowSelectedDialog = true;
                $scope.vm.seleceAddAll = [];
                angular.forEach($scope.vm.knowledgeList,function(item,index){
                    $scope.vm.seleceAddAll.push({
                        chatKnowledgeId : item.knowledgeId ,
                        chatKnowledgeTopic : item.knowledgeTitle,
                        index : index
                    });
                });
            }else{
                $scope.vm.isAllHotKnowSelectedDialog = false ;
                $scope.vm.seleceAddAll = [];
            }
            //console.log( $scope.vm.seleceAddAll);
        }
        //function deleteDialog(item){
        //    $scope.vm.seleceAddAll.remove(item);
        //    $(".selectAllBtnDialog").prop("checked",false);
        //    $(".selectSingle").eq(item.index).attr("checked",false);
        //}

        function selectSingleKnow(ev,id,name,index){
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
        function selectAllHotKnow(){
            if(!$scope.vm.isAllHotKnowSelected){
                $scope.vm.isAllHotKnowSelected = true;
                $scope.vm.hotKnowDelIds = [];
                angular.forEach($scope.vm.hotKnowList,function(item){
                    $scope.vm.hotKnowDelIds.push(item.hotQuestionId);
                });
            }else{
                $scope.vm.isAllHotKnowSelected = false ;
                $scope.vm.hotKnowDelIds = [];
            }
        }
        function selectSingleHotKnow(id){
            if($scope.vm.hotKnowDelIds.inArray(id)){
                $scope.vm.hotKnowDelIds.remove(id);
                $scope.vm.isAllHotKnowSelected = false;
            }else{
                $scope.vm.hotKnowDelIds.push(id);
            }
            // 是否触发全选按钮
            if($scope.vm.hotKnowDelIds.length==$scope.vm.hotKnowList.length){
                $scope.vm.isAllHotKnowSelected = true;
            }
        }
        queryHotKnowledgeList(1) ;
        //加载热点知识列表
        function queryHotKnowledgeList(index){
            ApplicationServer.queryHotKnowledgeList.save({
                    index:(index - 1)*$scope.vm.hotPaginationConf.pageSize,
                    pageSize:$scope.vm.hotPaginationConf.pageSize,
                    keyWords : $scope.vm.hotQuestionTitle
                },
                function(response){
                    if( response.status == 200 ){
                        $scope.vm.hotKnowList = response.data.hotQuestionList;
                        $scope.vm.hotPaginationConf.totalItems = response.data.total ;
                        $scope.vm.hotPaginationConf.numberOfPages = response.data.total/$scope.vm.hotPaginationConf.pageSize ;
                    }else{
                        layer.msg("查询记录为空") ;
                        $scope.vm.hotPaginationConf.totalItems = 0 ;
                    }
                    initHotKnowSelected() ;
                },function(error){console.log(error)})
        }
        queryKnowledgeList(1) ;
        //从聊天知识库查询知识
        function queryKnowledgeList(index){
            ApplicationServer.queryKnowledgeList.save({
                applicationId:APPLICATION_ID,
                knowledgeTitle : $scope.vm.knowledgeTitle,
                pageSize : $scope.vm.knowPaginationConf.pageSize,
                index : (index - 1)*$scope.vm.knowPaginationConf.pageSize
            },function(response){
                if( response.data.total == 0 ){
                    layer.msg("查询记录为空") ;
                    $scope.vm.knowledgeList = [] ;
                    $scope.vm.knowPaginationConf.totalItems = 0 ;
                }else{
                    $scope.vm.knowledgeList = response.data.objs;
                    $scope.vm.knowPaginationConf.totalItems = response.data.total ;
                    $scope.vm.knowPaginationConf.numberOfPages = response.data.total/$scope.vm.knowPaginationConf.pageSize ;
                }
            },function(error){console.log(error)})
        }
        // 分页
        let timeout ,timeout2;
        $scope.$parent.$parent.MASTER.initPageTimer($scope,timeout,"vm.hotPaginationConf.currentPage",queryHotKnowledgeList) ;
        $scope.$parent.$parent.MASTER.initPageTimer($scope,timeout2,"vm.knowPaginationConf.currentPage",queryKnowledgeList) ;
        // $scope.$watch('vm.hotPaginationConf.currentPage', function(current){
        //     if(current){
        //         if (timeout) {
        //             $timeout.cancel(timeout)
        //         }
        //         timeout = $timeout(function () {
        //             queryHotKnowledgeList(current);
        //         }, 100)
        //     }
        // },true);
        // var timeout2 ;
        // $scope.$watch('vm.knowPaginationConf.currentPage', function(current){
        //     if(current){
        //         if (timeout2) {
        //             $timeout.cancel(timeout2)
        //         }
        //         timeout2 = $timeout(function () {
        //             queryKnowledgeList(current);
        //         }, 100)
        //     }
        // },true);
        //hotQuestionTitle
        //删除知识
        function removeHotKnowledge(){
            if($scope.vm.hotKnowDelIds == 0){
                layer.msg("请选择要删除的知识！");
            }else{
                let delHtml = require("../../../../share/simple_operate.html") ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope,delHtml,"300px",function(){
                    ApplicationServer.removeHotKnowledge.save({
                        ids :  $scope.vm.hotKnowDelIds
                    },function(data){
                        //$state.reload();
                        if(data.status == 10013){
                            $scope.vm.isAllHotKnowSelected = false;
                            $state.reload();
                            layer.msg("删除成功");
                        }else{
                            layer.msg("删除失败")
                        }
                    },function(error){console.log(error)})
                })
            }
        }

        //知识置顶
        function toTop(item){
            ApplicationServer.hotKnowledgeStick.save({
                    applicationId : APPLICATION_ID,
                    hotQuestionId : item.hotQuestionId,
                    hotQuestionOrder : item.hotQuestionOrder
                },function(response){
                queryHotKnowledgeList(1);
                },function(error){console.log(error)                })
        }
        //知识上移
        function move(item){
            ApplicationServer.hotKnowledgeUp.save({
                    applicationId : APPLICATION_ID,
                    hotQuestionId : item.hotQuestionId,
                    hotQuestionOrder : item.hotQuestionOrder,
                },function(response){
                    queryHotKnowledgeList(1);
                },function(error){console.log(error)})
        }

        //知识下移
        function down(item){
            ApplicationServer.hotKnowledgeDown.save({
                applicationId : APPLICATION_ID,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(response){
                queryHotKnowledgeList(1);
            },function(error){console.log(error)})
        }
        //添加知识
        function addHotHotKnow(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/config/hot_knowledge_setup/add_hot_knowledge.html","700px",function(){
                console.log($scope.vm.seleceAddAll);
                ApplicationServer.addHotKnowledge.save({
                    applicationId : APPLICATION_ID,
                    userId :  USER_ID,
                    hotKnowledgeList : $scope.vm.seleceAddAll
                },function(response){
                    if(response.status == 10012){
                        layer.msg("该知识已经存在,请重新添加!")
                    }else{
                        queryHotKnowledgeList(1);
                    }
                },function(error){console.log(error)}) ;
            },function(){
                //取消的同时清空数据
                $scope.vm.selectAllCheckDialog = false;
                $scope.vm.seleceAddAll = [];
                $scope.vm.knowledgeList = [];
                $scope.vm.knowledgeTitle = "";
                $scope.vm.knowPaginationConf = '' ;
            }) ;
        }
        //重置已选择的热点知识
        function initHotKnowSelected(){
            $scope.vm.hotKnowDelIds = [];
            $scope.vm.isAllHotKnowSelected = false;
        }

    }
    ])
};