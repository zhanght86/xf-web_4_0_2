
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowledgeScanController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","$location","$rootScope","knowledgeAddServer",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,$location,$rootScope,knowledgeAddServer) {
        //$state.go("custKnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        //"364180924750893056"
        //knowledgeScan
        //console.log($cookieStore.get("knowledgeScan"));
        //console.log($stateParams);
        var knowledgeScan =  $cookieStore.get("knowledgeScan");
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            knowledgeId : $stateParams.knowledgeId,
            knowledgeType : $stateParams.knowledgeType,
            listData : null,
            knowledgeData : knowledgeScan.params ,
            dimensions : "",
            channels : "",
            editUrl : knowledgeScan.editUrl,
            save :save
        };
        //保存方法  根据url  获取 保存路径
        function save(){
            var api = "" ;
            switch($scope.vm.editUrl){
                case "knowledgeManagement.faqAdd":
                    api = "/api/faqKnowledge/addFAQKnowledge";
                    break;
                case "knowledgeManagement.singleAddConcept":
                    api = "/api/conceptKnowledge/addConceptKnowledge";
                    break;
                case "knowledgeManagement.listAdd":
                    api = "/api/listKnowledge/addListKnowledge";
                    break;
                case "knowledgeManagement.factorAdd":
                    api = "/api/elementKnowledgeAdd/addElementKnowledge";
                    break;
            }
            httpRequestPost(api,$scope.vm.knowledgeData,function(data){
                console.log(data) ;
                if(data.status == 200){
                    $state.go("custServScenaOverview.manage")
                }
            },function(err){
                console.log(err)
            });
        }
        // 展示渠道维度使用
        //獲取渠道
        knowledgeAddServer.getDimensions({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.dimensions = data.data;
                }
            }, function(error) {
            });
        //获取维度
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channels = data.data
                }
            }, function(error) {
            });
    }
]);