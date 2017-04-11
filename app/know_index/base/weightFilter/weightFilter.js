/**
* Created by 41212 on 2017/3/31.
*/
'use strict';

angular.module('knowledge_static_web').filter('weightFilter', function () {
    return function (value) {
        switch (value){
            case 1 : return "极不重要";
                break;
            case 2 : return "不重要";
                break;
            case 3 : return "一般";
                break;
            case 4 : return "重要";
                break;
            case 5 : return "极重要";
                break;
        }
    };
})
.filter('extensionWeightFilter', function () {
    return function (value) {
        switch (value){
            case 1 : return "普通";
                break;
            case 0 : return "否定";
                break;
        }
    };
});

//angular.module('knowledge_static_web').filter('strReplace', function () {
//    return function (value) {
//        return value.replace(/，/g,'；') ;
//    };
//});