///**
// * Created by Administrator on 2016/7/8.
// */
//knowledge_static_web
//    .factory('TipService', ['$timeout', function($timeout) {
//        var tipService = {
//            message : null,
//            type : null,
//            setMessage : function(msg,type){
//                this.message = msg;
//                this.type = type;
//
//                //提示框显示最多3秒消失
//                var _self = this;
//                $timeout(function(){
//                    //console.log("after 3 s doing")
//                    _self.clear();
//                },3000);
//            },
//            clear : function(){
//                this.message = null;
//                this.type = null;
//            }
//        };
//
//        return tipService;
//    }]);