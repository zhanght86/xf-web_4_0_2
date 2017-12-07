/**
* Created by 41212 on 2017/3/31.
*/
'use strict';

angular.module('knowledge_static_web').filter('frameTypeFilter', function () {
    return function (value) {
        switch (value){
            case 10011 : return "FAQ框架";
                break;
            case 10012 : return "概念扩展框架";
                break;
            case 10013 : return "要素框架";
                break;
        }
    };
});

