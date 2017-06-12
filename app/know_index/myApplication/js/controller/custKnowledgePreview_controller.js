
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custKnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","knowledgeAddServer","$window","$http",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,knowledgeAddServer,$window,$http) {
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
                //editName : editName
                //"pageSize": 5,
                //"sceneIds" : [] ,
                //"knowledgeTitle": $stateParams.scanKnowledge.knowledgeTitle,         //知识标题默认值null
                //"knowledgeContent": $stateParams.scanKnowledge.knowledgeContent,        //知识内容默认值null
                //"knowledgeCreator": $stateParams.scanKnowledge.knowledgeCreator,        //作者默认值null
                //"knowledgeExpDateEnd": $stateParams.scanKnowledge.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                //"knowledgeExpDateStart": $stateParams.scanKnowledge.knowledgeExpDateStart,        //知识有效期结束值默认值null
                //"sourceType": $stateParams.scanKnowledge.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                //"updateTimeType": $stateParams.scanKnowledge.updateTimeType ,  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
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
                $state.go(editUrl,{data:$scope.vm.listData})
            }
            //knowledgeAddServer.getKnowledge({
            //        "knowledgeId" : $scope.vm.knowledgeId,
            //        "applicationId" : $scope.vm.applicationId
            //    },
            //    function(data) {
            //        console.log(data) ;
            //    }, function(error) {
            //    });
            //$http.post({
            //    url: '/api/ms/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId',
            //    data : {
            //        "applicationId":"377525996116508672",
            //        "knowledgeId":"390950719538073600"
            //    }
            //}).then(function successCallback(response) {
            //    console.log(response) ;
            //    // 请求成功执行代码
            //}, function errorCallback(response) {
            //    // 请求失败执行代码
            //});
            getData();
            function getData(){
                httpRequestPost(api,{
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : $scope.vm.applicationId
                },function(data){
                    console.log(data) ;
                    if(viewData.knowledgeType == 103){
                        var data = data.data ;
                        var table = data.knowledgeContents[0].knowledgeTable ;
                        data.knowledgeContents[0].knowledgeContent = table;
                        delete data.knowledgeContents[0].knowledgeTable;
                        $scope.vm.listData = data;
                        console.log(data)
                    }else{
                        $scope.vm.listData = data.data;
                    }
                    console.log(data);
                        $scope.$apply();
                },function(){
                    layer.msg("获取失败")
                });
            }
        }
    }
]);