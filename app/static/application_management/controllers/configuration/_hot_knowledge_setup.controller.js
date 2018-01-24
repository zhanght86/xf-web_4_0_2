/**
 * Created by mileS on 2017/3/28.
 * Describe ： 热点知识设置
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('HotKnowledgeSetupController',
    [ '$scope', 'localStorageService',"ApplicationServer" ,"ngDialog","$state" ,"$location",
    ($scope,localStorageService,ApplicationServer,ngDialog, $state,$location) =>{
        $scope.vm = {
            "simpleOperateTitle" : "确定删除选中的热点知识"
        };
        // 热点知识
        $scope.hotKnowledge = {
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
            knowledgeIdList : "",     //知识id数据
            knowledgeTitle : "",    //知识搜索标题
            selectedList : [] ,  // 已选择知识
            selectedIdList : [] ,  // 已选择id知识
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
            saveSelectedList:saveSelectedList,
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
                    if( response.status == 200&&response.data.data!=null){
                        if(response.data.data.length){
                            $scope.hotKnowledge.hotKnowListIds =  response.data.data.map(item=>item.id) ;
                        }
                        $scope.hotKnowledge.hotKnowList = response.data.data;
                        $scope.hotKnowledge.paginationConf.totalItems = response.data.total ;
                        $scope.hotKnowledge.paginationConf.numberOfPages = response.data.total/pageSize ;
                    }else{
                         layer.msg(response.info)
                         $scope.hotKnowledge.hotKnowList="";
                         $scope.hotKnowledge.paginationConf.totalItems = 0 ;
                          $scope.hotKnowledge.paginationConf.numberOfPages=0 ;
                    }
                    initHotKnowSelected() ;
                },function(error){console.log(error);layer.close(i) ;})
        }
        //从聊天知识库查询知识
        function queryKnowledgeList(index,pageSize){
            $scope.knowledge.selectedList.length=0;
            $scope.knowledge.selectedIdList.length=0;
            return ApplicationServer.queryKnowledgeList.save({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "title": $scope.knowledge.knowledgeTitle,         //知识标题默认值null
            },function(response){
                if(response.status==200&&response.data.data!=null){
                       if(response.data.data.length){
                        $scope.knowledge.knowledgeIdList =  response.data.data.map(item=>item.id) ;
                    }
                    $scope.knowledge.knowledgeList = response.data.data;
                    $scope.knowledge.isAllKnowSelected = knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList).items.length==0?true:false
                    $scope.knowledge.paginationConf.totalItems = response.data.total ;
                    $scope.knowledge.paginationConf.numberOfPages = response.data.total/pageSize ;
                }else{
                    layer.msg(response.info) ;
                    $scope.knowledge.knowledgeList=""
                    $scope.knowledge.paginationConf.totalItems =0 ;
                    $scope.knowledge.paginationConf.numberOfPages = 0 ;
                } 

            },function(error){console.log(error)})
        }

        //判断重复
        function hotKnowledgecheck(order){
            angular.forEach($scope.knowledge.selectedList,(val,index)=>{
             ApplicationServer.hotKnowledgecheck.get({
                knowledgeId:val.id
                },(data)=>{
                    if(data.status==500){
                        if(order==2){
                            layer.msg("热点知识重复，不可添加")
                        }else{
                            layer.msg("部分热点问题重复，不可添加")
                        }
                       
                         $scope.knowledge.selectedList.splice(index,1);
                         $scope.knowledge.selectedIdList.splice(index,1);
                    }
                })
            })
           
        }

        function selectAllKnow() {
            if($scope.knowledge.isAllKnowSelected == false){   // // 选择全部
                angular.forEach($scope.knowledge.knowledgeList,function(val,cur){
                   if(!$scope.knowledge.selectedIdList.inArray(val.id)){
                       $scope.knowledge.selectedList.push(val);
                       $scope.knowledge.selectedIdList.push(val.id);
                   }
                });
            }else{//取消全部
                angular.forEach($scope.knowledge.knowledgeList,function(val,cur){
                    let index = $scope.knowledge.selectedIdList.indexOf(val.id);
                    if(index!=-1){
                        $scope.knowledge.selectedList.splice(index,1);
                        $scope.knowledge.selectedIdList.splice(index,1);
                    }
                });
            }
            $scope.knowledge.isAllKnowSelected = !$scope.knowledge.isAllKnowSelected ;
            hotKnowledgecheck(1)  //判断重复
        }
        function selectSingle(item,id) {
            let index = $scope.knowledge.selectedIdList.indexOf(id);
            if(index!=-1){
                $scope.knowledge.selectedIdList.splice(index,1);
                $scope.knowledge.selectedList.splice(item,1);
            }else{
                $scope.knowledge.selectedIdList.push(id);
                $scope.knowledge.selectedList.push(item)
            }
            // 是否全选
        $scope.knowledge.isAllKnowSelected = knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList).items.length==0?true:false

            hotKnowledgecheck(2)  //判断重复

        }
        function removeSelected(index) {
            $scope.knowledge.selectedList.splice(index,1);
            $scope.knowledge.selectedIdList.splice(index,1);
            // 是否全选
            $scope.knowledge.isAllKnowSelected = knowUnselected($scope.knowledge.selectedList,$scope.knowledge.knowledgeList).items.length==0?true:false
        }
        function knowUnselected(selected,pageList){
            // 全选返回数组，未false
            // let pageList = $scope.knowledge.knowledgeList ;
            let len = $scope.knowledge.knowledgeList.length ;
            let has ;
            let i = 0;
            let result = {
                ids : [],
                items : []
            } ;
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
                    result.items.push(item)
                    result.ids.push(item)
                }
            });
            return result ;
        }
        //添加知识弹框
        function addHotHotKnow(){
               //取消的同时清空数据
                $scope.knowledge.isAllKnowSelected = false;
                $scope.knowledge.selectedIdList = [];
                $scope.knowledge.knowledgeList = [];
                $scope.knowledge.selectedList = [];
                $scope.knowledge.knowledgeIdList = [];
                $scope.knowledge.knowledgeTitle = "";
            queryKnowledgeList($scope.knowledge.paginationConf.currentPage,$scope.knowledge.paginationConf.pageSize).$promise.then(function () {
                $scope.$parent.$parent.MASTER.openNgDialog($scope,addHotHtml,"750px",function(){
                   
            }) ;
        })
    }

        //添加知识
        function saveSelectedList(){
            if($scope.knowledge.selectedList.map(item=>item.id).length==0){
                layer.msg("请选择热点知识")
                return;
            }
             ApplicationServer.addHotKnowledge.save({
                    "ids" : $scope.knowledge.selectedList.map(item=>item.id)
                },function(response){
                    if(response.status == 200){
                        queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
                        layer.msg(response.info,{time:2000})
                        ngDialog.closeAll(1) ;

                    }else{
                        layer.msg(response.info)
                    }
                    
                },function(error){console.log(error)}) ;
                // },function(){
                //     //取消的同时清空数据
                //     $scope.knowledge.isAllKnowSelected = false;
                //     $scope.knowledge.selectedIdList = [];
                //     $scope.knowledge.knowledgeList = [];
                //     $scope.knowledge.selectedList = [];
                //     $scope.knowledge.knowledgeIdList = [];
                //     $scope.knowledge.knowledgeTitle = "";
                // }) ;

        }
        //删除知识
        function removeHotKnowledge(ids){
            if(ids.length == 0){
                layer.msg("请选择要删除的知识！");
            }else{
                $scope.$parent.$parent.MASTER.openNgDialog($scope,delHtml,"300px",function(){
                    ApplicationServer.removeHotKnowledge.save({
                        ids :  ids
                    },function(response){
                        if(response.status == 200){
                            queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
                            $scope.hotKnowledge.deleteIds = [] ;
                        }
                        layer.msg(response.info);
                    },function(error){console.log(error)})
                })
            }
        }
        //知识置顶
        function top(item){
            ApplicationServer.hotKnowledgeStick.save({
                    "id":item.id,
                    "rank":item.rank
                },function(response){
                queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
                },function(error){console.log(error)                })
        }
        //知识上移
        function up(item){
            ApplicationServer.hotKnowledgeUp.save({
                "id":item.id,
                "rank":item.rank
                },function(response){
                queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
                },function(error){console.log(error)})
        }

        //知识下移
        function down(item){
            ApplicationServer.hotKnowledgeDown.save({
                "id":item.id,
                "rank":item.rank
            },function(response){
                queryHotKnowledgeList($scope.hotKnowledge.paginationConf.currentPage,$scope.hotKnowledge.paginationConf.pageSize) ;
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
            $scope.hotKnowledge.deleteIds = [];
        }
}])};