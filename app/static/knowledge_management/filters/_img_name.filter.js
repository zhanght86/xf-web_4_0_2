/**
 * @Author : MILES .
 * @Create : 2017/8/25.
 * @Module : 过滤图片名称
 */
module.exports = module =>{
    module
    .filter("imgNameFiler",[function(){
        return function(val,fiterVal){
            return val.replace(/(\S+)\.(png|jpg|bmp|gif)/g,"$1") ;
        }
    }])
}