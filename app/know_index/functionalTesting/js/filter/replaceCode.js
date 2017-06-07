/**
 * Created by miles on 2017/5/27.
 *
 * webuploader  ====》》  指令
 */
angular.module('knowledge_static_web').filter('replaceCode',function () {
    return function(val){
        // var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        // var rs = "";
        // for (var i = 0; i < s.length; i++) {
        //     rs = rs+s.substr(i, 1).replace(pattern, '');
        // }
        // return rs;
        // if (!val) val = '';
        // return val.replace(/[]/g, '');

        val = val.replace(/^[|]$/g,'');
        return val;

        // val = val.replace(/[|]/g,function(val){
        //     var tmp = '';
        //     for(var i=0;i<val.length;i++){
        //         tmp+='';
        //     }
        //     return tmp;
        // });
        // return val;

        

    }


});

