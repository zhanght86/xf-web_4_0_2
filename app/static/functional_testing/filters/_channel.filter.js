/**
 * Created by Administrator on 2018/1.8
 * For  渠道
 */
module.exports=module=>{
    module
    .filter('channelFilter', function () {
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
    })
    .filter('channelFilterMulti', function () {
        return function (value) {
            var channel = "";
            if(value.indexOf('130')>=0){
                channel+="微信,";
            }
            if(value.indexOf('131')>=0){
                channel+="web,";
            }
            if(value.indexOf('132')>=0){
                channel+="app,";
            }
            if(channel!=""){
                if(channel.substring(channel.length-1,channel.length)==","){
                    channel = channel.substring(0,channel.length-1);
                }
            }
            return channel;
        };
    })
}