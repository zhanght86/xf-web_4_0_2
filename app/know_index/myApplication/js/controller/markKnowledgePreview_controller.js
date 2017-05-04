
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('markKnowledgePreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,knowledgeAddServer) {
        if(!$stateParams.scanKnowledge){
            $state.go("markServScenaOverview.manage")
        }else{
            console.log($stateParams.scanKnowledge);
            $scope.vm = {
                applicationId :$cookieStore.get("applicationId"),
                knowledgeId : $stateParams.scanKnowledge.knowledgeId,        //del
                knowledgeType : $stateParams.scanKnowledge.knowledgeType,
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
            console.log($stateParams.scanKnowledge.knowledgeType);

            function edit(){
                $state.go("knowledgeManagement.conceptAdd",{data:$scope.vm.listData})
            }
            getData();
            function getData(){
                httpRequestPost("/api/marketingKnowledge/getKnowledge",{
                    "knowledgeId" : $scope.vm.knowledgeId,
                    "applicationId" : $scope.vm.applicationId
                },function(data){
                    //if($stateParams.scanKnowledge.knowledgeType == 103){
                    //    var data = data.data
                    //    var table = data.data.knowledgeTable ;
                    //    table.knowledgeContents;
                    //    //knowledgeContent
                    //
                    //
                    //
                    //
                    //}
                    console.log(data);
                    $scope.vm.listData = data.data;

                    $scope.$apply();
                },function(){
                    layer.msg("获取失败")
                });
            }
        }

    }
]);