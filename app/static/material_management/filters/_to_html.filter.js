/**
 * Created by Administrator on 2017/7/4.
 * For  浮点数保留
 */
module.exports=module=>{
    module
    .filter('toHtml',["$sce",function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }] );



}