/**
 * @Author : MILES .
 * @Create : 2017/9/20.
 * @Module : bot
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .directive("botClassTree",
    ["KnowledgeService","$templateCache","$timeout","$sce",
        function(KnowledgeService,$templateCache,$timeout,$sce){
        return {
            restrict : "A" ,
            template : function(scope,attr){
                if(attr.botClassTree=="dialog"){
                    return $templateCache.get("bot-class")
                }else{
                    return $templateCache.get("bot-class-not-dialog")
                }
            } ,
            link : function(scope,attr,el,ctr){
                scope.dirBot = {
                    botSelectAdd : botSelectAdd ,
                    knowledgeBotVal : "",  //bot 内容
                } ;
                function getBotFullPath(id){
                    KnowledgeService.getBotFullPath.get({
                        id: id
                    },function(response){
                        if(response.status = 200){
                            var allBot = angular.copy(scope.vm.creatSelectBot) ,
                                botResult = scope.$parent.knowCtr.isBotRepeat(id,response.data.split("/"),"",allBot) ;
                                scope.dirBot.knowledgeBotVal = response.data;
                                if(botResult != false){
                                    scope.vm.botFullPath = botResult;
                                }
                        }
                    },function(error){console.log(error)})
                }
                scope.$parent.knowCtr.botTreeOperate(scope,getBotFullPath) ;
                //BOT搜索自动补全
                scope.$parent.knowCtr.searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
                    scope.$apply(function(){
                        var allBot = angular.copy(scope.vm.creatSelectBot) ,
                            botResult = scope.$parent.knowCtr.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                        scope.dirBot.knowledgeBotVal = suggestion.value;
                        if(botResult != false){
                            scope.vm.botFullPath= botResult;
                        }
                    })
                });
                //点击bot分类的 加号
                function botSelectAdd(){
                    if(scope.vm.botFullPath){
                        console.log(scope.vm.botFullPath) ;
                        scope.vm.creatSelectBot.push(scope.vm.botFullPath);
                        scope.vm.botFullPath = "";
                        scope.dirBot.knowledgeBotVal = "";
                    }
                }
            }
        }
}])};