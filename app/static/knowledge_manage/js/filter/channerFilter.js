/**
 * Created by 41212 on 2017/4/19.
 */
angular.module('knowledge_static_web').filter('channel', function () {
    return function (value,params) {
        var result;
        angular.forEach(params,function(item){
            if(value == item.channelCode){
                result = item.channelName
            }
        });
        return result
    };
});
angular.module('knowledge_static_web').filter('dimension', function () {
    return function (value,params) {
        var result;
        angular.forEach(params,function(item){
            if(value == item.dimensionId){
                result = item.dimensionName
            }
        });
        return result
    };
});