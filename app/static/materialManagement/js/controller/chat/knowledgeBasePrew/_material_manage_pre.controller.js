/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBasePreController', [
    '$scope',"$state","$stateParams","MaterialServer", "$window",
    function ($scope,$state,$stateParams,MaterialServer,$window) {
        $state.go("materialManagement.chatKnowledgeBasePreview");
        $scope.vm = {
            scanData : angular.fromJson($stateParams.scanData),
            save : save ,
            edit : edit , 
            editUrl : angular.fromJson($stateParams.scanData).chatKnowledgeSource=="101"?"materialManagement.conceptChat":"materialManagement.faqChat"
        };
        function save(){
            var params = $scope.vm.scanData ;
            console.log(params) ;
            //if(check(params)){
                var api ;
                switch(params.chatKnowledgeSource){
                    case "100" :
                        // api = "/api/ms/chatKnowledge/addFAQChatKnowledge";
                        api = "addFAQChatKnowledge" ;
                        break ;
                    case  "101":
                        // api = "/api/ms/chatKnowledge/addConceCptChatKnowledge" ;
                        api = "addConceCptChatKnowledge" ;
                        break ;
                }
                //if(params.chatKnowledgeSource == 101){
                //    api = "/api/ms/chatKnowledge/addConceCptChatKnowledge" ;
                //}else if(params.chatKnowledgeSource == 100){
                //    api = "/api/ms/chatKnowledge/addFAQChatKnowledge";
                //}
            
                // httpRequestPost(api,{
                //     "chatKnowledgeId" : params.chatKnowledgeId?params.chatKnowledgeId:null,
                //     "applicationId": APPLICATION_ID ,
                //      "userId"  : USER_ID ,
                //     //"chatKnowledgeModifier": params.chatKnowledgeModifier,
                //     "chatKnowledgeTopic": params.standardQuestion,
                //     "chatQuestionList" : params.extendedQuestionArr,
                //     "chatKnowledgeContentList" : params.contentArr
                // },function(data){
                //     if(data.data==10004){
                //         layer.msg("标准问重复") ;
                //         $state.go($scope.vm.editUrl,{scanDataList: $stateParams.scanData});
                //     }else{
                //         $state.go("materialManagement.chatKnowledgeBase");
                //     }
                // }) ;
                MaterialServer[api].save({
                    "chatKnowledgeId" : params.chatKnowledgeId?params.chatKnowledgeId:null,
                    "applicationId": APPLICATION_ID ,
                    "userId"  : USER_ID ,
                    //"chatKnowledgeModifier": params.chatKnowledgeModifier,
                    "chatKnowledgeTopic": params.standardQuestion,
                    "chatQuestionList" : params.extendedQuestionArr,
                    "chatKnowledgeContentList" : params.contentArr
                },function(data){
                    if(data.data==10004){
                        layer.msg("标准问重复") ;
                        $state.go($scope.vm.editUrl,{scanDataList: $stateParams.scanData});
                    }else{
                        $state.go("materialManagement.chatKnowledgeBase");
                    }
                },function(){

                });
            //}
        }
        function edit(){
            console.log(angular.fromJson($stateParams.scanData).type);
            $state.go($scope.vm.editUrl,{scanDataList: $stateParams.scanData});
        }
        //验证 所有数据是否合格
        //function check(params){
        //    if(params.standardQuestion==null || params.standardQuestion.length==0){
        //        layer.msg("标准问不能为空,请返回填写");
        //        return false
        //    }else if(params.extendedQuestionArr.length==0){
        //        layer.msg("扩展问不能为空,请返回填写");
        //        return false;
        //    }else if(params.contentArr.length==0){
        //        layer.msg("知识内容不能为空,请返回填写");
        //        return false
        //    }else{
        //        return true
        //    }
        //}
    }
]);