/**
 * Created by 41212 on 2017/7/21.
 */

module.exports = module=>{
    module
    .filter("contentShow",function(){
        return function(text){
            var i;
            i=text.indexOf(",");
            if(i!=-1){
                //return  eval('<a href="javascript:;" class="c_blue">'+text.substring(0,i)+'</a>');
                return  text.substring(0,i)+'id';
            }else{
                return  text;
            }

        }
    })

};


