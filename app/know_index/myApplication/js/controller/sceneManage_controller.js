/**
 * Description:场景管理控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/5 15:39
 */
angular.module('myApplicationSettingModule').controller('sceneManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
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
            saveMultiInteractive: saveMultiInteractive,  //多轮交互设置
            findMultiInteractive: findMultiInteractive, //查询多轮交互设置

            turnOn : turnOn,//开关函数

            settingId: "", //配置id
            categoryFuzzyOn: 1,  //类目模糊开关
            recommendedSimilarity: 3.1, //推荐问相似度
            subjectMissingOn: 1, //主题缺失开关
            subjectMemoryRounds: 3, //主题记忆轮数
            memoryMethod: 1, //记忆方法
            elementMissingOn: 1, //要素缺失开关
            elementRecommendationOrder: 3,  //要素推荐顺序
            nonZeroStartOn: 1, //非零点启动开关
            matchCompleteOn: 1, //完全匹配开关
            matchTagOn: 1,  //标签匹配开关
            userId: $cookieStore.get("userId"),
        };


        //加载知识类型
        listKnowledgeType();
        //加载交互方式
        listExchangeMode();

        //查询多轮交互设置
        function findMultiInteractive(){
            httpRequestPost("/api/application/scene/findMultiInteractiveSetting",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                if(data.status==200){
                    $scope.vm.settingId= data.data.settingId; //配置id
                    $scope.vm.categoryFuzzyOn= data.data.categoryFuzzyOn;  //类目模糊开关
                    $scope.vm.recommendedSimilarity= data.data.recommendedSimilarity; //推荐问相似度
                    $scope.vm.subjectMissingOn= data.data.subjectMissingOn; //主题缺失开关
                    $scope.vm.subjectMemoryRounds= data.data.subjectMemoryRounds; //主题记忆轮数
                    $scope.vm.memoryMethod= data.data.memoryMethod; //记忆方法
                    $scope.vm.elementMissingOn= data.data.elementMissingOn; //要素缺失开关
                    $scope.vm.elementRecommendationOrder= data.data.elementRecommendationOrder;  //要素推荐顺序
                    $scope.vm.nonZeroStartOn= data.data.nonZeroStartOn; //非零点启动开关
                    $scope.vm.matchCompleteOn= data.data.matchCompleteOn; //完全匹配开关
                    $scope.vm.matchTagOn= data.data.matchTagOn; //标签匹配开关
                    $scope.$apply();
                }else{
                    layer.msg("目前还没有进行多轮会话设置");
                }
            },function(err){
                console.log(err);
                layer.msg("请求失败")
            })
        }

        //多轮交互设置对话框
        function saveMultiInteractive(){
            //查询多轮会话设置
            findMultiInteractive();
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/sceneManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/scene/saveMultiInteractiveSetting",{
                            "applicationId": $scope.vm.applicationId,
                            "categoryFuzzyOn": $scope.vm.categoryFuzzyOn,
                            "elementMissingOn": $scope.vm.elementMissingOn,
                            "elementRecommendationOrder": $scope.vm.elementRecommendationOrder,
                            "matchCompleteOn": $scope.vm.matchCompleteOn,
                            "matchTagOn": $scope.vm.matchTagOn,
                            "memoryMethod": $scope.vm.memoryMethod,
                            "nonZeroStartOn": $scope.vm.nonZeroStartOn,
                            "recommendedSimilarity": $scope.vm.recommendedSimilarity,
                            "settingId": $scope.vm.settingId,
                            "subjectMemoryRounds": $scope.vm.subjectMemoryRounds,
                            "subjectMissingOn": $scope.vm.subjectMissingOn,
                            "userId": $scope.vm.userId
                        },function(data){
                            if(data.status==200){
                                $scope.vm.settingId= data.data.settingId; //配置id
                                $scope.vm.categoryFuzzyOn= data.data.categoryFuzzyOn;  //类目模糊开关
                                $scope.vm.recommendedSimilarity= data.data.recommendedSimilarity; //推荐问相似度
                                $scope.vm.subjectMissingOn= data.data.subjectMissingOn; //主题缺失开关
                                $scope.vm.subjectMemoryRounds= data.data.subjectMemoryRounds; //主题记忆轮数
                                $scope.vm.memoryMethod= data.data.memoryMethod; //记忆方法
                                $scope.vm.elementMissingOn= data.data.elementMissingOn; //要素缺失开关
                                $scope.vm.elementRecommendationOrder= data.data.elementRecommendationOrder;  //要素推荐顺序
                                $scope.vm.nonZeroStartOn= data.data.nonZeroStartOn; //非零点启动开关
                                $scope.vm.matchCompleteOn= data.data.matchCompleteOn; //完全匹配开关
                                $scope.vm.matchTagOn= data.data.matchTagOn; //标签匹配开关
                                $scope.$apply();
                            }else{
                                layer.msg("目前还没有进行多轮会话设置");
                            }
                        },function(err){
                            console.log(err);
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }


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

        //开关
        function turnOn(targetValue,targetName){
            $scope.vm[targetName] = targetValue ? 0 : 1 ;
        }
    }
]);