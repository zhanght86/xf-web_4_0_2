/**
* Created by 41212 on 2017/3/31.
*/
'use strict';

angular.module('knowledge_static_web').filter('strReplace', ["$sce",function ($sce) {
    return function (value) {
      //return value.replace(/；/g,'，') ;
       return value.split("；");
        //var result = val.split(",");
        //function repeat(arr){
        //    var html;
        //     angular.forEach(arr,function(item,index){
        //         if(index%2==1){
        //             html+='<span class="c_blue">'+item+'</span>,'
        //         }else{
        //             //console.log(item);
        //             html='<span class="c-error">'+item+'</span\>'
        //         }
        //     });
        //    console.log(html);
        //    //return html
        //     return $sce.trustAsHtml(html)
        //}
        //return repeat(result);
    };
}]);
angular.module('knowledge_static_web').filter('strReplace 2', function () {
    return function (value) {
        return value.split(',') ;
    };
});