/**
 * Created by 41212 on 2017/4/6.
 */
angular.module('knowledge_static_web').filter('faqWeight', function () {
    return function (val) {
        var result;
        if(val == 60){
            result = "普通"
        }else{
            result = "否定"
        }
        return result
    };
});