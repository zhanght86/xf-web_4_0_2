/**
 * Created by Administrator on 2016/6/3.
 * ������
 */
angular.module('materialManagement').controller('chatKnowledgeScanController', [
    '$scope',"$state","$stateParams", function ($scope,$state,$stateParams) {
        console.log($stateParams.chatKnowledgeId);
       $scope.vm = {
           chatKnowledgeId : $stateParams.chatKnowledgeId,
           data:"",//�������ϸ��Ϣ
           edit:edit,
        };

        //����ID��ѯ��������
        init($scope.vm.chatKnowledgeId);
        function  init(data){
            httpRequestPost("/api/chatKnowledge/updateConceCptChatKnowledge",{
                "chatKnowledgeId": data
            },function(data){
                $scope.vm.data=data.data;
                $scope.vm.chatKnowledgeTopic=data.data.chatKnowledgeTopic;
                $scope.vm.chatQuestionList=data.data.chatQuestionList;
                $scope.vm.chatKnowledgeContentList=data.data.chatKnowledgeContentList;
                $scope.$apply()
            },function(err){


            })

        }
        //�޸�
        function edit(){
            console.log( $scope.vm.data)
            if($scope.vm.data.chatKnowledgeSource=="100"){
                $state.go("materialManagement.faqChat",{scanDataList: $scope.vm.data});
            }

        }
    }



]);

