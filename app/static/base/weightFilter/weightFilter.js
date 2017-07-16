/**
* Created by 41212 on 2017/3/31.
*/
'use strict';

angular.module('knowledge_static_web').filter('weightFilter', function () {
    return function (value) {
        switch (value){
            case 35 : return "极不重要";
                break;
            case 34 : return "不重要";
                break;
            case 33 : return "一般";
                break;
            case 32 : return "重要";
                break;
            case 31 : return "极重要";
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
})
.filter('channelFilter', function () {
    return function (value) {
        switch (value){
            case '130' : return "微信";
                break;
            case '131' : return "web";
                break;
            case '132' : return "app";
                break;
        }
    };
});

//angular.module('knowledge_static_web').filter('strReplace', function () {
//    return function (value) {
//        return value.replace(/，/g,'；') ;
//    };
//});