/**
 * @Author : MILES .
 * @Create : 2018/1/16.
 * @Module :
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
        .directive("frame",
            ["KnowledgeService","$templateCache","$timeout","$sce",
            function(KnowledgeService,$templateCache,$timeout,$sce){
                return {
                    restrict : "A" ,
                    template : require("../views/public_html/frame.html"),
                    link : function(scope,el,attr,ctr){
                        scope.dirFrameBot = {
                            "type" : parseInt(attr["frame"]),
                            "frames" : [],
                            knowledgeBotVal: {
                                classifyId: "",
                                value: ""
                            },
                            selectFrame : selectFrame,
                             key:"",
                            addExt :addExt
                        };
                        console.log(attr["frame"]);
                        console.log(scope.$parent.parameter.classifyList.map(item=>item.classifyId));
                        $timeout(function () {
                            $(el).find(".frame_key").off().on("input",function () {
                                queryFrame($(this).val())
                            })
                        }) ;
                        function queryFrame(val){
                            KnowledgeService.queryFrame.save({
                                "title":val,
                                "type" : scope.dirFrameBot.type,
                                "classifyIds" : scope.parameter.classifyList.map(item=>item.classifyId),
                                "applicationId" : APPLICATION_ID
                            },function (response) {
                                if(response.data.total){
                                    scope.dirFrameBot.frames = response.data.data;
                                }
                            })
                        }
                        function selectFrame(item) {
                            scope.dirFrameBot.key = item ;
                            $timeout(function () {
                                scope.dirFrameBot.frames = [] ;
                            })
                        }
                        function addExt(close) {
                            let item = scope.dirFrameBot.key ;
                            if(item.id && item.title){
                                let ext = angular.copy(item.frameContentList);
                                if(scope.dirFrameBot.type==100 || scope.dirFrameBot.type==101 || scope.dirFrameBot.type==102){
                                    angular.forEach(item.frameContentList,function (extItem,cur) {
                                        if(scope.$parent.parameter.extensionQuestionList.every(val=>val.title!=extItem.content) && extItem.content){
                                            scope.$parent.parameter.extensionQuestionList.push({
                                                "title":extItem.content
                                            })
                                        }
                                    });

                                }
                                close(1) ;
                            }else{
                                layer.msg("请选择框架")
                            }
                        }
                    }
                }
        }])
};