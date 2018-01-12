/**
 * Created by mileS on 2017/3/28.
 * Describe ： 热点知识设置
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('HotKnowledgeSetupController',
    [ '$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"$location",
    ($scope,localStorageService,ApplicationServer, $state,$location) =>{
        // 热点知识
        $scope.hotKnowledge = {
            simpleOperateTitle : "确定删除选中的热点知识" , // 删除热点知识弹框标题
            //热点知识
            hotKnowList : "",       // 热点知识 数据
            hotKnowListIds : [] ,
            deleteIds : [] ,
            keyWord  : "",  // 热点知识搜索标题
            paginationConf : {   // 热点知识分页
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : queryHotKnowledgeList,
                location : true
            },
            updataRate : "", // 更新频率
            hotKnowDelIds : [] ,     //要删除热点知识的 id 集合
            addHotHotKnow : addHotHotKnow,  //添加方法
            queryHotKnowledgeList : queryHotKnowledgeList , //获取热点知识列表
            top : top, //知识置顶
            up : up, //知识上移
            down : down,  //知识下移
            removeHotKnowledge : removeHotKnowledge, //删除知识
        } ;
        // 知识库列表
        $scope.knowledge = {
            knowledgeList : "",     //知识数据
            knowledgeTitle : "",    //知识搜索标题
            paginationConf : {  //添加弹框知识分页
                pageSize :5 ,
                currentPage: 1 ,
                search : queryKnowledgeList,
            },
            isAllKnowSelected : false,  //是否全选
            selectedKnow : [] ,
            queryKnowledgeList : queryKnowledgeList,  // 知识列表弹框
        };
        let addHotHtml = require("../../views/configuration/hot_knowledge_setup/add_hot_knowledge.html") ;
        let delHtml    = require("../../../../share/dialog_simple_operate.html") ;

        queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
        //加载热点知识列表
        function queryHotKnowledgeList(index,pageSize){
            ApplicationServer.queryHotKnowledgeList.save({
                    index:(index - 1)*pageSize,
                    pageSize:pageSize,
                    knowledgeTitle : $scope.hotKnowledge.keyWord
                },
                function(response){
                    if( response.status == 200 ){
                        $scope.hotKnowledge.hotKnowList = response.data.hotQuestionList;
                        $scope.hotKnowledge.paginationConf.totalItems = response.data.total ;
                        $scope.hotKnowledge.paginationConf.numberOfPages = response.data.total/pageSize ;
                    }else{
                        layer.msg(response.data) ;
                        $scope.hotKnowledge.paginationConf.totalItems = 0 ;
                    }
                    initHotKnowSelected() ;
                },function(error){console.log(error)})
        }
        queryKnowledgeList($scope.knowledge.paginationConf.currentPage,$scope.knowledge.paginationConf.pageSize) ;
        //从聊天知识库查询知识
        function queryKnowledgeList(index,pageSize){
            ApplicationServer.queryKnowledgeList.save({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "title": $scope.knowledge.knowledgeTitle,         //知识标题默认值null
            },function(response){
                if( response.data.total == 0 ){
                    layer.msg("查询记录为空") ;
                    $scope.vm.knowledgeList = [] ;
                    $scope.vm.paginationConf.totalItems = 0 ;
                }else{
                    $scope.vm.knowledgeList = response.data.objs;
                    $scope.vm.paginationCon.totalItems = response.data.total ;
                    $scope.vm.paginationCon.numberOfPages = response.data.total/pageSize ;
                }
            },function(error){console.log(error)})
        }
        //添加知识
        function addHotHotKnow(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,addHotHtml,"700px",function(){
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
                $scope.vm.keyWord = "";
                $scope.vm.paginationCon = '' ;
            }) ;
        }
        //删除知识
        function removeHotKnowledge(){
            if($scope.vm.hotKnowDelIds == 0){
                layer.msg("请选择要删除的知识！");
            }else{
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
        function top(item){
            ApplicationServer.hotKnowledgeStick.save({
                    applicationId : APPLICATION_ID,
                    hotQuestionId : item.hotQuestionId,
                    hotQuestionOrder : item.hotQuestionOrder
                },function(response){
                queryHotKnowledgeList(1);
                },function(error){console.log(error)                })
        }
        //知识上移
        function up(item){
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
        getHotKnowledgeConfig() ;
        // 热点知识配置（更新频率）
        function getHotKnowledgeConfig(){
            ApplicationServer.getHotKnowledgeConfig.get({
                id : APPLICATION_ID
            },function (response) {
                if(response.status == 200){
                    $scope.hotKnowledge.updataRate = response.data.hotQuestionTimeout
                }
            })
        }
        //重置已选择的热点知识
        function initHotKnowSelected(){
            $scope.vm.hotKnowDelIds = [];
            $scope.vm.isAllHotKnowSelected = false;
        }
    }
    ])
};