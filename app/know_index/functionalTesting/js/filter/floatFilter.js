/**
 * Created by Administrator on 2017/7/4.
 * For  浮点数保留
 */
angular.module('knowledge_static_web').filter('floatFilter',function () {
    return function(val){
            var regu = "^([0-9]*[.0-9])$"; // 小数测试
            var re = new RegExp(regu);
            if (val.test(re) != -1){
                console.log(val.search(re))
                //return val.substring(0,)
            }else{
                return true
            }
    }
})