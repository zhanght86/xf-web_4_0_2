/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('custPreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","knowledgeAddServer","$window","$http","myService",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,knowledgeAddServer,$window,$http,myService) {
        //$state.go("custKnowledgePreview.manage",{userPermission:$stateParams.userPermission});
        //var viewData =  $window.opener.knowledgeScan ;
        if(!$stateParams.knowledgeId || !$stateParams.knowledgeType){
            //$state.go("knowledgeManagement.custOverview")
        }else{
            $scope.vm = {
                knowledgeId : $stateParams.knowledgeId,        //del
                knowledgeType : parseInt($stateParams.knowledgeType),
                listData : null,
                edit :  edit
            };
            // 展示渠道维度使用
            //獲取渠道
            knowledgeAddServer.getDimensions({ "applicationId" : APPLICATION_ID},
                function(data) {
                    if(data.data){
                        $scope.vm.dimensions = data.data;
                    }
                }, function(error) {
                });
            //获取维度
            knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
                function(data) {
                    if(data.data){
                        $scope.vm.channels = data.data
                    }
                }, function(error) {
                });
            //修改
            var editUrl,api;
            switch($scope.vm.knowledgeType){
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
                case 106 :
                    editUrl = "knowledgeManagement.markKnow";
                    api = "api/ms/marketingKnowledge/getKnowledge";
                    break;
            }
            function edit(){
                $state.go(editUrl,{data:angular.toJson($scope.vm.listData)})
            }
           void function(){
                knowledgeAddServer.getDataServer(api,{
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : APPLICATION_ID
                },function(data){
                    if($scope.vm.knowledgeType == 103){
                        var data = data.data ;
                        var table = data.knowledgeContents[0].knowledgeTable ;
                        data.knowledgeContents[0].knowledgeContent = table;
                        delete data.knowledgeContents[0].knowledgeTable;
                        $scope.vm.listData = data;
                        //console.log(data)
                    }else{
                        $scope.vm.listData = data.data;
                    }
                },function(){
                    console.log("获取失败")
                }) ;
            }()
        }
    }
]);