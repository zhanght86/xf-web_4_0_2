
/**
 * Created by Administrator on 2016/6/3.
 * ������
 */

angular.module('knowledgeManagementModule').controller('knowledgeScanController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","$location","$rootScope",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,$location,$rootScope) {
        //$state.go("custKnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        //"364180924750893056"
        //knowledgeScan
        console.log($cookieStore.get("knowledgeScan").params);
        console.log($stateParams);
        var knowledgeScan =  $cookieStore.get("knowledgeScan");

        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            //knowledgeId : $stateParams.knowledgeId,
            knowledgeId : "364180924750893056",        //del
            knowledgeType : $stateParams.knowledgeType,
            listData : null,
            knowledgeData : knowledgeScan.params ,
            save : knowledgeScan.save



            //editName : editName
            //"pageSize": 5,
            //"sceneIds" : [] ,
            //"knowledgeTitle": $stateParams.scanKnowledge.knowledgeTitle,         //֪ʶ����Ĭ��ֵnull
            //"knowledgeContent": $stateParams.scanKnowledge.knowledgeContent,        //֪ʶ����Ĭ��ֵnull
            //"knowledgeCreator": $stateParams.scanKnowledge.knowledgeCreator,        //����Ĭ��ֵnull
            //"knowledgeExpDateEnd": $stateParams.scanKnowledge.knowledgeExpDateEnd,        //֪ʶ��Ч�ڿ�ʼֵĬ��ֵnull
            //"knowledgeExpDateStart": $stateParams.scanKnowledge.knowledgeExpDateStart,        //֪ʶ��Ч�ڽ���ֵĬ��ֵnull
            //"sourceType": $stateParams.scanKnowledge.sourceType,        //֪ʶ��ԴĬ��ֵ0   (0:ȫ��   1:��������  2���ĵ��ӹ�)
            //"updateTimeType": $stateParams.scanKnowledge.updateTimeType ,  //֪ʶ����ʱ��Ĭ��ֵ0   (0:���� 1:������ 2:������ 3:��һ��)
        };
        //getData();
        //function getData(){
        //    httpRequestPost("/api/conceptKnowledge/getKnowledge",{
        //        "knowledgeId" : $scope.vm.knowledgeId,
        //        "applicationId" : $scope.vm.applicationId
        //    },function(data){
        //        console.log(data)
        //        $scope.vm.listData = data.data;
        //        $scope.$apply();
        //        console.log(data);
        //    },function(){
        //        layer.msg("��ȡʧ��")
        //    });
        //}
    }
]);