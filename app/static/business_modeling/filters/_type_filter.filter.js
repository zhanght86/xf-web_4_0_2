/**
 * Created by Administrator on 2017/4/10.
 */
 'use strict';

module.exports = module =>{
module.filter('typeFilter', function () {
    return function (val) {
        var result;
        if(val == 100){
            result = "FAQ型聊天知识"
        }else if(val == 101){
             result = "概念扩展知识"
        }
        else{
            result = "要素知识"
        }
        return result
    };
})};