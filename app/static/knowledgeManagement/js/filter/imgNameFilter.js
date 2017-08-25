/**
 * @Author : MILES .
 * @Create : 2017/8/25.
 * @Module :
 */
knowledge_static_web.filter("imgNameFiler",[function(){
    return function(val,fiterVal){
        val.replace(/([^\s]+)\.(jpg|gif|png|bmp)/i,$1) ;
        return val ;
    }
}])