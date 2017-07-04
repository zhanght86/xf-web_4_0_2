/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", "$cookieStore","$timeout","$location","$window",
    function ($scope,$state,$cookieStore,$timeout,$location,$window) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            exportExcel:exportExcel,//知识导出
            seeDtails:seeDtails,//标题预览
            //searchList : "",   //查询数据结果
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            getType : 0 ,    // 默认请求 0    查找 1
//刪除知识
            getDel : getDel,
            delKnowledge : delKnowledge,
            delArr : [],
//高级查询
            searchHeighFlag : false ,
            "chatKnowledgeModifier": "",
            "modifyTimeType": 0,
            "chatKnowledgeTopic": "",
            "chatQuestionContent": "",
            selectTimeType : selectTimeType
        };
        //$.Huimodalalert('我是消息框，2秒后我自动滚蛋！',2000)
        function getDel(ev,id){
            var  self =$(ev.target);
            if(self.prop("checked")){
                $scope.vm.delArr.push(id)
            }else{
                $scope.vm.delArr.remove(id)
            }
        }
        function delKnowledge(){
            httpRequestPost("/api/ms/chatKnowledge/deleteConceCptChatKnowledge",{
                "applicationId": APPLICATION_ID,
                "ids":$scope.vm.delArr
            },function(data){
                $state.reload();
            },function(err){
                console.log(err)
            })
        }
        $scope.$watch("vm.searchHeighFlag",function(val){
            if(val){
                $('.advanced_search').slideDown();

            }else{
                $('.advanced_search').slideUp();
            }
        });
// 时间   1   仅三天   2  近七天   3  近一个月
        function search(index){
            $scope.vm.getType = 1;
            $scope.vm.searchHeighFlag = false ;
            console.log($scope.vm.chatQuestionContent);
            httpRequestPost("/api/ms/chatKnowledge/queryChatKnowledge",{
                "chatKnowledgeTopic": $scope.vm.chatKnowledgeTopic,
                "chatKnowledgeModifier": $scope.vm.chatKnowledgeModifier,
                "modifyTimeType":  $scope.vm.modifyTimeType,
                "chatQuestionContent": $scope.vm.chatQuestionContent,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize":$scope.vm.pageSize,
            },function(data){
                if(data.data==10005){
                    layer.msg("查询无此相关知识")
                }else{
                    $scope.vm.listData = data.data.objs,
                        $scope.vm.paginationConf = {
                            currentPage: index,//当前页
                            totalItems: data.data.total, //总条数
                            pageSize: $scope.vm.pageSize,//第页条目数
                            pagesLength: 8,//分页框数量
                        };
                    $scope.$apply();
                    $scope.vm.title = null;
                }

            },function(err){})
        }

        /**
         * 知识导出
         */
        function exportExcel(){
            var urlParams =
                "?chatKnowledgeTopic="+$scope.vm.chatKnowledgeTopic+"&chatKnowledgeModifier="+$scope.vm.chatKnowledgeModifier+"&modifyTimeType="+$scope.vm.modifyTimeType +
                "&knowledgeContent="+$scope.vm.chatQuestionContent;
            var url = "/api/ms/chatKnowledge/exportExcel"+urlParams;//请求的url
            $window.open(url,"_blank") ;
        }
        function selectTimeType(type){
            $scope.vm.modifyTimeType = type;
        }
         getData(1) ;
        //请求列表
        function getData(index){
            $scope.vm.getType = 0 ;
            httpRequestPost("/api/ms/chatKnowledge/queryChatKnowledge",{
                "applicationId": APPLICATION_ID,
                "index" :(index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(err){
                console.log(err)
            })
        }

        //分页 查询
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    if($scope.vm.getType==1 ){
                        search(current)
                    }else if($scope.vm.getType==0){
                        getData(current);
                    }
                }, 100)
            }
        });
        //点击标题预览内容
        function seeDtails(data){
            console.log(data);
            var params = {
                standardQuestion : data.chatKnowledgeTopic,
                extendedQuestionArr :data.chatQuestionList,
                contentArr : data.chatKnowledgeContentList,
                applicationId: data.chatKnowledgeApplicationId,
                chatKnowledgeModifier : data.chatKnowledgeModifier,
                chatKnowledgeId : data.chatKnowledgeId,
                chatKnowledgeSource:data.chatKnowledgeSource,   //类型 101  概念      100 faq
                editUrl : data.chatKnowledgeSource==100?"materialManagement.faqChat":"materialManagement.conceptChat",
                type : 0
            };
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:angular.toJson(params)});
        }
    }
]);