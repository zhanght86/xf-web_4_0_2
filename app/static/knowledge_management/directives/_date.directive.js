/**
 * @Author : MILES .
 * @Create : 2017/9/21.
 * @Module :  时间
 */
angular.module("knowledgeManagementModule").directive("selectStartEndTime",
    ["$templateCache","KnowledgeService",function($templateCache,KnowledgeService){
        return {
            restrict : "A" ,
            template : function(scope,attr){
                if(attr.selectStartEndTime=="dialog"){
                    return $templateCache.get("select-start-end-time")
                }else{
                    return $templateCache.get("select-start-end-time-not-dialog")
                }
            },
            link : function(scope,attr,el,ctr){


            }
        }
}]);