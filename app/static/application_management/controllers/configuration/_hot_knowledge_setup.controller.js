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
            hotQuestionTimeout : "", // 热点知识更新频率
            hotQuestionLimit : "", // 热点知识限制个数
            oldHotQuestionTimeout : "", // 热点知识更新频率
            oldHotQuestionLimit : "", // 热点知识限制个数
            hotKnowDelIds : [] ,     //要删除热点知识的 id 集合
            addHotHotKnow : addHotHotKnow,  //添加方法
            updateHotKnowledgeConfig : updateHotKnowledgeConfig , // 修改热点知识配置
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
            selectedList : [] ,  // 已选择知识
            paginationConf : {  //添加弹框知识分页
                pageSize :5 ,
                currentPage: 1 ,
                search : queryKnowledgeList,
                location:false
            },
            isAllKnowSelected : false,  //是否全选
            removeSelected : removeSelected,
            selectAllKnow :selectAllKnow ,  //全部选择
            selectSingle : selectSingle ,// 单条选择
            queryKnowledgeList : queryKnowledgeList,  // 知识列表弹框
        };
        let addHotHtml = require("../../views/configuration/hot_knowledge_setup/add_hot_knowledge.html") ;
        let delHtml    = require("../../../../share/dialog_simple_operate.html") ;

        queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
        //加载热点知识列表
        function queryHotKnowledgeList(index,pageSize){
            let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
            $scope.hotKnowledge.hotKnowListIds = [] ;
            ApplicationServer.queryHotKnowledgeList.save({
                    index:(index - 1)*pageSize,
                    pageSize:pageSize,
                    knowledgeTitle : $scope.hotKnowledge.keyWord
                },
                function(response){
                    layer.close(i) ;
                    if( response.status == 200 ){
                        if(response.data.data.length){
                            $scope.hotKnowledge.hotKnowListIds =  response.data.data.map(item=>item.id) ;
                        }
                        $scope.hotKnowledge.hotKnowList = response.data.data;
                        $scope.hotKnowledge.paginationConf.totalItems = response.data.total ;
                        $scope.hotKnowledge.paginationConf.numberOfPages = response.data.total/pageSize ;
                    }else{
                        layer.msg(response.data) ;
                        $scope.hotKnowledge.paginationConf.totalItems = 0 ;
                    }
                    initHotKnowSelected() ;
                },function(error){console.log(error);layer.close(i) ;})
        }
        //从聊天知识库查询知识
        function queryKnowledgeList(index,pageSize){
            return ApplicationServer.queryKnowledgeList.save({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "title": $scope.knowledge.knowledgeTitle,         //知识标题默认值null
            },function(response){
                if( response.data.total == 0 ){
                    layer.msg("查询记录为空") ;
                    $scope.knowledge.knowledgeList = [] ;
                    $scope.knowledge.paginationConf.totalItems = 0 ;
                }else{
                    $scope.knowledge.knowledgeList = response.data.data;
                    $scope.knowledge.paginationConf.totalItems = response.data.total ;
                    $scope.knowledge.paginationConf.numberOfPages = response.data.total/pageSize ;
                }
            },function(error){console.log(error)})
        }
        function selectAllKnow() {
            if($scope.knowledge.isAllKnowSelected == false){   // // 选择全部
                $scope.knowledge.selectedList = $scope.knowledge.selectedList.concat(knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList));
            }else{//取消全部
                let i = 0 ;
                angular.forEach($scope.knowledge.knowledgeList,function(val,cur){
                    angular.forEach($scope.knowledge.selectedList,function(know,index){
                        if(know.id == val.id){
                            $scope.knowledge.selectedList.splice(index,1);
                        }
                    })
                });
                // while (i == $scope.knowledge.knowledgeList.length){
                //     i++;
                //     angular.forEach($scope.knowledge.selectedList,function(know,index){
                //         if(know.id == $scope.knowledge.knowledgeList[i].id){
                //             $scope.knowledge.selectedList.splice(index,1);
                //         }
                //     })
                // }
            }
            $scope.knowledge.isAllKnowSelected = !$scope.knowledge.isAllKnowSelected ;
        }
        function selectSingle(item,id) {
            console.log(item,id);
            let has = false;
            let str = JSON.stringify(knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList));
            if(str.length!=0){
                angular.forEach($scope.knowledge.selectedList,function (val,index) {
                    if(str.indexOf(JSON.stringify(val))!=-1){
                        $scope.knowledge.selectedList.splice(index,1)
                    }
                }) ;
            }
            if(!has){
                $scope.knowledge.selectedList.push(item)
            }
            // 是否全选
            $scope.knowledge.isAllKnowSelected = knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList).length==0?true:false

        }
        function removeSelected(index) {
            $scope.knowledge.selectedList.splice(index,1);
            // 是否全选
            $scope.knowledge.isAllKnowSelected = knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList).length==0?true:false
        }
        function knowUnselected(selected,pageList){
            // 全选返回数组，未false
            // let pageList = $scope.knowledge.knowledgeList ;
            let len = $scope.knowledge.knowledgeList.length ;
            let has ;
            let i = 0;
            let result = [] ;
            // while (i == len){
            //     i++;
            //     has = selected.some(item=>(item.id == pageList[i].id));
            //     if(!has){
            //         $scope.knowledge.selectedList.push(pageList[i])
            //     }
            // }
            let  str = JSON.stringify(selected) ;
            angular.forEach(pageList,function(item,index){
                if(str.indexOf(JSON.stringify(item))==-1){
                    result.push(item)
                }
            });
            return result ;
        }
        //添加知识
        function addHotHotKnow(){
            queryKnowledgeList($scope.knowledge.paginationConf.currentPage,$scope.knowledge.paginationConf.pageSize).$promise.then(function () {
                $scope.$parent.$parent.MASTER.openNgDialog($scope,addHotHtml,"700px",function(){
                    ApplicationServer.addHotKnowledge.save({
                        "ids" : $scope.knowledge.selectedList.map(item=>item.id)
                    },function(response){
                        if(response.status == 200){
                            layer.msg("该知识已经存在,请重新添加!")
                        }else{
                            queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
                        }
                    },function(error){console.log(error)}) ;
                },function(){
                    //取消的同时清空数据
                    $scope.knowledge.selectAllCheckDialog = false;
                    $scope.knowledge.selectedList = [];
                    $scope.knowledge.knowledgeList = [];
                    $scope.knowledge.keyWord = "";
                }) ;
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
                        $scope.hotKnowledge.oldHotQuestionTimeout = response.data.hotQuestionTimeout;
                        $scope.hotKnowledge.oldHotQuestionLimit   = response.data.hotQuestionLimit;
                        $scope.hotKnowledge.hotQuestionTimeout = response.data.hotQuestionTimeout;
                        $scope.hotKnowledge.hotQuestionLimit   = response.data.hotQuestionLimit;
                    }
                })
        }
        //修改知识配置（更新频率）
        function updateHotKnowledgeConfig(){
            if($scope.hotKnowledge.oldHotQuestionTimeout != $scope.hotKnowledge.hotQuestionTimeout || $scope.hotKnowledge.oldHotQuestionLimit != $scope.hotKnowledge.hotQuestionLimit) {
                ApplicationServer.updateHotKnowledgeConfig.save({
                "hotQuestionTimeout": parseInt($scope.hotKnowledge.hotQuestionTimeout),
                "hotQuestionLimit": parseInt($scope.hotKnowledge.hotQuestionLimit)
            },function (response) {
                layer.msg(response.info);
                if(response.status != 200){
                    getHotKnowledgeConfig()
                }
            })
            }
        }
        //重置已选择的热点知识
        function initHotKnowSelected(){
            $scope.vm.hotKnowDelIds = [];
            $scope.vm.isAllHotKnowSelected = false;
        }
    }
    ])
};