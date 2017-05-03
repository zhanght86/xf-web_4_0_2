/**
 * Created by 41212 on 2017/4/28.
 */

angular.module('knowledge_static_web').filter('numberToWord', function () {
    return function (number) {
        var array = ["一", "二", "三", "四","五", "六", "七", "八", "九", "十"];
        var result = null ;
        if (number != '') {
            angular.forEach(array,function(item,index){
                if(index==(number-1)){
                    result = item;
                }
            })
        }
        return result
    }

});