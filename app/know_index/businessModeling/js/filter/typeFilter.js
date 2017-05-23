/**
 * Created by Administrator on 2017/4/10.
 */
angular.module('knowledge_static_web').filter('typeFilter', function () {
    return function (val) {
        var result;
        if(val == 100){
            result = "FAQ型聊天知识"
        }else{
            result = "概念型聊天知识"
        }
        return result
    };
});