/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 表情 字符串 转化
 */
module.exports = module =>{
    module
    .filter('emotion', function () {
        return function (str) {
                //str = str.replace(/\</g,'&lt;');
                //
                //str = str.replace(/\>/g,'&gt;');

                //str = str.replace(/\n/g,'<br/>');

                str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/libs/qqFace/arclist/$1.gif" border="0" />');

                return str;
        }
    })
    .filter('faceToString', function () {
        return function (face) {
            var regex = new RegExp('<img src="/libs/qqFace/arclist/([0-9]*).gif" border="0">', "g");
            face = face.replace(regex, "[em_$1]");
            //console.log(face)
            return face;
        }
    })
    .filter('toHtml',["$sce",function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
};