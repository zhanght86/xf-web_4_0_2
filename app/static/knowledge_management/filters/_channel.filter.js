/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 过滤渠道名称
 */
module.exports = module =>{
    module
    .filter('channel', function () {
        return function (value,params) {
            var result;
            angular.forEach(params,function(item){
                if(value == item.channelCode){
                    result = item.channelName
                }
            });
            return result
        };
    }
)};
