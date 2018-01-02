/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

module.exports=materialModule => {
    materialModule
    .controller('KnowledgeBaseController', [
    '$scope',"$state","MaterialServer","$log", "$cookieStore","$timeout","$window","$location",
    ($scope,$state,MaterialServer,$log,$cookieStore,$timeout,$window,$location)=> {
        $state.go("MM.chat");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            exportExcel:exportExcel,//知识导出
            //seeDtails:seeDtails,//标题预览
            //searchList : "",   //查询数据结果
            paginationConf : {     //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: search ,
                location:true
            }  ,

            getType : 0 ,    // 默认请求 0    查找 1
//刪除知识
            //getDel : getDel,
            delKnowledge : delKnowledge,
            delArr : [],
            selectAll : selectAll,
            selectAllCheck : false,
            selectSingle : selectSingle,

//高级查询
            searchHeighFlag : false ,
            "chatKnowledgeModifier": "",
            "modifyTimeType": 0,
            "chatKnowledgeTopic": "",
            "chatQuestionContent": "",
            selectTimeType : selectTimeType,
            batchAddition : batchAddition,                    //批量新增
            isUploadStart : false,

        };
        //setCookie('applicationId',"450014113901314048");
        /**
         **批量新增
         **/
        function batchAddition(callback){
            let batchAdd = require("../../../views/chat/knowledge_base/chat_knowledge_dialog.html");
            $scope.$parent.$parent.MASTER.openNgDialog($scope,batchAdd,"600px",function(){
                $scope.vm.isUploadStart = true ;
            },function(){
                $scope.vm.isUploadStart = false ;
            })
        }

        /**
         * 全选
         */
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.delArr = [];
                angular.forEach($scope.vm.listData.objs,function(item){
                    $scope.vm.delArr.push(item.id);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.delArr = [];
            }
        }
        /**
         * 单选
         */
        function selectSingle(id){
            if($scope.vm.delArr.inArray(id)){
                $scope.vm.delArr.remove(id);
                $scope.vm.selectAllCheck = false;
            }else{
                $scope.vm.delArr.push(id);

            }
            if($scope.vm.delArr.length==$scope.vm.listData.objs.length){
                $scope.vm.selectAllCheck = true;
            }
            console.log( $scope.vm.delArr);
        }
        /**
         * //全选按钮清空
         */
        function initBatchTest(){
            $scope.vm.delArr = [] ;
            $scope.vm.selectAllCheck = false;
        }
        /**
         * 删除
         */
        function delKnowledge(){
            console.log($scope.vm.delArr) ;
            if(!$scope.vm.delArr.length){
                layer.msg("请选择要删除的知识")
            }else{
                layer.confirm('是否确定删除该条知识？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    var i = layer.msg('知识删除中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
                    MaterialServer.delKnowledge.save({
                       // "applicationId":APPLICATION_ID,
                        "ids":$scope.vm.delArr
                    },{                                      //可为空

                    },function(response){
                        layer.close(i);
                        if(response.status==200){
                            initBatchTest();
                            layer.msg("删除成功") ;
                            $state.reload();
                        }
                        if(response.status==500){
                            console.log("删除失败");
                        }
                    },function(err){
                        layer.close(i);
                        $log.log(err);
                    });
                });
            }
        }
        //高级查找 显示隐藏
        $scope.$watch("vm.searchHeighFlag",function(val){
            if(val){
                $('.advanced_search').slideDown();

            }else{
                $('.advanced_search').slideUp();
            }
        });
// 时间   1   仅三天   2  近七天   3  近一个月
        /**
         * 查询
         */
        search($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function search(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('查询中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            //$scope.vm.getType = 1;
            $scope.vm.searchHeighFlag = false ;
            console.log($scope.vm.chatQuestionContent);
            MaterialServer.searchKnow.save({
                //"applicationId":APPLICATION_ID,
                "context" : $scope.vm.chatQuestionContent,                //知识内容
                "modifier" : $scope.vm.chatKnowledgeModifier,             //用户名
                "modifyTimeType" : $scope.vm.modifyTimeType,             //时间类型
                "topic" : $scope.vm.chatKnowledgeTopic ,                  //标题
                "index": (index-1)*pageSize,
                "pageSize": pageSize

            },function(data){
                layer.close(i);
                if(data.status==200){
                    console.log(data);
                    //$scope.vm.delArr = [] ;
                    $scope.vm.listData = data.data;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                    $scope.vm.title = null;
                }
                if(data.status==500){
                    layer.msg('查询失败');
                    console.log("查询失败");
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });

        }

        /**
         * 知识导出
         */
        function exportExcel(){
            var urlParams =
                // "?applicationId="+APPLICATION_ID+"&topic="+$scope.vm.chatKnowledgeTopic+"&modifier="+$scope.vm.chatKnowledgeModifier +
                // "&context="+$scope.vm.chatQuestionContent +"&modifyTimeType="+$scope.vm.modifyTimeType;
                "?topic="+$scope.vm.chatKnowledgeTopic+"&modifier="+$scope.vm.chatKnowledgeModifier +
                "&context="+$scope.vm.chatQuestionContent +"&modifyTimeType="+$scope.vm.modifyTimeType;

            var url = MaterialServer.exportChat + urlParams;
            downLoadFiles(angular.element('.chatKnowBase')[0] ,url);

        }
        function selectTimeType(type){
            $scope.vm.modifyTimeType = type;
        }

    }
])};