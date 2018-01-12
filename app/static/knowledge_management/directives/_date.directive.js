/**
 * @Author : MILES .
 * @Create : 2017/9/21.
 * @Module :  时间
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .directive("selectStartEndTime",
        ["$templateCache","KnowledgeService",function($templateCache,KnowledgeService){
            return {
                restrict : "A" ,
                template : function(scope,attr){
                    console.log(attr.selectStartEndTime)
                    if(attr.selectStartEndTime=="notDialog"){
                        return $templateCache.get("select-start-end-time-not-dialog")
                    }else{
                        return $templateCache.get("select-start-end-time")
                    }
                },
                link : function(scope,attr,el,ctr){
                }
            }
        }])
}
