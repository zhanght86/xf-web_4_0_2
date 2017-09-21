/**
 * @Author : MILES .
 * @Create : 2017/9/20.
 * @Module : bot
 */
angular.module("knowledgeManagementModule").directive("botClassTree",
    ["KnowledgeService","$templateCache","$timeout","$sce",
        function(KnowledgeService,$templateCache,$timeout,$sce){
        return {
            restrict : "A" ,
            template : function(scope,attr){
                return $templateCache("bot-class") ;
            } ,
            link : function(scope,attr,el,ctr){
                scope.dirBot = {
                    botSelectAdd : botSelectAdd
                } ;
                function getBotFullPath(id){
                    httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                        categoryId: id
                    },function(data){
                        if(data.status = 10000){
                            var allBot = angular.copy(scope.vm.creatSelectBot.concat(scope.vm.botClassfy)) ,
                                botResult = scope.MASTER.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                            scope.$apply(function(){
                                console.log(data) ;
                                scope.vm.knowledgeBotVal = data.categoryFullName;
                                if(botResult != false){
                                    //scope.vm.knowledgeBotVal = data.categoryFullName.split("/");
                                    scope.vm.botFullPath= botResult;
                                }
                            });
                        }
                    },function(error){console.log(error)});
                }
                scope.MASTER.botTreeOperate(scope,"/api/ms/modeling/category/listbycategorypid","/api/ms/modeling/category/listbycategorypid",getBotFullPath
                    //"/api/ms/modeling/category/searchbycategoryname"
                ) ;
                //BOT搜索自动补全
                scope.MASTER.searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
                    scope.$apply(function(){
                        var allBot = angular.copy(scope.vm.botClassfy.concat(scope.vm.creatSelectBot)) ,
                            botResult = scope.MASTER.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                        scope.vm.knowledgeBotVal = suggestion.value;
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
                        scope.vm.frameCategoryId = scope.vm.botFullPath.classificationId;
                        scope.vm.botFullPath = "";
                        scope.vm.knowledgeBotVal = "";
                    }
                };
            }
        }
}]);