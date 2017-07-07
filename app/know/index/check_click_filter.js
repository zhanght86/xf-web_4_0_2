/**
 * Created by Administrator on 2016/6/6.
 * 过滤器 用来过滤头按钮的显示状态， 根据浏览器的路径判断当前该加亮哪一个按钮
 */
'use strict';

angular.
module('know').
filter('checkclick',['$location', function($location) {
    return function(item) {
            item.classtype = $location.absUrl().indexOf(item.url.split('.')[1]) > 0 ? "cur_li1" : "";
            return item.classtype;
    };
}]);
