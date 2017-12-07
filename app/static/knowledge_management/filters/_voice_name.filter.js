/**
 * @Author : MILES .
 * @Create : 2017/8/25.
 * @Module : 过滤声音文件名称
 */
module.exports = module =>{
    module
   .filter("voiceNameFilter",[function(){
        return function(val){
            return val.replace(/(\S+)(\.\S+)$/g,"$1")
        }
    }])
};