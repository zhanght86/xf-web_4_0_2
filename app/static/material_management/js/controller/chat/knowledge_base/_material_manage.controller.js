/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state","MaterialServer", "$cookieStore","$timeout","$window","$location",
    function ($scope,$state,MaterialServer,$cookieStore,$timeout,$window,$location) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            exportExcel:exportExcel,//知识导出
            seeDtails:seeDtails,//标题预览
            //searchList : "",   //查询数据结果
            paginationConf : {     //分页条件
                pageSize : 5  ,    //默认每页数量
                pagesLength: 10    //分页框数量
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
            selectTimeType : selectTimeType
        };
        /**
         * 全选
         */
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.delArr = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.delArr.push(item.chatKnowledgeId);
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
            if($scope.vm.delArr.length==$scope.vm.listData.length){
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
                    MaterialServer.delKnowledge.save({
                        "applicationId": APPLICATION_ID,
                        "ids":$scope.vm.delArr
                    },function(response){
                        initBatchTest();
                        $state.reload();
                        //getData(1) ;
                        layer.msg("删除成功") ;
                    },function(err){
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
        function search(index){
            var i = layer.msg('查询中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            $scope.vm.getType = 1;
            $scope.vm.searchHeighFlag = false ;
            console.log($scope.vm.chatQuestionContent);

            MaterialServer.searchKnow.save({
                "applicationId" : APPLICATION_ID,
                "context" : $scope.vm.chatQuestionContent,
                "startModifyTime" : $scope.vm.modifyTimeType,
              //  "endModifyTime" :                                          //开始时间
              //  "endModifyTime" :                                          //结束时间
                "modifier" : $scope.vm.chatKnowledgeModifier,             //用户名
                "modifyTimeType" : $scope.vm.modifyTimeType,             //时间类型
                "topic" : $scope.vm.chatKnowledgeTopic ,                  //标题
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(data){
                layer.close(i);
                if(data.data==10005){
                    $scope.vm.delArr = [] ;
                    $scope.vm.listData = data.data.objs;
                    $scope.vm.paginationConf.totalItems = 0 ;
                    layer.msg("查询无此相关知识");
                }else{
                    $scope.vm.delArr = [] ;
                    $scope.vm.listData = data.data.objs;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                    $scope.vm.title = null;
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
                "?applicationId="+APPLICATION_ID+"&chatKnowledgeTopic="+$scope.vm.chatKnowledgeTopic+"&chatKnowledgeModifier="+$scope.vm.chatKnowledgeModifier +
                "&chatQuestionContent="+$scope.vm.chatQuestionContent;
            //var url = "/api/ms/chatKnowledge/exportExcel"+urlParams  ;//请求的url
            //$window.open(url,"_blank") ;

            var url = MaterialServer.exportChat + urlParams;
            downLoadFiles(angular.element('.chatKnowBase')[0] ,url);
            //downLoadFiles($('.chatKnowBase')[0] ,url);

        }
        function selectTimeType(type){
            $scope.vm.modifyTimeType = type;
        }
         getData(1) ;

        /**
         * 请求列表
         */
        function getData(index){
            var i = layer.msg('资源加载中...',{icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            $scope.vm.getType = 0 ;
            MaterialServer.getData.save({
                "applicationId": APPLICATION_ID,
                "index" :(index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(data){
                layer.close(i);
                $scope.vm.delArr = [] ;
                $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf.currentPage =index ;
                $scope.vm.paginationConf.totalItems =data.data.total ;
                $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                console.log($scope.vm.paginationConf);
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }
        /**
        *分页 查询
        */
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    if($scope.vm.getType==1 ){
                        initBatchTest();
                        search(current)
                    }else if($scope.vm.getType==0){
                        initBatchTest();
                        getData(current);
                    }
                }, 0)
            }
        });

        /**
         *点击标题预览内容
         */
        function seeDtails(data){
            console.log(data);
            var params = {
                standardQuestion : data.chatKnowledgeTopic,
                extendedQuestionArr :data.chatQuestionList,
                contentArr : data.chatKnowledgeContentList,
                applicationId: APPLICATION_ID,
                //chatKnowledgeModifier : data.chatKnowledgeModifier,
                chatKnowledgeId : data.chatKnowledgeId,
                chatKnowledgeSource:data.chatKnowledgeSource,   //类型 101  概念      100 faq
                editUrl : data.chatKnowledgeSource==100?"materialManagement.faqChat":"materialManagement.conceptChat",
                //type : data.chatKnowledgeSource
            };
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:angular.toJson(params)});
        }
    }
]);