/**
 * Created by miles on 2017/5/27.
 *
 * webuploader  ====》》  指令
 */
module.exports =module=>{
    module
    .filter('replaceCode',function () {
        return function(val){
            val =val.replace(/[\[\]]/g,"");
            return val;
        }
    })
    .filter('replaceCodeCut',function () {
        return function(val){
            val = val.replace(/[\[\]]/g,"");
            if(val.length>20){
                val = (val.substring(0,20)+"......")
            }
            return val;
        }
    });

}

