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
})
.filter('channelFilterMulti', function () {
    return function (value) {
        var channel = "";
        if(value.indexOf('130')>=0){
            channel+="微信,";
        }
        if(value.indexOf('131')>=0){
            channel+="web,";
        }
        if(value.indexOf('132')>=0){
            channel+="app,";
        }
        if(channel!=""){
            if(channel.substring(channel.length-1,channel.length)==","){
                channel = channel.substring(0,channel.length-1);
            }
        }
        return channel;
    };
})
.filter('sentimentTypeFilter', function () {
    return function (value) {
        switch (value){
            case 490 : return "乐";
                break;
            case 491 : return "好";
                break;
            case 492 : return "怒";
                break;
            case 493 : return "哀";
                break;
            case 494 : return "惧";
                break;
            case 495 : return "恶";
                break;
            case 496 : return "惊";
                break;
        }
    };
});

//angular.module('knowledge_static_web').filter('strReplace', function () {
//    return function (value) {
//        return value.replace(/，/g,'；') ;
//    };
//});