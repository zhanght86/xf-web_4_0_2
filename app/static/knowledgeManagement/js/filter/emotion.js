/**
 * Created by miles on 2017/7/15.
 * @For 表情添加
 */
angular.module('knowledge_static_web').filter('emotion', function () {
    return function (str) {
            str = str.replace(/\</g,'&lt;');

            str = str.replace(/\>/g,'&gt;');

            str = str.replace(/\n/g,'<br/>');

            str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/libs/qqFace/arclist/$1.gif" border="0" />');

            return str;
    }
});