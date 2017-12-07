/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 数字标号转化
 */
module.exports = module =>{
    module
    .filter('numberToWord', function () {
        return function (number) {
            var array = ["一", "二", "三", "四","五", "六", "七", "八", "九", "十"];
            var result = null ;
            if (number != '') {
                angular.forEach(array,function(item,index){
                    if(index==(number-1)){
                        result = item;
                    }
                })
            }
            return result
        }
    })
};