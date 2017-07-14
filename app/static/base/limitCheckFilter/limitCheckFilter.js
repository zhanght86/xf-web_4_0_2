/**
* Created by 41212 on 2017/3/31.
*/
'use strict';

angular.module('knowledge_static_web').filter('limitCheckFilter', function () {
    return function (value) {
        return value.substring(0,6)+"...";
    };
});

