/**
 * @Author : MILES .
 * @Create : 2017/6/13.
 * @Module : 长度超过要求 显示省略号
 * @Use    : 应用管理  1 、显示应用标题以及描述
 */
'use strict';

angular.module('knowledge_static_web').filter('limitCheckFilter', function () {
    return function (value,len) {
        if(value.length>len){
            return value.substring(0,len-2)+"...";
        }else{
            return value
        }

    };
});

