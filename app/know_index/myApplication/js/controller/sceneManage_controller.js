/**
 * Description:场景管理控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/5 15:39
 */
angular.module('knowledgeManagementModule').controller('sceneManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            keyword: "",  //检索条件
            knowledgeTypeData: "", //知识类型列表
            exchangeModeData: "",  //交互方式列表
            listKnowledgeType: listKnowledgeType, //查询知识类型
            listExchangeMode: listExchangeMode,  //查询交互方式

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

    }
]);