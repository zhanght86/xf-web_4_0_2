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
        /**
        *保存
        **/
        function save(){
            var params = $scope.vm.scanData ;
            console.log(params) ;
            //if(check(params)){

            //     var api ;
            //     switch(params.chatKnowledgeSource){
            //         case "100" :
            //             // api = "/api/material/chatKnowledge/updateChatKnowledge";
            //             //api = "addFAQChatKnowledge" ;
            //             break ;
            //         case  "101":
            //             // api = "/api/material/chatKnowledge/updateChatKnowledge" ;
            //             //api = "addConceCptChatKnowledge" ;
            //             break ;
            //     }
                MaterialServer.saveChatKnowledge.save({
                //MaterialServer[api].save({
                    "modifierId" : USER_ID,
                    "topic" : $scope.vm.standardQuestion,
                    "applicationId" : APPLICATION_ID,
                    "chatKnowledgeContentList": $scope.vm.contentArr,
                    "chatKnowledgeQuestionList": $scope.vm.extendedQuestionArr,
                    "origin": params.chatKnowledgeSource,
                    "id" : params.chatKnowledgeId?params.chatKnowledgeId:null
                },function(data){
                    if(data.data==10004){
                        layer.msg("标准问重复") ;
                        $state.go($scope.vm.editUrl,{scanDataList: $stateParams.scanData});
                    }else{
                        $state.go("materialManagement.chatKnowledgeBase");
                    }
                },function(err){
                    console.log(err);
                });
            //}
        }
        /**
        * 编辑
        **/
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