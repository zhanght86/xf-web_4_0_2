/**
 * Created by 41212 on 2017/7/21.
 */

module.exports = module=>{
    module
    .filter("strToJson",function(){
        return function(val){
            var result;
            if(val.indexOf('{')!=-1){
                result = JSON.parse(val);
            }else{
                result=val;
            }
             return result;
        }
    })

};


