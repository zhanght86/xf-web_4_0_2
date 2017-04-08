/**
 * Description:场景管理控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/5 15:39
 */
angular.module('myApplicationSettingModule').controller('sceneManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            keyword: "",  //检索条件
            exchangeModeId: "", //交互方式的Id
            knowledgeTypeId: "", //知识类型的Id
            statusId: "", //状态
            knowledgeTypeData: "", //知识类型列表
            exchangeModeData: "",  //交互方式列表
            listKnowledgeType: listKnowledgeType, //查询知识类型
            listExchangeMode: listExchangeMode,  //查询交互方式
            updateKnowledgeType:  updateKnowledgeType, //禁用或者启用知识类型
            updateExchangeMode: updateExchangeMode, //禁用或者启用交互方式

        };

        //加载知识类型
        listKnowledgeType();
        //加载交互方式
        listExchangeMode();
        //请求知识类型列表
        function listKnowledgeType(){
            httpRequestPost("/api/application/scene/listKnowledgeTypeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "keyword": $scope.vm.keyword
            },function(data){
                $scope.vm.knowledgeTypeData = data.data;
                //console.log(data)
                $scope.$apply();
            },function(err){
                console.log(err);
                layer.msg("请求失败")
            })
        }
        //请求交互方式列表
        function listExchangeMode(){
            httpRequestPost("/api/application/scene/listExchangeModeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "keyword": $scope.vm.keyword
            },function(data){
                $scope.vm.exchangeModeData = data.data;
                //console.log(data)
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }


        function updateKnowledgeType(item){
            httpRequestPost("/api/application/scene/updateKnowledgeTypeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "statusId": item.statusId,
                "knowledgeTypeId": item.knowledgeTypeId
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }

        function updateExchangeMode(item){
            httpRequestPost("/api/application/scene/updateExchangeModeByApplicationId",{
                "applicationId": $scope.vm.applicationId,
                "statusId": item.statusId,
                "exchangeModeId": item.exchangeModeId
            },function(data){
                //$state.reload();
                listExchangeMode();
                listKnowledgeType();
                $("#exchangeMode").click();
            },function(){
                layer.msg("请求失败")
            })
        }
    }
]);