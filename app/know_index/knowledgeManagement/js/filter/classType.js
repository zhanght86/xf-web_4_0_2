/**
 * Created by 41212 on 2017/4/28.
 */
//SensitiveConcept(40, "���и���"),
//    StopConcept(41, "ͣ�ø���"),
//    ErrorCorrectionConcept(42, "�������"),
//    ThesaurusConcept(43, "ͬ�����"),
//    CollectiveConcept(44, "���ϸ���"),
//    BusinessConcept(45, "ҵ�����"),
//    ForceSegmentConcept(46, "ǿ�Ʒִʸ���"),
//    SemanticExpressionConcept(47, "������ʽ����"),
angular.module('knowledge_static_web').filter('classType', function () {
    return function (value) {
        switch(value){
            case 40 :
                return "���и���"
            break;
            case 41 :
                return "ͣ�ø���"
            break;
            case 42 :
                return "�������"
            break;
            case 43 :
                return "ͬ�����"
            break;
            case 44 :
                return "���ϸ���"
            break;
            case 45 :
                return "ҵ�����"
            break;
            case 46 :
                return "ǿ�Ʒִʸ���"
            break ;
            case 47 :
                return "������ʽ����"
            break
        }

    };
});