/**
 * Created by Administrator on 2017/7/4.
 * For  浮点数保留
 */
angular.module('knowledge_static_web').filter('floatFilter',function () {
    return function(val , length){
         var length = length?length+1:3 ;
         var val = new String(val) ;
         var index = val.indexOf(".") ;
        var result ;
        if(index!=-1){
            result = Number(val.substring(0,index+length))
        }else{
            result = Number("val")
        }
        return result ;
    }
}) ;