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
            exchangeModeData          : "",                        //交互方式列表
            multipleConversationSetup : multipleConversationSetup ,//多轮交互设置
        };
        $scope.multipleConversation = {
            id                            : "",  //配置id
            categoryFuzzyOn               : 1,   //类目模糊开关
            recommendedSimilarity         : 0.5, //推荐问相似度
            topicMissingOn                : 1,   //主题缺失开关
            topicMemoryRounds             : 3,   //主题记忆轮数
            elementIntelligentRecommendOn : 1,   //要素缺失开关
            nonZeroStartOn                : 1,   //非零点启动开关
            matchTagOn                    : 1    //标签匹配开关
        };
        let roundSessionHtml = require("../../views/configuration/interaction/dialog_multiply_setup.html") ;
        // 循环参数赋值
        $scope.vm.exchangeModeData = [
            {
                "name" : "被动文本型",
                "description" : "用户先提问，机器人回答文本类型的知识"
            },
            {
                "name" : "被动多轮文本型",
                "description" : "用户先提问，机器人和用户进行多次交互"
            }
        ] ;
        function multipleConversationSetup(){
            ApplicationServer.getInteractiveParameter.get({
                "id" : APPLICATION_ID
            },function(res){
                if(res.status == 200 ){
                    $scope.multipleConversation = {
                        id                            : res.data.id,                            //配置id
                        categoryFuzzyOn               : res.data.categoryFuzzyOn,               //类目模糊开关
                        recommendedSimilarity         : res.data.recommendedSimilarity,          //推荐问相似度
                        topicMissingOn                : res.data.topicMissingOn,                //主题缺失开关
                        topicMemoryRounds             : res.data.topicMemoryRounds,             //主题记忆轮数
                        elementIntelligentRecommendOn : res.data.elementIntelligentRecommendOn, //要素缺失开关
                        nonZeroStartOn                : res.data.nonZeroStartOn,                //非零点启动开关
                        matchTagOn                    : res.data.matchTagOn                     //标签匹配开关
                    } ;
                    $scope.$parent.$parent.MASTER.openNgDialog($scope,roundSessionHtml,"600px",function(){
                        ApplicationServer.updateInteractiveParameter.save($scope.multipleConversation,function(response){
                            if(response.status==200){
                                layer.msg("修改成功！") ;
                            }else{
                                layer.msg("出现修改异常，请重新修改");
                            }
                        },function(error){console.log(error);})
                    }) ;
                }
            });
        }
}])};