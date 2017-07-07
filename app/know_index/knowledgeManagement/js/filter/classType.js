/**
 * Created by 41212 on 2017/4/28.
 */
//    SensitiveConcept(40, "敏感概念"),
//    StopConcept(41, "停用概念"),
//    ErrorCorrectionConcept(42, "纠错概念"),
//    ThesaurusConcept(43, "同义概念"),
//    CollectiveConcept(44, "集合概念"),
//    BusinessConcept(45, "业务概念"),
//    ForceSegmentConcept(46, "强制分词概念"),
//    SemanticExpressionConcept(47, "语义表达式概念"),
angular.module('knowledge_static_web').filter('classType', function () {
    return function (value) {
        switch(value){
            case 40 :
                return "敏感概念"
                break;
            case 41 :
                return "停用概念"
                break;
            case 42 :
                return "纠错概念"
                break;
            case 43 :
                return "同义概念"
                break;
            case 44 :
                return "集合概念"
                break;
            case 45 :
                return "业务概念"
                break;
            case 46 :
                return "强制分词概念"
                break ;
            case 47 :
                return "语义表达式概念"
                break
        }

    };
});