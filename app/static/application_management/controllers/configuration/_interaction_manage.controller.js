/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  交互管理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('InteractionManageController', [
    '$scope', 'localStorageService' ,"ApplicationServer","$state" ,"ngDialog","$cookieStore",
    ($scope,localStorageService,ApplicationServer, $state,ngDialog,$cookieStore)=> {
        $scope.vm = {
            wordsInterviewMode: "",  //交互方式检索条件
            knowledgeTypeData: "", //知识类型列表
            exchangeModeData: "",  //交互方式列表
            queryKnowledgeType: queryKnowledgeType, //查询知识类型
            queryInterviewMode: listExchangeMode,  //查询交互方式

            multipleConversationSetup : multipleConversationSetup ,//多轮交互设置

            multipleConversation : {   // 多轮会话配置项
                settingId: "", //配置id
                categoryFuzzyOn: 1,  //类目模糊开关
                recommendedSimilarity: 0.5, //推荐问相似度
                subjectMissingOn: 1, //主题缺失开关
                subjectMemoryRounds: 3, //主题记忆轮数
                memoryMethod: 1, //记忆方法
                elementMissingOn: 1, //要素缺失开关
                elementRecommendationOrder: 1,  //要素推荐顺序
                nonZeroStartOn: 1, //非零点启动开关
                matchCompleteOn: 1, //完全匹配开关
                matchTagOn: 1  //标签匹配开关
            }
        };
        let roundSessionHtml = require("../../views/configuration/interaction/dialog_multiply_setup.html") ;
        //加载知识类型
        queryKnowledgeType();
        //加载交互方式
        listExchangeMode();
        //请求知识类型列表
        function queryKnowledgeType(keyword){
            ApplicationServer.queryKnowTypeList.save({
                "applicationId": APPLICATION_ID,
                "keyword": keyword
            },function(response){
                $scope.vm.knowledgeTypeData = response.data;
            },function(error){console.log(error);})
        }
        //请求交互方式列表
        function listExchangeMode(keyword){
            ApplicationServer.queryInterviewModeList.save({
                "applicationId": APPLICATION_ID,
                "keyword": keyword
            },function(data){
                $scope.vm.exchangeModeData = data.data;
            },function(error){console.log(error);}) ;
        }
        //多轮交互设置
        $scope.$parent.$parent.MASTER.openNgDialog($scope,roundSessionHtml,"600px",function(){
            // 参数设置
            var parameter = angular.copy($scope.vm.multipleConversation) ;
            parameter.userId = USER_ID ;
            parameter.applicationId = APPLICATION_ID ;
            ApplicationServer.storeMultipleConversation.save(parameter,function(response){
                if(response.status==200){
                    layer.msg("修改成功！") ;
                }else{
                    layer.msg("出现修改异常，请重新修改");
                }
            },function(error){console.log(error);})
        })
        function multipleConversationSetup(){
            ApplicationServer.searchMultipleConversation.save({
                "applicationId": APPLICATION_ID
            },function(response){
                if(response.status==200){
                    $scope.vm.multipleConversation = {
                        settingId: response.data.settingId, //配置id
                        categoryFuzzyOn: response.data.categoryFuzzyOn,  //类目模糊开关
                        recommendedSimilarity: response.data.recommendedSimilarity, //推荐问相似度
                        subjectMissingOn: response.data.subjectMissingOn, //主题缺失开关
                        subjectMemoryRounds: response.data.subjectMemoryRounds, //主题记忆轮数
                        memoryMethod: response.data.memoryMethod, //记忆方法
                        elementMissingOn: response.data.elementMissingOn, //要素缺失开关
                        elementRecommendationOrder: response.data.elementRecommendationOrder,  //要素推荐顺序
                        nonZeroStartOn: response.data.nonZeroStartOn, //非零点启动开关
                        matchCompleteOn: response.data.matchCompleteOn, //完全匹配开关
                        matchTagOn: response.data.matchTagOn  //标签匹配开关
                    } ;
                    $scope.$parent.$parent.MASTER.openNgDialog($scope,roundSessionHtml,"600px",function(){
                        // 参数设置
                        var parameter = angular.copy($scope.vm.multipleConversation) ;
                            parameter.userId = USER_ID ;
                            parameter.applicationId = APPLICATION_ID ;
                        ApplicationServer.storeMultipleConversation.save(parameter,function(response){
                            if(response.status==200){
                                layer.msg("修改成功！") ;
                            }else{
                                layer.msg("出现修改异常，请重新修改");
                            }
                        },function(error){console.log(error);})
                    })
                }else{
                    layer.msg("目前还没有进行多轮会话设置");
                }},function(error){console.log(error);}
            )
        }
        ////多轮交互设置对话框
        //function saveMultiInteractive(){
        //    //查询多轮会话设置
        //    findMultiInteractive();
        //    var dialog = ngDialog.openConfirm({
        //        template:"/static/application_manage/config/scene_manage/multiply_setup.html",
        //        width:"600px",
        //        scope: $scope,
        //        closeByDocument:false,
        //        closeByEscape: true,
        //        showClose : true,
        //        backdrop : 'static',
        //        preCloseCallback:function(e){    //关闭回掉
        //            if(e === 1){
        //                ApplicationServer.storeInterviewModeSetup.save({
        //                    "applicationId":APPLICATION_ID,
        //                    "categoryFuzzyOn": $scope.vm.categoryFuzzyOn,
        //                    "elementMissingOn": $scope.vm.elementMissingOn,
        //                    "elementRecommendationOrder": $scope.vm.elementRecommendationOrder,
        //                    "matchCompleteOn": $scope.vm.matchCompleteOn,
        //                    "matchTagOn": $scope.vm.matchTagOn,
        //                    "memoryMethod": $scope.vm.memoryMethod,
        //                    "nonZeroStartOn": $scope.vm.nonZeroStartOn,
        //                    "recommendedSimilarity": $scope.vm.recommendedSimilarity,
        //                    "settingId": $scope.vm.settingId,
        //                    "subjectMemoryRounds": $scope.vm.subjectMemoryRounds,
        //                    "subjectMissingOn": $scope.vm.subjectMissingOn,
        //                    "userId": USER_ID
        //                },function(data){
        //                    if(data.status==200){
        //                        $scope.vm.settingId= data.data.settingId; //配置id
        //                        $scope.vm.categoryFuzzyOn= data.data.categoryFuzzyOn;  //类目模糊开关
        //                        $scope.vm.recommendedSimilarity= data.data.recommendedSimilarity; //推荐问相似度
        //                        $scope.vm.subjectMissingOn= data.data.subjectMissingOn; //主题缺失开关
        //                        $scope.vm.subjectMemoryRounds= data.data.subjectMemoryRounds; //主题记忆轮数
        //                        $scope.vm.memoryMethod= data.data.memoryMethod; //记忆方法
        //                        $scope.vm.elementMissingOn= data.data.elementMissingOn; //要素缺失开关
        //                        $scope.vm.elementRecommendationOrder= data.data.elementRecommendationOrder;  //要素推荐顺序
        //                        $scope.vm.nonZeroStartOn= data.data.nonZeroStartOn; //非零点启动开关
        //                        $scope.vm.matchCompleteOn= data.data.matchCompleteOn; //完全匹配开关
        //                        $scope.vm.matchTagOn= data.data.matchTagOn; //标签匹配开关
        //                        $scope.$apply();
        //                    }else{
        //                        layer.msg("目前还没有进行多轮会话设置");
        //                    }
        //                },function(error){console.log(error);})
        //
        //            }
        //        }
        //    });
        //}
        //function updateKnowledgeType(item){
        //    httpRequestPost("/api/application/scene/updateKnowledgeTypeByApplicationId",{
        //        "applicationId": APPLICATION_ID,
        //        "statusId": item.statusId,
        //        "knowledgeTypeId": item.knowledgeTypeId
        //    },function(data){
        //        //$state.reload();
        //        layer.msg("更新知识类型成功！");
        //        listExchangeMode();
        //        queryKnowledgeType();
        //    },function(){
        //        layer.msg("请求失败")
        //    })
        //}
        //
        //function updateExchangeMode(item){
        //    httpRequestPost("/api/application/scene/updateExchangeModeByApplicationId",{
        //        "applicationId": APPLICATION_ID,
        //        "statusId": item.statusId,
        //        "exchangeModeId": item.exchangeModeId
        //    },function(data){
        //        //$state.reload();
        //        layer.msg("更新交互方式成功！");
        //        listExchangeMode();
        //        queryKnowledgeType();
        //        $("#exchangeMode").click();
        //    },function(){
        //        layer.msg("请求失败")
        //    })
        //}

        //开关
        //function turnOn(targetValue,targetName){
        //    $scope.vm[targetName] = targetValue ? 0 : 1 ;
        //}
        ////nnf-7.3-add
        //function turnOn2(targetValue,targetName){
        //    $scope.vm[targetName] = targetValue ? 0 : 1 ;
        //    //添加判断，如果为关，后面两项不可用
        //    if($scope.vm[targetName]==0){
        //        $scope.vm.subjectMemoryRounds='';
        //        $scope.vm.memoryMethod='';
        //    }else{
        //        $scope.vm.subjectMemoryRounds=3;
        //        $scope.vm.memoryMethod=1;
        //    }
        //
        //}
    }
])};