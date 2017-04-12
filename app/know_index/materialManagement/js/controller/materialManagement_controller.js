/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", function ($scope,$state) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            title : "" ,           //知识标题
            search : search,  //查询
            seeDtails:seeDtails,//标题预览
            searchList : "",   //查询数据结果
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
//刪除知识
            getDel : getDel,
            delKnowledge : delKnowledge,
            delArr : [],
//高级查询
            searchHeighFlag : false ,
            "chatKnowledgeModifier": "",
            "modifyTimeType": "",
            "chatKnowledgeTopic": "",
            "chatQuestionContent": "",
             selectTimeType : selectTimeType
        };

        function getDel(ev,id){
            var  self =$(ev.target);
            if(self.prop("checked")){
                $scope.vm.delArr.push(id)
            }else{
                $scope.vm.delArr.remove(id)
            }
        }
        function delKnowledge(){
            httpRequestPost("/api/chatKnowledge/deleteConceCptChatKnowledge",{
                "applicationId": $scope.vm.applicationId,
                "ids":$scope.vm.delArr
            },function(data){
                $state.reload();
            },function(err){
                layer.msg("删除失败")
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
        function search(){
            httpRequestPost("/api/chatKnowledge/queryChatKnowledge",{
                "chatKnowledgeTopic": $scope.vm.chatKnowledgeTopic,
                "chatKnowledgeModifier": $scope.vm.searchHeighFlag?$scope.vm.chatKnowledgeModifier:null,
                "modifyTimeType":  $scope.vm.searchHeighFlag?$scope.vm.modifyTimeType:null,
                "chatQuestionContent": $scope.vm.searchHeighFlag?$scope.vm.chatQuestionContent:null,
                "index": 0,
                "pageSize":$scope.vm.pageSize,
            },function(data){
                $scope.vm.searchList = data.data.objs,
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.vm.title = null;
            },function(err){})
        }
        function selectTimeType(type){
            $scope.vm.modifyTimeType = type;
            console.log($scope.vm.modifyTimeType)
        }

        init();
        function init(){
            getData(1)
        }
        //请求列表
        function getData(index){
            httpRequestPost("/api/chatKnowledge/queryChatKnowledge",{
                "applicationId": $scope.vm.applicationId,
                "index" :index==1?0:$scope.vm.pageSize*index,
                "pageSize": $scope.vm.pageSize
            },function(data){
              $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败");
            })
        }
        //分页 查询
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                console.log(current);
                getData(current);
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
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:params});
        }
    }
]);