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
                    knowledgeBotVal : {
                        classifyId : "" ,
                        value : ""
                    },
                } ;
                function getBotFullPath(classifyId){
                    KnowledgeService.getBotFullPath.get({
                        id: classifyId
                    },function(response){
                        if(response.status = 200){
                            let botResult = scope.$parent.knowCtr.isBotRepeat(classifyId,response.data,scope.parameter.classifyList) ;

                                if(!botResult){
                                    scope.dirBot.knowledgeBotVal = {"value":"","classifyId":""}
                                }else{
                                    scope.dirBot.knowledgeBotVal = {
                                        classifyId : classifyId ,
                                        value : response.data
                                    };
                                }
                        }
                    },function(error){console.log(error)})
                }
                scope.$parent.knowCtr.botTreeOperate(scope,getBotFullPath) ;
                //BOT搜索自动补全
                scope.$parent.knowCtr.searchBotAutoTag(".botTagAuto",API_MS+"/classify/get/path",function(suggestion){
                    let botResult = scope.$parent.knowCtr.isBotRepeat(suggestion.classifyId,suggestion.value,scope.parameter.classifyList) ;
                    scope.dirBot.knowledgeBotVal = botResult || {"value":"","classifyId":""};
                });
                //点击bot分类的 加号
                function botSelectAdd(){
                    console.log(1)
                    if(scope.dirBot.knowledgeBotVal.value && scope.dirBot.knowledgeBotVal.classifyId){
                        scope.parameter.classifyList.push(scope.dirBot.knowledgeBotVal);
                        scope.dirBot.knowledgeBotVal = "";
                    }
                }
            }
        }
}])};