/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('custPreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","$cookieStore","KnowledgeService","$window","$http","myService",
    function ($scope,localStorageService, $state,$stateParams,$cookieStore,KnowledgeService,$window,$http,myService) {
        if(!$stateParams.knowledgeId || !$stateParams.knowledgeType){
            $state.go("knowledgeManagement.custOverview")
        }else{
            $scope.vm = {
                knowledgeId : $stateParams.knowledgeId,        //del
                knowledgeType : parseInt($stateParams.knowledgeType),
                listData : null,
                edit :  edit
            };
            // 展示渠道维度使用
            //獲取渠道
            //knowledgeAddServer.getDimensions({ "applicationId" : APPLICATION_ID},
            //    function(data) {
            //        if(data.data){
            //            $scope.vm.dimensions = data.data;
            //        }
            //    }, function(error) {
            //    });
            ////获取维度
            //knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
            //    function(data) {
            //        if(data.data){
            //            $scope.vm.channels = data.data
            //        }
            //    }, function(error) {
            //    });
            //修改
            var editUrl,api;
            switch($scope.vm.knowledgeType){
                case 100 :
                    editUrl = "knowledgeManagement.faqAdd";
                    api = "queryFaqKnow";
                    break;
                case 101 :
                    editUrl = "knowledgeManagement.singleAddConcept" ;
                    api = "queryConceptKnow";
                    break;
                case 102 :
                    editUrl = "knowledgeManagement.listAdd";
                    api = "queryListKnow";
                    break;
                case 103 :
                    editUrl = "knowledgeManagement.factorAdd";
                    api = "queryFactorKnow";
                    break;
                case 106 :
                    editUrl = "knowledgeManagement.markKnow";
                    api = "queryRichTextKnow";
                    break;
            }
            function edit(){
                $state.go(editUrl,{data:angular.toJson($scope.vm.listData)})
            }
           void function(){
               var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
               KnowledgeService[api].save({
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : APPLICATION_ID
                },function(response){
                   layer.close(i) ;
                    if($scope.vm.knowledgeType == 103){
                         var data = response.data ;
                        var table = data.knowledgeContents[0].knowledgeTable ;
                        data.knowledgeContents[0].knowledgeContent = table;
                        delete data.knowledgeContents[0].knowledgeTable;
                        $scope.vm.listData = data;
                    }else{
                        $scope.vm.listData = response.data;
                    }
                },function(error){
                   $log.log(error);
                   layer.close(i)
               }) ;
            }()
        }
    }
]);