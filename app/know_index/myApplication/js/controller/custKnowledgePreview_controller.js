
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custKnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","knowledgeAddServer","$window","$http","myService",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,knowledgeAddServer,$window,$http,myService) {
        //$state.go("custKnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        var viewData =  $window.opener.knowledgeScan ;
        if(!viewData){
            $state.go("custServScenaOverview.manage")
        }else{
            //console.log($stateParams.scanKnowledge);
            $scope.vm = {
                applicationId :$cookieStore.get("applicationId"),
                knowledgeId : viewData.knowledgeId,        //del
                knowledgeType : viewData.knowledgeType,
                listData : null,
                edit :  edit
            };
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
            //修改
            //console.log(viewData.knowledgeType);
            var editUrl,api;
            switch(viewData.knowledgeType){
                case 100 :
                    editUrl = "knowledgeManagement.faqAdd";
                    api = "/api/ms/faqKnowledge/getKnowledge";
                    break;
                case 101 :
                    editUrl = "knowledgeManagement.singleAddConcept" ;
                    api = "/api/ms/conceptKnowledge/getKnowledge";
                    break;
                case 102 :
                    editUrl = "knowledgeManagement.listAdd";
                    api = "/api/ms/conceptKnowledge/getKnowledge";
                    break;
                case 103 :
                    editUrl = "knowledgeManagement.factorAdd";
                    api = "/api/ms/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId";
                    break;
            }
            function edit(){
               console.log($scope.vm.listData)
                $state.go(editUrl,{data:angular.toJson($scope.vm.listData)})
            }
            void function(){
                knowledgeAddServer.getDataServer(api,{
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : $scope.vm.applicationId
                },function(data){
                    //console.log(data) ;
                    if(viewData.knowledgeType == 103){
                        var data = data.data ;
                        var table = data.knowledgeContents[0].knowledgeTable ;
                        data.knowledgeContents[0].knowledgeContent = table;
                        delete data.knowledgeContents[0].knowledgeTable;
                        $scope.vm.listData = data;
                        //console.log(data)
                    }else{
                        $scope.vm.listData = data.data;
                    }
                    //console.log(data);
                    //$scope.$apply();
                },function(){
                    layer.msg("获取失败")
                }) ;
            }()
        }
    }
]);