/**
 * Created by Administrator on 2018/1.8
 * For  渠道
 */
module.exports=module=>{
    module
    .filter('channelFilter', function () {
        return function (value) {
            switch (value){
                case '131' : return "微信";
                    break;
                case '132' : return "web";
                    break;
                case '133' : return "app";
                    break;
            }
        };
    })
    .filter('channelFilter2', function () {
        return function (value) {
            switch (value){
                case 131 : return "微信";
                    break;
                case 132 : return "web";
                    break;
                case 133 : return "app";
                    break;
            }
        };
    });

}